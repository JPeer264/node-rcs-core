import rcs from '../lib';

beforeEach(() => {
  // reset counter and selectors for tests
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
});

it('fillLibraries should fill all libraries', () => {
  rcs.fillLibraries('.test{}#id[class^="te"]{}@keyframes move { from {} to {} }');


  expect(rcs.selectorsLibrary.get('test')).toBe('tet');
  expect(rcs.selectorsLibrary.get('id')).toBe('a');
  expect(rcs.keyframesLibrary.get('move')).toBe('move');
});

it('fillLibraries should fill all libraries', () => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      replaceKeyframes: true,
      ignoreAttributeSelectors: true,
    },
  );


  expect(rcs.keyframesLibrary.get('move')).toBe('a');
  expect(rcs.selectorsLibrary.get('id')).toBe('a');
  expect(rcs.selectorsLibrary.get('test')).toBe('a');
});

it('fillLibraries should fill all libraries with pre or suffixes', () => {
  rcs.fillLibraries(
    '.test{}#id[class^="te"]{}@keyframes move { from {} to {} }',
    {
      prefix: 'pre-',
      suffix: '-suf',
    },
  );


  expect(rcs.selectorsLibrary.get('test')).toBe('pre-tet-suf');
  expect(rcs.selectorsLibrary.get('id')).toBe('pre-a-suf');
  expect(rcs.keyframesLibrary.get('move')).toBe('move');
});

it('fillLibraries should fill nothing from html', () => {
  rcs.fillLibraries(
    '<div>Hi there!</div>',
    {
      codeType: 'html',
    },
  );

  expect(Object.keys(rcs.selectorsLibrary.getClassSelector().values).length).toBe(0);
  expect(Object.keys(rcs.selectorsLibrary.getIdSelector().values).length).toBe(0);
});

it('fillLibraries should fill classes from html', () => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style></div>',
    {
      codeType: 'html',
    },
  );

  expect(rcs.selectorsLibrary.get('id')).toBe('a');
  expect(rcs.selectorsLibrary.get('test')).toBe('a');
});


it('fillLibraries should fill classes from html with multiple style tags', () => {
  rcs.fillLibraries(
    '<div>Hi there!<style>.test{} #id{}</style><style>.another-class {}</style></div>',
    {
      codeType: 'html',
    },
  );

  expect(rcs.selectorsLibrary.get('test')).toBe('a');
  expect(rcs.selectorsLibrary.get('id')).toBe('a');
  expect(rcs.selectorsLibrary.get('another-class')).toBe('b');
});
