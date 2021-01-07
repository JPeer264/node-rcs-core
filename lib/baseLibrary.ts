import { NameGenerator } from './nameGenerator';
import warnings, { Source } from './allWarnings';

export interface BaseLibraryOptions {
  ignoreAttributeSelectors?: boolean;
  source?: Source;
  isOriginalValue?: boolean;
  preventRandomName?: boolean;
  addSelectorType?: boolean;
  countStats?: boolean;
  getRenamedValues?: boolean;
  regex?: boolean;
}

export class BaseLibrary {
  nameGenerator: NameGenerator;

  values: { [s: string]: string } = {};

  compressedValues: { [s: string]: string } = {};

  reserved: string[] = [];

  excludes: string[] = [];

  excludesRegex: (RegExp | string)[] = [];

  includes: string[] = [];

  includesRegex: (RegExp | string)[] = [];

  prefix = '';

  suffix = '';

  meta: {
    [s: string]: {
      appearanceCount: number;
    };
  } = {};

  static hasReservedValue(value: string, source?: Source): string {
    warnings.append(value, source, 'compressed');

    return `${value}_conflict`;
  }

  constructor(name?: string) {
    this.nameGenerator = new NameGenerator(name);
    // do not call this.reset() directly
    // as it will invoke this.reset on SelectorsLibrary as well
    // where this.selectors is not yet available
    this.initReset();
  }

  // Transform the input value for the one that's stored in the map.
  prefetchValue = (value: string): string => value;

  initReset(): void {
    this.values = {};
    this.compressedValues = {};
    this.reserved = [];
    this.excludes = [];
    this.excludesRegex = [];
    this.includes = [];
    this.includesRegex = [];
    this.prefix = '';
    this.suffix = '';
    this.meta = {};
    this.nameGenerator.reset();
  }

  reset(): void {
    this.initReset();
  }

  // extend methods
  // Shortcut method to change the alphabet of our name generator
  setAlphabet(alphabet: string): void {
    this.nameGenerator.setAlphabet(alphabet);
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  fillLibrary(data: string | Buffer, options?: BaseLibraryOptions): void { }

  // Prepare a value to storing in the mapping. It can be stripped of pseudo-classes,
  // or modified to fit a shorter equivalent value. By default, returns the input unmodified.
  // The replacementObject must contain 2 keys: value and renamedValue.
  // eslint-disable-next-line class-methods-use-this
  prepareValue(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    replacementObject: { value: string; renamedValue: string | undefined },
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    opts: BaseLibraryOptions,
  ): boolean {
    return true;
  }

  // Transform the fetched value before returning.
  // eslint-disable-next-line max-len
  // eslint-disable-next-line class-methods-use-this, no-unused-vars, @typescript-eslint/no-unused-vars
  postfetchValue(value: string, opts?: BaseLibraryOptions): string {
    return value;
  }

  get(value: string, opts: BaseLibraryOptions = {}): string {
    const options: BaseLibraryOptions = {
      isOriginalValue: true,
      countStats: true,
      ...opts,
    };

    // We need the selector's without its decoration (for example, "test" for input ".test")
    const finalValue = this.prefetchValue(value);

    // fail on setted excludes
    if (this.isExcluded(finalValue)) {
      warnings.append(finalValue, opts.source, 'ignoredFound');

      return value;
    }

    if (!this.values[finalValue] && options.isOriginalValue && this.compressedValues[finalValue]) {
      return BaseLibrary.hasReservedValue(value, options.source);
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

      this.meta[finalValue].appearanceCount += 1;
    }

    if (!found) {
      return !options.addSelectorType ? finalValue : value;
    }

    return this.postfetchValue(result, options);
  }

  set(
    value: string | string[],
    renamedValue?: string | BaseLibraryOptions,
    opts: BaseLibraryOptions = {},
  ): void {
    if (!value) {
      return;
    }

    let options = opts;
    let thisRenamedValue: string | undefined;

    if (typeof renamedValue === 'object') {
      options = renamedValue;
      thisRenamedValue = undefined;
    } else {
      thisRenamedValue = renamedValue as string;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => this.set(item, thisRenamedValue, options));

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
  }

  smartAllocate(value: string, renamedValue: string | undefined): void {
    // Try to allocate a random compressed name, and if not possible swap with an existing
    // name to avoid conflict and keep compressed name shorter than the initial value
    let randomName = renamedValue || this.nameGenerator.generate(value);

    // Avoid using an existing or reserved compressed value
    while (this.compressedValues[randomName] || this.isReserved(randomName)) {
      randomName = this.nameGenerator.generate(value);
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
  }

  swap(val1: string, val2: string): void {
    // swap the compressed value for val1 with the compressed value for val2
    if (!this.values[val1] || !this.values[val2]) {
      return;
    }

    // Use object destructuring to swap without a temp variable
    [this.values[val1], this.values[val2]] = [this.values[val2], this.values[val1]];
    [this.meta[val1], this.meta[val2]] = [this.meta[val2], this.meta[val1]];
    [
      this.compressedValues[this.values[val2]],
      this.compressedValues[this.values[val1]],
    ] = [val2, val1];
  }

  setMultiple(values: { [s: string]: string } = {}, options: BaseLibraryOptions = {}): void {
    if (Object.prototype.toString.call(values) !== '[object Object]') {
      return;
    }

    Object.entries(values).forEach((entry) => this.set(entry[0], entry[1], options));
  }

  setPrefix(prefix: string): void {
    if (typeof prefix !== 'string') {
      return;
    }

    this.prefix = prefix;
  }

  setSuffix(suffix: string): void {
    if (typeof suffix !== 'string') {
      return;
    }

    this.suffix = suffix;
  }

  private setInternalLists(
    string: string | RegExp | (string | RegExp)[],
    listPointer: string[],
    regexListPointer: (string | RegExp)[],
  ): void {
    if (!string) return;

    if (Array.isArray(string)) {
      string.forEach((e) => this.setInternalLists(e, listPointer, regexListPointer));

      return;
    }

    // todo jpeer: check if failes
    if (listPointer.includes(string as any) || regexListPointer.includes(string)) {
      return;
    }

    if (string instanceof RegExp) {
      (regexListPointer).push(string);
    } else {
      (listPointer).push(string);
    }
  }

  setExclude(toExclude: string | RegExp | (string | RegExp)[]): void {
    this.setInternalLists(toExclude, this.excludes, this.excludesRegex);
  }

  setInclude(toInclude: string | RegExp | (string | RegExp)[]): void {
    this.setInternalLists(toInclude, this.includes, this.includesRegex);
  }

  setReserved(toReserve: string | string[]): void {
    if (!toReserve) return;

    this.reserved = [];

    if (!Array.isArray(toReserve)) {
      this.reserved.push(toReserve);
    } else {
      this.reserved = [...new Set(toReserve)];
    }
  }

  isReserved(string: string): boolean {
    return this.reserved.includes(string);
  }

  isExcluded(string: string): boolean {
    if (string === '__proto__') {
      // Since this.values['__proto__'] always exists, we mustn't accept this as a renaming
      return true;
    }

    if (this.excludes.includes(string)) {
      if (this.includesRegex.some((includeRegex) => string.match(includeRegex))) {
        return false;
      }

      return !this.includes.includes(string);
    }

    return (
      this.excludesRegex.some((excludeRegex) => (
        string.match(excludeRegex)
        && !this.includesRegex.some((includeRegex) => string.match(includeRegex))
      ))
    );
  }
}

export default new BaseLibrary();
