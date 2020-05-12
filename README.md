![Dependencies](https://david-dm.org/mayanklahiri/cli-gen.svg)
![Build Status](https://travis-ci.org/mayanklahiri/cli-gen.svg?branch=master)

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

`npx cli-gen`

## Usage

- Initial use: in a blank directory, run `cli-gen --apply` to create a new CLI project skeleton. The project name is used to generate a new `package.json` file. Follow the development guidelines below to ensure that any skeleton code can be automatically updated in future releases.

- Upgrade boilerplate: run `cli-gen --apply` in an existing project directory. This requires that the development guidelines below are adhered to.

- Dry run: run `cli-gen` without arguments to see what `cli-gen` would have done.

- Link command globally: `npm link .`

## Development Guidelines

A single CLI command corressponding to your project name will be specfied in `package.json` under the `bin` entry. This command will perform `git`-style subcommands using the `commander` module, while setting up the CLI environment (logging, global helpers, etc.).

CLI subcommands follow a directory-based structure in the following root folder: **`lib/cli/verbs`**. A bare-bones "about" verb is created in the `about` folder.

Following the development guidelines below, user code and framework/skeleton code will be isolated for independent upgrades.

### Guideline 1

- Interface with the framework as independent `commander` subcommands.

New features should start with a subcommand folder in `lib/cli/verbs` with its specified set of options.

### Guideline 2

- Additive source changes are fine.

Files and directories can be added anywhere, as long as files **do not** include the following text on its own line:

```
/* cli-gen: auto-generated, do not edit. */
```
