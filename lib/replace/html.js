import parse5 from 'parse5';
import traverse from 'parse5-traverse';
import merge from 'lodash.merge';

import selectorLibrary from '../selectorLibrary';
import replaceJs from './js';
import replaceCss from './css';

const shouldTriggerAttribute = (attr, item) => (
  item instanceof RegExp
    ? attr.name.match(new RegExp(item))
    : item === attr.name
);

const replaceHtml = (code, opts = {}) => {
  const defaultOptions = {
    espreeOptions: {},
    triggerClassAttributes: [],
    triggerIdAttributes: [],
  };

  const options = merge(opts, defaultOptions);

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

      // rename <style> tags
      if (node.parentNode && node.parentNode.tagName === 'style') {
        // eslint-disable-next-line no-param-reassign
        node.value = replaceCss(node.value);
      }

      // rename attributes
      if (Array.isArray(node.attrs) && node.attrs.length >= 0) {
        node.attrs.forEach((attr) => {
          let selectorType;

          if (
            attr.name === 'class' ||
            options.triggerClassAttributes.some((...params) => (
              shouldTriggerAttribute(attr, ...params)
            ))
          ) {
            selectorType = '.';
          }

          if (
            attr.name === 'id' ||
            options.triggerIdAttributes.some((...params) => (
              shouldTriggerAttribute(attr, ...params)
            ))
          ) {
            selectorType = '#';
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
