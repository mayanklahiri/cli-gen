const fs = require("fs").promises;
const fsConst = require("fs").constants;
const path = require("path");

const TEMPLATE_CONFIG_FILE = "template";
const DRY_RUN_STR = "[dry-run]";

module.exports = {
  copyIfSentinelPresent,
  copyIfNotPresent,
  expandFileSpecs,
  exists,
  isDirectory,
  isFile,
  getTemplateConfig,
  walk
};

async function exists(inFile) {
  try {
    await fs.access(inFile, fsConst.R_OK);
  } catch (e) {
    if (e.code === "ENOENT") {
      return false;
    }
    throw e;
  }
  return true;
}

async function isFile(inFile) {
  return (await exists(inFile)) && (await fs.stat(inFile)).isFile();
}

async function isDirectory(inDir) {
  return (await exists(inDir)) && (await fs.stat(inDir)).isDirectory();
}

function getTemplateConfig(templRootDir) {
  return require(path.join(templRootDir, TEMPLATE_CONFIG_FILE), "utf-8");
}

async function expandFileSpecs(rootDir, inSpecs, opt) {
  const allFiles = {};
  await Promise.all(
    inSpecs.map(async spec => {
      const files = await walk(rootDir, path.resolve(rootDir, spec), opt);
      Object.assign(allFiles, files);
    })
  );
  return Object.values(allFiles)
    .flat()
    .sort((a, b) => {
      if (a.directory && !b.directory) {
        return -1;
      }
      if (b.directory && !a.directory) {
        return 1;
      }
      return a.relPath.localeCompare(b.relPath);
    });
}

async function walk(rootDir, absPath, opt) {
  const allFiles = {};
  const ignoreFilePatterns = opt.ignoreFilePatterns || [];

  // If absPath is a file, return it as an array of size 1.
  if (await isFile(absPath)) {
    const relPath = path.relative(rootDir, absPath);
    const single = {};
    single[relPath] = [
      {
        absPath,
        relPath,
        name: path.basename(absPath)
      }
    ];
    return single;
  }

  // If absPath is a directory, walk it recursively.
  await _inner(absPath);

  async function _inner(inDir) {
    const dirListing = await fs.readdir(inDir);
    await Promise.all(
      dirListing.map(async file => {
        const absPath = path.join(inDir, file);
        const relPath = path.relative(rootDir, absPath);
        let ignore = false;
        ignoreFilePatterns.forEach(pat => {
          if (pat.exec(file)) {
            ignore = true;
          }
        });
        if (ignore) return;
        if (await isDirectory(absPath)) {
          await _inner(absPath);
        } else {
          allFiles[relPath] = {
            absPath,
            relPath,
            name: path.basename(absPath)
          };
        }
      })
    );
  }

  return allFiles;
}

async function copyIfNotPresent(src, dest, dryRun) {
  // If destination is a current file, ignore.
  if (await isFile(dest)) {
    // no-op
    log.info(`${dryRun ? DRY_RUN_STR : ""} ignore-existing: ${dest}`);
    return;
  }

  // Create destination directory if missing.
  const destDir = path.dirname(dest);
  if (!(await isDirectory(destDir))) {
    log.info(`${dryRun ? DRY_RUN_STR : ""} create-dir: ${destDir}`);
    if (!dryRun) {
      await fs.mkdir(destDir, {
        recursive: true
      });
    }
  }

  // Copy source to destination.
  log.info(`${dryRun ? DRY_RUN_STR : ""} copy-file: ${dest}`);
  if (!dryRun) {
    await fs.copyFile(src, dest);
  }

  // Mark destination read-only
  if (!dryRun) {
    await fs.chmod(dest, 0o444);
    log.info(` set-readonly: ${dest}`);
  }
}

async function copyIfSentinelPresent(src, dest, dryRun, sentinelStr) {
  if (await isFile(dest)) {
    if (await fileHasSentinelHeader(dest, sentinelStr)) {
      if (await filesDiffer(src, dest)) {
        // Mark destination read-write
        if (!dryRun) {
          await fs.chmod(dest, 0o644);
          log.info(` set-writeable: ${dest}`);
        }

        // Copy/overwrite file
        log.info(`${dryRun ? DRY_RUN_STR : ""} copy-changed: ${dest}`);
        await fs.copyFile(src, dest);

        // Mark destination read-only
        if (!dryRun) {
          await fs.chmod(dest, 0o444);
          log.info(` set-readonly: ${dest}`);
        }
      } else {
        log.info(`${dryRun ? DRY_RUN_STR : ""} ignore-unchanged: ${dest}`);
      }
    } else {
      log.info(`${dryRun ? DRY_RUN_STR : ""} ignore-modified: ${dest}`);
    }
  } else {
    await copyIfNotPresent(src, dest, dryRun);
  }
}

async function fileHasSentinelHeader(inFile, sentinelStr) {
  return (await fs.readFile(inFile, "utf-8")).indexOf(sentinelStr) !== -1;
}

async function filesDiffer(src, dest) {
  return !(await fs.readFile(src)).equals(await fs.readFile(dest));
}
