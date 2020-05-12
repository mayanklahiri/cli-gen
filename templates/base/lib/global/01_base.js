/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

const path = require("path");
const chalk = require("chalk");

const LIB_DIR = "lib";
const TESTS_DIR = "__tests__";
const BASE_PKG_PATH = path.resolve(__dirname, "..", "..");

global.pkgRoot = (...p) => path.join(BASE_PKG_PATH, ...p);
global.libRoot = (...p) => pkgRoot(LIB_DIR, ...p);
global.testRoot = (...p) => pkgRoot(TESTS_DIR, ...p);

// require() shortcuts
global.requireLib = (...p) => require(libRoot(...p));
global.requireTest = (...p) => require(testRoot(...p));

// JSON shortcuts
global.prettyJson = v => JSON.stringify(v, null, 2);
global.jsonify = v => JSON.stringify(v);

// Console colors
global.col = chalk;
