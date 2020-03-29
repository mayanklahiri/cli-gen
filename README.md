# cli-gen

Dependency-free, opinionated node.js CLI skeleton generator that is structured to allow automatic upgrading of template code.

Opinions:

- CLI framework: `commander`
- Logging: `winston`
- Promise flow control: `async`
- Functional programming: `lodash`

## Install

Globally as CLI tool:

`npm install -g cli-gen`

Use without installing using npx:

`npx cli-gen <project identifier>`

## Usage

- Initial use: in a blank directory, run `cli-gen <project id>`
- Upgrade framework: run `cli-gen` in existing project directory
