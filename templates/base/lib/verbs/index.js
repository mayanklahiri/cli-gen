/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */
const fs = require("fs");
const path = require("path");

module.exports = program => {
  fs.readdirSync(__dirname)
    .map(filename => path.join(__dirname, filename))
    .filter(absPath => fs.statSync(absPath).isDirectory())
    .forEach(absPath => require(absPath)(program));
  return program; // allow chaining.
};
