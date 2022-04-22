const baseConfig = require("./index.js")
const { extend } = require("../utils.js")
module.exports = extend(baseConfig, {
  output: {
    libraryTarget: "global",
  },
})
