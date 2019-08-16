import recast from 'recast';
import traverse from 'ast-traverse';
import espree from 'espree';
import merge from 'lodash.merge';

import selectorsLibrary from '../selectorsLibrary';
import replaceString from './string';
import cssVariablesLibrary from '../cssVariablesLibrary';
import allRegex from './regex';

const makeSource = (node, file) => {
  const Position = node.loc.start.constructor;
  const currentLine = node.loc.start.line;
  const sourceLine = node.loc.lines.sliceString(new Position(currentLine, 0),
                      new Position(currentLine, node.loc.lines.getLineLength(currentLine)));
  return { file, line: currentLine, text: sourceLine };
};

const replaceJs = (code, espreeOptions) => {
  // We can only use the common regex if we don't care about specific class/id processing
  const regex = selectorsLibrary.getAllRegex();

  const options = merge(
    {
      ecmaVersion: 10,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    espreeOptions,
  );

  const ast = recast.parse(code, {
    parser: {
      parse: source => (
        espree.parse(source, {
          ...options,
          range: true,
          loc: true,
          comment: true,
          attachComment: true,
          tokens: true,
        })
      ),
    },
  });

  const isJSX = options.ecmaFeatures.jsx;

  traverse(ast, {
    pre: (node) => {
      // Avoid recursing into a "in" node since it can't be a CSS class or variable.
      if (node.type === 'BinaryExpression' && node.operator === 'in') {
        return false;
      }

      if (node.type === 'TemplateElement' && 'raw' in node.value) {
        const source = makeSource(node, options.sourceFile);
        // eslint-disable-next-line
        const raw = node.value.raw.replace(allRegex.templateSelectors, function (txt, p1, p2, p3) {
          // p3 contains the content of the class=' or id=", so let's replace them
          const newValue = ` ${p3} `;
          const selectorLib = p1 === 'class' ? selectorsLibrary.getClassSelector()
                                             : selectorsLibrary.getIdSelector();
          const replacedAttr = newValue.replace(newValue, match =>
            replaceString(match, selectorLib.getAll({ regex: true }),
              // don't be too smart about selector detection and non replacement if we have 
              // a class, since class="a b" should replace both entry here even if it looks like 
              // a selector text for parent child tags
                          { isJSX: p1 === 'class' || isJSX, countStats: false, source }));
          // eslint-disable-next-line
          return p1 + '=' + p2 + replacedAttr.slice(1, replacedAttr.length - 1) + p2;
        });

        // eslint-disable-next-line no-param-reassign
        node.value.raw = raw;
      } else if (node.type === 'Literal' && typeof node.value === 'string') {
        const source = makeSource(node, options.sourceFile);
        // eslint-disable-next-line no-param-reassign
        node.raw = node.raw.replace(node.raw,
                    match => replaceString(match, regex, { isJSX, source }));

        // add whitespaces before and after
        // to make the regex work
        const newValue = ` ${node.value} `;
        // replace css selectors
        const replacedCssSelectors = newValue.replace(newValue, match =>
          replaceString(match, regex, { isJSX, countStats: false, source }));
        // replace css variables
        const replacedCssVariables = replacedCssSelectors.replace(allRegex.cssVariables,
          match => (cssVariablesLibrary.get(match, { source })),
        );

        // eslint-disable-next-line no-param-reassign
        node.value = replacedCssVariables.slice(1, replacedCssVariables.length - 1);
      }

      return true;
    },
  });

  return recast.print(ast).code;
};

export default replaceJs;
