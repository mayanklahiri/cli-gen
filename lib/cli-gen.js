#!/usr/bin/env node
require("./global");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs").promises;

const { parseArgs } = require("./args");
const {
  copyIfSentinelPresent,
  copyIfNotPresent,
  isDirectory,
  isFile,
  expandFileSpecs,
  getTemplateConfig
} = require("./fs-util");

const SENTINEL = "/* cli-gen: auto-generated, do not edit. */";
const TEMPLATES_PKG_DIR = "templates";
const DEFAULT_TEMPLATE = "base";
let DRY_RUN = true;

async function main(argv) {
  const { args } = parseArgs(argv);
  if (args.apply) {
    DRY_RUN = false;
    log.info(`Changes will be written to disk!`);
  } else {
    log.warn(
      `DRY-RUN mode because --apply is not specified. No changes written to disk.`
    );
  }

  // Determine validity of working and template directories.
  const wd = args.workdir || process.cwd();
  const templateDir =
    args.template || pkgRoot(TEMPLATES_PKG_DIR, DEFAULT_TEMPLATE);
  assert(
    await isDirectory(templateDir),
    `Template path "${templateDir}" is not a directory.`
  );

  // Read template definition.
  const templateConfig = await getTemplateConfig(templateDir);

  // Update project.
  await updateProject(wd, templateDir, templateConfig, args);

  // Install packages.
  if (!(await isDirectory(path.join(wd, "node_modules")))) {
    log.info(`${DRY_RUN ? "[dry-run]" : ""} run: npm install`);
    if (!DRY_RUN) {
      await shellExec("npm install", wd);
    }
  }

  // Run tests.
  if (!args["no-tests"]) {
    log.info(`${DRY_RUN ? "[dry-run]" : ""} run: npm test`);
    if (!DRY_RUN) {
      await shellExec("npm test", wd);
    }
  }
}

async function updateProject(wd, templateDir, templateConfig, args) {
  const opt = {
    ignoreFilePatterns: templateConfig.ignoreFilePatterns
  };

  // Execute copy actions.
  const { paths } = templateConfig;

  // Files block: copyIfNotPresent
  if (paths.copyIfNotPresent) {
    const srcFiles = await expandFileSpecs(
      templateDir,
      paths.copyIfNotPresent,
      opt
    );
    await Promise.all(
      srcFiles.map(async fileInfo => {
        const srcPath = fileInfo.absPath;
        const destPath = path.join(wd, fileInfo.relPath);
        await copyIfNotPresent(srcPath, destPath, DRY_RUN);
      })
    );
  }

  // Files block: copyIfSentinelPresent
  if (paths.copyIfSentinelPresent) {
    const srcFiles = await expandFileSpecs(
      templateDir,
      paths.copyIfSentinelPresent,
      opt
    );
    await Promise.all(
      srcFiles.map(async fileInfo => {
        const srcPath = fileInfo.absPath;
        const destPath = path.join(wd, fileInfo.relPath);
        await copyIfSentinelPresent(srcPath, destPath, DRY_RUN, SENTINEL);
      })
    );
  }

  // Generate package.json if it does not exist.
  const pkgJsonPath = path.resolve(wd, "package.json");
  if (!(await isFile(pkgJsonPath))) {
    log.info(`${DRY_RUN ? "[dry-run]" : ""} create: package.json`);
    if (!DRY_RUN) {
      await genPackageJson(pkgJsonPath, templateConfig);
    }
  } else {
    if (templateConfig.scripts) {
      log.info(`${DRY_RUN ? "[dry-run]" : ""} update: package.json`);
      const pkgJson = require(pkgJsonPath);
      Object.assign(pkgJson, { scripts: templateConfig.scripts });
      if (!DRY_RUN) {
        await fs.writeFile(pkgJsonPath, jsonify(pkgJson), "utf-8");
      }
    }
  }
}

/**
 * Generate a blank package.json
 */
async function genPackageJson(outPath, templateConfig) {
  const pkgJson = {
    name: path.basename(path.dirname(outPath)),
    bin: "lib/cli/cli.js",
    version: "0.1.0",
    engines: { node: `>=${process.version.slice(1)}` },
    scripts: templateConfig.scripts
  };
  await fs.writeFile(outPath, jsonify(pkgJson), "utf-8");

  // Install dependencies at latest.
  if (templateConfig.packages) {
    await shellExec(
      ["npm", "install", "--save-prod", ...templateConfig.packages].join(" "),
      path.dirname(outPath)
    );
  }

  if (templateConfig.devPackages) {
    await shellExec(
      ["npm", "install", "--save-dev", ...templateConfig.devPackages].join(" "),
      path.dirname(outPath)
    );
  }
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then(() => process.exit(0))
    .catch(e => {
      log.error(`Fatal error: ${e}\n${e.stack.toString()}`);
      process.exit(1);
    });
}
