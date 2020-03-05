import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

function replaceJsMacro(input, expected, fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8')): void {
  rcs.selectorsLibrary.fillLibrary(fillLibrary);
  rcs.cssVariablesLibrary.fillLibrary(fillLibrary);

  expect(rcs.replace.js(input)).toBe(expected);
  expect(rcs.replace.js(Buffer.from(input))).toBe(expected);
}

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.cssVariablesLibrary.reset();
});

it('replace classes', () => {
  replaceJsMacro(
    'var test = \' something \';\nconst myClass = "jp-block";',
    'var test = \' something \';\nconst myClass = "a";',
  );
});

it('replace nothing on hex', () => {
  replaceJsMacro(
    "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
    "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
  );
});

it('should fail to parse jsx', () => {
  const input = fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8');

  expect(() => {
    rcs.replace.js(input, { ecmaFeatures: { jsx: false } });
  }).toThrow();
});

it('should replace although jsx is disabled', () => {
  const fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8');
  const input = fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8');
  const expected = fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8');

  rcs.selectorsLibrary.fillLibrary(fillLibrary);

  expect(rcs.replace.js(input, { ecmaFeatures: { jsx: false } })).toBe(expected);
  expect(rcs.replace.js(Buffer.from(input), { ecmaFeatures: { jsx: false } })).toBe(expected);
});

it('replace everything from file', () => {
  replaceJsMacro(
    fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8'),
  );
});

it('replace react components', () => {
  replaceJsMacro(
    fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8'),
  );
});

it('replace escaped prefixes | issue #67', () => {
  replaceJsMacro(
    'var test = "something:withPrefix";\nconst myClass = "jp-block";',
    'var test = "a";\nconst myClass = "b";',
    '.something\\:withPrefix:after{} .jp-block{}',
  );
});

it('check optional try catch | issue #73', () => {
  replaceJsMacro(
    `
      try {
        const selector = "jp-block";
      } catch {
        const selector = "jp-block-two";
      }
    `,
    `
      try {
        const selector = "a";
      } catch {
        const selector = "b";
      }
    `,
    '.jp-block{}.jp-block-two{}',
  );
});

it('check "key" in object non replacement | issue #83', () => {
  replaceJsMacro(
    `
      const key = "jp-block" in obj;
    `,
    `
      const key = "jp-block" in obj;
    `,
    '.jp-block{}',
  );
});

it('replace in template | issue #84', () => {
  replaceJsMacro(
    'const templ = `<div class="jp-block" id="someid">`;',
    'const templ = `<div class="a" id="a">`;',
    '.jp-block{}#someid{}',
  );
});

it('replace in template | more complex', () => {
  replaceJsMacro(
    'const templ = `<div class="jp-block jp-pseudo" id="someid">`;',
    'const templ = `<div class="a b" id="a">`;',
    '.jp-block{}.jp-pseudo{}#someid{}',
  );
});

it('replace in template | with class for id', () => {
  replaceJsMacro(
    'const templ = `<div class="jp-block jp-pseudo" id="jp-block">`;',
    'const templ = `<div class="a b" id="jp-block">`;',
    '.jp-block{}.jp-pseudo{}#someid{}',
  );
});

it('replace in template | with id for class', () => {
  replaceJsMacro(
    'const templ = `<div class="someid jp-pseudo" id="someid">`;',
    'const templ = `<div class="someid b" id="a">`;',
    '.jp-block{}.jp-pseudo{}#someid{}',
  );
});


it('replace css variables | issue rename-css-selectors#38', () => {
  replaceJsMacro(
    `
      const defaultProps = {
        secondary: false,
        offset: "var(--header-height)",
      };
    `,
    `
      const defaultProps = {
        secondary: false,
        offset: "var(--a)",
      };
    `,
    ':root { --header-height: #7EA }',
  );
});

it('should add no conflict with jsx enabled', () => {
  replaceJsMacro(
    `
      const text = 'This has no conflicts';
    `,
    `
      const text = 'This has no conflicts';
    `,
    '.has { content: "nothing" } .no {} .conflicts { content: "at all" }',
  );
});

it('should add no conflicts on jsx with jsx enabled', () => {
  replaceJsMacro(
    `
      <div class="this has conflicts">
        This has no conflicts
      </div>
    `,
    `
      <div class="this a c">
        This has no conflicts
      </div>
    `,
    '.has { content: "nothing" } .no {} .conflicts { content: "at all" }',
  );
});
