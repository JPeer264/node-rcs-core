import rcs from '../lib';

beforeEach(() => {
  rcs.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.cssVariablesLibrary.reset();
});

/* *** *
 * GET *
 * *** */
it('get | should return input', () => {
  expect(rcs.cssVariablesLibrary.get('')).toBe('');
  expect(rcs.cssVariablesLibrary.get(undefined)).toBe(undefined);
  expect(rcs.cssVariablesLibrary.get(null)).toBe(null);
});

it('get | should get the correct values', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.cssVariablesLibrary.get('--move')).toBe('--a');
  expect(rcs.cssVariablesLibrary.get('--animate')).toBe('--b');
  expect(rcs.cssVariablesLibrary.get('--more')).toBe('--c');
  expect(rcs.cssVariablesLibrary.get('--not-setted-value')).toBe('--not-setted-value');
});

it('get | should get correct var() values', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.cssVariablesLibrary.get('var(--move)')).toBe('var(--a)');
  expect(rcs.cssVariablesLibrary.get('var(--animate)')).toBe('var(--b)');
  expect(rcs.cssVariablesLibrary.get('var(--more)')).toBe('var(--c)');
  expect(rcs.cssVariablesLibrary.get('var(--not-setted-value)')).toBe('var(--not-setted-value)');
});

it('get | should get correct values with spaces', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.cssVariablesLibrary.get('--move    ')).toBe('--a');
  expect(rcs.cssVariablesLibrary.get('--animate ')).toBe('--b');
  expect(rcs.cssVariablesLibrary.get('     --more')).toBe('--c');
  expect(rcs.cssVariablesLibrary.get('    --not-setted-value  ')).toBe('--not-setted-value');
});

it('get | should get correct values with spaces without dash', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.cssVariablesLibrary.get('move    ')).toBe('a');
  expect(rcs.cssVariablesLibrary.get('--animate')).toBe('--b');
  expect(rcs.cssVariablesLibrary.get('more')).toBe('c');
  expect(rcs.cssVariablesLibrary.get('not-setted-value  ')).toBe('not-setted-value');
});

it('get | should get correct var() values with spaces', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.cssVariablesLibrary.get('   var(    --move)')).toBe('var(--a)');
  expect(rcs.cssVariablesLibrary.get('var(--animate    )')).toBe('var(--b)');
  expect(rcs.cssVariablesLibrary.get('var(  --more   )    ')).toBe('var(--c)');
  expect(rcs.cssVariablesLibrary.get('  var(   --not-setted-value) ')).toBe('var(--not-setted-value)');
});

it('get | should get correct var() values with fallbacks', () => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
    test: 'd',
  };

  expect(rcs.cssVariablesLibrary.get('   var(    --move, var( --test     ) )')).toBe('var(--a, var(--d))');
  expect(rcs.cssVariablesLibrary.get('var(--animate  , #ABB  )')).toBe('var(--b, #ABB)');
  expect(rcs.cssVariablesLibrary.get('var(--animate  , var(--test, #ABB)  )')).toBe('var(--b, var(--d, #ABB))');
});

it('get | should get the minified values', () => {
  expect(rcs.cssVariablesLibrary.compressedCssVariables).toEqual({});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.cssVariablesLibrary.compressedCssVariables = object;

  expect(rcs.cssVariablesLibrary.compressedCssVariables).toEqual(object);
  expect(rcs.cssVariablesLibrary.get('move', { isOriginalValue: false })).toBe('a');
  expect(rcs.cssVariablesLibrary.get('animate', { isOriginalValue: false })).toBe('b');
  expect(rcs.cssVariablesLibrary.get('more', { isOriginalValue: false })).toBe('c');
});

/* *** *
 * SET *
 * *** */
it('set | should do nothing', () => {
  rcs.cssVariablesLibrary.set();

  expect(rcs.cssVariablesLibrary.cssVariables).toEqual({});
});

it('set | should set the correct values', () => {
  rcs.cssVariablesLibrary.set('--move');
  rcs.cssVariablesLibrary.set('--animate');
  rcs.cssVariablesLibrary.set('--more');

  expect(rcs.cssVariablesLibrary.cssVariables.move).toBe('a');
  expect(rcs.cssVariablesLibrary.cssVariables.animate).toBe('b');
  expect(rcs.cssVariablesLibrary.cssVariables.more).toBe('c');
});
