# rcs.replace

All replace methods take `Buffer` or `String`.

## Methods

- [regex](#regex)
- [any](#any)
- [css](#css)
- [js](#js)
- [string](#string)

### regex

> An object with all regular expressions used in rcs-core

[Available regular expressions](https://github.com/JPeer264/node-rcs-core/blob/master/lib/replace/regex.js)

### any

> Replaces all strings which matches the filled selectors

**rcs.replace.any(code)**

Parameters:
- code `<String>`

Example:

```js
const rcs = require('rcs-core');

// first set the id to replace
rcs.selectorLibrary.set('#my-id');

const replacedCode = rcs.replace.any('document.getElementById("my-id")');
// output:
// document.getElementById("t")
```

### css

> Stores all selectors in `rcs.selectorLibrary` and replaces them

**rcs.replace.css(code[, options])**

Parameters:
- code `<String>`
- options `<Object>`:
  - ignoreAttributeSelector `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - replaceKeyframes `<Boolean>`: Renames the names in `animation-name` or `animation` if a specific `@keyframes` was triggered **before**. Default: `false`

Example:

```js
const rcs = require('rcs-core');
const replacedBuffer = rcs.replace.any('#my-id: {}', { replaceKeyframes: true });
```

### js

> Replaces all selectors in strings of a JavaScript/JSX file

**rcs.replace.js(code)**

Parameters:
- code `<String>`

Example:

```js
const rcs = require('rcs-core');
const replacedBuffer = rcs.replace.js('#my-id: {}');
```

### string

> Replaces a given string with the stored value in `rcs.selectorLibrary`

**rcs.replace.string(selector)**

Parameters:
- selector `<String>`: Any selector which is already set in `rcs.selectorLibrary`

Example:

```js
const rcs = require('rcs-core');

// first set the id to replace
rcs.selectorLibrary.set('#my-id');

const replacedStringDoubleQuote = rcs.replace.string('"my-id"'); // returns "a"
const replacedStringSingleQuote = rcs.replace.string("'my-id'"); // returns 'a'
```
