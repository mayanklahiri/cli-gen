/* cli-gen: auto-generated, do not edit. */
const fs = require("fs");
const path = require("path");

module.exports = function globalLoader() {
  const globalsRoot = path.resolve(__dirname, "..", "globals");
  try {
    const dirListing = fs.readdirSync(globalsRoot);
    if (dirListing.find(i => i === "index.js")) {
      require(globalsRoot); // mutates global, has side effects
    } else {
      dirListing.forEach(i => require(path.join(globalsRoot, i))); // mutates global, has side effects
    }
  } catch (e) {
    if (e.message.match(/ENOENT/i)) {
      return;
    }
    throw e;
  }
};
