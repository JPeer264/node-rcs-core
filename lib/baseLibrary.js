import includes from 'array-includes';
import entries from 'object.entries';
import merge from 'lodash.merge';

import nameGenerator from './nameGenerator';

export class BaseLibrary {
  constructor() {
    this.values = {};
    this.compressedValues = {};
    this.reserved = [];
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
    this.meta = {};
  }

  reset() {
    this.values = {};
    this.compressedValues = {};
    this.reserved = [];
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
    this.meta = {};
  } // /reset

  // extend method
  // eslint-disable-next-line class-methods-use-this
  fillLibrary() {
  } // /fillLibrary

  static hasReservedValue(value) {
    // eslint-disable-next-line no-console
    console.warn(`WARNING: '${value}' does not exist beforehand in the rename table,` +
                 ' but appears in the compressed map. Either:');
    // eslint-disable-next-line no-console
    console.warn(`- Create a CSS rule with '${value}' and re-run the process, or`);
    // eslint-disable-next-line no-console
    console.warn('- Add the value to the reserved selectors table so it\'s not used for renaming');
    return `${value}_conflict`;
  } // /hasReservedValue

  get(value, opts = {}) {
    const optionsDefault = {
      isOriginalValue: true,
      countStats: true,
    };

    const options = merge({}, optionsDefault, opts);

    if (!this.values[value] && options.isOriginalValue && this.compressedValues[value]) {
      return BaseLibrary.hasReservedValue(value);
    }

    let result = this.values[value] || value;

    // fail on setted excludes
    if (this.isExcluded(value)) {
      return value;
    }

    // change the objects if isOriginalValue are set to false
    // to get information about the compressed values
    if (!options.isOriginalValue) {
      result = this.compressedValues[value] || result;
    }

    // update stats just when isOriginalValue
    if (options.isOriginalValue && options.countStats) {
      if (!this.meta[value]) {
        this.meta[value] = {
          appearanceCount: 0,
        };
      }

      this.meta[value].appearanceCount = this.meta[value].appearanceCount + 1;
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
    this.meta[value] = {
      appearanceCount: 0,
    };
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

  setReserved(toReserve) {
    if (!toReserve) return;

    this.reserved = [];
    if (!Array.isArray(toReserve)) {
      this.reserved.push(toReserve);
    } else {
      this.reserved = [...new Set(toReserve)];
    }
  } // /setReserved

  isReserved(string) {
    return includes(this.reserved, string);
  }

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
