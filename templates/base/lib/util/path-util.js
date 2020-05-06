/* cli-gen: auto-generated, do not edit. */
const path = require("path");

const BASE_PKG_PATH = path.resolve(__dirname, "..", "..");

function pkgRoot(...p) {
  return path.join(BASE_PKG_PATH, ...p);
}

function libRoot(...p) {
  return pkgRoot("lib", ...p);
}

function testRoot(...p) {
  return pkgRoot("__test__", ...p);
}

function pkgJson() {
  return require(pkgRoot("package.json"));
}

module.exports = {
  pkgRoot,
  libRoot,
  testRoot,
  pkgJson
};
