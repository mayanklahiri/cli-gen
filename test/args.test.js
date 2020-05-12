const { parseArgs } = requireLib("args");

module.exports = async function argsTest() {
  [
    function optionOnly() {
      const { args, positionals } = parseArgs(["--foo", "123"]);
      assert(args.foo === 123);
      assert(positionals.length === 0);
    },
    function multipleOptions() {
      const { args, positionals } = parseArgs(["--foo", "123", "--bar", "str"]);
      assert(args.foo === 123);
      assert(args.bar === "str");
      assert(positionals.length === 0);
    },
    function castBool() {
      const { args } = parseArgs(["--foo", "true", "--bar", "false"]);
      assert(args.foo === true);
      assert(args.bar === false);
    },
    function positionals() {
      const { positionals } = parseArgs(["foo", "true", "bar", "-123"]);
      assert(positionals[0] === "foo");
      assert(positionals[1] === true);
      assert(positionals[2] === "bar");
      assert(positionals[3] === -123);
    }
  ].forEach(fn => fn());
};
