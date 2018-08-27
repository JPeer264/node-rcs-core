import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replacePugMacro(t, selectors, input, expected, options) {
  const setter = {};
  const expect = expected || input;

  selectors.forEach((selector) => { setter[selector] = undefined; });

  rcs.selectorLibrary.setMultiple(setter);

  t.is(rcs.replace.pug(input, options).trim(), expect.trim());
}

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
});

test('should replace nothing',
  replacePugMacro,
  ['.selector', '.another-selector'],
  `
doctype html
head
body
  Hi there!
  `,
);

test('should replace class selectors',
  replacePugMacro,
  ['.selector', '.another-selector'],
  'table#id.test.selector',
  'table#id.test.a',
);

test('should replace class selectors based on issue #50 but with pug',
  replacePugMacro,
  ['.cl1'],
  `
p.cl1
  text with 'single quote
p.cl1
  another s'ingle quote
  `,
  `
p.a
  text with 'single quote
p.a
  another s'ingle quote
  `,
);

test('should replace class selectors in a normal pug file',
  replacePugMacro,
  ['.jp-block', '.jp-block__element'],
  fs.readFileSync(path.join(fixturesCwd, '/pug/index.pug'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/pug/index.pug'), 'utf8'),
);
