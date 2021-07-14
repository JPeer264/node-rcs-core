import { AttributeLibrary } from './attributeLibrary';
import idSelectorLibrary, { IdSelectorLibrary } from './idSelectorLibrary';
import classSelectorLibrary, { ClassSelectorLibrary } from './classSelectorLibrary';
import { BaseLibrary, BaseLibraryOptions } from './baseLibrary';
import arrayToRegex from './helpers/arrayToRegex';

// Simple aggregate class to avoid duplicating code dealing with any CSS selector.
export class SelectorsLibrary extends BaseLibrary {
  selectors = [idSelectorLibrary, classSelectorLibrary];

  // chain function call with unknown arguments, make our live easier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callOnBoth<T extends(...args: any) => any>(fun: string, ...args: Parameters<T>): ReturnType<T>[] {
    const result: ReturnType<T>[] = (
      this.selectors.reduce<ReturnType<T>[]>((prev, sel) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fn: T | undefined = (sel as any)[fun];

        if (typeof fn === 'function') {
          const res: ReturnType<T> = fn.apply(sel, args);
          // The number of case where the function is returning something is low and
          // per function specific. Don't be too smart, the caller know betters than us.
          return [
            ...prev,
            res,
          ];
        }

        return prev;
      }, [])
    );

    return result;
  }

  reset(): ReturnType<BaseLibrary['fillLibrary']> {
    this.callOnBoth<BaseLibrary['reset']>('reset');
  }

  setAlphabet(...args: Parameters<BaseLibrary['setAlphabet']>): ReturnType<BaseLibrary['setAlphabet']> {
    this.callOnBoth<BaseLibrary['setAlphabet']>('setAlphabet', ...args);
  }

  getClassSelector(): ClassSelectorLibrary {
    return this.selectors[1];
  }

  getIdSelector(): IdSelectorLibrary {
    return this.selectors[0];
  }

  fillLibrary(...args: Parameters<BaseLibrary['fillLibrary']>): ReturnType<BaseLibrary['fillLibrary']> {
    this.callOnBoth<BaseLibrary['fillLibrary']>('fillLibrary', ...args);
  }

  set(...args: Parameters<BaseLibrary['set']>): ReturnType<BaseLibrary['set']> {
    this.callOnBoth<BaseLibrary['set']>('set', ...args);
  }

  setMultiple(...args: Parameters<BaseLibrary['setMultiple']>): ReturnType<BaseLibrary['setMultiple']> {
    this.callOnBoth<BaseLibrary['setMultiple']>('setMultiple', ...args);
  }

  setPrefix(...args: Parameters<BaseLibrary['setPrefix']>): ReturnType<BaseLibrary['setPrefix']> {
    this.callOnBoth<BaseLibrary['setPrefix']>('setPrefix', ...args);
  }

  setSuffix(...args: Parameters<BaseLibrary['setSuffix']>): ReturnType<BaseLibrary['setSuffix']> {
    this.callOnBoth<BaseLibrary['setSuffix']>('setSuffix', ...args);
  }

  getSuffix(): string {
    return this.selectors[0].suffix;
  }

  getPrefix(): string {
    return this.selectors[0].prefix;
  }

  setExclude(...args: Parameters<BaseLibrary['setExclude']>): ReturnType<BaseLibrary['setExclude']> {
    this.callOnBoth<BaseLibrary['setExclude']>('setExclude', ...args);
  }

  setInclude(...args: Parameters<BaseLibrary['setInclude']>): ReturnType<BaseLibrary['setInclude']> {
    this.callOnBoth<BaseLibrary['setInclude']>('setInclude', ...args);
  }

  setReserved(...args: Parameters<BaseLibrary['setReserved']>): ReturnType<BaseLibrary['setReserved']> {
    this.callOnBoth<BaseLibrary['setReserved']>('setReserved', ...args);
  }

  setAttributeSelector(data: string | string[]): void {
    if (Array.isArray(data)) {
      data.forEach((value) => this.setAttributeSelector(value));

      return;
    }

    this.selectors.forEach((sel) => {
      const matches = data.match(sel.getAttributeSelectorRegex());

      if (matches) {
        sel.setAttributeSelector(matches);
      }
    });
  }

  replaceAttributeSelector(selector: string): string | false {
    let ret: ReturnType<SelectorsLibrary['replaceAttributeSelector']> = false;

    this.selectors.forEach((sel) => {
      if (sel.isValidSelector(selector)) {
        const res = sel.replaceAttributeSelector(selector);

        ret = res ? sel.selectorFirstChar() + res : res;
      }
    });

    return ret;
  }

  // With return values, specific logic
  getAllRegex(opts: BaseLibraryOptions = {}): RegExp {
    const options: BaseLibraryOptions = {
      regex: true,
      ...opts,
    };

    const ret = this.callOnBoth('getAll', options);

    // null assertion to keep the same functionality
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return arrayToRegex(ret.filter(Boolean).map((x) => x.source))!;
  }

  get(value: string, opts: BaseLibraryOptions = {}): string {
    const stringifyLineBreaks = value.replace(/\n/g, '\\n');
    const [beginningWhitespace] = stringifyLineBreaks.match(/^(\\.| )+/) || [''];
    const [endWhitespace] = stringifyLineBreaks.match(/(\\.| )+$/) || [''];
    const modifiedValue = stringifyLineBreaks.replace(beginningWhitespace, '').replace(endWhitespace, '');
    const hasType = AttributeLibrary.isSelector(modifiedValue);

    const reconstructValue = (v: string): string => (
      (beginningWhitespace + v + endWhitespace).replace(/\\n/g, '\n')
    );

    if (!hasType) {
      const ret = this.selectors[0].get(modifiedValue, opts);

      return reconstructValue((
        ret === modifiedValue
          ? this.selectors[1].get(modifiedValue, opts)
          : ret
      ));
    }

    if (this.selectors[0].isValidSelector(modifiedValue)) {
      return reconstructValue(this.selectors[0].get(modifiedValue, opts));
    }

    return reconstructValue(this.selectors[1].get(modifiedValue, opts));
  }

  // If it's reserved in any case, consider it reserved everywhere
  isReserved(...args: Parameters<BaseLibrary['isReserved']>): ReturnType<BaseLibrary['isReserved']> {
    const ret = this.callOnBoth<BaseLibrary['isReserved']>('isReserved', ...args);

    return ret[0] || ret[1];
  }

  // If it's excluded in any case, consider it excluded everywhere
  isExcluded(...args: Parameters<BaseLibrary['isExcluded']>): ReturnType<BaseLibrary['isExcluded']> {
    const ret = this.callOnBoth<BaseLibrary['isExcluded']>('isExcluded', ...args);

    return ret[0] || ret[1];
  }
}

export default new SelectorsLibrary();
