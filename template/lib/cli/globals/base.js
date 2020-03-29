/* cli-gen: auto-generated, do not edit. */
const pathUtil = require("../../util/path-util");
const { libRoot, testRoot } = pathUtil;

// require() shortcuts
global.requireLib = (...p) => require(libRoot(...p));
global.requireTest = (...p) => require(testRoot(...p));

// JSON shortcuts
global.prettyJson = v => JSON.stringify(v, null, 2);

// Filesystem shortcuts
global.pathUtil = pathUtil;
