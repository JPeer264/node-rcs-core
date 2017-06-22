import recast from 'recast';
import traverse from 'ast-traverse';

import selectorLibrary from '../options/selectorLibrary';
import replaceString from './string';

/**
 * Parse a javascript code or buffer and returns the modified file. But returns always a string
 *
 * @param  {String | Buffer} code
 *
 * @return {String}
 */
const replaceJs = (code) => {
  const regex = selectorLibrary.getAll({
    origValue: true,
    regex: true,
    isSelectors: false,
  });

  const ast = recast.parse(code);

  traverse(ast, {
    pre: (node) => {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        node.raw = node.raw.replace(node.raw, match => replaceString(match, regex));
        node.value = node.raw.slice(1, node.raw.length - 1);
      }
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
