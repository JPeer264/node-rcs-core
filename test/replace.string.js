import test from 'ava';

import rcs from '../lib';

test.beforeEach((t) => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorsLibrary.reset();

  // eslint-disable-next-line no-param-reassign
  t.context.regex = () => rcs.selectorsLibrary.getAllRegex();
});

test('replace text correctly', (t) => {
  rcs.selectorsLibrary.set('.test');

  t.is(
    rcs.replace.string('"   test "', t.context.regex()),
    '"   a "',
  );

  t.is(
    rcs.replace.string('\'   test \'', t.context.regex()),
    '\'   a \'',
  );
});

test('replace multiple selectors', (t) => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.my-div');

  const expectedString = '"   a  none b "';
  const replacedString = rcs.replace.string('"   test  none my-div "', t.context.regex());

  t.is(replacedString, expectedString);
});

test('replace id', (t) => {
  rcs.selectorsLibrary.set('#test');

  const expectedString = '"#a"';
  const replacedString = rcs.replace.string('"#test"', t.context.regex());

  t.is(replacedString, expectedString);
});

test('replace class', (t) => {
  rcs.selectorsLibrary.set('.test');

  const expectedString = '".a"';
  const replacedString = rcs.replace.string('".test"', t.context.regex());

  t.is(replacedString, expectedString);
});

test('replace more complex string', (t) => {
  rcs.selectorsLibrary.set('.test');

  const replacedString = rcs.replace.string('"[role="menu"] li:not(.test) a, [role="listbox"] li:not(.test) a"', t.context.regex());
  const expectedString = '"[role="menu"] li:not(.a) a, [role="listbox"] li:not(.a) a"';

  t.is(replacedString, expectedString);
});

test('replace multiple strings', (t) => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.test-2');
  rcs.selectorsLibrary.set('#lala');

  const expectedString = '".a#c.b#chained still-here"';
  const replacedString = rcs.replace.string('".test#lala.test-2#chained still-here"', t.context.regex());

  t.is(replacedString, expectedString);
});

test('does not replace the text', (t) => {
  const expectedString = '"   test "';
  const replacedString = rcs.replace.string('"   test "', t.context.regex());

  t.is(replacedString, expectedString);
});
