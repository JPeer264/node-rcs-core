import { useCustomGenerator, NameGenerator } from '../lib/nameGenerator';

let nameGenerator;

beforeEach(() => {
  nameGenerator = new NameGenerator();
});

it('generate new random name', () => {
  expect(nameGenerator.generate()).toBe('t');
  expect(nameGenerator.generate()).toBe('n');
  expect(nameGenerator.nameCounter).toBe(3);

  nameGenerator.reset();

  expect(nameGenerator.nameCounter).toBe(1);
  expect(nameGenerator.generate()).toBe('t');
});

it('generate another alphabet', () => {
  nameGenerator.setAlphabet('#abc');

  expect(nameGenerator.generate()).toBe('a');
});

it('use customNameGenerator', () => {
  nameGenerator.setAlphabet('#abcd');

  expect(nameGenerator.generate()).toBe('a');

  useCustomGenerator(() => 'custom');

  expect(nameGenerator.generate()).toBe('custom');

  useCustomGenerator(() => 'another');

  expect(nameGenerator.generate()).toBe('another');

  useCustomGenerator(null);

  expect(nameGenerator.generate()).toBe('d');
});
