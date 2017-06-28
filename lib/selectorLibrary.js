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
    this.prefix = '';
    this.suffix = '';
  }

  reset() {
    this.excludes = [];
    this.selectors = {};
    this.attributeSelectors = {};
    this.compressedSelectors = {};
    this.prefix = '';
    this.suffix = '';
  } // /reset

  fillLibrary(data, options = {}) {
    const code = data.toString();
    const regex = replace.regex;

    // set the selectors
    // first removing everything which can match with 'regex.selectors'
    this.set(
      code
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
  } // /fillLibrary

  get(selector, opts = {}) {
    const optionsDefault = {
      isOrigValue: true,
      addSelectorType: false,
      extend: false,
    };

    const options = merge({}, optionsDefault, opts);
    // replaces the first character from a css selector `#test` and `.test` into `test`
    const matchedSelector = selector.replace(/(\.|#)/, '');

    let result = this.selectors[matchedSelector];

    // fail on setted exludes
    if (includes(this.excludes, matchedSelector)) {
      return selector;
    }

    // change the objects if isOrigValue are set to false
    // to get information about the compressed selectors
    if (!options.isOrigValue) {
      result = this.compressedSelectors[matchedSelector];
    }

    if (!result) {
      return selector;
    }

    if (options.extend) {
      return result;
    }

    if (options.addSelectorType) {
      return result.typeChar + this.prefix + result.compressedSelector + this.suffix;
    }

    return this.prefix + result.compressedSelector + this.suffix;
  } // /get

  getAll(opts = {}) {
    let originalSelector;
    let compressedSelector;

    let resultArray = [];
    let result = {};

    const selectors = this.selectors;
    const optionsDefault = {
      getRenamedValues: false,
      regex: false,
      regexCss: false,
      addSelectorType: false,
      extend: false,
    };

    const options = merge({}, optionsDefault, opts);

    if (options.extend) {
      if (options.getRenamedValues) {
        result = this.compressedSelectors;
      } else {
        result = this.selectors;
      }

      if (options.addSelectorType) {
        const modifiedResult = {};

        Object.keys(result).forEach((value) => {
          const char = result[value].typeChar;

          modifiedResult[char + value] = result[value];
        });

        result = modifiedResult;
      }

      return result;
    } // options.extend

    Object.keys(selectors).forEach((selector) => {
      compressedSelector = selectors[selector].compressedSelector;
      originalSelector = selector;

      if (options.getRenamedValues) {
        // save compressedSelectors
        result[compressedSelector] = originalSelector;
        resultArray.push(compressedSelector);
      } else {
        // save originalSelectors
        result[selector] = compressedSelector;
        resultArray.push(originalSelector);
      }
    });

    // sort array by it's length to avoid e.g. BEM syntax
    if (options.regex || options.regexCss) {
      resultArray = resultArray.sort((a, b) => b.length - a.length);
    }

    // if regexCss is true
    // selectors also MUST be true
    if (options.regexCss) {
      options.addSelectorType = true;
    }

    if (options.addSelectorType) {
      resultArray = resultArray.map((value) => {
        const selectorMap = this.get(value, {
          isOrigValue: !options.getRenamedValues,
          addSelectorType: options.addSelectorType,
          extend: true,
        });

        return selectorMap.typeChar + value;
      });
    }

    if (options.regex || options.regexCss) {
      const regex = options.regexCss
        ? new RegExp(resultArray.join('|'), 'g')
        // the next MUST be options.regex === true
        : new RegExp(`(\\s|\\.|#)(${resultArray.join('|')})[\\s)]`, 'g');

      const regexResult = resultArray.length === 0 ? undefined : regex;

      return regexResult;
    }

    if (options.addSelectorType) {
      const tempResult = {};

      resultArray.forEach((value) => {
        const modValue = value.slice(1, value.length);

        tempResult[value] = result[modValue];
      });

      result = tempResult;
    }

    return result;
  } // /getAll

  set(value, renamedSelector, opts = {}) {
    let options = opts;
    let thisRenamedSelector = renamedSelector;
    let modifiedOptions = {};

    if (!value) {
      return;
    }

    if (typeof thisRenamedSelector === 'object') {
      options = thisRenamedSelector;
      thisRenamedSelector = undefined;
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

    if (!options.ignoreAttributeSelectors) {
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
    this.selectors[selectorLibrarySelector] = this.generateMeta(
      value,
      thisRenamedSelector,
      modifiedOptions,
    );

    const compressedSelector = this.selectors[selectorLibrarySelector].compressedSelector;

    this.compressedSelectors[compressedSelector] = this.selectors[selectorLibrarySelector];
  } // /set

  setMultiple(selectors, options = {}) {
    if (Object.prototype.toString.call(selectors) !== '[object Object]') {
      return;
    }

    entries(selectors).forEach(entry => this.set(entry[0], entry[1], options));
  } // /setMultiple

  setPrefix(prefix) {
    if (typeof prefix !== 'string') {
      return;
    }

    this.prefix = prefix;
  } // /setPrefix

  setSuffix(suffix) {
    if (typeof suffix !== 'string') {
      return;
    }

    this.suffix = suffix;
  } // /setSuffix

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

  generateMeta(string, renamedSelector, opts = {}) {
    let compressedSelector;
    let options = opts;
    let thisRenamedSelector = renamedSelector;

    const selectorLibrarySelector = string.slice(1, string.length);

    if (typeof renamedSelector === 'object') {
      options = renamedSelector;
      thisRenamedSelector = undefined;
    } else if (thisRenamedSelector !== undefined && (thisRenamedSelector.charAt(0) === '.' || thisRenamedSelector.charAt(0) === '#')) {
      thisRenamedSelector = thisRenamedSelector.slice(1, thisRenamedSelector.length);
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
      compressedSelector = thisRenamedSelector || nameGenerator.generate();
    }

    // does not allow the same renamed selector
    while (this.compressedSelectors[compressedSelector]) {
      compressedSelector = nameGenerator.generate();
    }

    return {
      type,
      typeChar,
      selector,
      modifiedSelector: selectorLibrarySelector,
      compressedSelector,
    };
  } // /generateMeta

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

    const slicedSelector = selector.replace(/^[.#]/, '');

    Object.keys(this.attributeSelectors).forEach((attributeSelector) => {
      const attributeString = attributeSelector.slice(2, attributeSelector.length);

      if (attributeSelector.charAt(0) !== selector.charAt(0)) {
        return;
      }

      if (attributeSelector.charAt(1) === '*') {
        if (slicedSelector.match(attributeString)) {
          result = true;
        }
      }

      if (attributeSelector.charAt(1) === '^') {
        if (slicedSelector.match(`^${attributeString}`)) {
          result = true;
        }
      }

      if (attributeSelector.charAt(1) === '$') {
        if (slicedSelector.match(`${attributeString}$`)) {
          result = true;
        }
      }
    });

    return result;
  } // /isInAttributeSelector
}

export default new SelectorLibrary();
