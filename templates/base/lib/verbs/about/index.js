/* cli-gen: auto-generated, do not edit. Remove this line to disable template updates. */

module.exports = program => {
  program
    .command("about")
    .description("Introspect runtime version and environment information.")
    .action((...a) => require("./main")(...a));
};
