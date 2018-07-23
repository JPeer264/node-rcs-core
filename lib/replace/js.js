import recast from 'recast';
import traverse from 'ast-traverse';
import espree from 'espree';
import merge from 'lodash.merge';

import selectorLibrary from '../selectorLibrary';
import replaceString from './string';

const replaceJs = (code, espreeOptions) => {
  const regex = selectorLibrary.getAll({
    regex: true,
  });

  const options = merge(
    {
      ecmaVersion: 9,
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
      if (node.type === 'Literal' && typeof node.value === 'string') {
        // eslint-disable-next-line no-param-reassign
        node.raw = node.raw.replace(node.raw, match => replaceString(match, regex));

        // add whitespaces before and after
        // to make the regex work
        const newValue = ` ${node.value} `;
        const replacedValue = newValue.replace(newValue, match => replaceString(match, regex, ' ', { countStats: false }));

        // eslint-disable-next-line no-param-reassign
        node.value = replacedValue.slice(1, replacedValue.length - 1);
      }
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
