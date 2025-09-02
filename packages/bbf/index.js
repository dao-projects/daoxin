/**
 * BFF (Backend for Frontend) 数据转换层
 * 专门用于字段映射、自定义取值、格式转换等BFF功能
 * 
 * @module BFFDataAdapter
 * @version 1.0.0
 */

// 类型定义
/**
 * @typedef {Object} FieldMapping
 * @property {string} [source] - 源字段名
 * @property {string} [target] - 目标字段名
 * @property {Function} [transform] - 转换函数
 * @property {Function} [validate] - 验证函数
 * @property {*} [default] - 默认值
 * @property {boolean} [required] - 是否必需
 */

/**
 * @typedef {Object} SchemaConfig
 * @property {Object.<string, FieldMapping>} fields - 字段映射配置
 * @property {Function} [preTransform] - 转换前处理函数
 * @property {Function} [postTransform] - 转换后处理函数
 */

/**
 * @typedef {Object} TransformContext
 * @property {string} operation - 操作类型 (read/write)
 * @property {string} direction - 转换方向 (api->client/client->api)
 * @property {Object} metadata - 元数据
 */

/**
 * BFF数据转换器
 * 提供字段映射、自定义取值、格式转换等BFF核心功能
 */
class BFFDataAdapter {
  /**
   * 创建BFF数据转换器
   */
  constructor() {
    this.schemas = new Map();
    this.transformers = new Map();
    this.validators = new Map();
  }

  /**
   * 注册数据模式
   * @param {string} name - 模式名称
   * @param {SchemaConfig} schema - 模式配置
   */
  registerSchema(name, schema) {
    this.schemas.set(name, schema);
  }

  /**
   * 注册自定义转换器
   * @param {string} name - 转换器名称
   * @param {Function} transformer - 转换函数
   */
  registerTransformer(name, transformer) {
    this.transformers.set(name, transformer);
  }

  /**
   * 注册自定义验证器
   * @param {string} name - 验证器名称
   * @param {Function} validator - 验证函数
   */
  registerValidator(name, validator) {
    this.validators.set(name, validator);
  }

  /**
   * 应用字段映射转换
   * @param {Object} data - 原始数据
   * @param {SchemaConfig} schema - 模式配置
   * @param {TransformContext} context - 转换上下文
   * @returns {Object} 转换后的数据
   */
  applyFieldMapping(data, schema, context) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    // 预处理
    if (schema.preTransform) {
      data = schema.preTransform(data, context);
    }

    const result = {};

    // 处理每个字段映射
    for (const [targetField, mapping] of Object.entries(schema.fields)) {
      const {
        source,
        transform,
        validate,
        default: defaultValue,
        required = false
      } = mapping;

      // 获取源值
      let value = this.getFieldValue(data, source || targetField);

      // 验证必需字段
      if (required && (value === undefined || value === null)) {
        if (defaultValue !== undefined) {
          value = defaultValue;
        } else {
          throw new BFFTransformError(`Required field '${targetField}' is missing`, 'FIELD_MISSING');
        }
      }

      // 应用验证
      if (validate && value !== undefined && value !== null) {
        if (typeof validate === 'string') {
          const validator = this.validators.get(validate);
          if (validator && !validator(value)) {
            throw new BFFTransformError(`Validation failed for field '${targetField}'`, 'VALIDATION_FAILED');
          }
        } else if (typeof validate === 'function') {
          if (!validate(value)) {
            throw new BFFTransformError(`Validation failed for field '${targetField}'`, 'VALIDATION_FAILED');
          }
        }
      }

      // 应用转换
      if (transform && value !== undefined && value !== null) {
        if (typeof transform === 'string') {
          const transformer = this.transformers.get(transform);
          if (transformer) {
            value = transformer(value, context);
          }
        } else if (typeof transform === 'function') {
          value = transform(value, context);
        }
      }

      // 设置默认值
      if (value === undefined && defaultValue !== undefined) {
        value = defaultValue;
      }

      // 设置目标字段
      this.setFieldValue(result, targetField, value);
    }

    // 后处理
    if (schema.postTransform) {
      return schema.postTransform(result, context);
    }

    return result;
  }

  /**
   * 获取字段值（支持嵌套路径）
   * @param {Object} obj - 对象
   * @param {string} path - 字段路径
   * @returns {*} 字段值
   */
  getFieldValue(obj, path) {
    if (!obj || typeof obj !== 'object') return undefined;
    
    // 处理嵌套路径 (如: 'user.profile.name')
    if (path.includes('.')) {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
      }, obj);
    }
    
    return obj[path];
  }

  /**
   * 设置字段值（支持嵌套路径）
   * @param {Object} obj - 对象
   * @param {string} path - 字段路径
   * @param {*} value - 值
   */
  setFieldValue(obj, path, value) {
    if (!obj || typeof obj !== 'object') return;
    
    // 处理嵌套路径
    if (path.includes('.')) {
      const parts = path.split('.');
      const lastKey = parts.pop();
      const target = parts.reduce((current, key) => {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        return current[key];
      }, obj);
      target[lastKey] = value;
    } else {
      obj[path] = value;
    }
  }

  /**
   * API到客户端数据转换
   * @param {string} schemaName - 模式名称
   * @param {Object|Array} data - API数据
   * @param {Object} metadata - 元数据
   * @returns {Object|Array} 客户端数据
   */
  toClient(schemaName, data, metadata = {}) {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new BFFTransformError(`Schema '${schemaName}' not found`, 'SCHEMA_NOT_FOUND');
    }

    const context = {
      operation: 'read',
      direction: 'api->client',
      metadata
    };

    if (Array.isArray(data)) {
      return data.map(item => this.applyFieldMapping(item, schema, context));
    }

    return this.applyFieldMapping(data, schema, context);
  }

  /**
   * 客户端到API数据转换
   * @param {string} schemaName - 模式名称
   * @param {Object|Array} data - 客户端数据
   * @param {Object} metadata - 元数据
   * @returns {Object|Array} API数据
   */
  toAPI(schemaName, data, metadata = {}) {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new BFFTransformError(`Schema '${schemaName}' not found`, 'SCHEMA_NOT_FOUND');
    }

    const context = {
      operation: 'write',
      direction: 'client->api',
      metadata
    };

    if (Array.isArray(data)) {
      return data.map(item => this.applyFieldMapping(item, schema, context));
    }

    return this.applyFieldMapping(data, schema, context);
  }

  /**
   * 创建复合转换器
   * @param {Array<string>} schemaNames - 模式名称数组
   * @returns {Object} 复合转换器
   */
  createCompositeTransformer(schemaNames) {
    return {
      toClient: (data, metadata = {}) => {
        let result = data;
        for (const schemaName of schemaNames) {
          result = this.toClient(schemaName, result, metadata);
        }
        return result;
      },
      toAPI: (data, metadata = {}) => {
        let result = data;
        for (const schemaName of [...schemaNames].reverse()) {
          result = this.toAPI(schemaName, result, metadata);
        }
        return result;
      }
    };
  }

  /**
   * 创建条件转换器
   * @param {Function} condition - 条件函数
   * @param {string} trueSchema - 条件为真时使用的模式
   * @param {string} falseSchema - 条件为假时使用的模式
   * @returns {Function} 条件转换函数
   */
  createConditionalTransformer(condition, trueSchema, falseSchema) {
    return (data, metadata = {}) => {
      const schemaName = condition(data, metadata) ? trueSchema : falseSchema;
      return this.toClient(schemaName, data, metadata);
    };
  }
}

/**
 * BFF转换错误类
 */
class BFFTransformError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'BFFTransformError';
    this.code = code;
    this.details = details;
  }
}

/**
 * 创建BFF数据转换器实例
 * @returns {BFFDataAdapter} BFF数据转换器实例
 */
export function createBFFAdapter() {
  return new BFFDataAdapter();
}

// 预定义常用转换器
const commonTransformers = {
  // 日期格式转换
  dateToISO: (value) => {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return new Date(value).toISOString();
    return value;
  },

  ISOToDate: (value) => {
    if (typeof value === 'string') return new Date(value);
    return value;
  },

  // 数字转换
  stringToNumber: (value) => {
    if (typeof value === 'string') return Number(value);
    return value;
  },

  numberToString: (value) => {
    if (typeof value === 'number') return String(value);
    return value;
  },

  // 布尔值转换
  stringToBoolean: (value) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  },

  // 数组转换
  commaSeparatedToArray: (value) => {
    if (typeof value === 'string') return value.split(',').map(s => s.trim());
    if (Array.isArray(value)) return value;
    return [];
  },

  arrayToCommaSeparated: (value) => {
    if (Array.isArray(value)) return value.join(',');
    return String(value);
  },

  // 对象扁平化
  flattenObject: (value, prefix = '') => {
    if (typeof value !== 'object' || value === null) return { [prefix]: value };
    
    const flattened = {};
    for (const [key, val] of Object.entries(value)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.assign(flattened, commonTransformers.flattenObject(val, newKey));
      } else {
        flattened[newKey] = val;
      }
    }
    return flattened;
  },

  // 对象嵌套化
  nestObject: (value) => {
    if (typeof value !== 'object' || value === null) return value;
    
    const nested = {};
    for (const [key, val] of Object.entries(value)) {
      const parts = key.split('.');
      let current = nested;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      
      current[parts[parts.length - 1]] = val;
    }
    
    return nested;
  }
};

// 预定义常用验证器
const commonValidators = {
  // 邮箱验证
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === 'string' && emailRegex.test(value);
  },

  // 手机号验证
  phone: (value) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return typeof value === 'string' && phoneRegex.test(value);
  },

  // 非空验证
  notEmpty: (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  // 数字范围验证
  range: (min, max) => (value) => {
    if (typeof value !== 'number') return false;
    return value >= min && value <= max;
  },

  // 长度验证
  length: (min, max) => (value) => {
    if (typeof value !== 'string' && !Array.isArray(value)) return false;
    const len = value.length;
    return len >= min && (max === undefined || len <= max);
  }
};

// 导出主要类和函数
export {
  BFFDataAdapter,
  BFFTransformError,
  commonTransformers,
  commonValidators
};