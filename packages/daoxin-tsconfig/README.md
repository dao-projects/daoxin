# @daoxin/tsconfig

> tsconfig 通用配置

查看[@daoxin/tsconfig](https://github.com/dao-projects/daoxin/tree/main/packages/daoxin-tsconfig#readme) 了解更多信息或去[Github issues](https://github.com/dao-projects/daoxin/issues)反馈相关的问题。

## Install

Using npm:

```sh
npm install --save-dev @daoxin/tsconfig
```

or using yarn:

```sh
yarn add @daoxin/tsconfig --dev
```

## config

Add one of the available configurations to your tsconfig.json:

The base configuration (runtime-agnostic):

```
"extends": "@daoxin/tsconfig/tsconfig.json"
```

Configuration for Browser environment:

```
"extends": "@daoxin/tsconfig/tsconfig.web.json"
```

Configuration for Node environment:

```
"extends": "@daoxin/tsconfig/tsconfig.node.json"
```
