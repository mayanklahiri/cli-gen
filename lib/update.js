const path = require("path");
const fs = require("fs").promises;

const {
  copyIfSentinelPresent,
  copyIfNotPresent,
  isDirectory,
  isFile,
  expandFileSpecs,
  getTemplateConfig
} = require("./fs-util");

const SENTINEL = "/* cli-gen: auto-generated, do not edit.";

class ProjectUpdater {
  constructor(wd, templateDir, opt) {
    this.wd = wd;
    this.templateDir = templateDir;
    this.opt = opt;
    this.dryRun = !opt.apply;
    this.templateConfig = getTemplateConfig(templateDir);
  }

  async update() {
    const {
      templateConfig: { fileActions, name },
      opt
    } = this;

    // Run file actions.
    await Promise.all(
      fileActions.map(async fileAction => await this.runFileAction(fileAction))
    );

    // Create or update package.json.
    await this.updatePackageJson();

    // Mark binpath executable.
    await this.markBinExecutable();

    // Run tests.
    await this.runTests();

    if (opt.apply) {
      log.info(`Project updated from template "${name}".`);
    } else {
      log.warn(
        `===> Dry run complete. Run with --apply to write changes to directory. <===`
      );
    }
  }

  async runFileAction(fileAction) {
    const { wd, templateDir, opt, dryRun } = this;

    switch (fileAction.action) {
      case "copy_if_not_present": {
        const fileList = await expandFileSpecs(
          templateDir,
          fileAction.specs,
          opt
        );
        await Promise.all(
          fileList.map(async fileInfo => {
            const srcPath = fileInfo.absPath;
            const destPath = path.join(wd, fileInfo.relPath);
            await copyIfNotPresent(srcPath, destPath, dryRun);
          })
        );
        break;
      }

      case "copy_if_sentinel_present": {
        const fileList = await expandFileSpecs(
          templateDir,
          fileAction.specs,
          opt
        );
        await Promise.all(
          fileList.map(async fileInfo => {
            const srcPath = fileInfo.absPath;
            const destPath = path.join(wd, fileInfo.relPath);
            await copyIfSentinelPresent(srcPath, destPath, dryRun, SENTINEL);
          })
        );

        break;
      }

      default: {
        throw new Error(`Unknown file action: ${fileAction.action}`);
      }
    }
  }

  async updatePackageJson() {
    const { wd, templateConfig, dryRun } = this;

    const pkgJsonPath = path.resolve(wd, "package.json");
    if (!(await isFile(pkgJsonPath))) {
      log.info(`${dryRun ? "[dry-run]" : ""} create: package.json`);
      if (!dryRun) {
        await this.genPackageJson(pkgJsonPath, templateConfig);
      }
    } else {
      if (templateConfig.scripts) {
        const pkgJson = require(pkgJsonPath);
        Object.assign(pkgJson, { scripts: templateConfig.scripts });
        if (!dryRun) {
          await fs.writeFile(pkgJsonPath, jsonify(pkgJson), "utf-8");
        }
      }
    }
  }

  async installPackages() {
    const { wd, dryRun, opt } = this;
    if (opt["no-install"]) {
      return;
    }
    if (!(await isDirectory(path.join(wd, "node_modules")))) {
      log.info(`${dryRun ? "[dry-run]" : ""} run: npm install`);
      if (!dryRun) {
        await shellExec("npm install", wd);
      }
    }
  }

  async runTests() {
    const { wd, dryRun, opt } = this;

    if (!opt["no-tests"]) {
      log.info(`${dryRun ? "[dry-run]" : ""} run: npm test`);
      if (!dryRun) {
        await shellExec("npm test", wd);
      }
    }
  }

  async genPackageJson(outPath, templateConfig) {
    const { dryRun } = this;

    const pkgJson = {
      name: path.basename(path.dirname(outPath)),
      bin: templateConfig.binPath,
      version: "0.1.0",
      engines: { node: `>=${process.version.slice(1)}` },
      scripts: templateConfig.scripts
    };
    await fs.writeFile(outPath, jsonify(pkgJson), "utf-8");

    if (templateConfig.packages.prod) {
      const args = [
        "npm",
        "install",
        "--save-prod",
        ...templateConfig.packages.prod
      ].join(" ");
      log.info(`${dryRun ? "[dry-run]" : ""} run: ${args}`);
      await shellExec(args, path.dirname(outPath));
    }

    if (templateConfig.packages.dev) {
      const args = [
        "npm",
        "install",
        "--save-dev",
        ...templateConfig.packages.dev
      ].join(" ");
      log.info(`${dryRun ? "[dry-run]" : ""} run: ${args}`);
      await shellExec(args, path.dirname(outPath));
    }
  }

  async markBinExecutable() {
    const { wd, templateConfig, dryRun } = this;

    const binAbsPath = path.join(wd, templateConfig.binPath);
    if (await isFile(binAbsPath)) {
      log.info(`${dryRun ? "[dry-run]" : ""} mark-exec: ${binAbsPath}`);
      if (!dryRun) {
        await fs.chmod(binAbsPath, 0o555);
      }
    }
  }
}

module.exports = {
  ProjectUpdater
};
