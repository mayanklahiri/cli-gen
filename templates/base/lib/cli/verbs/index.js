/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

const path = require("path");
const fs = require("fs");

module.exports = program =>
  fs.readdirSync(__dirname).forEach(filename => {
    const absPath = path.join(__dirname, filename);
    if (fs.statSync(absPath).isDirectory()) {
      require(absPath)(program);
    }
  });
