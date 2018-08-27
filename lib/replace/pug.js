import lex from 'pug-lexer';
import walk from 'pug-walk';
import parser from 'pug-parser';
import wrap from 'pug-runtime/wrap';
import generateCode from 'pug-code-gen';
import generateSource from 'pug-source-gen';
import merge from 'lodash.merge';

import replaceCss from './css';
import replaceJs from './js';
import selectorLibrary from '../selectorLibrary';

const shouldTriggerAttribute = (attr, item) => (
  item instanceof RegExp
    ? attr.name.match(new RegExp(item))
    : item === attr.name
);

const replacePug = (code, opts = {}) => {
  const lexed = lex(code);
  const ast = parser(lexed);
  const defaultOptions = {
    triggerClassAttributes: [],
    triggerIdAttributes: [],
  };

  const options = merge(opts, defaultOptions);

  walk(ast, (node) => {
    if (node.name === 'script' || node.name === 'style') {
      const newCode = wrap(generateCode(node.block))();
      const replacedCode = node.name === 'script'
        ? replaceJs(newCode)
        : replaceCss(newCode);

      // add one tab after each new line
      const pugCode = `${node.name}.\n${replacedCode}`.replace(/\n/g, '\n\t');
      const astReplaced = parser(lex(pugCode));
      const scriptBlock = astReplaced.nodes[0].block;

      // eslint-disable-next-line no-param-reassign
      node.block.nodes = node.block.nodes.map((n, i) => (
        Object.assign({}, n, {
          val: scriptBlock.nodes[i].val,
        })
      ));
    }

    if (Array.isArray(node.attrs) && node.attrs.length >= 0) {
      node.attrs.forEach((attr) => {
        let selectorType;
        let shouldReplace = false;

        if (
          attr.name === 'class' ||
          options.triggerClassAttributes.some((...params) => (
            shouldTriggerAttribute(attr, ...params)
          ))
        ) {
          selectorType = '.';
          shouldReplace = true;
        }

        if (
          attr.name === 'id' ||
          options.triggerIdAttributes.some((...params) => (
            shouldTriggerAttribute(attr, ...params)
          ))
        ) {
          selectorType = '#';
          shouldReplace = true;
        }

        if (!shouldReplace) {
          return;
        }

        const prefix = attr.val.charAt(0);
        const suffix = attr.val.charAt(attr.val.length - 1);
        const val = attr.val.slice(1, (attr.val.length - 1));

        // following will replace each whitespace
        // seperated value with its renamed one
        const replacedVal = val
          .split(' ')
          .map(value => (
            // renaming each value
            selectorLibrary
              .get(`${selectorType}${value}`)
              .replace(new RegExp(`^\\${selectorType}`), '')
          ))
          .join(' ');

        // eslint-disable-next-line no-param-reassign
        attr.val = prefix + replacedVal + suffix;
      });
    }
  });

  return generateSource(ast);
};

export default replacePug;
