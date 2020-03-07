import rcs from '../../lib';

beforeEach(() => {
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
    '#my-id': 'a',
    '.test': 'a',
    '.another-class': 'b',
  });
});

test('should generate correct minified mapping', () => {
  rcs.selectorsLibrary.set(['#my-id', '.test', '.another-class']);

  const mapping = rcs.mapping.generate({ origValues: false });

  expect(mapping).toEqual({
    '#a': 'my-id',
    '.a': 'test',
    '.b': 'another-class',
  });
});
