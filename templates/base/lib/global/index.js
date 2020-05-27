/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */
const path = require("path");

require("fs")
  .readdirSync(__dirname)
  .filter(f => f.match(/\.js$/i))
  .filter(f => f !== path.basename(__filename))
  .sort()
  .map(f => path.resolve(__dirname, f))
  .forEach(require);
