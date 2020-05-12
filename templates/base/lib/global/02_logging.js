/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

const path = require("path");
const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const BASE_PATH = pkgRoot();
const RE_CALLER = /\((.+):(\d+):(\d+)\)$/;
const RE_INTERNAL_MODULE = /^internal/;
const LOG_FLUSH_WAIT_MS = 200;

const LEVEL_COLORS = {
  info: x => x,
  warn: col.yellow,
  error: col.red,
  debug: col.gray,
  trace: col.cyan
};

(function _initLogging() {
  const env = process.env;
  const isProd = env.NODE_ENV === "production";
  const logFile = env.LOG_FILE;
  const logFormat = (env.LOG_FORMAT || "text").toLowerCase();
  const logLevel = (env.LOG_LEVEL || (isProd ? "info" : "debug")).toLowerCase();

  const baseFormatter = combine(
    timestamp(),
    printf(({ level, message, module: moduleName, line, timestamp }) => {
      let moduleNameFormatted;
      try {
        moduleNameFormatted = logFile ? moduleName : path.basename(moduleName);
      } catch (e) {
        moduleNameFormatted = "<unknown>";
      }
      const parts = [
        timestamp,
        LEVEL_COLORS[level](level),
        moduleNameFormatted
          ? col.gray(`[${moduleNameFormatted}:${line}]`)
          : null,
        message
      ].filter(x => x);
      return parts.join(" ");
    })
  );

  const transports = [
    logFile ? null : new winston.transports.Console(),
    logFile
      ? new winston.transports.File({ filename: logFile, level: logLevel })
      : null
  ].filter(x => x);

  const baseLogger = winston.createLogger({
    level: logLevel,
    defaultMeta: { pid: process.pid },
    format: logFormat === "json" ? winston.format.json() : baseFormatter,
    transports
  });

  let ended = false;

  global.log = {
    info(...a) {
      if (ended) return;
      const stack = getCallStack(__filename);
      return baseLogger.info(...a, stack);
    },
    warn(...a) {
      if (ended) return;
      const stack = getCallStack(__filename);
      return baseLogger.warn(...a, stack);
    },
    error(...a) {
      if (ended) return;
      const stack = getCallStack(__filename);
      return baseLogger.error(...a, stack);
    },
    debug(...a) {
      if (ended) return;
      const stack = getCallStack(__filename);
      return baseLogger.debug(...a, stack);
    },
    trace(...a) {
      if (ended) return;
      const stack = getCallStack(__filename);
      return baseLogger.trace(...a, stack);
    },
    async flush() {
      return new Promise(resolve => {
        if (ended) return;
        setTimeout(() => {
          ended = true;
          transports.forEach(t => t.end());
          baseLogger.end();
          baseLogger.once("finish", () => resolve());
        }, LOG_FLUSH_WAIT_MS);
      });
    }
  };
})();

function getCallStack(excludeFile) {
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
}
