# @daoxin/webpack

基于Webpack的基础配置扩展

## 如何使用

1. 安装@daoxin/webpack

```
$ npm i @daoxin/webpack cross-env -D
```

2. 配置webpack.config.js

```
const { merge, webpackBaseConfig } = require("@daoxin/webpack");
module.exports = merge(webpackBaseConfig, {});
```

3. package.json配置

```{
  // 项目名称
  "name": "@digital-screen-sm/app",
  "scripts": {
    "serve": "cross-env NODE_ENV=development  webpack serve --open",
    "build": "cross-env NODE_ENV=production  webpack build --progress"
    ...
  },
  // 基础配置
  "baseConfig": {
    "title": "这是项目标题",
    "oss": {
      "buildPath": "dist",
      "region": "oss-cn-chengdu",
      "bucket": "bucket-name",
      "accessKeyId": "xxxxx",
      "accessKeySecret": "xxxx"
    },
    "proxy": {
      "/api": "https://api.xxx.com/api/",
      "/dev": "http://192.168.0.1:8080/",
      "/wj": "http://192.168.0.2:8080/",
      "/jc": "http://192.168.0.3:8080/",
      "/xy": "http://192.168.0.4:8080/"
    }
  },
}
```

