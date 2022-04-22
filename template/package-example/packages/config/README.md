# `@daoxin/config`

> 项目常用配置集合

## Usage

**Install**:

```bash
$ yarn add --dev @daoxin/config
```

**Edit `package.json`**:

```jsonc
{
  // ...
  "prettier": "@daoxin/config/prettier" // 获取  "prettier": "@daoxin/config/prettier/vue" or "prettier": "@daoxin/config/prettier/react"
}
```

**Edit `.prettierrc.json or .prettierrc`**:

```
"@daoxin/config/prettier"
```

**Edit `.prettierrc.cjs or prettier.config.cjs`**:

```
module.exports = {
    ...require('@daoxin/config/prettier'),
    semi: false,
}
```
