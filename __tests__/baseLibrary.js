import rcs from '../lib';

beforeEach(() => {
  rcs.baseLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.baseLibrary.reset();
});

/* ******* *
 * EXCLUDE *
 * ******* */
it('exclude | should exclude variables', () => {
  rcs.baseLibrary.setExclude(['move', 'no']);

  expect(rcs.baseLibrary.excludes.length).toBe(2);
});

it('exclude | should just exclude once', () => {
  rcs.baseLibrary.setExclude(['move', 'move']);

  expect(rcs.baseLibrary.excludes.length).toBe(1);
  expect(rcs.baseLibrary.excludes[0]).toBe('move');
});

it('exclude | should exclude nothing', () => {
  rcs.baseLibrary.setExclude();

  expect(rcs.baseLibrary.excludes.length).toBe(0);
});

/* ******** *
 * RESERVED *
 * ******** */
it('reserved | should reserve variables', () => {
  rcs.baseLibrary.setReserved(['a', 'b']);

  expect(rcs.baseLibrary.reserved.length).toBe(2);
});

it('reserved | should just reserve once', () => {
  rcs.baseLibrary.setReserved(['a', 'a']);

  expect(rcs.baseLibrary.reserved.length).toBe(1);
  expect(rcs.baseLibrary.reserved[0]).toBe('a');
});

it('reserved | should support resetting', () => {
  rcs.baseLibrary.setReserved();

  expect(rcs.baseLibrary.reserved.length).toBe(0);
});

it('reserved | is queriable', () => {
  rcs.baseLibrary.setReserved('a');

  expect(rcs.baseLibrary.isReserved('a')).toBe(true);
  expect(rcs.baseLibrary.isReserved('c')).toBe(false);
});

/* *********** *
 * SETMULTIPLE *
 * *********** */
it('setMultiple | should set multiple values', () => {
  rcs.baseLibrary.setMultiple({
    test: 'a',
    class: 'b',
    selector: 'c',
  });

  expect(rcs.baseLibrary.values.test).toBe('a');
  expect(rcs.baseLibrary.values.class).toBe('b');
  expect(rcs.baseLibrary.values.selector).toBe('c');
});

it('setMultiple | should set nothing', () => {
  rcs.baseLibrary.setMultiple();

  expect(Object.keys(rcs.baseLibrary.values).length).toBe(0);
});

/* ********* *
 * SETPREFIX *
 * ********* */
it('setPrefix', () => {
  expect(rcs.baseLibrary.prefix).toBe('');

  rcs.baseLibrary.setPrefix('pre-');

  expect(rcs.baseLibrary.prefix).toBe('pre-');

  rcs.baseLibrary.setPrefix(1);

  expect(rcs.baseLibrary.prefix).toBe('pre-');

  rcs.baseLibrary.setPrefix({});

  expect(rcs.baseLibrary.prefix).toBe('pre-');

  rcs.baseLibrary.setPrefix('prepre');

  expect(rcs.baseLibrary.prefix).toBe('prepre');
});

/* ********* *
 * SETSUFFIX *
 * ********* */
it('setSuffix', () => {
  expect(rcs.baseLibrary.suffix).toBe('');

  rcs.baseLibrary.setSuffix('-suf');

  expect(rcs.baseLibrary.suffix).toBe('-suf');

  rcs.baseLibrary.setSuffix(1);

  expect(rcs.baseLibrary.suffix).toBe('-suf');

  rcs.baseLibrary.setSuffix({});

  expect(rcs.baseLibrary.suffix).toBe('-suf');

  rcs.baseLibrary.setSuffix('sufsuf');

  expect(rcs.baseLibrary.suffix).toBe('sufsuf');
});

/* ********** *
 * SETEXCLUDE *
 * ********** */
it('setExclude | should avoid adding more of the same exludes | should enable array', () => {
  const excludes = [
    'one-value',
    'one-value',
    'another-value',
  ];

  rcs.baseLibrary.setExclude(excludes);

  expect(rcs.baseLibrary.excludes.length).toBe(2);
});

it('setExclude | should enable array', () => {
  const excludes = [
    'one-value',
    'another-value',
  ];

  rcs.baseLibrary.setExclude(excludes);

  expect(rcs.baseLibrary.excludes.length).toBe(2);
});

it('setExclude | should enable excludes', () => {
  rcs.baseLibrary.setExclude('one-value');
  rcs.baseLibrary.setExclude('second-value');

  expect(rcs.baseLibrary.excludes.length).toBe(2);
});

/* ********** */
/* ISEXCLUDED */
/* ********** */
it('isExcluded | set into excluded', () => {
  rcs.baseLibrary.setExclude('exclude');

  const excluded = rcs.baseLibrary.isExcluded('exclude');

  expect(excluded).toBe(true);
});

it('isExcluded | set into excluded but does not match as regex', () => {
  rcs.baseLibrary.setExclude('noregex');

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  expect(excluded).toBe(false);
});

it('isExcluded | set into excluded and match as regex', () => {
  rcs.baseLibrary.setExclude(/noregex/);

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  expect(excluded).toBe(true);
});

it('isExcluded | set into excluded and match as regex instance', () => {
  rcs.baseLibrary.setExclude(new RegExp('noregex'));

  const excluded = rcs.baseLibrary.isExcluded('noregexxxx');

  expect(excluded).toBe(true);
});

/* **** *
 * SWAP *
 * **** */
it('swap | bad swap', () => {
  rcs.baseLibrary.swap('bob', 'alice');

  expect(rcs.baseLibrary.values).toEqual({});
});

it('swap | functional swap', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('more');

  expect(rcs.baseLibrary.values.move).toBe('a');
  expect(rcs.baseLibrary.values.more).toBe('b');

  rcs.baseLibrary.swap('move', 'more');

  expect(rcs.baseLibrary.values.move).toBe('b');
  expect(rcs.baseLibrary.values.more).toBe('a');
});

/* *** *
 * SET *
 * *** */
it('set | should do nothing', () => {
  rcs.baseLibrary.set();

  expect(rcs.baseLibrary.values).toEqual({});
});

it('set | should set the correct values', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');
  rcs.baseLibrary.set('more');

  expect(rcs.baseLibrary.values.move).toBe('a');
  expect(rcs.baseLibrary.values.animate).toBe('b');
  expect(rcs.baseLibrary.values.more).toBe('c');
});

it('set | should set own values', () => {
  rcs.baseLibrary.set('move', 'mo');
  rcs.baseLibrary.set('animate', 'an');
  rcs.baseLibrary.set('more', 'm');

  expect(rcs.baseLibrary.values.move).toBe('mo');
  expect(rcs.baseLibrary.values.animate).toBe('an');
  expect(rcs.baseLibrary.values.more).toBe('m');
});

it('set | should perform optimal compression', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('a', 'ab');

  expect(rcs.baseLibrary.values.move).toBe('ab');
  expect(rcs.baseLibrary.values.a).toBe('a');
});

it('set | should not set excluded values', () => {
  rcs.baseLibrary.setExclude('move');
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('shouldexist');

  expect(rcs.baseLibrary.values.move).toBeFalsy();
  expect(rcs.baseLibrary.values.shouldexist).toBe('a');
});

it('set | should not set twice', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');

  expect(Object.keys(rcs.baseLibrary.values).length).toBe(2);
  expect(rcs.baseLibrary.values.move).toBe('a');
  expect(rcs.baseLibrary.values.animate).toBe('b');
});

it('set | should not set multiple values', () => {
  rcs.baseLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  expect(rcs.baseLibrary.values.move).toBe('a');
  expect(rcs.baseLibrary.values.animate).toBe('b');
  expect(rcs.baseLibrary.values.more).toBe('c');
});

it('set | should not set multiple excluded of multiple setted values', () => {
  rcs.baseLibrary.setExclude(['move', 'animate']);
  rcs.baseLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  expect(rcs.baseLibrary.values.move).toBeFalsy();
  expect(rcs.baseLibrary.values.animate).toBeFalsy();
  expect(rcs.baseLibrary.values.more).toBe('a');
});

it('set | should not set multiple excluded values', () => {
  rcs.baseLibrary.setExclude(['move', 'no']);
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('no');
  rcs.baseLibrary.set('shouldexist');

  expect(rcs.baseLibrary.values.move).toBeFalsy();
  expect(rcs.baseLibrary.values['.']).toBeFalsy();
  expect(rcs.baseLibrary.values.shouldexist).toBe('a');
});

/* ***** *
 * STATS *
 * ***** */
it('get | not count stats', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');

  rcs.baseLibrary.get('move', { countStats: false });
  rcs.baseLibrary.get('animate', { countStats: false });

  expect(rcs.baseLibrary.meta.move.appearanceCount).toBe(0);
  expect(rcs.baseLibrary.meta.animate.appearanceCount).toBe(0);
});

it('get | count stats', () => {
  rcs.baseLibrary.set('move');
  rcs.baseLibrary.set('animate');
  rcs.baseLibrary.set('more');

  rcs.baseLibrary.get('move');
  rcs.baseLibrary.get('move');
  rcs.baseLibrary.get('move', { countStats: false });
  rcs.baseLibrary.get('animate');

  expect(rcs.baseLibrary.meta.move.appearanceCount).toBe(2);
  expect(rcs.baseLibrary.meta.animate.appearanceCount).toBe(1);
  expect(rcs.baseLibrary.meta.more.appearanceCount).toBe(0);
});

it('get | should not fail when calling get before set', () => {
  expect(() => rcs.baseLibrary.get('move')).not.toThrow();
  expect(rcs.baseLibrary.meta.move.appearanceCount).toBe(1);
});

/* *** *
 * GET *
 * *** */
it('get | should get the values', () => {
  rcs.baseLibrary.values = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.baseLibrary.get('move')).toBe('a');
  expect(rcs.baseLibrary.get('animate')).toBe('b');
  expect(rcs.baseLibrary.get('more')).toBe('c');
  expect(rcs.baseLibrary.get('not-setted-value')).toBe('not-setted-value');
});

it('get | should get the minified values', () => {
  expect(rcs.baseLibrary.compressedValues).toEqual({});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.baseLibrary.compressedValues = object;

  expect(rcs.baseLibrary.compressedValues).toEqual(object);
  expect(rcs.baseLibrary.get('move', { isOriginalValue: false })).toBe('a');
  expect(rcs.baseLibrary.get('animate', { isOriginalValue: false })).toBe('b');
  expect(rcs.baseLibrary.get('more', { isOriginalValue: false })).toBe('c');
});

it('get | should not get excluded values but already set ones', () => {
  rcs.baseLibrary.excludes = ['move'];
  rcs.baseLibrary.values = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.baseLibrary.get('move')).toBe('move');
  expect(rcs.baseLibrary.get('animate')).toBe('b');
  expect(rcs.baseLibrary.get('more')).toBe('c');
});

it('get | should warn if using renamed selector', () => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  const moveSelector = rcs.baseLibrary.get('move');
  const aSelector = rcs.baseLibrary.get('a');

  expect(moveSelector).toBe('a');
  expect(aSelector).not.toBe('a');
});
