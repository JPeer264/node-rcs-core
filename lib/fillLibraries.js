import keyframesLibrary from './keyframesLibrary';
import selectorLibrary from './selectorLibrary';
import replace from './replace';
import cssVariablesLibrary from './cssVariablesLibrary';

export default (code, opts = {}) => {
  const defaultOptions = {
    ignoreAttributeSelectors: false,
    replaceKeyframes: false,
    prefix: '',
    suffix: '',
  };

  const options = Object.assign({}, defaultOptions, opts);
  const data = code.toString();

  selectorLibrary.setPrefix(options.prefix);
  selectorLibrary.setSuffix(options.suffix);

  cssVariablesLibrary.fillLibrary(data);

  if (!options.ignoreAttributeSelectors) {
    selectorLibrary.setAttributeSelector(data.match(replace.regex.attributeSelectors));
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(data);
  }

  selectorLibrary.fillLibrary(data, options);
};
