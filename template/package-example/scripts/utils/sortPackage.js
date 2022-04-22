export default function sortPackage(packageJson) {
  const sorted = {}

  const depTypes = [
    "scripts",
    "devDependencies",
    "dependencies",
    "peerDependencies",
    "tt",
  ]

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {}

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted,
  }
}
