# rcs.fillLibraries

> This fills `selectorLibrary` and `keyframesLibrary` with all necessary information. Just put in your CSS code.

> **Note:** Put your stylesheets in here before you call any [rcs.replace](replace.md) method.

## Usage

**rcs.fillLibraries(code[, options])**

Parameters:
- code `<String>`. The CSS with all selectors
- options `<Object>`:
  - ignoreAttributeSelector `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - replaceKeyframes `<Boolean>`: Renames the names in `animation-name` or `animation` if a specific `@keyframes` was triggered **before**. Default: `false`
  - prefix `<String>`. Prefix the compressed selector
  - suffix `<String>`. Suffix the compressed selector

  *plus options of `selectorLibrary.set()`*

  - ignoreAttributeSelector `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

