import test from 'ava';

import rcs from '../lib';

test.beforeEach((t) => {
  // reset counter and selectors for tests
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();

  // eslint-disable-next-line no-param-reassign
  t.context.setSelectors = () => {
    rcs.selectorLibrary.set([
      '.test',
      '#id',
      '.jp-selector',
    ]);
  };
});

/* *** *
 * GET *
 * *** */
test('get | should not get any', (t) => {
  t.context.setSelectors();

  const selector = rcs.selectorLibrary.get('.nothing-to-get');

  t.is(selector, '.nothing-to-get');
});

test('get | should get every single selectors', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorLibrary.get('.test');
  const testSelector = rcs.selectorLibrary.get('test');

  t.is(dotTestSelector, 'a');
  t.is(testSelector, 'a');
});

test('get | should get every single selectors with type char', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorLibrary.get('.test', { addSelectorType: true });
  const testSelector = rcs.selectorLibrary.get('test', { addSelectorType: true });

  t.is(dotTestSelector, '.a');
  t.is(testSelector, '.a');
});

test('get | with pre- suffix', (t) => {
  t.context.setSelectors();

  rcs.selectorLibrary.setPrefix('pre-');
  rcs.selectorLibrary.setSuffix('-suf');

  const selector = rcs.selectorLibrary.get('.test');
  const selectorWithType = rcs.selectorLibrary.get('.test', { addSelectorType: true });

  t.is(selector, 'pre-a-suf');
  t.is(selectorWithType, '.pre-a-suf');
});

test('get | should not get excluded selector', (t) => {
  t.context.setSelectors();

  rcs.selectorLibrary.excludes = ['test'];

  const dotTestSelector = rcs.selectorLibrary.get('.test');
  const testSelector = rcs.selectorLibrary.get('test');

  t.is(dotTestSelector, '.test');
  t.is(testSelector, 'test');
});

test('get | extend true', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorLibrary.get('.test', { extend: true });

  t.is(typeof dotTestSelector, 'object');
  t.is(dotTestSelector.compressedSelector, 'a');
  t.is(dotTestSelector.selector, '.test');
});


/* ****** *
 * GETALL *
 * ****** */
test.skip('getall | should return a regex of compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    getRenamedValues: true,
    regex: true,
    addSelectorType: true,
  });

  t.is(regex, /\.a|#b|\.c/g);
});

test('getall | should return an array with selectors', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    addSelectorType: true,
  });

  t.truthy(array['.test']);
  t.truthy(array['#id']);
  t.truthy(array['.jp-selector']);

  t.falsy(array['.a']);
  t.falsy(array['#b']);
  t.falsy(array['.c']);

  t.is(array['.test'], 'a');
  t.is(array['#id'], 'b');
});

test('getall | should return an array with compressed selectors', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    getRenamedValues: true,
    addSelectorType: true,
  });


  t.falsy(array['.test']);
  t.falsy(array['#id']);
  t.falsy(array['.jp-selector']);

  t.truthy(array['.a']);
  t.truthy(array['#b']);
  t.truthy(array['.c']);

  t.is(array['.a'], 'test');
  t.is(array['#b'], 'id');
});

test.skip('getall | should return a regex of non compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    regex: true,
    addSelectorType: true,
  });

  t.is(regex, /\.test|#id|\.jp-selector/g);
});

test.skip('getall | should return a regex of non compressed selecotrs', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    getRenamedValues: true,
    regex: true,
  });

  t.is(regex, /a|b|c/g);
});

test.skip('getall | should return a regex of compressed selectors', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorLibrary.getAll({
    regex: true,
  });

  t.is(regex, /test|id|jp-selector/g);
});

test('getall | should get all extend', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    extend: true,
  });

  t.is(typeof cssObject.test, 'object');
  t.is(cssObject.test.type, 'class');
  t.is(cssObject.test.compressedSelector, 'a');

  t.is(typeof cssObject.id, 'object');
  t.is(cssObject.id.type, 'id');
  t.is(cssObject.id.compressedSelector, 'b');
});

test('getall | should get all extend with selectors', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['.test'], 'object');
  t.is(cssObject['.test'].type, 'class');
  t.is(cssObject['.test'].compressedSelector, 'a');

  t.is(typeof cssObject['#id'], 'object');
  t.is(cssObject['#id'].type, 'id');
  t.is(cssObject['#id'].compressedSelector, 'b');
});

test('getall | should get all normal with selectors', (t) => {
  t.context.setSelectors();

  const cssObject = rcs.selectorLibrary.getAll({
    getRenamedValues: true,
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['.a'], 'object');
  t.is(cssObject['.a'].type, 'class');
  t.is(cssObject['.a'].modifiedSelector, 'test');

  t.is(typeof cssObject['#b'], 'object');
  t.is(cssObject['#b'].type, 'id');
  t.is(cssObject['#b'].modifiedSelector, 'id');
});

test('getall | should get all setted classes', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll();

  t.is(typeof array, 'object');
  t.is(array.test, 'a');
  t.is(array.id, 'b');
  t.is(array['jp-selector'], 'c');
});

test('getall | should get all setted compressed classes', (t) => {
  t.context.setSelectors();

  const array = rcs.selectorLibrary.getAll({
    getRenamedValues: true,
  });

  t.is(typeof array, 'object');
  t.is(array.a, 'test');
  t.is(array.b, 'id');
  t.is(array.c, 'jp-selector');
});

/* *** *
 * SET *
 * *** */
test('set | should set nothing', (t) => {
  rcs.selectorLibrary.set();

  t.deepEqual(rcs.selectorLibrary.selectors, {});
});

test('set | should set a new value and get this value', (t) => {
  rcs.selectorLibrary.set('.test');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
});

test('set | should set a new custom value', (t) => {
  rcs.selectorLibrary.set('.test', 'random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
});

test('set | should set a new custom value', (t) => {
  rcs.selectorLibrary.set('.test', 'random-name');
  rcs.selectorLibrary.set('.test2', 'random-name');
  rcs.selectorLibrary.set('.test3', 'random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
  t.is(rcs.selectorLibrary.selectors.test2.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.test3.compressedSelector, 'b');
});

test('set | should set a new custom value with selector type', (t) => {
  rcs.selectorLibrary.set('.test', '.random-name');

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'random-name');
});

test('set | should set values out of an array', (t) => {
  rcs.selectorLibrary.set([
    '.test',
    '#id',
    '.jp-selector',
  ]);

  // should be set
  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.id.compressedSelector, 'b');
  t.is(rcs.selectorLibrary.selectors['jp-selector'].compressedSelector, 'c');

  // should not be set
  t.falsy(rcs.selectorLibrary.selectors['not-set']);
});

test('set | should skip exludes', (t) => {
  rcs.selectorLibrary.setExclude('test');
  rcs.selectorLibrary.setExclude('skipped');
  rcs.selectorLibrary.set('.test');
  rcs.selectorLibrary.set('.notskipped', 'random');
  rcs.selectorLibrary.set('.skipped', 'another-name');

  t.is(rcs.selectorLibrary.selectors.test, undefined);
  t.is(rcs.selectorLibrary.selectors.skipped, undefined);
  t.is(rcs.selectorLibrary.selectors.notskipped.compressedSelector, 'random');
});

/* *********** *
 * SETMULTIPLE *
 * *********** */
test('setMultiple | should set multiple values', (t) => {
  rcs.selectorLibrary.setMultiple({
    '.test': 'a',
    '.class': '.b',
    '.selector': 'c',
  });

  t.is(rcs.selectorLibrary.selectors.test.compressedSelector, 'a');
  t.is(rcs.selectorLibrary.selectors.class.compressedSelector, 'b');
  t.is(rcs.selectorLibrary.selectors.selector.compressedSelector, 'c');
});

test('setMultiple | should set nothing', (t) => {
  rcs.selectorLibrary.setMultiple();

  t.is(Object.keys(rcs.selectorLibrary.selectors).length, 0);
});

/* ********* *
 * SETPREFIX *
 * ********* */
test('setPrefix', (t) => {
  t.is(rcs.selectorLibrary.prefix, '');

  rcs.selectorLibrary.setPrefix('pre-');

  t.is(rcs.selectorLibrary.prefix, 'pre-');

  rcs.selectorLibrary.setPrefix(1);

  t.is(rcs.selectorLibrary.prefix, 'pre-');

  rcs.selectorLibrary.setPrefix({});

  t.is(rcs.selectorLibrary.prefix, 'pre-');

  rcs.selectorLibrary.setPrefix('prepre');

  t.is(rcs.selectorLibrary.prefix, 'prepre');
});

/* ********* *
 * SETSUFFIX *
 * ********* */
test('setSuffix', (t) => {
  t.is(rcs.selectorLibrary.suffix, '');

  rcs.selectorLibrary.setSuffix('-suf');

  t.is(rcs.selectorLibrary.suffix, '-suf');

  rcs.selectorLibrary.setSuffix(1);

  t.is(rcs.selectorLibrary.suffix, '-suf');

  rcs.selectorLibrary.setSuffix({});

  t.is(rcs.selectorLibrary.suffix, '-suf');

  rcs.selectorLibrary.setSuffix('sufsuf');

  t.is(rcs.selectorLibrary.suffix, 'sufsuf');
});

/* ********** *
 * SETEXCLUDE *
 * ********** */
test('setExclude | should avoid adding more of the same exludes | should enable array', (t) => {
  const excludes = [
    'one-value',
    'one-value',
    'another-value',
  ];

  rcs.selectorLibrary.setExclude(excludes);

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

test('setExclude | should enable array', (t) => {
  const excludes = [
    'one-value',
    'another-value',
  ];

  rcs.selectorLibrary.setExclude(excludes);

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

test('setExclude | should enable excludes', (t) => {
  rcs.selectorLibrary.setExclude('one-value');
  rcs.selectorLibrary.setExclude('second-value');

  t.is(rcs.selectorLibrary.excludes.length, 2);
});

/* ************ *
 * GENERATEMETA *
 * ************ */
test('generateMeta | should set an object value', (t) => {
  const generateMetaObject = rcs.selectorLibrary.generateMeta('.test');

  t.is(generateMetaObject.type, 'class');
  t.is(generateMetaObject.selector, '.test');
  t.is(generateMetaObject.compressedSelector, 'a');
});

test('generateMeta | should prevent random name', (t) => {
  const generateMetaObject = rcs.selectorLibrary.generateMeta('.test', { preventRandomName: true });

  t.is(generateMetaObject.type, 'class');
  t.is(generateMetaObject.selector, '.test');
  t.is(generateMetaObject.compressedSelector, 'test');
});

test('generateMeta | should return existing value', (t) => {
  rcs.selectorLibrary.set('.test');

  const generateMetaObject = rcs.selectorLibrary.generateMeta('.test');

  t.is(generateMetaObject.type, 'class');
  t.is(generateMetaObject.selector, '.test');
  t.is(generateMetaObject.compressedSelector, 'a');
});

/* ******************** *
 * SETATTRIBUTESELECTOR *
 * ******************** */
test('setAttributeSelector | should set attribute selectors correctly', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[class*="test"]');
  rcs.selectorLibrary.setAttributeSelector([
    '[id^="header"]',
  ]);

  t.is(typeof rcs.selectorLibrary.attributeSelectors['.*test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['.*test'].originalString, '[class*="test"]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#^header'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#^header'].originalString, '[id^="header"]');
});

test('setAttributeSelector | should set attribute selectors correctly', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[class~="test"]');
  rcs.selectorLibrary.setAttributeSelector('[id~="test"]');

  t.is(Object.keys(rcs.selectorLibrary.attributeSelectors).length, 2);
  t.is(typeof rcs.selectorLibrary.attributeSelectors['.~test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['.~test'].originalString, '[class~="test"]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#~test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#~test'].originalString, '[id~="test"]');
});

test('setAttributeSelector | should do nothing', (t) => {
  rcs.selectorLibrary.setAttributeSelector([
    'ewe weo',
  ]);

  t.is(Object.keys(rcs.selectorLibrary.attributeSelectors).length, 0);
});

test('setAttributeSelector | should set attribute selectors correctly without quotes', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[class*=test]');
  rcs.selectorLibrary.setAttributeSelector([
    '[id^=header]',
  ]);

  t.is(typeof rcs.selectorLibrary.attributeSelectors['.*test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['.*test'].originalString, '[class*=test]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#^header'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#^header'].originalString, '[id^=header]');
});

test('setAttributeSelector | should set attribute selectors correctly without quotes', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[class|=test]');

  t.is(typeof rcs.selectorLibrary.attributeSelectors['.|test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['.|test'].originalString, '[class|=test]');
});


test('setAttributeSelector | should set attribute all attribute selectors', (t) => {
  rcs.selectorLibrary.setAttributeSelector([
    '[id^=header]',
    '[id=test]',
    '[id="hello"]',
  ]);

  t.is(typeof rcs.selectorLibrary.attributeSelectors['#^header'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#^header'].originalString, '[id^=header]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#=test'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#=test'].originalString, '[id=test]');
  t.is(typeof rcs.selectorLibrary.attributeSelectors['#=hello'], 'object');
  t.is(rcs.selectorLibrary.attributeSelectors['#=hello'].originalString, '[id="hello"]');
});

/* ************************ *
 * REPLACEATTRIBUTESELECTOR *
 * ************************ */

test('replaceAttributeSelector | should return the correct begin selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id^=begin]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#testbegin'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#begintest'), '#begint');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#begin'), '#beginn');
});

test('replaceAttributeSelector | should return the correct equal selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id=equal]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#equal'), '#equal');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#equalq'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#lequal'), false);
});

test('replaceAttributeSelector | should return the correct dash selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id|=dash]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#dash'), '#dash');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#dash-k'), '#dash-t');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#dash-more-here'), '#dash-n');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#dashq'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#ldash'), false);
});

test('replaceAttributeSelector | should return the correct end selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id$=end]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#end'), '#tend');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#endquark'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkend'), '#nend');
});

test('replaceAttributeSelector | should return the correct multi selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id*=multi]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#multi'), '#tmultin');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#multiquark'), '#rmultii');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkmulti'), '#smultio');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkmultiafter'), '#umultia');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#nix'), false);
});

test('replaceAttributeSelector | should return the correct tilde selector', (t) => {
  rcs.selectorLibrary.setAttributeSelector('[id~=tilde]');

  t.is(rcs.selectorLibrary.replaceAttributeSelector('#tilde'), '#tilde');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#tildequark'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarktilde'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarktildeafter'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#nix'), false);
});

test('replaceAttributeSelector | combination', (t) => {
  rcs.selectorLibrary.setAttributeSelector([
    '[class=equal]',
    '[id$=end]',
    '[id*=multi]',
  ]);

  t.is(rcs.selectorLibrary.replaceAttributeSelector('.equal'), '.equal');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('.equalq'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('.lequal'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#end'), '#tend');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#endquark'), false);
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkend'), '#nend');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#multi'), '#tmultin');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#multiquark'), '#rmultii');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkmulti'), '#smultio');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#quarkmultiafter'), '#umultia');
  t.is(rcs.selectorLibrary.replaceAttributeSelector('#nix'), false);
});
