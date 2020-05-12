const assert = require("assert");
const readline = require("readline");
const { spawn } = require("child_process");
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
  return new Promise((resolve, reject) => {
    const child = spawn(cmdLine, {
      shell: true,
      cwd,
      stdio: "pipe"
    });
    const rlStdout = readline.createInterface({
      input: child.stdout
    });
    const rlStderr = readline.createInterface({
      input: child.stderr
    });
    rlStdout.on("line", line =>
      line.split(/\n/).forEach(l => console.log(`stdout> ${l}`))
    );
    rlStderr.on("line", line =>
      line.split(/\n/).forEach(l => console.log(`stderr> ${l}`))
    );
    child.once("exit", (code, signal) =>
      code || signal ? reject(code || signal) : resolve()
    );
    child.on("error", reject);
  });
};
