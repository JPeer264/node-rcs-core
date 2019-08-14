import test from 'ava';

import rcs from '../lib';
import attributeLibrary from '../lib/attributeLibrary';

test.beforeEach((t) => {
  // reset counter and selectors for tests
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();

  // eslint-disable-next-line no-param-reassign
  t.context.setSelectors = () => {
    rcs.selectorsLibrary.set([
      '.test',
      '#id',
      '.jp-selector',
    ]);
  };
});

/* ************************* *
 * GETATTRIBUTESELECTORREGEX *
 * ************************* */
test('getAttributeSelectorRegex | ensure expected values', (t) => {
  t.is(rcs.selectorsLibrary.getIdSelector().getAttributeSelectorRegex(),
        rcs.replace.regex.idAttributeSelectors);
  t.is(rcs.selectorsLibrary.getIdSelector().selectorFirstChar(), '#');

  // althrough it's never being used, let's assert it works
  t.is(attributeLibrary.getAttributeSelectorRegex(),
        rcs.replace.regex.idAttributeSelectors);
  t.is(attributeLibrary.selectorFirstChar(), '#');
  t.is(attributeLibrary.replaceAttributeSelector('wrong'), false);

  t.is(rcs.selectorsLibrary.getClassSelector().getAttributeSelectorRegex(),
        rcs.replace.regex.classAttributeSelectors);
  t.is(rcs.selectorsLibrary.getClassSelector().selectorFirstChar(), '.');
});

/* *** *
 * GET *
 * *** */
test('get | should not get any', (t) => {
  t.context.setSelectors();

  const selector = rcs.selectorsLibrary.get('.nothing-to-get');

  t.is(selector, '.nothing-to-get');
});

test('get | should get every single selectors', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test');
  const testSelector = rcs.selectorsLibrary.get('test');

  t.is(dotTestSelector, 'a');
  t.is(testSelector, 'a');
});

test('get | should get every single selectors with type char', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test', { addSelectorType: true });
  const testSelector = rcs.selectorsLibrary.get('test', { addSelectorType: true });

  t.is(dotTestSelector, '.a');
  t.is(testSelector, '.a');
});

test('get | with pre- suffix', (t) => {
  t.context.setSelectors();

  rcs.selectorsLibrary.setPrefix('pre-');
  rcs.selectorsLibrary.setSuffix('-suf');

  const selector = rcs.selectorsLibrary.get('.test');
  const selectorWithType = rcs.selectorsLibrary.get('.test', { addSelectorType: true });

  t.is(selector, 'pre-a-suf');
  t.is(selectorWithType, '.pre-a-suf');
});

test('get | should not get excluded selector', (t) => {
  t.context.setSelectors();

  rcs.selectorsLibrary.setExclude('test');

  const dotTestSelector = rcs.selectorsLibrary.get('.test');
  const testSelector = rcs.selectorsLibrary.get('test');

  t.is(dotTestSelector, '.test');
  t.is(testSelector, 'test');
});

test('get | extend true', (t) => {
  t.context.setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test', { extend: true });

  t.is(typeof dotTestSelector, 'object');
  t.is(dotTestSelector.compressedSelector, 'a');
  t.is(dotTestSelector.selector, 'test');
});

test('get | insure no mix if using existing selector', (t) => {
  t.context.setSelectors();

  const testSelector = rcs.selectorsLibrary.get('test');
  const aSelector = rcs.selectorsLibrary.get('a');

  t.is(testSelector, 'a');
  t.not(aSelector, 'a');
});


/* ****** *
 * GETALL *
 * ****** */
test('getall | should return a regex of compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    getRenamedValues: true,
    addSelectorType: true,
  });

  t.is(regex.source, '(\\#a)|(\\.a|\\.b)');
});

test('getall | should return an array with selectors', (t) => {
  t.context.setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    addSelectorType: true,
  });

  t.truthy(array['.test']);
  t.truthy(array['.jp-selector']);

  t.falsy(array['.a']);
  t.falsy(array['.b']);

  t.is(array['.test'], 'a');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    addSelectorType: true,
  });

  t.truthy(array['#id']);
  t.falsy(array['#a']);
  t.is(array['#id'], 'a');
});

test('getall | should return an array with compressed selectors', (t) => {
  t.context.setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
  });


  t.falsy(array['.test']);
  t.falsy(array['.jp-selector']);

  t.truthy(array['.a']);
  t.truthy(array['.b']);

  t.is(array['.a'], 'test');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
  });
  t.falsy(array['#id']);
  t.truthy(array['#a']);
  t.is(array['#a'], 'id');
});

test('getall | should return a regex of non compressed with classes', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    addSelectorType: true,
  });

  t.is(regex.source, '(\\#id)|(\\.jp-selector|\\.test)');
});

test('getall | should return a regex of non compressed selecotrs', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    getRenamedValues: true,
  });

  t.is(regex.source, '((\\s|\\#)(a)[\\s)])|((\\s|\\.)(a|b)[\\s)])');
});

test('getall | should return a regex of compressed selectors', (t) => {
  t.context.setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex();

  t.is(regex.source, '((\\s|\\#)(id)[\\s)])|((\\s|\\.)(jp-selector|test)[\\s)])');
});

test('getall | should get all extend', (t) => {
  t.context.setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    extend: true,
  });

  t.is(typeof cssObject.test, 'object');
  t.is(cssObject.test.type, 'class');
  t.is(cssObject.test.compressedSelector, 'a');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    extend: true,
  });
  t.is(typeof cssObject.id, 'object');
  t.is(cssObject.id.type, 'id');
  t.is(cssObject.id.compressedSelector, 'a');
});

test('getall | should get all extend with selectors', (t) => {
  t.context.setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['.test'], 'object');
  t.is(cssObject['.test'].type, 'class');
  t.is(cssObject['.test'].compressedSelector, 'a');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['#id'], 'object');
  t.is(cssObject['#id'].type, 'id');
  t.is(cssObject['#id'].compressedSelector, 'a');
});

test('getall | should get all normal with selectors', (t) => {
  t.context.setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['.a'], 'object');
  t.is(cssObject['.a'].type, 'class');
  t.is(cssObject['.a'].modifiedSelector, 'test');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
    extend: true,
  });

  t.is(typeof cssObject['#a'], 'object');
  t.is(cssObject['#a'].type, 'id');
  t.is(cssObject['#a'].modifiedSelector, 'id');
});

test('getall | should get all setted classes', (t) => {
  t.context.setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll();

  t.is(typeof array, 'object');
  t.is(array.test, 'a');
  t.is(array['jp-selector'], 'b');

  array = rcs.selectorsLibrary.getIdSelector().getAll();
  t.is(array.id, 'a');
});

test('getall | should get all setted compressed classes', (t) => {
  t.context.setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
  });

  t.is(typeof array, 'object');
  t.is(array.a, 'test');
  t.is(array.b, 'jp-selector');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
  });

  t.is(array.a, 'id');
});

/* *** *
 * SET *
 * *** */
test('set | should set nothing', (t) => {
  rcs.selectorsLibrary.set();

  t.deepEqual(rcs.selectorsLibrary.getClassSelector().values, {});
  t.deepEqual(rcs.selectorsLibrary.getIdSelector().values, {});
});

test('set | should set a new value and get this value', (t) => {
  rcs.selectorsLibrary.set('.test');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'a');
});

test('set | should ignore invalid selectors', (t) => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('test2');
  rcs.selectorsLibrary.set('.test3');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'a');
  t.is(rcs.selectorsLibrary.getClassSelector().values.test3, 'b');
  t.is(Object.keys(rcs.selectorsLibrary.getClassSelector().values).length, 2);
});

test('set | should set a new custom value', (t) => {
  rcs.selectorsLibrary.set('.test', 'random-name');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'random-name');
});

test('set | should set a new custom value', (t) => {
  rcs.selectorsLibrary.set('.test', 'random-name');
  rcs.selectorsLibrary.set('.test2', 'random-name');
  rcs.selectorsLibrary.set('.test3', 'random-name');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'random-name');
  t.is(rcs.selectorsLibrary.getClassSelector().values.test2, 'a');
  t.is(rcs.selectorsLibrary.getClassSelector().values.test3, 'b');
});

test('set | should set a new custom value with selector type', (t) => {
  rcs.selectorsLibrary.set('.test', '.random-name');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'random-name');
});

test('set | should set values out of an array', (t) => {
  rcs.selectorsLibrary.set([
    '.test',
    '#id',
    '.jp-selector',
  ]);

  // should be set
  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'a');
  t.is(rcs.selectorsLibrary.getIdSelector().values.id, 'a');
  t.is(rcs.selectorsLibrary.getClassSelector().values['jp-selector'], 'b');

  // should not be set
  t.falsy(rcs.selectorsLibrary.getClassSelector().values['not-set']);
});

test('set | should skip exludes', (t) => {
  rcs.selectorsLibrary.setExclude('test');
  rcs.selectorsLibrary.setExclude('skipped');
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.notskipped', 'random');
  rcs.selectorsLibrary.set('.skipped', 'another-name');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, undefined);
  t.is(rcs.selectorsLibrary.getClassSelector().values.skipped, undefined);
  t.is(rcs.selectorsLibrary.getClassSelector().values.notskipped, 'random');
  t.true(rcs.selectorsLibrary.isExcluded('test'));
});

test('set | should skip regex exludes', (t) => {
  rcs.selectorsLibrary.setExclude(/^te/);
  rcs.selectorsLibrary.setExclude(/^ski/);
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.notskipped', 'random');
  rcs.selectorsLibrary.set('.skipped', 'another-name');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, undefined);
  t.is(rcs.selectorsLibrary.getClassSelector().values.skipped, undefined);
  t.is(rcs.selectorsLibrary.getClassSelector().values.notskipped, 'random');
});

test('set | should skip reserved', (t) => {
  rcs.selectorsLibrary.setReserved('a');
  rcs.selectorsLibrary.set('.test');

  t.is(rcs.selectorsLibrary.getClassSelector().values.test, 'b');
  t.true(rcs.selectorsLibrary.isReserved('a'));
});


/* ******************** *
 * SETATTRIBUTESELECTOR *
 * ******************** */
test('setAttributeSelector | should set attribute selectors correctly', (t) => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class*="test"]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^="header"]',
  ]);

  t.is(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'], 'object');
  t.is(rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'].originalString, '[class*="test"]');
  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString, '[id^="header"]');
});

test('setAttributeSelector | should set attribute selectors correctly', (t) => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class~="test"]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector('[id~="test"]');

  t.is(Object.keys(rcs.selectorsLibrary.getClassSelector().attributeSelectors).length, 1);
  t.is(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['~test'], 'object');
  t.is(rcs.selectorsLibrary.getClassSelector().attributeSelectors['~test'].originalString, '[class~="test"]');

  t.is(Object.keys(rcs.selectorsLibrary.getIdSelector().attributeSelectors).length, 1);
  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['~test'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['~test'].originalString, '[id~="test"]');
});

test('setAttributeSelector | should do nothing', (t) => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector([
    'ewe weo',
  ]);

  t.is(Object.keys(rcs.selectorsLibrary.getClassSelector().attributeSelectors).length, 0);
});

test('setAttributeSelector | should set attribute selectors correctly without quotes', (t) => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class*=test]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^=header]',
  ]);

  t.is(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'], 'object');
  t.is(rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'].originalString, '[class*=test]');
  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString, '[id^=header]');
});

test('setAttributeSelector | should set attribute selectors correctly without quotes', (t) => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class|=test]');

  t.is(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['|test'], 'object');
  t.is(rcs.selectorsLibrary.getClassSelector().attributeSelectors['|test'].originalString, '[class|=test]');
});


test('setAttributeSelector | should set attribute all attribute selectors', (t) => {
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^=header]',
    '[id=test]',
    '[id="hello"]',
  ]);

  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString, '[id^=header]');
  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['=test'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['=test'].originalString, '[id=test]');
  t.is(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['=hello'], 'object');
  t.is(rcs.selectorsLibrary.getIdSelector().attributeSelectors['=hello'].originalString, '[id="hello"]');
});

/* ************************ *
 * REPLACEATTRIBUTESELECTOR *
 * ************************ */

test('replaceAttributeSelector | bad selector should fail', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id^=begin]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector(''), false);
});

test('replaceAttributeSelector | should return the correct begin selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id^=begin]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#testbegin'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#begintest'), '#begint');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#begin'), '#beginn');
});

test('replaceAttributeSelector | should return the correct equal selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id=equal]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#equal'), '#equal');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#equalq'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#lequal'), false);
});

test('replaceAttributeSelector | should return the correct dash selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id|=dash]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#dash'), '#dash');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#dash-k'), '#dash-t');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#dash-more-here'), '#dash-n');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#dashq'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#ldash'), false);
});

test('replaceAttributeSelector | should return the correct end selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id$=end]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#end'), '#tend');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#endquark'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkend'), '#nend');
});

test('replaceAttributeSelector | should return the correct multi selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id*=multi]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#multi'), '#tmultin');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#multiquark'), '#rmultii');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmulti'), '#smultio');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmultiafter'), '#umultia');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#nix'), false);
});

test('replaceAttributeSelector | should return the correct tilde selector', (t) => {
  rcs.selectorsLibrary.setAttributeSelector('[id~=tilde]');

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#tilde'), '#tilde');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#tildequark'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarktilde'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarktildeafter'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#nix'), false);
});

test('replaceAttributeSelector | combination', (t) => {
  rcs.selectorsLibrary.setAttributeSelector([
    '[class=equal]',
    '[id$=end]',
    '[id*=multi]',
  ]);

  t.is(rcs.selectorsLibrary.replaceAttributeSelector('.equal'), '.equal');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('.equalq'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('.lequal'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#end'), '#tend');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#endquark'), false);
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkend'), '#nend');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#multi'), '#tmultin');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#multiquark'), '#rmultii');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmulti'), '#smultio');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmultiafter'), '#umultia');
  t.is(rcs.selectorsLibrary.replaceAttributeSelector('#nix'), false);
});
