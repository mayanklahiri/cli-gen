# cli-gen

Dependency-free, opinionated node.js CLI skeleton generator that is structured to allow automatic rolling upgrades of framework code.

Opinionated choices:

- CLI framework: `commander`
- Logging: `winston`
- Tests: `jest`
- Promise flow control: `async`
- Console colors: `chalk`

All packages are installed at the latest release on new project creation using `npm install`.

## Install

Install the global `cli-gen` executable:

`npm install -g cli-gen`

Or use without installing by using `npx` (not `npm`):

`npx cli-gen -h`

## Usage

- Initial use: in a blank directory, run `cli-gen <project name>` to create a new CLI project skeleton. The project name is used to generate a new `package.json` file. Follow the development guidelines below to enable auto-upgrade of framework code.

- Upgrade framework: run `cli-gen` in an existing project directory without any arguments to upgrade any auto-generated files. This requires that the development guidelines below are followed.

## Development Guidelines

After running `cli-gen <project name>` in an empty directory, you will have the starter skeleton project.

A single CLI command corressponding to your project name will be specfied in `package.json` under the `bin` entry. This command will perform `git`-style subcommands using the `commander` module, while setting up the CLI environment (logging, global helpers, etc.).

The global CLI command can be symbolically linked to a local project directoy using `[sudo] npm link .` for development.

CLI subcommands follow a directory-based structure in the following root folder: **`lib/cli/commands`**. A bare-bones "about" subcommand is created in the `about` folder (and subcommand of the same name).

Following the development guidelines below, user code and framework/skeleton code will be isolated for independent upgrades.

### Guideline 1

- Interface with the framework as independent `commander` subcommands.

New features should start with a subcommand folder in `lib/cli/commands` with its specified set of options.

### Guideline 2

- Additive source changes are fine.

Files and directories can be added anywhere, as long as files **do not** include the following text on its own line:

```
/* cli-gen: auto-generated, do not edit. */
```

## Safe Files

The following files will never be overwritten or modified. However, they may be created if they do not exist.

1. `package.json`
2. `package-lock.json`
3. `README.md`
4. `jest.config.js`
5. `.gitignore`
