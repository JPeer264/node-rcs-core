import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.baseLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.baseLibrary.reset();
  rcs.warnings.reset();
});


test('create some warning without sources', (t) => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');

  t.is(Object.keys(rcs.warnings.warningArray).length, 1);
  t.truthy(rcs.warnings.warningArray.a);

  rcs.warnings.warn();
});

test('create some warning with sources', (t) => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a' } });

  t.is(Object.keys(rcs.warnings.warningArray).length, 1);
  t.is(rcs.warnings.warningArray.a[0].file, 'nofile');
  t.is(rcs.warnings.warningArray.a[0].line, 1);

  rcs.warnings.warn();
});

test('create some warning with common sources', (t) => {
  rcs.baseLibrary.values = {
    move: 'a',
  };
  rcs.baseLibrary.compressedValues = {
    a: 'move',
  };

  rcs.baseLibrary.get('a');
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a'.repeat(501) } });
  rcs.baseLibrary.get('a', { source: { file: 'nofile', line: 1, text: 'a'.repeat(501) } });

  t.is(Object.keys(rcs.warnings.warningArray).length, 1);
  t.is(rcs.warnings.warningArray.a[0].file, 'nofile');
  t.is(rcs.warnings.warningArray.a[0].line, 1);

  rcs.warnings.warn();
});
