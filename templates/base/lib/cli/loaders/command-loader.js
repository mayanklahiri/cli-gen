/* cli-gen: auto-generated, do not edit. */
const fs = require("fs");
const path = require("path");

module.exports = function commandLoader(program) {
  const cmdRoot = path.resolve(__dirname, "..", "commands");
  const cmdList = fs.readdirSync(cmdRoot);
  cmdList.forEach(command => require(path.join(cmdRoot, command))(program));
};
