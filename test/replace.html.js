import test from 'ava';
import path from 'path';
import fs from 'fs';
import { minify } from 'html-minifier';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceHtmlMacro(t, selectors, input, expected) {
  const setter = {};
  const expect = expected || input;

  selectors.forEach((selector) => { setter[selector] = undefined; });

  rcs.selectorLibrary.setMultiple(setter);

  t.is(rcs.replace.html(input), expect);
}

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('should replace nothing',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<!DOCTYPE html><html><head></head><body>Hi there!</body></html>',
);

test('should replace class selectors',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table class="test selector" id="id"></table>',
  '<table class="test a" id="id"></table>',
);

test('should replace class selectors',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table class="test selector" id="id"></table>',
  '<table class="test a" id="id"></table>',
);

test('should replace class selectors in a normal html file',
  replaceHtmlMacro,
  ['.jp-block', '.jp-block__element'],
  minify(fs.readFileSync(path.join(fixturesCwd, '/html/index.html'), 'utf8'), { collapseWhitespace: true }),
  minify(fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8'), { collapseWhitespace: true }),
);

test('should replace class selectors within script tags',
  replaceHtmlMacro,
  ['.test', '.selector', '#id'],
  minify(fs.readFileSync(path.join(fixturesCwd, '/html/script.html'), 'utf8'), { collapseWhitespace: true }),
  minify(fs.readFileSync(path.join(resultsCwd, '/html/script.html'), 'utf8'), { collapseWhitespace: true }),
);

test('should replace class selectors within style tags',
  replaceHtmlMacro,
  ['.jp-block', '.jp-block__element'],
  minify(fs.readFileSync(path.join(fixturesCwd, '/html/style.html'), 'utf8'), { collapseWhitespace: true }),
  minify(fs.readFileSync(path.join(resultsCwd, '/html/style.html'), 'utf8'), { collapseWhitespace: true }),
);

