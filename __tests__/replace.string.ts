import rcs from '../lib';

const getRegex = (): RegExp => rcs.selectorsLibrary.getAllRegex();

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

it('replace text correctly', () => {
  rcs.selectorsLibrary.set('.test');

  expect(rcs.replace.string('"   test "', getRegex()))
    .toBe('"   test "');

  expect(rcs.replace.string('"   .test "', getRegex()))
    .toBe('"   .a "');

  expect(rcs.replace.string('"test"', getRegex()))
    .toBe('"a"');


  expect(rcs.replace.string('\'   test \'', getRegex()))
    .toBe('\'   test \'');

  expect(rcs.replace.string('" ]test"', getRegex()))
    .toBe('" ]test"');
});

it('replace multiple selectors', () => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.my-div');

  const initialString = '"   test  none my-div "';
  const replacedString = rcs.replace.string(initialString, getRegex());

  expect(replacedString).toBe(initialString);

  expect(rcs.replace.string('"   .test  none .my-div "', getRegex()))
    .toBe('"   .a  none .b "');
});

it('replace id', () => {
  rcs.selectorsLibrary.set('#test');

  const expectedString = '"#a"';
  const replacedString = rcs.replace.string('"#test"', getRegex());

  expect(replacedString).toBe(expectedString);
});

it('replace class', () => {
  rcs.selectorsLibrary.set('.test');

  const expectedString = '".a"';
  const replacedString = rcs.replace.string('".test"', getRegex());

  expect(replacedString).toBe(expectedString);
});

it('replace more complex string', () => {
  rcs.selectorsLibrary.set('.test');

  let replacedString = rcs.replace.string('"[role="menu"] li:not(.test) a, [role="listbox"] li:not(.test) a"', getRegex());
  let expectedString = '"[role="menu"] li:not(.a) a, [role="listbox"] li:not(.a) a"';

  expect(replacedString).toBe(expectedString);

  replacedString = rcs.replace.string('"div[class=\'test\']"', getRegex());
  expectedString = '"div[class=\'a\']"';

  expect(replacedString).toBe(expectedString);

  replacedString = rcs.replace.string('"div[class=test]"', getRegex());
  expectedString = '"div[class=a]"';

  expect(replacedString).toBe(expectedString);

  replacedString = rcs.replace.string('div[class="test"]', getRegex());
  expectedString = 'div[class="a"]';

  expect(replacedString).toBe(expectedString);

  replacedString = rcs.replace.string('div[name="test"]', getRegex());
  expectedString = 'div[name="test"]';

  expect(replacedString).toBe(expectedString);

  replacedString = rcs.replace.string('"test="', getRegex());
  expectedString = '"test="';

  expect(replacedString).toBe(expectedString);
});

it('replace multiple strings', () => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.test-2');
  rcs.selectorsLibrary.set('#lala');

  const expectedString = '".a#a.b#chained still-here"';
  const replacedString = rcs.replace.string('".test#lala.test-2#chained still-here"', getRegex());

  expect(replacedString).toBe(expectedString);
});

it('does not replace the text', () => {
  const expectedString = '"   test "';
  const replacedString = rcs.replace.string('"   test "', getRegex());

  expect(replacedString).toBe(expectedString);
});

it('replace multiple selectors', () => {
  rcs.selectorsLibrary.set('.test');

  const expectedString = '" #test .a "';
  const replacedString = rcs.replace.string('" #test .test "', getRegex());

  expect(replacedString).toBe(expectedString);
});
