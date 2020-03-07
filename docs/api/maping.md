# rcs.mapping

## Methods
- [generate](#generate)
- [load](#load)

### generate

> Generate a mapping based on your filled library. This is usually used after `fillLibrary` has been called.

**rcs.mapping.generate([options])**

Parameters:
- options `<Object>`:
  - origValues `<Boolean>`: If `false` the key/value pairs are reversed. Default: `true`

Example:

```js

const rcs = require('rcs-core');

rcs.selectorLibrary.set(['.my-selector', '#my-id', '.test-selector']);

const mapping = rcs.mapping.generate();
/**
 * Output:
 *
 * { '.my-selector': 'a', '#my-id': 'a', '.test-selector': 'b' }
 *
 * Output if `origValues: false`
 *
 * { '.a': 'my-selector', '#a': 'my-id', '.b': 'test-selector' }
 */
