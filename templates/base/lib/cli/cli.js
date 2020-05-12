#!/usr/bin/env node
/* cli-gen: auto-generated, do not edit. */
const program = require("commander");
const { globalLoader, commandLoader } = require("../util/loaders");

function _init() {
  globalLoader();
  commandLoader(program);
  program.parse(process.argv); // Parse arguments and invoke sub-command's main()
}

if (require.main === module) {
  _init();
} else {
  module.exports = _init;
}
