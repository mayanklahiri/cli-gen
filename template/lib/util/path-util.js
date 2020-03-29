const path = require("path");

const BASE_PKG_PATH = path.resolve(__dirname, "..", "..");

function basePkgPath(...p) {
  return path.join(BASE_PKG_PATH, ...p);
}

function libRoot(...p) {
  return basePkgPath("lib", ...p);
}

function testRoot(...p) {
  return basePkgPath("__test__", ...p);
}

function pkgJson() {
  return require(basePkgPath("package.json"));
}

module.exports = {
  basePkgPath,
  libRoot,
  testRoot,
  pkgJson
};
