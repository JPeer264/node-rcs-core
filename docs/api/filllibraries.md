# rcs.fillLibraries

> This fills `selectorLibrary`, `keyframesLibrary` and `cssVariablesLibrary` with all necessary information. Just put in your CSS code.

> **Note:** Put your stylesheets in here before you call any [rcs.replace](replace.md) method.

## Usage

**rcs.fillLibraries(code[, options])**

Parameters:
- code `<String>`. The CSS with all selectors
- options `<Object>` (optional):
  - codeType: `<'css' | 'html'>`: Checks whether the code is HTML or CSS. Useful if your HTML code has `style` tags included. Default: `css`
  - ignoreCssVariables `<Boolean>`: If `true` it does ignore all CSS variables such as `--my-variables`.  Default: `false`
  - ignoreAttributeSelectors `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - replaceKeyframes `<Boolean>`: Renames the names in `animation-name` or `animation` if a specific `@keyframes` was triggered **before**. Default: `false`
  - prefix `<String>`. Prefix the compressed selector
  - suffix `<String>`. Suffix the compressed selector

  *plus options of `selectorLibrary.setValue()`*

  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

