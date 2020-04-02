const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

let tmpDir, testSalt;

async function setUp() {
  testSalt = crypto.randomBytes(6).toString("hex");
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `cli-gen-test-${testSalt}`));
}

async function tearDown() {
  if (tmpDir) {
    await fs.rmdir(tmpDir, { recursive: true });
  }
}

async function templateTest() {
  await setUp();

  const pkgRoot = path.resolve(__dirname, "..");
  const cliRoot = path.join(pkgRoot, "lib/cli-gen.js");
  const cmdLine = `${process.argv[0]} ${cliRoot} proj-${testSalt}`;
  await execPromise(cmdLine, tmpDir);

  await tearDown();
}

async function execPromise(cmdLine, cwd) {
  return new Promise((resolve, reject) =>
    spawn(
      cmdLine,
      { cwd, stdio: "inherit", shell: true },
      (err, stdout, stderr) => (err ? reject(err) : resolve({ stdout, stderr }))
    )
  );
}

module.exports = templateTest;
