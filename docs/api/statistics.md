# rcs.statistics

## Methods
- [generate](#generate)
- [load](#load)

### generate

> Some statistics to analyze your code

**rcs.statistics.generate()**

Returns object with:
- ['ids' | 'classes' | 'cssVariables' | 'keyframes']:
  - unused `<Number>`: the count of the given object
  - usageCount `<Object>`: The key is the given variable and the value is the count

Example:

```js
// fill rcs with CSS data
rcs.selectorLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');

// replace files
rcs.replace.html('<div class="selector used"></div>');
rcs.replace.css('#id {} .selector {} .used {}');

// analyze
const stats = rcs.statistics.generate();

/**
 * will generate:
 *
 * {
 *   ids: {
 *     unused: 0,
 *     usageCount: {
 *       id: 1,
 *     },
 *   },
 *   classes: {
 *     unsused: 1,
 *     usageCount: {
 *       selector: 1,
 *       used: 1,
 *       '.not-used': 0,
 *     },
 *   },
 *   cssVariables: {
 *     unused: 0,
 *     usageCount: {},
 *   },
 *   keyframes: {
 *     unused: 0,
 *     usageCount: {},
 *   },
 * }
 */

```

### load

> Load some previous generated statistics

**rcs.statistics.load(statisticsMap)**

Parameters:
- statisticsMap `<Object>`: The produced map of [rcs.statistics.generate](#generate)
