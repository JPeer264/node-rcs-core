import { parse } from 'postcss';
import merge from 'lodash.merge';
import includes from 'array-includes';
import entries from 'object.entries';

import replace from './replace';
import { NameGenerator } from './nameGenerator';

class SelectorLibrary {
  constructor() {
    this.reset();
  }

  reset() {
    this.excludes = [];
    this.excludesRegex = [];
    this.selectors = {};
    this.attributeSelectors = {};
    this.compressedSelectors = {};
    this.prefix = '';
    this.suffix = '';
    this.nameGenerator = new NameGenerator('selector');
  } // /reset

  fillLibrary(data, options = {}) {
    const { regex } = replace;
    const code = data.toString();
    const result = parse(code);

    result.walk((root) => {
      if (root.selector) {
        let matchedSelectors = root.selector.match(regex.selectors) || [];


        matchedSelectors = matchedSelectors.map((matchedSelector) => {
          const escapedMatch = matchedSelector.match(regex.escapedSelectors) || [];
          const tempString = escapedMatch[0] || '';

          return matchedSelector.replace(regex.escapedAndDots, tempString);
        });

        this.set(matchedSelectors, options);
      }
    });
  } // /fillLibrary

  get(selector, opts = {}) {
    const optionsDefault = {
      isOrigValue: true,
      addSelectorType: false,
      extend: false,
      countStats: true,
    };

    const options = merge({}, optionsDefault, opts);
    // replaces the first character from a css selector `#test` and `.test` into `test`
    const matchedSelector = selector.replace(/(\.|#)/, '').replace(/\\/g, '');

    let result = this.selectors[matchedSelector];

    // fail on setted exludes
    if (this.isExcluded(matchedSelector)) {
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

    // update stats just when isOrigValue
    if (options.isOrigValue && options.countStats) {
      this.selectors[matchedSelector].appearanceCount = result.appearanceCount + 1;
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
          countStats: false,
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

    let modifiedValue = value;

    modifiedValue = value.replace(/\\/g, '');

    // checks if this value was already set
    if (this.get(modifiedValue) !== modifiedValue) {
      return;
    }

    const selectorLibrarySelector = modifiedValue.slice(1, modifiedValue.length);

    if (!options.ignoreAttributeSelectors) {
      const newName = this.replaceAttributeSelector(modifiedValue);

      if (newName) {
        thisRenamedSelector = newName;
      }
    }

    // skip excludes
    if (this.isExcluded(selectorLibrarySelector)) {
      return;
    }

    modifiedOptions = merge({}, options, modifiedOptions);

    // save css selector into this.selectors and this.compressedSelectors
    this.selectors[selectorLibrarySelector] = this.generateMeta(
      modifiedValue,
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

    if (Array.isArray(toExclude)) {
      toExclude.forEach(e => this.setExclude(e));

      return;
    }

    if (includes(this.excludes, toExclude) || includes(this.excludesRegex, toExclude)) {
      return;
    }

    if (toExclude instanceof RegExp) {
      (this.excludesRegex).push(toExclude);
    } else {
      (this.excludes).push(toExclude);
    }
  } // /setExclude

  isExcluded(string) {
    if (includes(this.excludes, string)) {
      return true;
    }

    return (
      this.excludesRegex.some(excludeRegex => (
        string.match(excludeRegex)
      ))
    );
  }

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
      compressedSelector = thisRenamedSelector || this.nameGenerator.generate(selector);
    }

    // does not allow the same renamed selector
    while (this.compressedSelectors[compressedSelector]) {
      compressedSelector = this.nameGenerator.generate(selector);
    }

    return {
      type,
      typeChar,
      selector,
      compressedSelector,
      modifiedSelector: selectorLibrarySelector,
      appearanceCount: 0,
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

    if (!exec) {
      return;
    }

    const typeChar = exec[1] === 'class' ? '.' : '#';
    const term = exec[3];

    let attributeSelectorType = exec[2];
    let selector = term;

    // it is empty if the attribute selector is following: [class=test]
    if (attributeSelectorType === '') {
      attributeSelectorType = '=';
    }

    if (term.charAt(0).match(/"|'/)) {
      selector = term.slice(1, exec[3].length - 1);
    }

    const attributeSelectorKey = typeChar + attributeSelectorType + selector;

    this.attributeSelectors[attributeSelectorKey] = {
      type: exec[1],
      typeChar,
      originalString: attributeSelector,
      regexType: attributeSelectorType,
      nameGeneratorCounter: new NameGenerator('attributeSelector'),
    };
  } // /setAttributeSelector

  replaceAttributeSelector(selector) {
    let result = false;

    const firstChar = selector.match(/^[.#]/) ? selector.charAt(0) : '';
    const slicedSelector = selector.replace(/^[.#]/, '');

    entries(this.attributeSelectors).forEach((entry) => {
      const attributeSelector = entry[0];
      const value = entry[1];
      const attributeString = attributeSelector.slice(2, attributeSelector.length);

      if (attributeSelector.charAt(0) !== selector.charAt(0)) {
        return;
      }

      if (attributeSelector.charAt(1) === '|') {
        let match = slicedSelector.match(`^${attributeString}-`);

        if (match) {
          match = match[0].replace(/-$/, '');
          result = `${firstChar}${match}-${value.nameGeneratorCounter.generate(slicedSelector)}`;
        }
      }

      if (attributeSelector.charAt(1).match(/^[=~|]/)) {
        const match = slicedSelector.match(attributeString);

        if (match && slicedSelector === match[0]) {
          result = firstChar + match;
        }
      }

      if (attributeSelector.charAt(1) === '*') {
        const match = slicedSelector.match(attributeString);

        if (match) {
          result =
            firstChar +
            value.nameGeneratorCounter.generate() +
            match[0] +
            value.nameGeneratorCounter.generate();
        }
      }

      if (attributeSelector.charAt(1) === '^') {
        const match = slicedSelector.match(`^${attributeString}`);

        if (match) {
          result = firstChar + match[0] + value.nameGeneratorCounter.generate(slicedSelector);
        }
      }

      if (attributeSelector.charAt(1) === '$') {
        const match = slicedSelector.match(`${attributeString}$`);

        if (match) {
          result = firstChar + value.nameGeneratorCounter.generate(slicedSelector) + match[0];
        }
      }
    });

    return result;
  } // /replaceAttributeSelector
}

export default new SelectorLibrary();
