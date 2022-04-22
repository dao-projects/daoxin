module.exports = {
  $schema: "http://json.schemastore.org/prettierrc",
  arrowParens: "always", // 箭头函数参数是否带圆括号（avoid：省略）
  bracketSpacing: true, // 对象，数组括号与文字之间加空格 { foo: bar }
  endOfLine: "lf",
  // 屏幕显示宽度（一行做多容纳字节数，超过自动换行）
  printWidth: 80,
  //句尾添加分号
  semi: false,
  //使用单引号
  singleQuote: false,
  //缩进字节（2空格代替tab）
  tabWidth: 2,
  // 对象或数组末尾加逗号
  trailingComma: "all",
}
