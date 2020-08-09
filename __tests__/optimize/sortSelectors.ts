import sortSelectors from '../../lib/optimize/sortSelectors';

test('should ignore usage count for sorting', () => {
  const result = sortSelectors(
    ['my-selector', 'should-be-here'],
    {
      unused: [],
      usageCount: {
        'not-available-selector': 14,
        'my-selector': 2,
      },
    },
  );

  expect(result).toEqual(['my-selector', 'should-be-here']);
});

test('should optimize', () => {
  const result = sortSelectors(
    ['short-selector', 'a-very-long-selector'],
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

test('sort by occurrence count', () => {
  const result = sortSelectors(
    ['short-selector', 'a-very-long-selector'],
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

test('should sort three by occurrence coun', () => {
  const result = sortSelectors(
    ['first-id', 'second-id', 'third-id'],
    {
      unused: [],
      usageCount: {
        'first-id': 25,
        'second-id': 32,
        'third-id': 29,
      },
    },
  );

  expect(result).toEqual(['second-id', 'third-id', 'first-id']);
});
