'use strict';

const Plugin = require('broccoli-plugin');
const FSTree = require('fs-tree-diff');

function renameFile(filename) {
  return filename.replace(/\.ts$/, '.js');
}

module.exports.BroccoliBabelPresetTypeScript = class BroccoliBabelPresetTypeScript extends Plugin {
  constructor(inputs, options = { }) {
    super(inputs, { persistentOutput: true });
    this._previous = new FSTree();
    this._options = options;
  }

  build() {
    let current = this._previous;

    if (this._previous === null) {
      // the previous build attempt failed, resulting in this._previous not being set.
        // This means we have to assume something exceptional happened, and the
      // best course of action is to assume our output is corrupted and to start again;
      this.output.rmdirSync('.', { recursive: true });
      this.output.mkdirSync('.');

      current = new FSTree();
    } else {
      current = this._previous;
      this._previous = null; // set this._previous to null, so we can detect if a previous build failed or not
    }

    const next = FSTree.fromEntries(this.input.entries());
    const { sourceMaps } = this._options;

    for (const [operation, filename, entry] of current.calculatePatch(next)) {
      const renamedFile = renameFile(filename);

      switch (operation) {
        case 'unlink': {
          this.output.unlinkSync(renamedFile);
          if (sourceMaps === true || sourceMaps === 'both') {
            this.output.unlinkSync(`${renamedFile}.map`);
          }

          break;
        }
        case 'mkdir': {
          this.output.mkdirSync(filename);
          break;
        }
        case 'rmdir': {
          this.output.rmdirSync(filename);
          break;
        }
        case 'change':
        case 'create': {
          if (filename.endsWith('.ts')) {
            const input = this.input.readFileSync(filename);
            let { code, map } = require('@babel/core').transformSync(input, {
              sourceMaps,
              filename,
              presets: ['@babel/preset-typescript'],
            });

            if (sourceMaps === true || sourceMaps === 'both') {
              code = `${code}\n//# sourceMappingURL=${renamedFile}.map`;
            }

            this.output.writeFileSync(renamedFile, code);
            if (sourceMaps === true || sourceMaps === 'both') {
              this.output.writeFileSync(`${renamedFile}.map`, JSON.stringify(map));
            }

          } else if (operation === 'create') {
            // TODO: debug why relative linking was odd and required a explicit path
            this.output.symlinkSync(`${entry.basePath}/${filename}`, `${this.outputPath}/${filename}`);
          } else {
            // operation must be 'change', and our symlink should already have
            // been created, we can skip doing work now
          }

          break;
        } default: {
          throw new Error(`[BroccoliBabelPresetTypeScript] unknown operation: '${operation}'`);
        }
      }
    }
    this._previous = next;
  }
}
