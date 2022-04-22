import fs from "fs"
import path from "path"
import sortPackage from "./utils/sortPackage.js"

const pkg_path = path.resolve(`package.json`)
const pkg_json = JSON.parse(fs.readFileSync(pkg_path, "utf8"))

fs.writeFileSync(pkg_path, JSON.stringify(sortPackage(pkg_json), null, 2))
console.log(`Sorting ${pkg_path}`, pkg_json)
