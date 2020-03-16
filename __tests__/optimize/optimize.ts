import rcs from '../../lib';
import sortSelectors from '../../lib/optimize/sortSelectors';

jest.mock('../../lib/optimize/sortSelectors');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedSortSelectors = (sortSelectors as any) as jest.Mock<typeof sortSelectors>;

beforeEach(() => {
  rcs.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.cssVariablesLibrary.reset();
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.reset();
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();

  mockedSortSelectors.mockImplementation((array) => (
    array.map(([selector]) => selector).sort()
  ));
});

test('should optimize', () => {
  rcs.mapping.load({
    selectors: {
      '#test': 'a',
      '.c': 'a',
      '.b': 'b',
      '.a': 'c',
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
      '.a': 'a',
      '.b': 'b',
      '.c': 'c',
    },
  });
});
