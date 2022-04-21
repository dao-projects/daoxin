import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../");

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(path.join(root, subRoot))
    .filter((name) => name.startsWith("daoxin-"))
    .map((name) => ({
      name: name.replace(/^daoxin-/, "@daoxin/"),
      dir: path.resolve(root, subRoot, name),
      relative: `./${subRoot}/${name}`,
    }))
    .filter(({ dir }) => fs.existsSync(path.join(dir, "src", "index.ts")));
}

const tsPkgs = [...getTsPkgs("packages")];
fs.writeFileSync(
  path.resolve(root, `tsconfig.json`),
  JSON.stringify(
    {
      extends: "./tsconfig.base.json",
      include: tsPkgs.map(({ relative }) => `${relative}/src/**/*.ts`),
      compilerOptions: {
        paths: Object.fromEntries(tsPkgs.map(({ name, relative }) => [name, [`${relative}/src`]])),
      },
    },
    null,
    2
  )
);
