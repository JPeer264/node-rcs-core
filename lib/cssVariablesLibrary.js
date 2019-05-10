import { parse } from 'postcss';

import BaseLibrary from './BaseLibrary';
import replaceRegex from './replace/regex';

class CssVariablesLibrary extends BaseLibrary {
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

    // if var(--variable)
    if (isUsedVariable) {
      const matches = new RegExp(replaceRegex.cssVariables).exec(cssVariable) || [];

      variable = matches[1];
    }

    if (!variable) {
      return cssVariable;
    }

    const cssVariableSelector = variable.trim().replace(/^--/, '');
    const getCssVariable = super.get(cssVariableSelector, ...params);
    const preparedResult = `--${getCssVariable}`;

    if (isUsedVariable) {
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
