// 将package目录下得所有包打包
const fs = require("fs");
const execa = require("execa"); //开启子进程，进行打包，最终还是使用rollup打包
// 找到目标模块
const target = fs.readdirSync("packages").filter((f) => {
    // 判断是否是个目录
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false;
    } else {
        return true;
    }
});
// 依次并行打包 
runParallel(target, build).then((res) => {});

function runParallel(targets, iteratorFn) {
    let res = [];
    // 异步并行打包
    for (const item of targets) {
        const p = iteratorFn(item);
        res.push(p);
    }
    return Promise.all(res);
}
// 核心打包模块build
async function build(target) {
    // 调用rollup.config.js
    await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
        stdio: "inherit", //子进程共享给父进程
    });
    console.log(target, "build:打包");
}