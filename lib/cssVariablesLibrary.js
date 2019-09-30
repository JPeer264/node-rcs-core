import { parse } from 'postcss';

import { BaseLibrary } from './baseLibrary';
import replaceRegex from './replace/regex';

class CssVariablesLibrary extends BaseLibrary {
  constructor() {
    super('variable');
  }

  fillLibrary(data) {
    const code = data.toString();
    const result = parse(code);

    result.walk((root) => {
      if (root.type === 'decl' && root.prop.match(/^--/)) {
        this.set(root.prop);
      }
    });
  } // /fillLibrary

  get(cssVariable, ...params) {
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
    const getCssVariable = super.get(cssVariableSelector, ...params);
    const preparedResult = variableHasDash ? `--${getCssVariable}` : getCssVariable;

    if (isUsedVariable) {
      if (fallback) {
        return `var(${preparedResult}, ${fallback})`;
      }

      return `var(${preparedResult})`;
    }

    return preparedResult;
  }

  set(cssVariable, ...params) {
    if (!cssVariable) {
      return;
    }

    const cssVariableSelector = cssVariable.trim().replace(/^--/, '');

    super.set(cssVariableSelector, ...params);
  }

  get cssVariables() {
    return this.values;
  }

  get compressedCssVariables() {
    return this.compressedValues;
  }

  set cssVariables(cssVariables) {
    this.values = cssVariables;
  }

  set compressedCssVariables(compressedCssVariables) {
    this.compressedValues = compressedCssVariables;
  }
}

export default new CssVariablesLibrary();
