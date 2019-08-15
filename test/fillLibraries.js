import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  // reset counter and selectors for tests
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('fillLibraries should fill all libraries', (t) => {
  rcs.fillLibraries('.test{}#id[class^="te"]{}@keyframes move { from {} to {} }');


  t.is(rcs.selectorsLibrary.get('test'), 'tet');
  t.is(rcs.selectorsLibrary.get('id'), 'a');
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
  t.is(rcs.selectorsLibrary.get('id'), 'b');
  t.is(rcs.selectorsLibrary.get('test'), 'c');
});

test('fillLibraries should fill all libraries with pre or suffixes', (t) => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      prefix: 'pre-',
      suffix: '-suf',
    },
  );


  t.is(rcs.selectorsLibrary.get('test'), 'pre-tet-suf');
  t.is(rcs.selectorsLibrary.get('id'), 'pre-a-suf');
  t.is(rcs.keyframesLibrary.get('move'), 'move');
});

test('fillLibraries should fill nothing from html', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!</div>',
    {
      codeType: 'html',
    },
  );

  t.is(Object.keys(rcs.selectorsLibrary.getClassSelector().values).length, 0);
  t.is(Object.keys(rcs.selectorsLibrary.getIdSelector().values).length, 0);
});

test('fillLibraries should fill classes from html', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style></div>',
    {
      codeType: 'html',
    },
  );

  t.is(rcs.selectorsLibrary.get('id'), 'a');
  t.is(rcs.selectorsLibrary.get('test'), 'b');
});


test('fillLibraries should fill classes from html with multiple style tags', (t) => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style><style>.another-class {}</style></div>',
    {
      codeType: 'html',
    },
  );

  t.is(rcs.selectorsLibrary.get('test'), 'b');
  t.is(rcs.selectorsLibrary.get('id'), 'a');
  t.is(rcs.selectorsLibrary.get('another-class'), 'c');
});
