// npm i -D webpack webpack-cli  webpack-dev-server webpack-merge cross-env babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript style-loader css-loader less less-loader sass sass-loader postcss postcss-loader autoprefixer postcss-pxtorem  html-webpack-plugin terser-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin dao-aliyun-oss-webpack-plugin dao-unicode-webpack-plugin -w=@daoxin/webpack
//
// 依赖
const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const daoAliyunOssWebpackPlugin = require("dao-aliyun-oss-webpack-plugin");
const DaoUnicodeWebpackPlugin = require("dao-unicode-webpack-plugin");

// Node环境
const { NODE_ENV } = process.env || {};
// 开发环境
const isDev = NODE_ENV === "development";
// 生产环境
const isProd = NODE_ENV === "production";
// 测试环境
const isTest = NODE_ENV === "test";
// 绝对路径 (process.cwd()=> 当前Node.js进程执行时的工作目录, __dirname => 当前模块的目录名)
const cwdResolve = (file) => resolve(process.cwd(), file);
const dirResolve = (file) => resolve(__dirname, file);
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
  return pkg.currentVersion;
};
// 当前版本号
const currentVersion = () => pkg.currentVersion;
// 开发环境（服务器代理配置）
const devServerProxy = () => {
  const proxy = pkg?.baseConfig?.proxy;
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
// css预处理器配置
const cssLoader = {
  styleLoader: {
    loader: isProd ? MiniCssExtractPlugin.loader : "style-loader",
  },
  cssLoader: {
    loader: "css-loader",
  },
  postcssLoader: {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          "autoprefixer",
          [
            "postcss-pxtorem",
            {
              // 换算的基数
              rootValue: 100,
              propWhiteList: [],
              minPixelValue: 2,
            },
          ],
        ],
      },
    },
  },
  lessLoader: {
    loader: "less-loader",
    options: {
      lessOptions: {
        javascriptEnabled: true,
      },
    },
  },
  sassLoader: {
    loader: "sass-loader",
  },
  stylusLoader: {
    loader: "stylus-loader",
  },
};

const cssLoaderConfig = [
  cssLoader.styleLoader,
  cssLoader.cssLoader,
  cssLoader.postcssLoader,
];

// webpack基础配置
const webpackBaseConfig = {
  mode: NODE_ENV || "development",
  // 输出文件
  output: {
    clean: true,
    path: cwdResolve("dist"),
    filename: "js/[name].[chunkhash:8].js",
    chunkFilename: "js/[name].[chunkhash:8].js",
    publicPath: isDev ? "/" : pkg.homepage || "/",
  },
  // 模块
  module: {
    // 配置所有生成器的选项
    // {generator|parser} : {
    //     {asset|asset/inline | asset/resource | javascript | javascript/auto | javascript/dynamic | javascript/esm}: {
    //         // asseet 模块的 generator 选项
    //         // 自定义 asset 模块的 publicPath，自 webpack 5.28.0 起可用
    //         publicPath: "assets/",
    //         // 将静态资源输出到相对于 'output.path' 的指定文件夹中，webpack 5.67.0 后可用
    //         outputPath: "cdn-assets/",
    //     }
    // },
    // 忽略模块
    noParse: /jquery|lodash/, // noParse: (content) => /jquery|lodash/.test(content)
    // 规则
    // type: 'javascript/auto' | 'javascript/dynamic' | 'javascript/esm' | 'json' | 'webassembly/sync' | 'webassembly/async' | 'asset' | 'asset/source' | 'asset/resource' | 'asset/inline'
    rules: [
      //图片资源
      {
        // test, include, exclude 和 resource
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // 使用默认loader
        type: "asset/resource",
        generator: {
          // publicPath: 'https://cdn/assets/',
          // outputPath: 'cdn-assets/',
          filename: "img/[name][hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
        include: /src/,
        exclude: /node_modules/,
      },
      //字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "font/[name][hash][ext][query]",
        },
      },
      // 文件资源
      {
        test: /\.(txt|md|xml|yml|yaml|toml|csv|tsv)$/i,
        type: "asset/resource",
        generator: {
          filename: "file/[name][hash][ext][query]",
        },
      },
      // css-loader
      {
        test: /\.css$/,
        use: cssLoaderConfig,
      },
      // less-loader
      {
        test: /\.less$/,
        use: [
          ...cssLoaderConfig,
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // sass-loader
      {
        test: /\.s[ac]ss$/,
        use: [...cssLoaderConfig, "sass-loader"],
      },
      // stylus-loader
      // {
      //     test: /\.styl$/,
      //     use: [...cssLoaderConfig,"stylus-loader"],
      // },
      // babel-loader
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              [
                "@babel/env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
              [
                "@babel/react",
                {
                  jsx: "react",
                },
              ],
              ["@babel/typescript"],
            ],
          },
        },
      },
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      title: `${pkg?.title || pkg?.baseConfig?.title || "~~首页~~"} ${
        isDev ? " | 开发环境" : ""
      }`,
      template: "./public/index.html",
      filename: "index.html",
    }),
    isProd &&
      new webpack.DefinePlugin({
        envConfig: JSON.stringify(pkg?.baseConfig),
      }),
    isProd && new webpack.ProgressPlugin(),
    //css压缩
    isProd &&
      new MiniCssExtractPlugin({
        filename: `css/[name].[chunkhash:8].css`,
        chunkFilename: `css/[id].[chunkhash:8].css`,
      }),
    // 中文转Unicode
    isProd && new DaoUnicodeWebpackPlugin(),
    // 版权信息
    isProd &&
      new webpack.BannerPlugin(
        `***********************************************\r\n@version: ${
          pkg.version
        }\r\n@Author: @DaoXin <liuhangbiaoo@gmail.com>\r\n@Date: ${currentDate()}\r\n***********************************************`
      ),
    // OSS 文件上传
    isProd &&
      pkg?.baseConfig?.oss?.accessKeyId &&
      new daoAliyunOssWebpackPlugin(pkg?.baseConfig?.oss),
  ].filter(Boolean),
  resolve: {
    extensions: [
      ".ts",
      ".js",
      ".tsx",
      ".jsx",
      ".json",
      ".css",
      ".less",
      ".scss",
    ],
    alias: {
      "@": cwdResolve("src"),
      "@assets": cwdResolve("src/assets"),
      "@comps": cwdResolve("src/components"),
      "@common": cwdResolve("src/common"),
      "@img": cwdResolve("src/assets/img"),
      "@style": cwdResolve("src/styles"),
      "@less": cwdResolve("src/less"),
      "@sass": cwdResolve("src/sass"),
      "@views": cwdResolve("src/views"),
      "@hooks": cwdResolve("src/hooks"),
    },
    fallback: {
      path: false,
      constants: false,
      stream: false,
      assert: false,
      util: false,
      fs: false,
    },
  },
  cache: {
    // 支持文件缓存
    type: "filesystem",
  },
  devServer: isDev
    ? {
        // 开启HMR
        hot: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        historyApiFallback: true,
        proxy: devServerProxy(),
      }
    : undefined,
  optimization: isProd
    ? {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin({
            parallel: 4,
          }),
          new TerserPlugin({
            exclude: /\/node_modules/,
            extractComments: false, //不将注释提取到单独的文件中
            parallel: 4,
          }),
        ],
        splitChunks: {
          // include all types of chunks
          chunks: "all",
          // 重复打包问题
          cacheGroups: {
            vendors: {
              // node_modules里的代码
              test: /[\\/]node_modules[\\/]/,
              chunks: "all",
              priority: 10, // 优先级
              enforce: true,
            },
          },
        },
      }
    : undefined,
};

// 检目录是否存在,不存在则创建
const isDirExist = (dirPath) => {
  if (!existsSync(cwdResolve(dirPath))) {
    mkdirSync(cwdResolve(dirPath));
  }
};
// /// <reference types="node" />
// export default function isDirExist(p: fs.PathLike): void;
// import fs from "fs";
// /**
//  * @param {import("fs").PathLike} p
//  */
// export default function isDirExist(p: fs.PathLike) {
//     if (!fs.existsSync(p)) {
//         console.log("所需的目录不存在,创建目录", p);
//         console.log("\n");
//         fs.mkdirSync(p);
//     }
// }
// import fs from "fs";

// 检查文件是否存在，不存在则创建
const isFileExist = (filePath, context) => {
  if (!existsSync(cwdResolve(filePath))) {
    writeFileSync(cwdResolve(filePath), context, "utf-8");
  }
};

// 初始化项目
const initProject = () => {
  // 初始化版本自增
  versionIncrement();
  // 初始化项目目录
  isDirExist("public");
  isDirExist("src");
  isFileExist(
    "public/index.html",
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" name="viewport" /><meta http-equiv="X-UA-Compatible" content="ie=edge" /><link rel="icon" href="favicon.ico" /><title><%= htmlWebpackPlugin.options.title %></title></head><body><script src="https://cdn.dpfrc.com/libs/px2rem.js"></script><div id="app"></div><script src="https://cdn.dpfrc.com/dev.js"></script></body></html>`
  );
  // isFileExist(
  //     "src/index.ts",
  //     `const add = (x: number, y: number): number => x + y;function component() {const element = document.createElement("div");element.innerHTML = add(112, 33) + " Hello  webpack ${pkg.name}";return element;}document.querySelectorAll("#app")[0].appendChild(component());    `
  // );
};

// 开始
initProject();

module.exports = {
  NODE_ENV,
  isDev,
  isProd,
  isTest,
  cwdResolve,
  dirResolve,
  readJSONFile,
  pkg,
  currentDate,
  currentVersion,
  webpackBaseConfig,
  merge,
};
