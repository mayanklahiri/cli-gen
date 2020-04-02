const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { exec } = require("child_process");

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
  try {
    const { stdout, stderr, error } = await execPromise(cmdLine, tmpDir);
    if (stderr) {
      console.error(`Stderr:\n${stderr}`);
    } else {
      console.log(`Stdout:\n${stdout}\n`);
      console.log(`Test successful.`);
    }
  } catch (error) {
    console.error(`cli-gen exited with error code ${error.code}.`);
  }

  await tearDown();
}

async function execPromise(cmdLine, cwd) {
  return new Promise((resolve, reject) =>
    exec(
      cmdLine,
      { cwd, stdio: "inherit", shell: true },
      (error, stdout, stderr) =>
        error ? reject(error) : resolve({ stdout, stderr, error })
    )
  );
}

module.exports = templateTest;
