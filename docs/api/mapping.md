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

rcs.fillLibraries(`
  :root {
      --var: 200;
  }

  @my-animation {
    from {}
    to {}
  }

  .my-selector {
    content: "";
    animation-name: my-animation;
  }

  #my-id {
    content: "";
  }

  .test-selector[class^="sel"] {
    content: "";
  }

  .selector {
    content: "";
  }
`)

const mapping = rcs.mapping.generate();
/**
 * Output:
 *
 * {
 *   attributeSelectors: ['.^sel'],
 *   selectors: {
 *     '.my-selector': 'a',
 *     '#my-id': 'a',
 *     '.test-selector': 'b',
 *     '.selector': 'sela',
 *     '-var': 'a',
 *   }
 * }
 *
 * Output if `origValues: false`
 *
 * {
 *   attributeSelectors: ['.^sel'],
 *   selectors: {
 *     '.a': 'my-selector',
 *     '#a': 'my-id',
 *     '.b': 'test-selector',
 *     '.sela': 'selector',
 *     '-a': 'var',
 *   }
 * }
 */
