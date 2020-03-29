const { libRoot, testRoot } = require("../../util/path-util");

global.requireLib = (...p) => require(libRoot(...p));
global.requireTest = (...p) => require(testRoot(...p));
