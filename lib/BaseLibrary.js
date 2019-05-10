import includes from 'array-includes';
import entries from 'object.entries';

class BaseLibrary {
  constructor() {
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
  }

  reset() {
    this.excludes = [];
    this.excludesRegex = [];
    this.prefix = '';
    this.suffix = '';
  } // /reset

  // extend method
  // eslint-disable-next-line
  fillLibrary(data, options = {}) {
  } // /fillLibrary

  // extend method
  // eslint-disable-next-line
  get(selector, opts = {}) {
  } // /get

  // extend method
  // eslint-disable-next-line
  set(value, renamedSelector, opts = {}) {
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
