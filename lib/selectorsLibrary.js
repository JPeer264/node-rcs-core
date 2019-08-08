import merge from 'lodash.merge';
import idSelectorLibrary from './idSelectorLibrary';
import classSelectorLibrary from './classSelectorLibrary';


// Simple aggregate class to avoid duplicating code dealing with any CSS selector.
class SelectorsLibrary {
  constructor() {
    this.selectors = [idSelectorLibrary, classSelectorLibrary];
  }

  // chain function call with unknown arguments, make our live easier
  callOnBoth(fun, ...args) {
    const ret = [];
    this.selectors.forEach((sel) => {
      const fn = sel[fun];
      if (typeof fn === 'function') {
        const res = fn.apply(sel, args);
        // The number of case where the function is returning something is low and
        // per function specific. Don't be too smart, the caller know betters than us.
        ret.push(res);
        /*
        // Let's deal with merging the return values, it's ugly because there is no generic in JS
        if (typeof res === 'string') {
          // We can't concat string directly since it might not give a correct meaning
          // (like when making regex string, we need a separator). So, instead make it an array
          // and let the caller fix this
          if (ret === undefined) {
            ret = [res];
          } else {
            ret.push(res);
          }
        } else if (ret === undefined) {
          ret = res;
        } else if (Array.isArray(res)) {
          ret.concat(res);
        } else if (typeof res === 'object') {
          Object.keys(res).forEach((key) => { ret[key] = res[key]; });
        }
        */
      }
    });
    return ret;
  }

  reset() {
    return this.callOnBoth('reset');
  }

  getClassSelector() {
    return this.selectors[1];
  }

  getIdSelector() {
    return this.selectors[0];
  }

  fillLibrary(data, opts = {}) {
    return this.callOnBoth('fillLibrary', data, opts);
  }

  set(value, renamedValue, opts = {}) {
    return this.callOnBoth('set', value, renamedValue, opts);
  }

  setMultiple(values, options = {}) {
    return this.callOnBoth('setMultiple', values, options);
  }

  setPrefix(prefix) {
    return this.callOnBoth('setPrefix', prefix);
  }

  setSuffix(suffix) {
    return this.callOnBoth('setSuffix', suffix);
  }

  getSuffix() {
    return this.selectors[0].suffix;
  }

  getPrefix() {
    return this.selectors[0].prefix;
  }

  setExclude(toExclude) {
    return this.callOnBoth('setExclude', toExclude);
  }

  setReserved(toReserve) {
    return this.callOnBoth('setReserved', toReserve);
  }

  setAttributeSelectorForData(data) {
    this.selectors.forEach(sel =>
        sel.setAttributeSelector(data.match(sel.getAtttributeSelectorRegex())));
  }

  // With return values, specific logic

  getAllRegex(opts = {}) {
    const ret = this.callOnBoth('getAll', merge({ regex: true }, opts));
    return ret.filter(x => typeof x === 'string' && x.length > 0).join('|');
  }

  get(value, opts = {}) {
    const hasType = (value.charAt(0) === '.' || value.charAt(0) === '#');
    if (!hasType) {
      const ret = this.selectors[0].get(value, opts);
      return ret === value ? this.selectors[1].get(value, opts) : ret;
    }

    if (this.selectors[0].isValidSelector(value)) {
      return this.selectors[0].get(value, opts);
    }
    return this.selectors[1].get(value, opts);
  }

  // If it's reserved in any case, consider it reserved everywhere
  isReserved(string) {
    const ret = this.callOnBoth('isReserved', string);
    return ret[0] || ret[1];
  }

  // If it's excluded in any case, consider it excluded everywhere
  isExcluded(string) {
    const ret = this.callOnBoth('isExcluded', string);
    return ret[0] || ret[1];
  }
}

export default new SelectorsLibrary();
