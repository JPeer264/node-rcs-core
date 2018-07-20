# rcs.stats

> Some statistics to analyze your code

Returns object with:
- classUsageCount `<Object>`: Key is the class and value is how often this selector got used
- idUsageCount `<Object>`: Same as `classUsageCount`, but for ids
- unsusedClasses `<String[]>`: A list of unused classes
- unsusedIds `<String[]>`: A list of unused ids

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
