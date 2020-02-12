import keyframesLibrary from './keyframesLibrary';
import selectorsLibrary from './selectorsLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';
import extractFromHtml from './helpers/extractFromHtml';
import { BaseLibraryOptions } from './baseLibrary';

export interface FillLibrariesOptions extends BaseLibraryOptions {
  codeType?: 'css' | 'html';
  ignoreCssVariables?: boolean;
  replaceKeyframes?: boolean;
  prefix?: string;
  suffix?: string;
}

export default (code: string | Buffer, opts: FillLibrariesOptions = {}): void => {
  const defaultOptions: FillLibrariesOptions = {
    codeType: 'css',
    ignoreAttributeSelectors: false,
    ignoreCssVariables: false,
    replaceKeyframes: false,
    prefix: '',
    suffix: '',
  };

  const options = { ...defaultOptions, ...opts };
  let cssCode = code;

  if (options.codeType === 'html') {
    const htmlExtractedCss = extractFromHtml(code.toString());

    // no css code found to fill
    if (htmlExtractedCss.length <= 0) {
      return;
    }

    cssCode = htmlExtractedCss.join(' ');
  }

  const data = cssCode.toString();

  selectorsLibrary.setPrefix(options.prefix as string);
  selectorsLibrary.setSuffix(options.suffix as string);

  if (!options.ignoreAttributeSelectors) {
    selectorsLibrary.setAttributeSelector(data);
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(data);
  }

  if (!options.ignoreCssVariables) {
    cssVariablesLibrary.fillLibrary(data);
  }

  selectorsLibrary.fillLibrary(data, options);
};
