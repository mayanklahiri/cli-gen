module.exports = {
  name: "base",
  ignoreFilePatterns: [/node_modules/, /^.git$/],
  fileActions: [
    {
      action: "copy_if_not_present",
      specs: ["README.md", "jest.config.js", ".gitignore"]
    },
    {
      action: "copy_if_sentinel_present",
      specs: ["lib", "__tests__"]
    }
  ],
  packages: {
    prod: ["async", "chalk", "commander", "lodash", "winston"],
    dev: ["jest"]
  },
  scripts: {
    test: "jest",
    "test-watch": "jest --watch"
  },
  binPath: "lib/cli/cli.js"
};
