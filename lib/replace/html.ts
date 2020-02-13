import parse5 from 'parse5';
import traverse from 'parse5-traverse';
import merge from 'lodash.merge';
import shouldTriggerAttribute, { Attr } from '../helpers/shouldTriggerAttribute';

import selectorsLibrary from '../selectorsLibrary';
import replaceJs from './js';
import replaceCss from './css';
import htmlToAst from '../helpers/htmlToAst';

// todo jpeer: update options
export type EspreeOptions = any;

export interface ReplaceHtmlOptions {
  sourceFile?: string;
  espreeOptions?: EspreeOptions;
  triggerClassAttributes?: string[];
  triggerIdAttributes?: string[];
}

const replaceHtml = (code: string, opts: ReplaceHtmlOptions = {}): string => {
  const defaultOptions = {
    espreeOptions: {},
    triggerClassAttributes: [],
    triggerIdAttributes: [],
  };

  const options = merge({}, opts, defaultOptions);
  const ast = htmlToAst(code);
  const srcOpt = { sourceFile: opts.sourceFile };

  traverse(ast, {
    // todo jpeer: check correct type
    pre: (node: any) => {
      // rename <script> tags
      if (
        node.parentNode
        && node.parentNode.tagName === 'script'
      ) {
        const hasAnyAttrs = node.parentNode.attrs.length === 0;
        const hasType = node.parentNode.attrs.some((attr: Attr) => attr.name === 'type');
        const hasTypeAndJavaScript = (
          node.parentNode.attrs.some((attr: Attr) => (
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
          node.value = replaceJs(node.value, merge({}, options.espreeOptions, srcOpt));
        }
      }

      // rename <style> tags
      if (node.parentNode && node.parentNode.tagName === 'style') {
        // eslint-disable-next-line no-param-reassign
        node.value = replaceCss(node.value, srcOpt);
      }

      // rename attributes
      if (Array.isArray(node.attrs) && node.attrs.length >= 0) {
        node.attrs.forEach((attr: Attr) => {
          let selectorType: string;

          if (
            attr.name === 'class'
            || options.triggerClassAttributes.some((item) => (
              shouldTriggerAttribute(attr, item)
            ))
          ) {
            selectorType = '.';
          }

          if (
            attr.name === 'id'
            || options.triggerIdAttributes.some((item) => (
              shouldTriggerAttribute(attr, item)
            ))
          ) {
            selectorType = '#';
          }

          if (node.tagName === 'label' && attr.name === 'for') {
            selectorType = '#';
          }


          // following will replace each whitespace
          // seperated value with its renamed one
          // eslint-disable-next-line no-param-reassign
          attr.value = attr.value
            .split(' ')
            .map((value) => (
              // renaming each value
              selectorsLibrary
                .get(`${selectorType}${value}`, {
                  source: {
                    file: opts.sourceFile || '',
                    line: node.sourceCodeLocation.startLine,
                    text: '',
                  },
                })
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
