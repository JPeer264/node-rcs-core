import test from 'ava';

import rcs from '../lib';

test.beforeEach((t) => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();

  // eslint-disable-next-line no-param-reassign
  t.context.regex = () => rcs.selectorsLibrary.getAllRegex();
});

test('replace text correctly', (t) => {
  rcs.selectorsLibrary.set('.test');

  t.is(
    rcs.replace.string('"   test "', t.context.regex()),
    '"   test "',
  );

  t.is(
    rcs.replace.string('"   .test "', t.context.regex()),
    '"   .a "',
  );

  t.is(
    rcs.replace.string('"test"', t.context.regex()),
    '"a"',
  );


  t.is(
    rcs.replace.string('\'   test \'', t.context.regex()),
    '\'   test \'',
  );

  t.is(
    rcs.replace.string('" ]test"', t.context.regex()),
    '" ]test"',
  );
});

test('replace multiple selectors', (t) => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.my-div');

  const initialString = '"   test  none my-div "';
  const replacedString = rcs.replace.string(initialString, t.context.regex());

  t.is(replacedString, initialString);

  t.is(
    rcs.replace.string('"   .test  none .my-div "', t.context.regex()),
    '"   .a  none .b "',
  );
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

  let replacedString = rcs.replace.string('"[role="menu"] li:not(.test) a, [role="listbox"] li:not(.test) a"', t.context.regex());
  let expectedString = '"[role="menu"] li:not(.a) a, [role="listbox"] li:not(.a) a"';

  t.is(replacedString, expectedString);

  replacedString = rcs.replace.string('"div[class=\'test\']"', t.context.regex());
  expectedString = '"div[class=\'a\']"';

  t.is(replacedString, expectedString);

  replacedString = rcs.replace.string('"div[class=test]"', t.context.regex());
  expectedString = '"div[class=a]"';

  t.is(replacedString, expectedString);

  replacedString = rcs.replace.string('div[class="test"]', t.context.regex());
  expectedString = 'div[class="a"]';

  t.is(replacedString, expectedString);

  replacedString = rcs.replace.string('div[name="test"]', t.context.regex());
  expectedString = 'div[name="test"]';

  t.is(replacedString, expectedString);

  replacedString = rcs.replace.string('"test="', t.context.regex());
  expectedString = '"test="';

  t.is(replacedString, expectedString);
});

test('replace multiple strings', (t) => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.test-2');
  rcs.selectorsLibrary.set('#lala');

  const expectedString = '".a#a.b#chained still-here"';
  const replacedString = rcs.replace.string('".test#lala.test-2#chained still-here"', t.context.regex());

  t.is(replacedString, expectedString);
});

test('does not replace the text', (t) => {
  const expectedString = '"   test "';
  const replacedString = rcs.replace.string('"   test "', t.context.regex());

  t.is(replacedString, expectedString);
});

test('replace multiple selectors', (t) => {
  rcs.selectorsLibrary.set('.test');

  const expectedString = '" #test .a "';
  const replacedString = rcs.replace.string('" #test .test "', t.context.regex());

  t.is(replacedString, expectedString);
});
