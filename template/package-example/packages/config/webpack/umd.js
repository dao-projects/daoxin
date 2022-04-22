const {
  extend,
  resolve,
  formatPath,
  readJSONFile,
  removeDirSyncRecursive,
} = require("../utils.js")
// 获取package.json
const pkg = readJSONFile("./package.json")

module.exports = (options = {}) => {
  // 清空上次打包目录
  removeDirSyncRecursive(options?.output?.path || "./umd")
  // 合并配置项
  return extend(
    {
      mode: "production",
      entry: "./src/index.js",
      output: {
        path: resolve("./umd"),
        filename: "index.js",
        library: formatPath(pkg?.name) || "app",
        libraryTarget: "umd", //commonjs，commonjs2， window，amd, global,
      },
    },
    options,
  )
}
