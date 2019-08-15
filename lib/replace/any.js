import selectorsLibrary from '../selectorsLibrary';
import replaceString from './string';
import replaceRegex from './regex';

const replaceAny = (code) => {
  const regex = selectorsLibrary.getAllRegex();

  let data = code.toString();

  if (data.length === 0) {
    return data;
  }

  data = data.replace(replaceRegex.strings, match => replaceString(match, regex));

  return data;
};

export default replaceAny;
