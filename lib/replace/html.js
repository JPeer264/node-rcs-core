import parse5 from 'parse5';
import traverse from 'parse5-traverse';
import merge from 'lodash.merge';

import selectorLibrary from '../selectorLibrary';
import replaceJs from './js';
import replaceCss from './css';
import htmlToAst from '../helpers/htmlToAst';

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
  const ast = htmlToAst(code);

  traverse(ast, {
    pre: (node) => {
      // rename <script> tags
      if (
        node.parentNode
        && node.parentNode.tagName === 'script'
      ) {
        const hasAnyAttrs = node.parentNode.attrs.length === 0;
        const hasType = node.parentNode.attrs.some(attr => attr.name === 'type');
        const hasTypeAndJavaScript = (
          node.parentNode.attrs.some(attr => (
            attr.name === 'type'
            && (
              attr.value === 'application/javascript'
              || attr.value === 'module'
            )
          ))
        );

        // should just go inside if it is either
        // no type
        // type set to application/json || module
        if (hasAnyAttrs || !hasType || hasTypeAndJavaScript) {
          // eslint-disable-next-line no-param-reassign
          node.value = replaceJs(node.value, options.espreeOptions);
        }
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
