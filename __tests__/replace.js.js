import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib/rcs';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceJsMacro(t, input, expected, fillLibrary = fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8')) {
  rcs.selectorLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.js(input), expected);
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

test('should buffer some js',
  replaceJsMacro,
  new Buffer('var test = \' something \';\nconst myClass = "jp-block";'),
  'var test = \' something \';\nconst myClass = "a";',
);

test('should convert js by code',
  replaceJsMacro,
  'var test = \' something \';\nconst myClass = "jp-block";',
  'var test = \' something \';\nconst myClass = "a";',
);

test('should replace everything from buffered file',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt')),
  fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8'),
);

test('should replace everything from utf8 file',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/complex.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8'),
);

test('should replace react components',
  replaceJsMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/react.txt')),
  fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8'),
);
