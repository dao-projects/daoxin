import AliOSS from "ali-oss";
/**
 * webpack 插件类别
 */
declare class daoxinPluginAlioss {
    private config;
    client: AliOSS;
    constructor(config: any);
    apply(compiler: any): void;
    resolvePath: (pathname: any) => any;
    fullPath: (pathname: any) => string;
    uploadPath: (pathname: any, prefix?: string) => any;
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
    walk(dir: any, callback: any, prefix?: any): void;
}
export default daoxinPluginAlioss;
//# sourceMappingURL=webpack.d.ts.map