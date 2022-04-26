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
```

## 协作者

> @Jason
> @DaoXin
