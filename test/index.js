require("../lib/global");

Promise.all(
  [require("./template.test"), require("./args.test")].map(testFn => testFn())
);
