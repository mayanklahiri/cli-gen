/* cli-gen: auto-generated, do not edit. */
module.exports = program => {
  program
    .command("about")
    .description("Introspect runtime version and environment information.")
    .action((...a) => require("./main")(...a));
};
