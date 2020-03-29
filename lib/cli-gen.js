#!/usr/bin/env node
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

const log = console;
const jsonify = a => JSON.stringify(a, null, 2);
const writeJson = (p, v) => fs.writeFile(p, jsonify(v), "utf-8");

/**
 * Packages to install into 'dependencies'
 */
const TEMPLATE_PACKAGES = ["async", "chalk", "commander", "winston"];

/**
 * Packages to install into 'devDependencies'
 */
const TEMPLATE_PACKAGES_DEV = ["jest"];

/**
 * Files to only copy on intial import. Otherwise, prefer existing version on disk.
 */
const TEMPLATE_OVERWRITE_EXCLUDES = {
  ".gitignore": true,
  "README.md": true,
  "package.json": true,
  "package-lock.json": true,
  "jest.config.js": true
};

async function main(args) {
  const wd = process.cwd();

  // Determine project name
  const projectId = await getProjectId(args, wd);

  // Selectively copy template directory structure.
  log.info(`> Updating project: ${projectId}`);
  await copyFilesFrom(path.resolve(__dirname, "..", "template"), wd);

  // Run tests.
  log.info(await runNpm("test -- smoke.test.js"));
}

/**
 * Get project name from command-line or working directory package.
 *
 * @param  {array} args Command-line arguments array
 * @param  {string} wd Working directory
 * @returns {string}
 */
async function getProjectId(args, wd) {
  // Prefer existing package.json in working directory.
  const pkgJsonPath = path.join(wd, "package.json");
  try {
    if (await fs.stat(pkgJsonPath)) {
      return require(pkgJsonPath).name;
    }
  } catch (e) {
    if (!e.message.match(/ENOENT/i)) {
      throw new Error(`Cannot read existing package.json: ${e}`);
    }
  }

  // Fall back to command-line argument and generate package.json
  if (!args.length) {
    console.error(`Usage: cli-gen <project package name>`);
    console.error(
      `WARNING: this may overwrite and create files in the working directory.`
    );
    return process.exit(1);
  }
  const projectId = args[0].replace(/\s+/gim, "");
  if (!projectId.length) {
    throw new Error(`Invalid project name "${args[0]}".`);
  }
  await genPackageJson(projectId);

  return projectId;
}

/**
 * Generate a blank package.json
 */
async function genPackageJson(projectId) {
  log.info(`> Creating new package.json for project: ${projectId}`);
  await writeJson("package.json", {
    name: projectId,
    bin: "lib/cli/cli.js",
    version: "1.0.0",
    description: projectId,
    engines: { node: `>=${process.version.slice(1)}` },
    scripts: {
      test: "jest",
      "test-watch": "jest --watch"
    }
  });

  // Install dependencies at latest.
  await runNpm("install", "--save-prod", ...TEMPLATE_PACKAGES);
  await runNpm("install", "--save-dev", ...TEMPLATE_PACKAGES_DEV);
}

/**
 * Copy template tree with selective overwrite to destination root.
 *
 * @param {string} srcDir Template tree root path.
 * @param {string} destDir Output tree root path.
 */
async function copyFilesFrom(srcDir, destDir) {
  const dirListing = await fs.readdir(srcDir);
  return Promise.all(
    dirListing.map(async filePath => {
      const fullSrcPath = path.join(srcDir, filePath);
      const fullDestPath = path.join(destDir, filePath);

      if (fullSrcPath.match(/node_modules/i)) return;
      const isFile = (await fs.stat(fullSrcPath)).isFile();

      if (isFile) {
        // Check if file should be blindly updated.
        if (await checkIfCopyableFile(fullSrcPath, fullDestPath)) {
          log.info(`> Write: ${fullDestPath}`);
          await fs.copyFile(fullSrcPath, fullDestPath);
        }
      } else {
        // Create directories and recurse.
        try {
          await fs.mkdir(fullDestPath);
        } catch (e) {
          if (!e.message.match(/EEXIST/i)) {
            throw new Error(
              `Cannot create output directory "${fullDestPath}": ${e}`
            );
          }
        }
        await copyFilesFrom(fullSrcPath, fullDestPath);
      }
    })
  );
}

async function checkIfCopyableFile(srcPath, destPath) {
  try {
    await fs.stat(destPath);
    // File exists, do not copy if file is in the excluded list.
    if (TEMPLATE_OVERWRITE_EXCLUDES[path.basename(srcPath)]) {
      return false;
    }
  } catch (e) {
    if (e.message.match(/ENOENT/i)) {
      return true;
    }
    throw e;
  }
  return true;
}

/**
 * Run npm commands in a shell.
 *
 * @param  {...any} args
 */
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

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch(e => {
      log.error(e);
      process.exit(1);
    });
}
