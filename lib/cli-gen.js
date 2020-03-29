#!/usr/bin/env node
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

const log = console;
const jsonify = a => JSON.stringify(a, null, 2);
const writeJson = (p, v) => fs.writeFile(p, jsonify(v), "utf-8");

const TEMPLATE_PACKAGES = ["async", "chalk", "commander", "lodash", "winston"];
const TEMPLATE_PACKAGES_DEV = ["jest"];

async function main(args) {
  //
  // Get project identifier (name)
  //
  if (!args.length) {
    throw new Error(`Usage: cli-gen <project identifier>`);
  }
  const projectId = args[0].replace(/\s+/gim, "");
  if (!projectId.length) {
    throw new Error(`Invalid project identifier "${args[0]}".`);
  }

  //
  // Ensure working directory is empty.
  //
  const cwd = process.cwd();
  const dirListing = (await fs.readdir(cwd)).filter(f => f[0] !== ".");
  if (dirListing.length) {
    throw new Error(
      `Working directory "${cwd}" is not empty. Found: ${jsonify(dirListing)}`
    );
  }

  //
  // Generate package.json
  //
  log.info(`> Creating project: ${projectId}`);
  await writeJson("package.json", {
    name: projectId,
    bin: "lib/cli.js",
    version: "1.0.0",
    description: projectId,
    engines: { node: `>=${process.version.slice(1)}` },
    scripts: {
      test: "jest",
      "test-watch": "jest --watch"
    }
  });

  //
  // Copy starter directory structure.
  //
  await copyFilesFrom(path.resolve(__dirname, "..", "template"), cwd);

  //
  // Install packages.
  //
  await runNpm("install", "--save-prod", ...TEMPLATE_PACKAGES);
  await runNpm("install", "--save-dev", ...TEMPLATE_PACKAGES_DEV);

  //
  // Run smoke test.
  //
  const testOut = await runNpm("test");
  log.info(testOut);
}

//
// Run npm.
//
async function runNpm(...args) {
  const shellCmd = ["npm", ...args].join(" ");
  return new Promise((resolve, reject) => {
    log.info(`> Running: ${shellCmd}`);
    const startTimeMs = Date.now();
    exec(shellCmd, {}, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error: ${error}\nStderr: ${stderr}`);
        return reject(new Error(error));
      }
      const runTimeSec = (Date.now() - startTimeMs) / 1000;
      log.info(`> Ran in ${runTimeSec} seconds`);
      return resolve(stdout);
    });
  });
}

//
// Copy directory tree with overwrite.
//
async function copyFilesFrom(srcDir, destDir) {
  const dirListing = await fs.readdir(srcDir);
  return Promise.all(
    dirListing.map(async filePath => {
      const fullSrcPath = path.join(srcDir, filePath);
      const fullDestPath = path.join(destDir, filePath);
      const isFile = (await fs.stat(fullSrcPath)).isFile();
      if (isFile) {
        if (fullSrcPath.match(/node_modules/i)) return;
        // Copy files.
        log.info(`> Writing: ${fullDestPath}`);
        await fs.copyFile(fullSrcPath, fullDestPath);
      } else {
        // Create directories and recurse.
        await fs.mkdir(fullDestPath);
        await copyFilesFrom(fullSrcPath, fullDestPath);
      }
    })
  );
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch(e => {
      log.error(e);
      process.exit(1);
    });
}
