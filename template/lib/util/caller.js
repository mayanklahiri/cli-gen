const path = require("path");

const BASE_PATH = path.resolve(__dirname, "..", "..");
const RE_CALLER = /\((.+):(\d+):(\d+)\)$/;
const RE_INTERNAL_MODULE = /^internal/;

exports.getCallStack = function getCaller(excludeFile) {
  const stackTrace = {};
  Error.captureStackTrace(stackTrace, arguments.caller);
  const stackLines = stackTrace.stack
    .split(/\n/gim)
    .slice(1)
    .map(stackLine => {
      const matches = RE_CALLER.exec(stackLine);
      if (!matches) return;
      const absPath = matches[1];
      if (absPath === __filename) return;
      if (excludeFile && absPath === excludeFile) return;
      const relPath = path.relative(BASE_PATH, absPath);
      const modName = relPath.length < absPath.length ? relPath : absPath;
      if (RE_INTERNAL_MODULE.exec(modName)) return;
      return matches
        ? {
            module: modName,
            basename: path.basename(relPath),
            line: parseInt(matches[2], 10),
            col: parseInt(matches[3], 10)
          }
        : null;
    })
    .filter(x => x);
  if (!stackLines) return {};
  return stackLines[0];
};
