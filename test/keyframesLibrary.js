import test from 'ava';

import rcs from '../lib/rcs';

test.beforeEach(() => {
  // reset counter and keyframes for tests
  rcs.keyframesLibrary.excludes = [];
  rcs.keyframesLibrary.keyframes = {};
  rcs.keyframesLibrary.compressedKeyframes = {};

  rcs.nameGenerator.resetCountForTests();
});

/* *** *
 * GET *
 * *** */
test('get | should get the values', (t) => {
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

test('get | should get the minified values', (t) => {
  rcs.keyframesLibrary.compressedKeyframes = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.keyframesLibrary.get('move', { origKeyframe: false }), 'a');
  t.is(rcs.keyframesLibrary.get('animate', { origKeyframe: false }), 'b');
  t.is(rcs.keyframesLibrary.get('more', { origKeyframe: false }), 'c');
});

test('get | should not get excluded values but already set ones', (t) => {
  rcs.keyframesLibrary.excludes = ['move'];
  rcs.keyframesLibrary.keyframes = {
    move: 'a',
    animate: 'b',
    more: 'c',
  };

  t.is(rcs.keyframesLibrary.get('move'), 'move');
  t.is(rcs.keyframesLibrary.get('animate'), 'b');
  t.is(rcs.keyframesLibrary.get('more'), 'c');
});

/* *** *
 * SET *
 * *** */
test('set | should do nothing', (t) => {
  rcs.keyframesLibrary.set();

  t.deepEqual(rcs.keyframesLibrary.keyframes, {});
});

test('set | should set the correct values', (t) => {
  rcs.keyframesLibrary.set('move');
  rcs.keyframesLibrary.set('animate');
  rcs.keyframesLibrary.set('more');

  t.is(rcs.keyframesLibrary.keyframes.move, 'a');
  t.is(rcs.keyframesLibrary.keyframes.animate, 'b');
  t.is(rcs.keyframesLibrary.keyframes.more, 'c');
});

test('set | should set own keyframes', (t) => {
  rcs.keyframesLibrary.set('move', 'mo');
  rcs.keyframesLibrary.set('animate', 'an');
  rcs.keyframesLibrary.set('more', 'm');

  t.is(rcs.keyframesLibrary.keyframes.move, 'mo');
  t.is(rcs.keyframesLibrary.keyframes.animate, 'an');
  t.is(rcs.keyframesLibrary.keyframes.more, 'm');
});

test('set | should not set excluded keyframe', (t) => {
  rcs.keyframesLibrary.setExclude('move');
  rcs.keyframesLibrary.set('move');
  rcs.keyframesLibrary.set('shouldexist');

  t.falsy(rcs.keyframesLibrary.keyframes.move);
  t.is(rcs.keyframesLibrary.keyframes.shouldexist, 'a');
});

test('set | should not set twice', (t) => {
  rcs.keyframesLibrary.set('move');
  rcs.keyframesLibrary.set('move');
  rcs.keyframesLibrary.set('animate');

  t.is(Object.keys(rcs.keyframesLibrary.keyframes).length, 2);
  t.is(rcs.keyframesLibrary.keyframes.move, 'a');
  t.is(rcs.keyframesLibrary.keyframes.animate, 'b');
});

test('set | should not set multiple keyframes', (t) => {
  rcs.keyframesLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  t.is(rcs.keyframesLibrary.keyframes.move, 'a');
  t.is(rcs.keyframesLibrary.keyframes.animate, 'b');
  t.is(rcs.keyframesLibrary.keyframes.more, 'c');
});

test('set | should not set multiple excluded of multiple setted keyframes', (t) => {
  rcs.keyframesLibrary.setExclude(['move', 'animate']);
  rcs.keyframesLibrary.set([
    'move',
    'animate',
    'more',
  ]);

  t.falsy(rcs.keyframesLibrary.keyframes.move);
  t.falsy(rcs.keyframesLibrary.keyframes.animate);
  t.is(rcs.keyframesLibrary.keyframes.more, 'a');
});

test('set | should not set multiple excluded keyframes', (t) => {
  rcs.keyframesLibrary.setExclude(['move', 'no']);
  rcs.keyframesLibrary.set('move');
  rcs.keyframesLibrary.set('no');
  rcs.keyframesLibrary.set('shouldexist');

  t.falsy(rcs.keyframesLibrary.keyframes.move);
  t.falsy(rcs.keyframesLibrary.keyframes['.']);
  t.is(rcs.keyframesLibrary.keyframes.shouldexist, 'a');
});

/* ******* *
 * EXCLUDE *
 * ******* */
test('exclude | should exclude variables', (t) => {
  rcs.keyframesLibrary.setExclude(['move', 'no']);

  t.is(rcs.keyframesLibrary.excludes.length, 2);
});

test('exclude | should just exclude once', (t) => {
  rcs.keyframesLibrary.setExclude(['move', 'move']);

  t.is(rcs.keyframesLibrary.excludes.length, 1);
  t.is(rcs.keyframesLibrary.excludes[0], 'move');
});

test('exclude | should exclude nothing', (t) => {
  rcs.keyframesLibrary.setExclude();

  t.is(rcs.keyframesLibrary.excludes.length, 0);
});

// 'use strict';

// const rcs    = require('../lib/rcs');
// const expect = require('chai').expect;

// describe('rcs keyframes library', () => {

//     describe('get', () => {

//     describe('set', () => {

//     });

//     describe('exclude', () => {
//     });
// });
