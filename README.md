# 前端通用工程化 | General front-end engineering

## Initialize (初始化-可忽略)
```
npm install lerna -g
mkdir daoxin && cd $_
lerna init

cd packages
mkdir  app-base  app-echart
cd app-base && npm init  => @daoxin/app-base

```

## 1. Step (步骤)

```
# 初始化项目
npm run ni  // 或 npm install

# 开发环境（热更新服务）
npm run start

# 构建打包（用于生产环境）
npm run build

# 静态服务（dist访问）
npm run serve

# 清空打包资源
npm run clean

# 单元测试
npm run test:unit

# 集成测试
npm run test:e2e

# 语法检测&修复
npm run lint
```

## 2. Depend (依赖)

```
# 添加公共依赖（所有子模块）
lerna add lodash

# 单独添加子模块依赖
lerna add lodash --scope=@daoxin/app-base
lerna add lodash --scope=@daoxin/app-base  --dev

# 添加子模块之间的依赖(如：@daoxin/app-base 模块依赖于 @daoxin/app-utils)
lerna add @daoxin/app-utils --scope=@daoxin/app-base

# 自定义子模块命令
lerna exec --scope=@daoxin/app-base  npm uninstall axios

# 自定义子模块脚本(script)
lerna run <start/build/serve>  --scope=@daoxin/app-base
```

## 3. Quick project creation (快速创建项目)

```
# 初始化项目
cd packages && mkdir  app-base  && cd app-base && npm init

```