import path from 'path';
import fs from 'fs';
import { minify } from 'html-minifier';

import rcs from '../lib';

const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

function replaceHtmlMacro(selectors, input, expected, options) {
  const toExpect = expected || input;

  rcs.selectorsLibrary.fillLibrary(selectors);

  expect(rcs.replace.html(input, options)).toBe(toExpect);
}

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
});

it('should replace nothing', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<!DOCTYPE html><html><head></head><body>Hi there!</body></html>',
  );
});

it('should replace class selectors', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table class="test selector" id="id"></table>',
    '<table class="test a" id="id"></table>',
  );
});

it('should replace class selectors', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table class="test selector" id="id"></table>',
    '<table class="test a" id="id"></table>',
  );
});

it('should replace class selectors based on issue #50', () => {
  replaceHtmlMacro(
    '.cl1 {}',
    '<p class="cl1">text with \'single quote</p><p class="cl1">another s\'ingle quote</p>',
    '<p class="a">text with \'single quote</p><p class="a">another s\'ingle quote</p>',
  );
});

it('should replace for attribute too based on issue #87', () => {
  replaceHtmlMacro(
    '#id1 {}',
    '<input id="id1"><label for="id1">some label</label>',
    '<input id="a"><label for="a">some label</label>',
  );
});

it('should replace class selectors in a normal html file', () => {
  replaceHtmlMacro(
    '.jp-block {} .jp-block__element {}',
    minify(fs.readFileSync(path.join(fixturesCwd, '/html/index.html'), 'utf8'), { collapseWhitespace: true }),
    minify(fs.readFileSync(path.join(resultsCwd, '/html/index.only.html'), 'utf8'), { collapseWhitespace: true }),
  );
});

it('should replace class selectors within script tags', () => {
  replaceHtmlMacro(
    '.test {} .selector {} #id {}',
    minify(fs.readFileSync(path.join(fixturesCwd, '/html/script.html'), 'utf8'), { collapseWhitespace: true }),
    minify(fs.readFileSync(path.join(resultsCwd, '/html/script.html'), 'utf8'), { collapseWhitespace: true }),
  );
});

it('should replace class selectors within style tags', () => {
  replaceHtmlMacro(
    '.jp-block {} .jp-block__element {}',
    minify(fs.readFileSync(path.join(fixturesCwd, '/html/style.html'), 'utf8'), { collapseWhitespace: true }),
    minify(fs.readFileSync(path.join(resultsCwd, '/html/style.html'), 'utf8'), { collapseWhitespace: true }),
  );
});

it('should replace with shouldTriggerClassAttribute', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test a" id="id"></table>',
    { triggerClassAttributes: ['anything'] },
  );
});

it('should replace with shouldTriggerClassAttribute and glob', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test a" id="id"></table>',
    { triggerClassAttributes: [/^any/] },
  );
});

it('should not replace with shouldTriggerClassAttribute and glob', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test selector" id="id"></table>',
    { triggerClassAttributes: [/any$/] },
  );
});

it('should replace shouldTriggerClassAttribute glob an normal mixed', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<table anything="test selector" another="selector" data-one="another-selector" data-two="another-selector" id="id"></table>',
    '<table anything="test a" another="a" data-one="b" data-two="b" id="id"></table>',
    { triggerClassAttributes: ['anything', 'another', /data-*/] },
  );
});


it('should replace with shouldTriggerIdAttribute', () => {
  replaceHtmlMacro(
    '#selector {} #another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test a" id="id"></table>',
    { triggerIdAttributes: ['anything'] },
  );
});

it('should replace with shouldTriggerIdAttribute and glob', () => {
  replaceHtmlMacro(
    '#selector {} #another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test a" id="id"></table>',
    { triggerIdAttributes: [/^any/] },
  );
});

it('should not replace with shouldTriggerIdAttribute and glob', () => {
  replaceHtmlMacro(
    '#selector {} #another-selector {}',
    '<table anything="test selector" id="id"></table>',
    '<table anything="test selector" id="id"></table>',
    { triggerIdAttributes: [/any$/] },
  );
});

it('should replace shouldTriggerIdAttribute glob an normal mixed', () => {
  replaceHtmlMacro(
    '#selector {} #another-selector {}',
    '<table anything="test selector" another="selector" data-one="another-selector" data-two="another-selector" id="id"></table>',
    '<table anything="test a" another="a" data-one="b" data-two="b" id="id"></table>',
    { triggerIdAttributes: ['anything', 'another', /data-*/] },
  );
});

it('should replace inside template | issue #58', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    '<div class="selector"><template type="selector"><div class="another-selector"></div></template></div>',
    '<div class="a"><template type="selector"><div class="b"></div></template></div>',
  );
});

it('should replace escaped selectors | issue #67', () => {
  replaceHtmlMacro(
    '.selector\\:some-thing:after {} .another-selector {}',
    '<table class="test selector:some-thing" id="id"></table>',
    '<table class="test a" id="id"></table>',
  );
});

it('should replace javascript', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    `
      <div class="selector another-selector">
        <script data-something="data">
          const a = "selector";
        </script>
      </div>
    `,
    `
      <div class="a b">
        <script data-something="data">
          const a = "a";
        </script>
      </div>
    `,
  );
});

it('should replace css', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    `
      <div class="selector another-selector">
        <style>
          .another-selector {}
        </style>
      </div>
    `,
    `
      <div class="a b">
        <style>
          .b {}
        </style>
      </div>
    `,
  );
});

it('should ignore JSON | issue #70', () => {
  replaceHtmlMacro(
    '.selector {} .another-selector {}',
    `
      <div class="selector another-selector">
        <script type="application/json">
          {
            "duration": "0.4s",
            "shouldNotReplace": "another-selector",
            "delay": "0.4s"
          }
        </script>
      </div>
    `,
    `
      <div class="a b">
        <script type="application/json">
          {
            "duration": "0.4s",
            "shouldNotReplace": "another-selector",
            "delay": "0.4s"
          }
        </script>
      </div>
    `,
  );
});
