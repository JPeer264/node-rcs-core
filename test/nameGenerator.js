import test from 'ava';

import rcs from '../lib/rcs';

test('generate new random name', (t) => {
  t.is(rcs.nameGenerator.generate(), 't');
  t.is(rcs.nameGenerator.generate(), 'n');
  t.is(rcs.nameGenerator.nameCounter, 3);

  rcs.nameGenerator.reset();

  t.is(rcs.nameGenerator.nameCounter, 1);
  t.is(rcs.nameGenerator.generate(), 't');
});

test('generate another alphabet', (t) => {
  rcs.nameGenerator.setAlphabet('#abc');

  t.is(rcs.nameGenerator.generate(), 'a');
});

