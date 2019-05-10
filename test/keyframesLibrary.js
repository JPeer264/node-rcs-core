import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.keyframesLibrary.reset();
});

/* *** *
 * GET *
 * *** */
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
