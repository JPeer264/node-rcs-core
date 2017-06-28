import keyframesLibrary from './keyframesLibrary';
import selectorLibrary from './selectorLibrary';
import replace from './replace';

export default (code, opts = {}) => {
  const defaultOptions = {
    ignoreAttributeSelector: false,
    replaceKeyframes: false,
    prefix: '',
    suffix: '',
  };

  const options = Object.assign({}, defaultOptions, opts);
  const data = code.toString();

  selectorLibrary.setPrefix(options.prefix);
  selectorLibrary.setSuffix(options.suffix);

  if (!options.ignoreAttributeSelector) {
    selectorLibrary.setAttributeSelector(data.match(replace.regex.attributeSelectors));
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(data);
  }

  selectorLibrary.fillLibrary(data, options);
};
