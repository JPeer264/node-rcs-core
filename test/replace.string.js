import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  // reset counter and selectors for tests
  rcs.selectorLibrary.selectors = {};
  rcs.selectorLibrary.compressedSelectors = {};

  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
});

test('replace text correctly', (t) => {
  rcs.selectorLibrary.set('.test');

  t.is(
    rcs.replace.string('"   test "', / test /),
    '"   a "',
  );

  t.is(
    rcs.replace.string('\'   test \'', / test /),
    '\'   a \'',
  );
});

test('replace multiple selectors', (t) => {
  rcs.selectorLibrary.set('.test');
  rcs.selectorLibrary.set('.my-div');

  const expectedString = '"   a  none b "';
  const replacedString = rcs.replace.string('"   test  none my-div "', / (test|none|my-div) /);

  t.is(replacedString, expectedString);
});

test('replace id', (t) => {
  rcs.selectorLibrary.set('#test');

  const expectedString = '"#a"';
  const replacedString = rcs.replace.string('"#test"', / #test /);

  t.is(replacedString, expectedString);
});

test('replace class', (t) => {
  rcs.selectorLibrary.set('.test');

  const expectedString = '".a"';
  const replacedString = rcs.replace.string('".test"', / \.test /);

  t.is(replacedString, expectedString);
});

test('does not replace the text', (t) => {
  const expectedString = '"   test "';
  const replacedString = rcs.replace.string('"   test "', / test /);

  t.is(replacedString, expectedString);
});
