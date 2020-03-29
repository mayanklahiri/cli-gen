/* cli-gen: auto-generated, do not edit. */
const col = require("chalk");

const { pathUtil } = global;

module.exports = async function main() {
  process.stdout.write(
    [
      `Package: ${col.yellow(pathUtil.pkgJson().name)}`,
      `Package version: ${col.yellow(pathUtil.pkgJson().version)}`,
      `Node version: ${col.gray(process.version.slice(1))}`,
      `Package dir: ${col.gray(pathUtil.basePkgPath())}`
    ].join("\n") + "\n"
  );
};
