# rcs.selectorsLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)
- [getAllRegex](#getall)
- [set](#set)
- [setAttributeSelector](#setattributeselector)
- [replaceAttributeSelector](#replaceattributeselector)
- [getClassSelector](#getclassselector)
- [getIdSelector](#getidselector)

Plus methods of [BaseLibrary](./baselibrary.md):
- [setMultiple](#setmultiple)
- [setExclude](#setexclude)
- [isExcluded](#isexcluded)
- [setReserved](#setreserved)
- [isReserved](#isreserved)
- [setPrefix](#setprefix)
- [setSuffix](#setsuffix)

### fillLibrary

> Takes your CSS file (as a string) and fills the library with all necessary information

** rcs.selectorLibrary.fillLibrary(code[, options])**

Parameters:
- code `<String>`
- options `<Object>` (optional): same as `selectorLibrary.set()`
  - ignoreAttributeSelectors `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`
  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

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
  - isOrigValue `<Boolean>`: If true the input is the original value. Default: `true`
  - addSelectorType `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`
  - extend `<Boolean>`: If true it will append more information given as object. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
rcs.selectorLibrary.get('#my-id', { addSelectorType: true }); // #a
```

### getAllRegex

> Returns all setted values as a regular expression

**rcs.selectorLibrary.getAllRegex([options])**

Parameters:
- options `<Object>`:
  - getRenamedValues `<Boolean>`: If true it will return the renamed values. Default: `false`
  - addSelectorType `<Boolean>`: If true it will also add the ID or CLASS prefix (# or .). Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id');
rcs.selectorLibrary.set('.a-class');

const allValues = rcs.selectorLibrary.getAllRegex();
```

### set

> Sets a specific selector into the selectorLibrary

**rcs.selectorLibrary.set(selector[, [renamedSelector, ] options])**

Parameters:
- selector `<String>`
- renamedSelector `<String>` (optional)
- options `<Object>`:
  - ignoreAttributeSelectors `<Boolean>`: If `true` it does ignore all setted attribute selectors such as `[class*=my]` so `.my_class` will be renamed.  Default: `false`

  *plus options of `selectorLibrary.generateMeta()`*

  - preventRandomName `<Boolean>`. Does not rename the given selector. Good for just pre- or suffix the selectors. Default: `false`

Example:

```js
const rcs = require('rcs-core');

rcs.selectorLibrary.set('#my-id'); // sets to 'a'

rcs.selectorLibrary.get('#my-id'); // a
```

### getClassSelector

> Returns the selector library for CSS classes

**rcs.selectorLibrary.getClassSelector()**

Example:

```js
const rcs = require('rcs-core');

const myClassSelector = rcs.selectorLibrary.getClassSelector();
const toDump = myClassSelector.getAll();

```

### getIdSelector

> Returns the selector library for ID

**rcs.selectorLibrary.getIdSelector()**

Example:

```js
const rcs = require('rcs-core');

const myIdSelector = rcs.selectorLibrary.getIdSelector();
const toDump = myIdSelector.getAll();

```


### setAttributeSelector

> Sets the attribute selector into the appropriate selector library (`classSelector.attributeSelectors` or `idSelector.attributeSelectors`)

**rcs.selectorLibrary.setAttributeSelector(attributeSelector)**

Parameters:
- attributeSelector `<String>`. Attribute selector as in the [specs](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

Example:

```js
const rcs = require('rcs-core');

rcs.setAttributeSelector('[class$="selector"]');

// sets the following into classSelector.attributeSelectors
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

### replaceAttributeSelector

> Replace (Compress) a given selector so it still fits the original rule

**rcs.selectorLibrary.replaceAttributeSelector(selector)**

Parameters:
- selector `<String>`

Example:

```js
// first set some attribute selectors with `rcs.selectorLibrary.setAttributeSelectors`
rcs.setAttributeSelector('[class*="lect"]');

rcs.replaceAttributeSelector('.select'); // '.alect'
rcs.replaceAttributeSelector('.selct'); // false
```
