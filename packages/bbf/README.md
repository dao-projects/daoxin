# BFFDataAdapter

[![npm version](https://img.shields.io/npm/v/@daoxin/bbf.svg)](https://www.npmjs.com/package/@daoxin/bbf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

> 🚀 专为现代前端开发设计的声明式数据转换层，解决API数据格式转换的终极方案

## 什么是BFFDataAdapter？

BFFDataAdapter是一个强大的JavaScript/TypeScript库，专门用于处理前端与后端API之间的数据转换、字段映射和格式验证。它采用声明式配置，让数据转换变得简单、可维护且类型安全。

**BFF**在这里指的是 **Backend for Frontend**（面向前端的后端），而不是常见的"Best Friends Forever"含义。

## 特性

- ✅ **声明式配置** - 使用JSON配置定义数据转换规则
- ✅ **双向转换** - 支持API→客户端和客户端→API的双向数据转换
- ✅ **类型安全** - 完整的TypeScript支持
- ✅ **内置验证器** - 提供常用数据验证规则
- ✅ **自定义转换器** - 支持自定义转换逻辑
- ✅ **嵌套字段支持** - 处理复杂的嵌套对象结构
- ✅ **错误处理** - 详细的错误信息和错误码
- ✅ **高性能** - 优化的转换算法和缓存机制

## 安装

```bash
npm install @daoxin/bbf
# 或
yarn add @daoxin/bbf
# 或
pnpm add @daoxin/bbf
```

## 快速开始

### 基本用法

```javascript
import { createBFFAdapter, commonTransformers, commonValidators } from '@daoxin/bbf';

// 创建适配器实例
const bff = createBFFAdapter();

// 注册常用转换器和验证器
bff.registerTransformer('dateToISO', commonTransformers.dateToISO);
bff.registerTransformer('stringToNumber', commonTransformers.stringToNumber);
bff.registerValidator('email', commonValidators.email);

// 定义数据模式
bff.registerSchema('User', {
  fields: {
    id: { source: 'user_id' },
    name: { source: 'full_name' },
    email: { 
      validate: 'email',
      transform: (value) => value.toLowerCase()
    },
    age: { 
      source: 'user_age',
      transform: 'stringToNumber'
    },
    createdAt: { 
      source: 'created_at',
      transform: 'ISOToDate'
    }
  }
});

// API数据转换为客户端数据
const apiData = {
  user_id: 123,
  full_name: 'John Doe',
  email: 'JOHN@EXAMPLE.COM',
  user_age: '25',
  created_at: '2023-01-01T00:00:00Z'
};

const clientData = bff.toClient('User', apiData);
console.log(clientData);
```

### TypeScript使用

```typescript
import { createBFFAdapter } from '@daoxin/bbf';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

const bff = createBFFAdapter();

// 配置模式...
const userData = bff.toClient('User', apiData) as User;
```

## 核心概念

### 1. 数据模式 (Schema)

数据模式定义了如何转换数据：

```javascript
bff.registerSchema('Product', {
  preTransform: (data) => {
    // 预处理逻辑
    return data;
  },
  fields: {
    productId: { source: 'id', required: true },
    productName: { source: 'name' },
    price: { 
      source: 'unit_price',
      transform: 'stringToNumber',
      validate: (value) => value > 0
    },
    'category.name': { source: 'category_name' }
  },
  postTransform: (data) => {
    // 后处理逻辑
    data.formattedPrice = `$${data.price.toFixed(2)}`;
    return data;
  }
});
```

### 2. 转换器 (Transformers)

内置常用转换器：

```javascript
import { commonTransformers } from '@daoxin/bbf';

// 日期转换
commonTransformers.dateToISO(new Date());
commonTransformers.ISOToDate("2024-01-01T00:00:00.000Z");

// 数字转换
commonTransformers.stringToNumber("123");
commonTransformers.numberToString(123);

// 数组转换
commonTransformers.commaSeparatedToArray("a,b,c");
commonTransformers.arrayToCommaSeparated(["a", "b", "c"]);

// 对象操作
commonTransformers.flattenObject({ user: { name: "John" } });
commonTransformers.nestObject({ "user.name": "John" });
```

### 3. 验证器 (Validators)

内置验证器：

```javascript
import { commonValidators } from '@daoxin/bbf';

// 基本验证
commonValidators.email('test@example.com');
commonValidators.phone('13800138000');
commonValidators.notEmpty('text');

// 自定义验证
const ageValidator = commonValidators.range(18, 60);
const lengthValidator = commonValidators.length(5, 20);
```

## 高级用法

### 复合转换器

```javascript
// 创建复合转换器
const userOrderTransformer = bff.createCompositeTransformer(['User', 'Order']);

// 一次性应用多个转换
const transformedData = userOrderTransformer.toClient(apiData);
```

### 条件转换器

```javascript
// 创建条件转换器
const conditionalTransformer = bff.createConditionalTransformer(
  (data) => data.user_type === 'vip',
  'VipUserSchema',
  'NormalUserSchema'
);

// 根据条件自动选择转换模式
const userData = conditionalTransformer(apiUserData);
```

### 错误处理

```javascript
try {
  const result = bff.toClient('User', apiData);
} catch (error) {
  if (error.name === 'BFFTransformError') {
    switch (error.code) {
      case 'FIELD_MISSING':
        console.error('缺少必需字段:', error.message);
        break;
      case 'VALIDATION_FAILED':
        console.error('数据验证失败:', error.message);
        break;
      case 'SCHEMA_NOT_FOUND':
        console.error('模式未找到:', error.message);
        break;
    }
  }
}
```

## API参考

### BFFDataAdapter类

#### 方法

- `registerSchema(name: string, schema: SchemaConfig): void` - 注册数据模式
- `registerTransformer(name: string, transformer: Function): void` - 注册自定义转换器
- `registerValidator(name: string, validator: Function): void` - 注册自定义验证器
- `toClient(schemaName: string, data: any, metadata?: any): any` - API→客户端转换
- `toAPI(schemaName: string, data: any, metadata?: any): any` - 客户端→API转换
- `createCompositeTransformer(schemaNames: string[]): Object` - 创建复合转换器
- `createConditionalTransformer(condition: Function, trueSchema: string, falseSchema: string): Function` - 创建条件转换器

### 字段映射配置

```typescript
interface FieldMapping {
  source?: string;          // 源字段名
  target?: string;          // 目标字段名
  transform?: Function | string; // 转换函数或转换器名称
  validate?: Function | string; // 验证函数或验证器名称
  default?: any;            // 默认值
  required?: boolean;       // 是否必需字段
}
```

## 性能优化

### 模式复用

```javascript
// 应用初始化时注册所有模式
class App {
  constructor() {
    this.bff = createBFFAdapter();
    this.registerAllSchemas();
  }
  
  registerAllSchemas() {
    bff.registerSchema('User', userSchema);
    bff.registerSchema('Product', productSchema);
    bff.registerSchema('Order', orderSchema);
  }
}
```

### 批量转换

```javascript
// 批量处理数组数据
const usersData = bff.toClient('User', apiUsersArray);

// 使用复合转换器减少多次调用
const compositeTransformer = bff.createCompositeTransformer(['User', 'Profile']);
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Node.js 12+

## 贡献

欢迎贡献代码！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如果你遇到问题或有建议：

- 在 [GitHub Issues](https://github.com/dao-projects/daoxin/issues) 提交问题
- 发送邮件到: mail@idao.top

---

**BFFDataAdapter** - 让数据转换变得简单而优雅！ 🎉