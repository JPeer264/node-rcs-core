'use strict';

const _ = require('lodash');
const rcs = require('../rcs');
const includes = require('array-includes');
const entries = require('object.entries');

/**
 * a library holding all information about the selectors including its old states
 */
class SelectorLibrary {
  constructor() {
    this.excludes = [];
    this.selectors = {};
    this.attributeSelectors = {};
    this.compressedSelectors = {};
  }

  /**
   *
   * @param {String} the data to replace
   * @param {Object} options
   *
   * @memberof SelectorLibrary
   */
  fillLibrary(data, options) {
    const regex = rcs.replace.regex;

    // set the selectors
    // first removing everything which can match with 'regex.selectors'
    this.set(
      data
        .replace(regex.multiLineComments, ' ')
        .replace(regex.urlAttributes, ' ')
        .replace(regex.hexCodes, ' $2 ')
        .replace(regex.doubleQuotes, ' ')
        .replace(regex.singleQuotes, ' ')
        .replace(regex.sizesWithDots, ' $3 ')
        .replace(regex.onlyNumbers, ' $2 ')
        .replace(regex.attributeContent, ' $1 ')
        .match(regex.selectors),
      options);
  }

  /**
   * gets a specific selector
   *
   * @param {String} the selector
   * @return {String}
   */
  get(selector, options) {
    const matchedSelector = selector.replace(/(\.|#)/, ''); // replaces the first character from a css selector `#test` and `.test` into `test`
    let result = this.selectors[matchedSelector];

    const optionsDefault = {
      origValues: true,
      isSelectors: false,
      isCompressed: true,
    };

    options = _.merge(optionsDefault, options);

    // fail on setted exludes
    if (includes(this.excludes, matchedSelector)) {
      return selector;
    }

    // change the objects if origValues are set to false
    // to get information about the compressed selectors
    if (!options.origValues) {
      result = this.compressedSelectors[matchedSelector];
    }

    if (result === undefined) {
      return selector;
    }

    if (options.isCompressed) {
      if (options.isSelectors) {
        return result.typeChar + result.compressedSelector;
      }

      return result.compressedSelector;
    }

    return result;
  } // /get

  /**
   * @typedef {Object} getAllOptions
   * @property {Boolean} [origValues=true]
   *    if it should return the original values or the compressed one
   * @property {Boolean} [regex=false]
   *    if it should return a regex string
   * @property {Boolean} [isSelectors=false]
   *    true appends appends the # for IDs or . for Classes
   * @property {Boolean} [extended=false]
   *    extend the normal return value with metadata - has NO EFFECT in combination with REGEX
   * @property {Boolean} [plainCompressed]
   *    Just affects if extended is `false`. Get the non pre/suffixed renamed selector
   */
  /**
   * gets all selectors
   *
   * @param {getAllOptions} [options]
   *
   * @return {String | Object}
   *    returns either a regex string or an object with elements, depends on the setted options
   */
  getAll(options) {
    let regex;
    let originalSelector;
    let compressedSelector;
    const selectors = this.selectors;
    let result = {};
    let resultArray = [];

    const optionsDefault = {
      origValues: true,
      regex: false,
      isSelectors: false,
      extended: false,
      regexCss: false,
      plainCompressed: false,
    };

    options = _.merge(optionsDefault, options);

    if (!options.extended) {
      Object.keys(selectors).forEach((selector) => {
        compressedSelector = options.plainCompressed
          ? selectors[selector].compressedSelectorPlain
          : selectors[selector].compressedSelector;
        originalSelector = selector;

        if (options.origValues) { // save originalSelectors
          result[selector] = compressedSelector;
          resultArray.push(originalSelector);
        } else { // save compressedSelectors
          result[compressedSelector] = originalSelector;
          resultArray.push(compressedSelector);
        }
      });

      // sort array by it's length to avoid e.g. BEM syntax
      if (options.regex || options.regexCss) {
        resultArray = resultArray.sort((a, b) => b.length - a.length);
      }

      if (options.isSelectors) {
        resultArray = resultArray.map((value) => {
          const selectorMap = this.get(value, {
            origValues: options.origValues,
            isSelectors: options.isSelectors,
            isCompressed: false,
          });

          return selectorMap.typeChar + value;
        });
      }

      // return a new regex
      if (options.regexCss) {
        regex = resultArray.length === 0 ? undefined : new RegExp(resultArray.join('|'), 'g');

        return regex;
      }

      // return a new regex
      if (options.regex) {
        regex = resultArray.length === 0 ? undefined : new RegExp(`(\\s|\\s\\.|#)(${resultArray.join('|')})\\s`, 'g');

        return regex;
      }

      if (options.isSelectors) {
        const tempResult = {};

        resultArray.forEach((value) => {
          const modValue = value.slice(1, value.length);

          tempResult[value] = result[modValue];
        });

        result = tempResult;
      }

      return result;
    } // !options.extended

    // reset result
    result = {};

    if (options.origValues) {
      result = this.selectors;
    } else {
      result = this.compressedSelectors;
    }

    if (options.isSelectors) {
      const modifiedResult = {};

      Object.keys(result).forEach((value) => {
        const char = result[value].typeChar;

        modifiedResult[char + value] = result[value];
      });

      result = modifiedResult;
    }

    return result;
  } // /getAll

  /**
   * sets new values in the selector library
   *
   * @param {String | Array} value this could be either a css selector or an array of css selectors
   */
  set(value, renamedSelector, options) {
    let selectorLibrarySelector;
    let modifiedOptions = {};

    if (!value) {
      return;
    }

    if (typeof renamedSelector !== 'string') {
      options = renamedSelector;
      renamedSelector = undefined;
    }

    options = options || {};

    // loops through String.match array
    if (typeof value === 'object') {
      value.forEach((v) => {
        modifiedOptions = {};

        // checks if this value was already set
        if (this.get(v) !== v) {
          return;
        }

        selectorLibrarySelector = v.replace(/(\.|#)/g, '');

        if (!options.ignoreAttributeSelector) {
          if (this.isInAttributeSelector(v) || options.preventRandomName) {
            modifiedOptions.preventRandomName = true;
          }
        }

        // skip excludes
        if (includes(this.excludes, selectorLibrarySelector)) {
          return;
        }

        modifiedOptions = _.merge({}, options, modifiedOptions);

        // save into this.selectors and this.compressedSelectors
        this.selectors[selectorLibrarySelector] = this.setValue(v, modifiedOptions);

        const compressedSelector = this.selectors[selectorLibrarySelector].compressedSelector;

        this.compressedSelectors[compressedSelector] = this.selectors[selectorLibrarySelector];
      });

      return;
    }

    // checks if this value was already set
    if (this.get(value) !== value) {
      return;
    }

    selectorLibrarySelector = value.slice(1, value.length);

    if (!options.ignoreAttributeSelector) {
      if (this.isInAttributeSelector(value)) {
        modifiedOptions.preventRandomName = true;
      }
    }

        // skip excludes
    if (includes(this.excludes, selectorLibrarySelector)) {
      return;
    }

    modifiedOptions = _.merge({}, options, modifiedOptions);

    // save css selector into this.selectors and this.compressedSelectors
    this.selectors[selectorLibrarySelector] = this.setValue(
      value,
      renamedSelector,
      modifiedOptions // eslint-disable-line
    );

    const compressedSelector = this.selectors[selectorLibrarySelector].compressedSelector;

    this.compressedSelectors[compressedSelector] = this.selectors[selectorLibrarySelector];
  } // /set

  /**
   * excludes css selectors and stores it into this.excludes
   *
   * @param {String | Array}
   *  toExclude a string or array with string to exclude specific css selectors
   */
  setExclude(toExclude) {
    if (!toExclude) return;

    if (typeof toExclude === 'string') {
      if (includes(this.excludes, toExclude)) {
        return;
      }

      (this.excludes).push(toExclude);

      return;
    }

    toExclude.forEach((e) => {
      if (includes(this.excludes, e)) {
        return;
      }

      (this.excludes).push(e);
    });
  } // /setExclude

  /**
   * creates a new object to set it into the selector library
   *
   * @param {String} string the selector string
   * @param {Object} [options]
   * @property {String}  prefix            the prefix for renaming
   * @property {String}  suffix            the suffix for renaming
   * @property {Boolean} preventRandomName prevent minify selectors (good for just prefix/suffix)
   *
   * @return {Object} the object to set it into the set method
   */
  setValue(string, renamedSelector, options) {
    let compressedSelector;
    const selectorLibrarySelector = string.slice(1, string.length);

    if (typeof renamedSelector !== 'string') {
      options = renamedSelector;
      renamedSelector = undefined;
    } else if (renamedSelector.charAt(0) === '.' || renamedSelector.charAt(0) === '#') {
      renamedSelector = renamedSelector.slice(1, renamedSelector.length);
    }

    options = options || {};

    // return the own value if it exists
    if (this.selectors[selectorLibrarySelector] !== undefined) {
      return this.selectors[selectorLibrarySelector];
    }

    const type = string.charAt(0) === '.' ? 'class' : 'id';
    const typeChar = string.charAt(0);
    const selector = string;

    if (options.preventRandomName === true) {
      compressedSelector = selectorLibrarySelector;
    } else {
      compressedSelector = renamedSelector || rcs.nameGenerator.generate();
    }

    const compressedSelectorPlain = compressedSelector;

    // does not allow the same renamed selector
    while (this.compressedSelectors[compressedSelector]) {
      compressedSelector = rcs.nameGenerator.generate();
    }

    if (typeof options.prefix === 'string') {
      compressedSelector = options.prefix + compressedSelector;
    }

    if (typeof options.suffix === 'string') {
      compressedSelector += options.suffix;
    }

    return {
      type,
      typeChar,
      selector,
      modifiedSelector: selectorLibrarySelector,
      compressedSelector,
      compressedSelectorPlain,
    };
  } // /setValue

  /**
   * set multiple values at once
   *
   * @param {object}
   *    selectors these selectors should have the selector as key and the modified selector as value
   */
  setValues(selectors) {
    if (Object.prototype.toString.call(selectors) !== '[object Object]') {
      // eslint-disable-next-line
      throw 'setValues just accept an object as parameter';
    }

    entries(selectors).forEach(entry => this.set(entry[0], entry[1]));
  } // /setValues

  /**
   * sets the attribute selector
   *
   * @param {String} attributeSelector the attribute selector; e.g.: '[class$="selector"]'
   */
  setAttributeSelector(attributeSelector) {
    if (!attributeSelector) {
      return;
    }

    if (typeof attributeSelector === 'object') {
      attributeSelector.forEach(value => this.setAttributeSelector(value));

      return;
    }

    // same as replace.js @regex.attributeSelectors
    const reAttributeSelector = /\[\s*(class|id)\s*([*^$])=\s*("[\s\S]*?"|'[\s\S]*?')[\s\S]*?\]/g;
    const re = new RegExp(reAttributeSelector);
    const exec = re.exec(attributeSelector);
    const typeChar = exec[1] === 'class' ? '.' : '#';
    const attributeSelectorKey = typeChar + exec[2] + exec[3].slice(1, exec[3].length - 1);

    this.attributeSelectors[attributeSelectorKey] = {
      type: exec[1],
      typeChar,
      originalString: attributeSelector,
      regexType: exec[2],
    };
  } // /setAttributeSelector

  /**
   * check wheter a selector is set by an CSS attribute selector or not
   *
   * @param  {String}  selector the full selector
   *
   * @return {Boolean}
   */
  isInAttributeSelector(selector) {
    let result = false;

    Object.keys(this.attributeSelectors).forEach((attributeSelector) => {
      const attributeString = attributeSelector.slice(2, attributeSelector.length);

      if (attributeSelector.charAt(0) !== selector.charAt(0)) {
        return;
      }

      if (attributeSelector.charAt(1) === '*') {
        if (selector.match(attributeString)) {
          result = true;
        }
      }

      if (attributeSelector.charAt(1) === '^') {
        if (selector.match(`^${attributeString}`)) {
          result = true;
        }
      }

      if (attributeSelector.charAt(1) === '$') {
        if (selector.match(`${attributeString}$`)) {
          result = true;
        }
      }
    });

    return result;
  } // /isInAttributeSelector
}

/**
 * creates a new selectorLibrary
 * (require(rcs-core)).selectorLibrary
 *
 * @module selectorLibrary
 */
module.exports = new SelectorLibrary();
