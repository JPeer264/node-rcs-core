import test from 'ava';
import path from 'path';
import fs from 'fs';
import { minify } from 'html-minifier';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceHtmlMacro(t, selectors, input, expected, options) {
  const setter = {};
  const expect = expected || input;

  selectors.forEach((selector) => { setter[selector] = undefined; });

  rcs.selectorLibrary.setMultiple(setter);

  t.is(rcs.replace.html(input, options), expect);
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

test('should replace class selectors based on issue #50',
  replaceHtmlMacro,
  ['.cl1'],
  '<p class="cl1">text with \'single quote</p><p class="cl1">another s\'ingle quote</p>',
  '<p class="a">text with \'single quote</p><p class="a">another s\'ingle quote</p>',
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

test('should replace with shouldTriggerClassAttribute',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test a" id="id"></table>',
  { triggerClassAttributes: ['anything'] },
);

test('should replace with shouldTriggerClassAttribute and glob',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test a" id="id"></table>',
  { triggerClassAttributes: [/^any/] },
);

test('should not replace with shouldTriggerClassAttribute and glob',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test selector" id="id"></table>',
  { triggerClassAttributes: [/any$/] },
);

test('should replace shouldTriggerClassAttribute glob an normal mixed',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<table anything="test selector" another="selector" data-one="another-selector" data-two="another-selector" id="id"></table>',
  '<table anything="test a" another="a" data-one="b" data-two="b" id="id"></table>',
  { triggerClassAttributes: ['anything', 'another', /data-*/] },
);


test('should replace with shouldTriggerIdAttribute',
  replaceHtmlMacro,
  ['#selector', '#another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test a" id="id"></table>',
  { triggerIdAttributes: ['anything'] },
);

test('should replace with shouldTriggerIdAttribute and glob',
  replaceHtmlMacro,
  ['#selector', '#another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test a" id="id"></table>',
  { triggerIdAttributes: [/^any/] },
);

test('should not replace with shouldTriggerIdAttribute and glob',
  replaceHtmlMacro,
  ['#selector', '#another-selector'],
  '<table anything="test selector" id="id"></table>',
  '<table anything="test selector" id="id"></table>',
  { triggerIdAttributes: [/any$/] },
);

test('should replace shouldTriggerIdAttribute glob an normal mixed',
  replaceHtmlMacro,
  ['#selector', '#another-selector'],
  '<table anything="test selector" another="selector" data-one="another-selector" data-two="another-selector" id="id"></table>',
  '<table anything="test a" another="a" data-one="b" data-two="b" id="id"></table>',
  { triggerIdAttributes: ['anything', 'another', /data-*/] },
);

test('should replace inside template | issue #58',
  replaceHtmlMacro,
  ['.selector', '.another-selector'],
  '<div class="selector"><template type="selector"><div class="another-selector"></div></template></div>',
  '<div class="a"><template type="selector"><div class="b"></div></template></div>',
);

test('should replace escaped selectors | issue #67',
  replaceHtmlMacro,
  ['.selector\\:some-thing:after', '.another-selector'],
  '<table class="test selector:some-thing" id="id"></table>',
  '<table class="test a" id="id"></table>',
);
