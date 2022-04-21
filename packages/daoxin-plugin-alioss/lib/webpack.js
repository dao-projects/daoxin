import fs from "fs";
import path from "path";
import AliOSS from "ali-oss";
// 插件名称
const pluginName = "daoxinPluginAlioss";
// 默认配置
const defaultConfig = {
    accessKeySecret: "",
    region: "",
    bucket: "",
    buildPath: "dist",
    ossPath: "test",
};
/**
 * webpack 插件类别
 */
class daoxinPluginAlioss {
    config;
    client;
    constructor(config) {
        this.config = Object.assign({}, defaultConfig, config);
        this.client = new AliOSS(this.config);
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
            const { buildPath, ossPath } = this.config;
            const files = fs.readdirSync(buildPath);
            const promises = files.map(async (file) => {
                const filePath = path.join(buildPath, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    const result = await this.client.put(`${ossPath}/${file}`, filePath);
                    console.log(result);
                }
                else {
                    console.log(`${file} is not a file`);
                }
            });
            Promise.all(promises).then(() => {
                callback();
            });
        });
    }
    // 解决文件路径双斜杠问题
    resolvePath = (pathname) => pathname.replace(/\\/g, "/");
    // 全路径
    fullPath = (pathname) => path.resolve(pathname);
    // 上传路径
    uploadPath = (pathname, prefix = "") => this.resolvePath(path.join(this.config.ossPath, prefix, pathname.indexOf("..") === 0 ? pathname.substr(1) : pathname));
    /**
     * 文件遍历
     * @param {String|object|array} dir 需要遍历的文件夹路径
     * @param {Function} callback 回调函数
     * @param {String} prefix 文件前缀
     * @example
     *    walk(this.config.buildPath, (pathname, file, prefix = "") => {
     *         const result = this.client.put(this.uploadPath(pathname, prefix), pathname);
     *    })
     */
    walk(dir, callback, prefix = "") {
        // 判断dir是否是数组
        if (Array.isArray(dir)) {
            dir.forEach((item) => {
                this.walk(item, callback);
            });
        }
        else if (typeof dir === "object") {
            this.walk(dir.from, callback, dir.to);
        }
        else {
            // 判断dir是否是目录
            if (fs.statSync(dir).isDirectory()) {
                // 读取目录
                fs.readdirSync(dir).forEach((file) => {
                    const pathname = path.join(dir, file);
                    // 判断是否是目录
                    if (fs.statSync(pathname).isDirectory()) {
                        // 递归
                        this.walk(pathname, callback);
                    }
                    else {
                        // 回调
                        callback(pathname, file, prefix);
                    }
                });
            }
            else {
                // 回调
                callback(dir, path.basename(dir), prefix);
            }
        }
    }
}
export default daoxinPluginAlioss;
