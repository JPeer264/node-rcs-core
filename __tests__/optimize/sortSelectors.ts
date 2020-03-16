import sortSelectors from '../../lib/optimize/sortSelectors';

test('should optimize', () => {
  const result = sortSelectors(
    [],
    {
      unused: [],
      usageCount: {
        'short-selector': 14,
        'a-very-long-selector': 2,
      },
    },
  );

  expect(result).toEqual(['short-selector', 'a-very-long-selector']);
});

test('should optimize', () => {
  const result = sortSelectors(
    [],
    {
      unused: [],
      usageCount: {
        'short-selector': 2,
        'a-very-long-selector': 14,
      },
    },
  );

  expect(result).toEqual(['a-very-long-selector', 'short-selector']);
});
