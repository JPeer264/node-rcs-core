import rcs from '../../lib';

beforeEach(() => {
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.reset();
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

test('should do nothing', () => {
  const mapping = rcs.mapping.generate();

  expect(mapping).toEqual({});
});

test('should have bad input', () => {
  console.warn = jest.fn();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  expect(rcs.mapping.generate('test' as any)).toEqual({});
  expect(rcs.mapping.generate(2 as any)).toEqual({});
  expect(rcs.mapping.generate(false as any)).toEqual({});
  expect(rcs.mapping.generate(null as any)).toEqual({});
  expect(rcs.mapping.generate({})).toEqual({});
  /* eslint-enable @typescript-eslint/no-explicit-any */

  expect(console.warn).toHaveBeenCalledTimes(4);
});

test('should generate correct mapping', () => {
  rcs.selectorsLibrary.set(['#my-id', '.test', '.another-class']);

  const mapping = rcs.mapping.generate();

  expect(mapping).toEqual({
    selectors: {
      '#my-id': 'a',
      '.test': 'a',
      '.another-class': 'b',
    },
  });
});

test('should generate correct minified mapping', () => {
  rcs.selectorsLibrary.set(['#my-id', '.test', '.another-class']);

  const mapping = rcs.mapping.generate({ origValues: false });

  expect(mapping).toEqual({
    selectors: {
      '#a': 'my-id',
      '.a': 'test',
      '.b': 'another-class',
    },
  });
});

test('should generate correct mapping with attribute selectors', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class*="te"]');
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class^="se"]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector('[id*="se"]');

  const mapping = rcs.mapping.generate();

  expect(mapping).toEqual({
    attributeSelectors: [
      '.*te',
      '.^se',
      '#*se',
    ],
  });
});

test('should add keyframes', () => {
  rcs.keyframesLibrary.set('@my-keyframe');
  rcs.keyframesLibrary.set('@new-keyframe');

  const mapping = rcs.mapping.generate();

  expect(mapping).toEqual({
    selectors: {
      '@my-keyframe': 'a',
      '@new-keyframe': 'b',
    },
  });
});

test('should add keyframes with swapped values', () => {
  rcs.keyframesLibrary.set('@my-keyframe');
  rcs.keyframesLibrary.set('@new-keyframe');

  const mapping = rcs.mapping.generate({ origValues: false });

  expect(mapping).toEqual({
    selectors: {
      '@a': 'my-keyframe',
      '@b': 'new-keyframe',
    },
  });
});

test('should add everything', () => {
  rcs.keyframesLibrary.set('@my-keyframe');
  rcs.selectorsLibrary.set('.my-class');
  rcs.selectorsLibrary.set('.exclude-class');
  rcs.selectorsLibrary.set('#my-id');
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class="exclude-class"]');
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class="exclude-class"]');

  expect(rcs.mapping.generate()).toEqual({
    selectors: {
      '@my-keyframe': 'a',
      '.my-class': 'a',
      '.exclude-class': 'exclude-class',
      '#my-id': 'a',
    },
    attributeSelectors: [
      '.=exclude-class',
    ],
  });

  // reverse
  expect(rcs.mapping.generate({ origValues: false })).toEqual({
    selectors: {
      '@a': 'my-keyframe',
      '.a': 'my-class',
      '.exclude-class': 'exclude-class',
      '#a': 'my-id',
    },
    attributeSelectors: [
      '.=exclude-class',
    ],
  });
});

test('should compile readme example', () => {
  rcs.fillLibraries(`
    @my-animation {
      from {}
      to {}
    }

    .my-selector {
      content: "";
      animation-name: my-animation;
    }

    #my-id {
      content: "";
    }

    .test-selector[class^="sel"] {
      content: "";
    }

    .selector {
      content: "";
    }
  `);

  expect(rcs.mapping.generate()).toEqual({
    attributeSelectors: ['.^sel'],
    selectors: {
      '.my-selector': 'a',
      '#my-id': 'a',
      '.test-selector': 'b',
      '.selector': 'selt',
    },
  });

  expect(rcs.mapping.generate({ origValues: false })).toEqual({
    attributeSelectors: ['.^sel'],
    selectors: {
      '.a': 'my-selector',
      '#a': 'my-id',
      '.b': 'test-selector',
      '.selt': 'selector',
    },
  });
});
