const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const isProd = process.env.NODE_ENV === "production";
// 绝对路径 (process.cwd()=> 当前Node.js进程执行时的工作目录, __dirname => 当前模块的目录名)
const cwdResolve = (file) => resolve(process.cwd(), file);
// 读取配置文件
const readJSONFile = (file) =>
  JSON.parse(readFileSync(cwdResolve(file), "utf-8"));
// 写入配置文件
const writeJSONFile = (file, data) => {
  writeFileSync(cwdResolve(file), JSON.stringify(data, null, 2), "utf-8");
};
// 读取package.json文件
let pkg = readJSONFile("package.json");
// 当前日期对象解构
const dates = (t) => {
  const date = t || new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    date,
  };
};
// 当前年月日时分函数（无分割）格式：yyyymmddhhmm
const currentDate = () => {
  const { year, month, day, hour, minute } = dates();
  return `${year}${month}${day}${hour}${minute}`;
};
/*
 * 版本递归自增函数（主版本号.次版本号.修订版本号.日期版本号_base(基础架构)/alpha(初级版本)/beta(无严重错误)/RC(相当成熟)/release(最终版本)）
 * @param {String} version 当前版本号
 * @param {String} type 版本类型
 * @return {String} 返回版本号
 */
const versionIncrement = (type = "") => {
  const version = pkg.version || "0.0.0";
  const [major, minor, revise] = version.split(".") || [0, 0, 0];
  let majorVersion = Number(major) || 0;
  let minorVersion = Number(minor) || 0;
  let reviseVersion = Number(revise) || 0;
  if (reviseVersion > 9) {
    reviseVersion = 0;
    if (minorVersion > 9) {
      minorVersion = 0;
      majorVersion++;
    } else {
      minorVersion++;
    }
  } else {
    reviseVersion++;
  }
  // 如果是生产环境，则更新package.json文件
  if (isProd) {
    pkg.version = `${majorVersion}.${minorVersion}.${reviseVersion}`;
    pkg.currentVersion = `${pkg.version}_${currentDate()}${
      type ? `_${type}` : ""
    }`;
    const currentPath = `www/${pkg.name}/${pkg.currentVersion}`;
    pkg.baseConfig = pkg.baseConfig || {};
    pkg.homepage = `${
      pkg?.baseConfig?.cdn || "https://cdn.dpfrc.com/"
    }${currentPath}/`;
    pkg.baseConfig.oss = pkg.baseConfig.oss || {};
    pkg.baseConfig.oss = {
      buildPath: "dist",
      region: "oss-cn-chengdu",
      bucket: "itgr-data",
      accessKeyId: "",
      accessKeySecret: "",
      ...pkg.baseConfig.oss,
      ossPath: `${currentPath}`,
    };
    writeJSONFile("package.json", pkg);
  }
  return pkg;
};
module.exports = versionIncrement;
