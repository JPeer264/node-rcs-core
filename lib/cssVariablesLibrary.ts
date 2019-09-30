import { parse } from 'postcss';

import { BaseLibrary, BaseLibraryOptions } from './baseLibrary';
import replaceRegex from './replace/regex';

export class CssVariablesLibrary extends BaseLibrary {
  constructor() {
    super('variable');
  }

  fillLibrary(data: string | Buffer): void {
    const code = data.toString();
    const result = parse(code);

    result.walk((root) => {
      if (root.type === 'decl' && root.prop.match(/^--/)) {
        this.set(root.prop);
      }
    });
  }

  get(cssVariable: string, opts: BaseLibraryOptions = {}): string {
    const isUsedVariable = new RegExp(replaceRegex.cssVariables).test(cssVariable);
    let variable = cssVariable;
    let fallback = '';

    // if var(--variable)
    if (isUsedVariable) {
      const matches = new RegExp(replaceRegex.cssVariables).exec(cssVariable) || [];

      if (matches[2]) {
        fallback = this.get(matches[2]);
      }

      [, variable] = matches;
    }

    if (!variable) {
      return cssVariable;
    }

    const variableHasDash = new RegExp(/^--/).test(variable.trim());
    const cssVariableSelector = variable.trim().replace(/^--/, '');
    const getCssVariable = super.get(cssVariableSelector, opts);
    const preparedResult = variableHasDash ? `--${getCssVariable}` : getCssVariable;

    if (isUsedVariable) {
      if (fallback) {
        return `var(${preparedResult}, ${fallback})`;
      }

      return `var(${preparedResult})`;
    }

    return preparedResult;
  }

  set(...args: Parameters<BaseLibrary['set']>): void {
    const [cssVariable, ...params] = args;

    if (!cssVariable) {
      return;
    }

    if (Array.isArray(cssVariable)) {
      cssVariable.forEach((item) => this.set(item, ...params));

      return;
    }

    const cssVariableSelector = cssVariable.trim().replace(/^--/, '');

    super.set(cssVariableSelector, ...params);
  }

  get cssVariables(): { [s: string]: string } {
    return this.values;
  }

  set cssVariables(cssVariables) {
    this.values = cssVariables;
  }

  get compressedCssVariables(): { [s: string]: string } {
    return this.compressedValues;
  }

  set compressedCssVariables(compressedCssVariables) {
    this.compressedValues = compressedCssVariables;
  }
}

export default new CssVariablesLibrary();
