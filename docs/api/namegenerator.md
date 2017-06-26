# rcs.nameGenerator

> This is mainly to generate a new name based on the module `decimal-to-any`

## Methods
- [generate](#generate)
- [setAlphabet](#setalphabet)
- [reset](#reset)

### generate

> This will generate a new name

**rcs.nameGenerator.generate()**

Example:

```js
const rcs = require('rcs-core');
const newName = rcs.nameGenerator.generate();
```

### setAlphabet

> Customize the used alphabet

**rcs.nameGenerator.setAlphabet(alphabet)**

Parameters:
- alphabet `<String>`

Example:

```js
const rcs = require('rcs-core');

rcs.nameGenerator.setAlphabet('abcde');

const newName = rcs.nameGenerator.generate(); // 'a'
```

### reset

> Starts the alphabet at the first letter

**rcs.nameGenerator.reset()**

Usage:

```js
const rcs = require('rcs-core');

rcs.nameGenerator.reset();
```
