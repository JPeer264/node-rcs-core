# rcs.cssVariablesLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)
- [set](#set)

Plus methods of [BaseLibrary](./baselibrary.md):
- [setMultiple](#setmultiple)
- [setExclude](#setexclude)
- [isExcluded](#isexcluded)

### fillLibrary

> This will take your CSS file (as a string) and fills the library with all necessary information

** rcs.cssVariablesLibrary.fillLibrary(code)**

Parameters:
- code `<String>`

Example:

```js
const myCssFileWithVariables = `
  :root {
    --my-variable: #BADA55;
  }
`;

rcs.cssVariablesLibrary.fillLibrary(myCssFileWithVariables);
```

### get

> This will get a specific minified selector

**rcs.cssVariablesLibrary.get(selector[, options])**

Parameters same as [Baselibrary Get](./baselibrary.md#get)


Example:

```js
const rcs = require('rcs-core');

rcs.cssVariablesLibrary.set('--my-variable'); // sets to 'a'

rcs.cssVariablesLibrary.get('--my-variable'); // --a
rcs.cssVariablesLibrary.get('my-variable'); // a
rcs.cssVariablesLibrary.get('var(--my-variable)'); // var(--a)
rcs.cssVariablesLibrary.get('a', { isOriginalValue: false }); // my-variable
```

### set

> Sets a specific value into the cssVariablesLibrary

**rcs.cssVariablesLibrary.set(value[, renamedValue])**

Parameters same as [Baselibrary Set](./baselibrary.md#set)

Example:

```js
const rcs = require('rcs-core');

rcs.cssVariablesLibrary.set('--my-variable'); // sets to 'a'
rcs.cssVariablesLibrary.set('my--other-variable'); // sets to 'b'

rcs.cssVariablesLibrary.get('--my-variable'); // a
rcs.cssVariablesLibrary.get('--my-other-variable'); // b
```
