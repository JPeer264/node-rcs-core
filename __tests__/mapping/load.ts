import rcs from '../../lib';

beforeEach(() => {
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.reset();
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
    selectors: {
      '#test': 'a',
      '.my-selector': 'a',
      '.another-selector': 'd',
    },
  });

  expect(rcs.selectorsLibrary.get('#test')).toBe('a');
  expect(rcs.selectorsLibrary.get('#test', { addSelectorType: true })).toBe('#a');
  expect(rcs.selectorsLibrary.get('.my-selector')).toBe('a');
  expect(rcs.selectorsLibrary.get('.another-selector')).toBe('d');
});

test('should load correct mapping with origValues false', () => {
  rcs.mapping.load({
    selectors: {
      '#a': 'test',
      '.a': 'my-selector',
      '.d': 'another-selector',
    },
  }, { origValues: false });

  expect(rcs.selectorsLibrary.get('#test')).toBe('a');
  expect(rcs.selectorsLibrary.get('#test', { addSelectorType: true })).toBe('#a');
  expect(rcs.selectorsLibrary.get('.my-selector')).toBe('a');
  expect(rcs.selectorsLibrary.get('.another-selector')).toBe('d');
});

test('should generate keyframes mapping', () => {
  rcs.mapping.load({
    selectors: {
      '@my-keyframe': 'a',
      '@more-keyframes': 'b',
    },
  });

  expect(rcs.keyframesLibrary.get('@my-keyframe')).toBe('a');
  expect(rcs.keyframesLibrary.get('@more-keyframes')).toBe('b');
});

test('should generate attribute selectors mapping', () => {
  rcs.mapping.load({
    attributeSelectors: [
      '.^te',
      '#*se',
    ],
    selectors: {
      '.test': 'should-NOT-have-this-value',
      '.my-test': 'should-have-this-value',
    },
  });

  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.a-test');
  rcs.selectorsLibrary.set('#a-selector');

  expect(rcs.selectorsLibrary.get('.test')).toBe('tet');
  expect(rcs.selectorsLibrary.get('.my-test')).toBe('should-have-this-value');
  expect(rcs.selectorsLibrary.get('.a-test')).toBe('a');
  expect(rcs.selectorsLibrary.get('#a-selector')).toBe('tsen');
});
