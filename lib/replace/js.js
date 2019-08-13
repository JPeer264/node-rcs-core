import recast from 'recast';
import traverse from 'ast-traverse';
import espree from 'espree';
import merge from 'lodash.merge';

import selectorsLibrary from '../selectorsLibrary';
import replaceString from './string';
import cssVariablesLibrary from '../cssVariablesLibrary';
import allRegex from './regex';

const replaceJs = (code, espreeOptions) => {
  // We can only use the common regex if we don't care about specific class/id processing
  const regex = selectorsLibrary.getAllRegex();

  const options = merge(
    {
      ecmaVersion: 10,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    espreeOptions,
  );

  const ast = recast.parse(code, {
    parser: {
      parse: source => (
        espree.parse(source, {
          ...options,
          range: true,
          loc: true,
          comment: true,
          attachComment: true,
          tokens: true,
        })
      ),
    },
  });

  traverse(ast, {
    pre: (node) => {
      // Avoid recursing into a "in" node since it can't be a CSS class or variable.
      if (node.type === 'BinaryExpression' && node.operator === 'in') {
        return false;
      }

      if (node.type === 'TemplateElement' && 'raw' in node.value) {
        // eslint-disable-next-line
        const raw = node.value.raw.replace(allRegex.templateSelectors, function (txt, p1, p2, p3) {
          // p3 contains the content of the class=' or id=", so let's replace them
          const newValue = ` ${p3} `;
          const selectorLib = p1 === 'class' ? selectorsLibrary.getClassSelector()
                                             : selectorsLibrary.getIdSelector();
          const replacedAttr = newValue.replace(newValue, match =>
            replaceString(match, selectorLib.getAll({ regex: true }), ' ', { countStats: false }));
          // eslint-disable-next-line
          return p1 + '=' + p2 + replacedAttr.slice(1, replacedAttr.length - 1) + p2;
        });

        // eslint-disable-next-line no-param-reassign
        node.value.raw = raw;
      } else if (node.type === 'Literal' && typeof node.value === 'string') {
        // eslint-disable-next-line no-param-reassign
        node.raw = node.raw.replace(node.raw, match => replaceString(match, regex));

        // add whitespaces before and after
        // to make the regex work
        const newValue = ` ${node.value} `;
        // replace css selectors
        const replacedCssSelectors = newValue.replace(newValue, match => replaceString(match, regex, ' ', { countStats: false }));
        // replace css variables
        const replacedCssVariables = replacedCssSelectors.replace(allRegex.cssVariables, match => (
          cssVariablesLibrary.get(match)
        ));

        // eslint-disable-next-line no-param-reassign
        node.value = replacedCssVariables.slice(1, replacedCssVariables.length - 1);
      }

      return true;
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
