# rcs.replace

All replace methods take `Buffer` or `String`.

## Methods

- [regex](#regex)
- [html](#html)
- [any](#any)
- [css](#css)
- [js](#js)
- [string](#string)

### regex

> An object with all regular expressions used in rcs-core

[Available regular expressions](https://github.com/JPeer264/node-rcs-core/blob/master/lib/replace/regex.js)

### html

> Replaces attributes with `id` or `class`. Everything within a `<script>` tag, will be processed via [replace.js](#js), and everything inside a `<style>` tag with [replace.css](#css).

**rcs.replace.html(code[, options])**

Parameters:
- code `<String>`
- options `<Object>`

Options:
- espreeOptions: same as [replace.js](#js) options
- triggerClassAttributes `<Array>`: Array of string or regular expressions. Renames all classes with the matching string or regex. E.g. `[/data-*/ , 'custom-attr']` matches all data attributes and 'custom-attr'
- triggerIdAttributes `<Array>`: Same as triggerClassAttributes just for IDs
Example:

```js
const rcs = require('rcs-core');

// first set the id to replace
rcs.selectorLibrary.set('.my-class');

const replacedHtml = rcs.replace.html('<div class="my-class"></div>');
// output:
// '<div class="a"></div>'
```

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

**rcs.replace.css(code)**

Parameters:
- code `<String>`

Example:

```js
const rcs = require('rcs-core');

// first set the id to replace
rcs.selectorLibrary.set('#my-id');

const replacedBuffer = rcs.replace.css('#my-id: {}');
// output:
// '#a: {}'
```

### js

> Replaces all selectors in strings of a JavaScript/JSX file

**rcs.replace.js(code)**

Parameters:
- code `<String>`
- [espreeOptions](https://github.com/eslint/espree#usage) `<Object>`

Espree default options:
```js
{
  ecmaVersion: 9,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
  range: true, // cannot be changed
  loc: true, // cannot be changed
  comment: true, // cannot be changed
  attachComment: true, // cannot be changed
  tokens: true, // cannot be changed
}
```

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
