const fs = require("fs");
const path = require("path");
const AliOSS = require("ali-oss");
// const files = fs.readdirSync("E:\\daoxin-package\\dao-projects\\packages\\");

// console.log(files);
const config = {
  // buildPath: ["dist", "./test-fs.js"], //本地需要上传路径
  buildPath: [
    "./tween.html",
    "../packages/daoxin-plugin-alioss/",
    {
      from: "./a.js",
      to: "map",
    },
  ], //本地需要上传路径
  // buildPath:"./tween.html", //本地需要上传路径
  ossPath: `www/manage-test/`, //上传存放目录（存储空间内部）
  region: "oss-cn-chengdu", //区域
  accessKeyId: "LTAI5tDyEs6G9UuGmt2rhvxM",
  accessKeySecret: "qLH8q1QMYxJG3290TOqy6YdlvawnPT",
  bucket: "digital-zh", //存储空间
};
const client = new AliOSS(config);

function walk(dir, callback, prefix) {
  // 判断dir是否是数组
  if (Array.isArray(dir)) {
    dir.forEach((item) => {
      walk(item, callback);
    });
  } else if (typeof dir === "object") {
    walk(dir.from, callback, dir.to);
  } else {
    // 判断dir是否是目录
    if (fs.statSync(dir).isDirectory()) {
      // 读取目录
      fs.readdirSync(dir).forEach((file) => {
        const pathname = path.join(dir, file);
        // 判断是否是目录
        if (fs.statSync(pathname).isDirectory()) {
          // 递归
          walk(pathname, callback);
        } else {
          // 回调
          callback(pathname, file, prefix);
        }
      });
    } else {
      // 回调
      callback(dir, path.basename(dir), prefix);
    }
  }
}

// 解决文件路径双斜杠问题
const resolvePath = (pathname) => pathname.replace(/\\/g, "/");

// 全路径
const fullPath = (pathname) => path.resolve(pathname);

// 上传路径
const uploadPath = (pathname, prefix = "") => resolvePath(path.join(config.ossPath, prefix, pathname.indexOf("..") === 0 ? pathname.substr(1) : pathname));

walk(config.buildPath, (pathname, file, prefix = "") => {
  const result = client.put(uploadPath(pathname, prefix), pathname);
  console.log({
    pathname,
    file,
    uploadPath: uploadPath(pathname, prefix),
    fullPath: fullPath(pathname),
  });
});

// 路径拼接
// const pathname = path.join(config.buildPath, file);
