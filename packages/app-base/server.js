/*
 * @Descripttion: 静态资源服务器
 * @version: 0.0.1
 * @Author: liuhb
 * @Date: 2021-12-10 09:33:46
 * @LastEditors: liuhb
 * @LastEditTime: 2021-12-10 09:43:16
 */
const path = require("path");
const express = require("express");
const proxy = require("http-proxy-middleware");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../dist")));
// 线上环境
app.use(
  "/api",
  proxy({ target: "http://172.16.144.237:8080", changeOrigin: true })
);
// 测试环境
app.use(
  "/dev",
  proxy({ target: "http://172.16.5.205:8080", changeOrigin: true })
);
app.listen(port);
