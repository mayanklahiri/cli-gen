const { log } = global;

test("Smoke test.", () => {
  log.debug("DEBUG message");
  log.info("INFO message");
});
