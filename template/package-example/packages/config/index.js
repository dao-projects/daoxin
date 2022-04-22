const vue = require("./prettier/vue.js")
const react = require("./prettier/react.js")
const node = require("./tsconfig/node.json")
const web = require("./tsconfig/web.json")
module.exports = {
  prettier: {
    vue,
    react,
  },
  tsconfig: {
    node,
    web,
  },
}
