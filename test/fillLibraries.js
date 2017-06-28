import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  // reset counter and selectors for tests
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('fillLibraries should fill all libraries', (t) => {
  rcs.fillLibraries('.test{}#id[class^="te"]{}@keyframes move { from {} to {} }');


  t.is(rcs.selectorLibrary.get('test'), 'test');
  t.is(rcs.selectorLibrary.get('id'), 'a');
  t.is(rcs.keyframesLibrary.get('move'), 'move');
});

test('fillLibraries should fill all libraries', (t) => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      replaceKeyframes: true,
      ignoreAttributeSelectors: true,
    },
  );


  t.is(rcs.keyframesLibrary.get('move'), 'a');
  t.is(rcs.selectorLibrary.get('test'), 'b');
  t.is(rcs.selectorLibrary.get('id'), 'c');
});

test('fillLibraries should fill all libraries with pre or suffixes', (t) => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      prefix: 'pre-',
      suffix: '-suf',
    },
  );


  t.is(rcs.selectorLibrary.get('test'), 'pre-test-suf');
  t.is(rcs.selectorLibrary.get('id'), 'pre-a-suf');
  t.is(rcs.keyframesLibrary.get('move'), 'move');
});
