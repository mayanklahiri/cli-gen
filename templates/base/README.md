## Configuration

### Environment Variables

#### Logging

- `LOG_FORMAT`: either `json` or `text`.
- `LOG_FILE`: if set, file to write log messages (default: console).
- `LOG_LEVEL`: minimum log level, one of: `trace`, `debug`, `info`, `warn`, `error`, `fatal`
- `FORCE_COLOR`: set to 0 to disable colorized logs, set to 1 to force color.

## Runbook

### Dependencies

1. **Install build tools and dependencies**: `npm i`
2. **Install only production dependencies**: `npm i --only=prod`
3. **Cleanup dependencies**: `rm -rf node_modules`
4. **Link global commands to working directory**: `[sudo] npm link`

### Testing

1. **Run all unit tests**: `npm test`
2. **Run all unit tests in watch mode (TDD)**: `npm run test-watch`
