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
  rcs.selectorLibrary.reset();
  rcs.selectorLibrary.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
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

test('should replace class selectors within script tags',
  replacePugMacro,
  ['.test', '.selector', '#id'],
  fs.readFileSync(path.join(fixturesCwd, '/pug/script.pug'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/pug/script.pug'), 'utf8'),
);

test('should replace class selectors within style tags',
  replacePugMacro,
  ['.jp-block', '.jp-block__element'],
  fs.readFileSync(path.join(fixturesCwd, '/pug/style.pug'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/pug/style.pug'), 'utf8'),
);

test('should replace with shouldTriggerClassAttribute',
  replacePugMacro,
  ['.selector', '.another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test a")',
  { triggerClassAttributes: ['anything'] },
);

test('should replace with shouldTriggerClassAttribute and glob',
  replacePugMacro,
  ['.selector', '.another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test a")',
  { triggerClassAttributes: [/^any/] },
);

test('should not replace with shouldTriggerClassAttribute and glob',
  replacePugMacro,
  ['.selector', '.another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test selector")',
  { triggerClassAttributes: [/any$/] },
);

test('should replace shouldTriggerClassAttribute glob an normal mixed',
  replacePugMacro,
  ['.selector', '.another-selector'],
  'table#id(anything="test selector" another="selector" data-one="another-selector" data-two="another-selector")',
  'table#id(anything!="test a" another!="a" data-one!="b" data-two!="b")',
  { triggerClassAttributes: ['anything', 'another', /data-*/] },
);


test('should replace with shouldTriggerIdAttribute',
  replacePugMacro,
  ['#selector', '#another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test a")',
  { triggerIdAttributes: ['anything'] },
);

test('should replace with shouldTriggerIdAttribute and glob',
  replacePugMacro,
  ['#selector', '#another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test a")',
  { triggerIdAttributes: [/^any/] },
);

test('should not replace with shouldTriggerIdAttribute and glob',
  replacePugMacro,
  ['#selector', '#another-selector'],
  'table#id(anything="test selector")',
  'table#id(anything!="test selector")',
  { triggerIdAttributes: [/any$/] },
);

test('should replace shouldTriggerIdAttribute glob an normal mixed',
  replacePugMacro,
  ['#selector', '#another-selector'],
  'table#id(anything="test selector" another="selector" data-one="another-selector" data-two="another-selector")',
  'table#id(anything!="test a" another!="a" data-one!="b" data-two!="b")',
  { triggerIdAttributes: ['anything', 'another', /data-*/] },
);

test('should replace inside template | issue #58 but with pug',
  replacePugMacro,
  ['.selector', '.another-selector'],
  `
.selector
  template(type="selector")
    .another-selector
  `,
  `
.a
  template(type!="selector")
    .b
  `,
);

test('issue rename-css-selectors#30',
  replacePugMacro,
  ['.bar'],
  `
doctype strict
html
  head
  script.
    var foo = "#{bar}"
  body
  `,
  `
doctype strict
html
  head
  script
    | var foo = "!{bar}"
  body
  `,
);


test('issue rename-css-selectors#30',
  replacePugMacro,
  ['.selector', '.bar'],
  `
doctype strict
html
  head
  script.
    var bar = "selector"
    var foo = "#{bar}"
  body
  `,
  `
doctype strict
html
  head
  script.
    var bar = "a"
    var foo = "!{bar}"
  body
  `,
);
