```
# 添加一个项目
$ npm init -w packages/icons

# 添加npm依赖（单个）
$ npm install axios -w icons 

# 添加npm依赖（全部）
$ npm install axios -ws
$ npm install axios --workspaces

# 运行命令
$ npm run test -ws  // 全部运行
$ npm run test --workspaces  // 全部运行
$ npm run test --workspace=a --workspace=b // 指定workspace
$ npm run test --workspaces --if-present //异常处理
```