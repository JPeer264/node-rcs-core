import test from 'ava';

import rcs from '../lib';

test.beforeEach(() => {
  rcs.selectorsLibrary.reset();
  rcs.cssVariablesLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test('replace js and get correct classes', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.js('var a = \'.selector .used #id\';');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, []);
});

test('replace js and get correct classes and ids', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.js('var a = ".selector .used";');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, ['id']);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 1, selector: 1 });
  t.deepEqual(stats.idUsageCount, { id: 0 });
});

// following should pass after issue #51 is resolved
test('replace html and get correct classes and ids', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.html('<div class="selector id used"></div>');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, ['id']);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 1, selector: 1 });
  t.deepEqual(stats.idUsageCount, { id: 0 });
});

test('replace html and get correct classes and ids', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.html('<div class="selector used"></div>');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, ['id']);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 1, selector: 1 });
  t.deepEqual(stats.idUsageCount, { id: 0 });
});

test('replace css and get correct classes and ids', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.css('#id {} .selector {} .used {}');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, []);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 1, selector: 1 });
  t.deepEqual(stats.idUsageCount, { id: 1 });
});

test('replace all and get correct classes and ids', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.css('#id {} .selector {} .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, []);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 3, selector: 2 });
  t.deepEqual(stats.idUsageCount, { id: 1 });
});


test('replace all and get correct classes and ids with all matching css variables', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.cssVariablesLibrary.fillLibrary('.test { --my-variable: #BADA55; }');
  rcs.replace.css('#id {} .selector { color: var(--my-variable) } .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, []);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 3, selector: 2 });
  t.deepEqual(stats.idUsageCount, { id: 1 });
  t.deepEqual(stats.cssVariablesUsageCount, { 'my-variable': 1 });
  t.deepEqual(stats.unusedCssVariables, []);
});

test('replace all and get correct classes and ids with css variables', (t) => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.cssVariablesLibrary.fillLibrary('.test { --my-variable: #BADA55; --other-variable: #FB1 }');
  rcs.replace.css('#id {} .selector { color: var(--my-variable) } .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.stats();

  t.deepEqual(stats.unusedClasses, ['not-used']);
  t.deepEqual(stats.unusedIds, []);
  t.deepEqual(stats.classUsageCount, { 'not-used': 0, used: 3, selector: 2 });
  t.deepEqual(stats.idUsageCount, { id: 1 });
  t.deepEqual(stats.cssVariablesUsageCount, { 'my-variable': 1, 'other-variable': 0 });
  t.deepEqual(stats.unusedCssVariables, ['other-variable']);
});

test('replace css and get correct keyframes count', (t) => {
  const css = '@keyframes move {} @keyframes another-move {} .move { animation: move }';

  rcs.keyframesLibrary.fillLibrary(css);
  rcs.replace.css(css);

  const stats = rcs.stats();

  t.deepEqual(stats.keyframesUsageCount, { 'another-move': 0, move: 1 });
  t.deepEqual(stats.unusedKeyframes, ['another-move']);
});
