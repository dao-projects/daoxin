## daoxin

> 前端通用工程化 | General front-end engineering

## 运行说明

> 默认为所有子项目
> 所有子项目添加参数 --workspaces 或 --ws
> 某一个子项目参数 --workspace=xxx 或 -w=xxx

```
# 添加一个项目
$ npm init -w packages/icons

# 添加npm依赖（单个）
$ npm install axios -w icons

# 添加npm依赖（全部）
$ npm install axios -ws // 或($ npm install axios --workspaces)

# 运行子项目（全部）
$ npm run dev  // 或 ($ npm run dev -ws)

# 运行子项目（单个）
$ npm run dev -w=@daoxin/config // 或($ --workspace=@daoxin/config)


# 版本更新
npm version major | minor | patch
```

## @daoxin/config [文档](https://dao-projects.github.io/daoxin/packages/config/)
```
npm i @daoxin/config
```

## @daoxin/cookie [文档](https://dao-projects.github.io/daoxin/packages/cookie/)

```
npm i @daoxin/cookie
```

## @daoxin/event [文档](https://dao-projects.github.io/daoxin/packages/event/)

```
npm i @daoxin/event
```

## @daoxin/getclass [文档](https://dao-projects.github.io/daoxin/packages/getclass/)

```
npm i @daoxin/getclass
```

## @daoxin/storage [文档](https://dao-projects.github.io/daoxin/packages/storage/)

```
npm i @daoxin/storage
```

## @daoxin/styles [文档](https://dao-projects.github.io/daoxin/packages/styles/)

```
npm i @daoxin/styles
```

## @daoxin/version [文档](https://dao-projects.github.io/daoxin/packages/version/)

```
npm i @daoxin/version
```

## @daoxin/webpack [文档](https://dao-projects.github.io/daoxin/packages/webpack/)

```
npm i @daoxin/webpack
```

## 协作者

> @daoixn
