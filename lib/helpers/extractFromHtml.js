import traverse from 'parse5-traverse';

import htmlToAst from './htmlToAst';

// type: 'script' | 'style'
const extractFromHtml = (code, type = 'style') => {
  const ast = htmlToAst(code);
  const extractedParts = [];

  traverse(ast, {
    pre: (node) => {
      if (
        node.parentNode
        && node.parentNode.tagName === type
      ) {
        extractedParts.push(node.value);
      }
    },
  });

  return extractedParts;
};

export default extractFromHtml;
