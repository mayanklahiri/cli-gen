const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

let tmpDir, testSalt, startTimeMs;

async function setUp() {
  testSalt = crypto.randomBytes(6).toString("hex");
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `cli-gen-test-${testSalt}`));
  log.debug(`Template test start: salt=${testSalt} tmp=${tmpDir}`);
  startTimeMs = Date.now();
}

async function tearDown() {
  if (tmpDir) {
    await fs.rmdir(tmpDir, { recursive: true });
  }
  log.debug(`Template test end: ${Date.now() - startTimeMs} ms`);
}

async function templateTest() {
  await setUp();

  const pkgRoot = path.resolve(__dirname, "..");
  const cliRoot = path.join(pkgRoot, "lib/cli-gen.js");
  const cmdLine = `${process.argv[0]} ${cliRoot} --apply proj-${testSalt}`;
  try {
    const { stdout, stderr } = await shellExec(cmdLine, tmpDir);
    if (stderr) {
      log.error(`Stderr:\n${stderr}`);
    } else {
      log.info(`Stdout:\n${stdout}\n`);
    }
  } catch (error) {
    log.error(`cli-gen exited with error: ${error.message}.`);
    log.debug(stderr);
  }

  await tearDown();
}

module.exports = templateTest;
