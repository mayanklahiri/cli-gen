function parseArgs(argv) {
  const args = {};
  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.slice(0, 2) === "--") {
      args[arg.slice(2)] = true;
      const nextVal = i + 1 < argv.length ? argv[i + 1] : null;
      if (argv.length >= i + 1 && nextVal && nextVal.slice(0, 2) !== "--") {
        args[arg.slice(2)] = castBoolSafe(castIntSafe(nextVal));
        i++;
      }
    } else {
      positionals.push(castBoolSafe(castIntSafe(arg)));
    }
  }
  return { args, positionals };
}

module.exports = {
  parseArgs
};
