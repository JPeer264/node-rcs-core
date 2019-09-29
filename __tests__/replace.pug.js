import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

function replacePugMacro(selectors, input, expected, options) {
  const setter = {};
  const toExpect = expected || input;

  selectors.forEach((selector) => { setter[selector] = undefined; });

  rcs.selectorsLibrary.setMultiple(setter);

  expect(rcs.replace.pug(input, options).trim()).toBe(toExpect.trim());
}

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

it('should replace nothing', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    `
doctype html
head
body
  Hi there!
    `,
  );
});

it('should replace class selectors', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    'table#id.test.selector',
    'table#id.test.a',
  );
});

it('should replace class selectors based on issue #50 but with pug', () => {
  replacePugMacro(
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
});

it('should replace class selectors in a normal pug file', () => {
  replacePugMacro(
    ['.jp-block', '.jp-block__element'],
    fs.readFileSync(path.join(fixturesCwd, '/pug/index.pug'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/pug/index.pug'), 'utf8'),
  );
});

it('should replace class selectors within script tags', () => {
  replacePugMacro(
    ['.test', '.selector', '#id'],
    fs.readFileSync(path.join(fixturesCwd, '/pug/script.pug'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/pug/script.pug'), 'utf8'),
  );
});

it('should replace class selectors within style tags', () => {
  replacePugMacro(
    ['.jp-block', '.jp-block__element'],
    fs.readFileSync(path.join(fixturesCwd, '/pug/style.pug'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/pug/style.pug'), 'utf8'),
  );
});

it('should replace with shouldTriggerClassAttribute', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test a")',
    { triggerClassAttributes: ['anything'] },
  );
});

it('should replace with shouldTriggerClassAttribute and glob', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test a")',
    { triggerClassAttributes: [/^any/] },
  );
});

it('should not replace with shouldTriggerClassAttribute and glob', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test selector")',
    { triggerClassAttributes: [/any$/] },
  );
});

it('should replace shouldTriggerClassAttribute glob an normal mixed', () => {
  replacePugMacro(
    ['.selector', '.another-selector'],
    'table#id(anything="test selector" another="selector" data-one="another-selector" data-two="another-selector")',
    'table#id(anything!="test a" another!="a" data-one!="b" data-two!="b")',
    { triggerClassAttributes: ['anything', 'another', /data-*/] },
  );
});

it('should replace with shouldTriggerIdAttribute', () => {
  replacePugMacro(
    ['#selector', '#another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test a")',
    { triggerIdAttributes: ['anything'] },
  );
});

it('should replace with shouldTriggerIdAttribute and glob', () => {
  replacePugMacro(
    ['#selector', '#another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test a")',
    { triggerIdAttributes: [/^any/] },
  );
});

it('should not replace with shouldTriggerIdAttribute and glob', () => {
  replacePugMacro(
    ['#selector', '#another-selector'],
    'table#id(anything="test selector")',
    'table#id(anything!="test selector")',
    { triggerIdAttributes: [/any$/] },
  );
});

it('should replace shouldTriggerIdAttribute glob an normal mixed', () => {
  replacePugMacro(
    ['#selector', '#another-selector'],
    'table#id(anything="test selector" another="selector" data-one="another-selector" data-two="another-selector")',
    'table#id(anything!="test a" another!="a" data-one!="b" data-two!="b")',
    { triggerIdAttributes: ['anything', 'another', /data-*/] },
  );
});

it('should replace inside template | issue #58 but with pug', () => {
  replacePugMacro(
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
});

it('issue rename-css-selectors#30', () => {
  replacePugMacro(
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
});

it('issue rename-css-selectors#30', () => {
  replacePugMacro(
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
});
