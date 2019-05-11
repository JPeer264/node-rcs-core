import includes from 'array-includes';
import entries from 'object.entries';
import merge from 'lodash.merge';

import nameGenerator from './nameGenerator';

export class BaseLibrary {
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

  get(value, opts = {}) {
    const optionsDefault = {
      isOriginalValue: true,
    };

    const options = merge({}, optionsDefault, opts);

    let result = this.values[value] || value;

    // fail on setted exludes
    if (this.isExcluded(value)) {
      return value;
    }

    // change the objects if isOriginalValue are set to false
    // to get information about the compressed values
    if (!options.isOriginalValue) {
      result = this.compressedValues[value] || result;
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

    // save variable into this.values and this.compressedValues
    this.values[value] = randomName;
    this.compressedValues[randomName] = value;
  } // /set

  setMultiple(values, options = {}) {
    if (Object.prototype.toString.call(values) !== '[object Object]') {
      return;
    }

    entries(values).forEach(entry => this.set(entry[0], entry[1], options));
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

export default new BaseLibrary();
