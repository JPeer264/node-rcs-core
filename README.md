# rcs-core
[![Build Status](https://travis-ci.com/JPeer264/node-rcs-core.svg?branch=master)](https://travis-ci.com/JPeer264/node-rcs-core)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-rcs-core/badge.svg)](https://coveralls.io/github/JPeer264/node-rcs-core)

> **rcs** is short for **rename css selectors**

## Why?
Having long CSS selectors, such as `main-menu__item--disabled`, can increase the filesizes. With this `rcs-core` it is easy to rename the selectors and therefore reduce the filesize. You can save around 20% of the filesize by just shorten the CSS selectors in the CSS files.

## What does it do?
It basically just rename/minify all CSS selectors in all files. First the library has to be [trained with selectors](docs/api/filllibraries.md). Based on this data, the selectors can be renamed in all files. [Here](examples) are some examples made with [Bootstrap files](http://getbootstrap.com/).

Some live projects:
- AMP Project (https://amp.dev/)
- My personal webpage (https://jpeer.at/)

## Usage
```sh
$ npm install --save rcs-core
```
or
```sh
$ yarn add rcs-core
```

## API documentation
- [rcs.stats](docs/api/stats.md)
- [rcs.replace](docs/api/replace.md)
- [rcs.baseLibrary](docs/api/baselibrary.md)
- [rcs.fillLibraries](docs/api/filllibraries.md)
- [rcs.nameGenerator](docs/api/namegenerator.md)
- [rcs.selectorsLibrary](docs/api/selectorslibrary.md)
- [rcs.keyframesLibrary](docs/api/keyframeslibrary.md)
- [rcs.cssVariablesLibrary](docs/api/cssvariableslibrary.md)
- [rcs.useCustomGenerator](docs/api/usecustomgenerator.md)

## Plugins
- Gulp Plugin: [gulp-rcs](https://www.npmjs.com/package/gulp-rcs)
- Grunt Plugin: [grunt-rcs](https://www.npmjs.com/package/grunt-rcs)
- PostCSS Plugin: [postcss-rcs](https://www.npmjs.com/package/postcss-rcs)
- Node Plugin: [rename-css-selectors](https://www.npmjs.com/package/rename-css-selectors)
