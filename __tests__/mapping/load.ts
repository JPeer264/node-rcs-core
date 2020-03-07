import rcs from '../../lib';

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

test('should do nothing', () => {
  rcs.mapping.load({});

  expect(rcs.mapping.generate()).toEqual({});
});

test('should have bad input', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  rcs.mapping.load(false as any);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  expect(rcs.mapping.generate()).toEqual({});
});

test('should load correct mapping', () => {
  rcs.mapping.load({
    '#test': 'a',
    '.my-selector': 'a',
    '.another-selector': 'd',
  });

  expect(rcs.selectorsLibrary.get('#test')).toBe('a');
  expect(rcs.selectorsLibrary.get('#test', { addSelectorType: true })).toBe('#a');
  expect(rcs.selectorsLibrary.get('.my-selector')).toBe('a');
  expect(rcs.selectorsLibrary.get('.another-selector')).toBe('d');
});

test('should load correct mapping with origValues false', () => {
  rcs.mapping.load({
    '#a': 'test',
    '.a': 'my-selector',
    '.d': 'another-selector',
  }, { origValues: false });

  expect(rcs.selectorsLibrary.get('#test')).toBe('a');
  expect(rcs.selectorsLibrary.get('#test', { addSelectorType: true })).toBe('#a');
  expect(rcs.selectorsLibrary.get('.my-selector')).toBe('a');
  expect(rcs.selectorsLibrary.get('.another-selector')).toBe('d');
});
