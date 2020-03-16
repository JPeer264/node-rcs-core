import separateMappingSelectors from '../../lib/optimize/separateMappingSelectors';

test('should do nothing', () => {
  expect(separateMappingSelectors()).toEqual({
    cssVariables: [],
    keyframes: [],
    classes: [],
    ids: [],
  });
});

test('should separate selectors correctly', () => {
  expect(separateMappingSelectors({
    '.test': 'a',
    '#my-id': 'a',
    '#my-other-id': 'b',
  })).toEqual({
    cssVariables: [],
    keyframes: [],
    classes: [['test', 'a']],
    ids: [['my-id', 'a'], ['my-other-id', 'b']],
  });
});

test('should separate selectors, keyframes and cssVariables correctly', () => {
  expect(separateMappingSelectors({
    '.test': 'a',
    '#my-id': 'a',
    '#my-other-id': 'b',
    '-my-var': 'a',
    '@my-keyframe': 'a',
  })).toEqual({
    cssVariables: [['my-var', 'a']],
    keyframes: [['my-keyframe', 'a']],
    classes: [['test', 'a']],
    ids: [['my-id', 'a'], ['my-other-id', 'b']],
  });
});
