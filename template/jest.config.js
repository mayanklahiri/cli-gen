const { defaults } = require("jest-config");

module.exports = {
  bail: 1,
  verbose: true,
  setupFiles: ["./lib/cli/globals/index.js"]
};
