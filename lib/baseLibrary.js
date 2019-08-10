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

  // extend methods
  // eslint-disable-next-line class-methods-use-this
  fillLibrary() {
  } // /fillLibrary

  // Prepare a value to storing in the mapping. It can be stripped of pseudo-classes,
  // or modified to fit a shorter equivalent value. By default, returns the input unmodified.
  // The replacementObject must contain 2 keys: value and renamedValue.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  prepareValue(replacementObject, opts) {
    return true;
  } // /prepareValue

  // Transform the input value for the one that's stored in the map.
  // eslint-disable-next-line class-methods-use-this
  prefetchValue(value) {
    return value;
  }

  // Transform the fetched value before returning.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  postfetchValue(value, opts) {
    return value;
  }


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
    // We need the selector's without its decoration (for example, "test" for input ".test")
    const finalValue = this.prefetchValue(value);

    // fail on setted excludes
    if (this.isExcluded(finalValue)) {
      return value;
    }

    if (!this.values[finalValue] && options.isOriginalValue && this.compressedValues[finalValue]) {
      return BaseLibrary.hasReservedValue(value);
    }

    let found = finalValue in this.values;
    let result = this.values[finalValue] || finalValue;

    // change the objects if isOriginalValue are set to false
    // to get information about the compressed values
    if (!options.isOriginalValue) {
      found = finalValue in this.compressedValues;
      result = this.compressedValues[finalValue] || result;
    }

    // update stats just when isOriginalValue
    if (options.isOriginalValue && options.countStats) {
      if (!this.meta[finalValue]) {
        this.meta[finalValue] = {
          appearanceCount: 0,
        };
      }

      this.meta[finalValue].appearanceCount = this.meta[finalValue].appearanceCount + 1;
    }

    if (!found) {
      return value;
    }

    return this.postfetchValue(result, options);
  } // /get

  set(value, renamedValue, opts = {}) {
    if (!value) {
      return;
    }

    let options = opts;
    let thisRenamedValue = renamedValue;

    if (typeof thisRenamedValue === 'object') {
      options = thisRenamedValue;
      thisRenamedValue = undefined;
    }


    // call recursive if it is an array
    if (Object.prototype.toString.call(value) === '[object Array]') {
      value.forEach(item => this.set(item, thisRenamedValue, options));

      return;
    }

    const repObj = { value, renamedValue: thisRenamedValue };
    if (!this.prepareValue(repObj, options)) {
      return;
    }

    // skip excludes
    if (this.isExcluded(repObj.value)) {
      return;
    }

    // checks if this value was already set
    if (this.values[repObj.value]) {
      return;
    }

    if (options.preventRandomName === true) {
      this.values[repObj.value] = repObj.value;
      this.compressedValues[repObj.value] = repObj.value;
      this.meta[repObj.value] = { appearanceCount: 0 };
      return;
    }

    this.smartAllocate(repObj.value, repObj.renamedValue);
  } // /set

  smartAllocate(value, renamedValue) {
    // Try to allocate a random compressed name, and if not possible swap with an existing
    // name to avoid conflict and keep compressed name shorter than the initial value
    let randomName = renamedValue || nameGenerator.generate();

    // Avoid using an existing or reserved compressed value
    while (this.compressedValues[randomName] || this.isReserved(randomName)) {
      randomName = nameGenerator.generate();
    }

    this.values[value] = randomName;
    this.meta[value] = {
      appearanceCount: 0,
    };
    this.compressedValues[randomName] = value;

    // Ensure it's optimal (it does not exist in the compressed name already and is shorter
    // than the actual value).
    // Example if not the case: values = {'move':'a'}, compValue = {'a':'move'}
    // allocating new value 'a' for (generated) 'ab'
    // We expect values = {'move': 'ab', 'a': 'a'}, compValue = {'a': 'a', 'ab': 'move'}
    if (this.compressedValues[value] || randomName.length > value.length) {
      this.swap(value, this.compressedValues[value]);
    }
  } // /smartAllocate

  swap(val1, val2) {
    // swap the compressed value for val1 with the compressed value for val2
    if (!this.values[val1] || !this.values[val2]) {
      return;
    }

    // Use object destructuring to swap without a temp variable
    [this.values[val1], this.values[val2]] = [this.values[val2], this.values[val1]];
    [this.meta[val1], this.meta[val2]] = [this.meta[val2], this.meta[val1]];
    [this.compressedValues[this.values[val2]], this.compressedValues[this.values[val1]]] =
      [val2, val1];
  } // /swap

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
