# rcs.nameGenerator

> This is mainly to generate a new name based on the module `decimal-to-any`

## Methods
- [generate](#generate)
- [setAlphabet](#setalphabet)
- [reset](#reset)

### generate

> This will generate a new name

**NameGenerator.prototype.generate([selector])**

Parameters:
- selector `<String>` (optional): Just required if [`useCustomGenerator`](./useCustomGenerator.md) is used. This will get used as return param in [`useCustomGenerator`](./useCustomGenerator.md)

Example:

```js
const { NameGenerator } = require('rcs-core/nameGenerator');

const ng = new NameGenerator();
const newName = ng.generate();
```

### setAlphabet

> Customize the used alphabet

**NameGenerator.prototype.setAlphabet(alphabet)**

Parameters:
- alphabet `<String>`

Example:

```js
const { NameGenerator } = require('rcs-core/nameGenerator');

const ng = new NameGenerator();

ng.setAlphabet('abcde');

const newName = ng.generate(); // 'a'
```

### reset

> Starts the alphabet at the first letter

**NameGenerator.prototype.reset()**

Usage:

```js
const { NameGenerator } = require('rcs-core/nameGenerator');

const ng = new NameGenerator();

ng.reset();
```
