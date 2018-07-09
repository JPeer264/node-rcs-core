import parse5 from 'parse5';
import traverse from 'parse5-traverse';

import selectorLibrary from '../selectorLibrary';
import replaceJs from './js';

const replaceHtml = (code, options = {}) => {
  let ast = parse5.parse(code, {
    sourceCodeLocationInfo: true,
  });

  if (ast.mode === 'quirks') {
    ast = parse5.parseFragment(code, {
      sourceCodeLocationInfo: true,
    });
  }

  traverse(ast, {
    pre: (node) => {
      // rename <script> tags
      if (node.parentNode && node.parentNode.tagName === 'script') {
        // eslint-disable-next-line no-param-reassign
        node.value = replaceJs(node.value, options.espreeOptions);
      }

      // rename attributes
      if (Array.isArray(node.attrs) && node.attrs.length >= 0) {
        node.attrs.forEach((attr) => {
          let selectorType;

          switch (attr.name) {
            case 'class':
              selectorType = '.';
              break;

            case 'id':
              selectorType = '#';
              break;

            default:
              break;
          }

          // following will replace each whitespace
          // seperated value with its renamed one
          // eslint-disable-next-line no-param-reassign
          attr.value = attr.value
            .split(' ')
            .map(value => (
              // renaming each value
              selectorLibrary
                .get(`${selectorType}${value}`)
                .replace(new RegExp(`^\\${selectorType}`), '')
            ))
            .join(' ');
        });
      }
    },
  });

  return parse5.serialize(ast);
};

export default replaceHtml;
