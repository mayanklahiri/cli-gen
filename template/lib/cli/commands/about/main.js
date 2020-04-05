/* cli-gen: auto-generated, do not edit. */
module.exports = async function main() {
  process.stdout.write(
    [
      `Package: ${col.yellow(pathUtil.pkgJson().name)}`,
      `Package version: ${col.yellow(pathUtil.pkgJson().version)}`,
      `Node version: ${col.yellow(process.version.slice(1))}`,
      `Package dir: ${col.yellow(pathUtil.basePkgPath())}`
    ].join("\n") + "\n"
  );
};
