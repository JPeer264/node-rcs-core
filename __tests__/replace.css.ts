import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

function replaceCssMacro(input, expected = input, options = {}): void {
  rcs.fillLibraries(input, options);

  rcs.optimize();

  expect(rcs.replace.css(input)).toBe(expected);
  expect(rcs.replace.css(Buffer.from(input))).toBe(expected);
}

function replaceMultipleCssMacro(inputs, expects, options = {}): void {
  inputs.forEach((input, i) => {
    rcs.fillLibraries(input, options);

    expect(rcs.replace.css(input)).toBe(expects[i]);
    expect(rcs.replace.css(Buffer.from(input))).toBe(expects[i]);
  });
}

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
  rcs.cssVariablesLibrary.reset();
});

it('should not replace anything', () => {
  const input = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8');

  expect(rcs.replace.css(input)).toBe(input);
  expect(rcs.replace.css(Buffer.from(input))).toBe(input);
});

it('should replace attribute selectors without quotes | issue #33', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/issue33.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/issue33.css'), 'utf8'),
  );
});

it('should return the modified css buffer', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
  );
});

it('should return the modified and minified css buffer', () => {
  replaceCssMacro(
    '.class{background-color:red}.class-two{color:rgb(0,0,0)}.class-three{color:rgb(1,1,1)}',
    '.a{background-color:red}.b{color:rgb(0,0,0)}.c{color:rgb(1,1,1)}',
  );
});

it('should modify the second one with the values from the first', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
  );
});

it('should modify the second one with the values from the first', () => {
  replaceMultipleCssMacro(
    [
      fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
      fs.readFileSync(path.join(fixturesCwd, '/css/style2.css'), 'utf8'),
    ],
    [
      fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
      fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8'),
    ],
  );
});

it('should modify the code properly | hex oneline', () => {
  replaceCssMacro(
    '.somediv{background:#616060}.anotherdiv{display:flex}',
    '.a{background:#616060}.b{display:flex}',
  );
});

it('should modify the code properly | number oneline', () => {
  replaceCssMacro(
    '.somediv{translation:.30}.anotherdiv{display:flex}',
    '.a{translation:.30}.b{display:flex}',
  );
});

it('should check ~ and + directly after', () => {
  replaceCssMacro(
    '.test~.icon{}.test+.icon{}',
    '.a~.b{}.a+.b{}',
  );
});

test('find selectors within targets | gulp-rcs#6', () => {
  replaceCssMacro(
    '.tabsIconed .tabs__nav a[href="#tabs_availability"]:before{}',
    '.a .b a[href="#a"]:before{}',
  );
});

it('should modify the code properly | filter oneline', () => {
  replaceCssMacro(
    '.somediv{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.anotherdiv{display:flex}',
    '.a{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.b{display:flex}',
  );
});

it('attribute selectors not renamed', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class^="some"]{}',
    '.a{}.b[class^="some"]{}',
    { ignoreAttributeSelectors: true },
  );
});

it('allow escaped selectors | issue65', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/issue65.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/issue65.css'), 'utf8'),
  );
});

it('multiple attribute selectors without quotes', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class^=some] + [class^=some]{}',
    '.a{}.b[class^=some] + [class^=some]{}',
    { ignoreAttributeSelectors: true },
  );
});

it('multiple attribute selectors without quotes', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class^=some] + [class^=another]{}',
    '.somet{}.anothert[class^=some] + [class^=another]{}',
  );
});

it('attribute selectors ^', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class^="some"]{}',
    '.somet{}.a[class^="some"]{}',
  );
});

it('attribute selectors *', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class*="omed"]{}',
    '.tomedn{}.a[class*="omed"]{}',
  );
});

it('attribute selectors $', () => {
  replaceCssMacro(
    '.somediv{}.anotherdiv[class$="iv"]{}',
    '.tiv{}.niv[class$="iv"]{}',
  );
});

it('match after pseudo element', () => {
  replaceCssMacro(
    '.my-div:hover .anotherdiv,.anotherdiv.somediv{}',
    '.a:hover .b,.b.c{}',
  );
});

it('should replace keyframes properly', () => {
  replaceCssMacro(
    `
      @keyframes  move {
          from {} to {}
      }

      .selector {
          animation:move 4s;
      }

      .another-selector {
          animation:     move     4s;
      }
    `,
    `
      @keyframes  a {
          from {} to {}
      }

      .a {
          animation:a 4s;
      }

      .b {
          animation:     a     4s;
      }
    `,
    { replaceKeyframes: true },
  );
});

it('should replace keyframes properly in nested animations', () => {
  replaceCssMacro(
    `
      @keyframes  moVe-It_1337 {
          from {} to {}
      }

      @-webkit-keyframes  motion {
          from {} to {}
      }

      @keyframes  motion {
          from {} to {}
      }

      .selector {
          animation-name: moVe-It_1337, motion;
          animation:  moVe-It_1337 4s infinite,
                      moVe-It_1337 10s,
                      motion 2s,
                      not-setted-keyframe 2s;
      }

      .another-selector {
          animation:     moVe-It_1337     4s  , motion 10s;
      }
    `,
    `
      @keyframes  a {
          from {} to {}
      }

      @-webkit-keyframes  b {
          from {} to {}
      }

      @keyframes  b {
          from {} to {}
      }

      .a {
          animation-name: a, b;
          animation:  a 4s infinite,
                      a 10s,
                      b 2s,
                      not-setted-keyframe 2s;
      }

      .b {
          animation:     a     4s  , b 10s;
      }
    `,
    { replaceKeyframes: true },
  );
});

it('should not replace keyframes properly', () => {
  replaceCssMacro(
    `
      @keyframes  move {
          from {} to {}
      }

      .selector {
          animation: move 4s;
      }

      .another-selector {
          animation:     move     4s    ;
      }
    `,
    `
      @keyframes  move {
          from {} to {}
      }

      .a {
          animation: move 4s;
      }

      .b {
          animation:     move     4s    ;
      }
    `,
  );
});

it('should replace keyframes properly in a oneliner', () => {
  replaceCssMacro(
    '@keyframes  move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation:     move     4s    }',
    '@keyframes  a {from {} to {}}.a {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.b {animation:     a     4s    }',
    { replaceKeyframes: true },
  );
});

it('should not replace keyframes percentage comas | issue #69', () => {
  replaceCssMacro(
    '@keyframes  move {from {} 50.1% {} to {}}.selector {animation: move 4s}',
    '@keyframes  a {from {} 50.1% {} to {}}.a {animation: a 4s}',
    { replaceKeyframes: true },
  );
});

it('should replace keyframes with suffixes', () => {
  replaceCssMacro(
    '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
    '@keyframes a {from {} to {}}.a-suf {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.b-suf {animation: a 4s }',
    {
      replaceKeyframes: true,
      suffix: '-suf',
    },
  );
});

it('should replace keyframes with prefixes', () => {
  replaceCssMacro(
    '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
    '@keyframes a {from {} to {}}.pre-a {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.pre-b {animation: a 4s }',
    {
      replaceKeyframes: true,
      prefix: 'pre-',
    },
  );
});

it('should not replace keyframes with prefixes', () => {
  replaceCssMacro(
    '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
    '@keyframes move {from {} to {}}.pre-a {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.pre-b {animation: move 4s }',
    {
      prefix: 'pre-',
    },
  );
});

it('should replace media queries properly in a oneliner', () => {
  replaceCssMacro(
    '@media(max-width:480px){.one{display:block}.two{display:table}}',
    '@media(max-width:480px){.a{display:block}.b{display:table}}',
  );
});

it('should replace sizes at the end w/o semicolon properly in a oneliner', () => {
  replaceCssMacro(
    '.one{padding:0 .357143rem}.two{color:#0f705d}',
    '.a{padding:0 .357143rem}.b{color:#0f705d}',
    { replaceKeyframes: true },
  );
});

it('should replace attributes', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/css-attributes.css'), 'utf8'),
  );
});

it('should ignore attribute selectors', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-ignore.css'), 'utf8'),
    { ignoreAttributeSelectors: true },
  );
});

it('should prefix and suffix attribute selectors', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-pre-suffix.css'), 'utf8'),
    { prefix: 'prefix-', suffix: '-suffix' },
  );
});

it('preventRandomName. Cross check that nothing will break', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    { preventRandomName: true },
  );
});

it('preventRandomName but prefix everything', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/style-prefix-preventrandomname.css'), 'utf8'),
    { preventRandomName: true, prefix: 'prefixed-' },
  );
});

it('allow escaped selectors | issue #65', () => {
  replaceCssMacro(
    fs.readFileSync(path.join(fixturesCwd, '/css/issue65.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/issue65.css'), 'utf8'),
  );
});

it('allow different escaped selectors | issue #65', () => {
  replaceCssMacro(
    '.somediv\\:test-me{}.anotherdiv:after.test\\:another-one[class^="some"]{}',
    '.a{}.b:after.c[class^="some"]{}',
    { ignoreAttributeSelectors: true },
  );
});

it('allow different escaped selectors and pseudoelements | issue #67', () => {
  replaceCssMacro(
    '.somediv\\:test-me:after{}.anotherdiv:after.test\\:another-one[class^="some"]{}',
    '.a:after{}.b:after.c[class^="some"]{}',
    { ignoreAttributeSelectors: true },
  );
});

it('should replace css variables properly', () => {
  replaceCssMacro(
    `
      :root {
        --main-bg-color: coral;
        --my-gradient: linear-gradient(var(--main-bg-color), var(--bottom-color));
      }

      #div1 {
        background-color: var(--main-bg-color);
      }
    `,
    `
      :root {
        --a: coral;
        --b: linear-gradient(var(--a), var(--bottom-color));
      }

      #a {
        background-color: var(--a);
      }
    `,
  );
});

it('should not replace css variables properly', () => {
  replaceCssMacro(
    `
      :root {
        --main-bg-color: coral;
        --my-gradient: linear-gradient(var(--main-bg-color), var(--bottom-color));
      }

      #div1 {
        background-color: var(--main-bg-color);
      }
    `,
    `
      :root {
        --main-bg-color: coral;
        --my-gradient: linear-gradient(var(--main-bg-color), var(--bottom-color));
      }

      #a {
        background-color: var(--main-bg-color);
      }
    `,
    { ignoreCssVariables: true },
  );
});

it('should replace css variables', () => {
  replaceCssMacro(
    `
      .theme {
        --theme-primary: #111;
        --theme-secondary: #f0f0f0;
        --theme-tertiary: #999;
      }

      .theme--variant {
        --theme-primary: red;
        --theme-secondary: white;
        --theme-tertiary: black;
      }

      .box {
        color: var(--theme-primary);
        background-color: var(--theme-secondary);
        font-size: 1.2em;
        line-height: 1.4;
        width: 100%;
        max-width: 400px;
        padding: 5px;
        border: 1px solid var(--theme-tertiary);
        margin: 0 0 20px;
      }
    `,
    `
      .a {
        --a: #111;
        --b: #f0f0f0;
        --c: #999;
      }

      .b {
        --a: red;
        --b: white;
        --c: black;
      }

      .c {
        color: var(--a);
        background-color: var(--b);
        font-size: 1.2em;
        line-height: 1.4;
        width: 100%;
        max-width: 400px;
        padding: 5px;
        border: 1px solid var(--c);
        margin: 0 0 20px;
      }
    `,
  );
});

it('replace css variables with fallbacks | issue rename-css-selectors#42', () => {
  replaceCssMacro(
    `
      :root {
        --button-border-width: 2px;
        --border-width: 2px;
        --button-border-color: pink;
      }

      .my-selector {
        border: var(--button-border-width, var(--border-width))
                solid
                var(--button-border-color, transparent);
      }
    `,
    `
      :root {
        --a: 2px;
        --b: 2px;
        --c: pink;
      }

      .a {
        border: var(--a, var(--b))
                solid
                var(--c, transparent);
      }
    `,
  );
});

it('replace css variables in calc and multiple variables | rename-css-selectors#43', () => {
  replaceCssMacro(
    `
      :root {
        --gap-column-child: 2px;
        --gap-column: 2px;
        --gap-row-child: 2px;
        --gap-row: 2px;
        --0px: 0px;
      }

      .my-selector {
        margin-right: calc(var(--gap-column-child, var(--0px)) - var(--gap-column, var(--0px)));
        margin-bottom: calc(var(--gap-row-child, var(--0px)) - var(--gap-row, var(--0px)));
      }
    `,
    `
      :root {
        --a: 2px;
        --b: 2px;
        --c: 2px;
        --d: 2px;
        --e: 0px;
      }

      .a {
        margin-right: calc(var(--a, var(--e)) - var(--b, var(--e)));
        margin-bottom: calc(var(--c, var(--e)) - var(--d, var(--e)));
      }
    `,
  );
});

it('should replace excluded special characters | rename-css-selectors#77', () => {
  rcs.selectorsLibrary.setExclude('somediv:test-me');

  replaceCssMacro(
    '.somediv\\:test-me{}.anotherdiv{}',
    '.somediv\\:test-me{}.a{}',
  );
});

it('should classes with square brackets | rcs-core#133', () => {
  replaceCssMacro(
    '.test\\:hello.bottom-\\[99999px\\][class="test"] {bottom: 99999px;}',
    '.a.b[class="test"] {bottom: 99999px;}',
  );
});

it('should classes with and ignore them | rcs-core#133', () => {
  rcs.selectorsLibrary.setExclude('bottom-[99999px]');

  replaceCssMacro(
    '.test\\:hello.bottom-\\[99999px\\][class="test"] {bottom: 99999px;}',
    '.a.bottom-\\[99999px\\][class="test"] {bottom: 99999px;}',
  );
});

it('replace multiple variables after each other | #137', () => {
  replaceCssMacro(
    `
      *, ::before, ::after {
        --tw-shadow: 0 0 transparent;
        --tw-ring-offset-shadow: 0 0 transparent;
        --tw-ring-shadow: 0 0 transparent;
      }

      .shadow-small {
        --tw-shadow: 0 2px 4px 0 rgb(151, 145, 151, 0.1);
        box-shadow: 0 0 transparent, 0 0 transparent, var(--tw-shadow);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 transparent), var(--tw-ring-shadow, 0 0 transparent), var(--tw-shadow);
      }
    `,
    `
      *, ::before, ::after {
        --a: 0 0 transparent;
        --b: 0 0 transparent;
        --c: 0 0 transparent;
      }

      .a {
        --a: 0 2px 4px 0 rgb(151, 145, 151, 0.1);
        box-shadow: 0 0 transparent, 0 0 transparent, var(--a);
        box-shadow: var(--b, 0 0 transparent), var(--c, 0 0 transparent), var(--a);
      }
    `,
  );
});

it('should ignore normal html attributes | rename-css-selectors#84', () => {
  replaceCssMacro(
    '.text {} textarea {}',
    '.a {} textarea {}',
  );
});
