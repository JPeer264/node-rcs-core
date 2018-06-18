import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceJsMacro(t, input, expected, fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8')) {
  rcs.selectorLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.js(input), expected);
  t.is(rcs.replace.js(new Buffer(input)), expected);
}

replaceJsMacro.title = (providedTitle, input) => (!providedTitle ? input.trim() : providedTitle);

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
});

test(replaceJsMacro,
  'var test = \' something \';\nconst myClass = "jp-block";',
  'var test = \' something \';\nconst myClass = "a";',
);


test(replaceJsMacro,
  "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
  "'\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040'",
);

test('should fail to parse jsx', (t) => {
  t.plan(1);

  const input = fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8');

  try {
    rcs.replace.js(input, { ecmaFeatures: { jsx: false } });

    t.fail();
  } catch (e) {
    t.pass();
  }
});

test('replace everything from file',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8'),
);

test('replace react components',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/react.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8'),
);
