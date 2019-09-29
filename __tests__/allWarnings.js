import rcs from '../lib';

beforeEach(() => {
  rcs.baseLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.baseLibrary.reset();
  rcs.warnings.reset();
});

it('create some warning without sources', () => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');

  expect(Object.keys(rcs.warnings.warningArray).length).toBe(1);
  expect(rcs.warnings.warningArray.a).toBeTruthy();

  rcs.warnings.warn();
});

it('create some warning with sources', () => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a' } });

  expect(Object.keys(rcs.warnings.warningArray).length).toBe(1);
  expect(rcs.warnings.warningArray.a[0].file).toBe('nofile');
  expect(rcs.warnings.warningArray.a[0].line).toBe(1);

  rcs.warnings.warn();
});

it('create some warning with common sources', () => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a'.repeat(501) } });
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a'.repeat(501) } });

  expect(Object.keys(rcs.warnings.warningArray).length).toBe(1);
  expect(rcs.warnings.warningArray.a[0].file).toBe('nofile');
  expect(rcs.warnings.warningArray.a[0].line).toBe(1);

  rcs.warnings.warn();
});
