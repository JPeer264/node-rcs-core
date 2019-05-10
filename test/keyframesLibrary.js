import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.keyframesLibrary.reset();
});

test('set | should set own keyframes', (t) => {
  rcs.keyframesLibrary.set('move', 'mo');
  rcs.keyframesLibrary.set('animate', 'an');
  rcs.keyframesLibrary.set('more', 'm');

  t.is(rcs.keyframesLibrary.keyframes.move, 'mo');
  t.is(rcs.keyframesLibrary.keyframes.animate, 'an');
  t.is(rcs.keyframesLibrary.keyframes.more, 'm');
});

/* *** *
 * GET *
 * *** */
test('get | should get the keyframes', (t) => {
  rcs.keyframesLibrary.keyframes = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.keyframesLibrary.get('move'), 'a');
  t.is(rcs.keyframesLibrary.get('animate'), 'b');
  t.is(rcs.keyframesLibrary.get('more'), 'c');
  t.is(rcs.keyframesLibrary.get('not-setted-value'), 'not-setted-value');
});

test('get | should get the minified values with deprecated syntax', (t) => {
  t.deepEqual(rcs.keyframesLibrary.compressedKeyframes, {});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.keyframesLibrary.compressedKeyframes = object;

  t.deepEqual(rcs.keyframesLibrary.compressedKeyframes, object);
  t.is(rcs.keyframesLibrary.get('move', { origKeyframe: false }), 'a');
  t.is(rcs.keyframesLibrary.get('animate', { origKeyframe: false }), 'b');
  t.is(rcs.keyframesLibrary.get('more', { origKeyframe: false }), 'c');
});
