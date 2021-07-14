import { parse } from 'postcss';

import cssVariablesLibrary from '../cssVariablesLibrary';
import arrayToRegex from '../helpers/arrayToRegex';
import keyframesLibrary from '../keyframesLibrary';
import selectorsLibrary from '../selectorsLibrary';
import replaceRegex from './regex';

// calls the selectorLibrary.getAttributeSelector internally
// String.replace will call this function and
// get call selectorLibrary.getAttributeSelector directly
const getAttributeSelector = (match: string): string => {
  const re = new RegExp(replaceRegex.commonAttributeSelectors);
  const exec = re.exec(match);

  if (!exec) {
    return match;
  }

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
};

export interface ReplaceCssOptions {
  sourceFile?: string;
  triggerClassAttributes?: string[];
  triggerIdAttributes?: string[];
}

const replaceCss = (css: string | Buffer, opts: ReplaceCssOptions = {}): string => {
  const cssAST = parse(css);

  /* ******************** *
   * replace id selectors *
   * ******************** */
  cssAST.walk((node: any) => {
    const parentName = node.parent.name || '';
    const selectorLib = selectorsLibrary.getIdSelector();
    const source = { file: opts.sourceFile || '', line: node.source.start.line, text: '' };

    if (node.selector && !parentName.match(/keyframes/)) {
      const regex = selectorLib.getAll({ regex: true, addSelectorType: true });

      if (typeof regex !== 'string' && !(regex instanceof RegExp)) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      node.selectors = node.selectors.map((selector: string) => selector
        // split selectors so it is easier to skip non matching selectors
        .split('#')
        .map((splittedSelector) => {
          const splittedSelectorWithDot = `#${splittedSelector}`;
          const prefixFreeSelector = splittedSelectorWithDot.replace(/\\/g, '');

          // prevent returning prefixFreeSelectors
          // when there is not even a match
          if (!prefixFreeSelector.match(regex)) {
            return splittedSelector;
          }

          return prefixFreeSelector
            .replace(regex, (match) => (
              selectorLib.get(match, {
                addSelectorType: true,
                source,
              })
            ))
            .slice(1);
        })
        .join('#'));
    }
  });

  /* *********************** *
   * replace class selectors *
   * *********************** */
  cssAST.walk((node: any) => {
    const parentName = node.parent.name || '';
    const selectorLib = selectorsLibrary.getClassSelector();
    const source = { file: opts.sourceFile || '', line: node.source.start.line, text: '' };

    if (node.selector && !parentName.match(/keyframes/)) {
      const regex = selectorLib.getAll({ regex: true, addSelectorType: true });

      if (typeof regex !== 'string' && !(regex instanceof RegExp)) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      node.selectors = node.selectors.map((selector: string) => selector
        // split selectors so it is easier to skip non matching selectors
        .split('.')
        .map((splittedSelector) => {
          const splittedSelectorWithDot = `.${splittedSelector}`;
          const prefixFreeSelector = splittedSelectorWithDot.replace(/\\/g, '');

          // prevent returning prefixFreeSelectors
          // when there is not even a match
          if (!prefixFreeSelector.match(regex)) {
            return splittedSelector;
          }

          return prefixFreeSelector
            .replace(regex, (match) => (
              selectorLib.get(match, {
                addSelectorType: true,
                source,
              })
            ))
            .slice(1);
        })
        .join('.'));
    }
  });


  /* ***************** *
   * replace keyframes *
   * ***************** */
  cssAST.walkAtRules((node: any) => {
    if (!node.name.match(/keyframes/)) {
      return;
    }

    const source = { file: opts.sourceFile || '', line: node.source.start.line, text: '' };

    // do not count stats, as these are just the declarations
    // eslint-disable-next-line no-param-reassign
    node.params = keyframesLibrary.get(node.params, { countStats: false, source });
  });

  cssAST.walkDecls((node: any) => {
    const source = { file: opts.sourceFile || '', line: node.source.start.line, text: '' };

    /* ************************** *
    * replace css variables var() *
    * *************************** */
    if (node.value.match(replaceRegex.cssVariables)) {
      const regex = arrayToRegex(Object.keys(cssVariablesLibrary.values), (v) => `--${v}`);

      if (regex) {
        // eslint-disable-next-line no-param-reassign
        node.value = node.value.replace(regex, (match: string) => (
          `--${cssVariablesLibrary.get(match.replace(/^--/, ''), { source })}`
        ));
      }
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
        .map((value: string) => (
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
