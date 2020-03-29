#!/usr/bin/env node
require("./globals");
const { log } = global;
const { program } = require("commander");

program.version("0.0.1");

async function main() {
  log.info("foo");
}

if (require.main === module) {
  main()
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
