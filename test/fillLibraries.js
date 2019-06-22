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


  t.is(rcs.selectorLibrary.get('test'), 'pre-tet-suf');
  t.is(rcs.selectorLibrary.get('id'), 'pre-a-suf');
  t.is(rcs.keyframesLibrary.get('move'), 'move');
});

test('fillLibraries should fill nothing from html', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!</div>',
    {
      codeType: 'html',
    },
  );

  t.is(Object.keys(rcs.selectorLibrary.values).length, 0);
});

test('fillLibraries should fill classes from html', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style></div>',
    {
      codeType: 'html',
    },
  );

  t.is(rcs.selectorLibrary.get('test'), 'a');
  t.is(rcs.selectorLibrary.get('id'), 'b');
});


test('fillLibraries should fill classes from html with multiple style tags', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style><style>.another-class {}</style></div>',
    {
      codeType: 'html',
    },
  );

  t.is(rcs.selectorLibrary.get('test'), 'a');
  t.is(rcs.selectorLibrary.get('id'), 'b');
  t.is(rcs.selectorLibrary.get('another-class'), 'c');
});
