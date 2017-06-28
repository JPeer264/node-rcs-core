# rcs.selectorLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)
- [getAll](#getall)
- [set](#set)
- [setExclude](#setexclude)
- [setValue](#setvalue)
- [setValues](#setvalues)
- [setAttributeSelector](#setattributeselector)
- [isInAttributeSelector](#isinattributeselector)

### fillLibrary

> Takes your CSS file (as a string) and fills the library with all necessary information

** rcs.selectorLibrary.fillLibrary(code[, options])**

Parameters:
- code `<String>`
- options `<Object>`:
  - [see here](#set)

Example:

```js
const myCssFile = '.class { padding: 0; }; #id { margin: 0; }';

rcs.selectorLibrary.fillLibrary(myCssFile);
```

### get

> Get a specific minified selector

**rcs.selectorLibrary.get(selector[, options])**

Parameters:
- selector `<String>`
- options `<Object>`:
  - origValues `<Boolean>`: If true the input is the original value. Default: `true`
  - isSelectors `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`
  - isCompressed `<Boolean>`: To see the minified string and not the object itself. Default: `true`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
rcs.selectorLibrary.get('#my-id', { isSelectors: true }); // #a
```

### getAll

> Returns all setted values as array plus metadata

**rcs.selectorLibrary.getAll([options])**

Parameters:
- options `<Object>`:
  - origValues `<Boolean>`: If true the input is the original value. Default: `true`
  - regex `<Boolean>`: This will return a regex of all setted selectors in the selectorLibrary. Default: `false`
  - regexCss `<Boolean>`: This will return a regex of all setted selectors in the selectorLibrary, optimized for CSS files. Default: `false`
  - isSelectors `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`
  - extended `<Boolean>`: If true it will all selectors with stored metadata. Has **no effect** in combination with the option REGEX. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id');
rcs.selectorLibrary.set('.a-class');

const allValues = rcs.selectorLibrary.getAll();
```

### set

> Sets a specific selector into the selectorLibrary

**rcs.selectorLibrary.set(selector[, [renamedSelector, ] options])**

Parameters:
- selector `<String>`
- renamedSelector `<String>` (optional)
- options `<Object>`:
  - ignoreAttributeSelector (boolean): If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`

  *plus options of `selectorLibrary.set()`*

  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
```

### setExclude

> To exclude some CLASSES or IDs. Good if you use tools such as Modernizr

**rcs.selectorLibrary.setExclude(selector)**

Parameters:
- selector `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.setExclude('js');
rcs.selectorLibrary.setExclude('no-js');

// CLASSES and IDs called `js` or `no-js` will now be ignored
rcs.selectorLibrary.set('no-js'); // will not set the minified one
rcs.selectorLibrary.get('.no-js'); // .no-js
rcs.selectorLibrary.get('no-js'); // no-js
```

### setValue

> Returns the metainformation of the selector and generates a new name for the selector

**rcs.selectorLibrary.setValue(selector[, [renamedSelector, ] options])**

Parameters:
- selector `<String>`
- renamedSelector `<String>` (optional)
- options `<Object>`:
  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const rcs = require('rcs-core');

const myClassMeta = rcs.selectorLibrary.setValue('.my-class');

// myClassMeta returns:
//
// {
//      type: 'class',
//      typeChar: '.',
//      selector: '.my-class',
//      modifiedSelector: 'my-class',
//      compressedSelector: 'a'
// }
```

### setValues

> Calls `selectorLibrary.set` internally

**rcs.selectorLibrary.setValues(selectors)**

Parameters:
- selectors `<Object>`. The *key* of the object must be the selector. The *value* could be an own name or if `undefined` it will be automatically generated

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.setValues({
    '.a-selector': 'abc',
    '.another-selector': undefined,
    '.slider': 'u'
});
```

### setAttributeSelector

> Sets the attribute selector into `this.attributeSelectors`

**rcs.selectorLibrary.setAttributeSelector(attributeSelector)**

Parameters:
- attributeSelector `<String>`. Attribute selector as in the [specs](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

Example:

```js
const rcs = require('rcs-core');

rcs.setAttributeSelector('[class$="selector"]');

// sets the following into this.attributeSelectors
//
// {
//      '.$selector': {
//          type: 'class',
//          typeChar: '.',
//          originalString: '[class$="selector"]',
//          regexType: $
//      }
// }
```

### isInAttributeSelector

> check wheter a selector is set by an CSS attribute selector or not

**rcs.selectorLibrary.isInAttributeSelector(selector)**

Parameters:
- selector `<String>`

Example:

```js
// first set some attribute selectors with `rcs.selectorLibrary.setAttributeSelectors`
rcs.setAttributeSelector('[class*="lect"]');

rcs.isInAttributeSelector('.select'); // true
rcs.isInAttributeSelector('.selct');  // false
rcs.isInAttributeSelector('#select'); // false
```
