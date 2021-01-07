# rcs-core
[![Build Status](https://travis-ci.com/JPeer264/node-rcs-core.svg?branch=master)](https://travis-ci.com/JPeer264/node-rcs-core)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-rcs-core/badge.svg)](https://coveralls.io/github/JPeer264/node-rcs-core)

> **rcs** is short for **rename css selectors**

## Why?
Having long CSS selectors, such as `main-menu__item--disabled`, can increase the filesizes. With this `rcs-core` it is easy to rename the selectors and therefore reduce the filesize. You can save around 20% of the filesize by just shorten the CSS selectors in the CSS files.

## What does it do?
It basically just rename/minify all CSS selectors in all files. First the library has to be [trained with selectors](docs/api/filllibraries.md). Based on this data, the selectors can be renamed in all files. [Here](examples) are some examples made with [Bootstrap files](http://getbootstrap.com/).

Some live projects:
- AMP Project ([https://amp.dev/](https://amp.dev/))
- Analyse ([https://analyse.org/](https://analyse.org/))
- My personal webpage ([https://jpeer.at/](https://jpeer.at/))

## Caveats

Correctly using `rcs-core` or any of its [plugins](#plugins) on large project means few rules should be followed.

[This document](docs/caveats.md) explains most of them.

## Installation
```sh
$ npm install --save rcs-core
```
or
```sh
$ yarn add rcs-core
```

## Usage

> **Note** couple of selectors are [excluded by default](./lib/helpers/excludeList.ts). You can activate them by using `.setInclude` **before** you fill the library

1. Fill your library with all selectors (we assume there is just one CSS file)

```js
// excluding specific selectors
rcs.selectorsLibrary.setExclude('selector-to-ignore');
// include specific selectors which has been ignored by default
rcs.selectorsLibrary.setInclude('center');

rcs.fillLibraries(fs.readFileSync('./src/styles.css', 'utf8'));
```

2. Optimize the selectors compression (optional)

```js
rcs.optimize();
```

3. Rewrite all files

> **Note:** Do not forget to replace your CSS file

```js
const css = rcs.replace.css(fs.readFileSync('./src/styles.css', 'utf8'));
const js = rcs.replace.js(fs.readFileSync('./src/App.js', 'utf8'));
const html = rcs.replace.html(fs.readFileSync('./src/index.html', 'utf8'));

// output some warnings which has been stacked through the process
rcs.warnings.warn();

fs.writeFileSync('./dist/styles.css', css);
fs.writeFileSync('./dist/App.js', js);
fs.writeFileSync('./dist/index.html', html);
```

## API documentation
- [rcs.stats](docs/api/stats.md) (deprecated)
- [rcs.replace](docs/api/replace.md)
- [rcs.mapping](docs/api/mapping.md)
- [rcs.optimize](docs/api/optimize.md)
- [rcs.statistics](docs/api/statistics.md)
- [rcs.baseLibrary](docs/api/baselibrary.md)
- [rcs.fillLibraries](docs/api/filllibraries.md)
- [rcs.nameGenerator](docs/api/namegenerator.md)
- [rcs.selectorsLibrary](docs/api/selectorslibrary.md)
- [rcs.keyframesLibrary](docs/api/keyframeslibrary.md)
- [rcs.cssVariablesLibrary](docs/api/cssvariableslibrary.md)
- [rcs.useCustomGenerator](docs/api/usecustomgenerator.md)

## Plugins
- Node Plugin: [rename-css-selectors](https://www.npmjs.com/package/rename-css-selectors)
- Parcel Plugin: [parcel-plugin-rcs](https://www.npmjs.com/package/parcel-plugin-rcs)
- Webpack Plugin: [rcs-webpack-plugin](https://www.npmjs.com/package/rcs-webpack-plugin)
- PostCSS Plugin: [postcss-rcs](https://www.npmjs.com/package/postcss-rcs)
- Gulp Plugin: [gulp-rcs](https://www.npmjs.com/package/gulp-rcs)
- Grunt Plugin: [grunt-rcs](https://www.npmjs.com/package/grunt-rcs)
