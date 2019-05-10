import includes from 'array-includes';
import entries from 'object.entries';
import merge from 'lodash.merge';

import nameGenerator from './nameGenerator';

class BaseLibrary {
  constructor() {
    this.values = {};
    this.compressedValues = {};
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
  }

  reset() {
    this.values = {};
    this.compressedValues = {};
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
  } // /reset

  // extend method
  // eslint-disable-next-line class-methods-use-this
  fillLibrary() {
  } // /fillLibrary

  get(selector, opts = {}) {
    const optionsDefault = {
      originalValue: true,
    };

    const options = merge({}, optionsDefault, opts);

    let result = this.values[selector] || selector;

    // fail on setted exludes
    if (this.isExcluded(selector)) {
      return selector;
    }

    // change the objects if originalValue are set to false
    // to get information about the compressed values
    if (!options.originalValue) {
      result = this.compressedValues[selector] || result;
    }

    return result;
  } // /get

  set(value, renamedValue) {
    if (!value) {
      return;
    }

    // call recursive if it is an array
    if (Object.prototype.toString.call(value) === '[object Array]') {
      value.forEach(item => this.set(item, renamedValue));

      return;
    }

    // skip excludes
    if (this.isExcluded(value)) {
      return;
    }

    // checks if this value was already set
    if (this.values[value]) {
      return;
    }

    const randomName = renamedValue || nameGenerator.generate();

    // save css selector into this.selectors and this.compressedSelectors
    this.values[value] = randomName;
    this.compressedValues[randomName] = value;
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
}

export default BaseLibrary;
