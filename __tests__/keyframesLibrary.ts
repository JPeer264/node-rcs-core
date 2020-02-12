import rcs from '../lib';

beforeEach(() => {
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.reset();
});

it('set | should set own keyframes', () => {
  rcs.keyframesLibrary.set('move', 'mo');
  rcs.keyframesLibrary.set('animate', 'an');
  rcs.keyframesLibrary.set('more', 'm');

  expect(rcs.keyframesLibrary.keyframes.move).toBe('mo');
  expect(rcs.keyframesLibrary.keyframes.animate).toBe('an');
  expect(rcs.keyframesLibrary.keyframes.more).toBe('m');
});

/* *** *
 * GET *
 * *** */
it('get | should get the keyframes', () => {
  rcs.keyframesLibrary.keyframes = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  expect(rcs.keyframesLibrary.get('move')).toBe('a');
  expect(rcs.keyframesLibrary.get('animate')).toBe('b');
  expect(rcs.keyframesLibrary.get('more')).toBe('c');
  expect(rcs.keyframesLibrary.get('not-setted-value')).toBe('not-setted-value');
});

it('get | should get the minified values with deprecated syntax', () => {
  expect(rcs.keyframesLibrary.compressedKeyframes).toEqual({});

  const object = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  rcs.keyframesLibrary.compressedKeyframes = object;

  expect(rcs.keyframesLibrary.compressedKeyframes).toEqual(object);
  expect(rcs.keyframesLibrary.get('move', { origKeyframe: false })).toBe('a');
  expect(rcs.keyframesLibrary.get('animate', { origKeyframe: false })).toBe('b');
  expect(rcs.keyframesLibrary.get('more', { origKeyframe: false })).toBe('c');
});
