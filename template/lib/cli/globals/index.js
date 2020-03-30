/* cli-gen: auto-generated, do not edit. */
const fs = require("fs");
const path = require("path");

// Modules in this directory are require()'d sequentially
// and are expected to modify 'global'.
//
// Modules in this file are execute imperatively and synchronously (blocking).
//
fs.readdirSync(__dirname)
  .filter(f => f !== "index.js")
  .sort()
  .forEach(modPath => require(path.join(__dirname, modPath)));
