'use strict';

const { createBuilder, createTempDir }  = require('broccoli-test-helper');
const { BroccoliBabelPresetTypeScript } = require('./index');

describe('broccoli-babel-preset-typescript', function() {
  let input;

  beforeEach(async function() {
    input = await createTempDir();
  });

  afterEach(async function() {
    await input.dispose();
  });

  it('supports source-maps=true', async function() {
    const subject = new BroccoliBabelPresetTypeScript([input.path()], { sourceMaps: true });
    const output = createBuilder(subject);

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      },
      'README.md': `## HELLO WORLD`
    });

    expect(output.changes()).toStrictEqual({});

    await output.build();

    expect(output.changes()).toStrictEqual({
      'README.md': 'create',
      'a.js': 'create',
      'a.js.map': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
      'a/b.js.map': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=a.js.map`,
      'a.js.map': '{\"version\":3,\"sources\":[\"a.ts\"],\"names\":[\"a\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAgB,GAAG,CAAC,CAAD,CAAzB\",\"sourcesContent\":[\"export const a: Array<number> = [1];\"]}',
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=a/b.js.map`,
        'b.js.map': '{\"version\":3,\"sources\":[\"b.ts\"],\"names\":[\"b\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAY,GAAG,CAAC,EAAD,CAArB\",\"sourcesContent\":[\"export const b: Array<{}> = [{}];\"]}',
      },
    });

    input.write({
      'a.ts': null,
      'a': null
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'unlink',
      'a.js.map': 'unlink',
      'a/': 'rmdir',
      'a/b.js': 'unlink',
      'a/b.js.map': 'unlink',
    });

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      }
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'create',
      'a.js.map': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
      'a/b.js.map': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=a.js.map`,
      'a.js.map': '{\"version\":3,\"sources\":[\"a.ts\"],\"names\":[\"a\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAgB,GAAG,CAAC,CAAD,CAAzB\",\"sourcesContent\":[\"export const a: Array<number> = [1];\"]}',
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=a/b.js.map`,
        'b.js.map': '{\"version\":3,\"sources\":[\"b.ts\"],\"names\":[\"b\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAY,GAAG,CAAC,EAAD,CAArB\",\"sourcesContent\":[\"export const b: Array<{}> = [{}];\"]}',
      },
    });
  });

  it('supports source-maps=both', async function() {
    const subject = new BroccoliBabelPresetTypeScript([input.path()], { sourceMaps: 'both' });
    const output = createBuilder(subject);

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      },
      'README.md': `## HELLO WORLD`
    });

    expect(output.changes()).toStrictEqual({});

    await output.build();

    expect(output.changes()).toStrictEqual({
      'README.md': 'create',
      'a.js': 'create',
      'a.js.map': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
      'a/b.js.map': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImEudHMiXSwibmFtZXMiOlsiYSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFnQixHQUFHLENBQUMsQ0FBRCxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhOiBBcnJheTxudW1iZXI+ID0gWzFdOyJdfQ==\n//# sourceMappingURL=a.js.map`,
      'a.js.map': '{\"version\":3,\"sources\":[\"a.ts\"],\"names\":[\"a\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAgB,GAAG,CAAC,CAAD,CAAzB\",\"sourcesContent\":[\"export const a: Array<number> = [1];\"]}',
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImIudHMiXSwibmFtZXMiOlsiYiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFZLEdBQUcsQ0FBQyxFQUFELENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGI6IEFycmF5PHt9PiA9IFt7fV07Il19\n//# sourceMappingURL=a/b.js.map`,
        'b.js.map': '{\"version\":3,\"sources\":[\"b.ts\"],\"names\":[\"b\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAY,GAAG,CAAC,EAAD,CAArB\",\"sourcesContent\":[\"export const b: Array<{}> = [{}];\"]}',
      },
    });

    input.write({
      'a.ts': null,
      'a': null
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'unlink',
      'a.js.map': 'unlink',
      'a/': 'rmdir',
      'a/b.js': 'unlink',
      'a/b.js.map': 'unlink',
    });

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      }
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'create',
      'a.js.map': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
      'a/b.js.map': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImEudHMiXSwibmFtZXMiOlsiYSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFnQixHQUFHLENBQUMsQ0FBRCxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhOiBBcnJheTxudW1iZXI+ID0gWzFdOyJdfQ==\n//# sourceMappingURL=a.js.map`,
      'a.js.map': '{\"version\":3,\"sources\":[\"a.ts\"],\"names\":[\"a\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAgB,GAAG,CAAC,CAAD,CAAzB\",\"sourcesContent\":[\"export const a: Array<number> = [1];\"]}',
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImIudHMiXSwibmFtZXMiOlsiYiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFZLEdBQUcsQ0FBQyxFQUFELENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGI6IEFycmF5PHt9PiA9IFt7fV07Il19\n//# sourceMappingURL=a/b.js.map`,
        'b.js.map': '{\"version\":3,\"sources\":[\"b.ts\"],\"names\":[\"b\"],\"mappings\":\"AAAA,OAAO,MAAMA,CAAY,GAAG,CAAC,EAAD,CAArB\",\"sourcesContent\":[\"export const b: Array<{}> = [{}];\"]}',
      },
    });
  });

  it('supports source-maps=inline', async function() {
    const subject = new BroccoliBabelPresetTypeScript([input.path()], { sourceMaps: 'inline' });
    const output = createBuilder(subject);

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      },
      'README.md': `## HELLO WORLD`
    });

    expect(output.changes()).toStrictEqual({});

    await output.build();

    expect(output.changes()).toStrictEqual({
      'README.md': 'create',
      'a.js': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImEudHMiXSwibmFtZXMiOlsiYSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFnQixHQUFHLENBQUMsQ0FBRCxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhOiBBcnJheTxudW1iZXI+ID0gWzFdOyJdfQ==`,
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImIudHMiXSwibmFtZXMiOlsiYiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFZLEdBQUcsQ0FBQyxFQUFELENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGI6IEFycmF5PHt9PiA9IFt7fV07Il19`,
      },
    });

    input.write({
      'a.ts': null,
      'a': null
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'unlink',
      'a/': 'rmdir',
      'a/b.js': 'unlink',
    });

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      }
    });

    await output.build();

    expect(output.changes()).toStrictEqual({
      'a.js': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a.js': `export const a = [1];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImEudHMiXSwibmFtZXMiOlsiYSJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFnQixHQUFHLENBQUMsQ0FBRCxDQUF6QiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBhOiBBcnJheTxudW1iZXI+ID0gWzFdOyJdfQ==`,
      'a': {
        'b.js': `export const b = [{}];\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImIudHMiXSwibmFtZXMiOlsiYiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNQSxDQUFZLEdBQUcsQ0FBQyxFQUFELENBQXJCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGI6IEFycmF5PHt9PiA9IFt7fV07Il19`,
      },
    });
  });

  it('smoke test', async function() {
    const subject = new BroccoliBabelPresetTypeScript([input.path()]);
    const output = createBuilder(subject);

    input.write({
      'a.ts': `export const a: Array<number> = [1];`,
      'a': {
        'b.ts': `export const b: Array<{}> = [{}];`,
      },
      'README.md': `## HELLO WORLD`
    });

    expect(output.changes()).toStrictEqual({});

    await output.build();

    expect(output.changes()).toStrictEqual({
      'README.md': 'create',
      'a.js': 'create',
      'a/': 'mkdir',
      'a/b.js': 'create',
    });

    expect(output.read()).toStrictEqual({
      'a.js': `export const a = [1];`,
      'a': {
        'b.js': `export const b = [{}];`,
      },
      'README.md': `## HELLO WORLD`
    });

    input.write({'a.ts': null });
    input.write({'a': { 'b.ts': null } });

    await output.build(); 

    expect(output.changes()).toStrictEqual({
      'a.js': 'unlink',
      'a/b.js': 'unlink',
    });

    expect(output.read()).toStrictEqual({
      'README.md': `## HELLO WORLD`,
      'a': {},
    });

    input.write({
      'a.ts':  `export const a: Array<string> = ['one']`,
      'a': {
        'b.ts': `export const b: Array<string> = ['object'];`,
      }
    });

    await output.build();
    expect(output.changes()).toStrictEqual({
      'a.js': 'create',
      'a/b.js': 'create',
    });
    expect(output.read()).toStrictEqual({
      'a.js': `export const a = ['one'];`,
      'a': {
        'b.js': `export const b = ['object'];`,
      },
      'README.md': `## HELLO WORLD`
    });

    await output.build(); // let's just make sure we can rebuild a few times with no changes
    expect(output.read()).toStrictEqual({
      'a.js': `export const a = ['one'];`,
      'a': {
        'b.js': `export const b = ['object'];`,
      },
      'README.md': `## HELLO WORLD`
    });

    await output.build(); // let's just make sure we can rebuild a few times with no changes

    expect(output.read()).toStrictEqual({
      'a.js': `export const a = ['one'];`,
      'a': {
        'b.js': `export const b = ['object'];`,
      },
      'README.md': `## HELLO WORLD`
    });

    input.write({
      'a.ts':  `export const a: Array<string> = ['two']`,
      'a': {
        'b.ts': `export const b: Array<string> = ['three'];`,
      }
    });

    await output.build(); 
    expect(output.changes()).toStrictEqual({
      'a.js': 'change',
      'a/b.js': 'change',
    }); 

    expect(output.read()).toStrictEqual({
      'a.js': `export const a = ['two'];`,
      'a': {
        'b.js': `export const b = ['three'];`,
      },
      'README.md': `## HELLO WORLD`
    });

    input.write({
      'a': null
    });
    await output.build(); 
    expect(output.changes()).toStrictEqual({
      'a/': 'rmdir',
      'a/b.js': 'unlink'
    }); 

    expect(output.read()).toStrictEqual({
      'a.js': `export const a = ['two'];`,
      'README.md': `## HELLO WORLD`
    });
  });
});
