/*
 * @Descripttion: 创建项目工具类
 * @version: 0.0.1
 * @Author: liuhb
 * @Date: 2021-12-09 18:11:20
 * @LastEditors: liuhb
 * @LastEditTime: 2021-12-09 18:52:19
 */

// 默认依赖
const fs = require("fs");

// 三方依赖
// npm i inquirer download-git-repo  -D
const inquirer = require("inquirer");
const download = require("download-git-repo");

inquirer
  .prompt([
    {
      type: "input",
      message: "请输入项目名称",
      name: "name",
    },
    {
      type: "input",
      message: "请输入项目描述",
      name: "desc",
    },
    {
      type: "input",
      message: "请输入项目作者",
      name: "author",
    },
  ])
  .then((answers) => {
    const projectName = `packages/${answers.name}`;
    if (!fs.existsSync(projectName)) {
      console.log(answers);
      download(
        "direct:https://gitee.com/dao-projects/vue-iview-admin-template.git",
        projectName,
        { clone: true },
        (err) => {
          console.log(err ? err : "Success");
        }
      );
    } else {
      console.log("项目已存在");
    }
  });
