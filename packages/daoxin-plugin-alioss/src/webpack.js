'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
exports.__esModule = true
var fs_1 = require('fs')
var path_1 = require('path')
var ali_oss_1 = require('ali-oss')
// 插件名称
var pluginName = 'daoxinPluginAlioss'
// 默认配置
var defaultConfig = {
  accessKeySecret: '',
  region: '',
  bucket: '',
  buildPath: 'dist',
  ossPath: 'test'
}
/**
 * webpack 插件类别
 */
var daoxinPluginAlioss = /** @class */ (function () {
  function daoxinPluginAlioss(config) {
    var _this = this
    // 解决文件路径双斜杠问题
    this.resolvePath = function (pathname) {
      return pathname.replace(/\\/g, '/')
    }
    // 全路径
    this.fullPath = function (pathname) {
      return path_1['default'].resolve(pathname)
    }
    // 上传路径
    this.uploadPath = function (pathname, prefix) {
      if (prefix === void 0) {
        prefix = ''
      }
      return _this.resolvePath(
        path_1['default'].join(
          _this.config.ossPath,
          prefix,
          pathname.indexOf('..') === 0 ? pathname.substr(1) : pathname
        )
      )
    }
    this.config = Object.assign({}, defaultConfig, config)
    this.client = new ali_oss_1['default'](this.config)
  }
  daoxinPluginAlioss.prototype.apply = function (compiler) {
    var _this = this
    compiler.hooks.emit.tapAsync(pluginName, function (compilation, callback) {
      var _a = _this.config,
        buildPath = _a.buildPath,
        ossPath = _a.ossPath
      var files = fs_1['default'].readdirSync(buildPath)
      var promises = files.map(function (file) {
        return __awaiter(_this, void 0, void 0, function () {
          var filePath, stat, result
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                filePath = path_1['default'].join(buildPath, file)
                stat = fs_1['default'].statSync(filePath)
                if (!stat.isFile()) return [3 /*break*/, 2]
                return [4 /*yield*/, this.client.put(ossPath + '/' + file, filePath)]
              case 1:
                result = _a.sent()
                console.log(result)
                return [3 /*break*/, 3]
              case 2:
                console.log(file + ' is not a file')
                _a.label = 3
              case 3:
                return [2 /*return*/]
            }
          })
        })
      })
      Promise.all(promises).then(function () {
        callback()
      })
    })
  }
  /**
   * 文件遍历
   * @param {String|object|array} dir 需要遍历的文件夹路径
   * @param {Function} callback 回调函数
   * @param {String} prefix 文件前缀
   * @example
   *    walk(this.config.buildPath, (pathname, file, prefix = "") => {
   *         const result = this.client.put(this.uploadPath(pathname, prefix), pathname);
   *    })
   */
  daoxinPluginAlioss.prototype.walk = function (dir, callback, prefix) {
    var _this = this
    if (prefix === void 0) {
      prefix = ''
    }
    // 判断dir是否是数组
    if (Array.isArray(dir)) {
      dir.forEach(function (item) {
        _this.walk(item, callback)
      })
    } else if (typeof dir === 'object') {
      this.walk(dir.from, callback, dir.to)
    } else {
      // 判断dir是否是目录
      if (fs_1['default'].statSync(dir).isDirectory()) {
        // 读取目录
        fs_1['default'].readdirSync(dir).forEach(function (file) {
          var pathname = path_1['default'].join(dir, file)
          // 判断是否是目录
          if (fs_1['default'].statSync(pathname).isDirectory()) {
            // 递归
            _this.walk(pathname, callback)
          } else {
            // 回调
            callback(pathname, file, prefix)
          }
        })
      } else {
        // 回调
        callback(dir, path_1['default'].basename(dir), prefix)
      }
    }
  }
  return daoxinPluginAlioss
})()
exports['default'] = daoxinPluginAlioss
