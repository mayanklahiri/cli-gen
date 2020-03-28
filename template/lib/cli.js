#!/usr/bin/env node
const { program } = require("commander");
program.version("0.0.1");

async function main(args) {
  console.log("fuu");
}

if (require.main === module) {
  main(process.argv.slice(2))
    .catch(e => {
      console.error(e);
      return process.exit(-1);
    })
    .then(() => process.exit(0));
}
