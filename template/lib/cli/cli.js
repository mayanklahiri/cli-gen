#!/usr/bin/env node
/* cli-gen: auto-generated, do not edit. */
require("./globals"); // modifies 'global'; has side effects

const path = require("path");
const fs = require("fs").promises;

const program = require("commander");

const { log } = global;

async function _init() {
  // Load all modules using a naming convention for the 'commands' sub-folder.
  const cmdRoot = path.join(__dirname, "commands");
  const cmdList = await fs.readdir(cmdRoot);
  cmdList.forEach(command => {
    const cmdModule = require(path.join(cmdRoot, command));
    cmdModule(program);
  });

  // Parse arguments and invoke sub-command main()
  program.parse(process.argv);
}

if (require.main === module) {
  _init().catch(async e => {
    log.error(e);
    await log.flush();
    process.exit(-1);
  });
}
