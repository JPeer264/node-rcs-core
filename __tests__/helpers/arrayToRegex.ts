import arrayToRegex from '../../lib/helpers/arrayToRegex';

describe('arrayToRegex', () => {
  it('should return null on empty array', () => {
    expect(arrayToRegex([])).toBeNull();
  });

  it('should sort by length', () => {
    expect(arrayToRegex(['bb', 'ccc', 'a'])).toStrictEqual(/(ccc)|(bb)|(a)/g);
  });

  it('should add a specific modifier', () => {
    expect(arrayToRegex(['bb', 'a', 'ccc'], (a) => `--${a}`)).toStrictEqual(/(--ccc)|(--bb)|(--a)/g);
  });
});
