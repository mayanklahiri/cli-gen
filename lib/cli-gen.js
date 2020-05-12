#!/usr/bin/env node
require("./global");

const { parseArgs } = require("./args");
const { isDirectory } = require("./fs-util");
const { ProjectUpdater } = require("./update");

const TEMPLATES_PKG_DIR = "templates";
const DEFAULT_TEMPLATE = "base";

async function main(argv) {
  const { args } = parseArgs(argv);
  if (args.apply) {
    log.warn(`Changes will be written to disk!`);
  } else {
    log.info(
      `DRY-RUN mode because --apply is not specified. No changes will be written to disk.`
    );
  }

  // Check for valid working and template directories.
  const wd = args.workdir || process.cwd();
  const templateDir =
    args.template || pkgRoot(TEMPLATES_PKG_DIR, DEFAULT_TEMPLATE);
  assert(
    await isDirectory(templateDir),
    `Template path "${templateDir}" is not a directory.`
  );

  // Update project (working) directory based on template.
  await new ProjectUpdater(wd, templateDir, args).update();
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch(e => {
      log.error(`Fatal error: ${e}\n${e.stack.toString()}`);
      process.exit(1);
    });
}
