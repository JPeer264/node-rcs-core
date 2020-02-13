# rcs.baseLibrary

## Methods
- [get](#get)
- [set](#set)
- [setMultiple](#setmultiple)
- [setExclude](#setexclude)
- [isExcluded](#isexcluded)
- [setReserved](#setreserved)
- [isReserved](#isreserved)
- [setPrefix](#setprefix)
- [setSuffix](#setsuffix)

### get

> Get a specific minified value

**rcs.baseLibrary.get(value[, options])**

Parameters:
- value `<String>`
- options `<Object>`:
  - isOriginalValue `<Boolean>`: If true the input is the original value. Default: `true`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.set('my-id'); // sets to 'a'

rcs.baseLibrary.get('my-id'); // a
```

### set

> Sets a specific value into the baseLibrary

**rcs.baseLibrary.set(value[, renamedValue])**

Parameters:
- value `<String>`
- renamedValue `<String>` (optional)

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.set('my-id'); // sets to 'a'

rcs.baseLibrary.get('my-id'); // a
```

### setMultiple

> Calls `baseLibrary.set` internally

**rcs.baseLibrary.setMultiple(values[, options])**

Parameters:
- values `<Object>`. The *key* of the object must be the value which you want to be renamed. The *value* could be an own name or if `undefined` it will be automatically generated

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setMultiple({
    'a-value': 'abc',
    'another-value': undefined,
    'slider': 'u'
});
```

### setExclude

> To exclude some values

**rcs.baseLibrary.setExclude(value)**

Parameters:
- value `<String | RegExp>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setExclude('js');
rcs.baseLibrary.setExclude('no-js');
rcs.baseLibrary.setExclude(/^any/); // or `new RegExp('^any')`

// values called `js` or `no-js` will now be ignored
rcs.baseLibrary.set('no-js'); // will not set the minified one
rcs.baseLibrary.get('no-js'); // no-js

rcs.baseLibrary.set('anything'); // will not set the minified one, as it matches /^any/
rcs.baseLibrary.get('anything'); // anything
```

### isExcluded

> Checks if the string is excluded, which was set by `rcs.baseLibrary.setExclude`

**rcs.baseLibrary.isExcluded(value)**

Parameters:
- value `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setExclude('js');

rcs.baseLibrary.isExcluded('js'); // true
rcs.baseLibrary.isExcluded('another-value'); // false
```

### setReserved

> To reserve some compressed values from being used. Replace the actual reserved list.

**rcs.baseLibrary.setReserved(value)**

Parameters:
- value `<String | Array of String>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setReserved('a'); // or:
rcs.baseLibrary.setReserved(['a', 'b']);

// the value will not be mapped to either 'a' or 'b'
rcs.baseLibrary.set('something');
rcs.baseLibrary.get('something'); // 'c'
```

### isReserved

> Checks if the string is reserved, which was set by `rcs.baseLibrary.setReserved`

**rcs.baseLibrary.isReserved(value)**

Parameters:
- value `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setReserved('a');

rcs.baseLibrary.isReserved('a'); // true
rcs.baseLibrary.isReserved('another-value'); // false
```

### setPrefix

> Sets a specific prefix to add to the mapped value

**rcs.baseLibrary.setPrefix(value)**

Parameters:
- value `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setPrefix('lib-');
rcs.baseLibrary.set('my-id'); // sets to 'lib-a'

rcs.baseLibrary.get('my-id'); // 'lib-a'
```

### setSuffix

> Sets a specific suffix to add to the mapped value

**rcs.baseLibrary.setSuffix(value)**

Parameters:
- value `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.baseLibrary.setSuffix('-bad');
rcs.baseLibrary.set('my-id'); // sets to 'a-bad'

rcs.baseLibrary.get('my-id'); // 'a-bad'
```

