## Tasks

### Dependencies

1. **Install build tools and dependencies**: `npm i`
2. **Install only production dependencies**: `npm i --only=prod`
3. **Cleanup dependencies**: `rm -rf node_modules`

### Testing

1. **Run all unit tests**: `npm test`
2. **Run all unit tests in watch mode (TDD)**: `npm run test-watch`

## Configuration

### Environment Variables

#### Logging

- `LOG_FORMAT`: either `json` or `text`
- `LOG_FILE`: if set, path to a file to write log messages to rather than stdout.
- `LOG_LEVEL`: minimum log level from: `info`, `error`, `debug`
- `FORCE_COLOR`: set to 0 to disable colorized logs, set to 1 to force.
