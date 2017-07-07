import recast from 'recast';
import traverse from 'ast-traverse';

import selectorLibrary from '../selectorLibrary';
import replaceString from './string';

const replaceJs = (code) => {
  const regex = selectorLibrary.getAll({
    regex: true,
  });

  const ast = recast.parse(code);

  traverse(ast, {
    pre: (node) => {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        // eslint-disable-next-line no-param-reassign
        node.raw = node.raw.replace(node.raw, match => replaceString(match, regex));

        // add whitespaces before and after
        // to make the regex work
        const newValue = ` ${node.value} `;
        const replacedValue = newValue.replace(newValue, match => replaceString(match, regex));

        // eslint-disable-next-line no-param-reassign
        node.value = replacedValue.slice(1, replacedValue.length - 1);
      }
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
