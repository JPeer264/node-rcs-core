import lex from 'pug-lexer';
import walk from 'pug-walk';
import parser from 'pug-parser';
import wrap from 'pug-runtime/wrap';
import generateCode from 'pug-code-gen';
import generateSource from 'pug-source-gen';
import merge from 'lodash.merge';

import replaceCss from './css';
import replaceJs from './js';
import selectorsLibrary from '../selectorsLibrary';

const shouldTriggerAttribute = (attr, item) => (
  item instanceof RegExp
    ? attr.name.match(new RegExp(item))
    : item === attr.name
);

const replacePug = (code, opts = {}) => {
  const lexed = lex(code);
  const ast = parser(lexed);
  const defaultOptions = {
    espreeOptions: {},
    triggerClassAttributes: [],
    triggerIdAttributes: [],
  };

  const options = merge(opts, defaultOptions);

  walk(ast, (node) => {
    if (node.name === 'script' || node.name === 'style') {
      const modifiedBlockNodes = node.block.nodes.map((block) => {
        if (block.type === 'Code') {
          // eslint-disable-next-line no-param-reassign
          block.type = 'Text';
          // eslint-disable-next-line no-param-reassign
          block.val = `#{${block.val}}`;
        }

        return block;
      });
      const newCode = wrap((
        generateCode((
          { ...node.block, nodes: modifiedBlockNodes }
        ))
      ))();
      const replacedCode = node.name === 'script'
        ? replaceJs(newCode, merge(options.espreeOptions, { sourceFile: opts.sourceFile }))
        : replaceCss(newCode, { sourceFile: opts.sourceFile });

      // add one tab after each new line
      const pugCode = `${node.name}.\n${replacedCode}`.replace(/\n/g, '\n\t');
      const astReplaced = parser(lex(pugCode));
      const scriptBlock = astReplaced.nodes[0].block;

      // do not change entire scriptBlock
      // this might be look like the correct ast,
      // but the begin and end loc numbers are wrong
      // eslint-disable-next-line no-param-reassign
      node.block.nodes = node.block.nodes.map((n, i) => {
        const { val, type } = scriptBlock.nodes[i];

        return { ...n, val, type };
      });
    }

    if (Array.isArray(node.attrs) && node.attrs.length >= 0) {
      node.attrs.forEach((attr) => {
        let selectorType;
        let shouldReplace = false;

        if (
          attr.name === 'class'
          || options.triggerClassAttributes.some((...params) => (
            shouldTriggerAttribute(attr, ...params)
          ))
        ) {
          selectorType = '.';
          shouldReplace = true;
        }

        if (
          attr.name === 'id'
          || options.triggerIdAttributes.some((...params) => (
            shouldTriggerAttribute(attr, ...params)
          ))
        ) {
          selectorType = '#';
          shouldReplace = true;
        }

        if (!shouldReplace) {
          return;
        }

        // attr.val includes ' in the beginning and the end
        // remove them and reattach them after
        const prefix = attr.val.charAt(0);
        const suffix = attr.val.charAt(attr.val.length - 1);
        const val = attr.val.slice(1, (attr.val.length - 1));

        // following will replace each whitespace
        // seperated value with its renamed one
        const replacedVal = val
          .split(' ')
          .map((value) => (
            // renaming each value
            selectorsLibrary
              .get(`${selectorType}${value}`, {
                source: { file: opts.sourceFile, line: node.line, text: '' },
              })
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
