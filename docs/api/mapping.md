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
```

### load

> Loads an already generated mapping

**rcs.mapping.load(mapping[, options])**

Parameters:
- mapping `<Object>`:
  - attributeSelectors `<Array>` (optional): An array of strings
  - selectors `<Object>` (optional): A set of key value pairs, where the key is the selector and the value is the shortened name
- options `<Object>`:
  - origValues `<Boolean>`: If `false` the key/value pairs are reversed. Default: `true`

**Prefixes in `attributeSelectors`:**

First prefix is `.` or `#` depending if it is a `class` or an `id`.

Second prefix is the css attribute selector type: [all types are supported](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#Syntax)

**Prefixes in `selectors`:**

`@`: Keyframes<br />
`.`: Classes<br />
`#`: IDs<br />
`-`: CSS Variables<br />

Example:

```js
const rcs = require('rcs-core');

rcs.mapping.load({
  attributeSelectors: ['.^sel', '.*beta', '.|f'],
  selectors: {
    '.my-selector': 'a',
    '#my-id': 'a',
    '.test-selector': 'b',
    '.selector': 'selt',
    '-var': 'a',
  },
});
```
