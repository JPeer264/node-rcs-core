import { parse } from 'postcss';

import cssVariablesLibrary from '../cssVariablesLibrary';
import keyframesLibrary from '../keyframesLibrary';
import selectorsLibrary from '../selectorsLibrary';
import replaceRegex from './regex';

const extractCssVariables = (value) => {
  const regexMatches = value.match(new RegExp(replaceRegex.cssVariables));

  let matches = [];

  if (regexMatches) {
    regexMatches.forEach((matchWithVariables) => {
      const cssVariableMatch = new RegExp(replaceRegex.cssVariables).exec(matchWithVariables);

      matches = [...matches, cssVariableMatch[1]];

      if (cssVariableMatch[2]) {
        const innerMatches = extractCssVariables(cssVariableMatch[2]);

        matches = [...matches, ...innerMatches];
      }
    });
  }

  return [...(new Set(matches))];
};

// calls the selectorLibrary.getAttributeSelector internally
// String.replace will call this function and
// get call selectorLibrary.getAttributeSelector directly
const getAttributeSelector = (match) => {
  const re = new RegExp(replaceRegex.commonAttributeSelectors);
  const exec = re.exec(match);
  const stringChar = exec[3].charAt(0);
  const stringWithoutStringChars = exec[3].slice(1, exec[3].length - 1);

  let result = match;
  let newString = exec[3];

  const suffix = selectorsLibrary.getSuffix();
  const prefix = selectorsLibrary.getPrefix();

  if (exec[2] === '$') {
    newString = stringChar + stringWithoutStringChars + suffix + stringChar;
  }

  if (exec[2] === '^') {
    newString = stringChar + prefix + stringWithoutStringChars + stringChar;
  }

  result = result.replace(replaceRegex.strings, newString);

  return result;
}; // /getCssSelector

const replaceCss = (css, opts = {}) => {
  const cssAST = parse(css);

  /* ******************** *
   * replace id selectors *
   * ******************** */
  cssAST.walk((node) => {
    const parentName = node.parent.name || '';
    const selectorLib = selectorsLibrary.getIdSelector();
    const source = { file: opts.sourceFile, line: node.source.start.line, text: '' };

    if (node.selector && !parentName.match(/keyframes/)) {
      const regex = selectorLib.getAll({ regex: true, addSelectorType: true });
      // eslint-disable-next-line no-param-reassign
      node.selectors = node.selectors.map((selector) => {
        const prefixFreeSelector = selector.replace(/\\/g, '');

        return prefixFreeSelector.replace(regex, (match) => (
          selectorLib.get(match, {
            addSelectorType: true,
            source,
          })
        ));
      });
    }
  });

  /* *********************** *
   * replace class selectors *
   * *********************** */
  cssAST.walk((node) => {
    const parentName = node.parent.name || '';
    const selectorLib = selectorsLibrary.getClassSelector();
    const source = { file: opts.sourceFile, line: node.source.start.line, text: '' };

    if (node.selector && !parentName.match(/keyframes/)) {
      const regex = selectorLib.getAll({ regex: true, addSelectorType: true });
      // eslint-disable-next-line no-param-reassign
      node.selectors = node.selectors.map((selector) => {
        const prefixFreeSelector = selector.replace(/\\/g, '');

        return prefixFreeSelector.replace(regex, (match) => (
          selectorLib.get(match, {
            addSelectorType: true,
            source,
          })
        ));
      });
    }
  });


  /* ***************** *
   * replace keyframes *
   * ***************** */
  cssAST.walkAtRules((node) => {
    if (!node.name.match(/keyframes/)) {
      return;
    }

    const source = { file: opts.sourceFile, line: node.source.start.line, text: '' };

    // do not count stats, as these are just the declarations
    // eslint-disable-next-line no-param-reassign
    node.params = keyframesLibrary.get(node.params, { countStats: false, source });
  });

  cssAST.walkDecls((node) => {
    const source = { file: opts.sourceFile, line: node.source.start.line, text: '' };

    /* ************************** *
    * replace css variables var() *
    * *************************** */
    if (node.value.match(replaceRegex.cssVariables)) {
      const matches = extractCssVariables(node.value);

      // eslint-disable-next-line no-param-reassign
      node.value = node.value.replace(new RegExp(matches.join('|'), 'g'), (match) => (
        cssVariablesLibrary.get(match, { source })
      ));
    }

    /* ******************************************** *
    * replace css variable declarations --variable: *
    * ********************************************* */
    if (node.type === 'decl' && node.prop.match('^--')) {
      // do not count stats, as these are just the declarations
      // eslint-disable-next-line no-param-reassign
      node.prop = cssVariablesLibrary.get(node.prop, { countStats: false, source });
    }

    /* ***************** *
    * replace animations *
    * ****************** */
    if (node.prop.match(/(animation|animation-name)/)) {
      // eslint-disable-next-line no-param-reassign
      node.value = node.value
        .replace(',', ' , ')
        .split(' ')
        .map((value) => (
          keyframesLibrary.get(value, { source })
        ))
        .join(' ')
        .replace(' , ', ',');
    }
  });

  /* *************************** *
   * replace attribute selectors *
   * *************************** */
  cssAST.walkRules((node) => {
    // We avoid doing 2 regexp search here by using a combined regular expression
    // This is an optimization since the processing is the same for class or id
    // eslint-disable-next-line no-param-reassign
    node.selector = node.selector.replace(replaceRegex.commonAttributeSelectors, (match) => (
      getAttributeSelector(match)
    ));
  });

  return cssAST.toResult().css;
};

export default replaceCss;
