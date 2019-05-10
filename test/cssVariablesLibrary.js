import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.cssVariablesLibrary.reset();
});

/* *** *
 * GET *
 * *** */
test('get | should return input', (t) => {
  t.is(rcs.cssVariablesLibrary.get(''), '');
  t.is(rcs.cssVariablesLibrary.get(undefined), undefined);
  t.is(rcs.cssVariablesLibrary.get(null), null);
});

test('get | should get the correct values', (t) => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.cssVariablesLibrary.get('--move'), '--a');
  t.is(rcs.cssVariablesLibrary.get('--animate'), '--b');
  t.is(rcs.cssVariablesLibrary.get('--more'), '--c');
  t.is(rcs.cssVariablesLibrary.get('--not-setted-value'), '--not-setted-value');
});

test('get | should get correct var() values', (t) => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.cssVariablesLibrary.get('var(--move)'), 'var(--a)');
  t.is(rcs.cssVariablesLibrary.get('var(--animate)'), 'var(--b)');
  t.is(rcs.cssVariablesLibrary.get('var(--more)'), 'var(--c)');
  t.is(rcs.cssVariablesLibrary.get('var(--not-setted-value)'), 'var(--not-setted-value)');
});

test('get | should get correct values with spaces', (t) => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.cssVariablesLibrary.get('--move    '), '--a');
  t.is(rcs.cssVariablesLibrary.get('--animate '), '--b');
  t.is(rcs.cssVariablesLibrary.get('     --more'), '--c');
  t.is(rcs.cssVariablesLibrary.get('    --not-setted-value  '), '--not-setted-value');
});

test('get | should get correct values with spaces without dash', (t) => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.cssVariablesLibrary.get('move    '), 'a');
  t.is(rcs.cssVariablesLibrary.get('--animate'), '--b');
  t.is(rcs.cssVariablesLibrary.get('more'), 'c');
  t.is(rcs.cssVariablesLibrary.get('not-setted-value  '), 'not-setted-value');
});

test('get | should get correct var() values with spaces', (t) => {
  rcs.cssVariablesLibrary.cssVariables = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.cssVariablesLibrary.get('   var(    --move)'), 'var(--a)');
  t.is(rcs.cssVariablesLibrary.get('var(--animate    )'), 'var(--b)');
  t.is(rcs.cssVariablesLibrary.get('var(  --more   )    '), 'var(--c)');
  t.is(rcs.cssVariablesLibrary.get('  var(   --not-setted-value) '), 'var(--not-setted-value)');
});

test('get | should get the minified values', (t) => {
  t.deepEqual(rcs.cssVariablesLibrary.compressedCssVariables, {});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.cssVariablesLibrary.compressedCssVariables = object;

  t.deepEqual(rcs.cssVariablesLibrary.compressedCssVariables, object);
  t.is(rcs.cssVariablesLibrary.get('move', { isOriginalValue: false }), 'a');
  t.is(rcs.cssVariablesLibrary.get('animate', { isOriginalValue: false }), 'b');
  t.is(rcs.cssVariablesLibrary.get('more', { isOriginalValue: false }), 'c');
});

/* *** *
 * SET *
 * *** */
test('set | should do nothing', (t) => {
  rcs.cssVariablesLibrary.set();

  t.deepEqual(rcs.cssVariablesLibrary.cssVariables, {});
});

test('set | should set the correct values', (t) => {
  rcs.cssVariablesLibrary.set('--move');
  rcs.cssVariablesLibrary.set('--animate');
  rcs.cssVariablesLibrary.set('--more');

  t.is(rcs.cssVariablesLibrary.cssVariables.move, 'a');
  t.is(rcs.cssVariablesLibrary.cssVariables.animate, 'b');
  t.is(rcs.cssVariablesLibrary.cssVariables.more, 'c');
});
