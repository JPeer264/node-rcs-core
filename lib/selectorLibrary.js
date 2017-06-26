import { merge } from 'lodash';
import includes from 'array-includes';
import entries from 'object.entries';

import replace from './replace';
import nameGenerator from './nameGenerator';

class SelectorLibrary {
  constructor() {
    this.excludes = [];
    this.selectors = {};
    this.attributeSelectors = {};
    this.compressedSelectors = {};
  }

  fillLibrary(data, options = {}) {
    const regex = replace.regex;

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

  get(selector, options = {}) {
    // replaces the first character from a css selector `#test` and `.test` into `test`
    const matchedSelector = selector.replace(/(\.|#)/, '');

    let result = this.selectors[matchedSelector];

    const optionsDefault = {
      origValues: true,
      isSelectors: false,
      isCompressed: true,
    };

    options = merge({}, optionsDefault, options);

    // fail on setted exludes
    if (includes(this.excludes, matchedSelector)) {
      return selector;
    }

    // change the objects if origValues are set to false
    // to get information about the compressed selectors
    if (!options.origValues) {
      result = this.compressedSelectors[matchedSelector];
    }

    if (!result) {
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

  getAll(options = {}) {
    let originalSelector;
    let compressedSelector;

    let resultArray = [];
    let result = {};

    const selectors = this.selectors;
    const optionsDefault = {
      origValues: true,
      regex: false,
      isSelectors: false,
      extended: false,
      regexCss: false,
      plainCompressed: false,
    };

    options = merge({}, optionsDefault, options);

    if (options.extended) {
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
    } // options.extended

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

    // if regexCss is true
    // selectors also MUST be true
    if (options.regexCss) {
      options.isSelectors = true;
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

    if (options.regex || options.regexCss) {
      const regex = options.regexCss
        ? new RegExp(resultArray.join('|'), 'g')
        // the next MUST be options.regex === true
        : new RegExp(`(\\s|\\s\\.|#)(${resultArray.join('|')})\\s`, 'g');

      const regexResult = resultArray.length === 0 ? undefined : regex;

      return regexResult;
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
  } // /getAll

  set(value, renamedSelector, options = {}) {
    let modifiedOptions = {};

    if (!value) {
      return;
    }

    if (typeof renamedSelector === 'object') {
      options = renamedSelector;
      renamedSelector = undefined;
    }

    // loops through String.match array
    if (typeof value === 'object') {
      value.forEach((v) => {
        this.set(v, options);
      });

      return;
    }

    // checks if this value was already set
    if (this.get(value) !== value) {
      return;
    }

    const selectorLibrarySelector = value.slice(1, value.length);

    if (!options.ignoreAttributeSelector) {
      if (this.isInAttributeSelector(value)) {
        modifiedOptions.preventRandomName = true;
      }
    }

    // skip excludes
    if (includes(this.excludes, selectorLibrarySelector)) {
      return;
    }

    modifiedOptions = merge({}, options, modifiedOptions);

    // save css selector into this.selectors and this.compressedSelectors
    this.selectors[selectorLibrarySelector] = this.setValue(
      value,
      renamedSelector,
      modifiedOptions,
    );

    const compressedSelector = this.selectors[selectorLibrarySelector].compressedSelector;

    this.compressedSelectors[compressedSelector] = this.selectors[selectorLibrarySelector];
  } // /set

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

  setValue(string, renamedSelector, options = {}) {
    let compressedSelector;
    const selectorLibrarySelector = string.slice(1, string.length);

    if (typeof renamedSelector === 'object') {
      options = renamedSelector;
      renamedSelector = undefined;
    } else if (renamedSelector !== undefined && (renamedSelector.charAt(0) === '.' || renamedSelector.charAt(0) === '#')) {
      renamedSelector = renamedSelector.slice(1, renamedSelector.length);
    }

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
      compressedSelector = renamedSelector || nameGenerator.generate();
    }

    const compressedSelectorPlain = compressedSelector;

    // does not allow the same renamed selector
    while (this.compressedSelectors[compressedSelector]) {
      compressedSelector = nameGenerator.generate();
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

  setValues(selectors) {
    if (Object.prototype.toString.call(selectors) !== '[object Object]') {
      throw new Error('setValues just accept an object as parameter');
    }

    entries(selectors).forEach(entry => this.set(entry[0], entry[1]));
  } // /setValues

  setAttributeSelector(attributeSelector) {
    if (!attributeSelector) {
      return;
    }

    if (typeof attributeSelector === 'object') {
      attributeSelector.forEach(value => this.setAttributeSelector(value));

      return;
    }

    const re = new RegExp(replace.regex.attributeSelectors);
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

export default new SelectorLibrary();
