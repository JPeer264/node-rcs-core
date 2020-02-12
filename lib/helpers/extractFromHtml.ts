import traverse from 'parse5-traverse';

import htmlToAst from './htmlToAst';

// type: 'script' | 'style'
const extractFromHtml = (code: string, type = 'style'): string[] => {
  const ast = htmlToAst(code);
  const extractedParts: string[] = [];

  traverse(ast, {
    pre: (node: any) => {
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
