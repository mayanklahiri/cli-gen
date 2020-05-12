/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

require("fs")
  .readdirSync(__dirname)
  .filter(f => f.match(/\.js$/i))
  .sort()
  .map(f => require(require("path").resolve(__dirname, f)));
