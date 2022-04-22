// module.exports = function (env, argv, currentDir) {
//   return {
//     mode: "production",
//     entry: "./src/index.js",
//     output: {
//       path: "./dist",
//       filename: "index.js",
//       library: "app",
//     },
//   }
// }

module.exports = (env, argv, currentDir) => ({
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: "./dist",
    filename: "index.js",
    library: "app",
  },
})
