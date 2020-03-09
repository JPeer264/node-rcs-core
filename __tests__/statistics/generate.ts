import rcs from '../../lib';

beforeEach(() => {
  rcs.selectorsLibrary.reset();
  rcs.cssVariablesLibrary.reset();
  rcs.keyframesLibrary.reset();
});

it('replace js and get correct classes', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.js('var a = \'.selector .used #id\';');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual([]);
});

it('replace js and get correct classes and ids', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.js('var a = ".selector .used";');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual(['id']);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 1, selector: 1 });
  expect(stats.ids.usageCount).toEqual({ id: 0 });
});

// following should pass after issue #51 is resolved
it('replace html and get correct classes and ids', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.html('<div class="selector id used"></div>');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual(['id']);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 1, selector: 1 });
  expect(stats.ids.usageCount).toEqual({ id: 0 });
});

it('replace html and get correct classes and ids', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.html('<div class="selector used"></div>');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual(['id']);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 1, selector: 1 });
  expect(stats.ids.usageCount).toEqual({ id: 0 });
});

it('replace css and get correct classes and ids', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.css('#id {} .selector {} .used {}');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual([]);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 1, selector: 1 });
  expect(stats.ids.usageCount).toEqual({ id: 1 });
});

it('replace all and get correct classes and ids', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.replace.css('#id {} .selector {} .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual([]);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 3, selector: 2 });
  expect(stats.ids.usageCount).toEqual({ id: 1 });
});


it('replace all and get correct classes and ids with all matching css variables', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.cssVariablesLibrary.fillLibrary('.test { --my-variable: #BADA55; }');
  rcs.replace.css('#id {} .selector { color: var(--my-variable) } .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual([]);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 3, selector: 2 });
  expect(stats.ids.usageCount).toEqual({ id: 1 });
  expect(stats.cssVariables.usageCount).toEqual({ 'my-variable': 1 });
  expect(stats.cssVariables.unused).toEqual([]);
});

it('replace all and get correct classes and ids with css variables', () => {
  rcs.selectorsLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');
  rcs.cssVariablesLibrary.fillLibrary('.test { --my-variable: #BADA55; --other-variable: #FB1 }');
  rcs.replace.css('#id {} .selector { color: var(--my-variable) } .used {}');
  rcs.replace.html('<div class="selector used"></div>');
  rcs.replace.js('var a = "used";');

  const stats = rcs.statistics.generate();

  expect(stats.classes.unsused).toEqual(['not-used']);
  expect(stats.ids.unused).toEqual([]);
  expect(stats.classes.usageCount).toEqual({ 'not-used': 0, used: 3, selector: 2 });
  expect(stats.ids.usageCount).toEqual({ id: 1 });
  expect(stats.cssVariables.usageCount).toEqual({ 'my-variable': 1, 'other-variable': 0 });
  expect(stats.cssVariables.unused).toEqual(['other-variable']);
});

it('replace css and get correct keyframes count', () => {
  const css = '@keyframes move {} @keyframes another-move {} .move { animation: move }';

  rcs.keyframesLibrary.fillLibrary(css);
  rcs.replace.css(css);

  const stats = rcs.statistics.generate();

  expect(stats.keyframes.usageCount).toEqual({ 'another-move': 0, move: 1 });
  expect(stats.keyframes.unused).toEqual(['another-move']);
});

it('should have deperaction warning', () => {
  // eslint-disable-next-line no-console
  console.warn = jest.fn();

  rcs.stats();

  // eslint-disable-next-line no-console
  expect(console.warn).toHaveBeenCalledTimes(1);
});
