const fs = require("fs")
const path = require("path")
/**
 * 深度合并参数对象
 */
function extend(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var value = source[key]
      if (typeof value === "object") {
        target[key] = extend(target[key] || {}, value)
      } else {
        // 判断是否为路径
        if (["path"].includes(key)) {
          target[key] = resolve(value)
        } else {
          target[key] = value
        }
      }
    }
  }
  return target
}

/**
 * 路径替换为绝对路径
 */
function resolve(file) {
  return path.resolve(process.cwd(), file)
}

/**
 * 判断是否为文件
 */
function isFile(file) {
  return fs.existsSync(resolve(file)) && fs.statSync(resolve(file)).isFile()
}
/**
 * 判断是否为文件夹
 */
function isDir(file) {
  return (
    fs.existsSync(resolve(file)) && fs.statSync(resolve(file)).isDirectory()
  )
}

/**
 * 判断文件存在并同步修改
 */
function writeFileSync(file, content) {
  if (isFile(file)) {
    fs.writeFileSync(resolve(file), content)
  } else {
    fs.mkdirSync(resolve(file))
  }
}

/**
 * 判断文件存在并同步删除
 */
function removeFileSync(file) {
  if (isFile(file)) {
    fs.unlinkSync(resolve(file))
  }
}

/**
 * 判断文件夹存在并同步删除
 */
function removeDirSync(file) {
  if (isDir(file)) {
    fs.rmdirSync(resolve(file))
  }
}

/**
 * 判断文件夹存在并同步删除(递归文件或目录)
 */
function removeDirSyncRecursive(file) {
  if (isDir(file)) {
    fs.readdirSync(resolve(file)).forEach(function (entry) {
      var entry_path = path.join(file, entry)
      if (isDir(entry_path)) {
        removeDirSyncRecursive(entry_path)
      } else {
        fs.unlinkSync(entry_path)
      }
    })
    fs.rmdirSync(resolve(file))
  }
}

/**
 * 读取JSON文件
 */
function readJSONFile(file) {
  return JSON.parse(fs.readFileSync(resolve(file), "utf8"))
}

/**
 * 修改JSON文件（不存时则创建该JSON文件）
 */
function writeJSONFile(file, content = {}) {
  fs.writeFileSync(resolve(file), JSON.stringify(content, null, 2))
}

/**
 * 格式化路径为名称(/替换为-，并转换为小写)
 */
function formatPath(path) {
  return path
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9_\-]/g, "")
    .toLowerCase()
}

module.exports = {
  extend,
  resolve,
  isFile,
  isDir,
  writeFileSync,
  removeFileSync,
  removeDirSync,
  removeDirSyncRecursive,
  readJSONFile,
  writeJSONFile,
  formatPath
}
