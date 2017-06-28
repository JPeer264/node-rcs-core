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
  { ignoreAttributeSelector: true },
);

test('attribute selectors ^',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class^="some"]{}',
  '.somediv{}.a[class^="some"]{}',
);

test('attribute selectors *',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class*="omed"]{}',
  '.somediv{}.a[class*="omed"]{}',
);

test('attribute selectors $',
  replaceCssMacro,
  '.somediv{}.anotherdiv[class$="iv"]{}',
  '.somediv{}.anotherdiv[class$="iv"]{}',
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
        animation:     move     4s    ;
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
        animation:     a     4s    ;
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
        animation:     moVe-It_1337     4s  , motion 10s  ;
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
        animation:     a     4s  , b 10s  ;
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
  '@keyframes  move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.another-selector {animation:     move     4s    }',
  '@keyframes  a {from {} to {}}.b {animation: a 4s, a 4s infinite, do-not-trigger: 10s infinite}.c {animation:     a     4s    }',
  { replaceKeyframes: true },
);

test('should replace keyframes with suffixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes a {from {} to {}}.b-suf {animation: a 4s, a 4s infinite, do-not-trigger: 10s infinite}.c-suf {animation: a 4s }',
  {
    replaceKeyframes: true,
    suffix: '-suf',
  },
);

test('should replace keyframes with prefixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes a {from {} to {}}.pre-b {animation: a 4s, a 4s infinite, do-not-trigger: 10s infinite}.pre-c {animation: a 4s }',
  {
    replaceKeyframes: true,
    prefix: 'pre-',
  },
);

test('should not replace keyframes with prefixes',
  replaceCssMacro,
  '@keyframes move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.another-selector {animation: move 4s }',
  '@keyframes move {from {} to {}}.pre-a {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.pre-b {animation: move 4s }',
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
