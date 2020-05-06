const assert = require("assert");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

global.assert = assert;
global.log = console;

global.pkgRoot = (...parts) => path.resolve(__dirname, "..", ...parts);
global.requireLib = (...parts) => require(pkgRoot("lib", ...parts));

global.jsonify = a => JSON.stringify(a, null, 2);
global.writeJson = (p, v) => fs.writeFile(p, jsonify(v), "utf-8");

global.castIntSafe = i => ("" + parseInt(i, 10) === i ? parseInt(i, 10) : i);
global.castBoolSafe = i => (i === "true" ? true : i === "false" ? false : i);

global.shellExec = async function shellExec(cmdLine, cwd) {
  return new Promise((resolve, reject) =>
    exec(
      cmdLine,
      { cwd, stdio: "inherit", shell: true },
      (error, stdout, stderr) =>
        error ? reject(error) : resolve({ stdout, stderr, error })
    )
  );
};
