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
        // eslint-disable-next-line no-param-reassign
        node.value = node.raw.slice(1, node.raw.length - 1);
      }
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
