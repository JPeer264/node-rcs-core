import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib/rcs';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceBufferMacro(t, input, expected, fillLibrary = '') {
  rcs.selectorLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.buffer(input).toString(), expected);
}

test.beforeEach(() => {
  // reset counter and selectors for tests
  rcs.selectorLibrary.selectors = {};
  rcs.selectorLibrary.attributeSelectors = {};
  rcs.selectorLibrary.compressedSelectors = {};
  rcs.selectorLibrary.excludes = [];

  rcs.keyframesLibrary.excludes = [];
  rcs.keyframesLibrary.keyframes = {};
  rcs.keyframesLibrary.compressedKeyframes = {};

  rcs.nameGenerator.resetCountForTests();
});

test('should stay empty',
  replaceBufferMacro,
  new Buffer(''),
  '',
);

test('should return the modified html buffer',
  replaceBufferMacro,
  fs.readFileSync(path.join(fixturesCwd, '/html/index.html')),
  fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8'),
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
);

test('should return the modified js buffer',
  replaceBufferMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/main.txt')),
  fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8'),
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
);
