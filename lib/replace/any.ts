import selectorsLibrary from '../selectorsLibrary';
import replaceString, { ReplaceStringOptions } from './string';
import replaceRegex from './regex';

const replaceAny = (code: string, opts: ReplaceStringOptions = {}): string => {
  const regex = selectorsLibrary.getAllRegex();

  let data = code.toString();

  if (data.length === 0) {
    return data;
  }

  data = data.replace(replaceRegex.strings, (match) => replaceString(match, regex, opts));

  return data;
};

export default replaceAny;
