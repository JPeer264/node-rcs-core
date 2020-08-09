import rcs from '../../lib';

beforeEach(() => {
  rcs.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.cssVariablesLibrary.reset();
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.reset();
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.statistics.load(undefined);
});

test('should ignore everything without selectors but with statistics', () => {
  const input = { };

  rcs.mapping.load(input);
  rcs.statistics.load({
    ids: {
      unused: [],
      usageCount: {
        test: 2,
      },
    },
    classes: {
      unused: [],
      usageCount: {
        'my-selector': 2,
      },
    },
    keyframes: {
      unused: [],
      usageCount: {},
    },
    cssVariables: {
      unused: [],
      usageCount: {},
    },
  });

  rcs.optimize();

  expect(rcs.mapping.generate()).toEqual(input);
});

test('should ignore when no statistics are available', () => {
  const input = {
    selectors: {
      '#test': 'a',
      '.ca': 'a',
      '.ba': 'b',
      '.aa': 'c',
    },
  };

  rcs.mapping.load(input);
  rcs.optimize();

  expect(rcs.mapping.generate()).toEqual(input);
});

test('should optimize without usageCount', () => {
  rcs.mapping.load({
    selectors: {
      '#test': 'a',
      '.ca': 'a',
      '.ba': 'b',
      '.aa': 'c',
    },
  });
  rcs.statistics.load({
    ids: {
      unused: [],
      usageCount: {
        test: 2,
      },
    },
    classes: {
      unused: [],
      usageCount: {
        'my-selector': 2,
      },
    },
    keyframes: {
      unused: [],
      usageCount: {},
    },
    cssVariables: {
      unused: [],
      usageCount: {},
    },
  });

  rcs.optimize();

  expect(rcs.mapping.generate()).toEqual({
    selectors: {
      '#test': 'a',
      '.aa': 'c',
      '.ba': 'b',
      '.ca': 'a',
    },
  });
});

test('should optimize with usageCount', () => {
  rcs.mapping.load({
    selectors: {
      '#test': 'a',
      '.ca': 'a',
      '.ba': 'b',
      '.aa': 'c',
    },
  });
  rcs.statistics.load({
    ids: {
      unused: [],
      usageCount: {
        test: 2,
      },
    },
    classes: {
      unused: [],
      usageCount: {
        ca: 3,
        ba: 10,
      },
    },
    keyframes: {
      unused: [],
      usageCount: {},
    },
    cssVariables: {
      unused: [],
      usageCount: {},
    },
  });

  rcs.optimize();

  expect(rcs.mapping.generate()).toEqual({
    selectors: {
      '#test': 'a',
      '.aa': 'c',
      '.ba': 'a',
      '.ca': 'b',
    },
  });
});

test('should optimize everything', () => {
  rcs.mapping.load({
    selectors: {
      '#a-first': 'a',
      '#b-second': 'b',
      '.a-first': 'a',
      '.b-second': 'b',
      '@a-first': 'a',
      '@b-second': 'b',
      '-a-first': 'a',
      '-b-second': 'b',
    },
  });
  rcs.statistics.load({
    ids: {
      unused: [],
      usageCount: {
        'a-first': 1,
        'b-second': 3,
      },
    },
    classes: {
      unused: [],
      usageCount: {
        'a-first': 1,
        'b-second': 3,
      },
    },
    keyframes: {
      unused: [],
      usageCount: {
        'a-first': 1,
        'b-second': 3,
      },
    },
    cssVariables: {
      unused: [],
      usageCount: {
        'a-first': 1,
        'b-second': 3,
      },
    },
  });

  rcs.optimize();

  expect(rcs.mapping.generate()).toEqual({
    selectors: {
      '#a-first': 'b',
      '#b-second': 'a',
      '.a-first': 'b',
      '.b-second': 'a',
      '@a-first': 'b',
      '@b-second': 'a',
      '-a-first': 'b',
      '-b-second': 'a',
    },
  });
});
