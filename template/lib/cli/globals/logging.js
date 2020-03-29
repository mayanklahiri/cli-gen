/* cli-gen: auto-generated, do not edit. */

const path = require("path");

const col = require("chalk");
const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const { getCallStack } = require("../../util/caller");

(function _initLogging() {
  const env = process.env;
  const isProd = env.NODE_ENV === "production";
  const logFile = env.LOG_FILE;
  const logFormat = (env.LOG_FORMAT || "text").toLowerCase();
  const logLevel = (env.LOG_LEVEL || (isProd ? "info" : "debug")).toLowerCase();

  const baseFormatter = combine(
    timestamp(),
    printf(({ level, message, module: moduleName, line, timestamp }) => {
      const moduleNameFormatted = logFile
        ? moduleName
        : path.basename(moduleName);
      const parts = [
        timestamp,
        level,
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
    async flush() {
      ended = true;
      return new Promise(resolve => {
        transports.forEach(t => t.end());
        baseLogger.on("finish", resolve);
      });
    }
  };
})();
