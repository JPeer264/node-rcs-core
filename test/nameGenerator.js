import test from 'ava';

import { useCustomGenerator, NameGenerator } from '../lib/nameGenerator';

let nameGenerator;

test.beforeEach(() => {
  nameGenerator = new NameGenerator();
});

test('generate new random name', (t) => {
  t.is(nameGenerator.generate(), 't');
  t.is(nameGenerator.generate(), 'n');
  t.is(nameGenerator.nameCounter, 3);

  nameGenerator.reset();

  t.is(nameGenerator.nameCounter, 1);
  t.is(nameGenerator.generate(), 't');
});

test('generate another alphabet', (t) => {
  nameGenerator.setAlphabet('#abc');

  t.is(nameGenerator.generate(), 'a');
});

test('use customNameGenerator', (t) => {
  nameGenerator.setAlphabet('#abcd');

  t.is(nameGenerator.generate(), 'a');

  useCustomGenerator(() => 'custom');

  t.is(nameGenerator.generate(), 'custom');

  useCustomGenerator(() => 'another');

  t.is(nameGenerator.generate(), 'another');

  useCustomGenerator(null);

  t.is(nameGenerator.generate(), 'd');
});
