/* cli-gen: auto-generated, do not edit. */

const col = require("chalk");

const { pathUtil } = global;

module.exports = program => {
  program
    .command("about")
    .description("Introspect runtime version and environment information.")
    .action(main);
};

async function main() {
  process.stdout.write(
    [
      `Package: ${col.yellow(pathUtil.pkgJson().name)}`,
      `Package version: ${col.yellow(pathUtil.pkgJson().version)}`,
      `Node version: ${process.version.slice(1)}`,
      `Package dir: ${pathUtil.basePkgPath()}`,
      `Working dir: ${process.cwd()}`
    ].join("\n") + "\n"
  );
}
