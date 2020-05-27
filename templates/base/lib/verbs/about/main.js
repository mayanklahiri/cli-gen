/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

module.exports = async function main() {
  const pkgJson = require(pkgRoot("package.json"));
  process.stdout.write(
    [
      `Package:         ${col.yellow(pkgJson.name)}`,
      `Package version: ${col.yellow(pkgJson.version)}`,
      `Node version:    ${col.yellow(process.version.slice(1))}`,
      `Package dir:     ${col.yellow(pkgRoot())}`
    ].join("\n") + "\n"
  );
};
