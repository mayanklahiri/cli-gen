#!/usr/bin/env node
/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

const program = require("commander");
require("./global");
require("./verbs")(program);
program.parse(process.argv);
