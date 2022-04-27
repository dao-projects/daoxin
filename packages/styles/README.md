# @daoxin/styles

通用 style 样式扩展

## 如何使用

1. 安装@daoxin/styles

```
$ npm i --save @daoxin/styles
```

2. 导入

```
# 默认reset.css 重置样式，清除浏览器默认样式，并配置适合设计的基础样式（强调文本是否大多是粗体、主文字色，主链接色，主字体等）
import "@daoxin/styles"
import "@daoxin/styles/reset"
import "@daoxin/styles/reset.css"

# function.css 功能样式，从常用样式方法中抽离，按需使用
import "@daoxin/styles/function"

# animation.css 常见动画效果的集合
import "@daoxin/styles/animation"
```
