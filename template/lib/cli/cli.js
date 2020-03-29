#!/usr/bin/env node
require("./globals"); // appends to 'global'; has side effects

const path = require("path");
const fs = require("fs").promises;

const { log } = global;

async function _init() {
  const program = require("commander");

  //
  // Load all modules using a naming convention for the 'commands' sub-folder.
  //
  const cmdList = await fs.readdir(path.join(__dirname, "commands"));
  cmdList.forEach(command => {
    const cmdModule = require(path.join(
      __dirname,
      "commands",
      command,
      `cmd-${command}.js`
    ));
    cmdModule(program);
  });

  // Parse arguments and invoke sub-command main()
  program.parse(process.argv);
}

if (require.main === module) {
  _init()
    .catch(async e => {
      log.error(e);
      await log.flush();
      process.exit(-1);
    })
    .then(async () => {
      await log.flush();
      process.exit(0);
    });
}
