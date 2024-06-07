const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
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

const version = {
  get() {
    return pkg?.version ?? "0.0.0";
  },
  set(type) {
    const version = pkg.version || "0.0.0";
    const currentDate = new Date()?.toISOString()?.slice(0, 10);
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
    // 新版本
    pkg.version = `${majorVersion}.${minorVersion}.${reviseVersion}`;
    // 当前版本
    pkg.currentVersion = `${pkg.version}_${currentDate}${type ? `_${type}` : ""}`;
    writeJSONFile("package.json", pkg);
    return pkg;
  },
};

export { version as default };
