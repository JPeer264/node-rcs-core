# rcs.useCustomGenerator

> This is a special method if you want to generate different selectors

**useCustomGenerator(customGenerator)**

Parameters:
- customGenerator `<Function>`: This function parameter is an object containing:

* `selector`: The initial selector for generating
* `nameCounter`: An increasing number
* `alphabet`: The alphabet used as default parameters
* `type`: The library type calling the generator (any of `id`, `class`, `keyframe`, `variable`, `attribute`). 

It should return a unique string which will then be used as selector.

## Usage

Example:

```js
const { useCustomGenerator } = require('rcs-core/nameGenerator');
const uniqueStrings = require('some-unique-naming-lib');

useCustomGenerator((Obj) => (
  uniqueStrings(Obj.nameCounter)
));

const newName = rcs.nameGenerator.generate(); // does not return 'a' but the outcome from `uniqueStrings(nameCounter)`
```
