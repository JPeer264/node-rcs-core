import BaseLibrary from './BaseLibrary';
import replace from './replace';

class KeyframesLibrary extends BaseLibrary {
  // eslint-disable-next-line class-methods-use-this
  fillLibrary(data) {
    const code = data.toString();
    // set the keyframes here
    const keyframes = code.match(replace.regex.keyframes);

    if (Object.prototype.toString.call(keyframes) === '[object Array]') {
      this.set(keyframes.map(key => key.split(/\s+/)[1]));
    }
  } // /fillLibrary

  get(selector, opts = {}) {
    const defaultOptions = {
      origKeyframe: true,
      ...opts,
    };

    const options = {
      ...defaultOptions,
      originalValue: defaultOptions.origKeyframe,
    };

    return super.get(selector, options);
  }

  get keyframes() {
    return this.values;
  }

  get compressedKeyframes() {
    return this.compressedValues;
  }

  set keyframes(keyframes) {
    this.values = keyframes;
  }

  set compressedKeyframes(compressedKeyframes) {
    this.compressedValues = compressedKeyframes;
  }
}

export default new KeyframesLibrary();
