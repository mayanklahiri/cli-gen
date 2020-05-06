module.exports = {
  ignoreFilePatterns: [/node_modules/, /^.git$/],
  paths: {
    copyIfNotPresent: ["README.md", "jest.config.js", ".gitignore"],
    copyIfSentinelPresent: ["lib", "__test__"]
  },
  packages: ["async", "chalk", "commander", "lodash", "winston"],
  devPackages: ["jest"],
  scripts: {
    test: "jest",
    "test-watch": "jest --watch"
  }
};
