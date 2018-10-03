import test from 'ava';

import rcs from '../lib';
import { useCustomGenerator } from '../lib/nameGenerator';

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

test('use customNameGenerator', (t) => {
  rcs.nameGenerator.setAlphabet('#abcd');

  t.is(rcs.nameGenerator.generate(), 'a');

  useCustomGenerator(() => 'custom');

  t.is(rcs.nameGenerator.generate(), 'custom');

  useCustomGenerator(() => 'another');

  t.is(rcs.nameGenerator.generate(), 'another');

  useCustomGenerator(null);

  t.is(rcs.nameGenerator.generate(), 'd');
});

