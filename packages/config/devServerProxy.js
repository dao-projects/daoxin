// 开发环境（服务器代理配置）
const devServerProxy = (proxy) => {
    let proxyConfig = {};
    if (proxy) {
        if (typeof proxy === "string") {
            proxyConfig = {
                target: proxy,
                changeOrigin: true,
                pathRewrite: {
                    "^/": "",
                },
            };
        }
        // 判断是否是对象
        if (typeof proxy === "object") {
            Object.keys(proxy).forEach((key) => {
                proxyConfig[key] = {
                    target: proxy[key],
                    changeOrigin: true,
                    pathRewrite: {
                        [`^${key}`]: "",
                    },
                    ws: true,
                };
            });
        }
    }
    return proxyConfig;
};
module.exports = devServerProxy