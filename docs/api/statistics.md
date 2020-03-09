# rcs.statistics

## Methods
- [generate](#generate)

### generate

> Some statistics to analyze your code

**rcs.statistics.generate()**

Returns object with:
- classUsageCount `<Object>`: Key is the class and value is how often this selector got used
- idUsageCount `<Object>`: Same as `classUsageCount`, but for ids
- unsusedClasses `<String[]>`: A list of unused classes
- unsusedIds `<String[]>`: A list of unused ids
- unsusedKeyframes `<String[]>`: A list of unused keyframes
- keyframesUsageCount `<Object>`: Same as `classUsageCount`, but for keyframes
- unsusedCssVariables `<String[]>`: A list of unused css variables
- cssVariablesUsageCount `<Object>`: Same as `classUsageCount`, but for css variables

Example:

```js
// fill rcs with CSS data
rcs.selectorLibrary.fillLibrary('#id {} .selector {} .not-used {} .used {}');

// replace files
rcs.replace.html('<div class="selector used"></div>');
rcs.replace.css('#id {} .selector {} .used {}');

// analyze
const stats = rcs.stats();
```
