import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.keyframesLibrary.reset();
  rcs.keyframesLibrary.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorLibrary.reset();
  rcs.selectorLibrary.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
});

test('fillLibraries should fill all libraries', (t) => {
  rcs.fillLibraries('.test{}#id[class^="te"]{}@keyframes move { from {} to {} }');


  t.is(rcs.selectorLibrary.get('test'), 'tet');
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
  t.is(rcs.selectorLibrary.get('test'), 'a');
  t.is(rcs.selectorLibrary.get('id'), 'b');
});

test('fillLibraries should fill all libraries with pre or suffixes', (t) => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      prefix: 'pre-',
      suffix: '-suf',
    },
  );


  t.is(rcs.selectorLibrary.get('test'), 'pre-tet-suf');
  t.is(rcs.selectorLibrary.get('id'), 'pre-a-suf');
  t.is(rcs.keyframesLibrary.get('move'), 'move');
});
