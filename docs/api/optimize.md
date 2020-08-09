# rcs.optimize

> Optimizes selectors based on the loaded statistics and given selectors

> **Note:** Before this method takes effect you should either run [`rcs.fillLibraries`](./filllibraries.md) or load your mappings and statistics manually with [`rcs.mapping.load`](./mapping.md#load) and [`rcs.statistics.load`](./statistics.md#load)

## Usage

**rcs.optimize()**

Example with `fillLibraries`:

```js
const rcs = require('rcs-core');

rcs.fillLibraries(`
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

rcs.optimize();

// now replace your selectors
const css = rcs.replace.css(fs.readFileSync('./src/styles.css', 'utf8'));

fs.writeFileSync('./dist/styles.css', css);
```

Example with `mapping.load` and `statistics.load`:

```js
// load mapping (could also come from a saved file)
rcs.mapping.load({
  selectors: {
    '#test': 'a',
    '.ca': 'a',
    '.ba': 'b',
    '.aa': 'c',
  },
});

// load statistics (could also come from a saved file)
rcs.statistics.load({
  ids: {
    unused: [],
    usageCount: {
      test: 2,
    },
  },
  classes: {
    unused: [],
    usageCount: {
      ca: 3,
      ba: 10,
    },
  },
  keyframes: {
    unused: [],
    usageCount: {},
  },
  cssVariables: {
    unused: [],
    usageCount: {},
  },
});

rcs.optimize();

// now replace your selectors
const css = rcs.replace.css(fs.readFileSync('./src/styles.css', 'utf8'));

fs.writeFileSync('./dist/styles.css', css);
```
