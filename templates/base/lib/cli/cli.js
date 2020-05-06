#!/usr/bin/env node

/* cli-gen: auto-generated, do not edit. */
const program = require("commander");
const globalLoader = require("./loaders/global-loader");
const commandLoader = require("./loaders/command-loader");

async function _init() {
  globalLoader();
  commandLoader(program);
  program.parse(process.argv); // Parse arguments and invoke sub-command's main()
}

if (require.main === module) {
  _init().catch(e => {
    console.error(e);
    process.exit(-1);
  });
} else {
  module.exports = _init;
}
