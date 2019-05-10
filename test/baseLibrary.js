import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.baseLibrary.reset();
});

/* ******* *
 * EXCLUDE *
 * ******* */
test('exclude | should exclude variables', (t) => {
  rcs.baseLibrary.setExclude(['move', 'no']);

  t.is(rcs.baseLibrary.excludes.length, 2);
});

test('exclude | should just exclude once', (t) => {
  rcs.baseLibrary.setExclude(['move', 'move']);

  t.is(rcs.baseLibrary.excludes.length, 1);
  t.is(rcs.baseLibrary.excludes[0], 'move');
});

test('exclude | should exclude nothing', (t) => {
  rcs.baseLibrary.setExclude();

  t.is(rcs.baseLibrary.excludes.length, 0);
});


/* *********** *
 * SETMULTIPLE *
 * *********** */
test('setMultiple | should set multiple values', (t) => {
  rcs.baseLibrary.setMultiple({
    test: 'a',
    class: 'b',
    selector: 'c',
  });

  t.is(rcs.baseLibrary.values.test, 'a');
  t.is(rcs.baseLibrary.values.class, 'b');
  t.is(rcs.baseLibrary.values.selector, 'c');
});

test('setMultiple | should set nothing', (t) => {
  rcs.baseLibrary.setMultiple();

  t.is(Object.keys(rcs.baseLibrary.values).length, 0);
});

/* ********* *
 * SETPREFIX *
 * ********* */
test('setPrefix', (t) => {
  t.is(rcs.baseLibrary.prefix, '');

  rcs.baseLibrary.setPrefix('pre-');

  t.is(rcs.baseLibrary.prefix, 'pre-');

  rcs.baseLibrary.setPrefix(1);

  t.is(rcs.baseLibrary.prefix, 'pre-');

  rcs.baseLibrary.setPrefix({});

  t.is(rcs.baseLibrary.prefix, 'pre-');

  rcs.baseLibrary.setPrefix('prepre');

  t.is(rcs.baseLibrary.prefix, 'prepre');
});

/* ********* *
 * SETSUFFIX *
 * ********* */
test('setSuffix', (t) => {
  t.is(rcs.baseLibrary.suffix, '');

  rcs.baseLibrary.setSuffix('-suf');

  t.is(rcs.baseLibrary.suffix, '-suf');

  rcs.baseLibrary.setSuffix(1);

  t.is(rcs.baseLibrary.suffix, '-suf');

  rcs.baseLibrary.setSuffix({});

  t.is(rcs.baseLibrary.suffix, '-suf');

  rcs.baseLibrary.setSuffix('sufsuf');

  t.is(rcs.baseLibrary.suffix, 'sufsuf');
});

/* ********** *
 * SETEXCLUDE *
 * ********** */
test('setExclude | should avoid adding more of the same exludes | should enable array', (t) => {
  const excludes = [
    'one-value',
    'one-value',
    'another-value',
  ];

  rcs.baseLibrary.setExclude(excludes);

  t.is(rcs.baseLibrary.excludes.length, 2);
});

test('setExclude | should enable array', (t) => {
  const excludes = [
    'one-value',
    'another-value',
  ];

  rcs.baseLibrary.setExclude(excludes);

  t.is(rcs.baseLibrary.excludes.length, 2);
});

test('setExclude | should enable excludes', (t) => {
  rcs.baseLibrary.setExclude('one-value');
  rcs.baseLibrary.setExclude('second-value');

  t.is(rcs.baseLibrary.excludes.length, 2);
});

/* ********** */
/* ISEXCLUDED */
/* ********** */
test('isExcluded | set into excluded', (t) => {
  rcs.baseLibrary.setExclude('exclude');

  const excluded = rcs.baseLibrary.isExcluded('exclude');

  t.true(excluded);
});

test('isExcluded | set into excluded but does not match as regex', (t) => {
  rcs.baseLibrary.setExclude('noregex');

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  t.false(excluded);
});

test('isExcluded | set into excluded and match as regex', (t) => {
  rcs.baseLibrary.setExclude(/noregex/);

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  t.true(excluded);
});

test('isExcluded | set into excluded and match as regex instance', (t) => {
  rcs.baseLibrary.setExclude(new RegExp('noregex'));

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  t.true(excluded);
});

/* *** *
 * SET *
 * *** */
test('set | should do nothing', (t) => {
  rcs.baseLibrary.set();

  t.deepEqual(rcs.baseLibrary.values, {});
});

test('set | should set the correct values', (t) => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');
  rcs.baseLibrary.set('more');

  t.is(rcs.baseLibrary.values.move, 'a');
  t.is(rcs.baseLibrary.values.animate, 'b');
  t.is(rcs.baseLibrary.values.more, 'c');
});

test('set | should set own values', (t) => {
  rcs.baseLibrary.set('move', 'mo');
  rcs.baseLibrary.set('animate', 'an');
  rcs.baseLibrary.set('more', 'm');

  t.is(rcs.baseLibrary.values.move, 'mo');
  t.is(rcs.baseLibrary.values.animate, 'an');
  t.is(rcs.baseLibrary.values.more, 'm');
});

test('set | should not set excluded values', (t) => {
  rcs.baseLibrary.setExclude('move');
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('shouldexist');

  t.falsy(rcs.baseLibrary.values.move);
  t.is(rcs.baseLibrary.values.shouldexist, 'a');
});

test('set | should not set twice', (t) => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');

  t.is(Object.keys(rcs.baseLibrary.values).length, 2);
  t.is(rcs.baseLibrary.values.move, 'a');
  t.is(rcs.baseLibrary.values.animate, 'b');
});

test('set | should not set multiple values', (t) => {
  rcs.baseLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  t.is(rcs.baseLibrary.values.move, 'a');
  t.is(rcs.baseLibrary.values.animate, 'b');
  t.is(rcs.baseLibrary.values.more, 'c');
});

test('set | should not set multiple excluded of multiple setted values', (t) => {
  rcs.baseLibrary.setExclude(['move', 'animate']);
  rcs.baseLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  t.falsy(rcs.baseLibrary.values.move);
  t.falsy(rcs.baseLibrary.values.animate);
  t.is(rcs.baseLibrary.values.more, 'a');
});

test('set | should not set multiple excluded values', (t) => {
  rcs.baseLibrary.setExclude(['move', 'no']);
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('no');
  rcs.baseLibrary.set('shouldexist');

  t.falsy(rcs.baseLibrary.values.move);
  t.falsy(rcs.baseLibrary.values['.']);
  t.is(rcs.baseLibrary.values.shouldexist, 'a');
});

/* *** *
 * GET *
 * *** */
test('get | should get the values', (t) => {
  rcs.baseLibrary.values = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.baseLibrary.get('move'), 'a');
  t.is(rcs.baseLibrary.get('animate'), 'b');
  t.is(rcs.baseLibrary.get('more'), 'c');
  t.is(rcs.baseLibrary.get('not-setted-value'), 'not-setted-value');
});

test('get | should get the minified values', (t) => {
  t.deepEqual(rcs.baseLibrary.compressedValues, {});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.baseLibrary.compressedValues = object;

  t.deepEqual(rcs.baseLibrary.compressedValues, object);
  t.is(rcs.baseLibrary.get('move', { isOriginalValue: false }), 'a');
  t.is(rcs.baseLibrary.get('animate', { isOriginalValue: false }), 'b');
  t.is(rcs.baseLibrary.get('more', { isOriginalValue: false }), 'c');
});

test('get | should not get excluded values but already set ones', (t) => {
  rcs.baseLibrary.excludes = ['move'];
  rcs.baseLibrary.values = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.baseLibrary.get('move'), 'move');
  t.is(rcs.baseLibrary.get('animate'), 'b');
  t.is(rcs.baseLibrary.get('more'), 'c');
});
