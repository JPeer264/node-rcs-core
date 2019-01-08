import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceCssMacro(t, input, expected, options = {}) {
  rcs.fillLibraries(input, options);

  t.is(rcs.replace.css(input), expected);
  t.is(rcs.replace.css(new Buffer(input)), expected);
}

function replaceMultipleCssMacro(t, inputs, expects, options = {}) {
  t.plan(inputs.length * 2);

  inputs.forEach((input, i) => {
    rcs.fillLibraries(input, options);

    t.is(rcs.replace.css(input), expects[i]);
    t.is(rcs.replace.css(new Buffer(input)), expects[i]);
  });
}

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('should not replace anything', (t) => {
  const input = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8');

  t.is(rcs.replace.css(input), input);
  t.is(rcs.replace.css(new Buffer(input)), input);
});

test('should replace attribute selectors without quotes | issue #33',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/issue33.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/issue33.css'), 'utf8'),
);

test('should return the modified css buffer',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
);

test('should return the modified and minified css buffer',
  replaceCssMacro,
  '.class{background-color:red}.class-two{color:rgb(0,0,0)}.class-three{color:rgb(1,1,1)}',
  '.a{background-color:red}.b{color:rgb(0,0,0)}.c{color:rgb(1,1,1)}',
);

test('should modify the second one with the values from the first',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
);

test('should modify the second one with the values from the first',
  replaceMultipleCssMacro,
  [
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(fixturesCwd, '/css/style2.css'), 'utf8'),
  ],
  [
    fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8'),
  ],
);

test('should modify the code properly | hex oneline',
  replaceCssMacro,
  '.somediv{background:#616060}.anotherdiv{display:flex}',
  '.a{background:#616060}.b{display:flex}',
);

test('should modify the code properly | number oneline',
  replaceCssMacro,
  '.somediv{translation:.30}.anotherdiv{display:flex}',
  '.a{translation:.30}.b{display:flex}',
);

test('should modify the code properly | filter oneline',
  replaceCssMacro,
  '.somediv{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.anotherdiv{display:flex}',
  '.a{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.b{display:flex}',
);

test('attribute selectors not renamed',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class^="some"]{}',
  '.a{}.b[class^="some"]{}',
  { ignoreAttributeSelectors: true },
);

test('allow escaped selectors | issue65',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/issue65.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/issue65.css'), 'utf8'),
);

test('multiple attribute selectors without quotes',
    replaceCssMacro,
    '.somediv{}.anotherdiv[class^=some] + [class^=some]{}',
    '.a{}.b[class^=some] + [class^=some]{}',
    { ignoreAttributeSelectors: true },
);

test('multiple attribute selectors without quotes',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class^=some] + [class^=another]{}',
  '.somet{}.anothert[class^=some] + [class^=another]{}',
);

test('attribute selectors ^',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class^="some"]{}',
  '.somet{}.a[class^="some"]{}',
);

test('attribute selectors *',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class*="omed"]{}',
  '.tomedn{}.a[class*="omed"]{}',
);

test('attribute selectors $',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class$="iv"]{}',
  '.tiv{}.niv[class$="iv"]{}',
);

test('match after pseudo element',
  replaceCssMacro,
  '.div:hover .anotherdiv,.anotherdiv.somediv{}',
  '.a:hover .b,.b.c{}',
);

test('should replace keyframes properly',
  replaceCssMacro,
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

    .b {
        animation:a 4s;
    }

    .c {
        animation:     a     4s;
    }
  `,
  { replaceKeyframes: true },
);

test('should replace keyframes properly in nested animations',
  replaceCssMacro,
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

    .c {
        animation-name: a, b;
        animation:  a 4s infinite,
                    a 10s,
                    b 2s,
                    not-setted-keyframe 2s;
    }

    .d {
        animation:     a     4s  , b 10s;
    }
  `,
  { replaceKeyframes: true },
);

test('should not replace keyframes properly',
  replaceCssMacro,
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

test('should replace keyframes properly in a oneliner',
  replaceCssMacro,
  '@keyframes  move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation:     move     4s    }',
  '@keyframes  a {from {} to {}}.b {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.c {animation:     a     4s    }',
  { replaceKeyframes: true },
);

test('should not replace keyframes percentage comas | issue #69',
  replaceCssMacro,
  '@keyframes  move {from {} 50.1% {} to {}}.selector {animation: move 4s}',
  '@keyframes  a {from {} 50.1% {} to {}}.b {animation: a 4s}',
  { replaceKeyframes: true },
);

test('should replace keyframes with suffixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes a {from {} to {}}.b-suf {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.c-suf {animation: a 4s }',
  {
    replaceKeyframes: true,
    suffix: '-suf',
  },
);

test('should replace keyframes with prefixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes a {from {} to {}}.pre-b {animation: a 4s, a 4s infinite, do-not-trigger 10s infinite}.pre-c {animation: a 4s }',
  {
    replaceKeyframes: true,
    prefix: 'pre-',
  },
);

test('should not replace keyframes with prefixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes move {from {} to {}}.pre-a {animation: move 4s, move 4s infinite, do-not-trigger 10s infinite}.pre-b {animation: move 4s }',
  {
    prefix: 'pre-',
  },
);

test('should replace media queries properly in a oneliner',
  replaceCssMacro,
  '@media(max-width:480px){.one{display:block}.two{display:table}}',
  '@media(max-width:480px){.a{display:block}.b{display:table}}',
);

test('should replace sizes at the end w/o semicolon properly in a oneliner',
  replaceCssMacro,
  '.one{padding:0 .357143rem}.two{color:#0f705d}',
  '.a{padding:0 .357143rem}.b{color:#0f705d}',
  { replaceKeyframes: true },
);

test('should replace attributes',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/css-attributes.css'), 'utf8'),
);

test('should ignore attribute selectors',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-ignore.css'), 'utf8'),
  { ignoreAttributeSelectors: true },
);

test('should prefix and suffix attribute selectors',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/css-attributes.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-pre-suffix.css'), 'utf8'),
  { prefix: 'prefix-', suffix: '-suffix' },
);

test('preventRandomName. Cross check that nothing will break',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  { preventRandomName: true },
);

test('preventRandomName but prefix everything',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/style-prefix-preventrandomname.css'), 'utf8'),
  { preventRandomName: true, prefix: 'prefixed-' },
);

test('allow escaped selectors | issue #65',
  replaceCssMacro,
  fs.readFileSync(path.join(fixturesCwd, '/css/issue65.css'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/css/issue65.css'), 'utf8'),
);

test('allow different escaped selectors | issue #65',
  replaceCssMacro,
  '.somediv\\:test-me{}.anotherdiv:after.test\\:another-one[class^="some"]{}',
  '.a{}.b:after.c[class^="some"]{}',
  { ignoreAttributeSelectors: true },
);

test('allow different escaped selectors and pseudoelements | issue #67',
  replaceCssMacro,
  '.somediv\\:test-me:after{}.anotherdiv:after.test\\:another-one[class^="some"]{}',
  '.a:after{}.b:after.c[class^="some"]{}',
  { ignoreAttributeSelectors: true },
);
