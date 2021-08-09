# broccoli-babel-preset-typescript [![ci](https://github.com/stefanpenner/broccoli-babel-preset-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanpenner/broccoli-babel-preset-typescript/actions/workflows/ci.yml)

A broccoli plugin which only removes TypeScript types

## installation

```sh
yarn add --save broccoli-babel-preset-typescript
```

or

```sh
npm install --save broccoli-babel-preset-typescript
```

## Usage

### Within a Broccoli Pipeline
```js

const { BroccoliBabelPresetTypeScript } = require('BroccoliBabelPresetTypeScript');

// now in your broccoli pipeline
const output = new BroccoliBabelPresetTypeScript([inputNode]);
```

### Advanced Example - A standalone script

```js
#!/usr/bin/env node
'use strict';

const { Builder } = require('builder');
const { BroccoliBabelPresetTypeScript } = require('broccoli-babel-preset-typescript');
const TreeSync = require('tree-sync');

const [
  ,
  ,
  inputDirectory,
  outputDirectory,
] = process.argv;

const plugin = new BroccoliBabelPresetTypeScript([inputDirectory]);
const builder = new Builder(plugin);

(async function main() {
  try {
    const { directory } = await builder.build();
    const tree = new TreeSync(directory, outputDirectory);
    tree.sync();
  } finally {
    await builder.cleanup();
  }
}());
```

## options:

sourceMaps:
  * `true` will produce a sibling source-map file, and the required `sourceMappingURL`
  * `inline` will append a `sourceMappingURL` that contains a data URI of the sourcemapping
  * `both` will have the behavior of both `true` and `inline`
  * `false` or when omitted, will result in no sourcemaps being created (the default)
