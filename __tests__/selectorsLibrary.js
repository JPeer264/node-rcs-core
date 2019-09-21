import rcs from '../lib';
import attributeLibrary from '../lib/attributeLibrary';

const setSelectors = () => {
  rcs.selectorsLibrary.set([
    '.test',
    '#id',
    '.jp-selector',
  ]);
};

beforeEach(() => {
  // reset counter and selectors for tests
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

/* ************************* *
 * GETATTRIBUTESELECTORREGEX *
 * ************************* */
it('getAttributeSelectorRegex | ensure expected values', () => {
  expect(rcs.selectorsLibrary.getIdSelector().getAttributeSelectorRegex())
    .toBe(rcs.replace.regex.idAttributeSelectors);
  expect(rcs.selectorsLibrary.getIdSelector().selectorFirstChar()).toBe('#');

  // althrough it's never being used).toBe(let's assert it works
  expect(attributeLibrary.getAttributeSelectorRegex())
    .toBe(rcs.replace.regex.idAttributeSelectors);
  expect(attributeLibrary.selectorFirstChar()).toBe('#');
  expect(attributeLibrary.replaceAttributeSelector('wrong')).toBe(false);

  expect(rcs.selectorsLibrary.getClassSelector().getAttributeSelectorRegex())
    .toBe(rcs.replace.regex.classAttributeSelectors);
  expect(rcs.selectorsLibrary.getClassSelector().selectorFirstChar()).toBe('.');
});

/* *** *
 * GET *
 * *** */
it('get | should not get any', () => {
  setSelectors();

  const selector = rcs.selectorsLibrary.get('.nothing-to-get');

  expect(selector).toBe('.nothing-to-get');
});

it('get | should get every single selectors', () => {
  setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test');
  const testSelector = rcs.selectorsLibrary.get('test');

  expect(dotTestSelector).toBe('a');
  expect(testSelector).toBe('a');
});

it('get | should get every single selectors with type char', () => {
  setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test', { addSelectorType: true });
  const testSelector = rcs.selectorsLibrary.get('test', { addSelectorType: true });

  expect(dotTestSelector).toBe('.a');
  expect(testSelector).toBe('.a');
});

it('get | with pre- suffix', () => {
  setSelectors();

  rcs.selectorsLibrary.setPrefix('pre-');
  rcs.selectorsLibrary.setSuffix('-suf');

  const selector = rcs.selectorsLibrary.get('.test');
  const selectorWithType = rcs.selectorsLibrary.get('.test', { addSelectorType: true });

  expect(selector).toBe('pre-a-suf');
  expect(selectorWithType).toBe('.pre-a-suf');
});

it('get | should not get excluded selector', () => {
  setSelectors();

  rcs.selectorsLibrary.setExclude('test');

  const dotTestSelector = rcs.selectorsLibrary.get('.test');
  const testSelector = rcs.selectorsLibrary.get('test');

  expect(dotTestSelector).toBe('.test');
  expect(testSelector).toBe('test');
});

it('get | extend true', () => {
  setSelectors();

  const dotTestSelector = rcs.selectorsLibrary.get('.test', { extend: true });

  expect(typeof dotTestSelector).toBe('object');
  expect(dotTestSelector.compressedSelector).toBe('a');
  expect(dotTestSelector.selector).toBe('test');
});

it('get | insure no mix if using existing selector', () => {
  setSelectors();

  const testSelector = rcs.selectorsLibrary.get('test');
  const aSelector = rcs.selectorsLibrary.get('a');

  expect(testSelector).toBe('a');
  expect(aSelector).not.toBe('a');
});

it.skip('get | insure no mix between id and class selector', () => {
  rcs.selectorsLibrary.set('.myclass');
  rcs.selectorsLibrary.set('#myclass');

  const classSelector = rcs.selectorsLibrary.get('.myclass', { addSelectorType: true });
  const idSelector = rcs.selectorsLibrary.get('#myclass', { addSelectorType: true });

  expect(classSelector).toBe('.a');
  expect(idSelector).toBe('#a');

  rcs.selectorsLibrary.set('.other');

  const otherIdSelector = rcs.selectorsLibrary.get('#other');
  const otherSelector = rcs.selectorsLibrary.get('other', { addSelectorType: true });
  expect(otherIdSelector).toBe('#a');
  expect(otherSelector).toBe('.b');
});

/* ****** *
 * GETALL *
 * ****** */
it('getall | should return a regex of compressed with classes', () => {
  setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    getRenamedValues: true,
    addSelectorType: true,
  });

  expect(regex.source).toBe('(\\#a)|(\\.a|\\.b)');
});

it('getall | should return an array with selectors', () => {
  setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    addSelectorType: true,
  });

  expect(array['.test']).toBeTruthy();
  expect(array['.jp-selector']).toBeTruthy();

  expect(array['.a']).toBeFalsy();
  expect(array['.b']).toBeFalsy();

  expect(array['.test']).toBe('a');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    addSelectorType: true,
  });

  expect(array['#id']).toBeTruthy();
  expect(array['#a']).toBeFalsy();
  expect(array['#id']).toBe('a');
});

it('getall | should return an array with compressed selectors', () => {
  setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
  });


  expect(array['.test']).toBeFalsy();
  expect(array['.jp-selector']).toBeFalsy();

  expect(array['.a']).toBeTruthy();
  expect(array['.b']).toBeTruthy();

  expect(array['.a']).toBe('test');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
  });
  expect(array['#id']).toBeFalsy();
  expect(array['#a']).toBeTruthy();
  expect(array['#a']).toBe('id');
});

it('getall | should return a regex of non compressed with classes', () => {
  setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    addSelectorType: true,
  });

  expect(regex.source).toBe('(\\#id)|(\\.jp-selector|\\.test)');
});

it('getall | should return a regex of non compressed selecotrs', () => {
  setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex({
    getRenamedValues: true,
  });

  expect(regex.source).toBe('((\\s|\\#)(a)[\\s)])|((\\s|\\.)(a|b)[\\s)])');
});

it('getall | should return a regex of compressed selectors', () => {
  setSelectors();

  const regex = rcs.selectorsLibrary.getAllRegex();

  expect(regex.source).toBe('((\\s|\\#)(id)[\\s)])|((\\s|\\.)(jp-selector|test)[\\s)])');
});

it('getall | should get all extend', () => {
  setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    extend: true,
  });

  expect(typeof cssObject.test).toBe('object');
  expect(cssObject.test.type).toBe('class');
  expect(cssObject.test.compressedSelector).toBe('a');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    extend: true,
  });
  expect(typeof cssObject.id).toBe('object');
  expect(cssObject.id.type).toBe('id');
  expect(cssObject.id.compressedSelector).toBe('a');
});

it('getall | should get all extend with selectors', () => {
  setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    addSelectorType: true,
    extend: true,
  });

  expect(typeof cssObject['.test']).toBe('object');
  expect(cssObject['.test'].type).toBe('class');
  expect(cssObject['.test'].compressedSelector).toBe('a');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    addSelectorType: true,
    extend: true,
  });

  expect(typeof cssObject['#id']).toBe('object');
  expect(cssObject['#id'].type).toBe('id');
  expect(cssObject['#id'].compressedSelector).toBe('a');
});

it('getall | should get all normal with selectors', () => {
  setSelectors();

  let cssObject = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
    extend: true,
  });

  expect(typeof cssObject['.a']).toBe('object');
  expect(cssObject['.a'].type).toBe('class');
  expect(cssObject['.a'].modifiedSelector).toBe('test');

  cssObject = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
    addSelectorType: true,
    extend: true,
  });

  expect(typeof cssObject['#a']).toBe('object');
  expect(cssObject['#a'].type).toBe('id');
  expect(cssObject['#a'].modifiedSelector).toBe('id');
});

it('getall | should get all setted classes', () => {
  setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll();

  expect(typeof array).toBe('object');
  expect(array.test).toBe('a');
  expect(array['jp-selector']).toBe('b');

  array = rcs.selectorsLibrary.getIdSelector().getAll();
  expect(array.id).toBe('a');
});

it('getall | should get all setted compressed classes', () => {
  setSelectors();

  let array = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: true,
  });

  expect(typeof array).toBe('object');
  expect(array.a).toBe('test');
  expect(array.b).toBe('jp-selector');

  array = rcs.selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: true,
  });

  expect(array.a).toBe('id');
});

/* *** *
 * SET *
 * *** */
it('set | should set nothing', () => {
  rcs.selectorsLibrary.set();

  expect(rcs.selectorsLibrary.getClassSelector().values).toEqual({});
  expect(rcs.selectorsLibrary.getIdSelector().values).toEqual({});
});

it('set | should set a new value and get this value', () => {
  rcs.selectorsLibrary.set('.test');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('a');
});

it('set | should ignore invalid selectors', () => {
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('test2');
  rcs.selectorsLibrary.set('.test3');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('a');
  expect(rcs.selectorsLibrary.getClassSelector().values.test3).toBe('b');
  expect(Object.keys(rcs.selectorsLibrary.getClassSelector().values).length).toBe(2);
});

it('set | should set a new custom value', () => {
  rcs.selectorsLibrary.set('.test', 'random-name');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('random-name');
});

it('set | should set a new custom value', () => {
  rcs.selectorsLibrary.set('.test', 'random-name');
  rcs.selectorsLibrary.set('.test2', 'random-name');
  rcs.selectorsLibrary.set('.test3', 'random-name');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('random-name');
  expect(rcs.selectorsLibrary.getClassSelector().values.test2).toBe('a');
  expect(rcs.selectorsLibrary.getClassSelector().values.test3).toBe('b');
});

it('set | should set a new custom value with selector type', () => {
  rcs.selectorsLibrary.set('.test', '.random-name');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('random-name');
});

it('set | should set values out of an array', () => {
  rcs.selectorsLibrary.set([
    '.test',
    '#id',
    '.jp-selector',
  ]);

  // should be set
  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('a');
  expect(rcs.selectorsLibrary.getIdSelector().values.id).toBe('a');
  expect(rcs.selectorsLibrary.getClassSelector().values['jp-selector']).toBe('b');

  // should not be set
  expect(rcs.selectorsLibrary.getClassSelector().values['not-set']).toBeFalsy();
});

it('set | should skip exludes', () => {
  rcs.selectorsLibrary.setExclude('test');
  rcs.selectorsLibrary.setExclude('skipped');
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.notskipped', 'random');
  rcs.selectorsLibrary.set('.skipped', 'another-name');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe(undefined);
  expect(rcs.selectorsLibrary.getClassSelector().values.skipped).toBe(undefined);
  expect(rcs.selectorsLibrary.getClassSelector().values.notskipped).toBe('random');
  expect(rcs.selectorsLibrary.isExcluded('test')).toBe(true);
});

it('set | should skip regex exludes', () => {
  rcs.selectorsLibrary.setExclude(/^te/);
  rcs.selectorsLibrary.setExclude(/^ski/);
  rcs.selectorsLibrary.set('.test');
  rcs.selectorsLibrary.set('.notskipped', 'random');
  rcs.selectorsLibrary.set('.skipped', 'another-name');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe(undefined);
  expect(rcs.selectorsLibrary.getClassSelector().values.skipped).toBe(undefined);
  expect(rcs.selectorsLibrary.getClassSelector().values.notskipped).toBe('random');
});

it('set | should skip reserved', () => {
  rcs.selectorsLibrary.setReserved('a');
  rcs.selectorsLibrary.set('.test');

  expect(rcs.selectorsLibrary.getClassSelector().values.test).toBe('b');
  expect(rcs.selectorsLibrary.isReserved('a')).toBe(true);
});


/* ******************** *
 * SETATTRIBUTESELECTOR *
 * ******************** */
it('setAttributeSelector | should set attribute selectors correctly', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class*="test"]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^="header"]',
  ]);

  expect(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test']).toBe('object');
  expect(rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'].originalString).toBe('[class*="test"]');
  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString).toBe('[id^="header"]');
});

it('setAttributeSelector | should set attribute selectors correctly', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class~="test"]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector('[id~="test"]');

  expect(Object.keys(rcs.selectorsLibrary.getClassSelector().attributeSelectors).length).toBe(1);
  expect(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['~test']).toBe('object');
  expect(rcs.selectorsLibrary.getClassSelector().attributeSelectors['~test'].originalString).toBe('[class~="test"]');

  expect(Object.keys(rcs.selectorsLibrary.getIdSelector().attributeSelectors).length).toBe(1);
  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['~test']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['~test'].originalString).toBe('[id~="test"]');
});

it('setAttributeSelector | should do nothing', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector([
    'ewe weo',
  ]);

  expect(Object.keys(rcs.selectorsLibrary.getClassSelector().attributeSelectors).length).toBe(0);
});

it('setAttributeSelector | should set attribute selectors correctly without quotes', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class*=test]');
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^=header]',
  ]);

  expect(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test']).toBe('object');
  expect(rcs.selectorsLibrary.getClassSelector().attributeSelectors['*test'].originalString).toBe('[class*=test]');
  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString).toBe('[id^=header]');
});

it('setAttributeSelector | should set attribute selectors correctly without quotes', () => {
  rcs.selectorsLibrary.getClassSelector().setAttributeSelector('[class|=test]');

  expect(typeof rcs.selectorsLibrary.getClassSelector().attributeSelectors['|test']).toBe('object');
  expect(rcs.selectorsLibrary.getClassSelector().attributeSelectors['|test'].originalString).toBe('[class|=test]');
});


it('setAttributeSelector | should set attribute all attribute selectors', () => {
  rcs.selectorsLibrary.getIdSelector().setAttributeSelector([
    '[id^=header]',
    '[id=test]',
    '[id="hello"]',
  ]);

  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['^header'].originalString).toBe('[id^=header]');
  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['=test']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['=test'].originalString).toBe('[id=test]');
  expect(typeof rcs.selectorsLibrary.getIdSelector().attributeSelectors['=hello']).toBe('object');
  expect(rcs.selectorsLibrary.getIdSelector().attributeSelectors['=hello'].originalString).toBe('[id="hello"]');
});

it('setAttributeSelector | attribute selector should fix previous mapping (see #96)', () => {
  setSelectors();

  let dotTestSelector = rcs.selectorsLibrary.get('.jp-selector');
  expect(dotTestSelector).toBe('b');

  rcs.selectorsLibrary.getClassSelector().setAttributeSelector([
    '[class^=jp-]',
  ]);

  dotTestSelector = rcs.selectorsLibrary.get('.jp-selector');
  expect(dotTestSelector).toBe('jp-t');

  rcs.selectorsLibrary.set('.jp-trick');
  dotTestSelector = rcs.selectorsLibrary.get('.jp-trick');
  expect(dotTestSelector).toBe('jp-n');
});

/* ************************ *
 * REPLACEATTRIBUTESELECTOR *
 * ************************ */

it('replaceAttributeSelector | bad selector should fail', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id^=begin]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('')).toBe(false);
});

it('replaceAttributeSelector | should return the correct begin selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id^=begin]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#testbegin')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#begintest')).toBe('#begint');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#begin')).toBe('#beginn');
});

it('replaceAttributeSelector | should return the correct equal selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id=equal]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#equal')).toBe('#equal');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#equalq')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#lequal')).toBe(false);
});

it('replaceAttributeSelector | should return the correct dash selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id|=dash]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#dash')).toBe('#dash');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#dash-k')).toBe('#dash-t');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#dash-more-here')).toBe('#dash-n');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#dashq')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#ldash')).toBe(false);
});

it('replaceAttributeSelector | should return the correct end selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id$=end]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#end')).toBe('#tend');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#endquark')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkend')).toBe('#nend');
});

it('replaceAttributeSelector | should return the correct multi selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id*=multi]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#multi')).toBe('#tmultin');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#multiquark')).toBe('#rmultii');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmulti')).toBe('#smultio');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmultiafter')).toBe('#umultia');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#nix')).toBe(false);
});

it('replaceAttributeSelector | should return the correct tilde selector', () => {
  rcs.selectorsLibrary.setAttributeSelector('[id~=tilde]');

  expect(rcs.selectorsLibrary.replaceAttributeSelector('#tilde')).toBe('#tilde');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#tildequark')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarktilde')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarktildeafter')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#nix')).toBe(false);
});

it('replaceAttributeSelector | combination', () => {
  rcs.selectorsLibrary.setAttributeSelector([
    '[class=equal]',
    '[id$=end]',
    '[id*=multi]',
  ]);

  expect(rcs.selectorsLibrary.replaceAttributeSelector('.equal')).toBe('.equal');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('.equalq')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('.lequal')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#end')).toBe('#tend');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#endquark')).toBe(false);
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkend')).toBe('#nend');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#multi')).toBe('#tmultin');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#multiquark')).toBe('#rmultii');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmulti')).toBe('#smultio');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#quarkmultiafter')).toBe('#umultia');
  expect(rcs.selectorsLibrary.replaceAttributeSelector('#nix')).toBe(false);
});
