import { BaseLibrary } from './baseLibrary';
import regex from './replace/regex';

class KeyframesLibrary extends BaseLibrary {
  constructor() {
    super('keyframe');
  }

  // eslint-disable-next-line class-methods-use-this
  fillLibrary(data) {
    const code = data.toString();
    // set the keyframes here
    const keyframes = code.match(regex.keyframes);

    if (Object.prototype.toString.call(keyframes) === '[object Array]') {
      this.set(keyframes.map((key) => key.split(/\s+/)[1]));
    }
  } // /fillLibrary

  get(selector, opts = {}) {
    const defaultOptions = {
      origKeyframe: true,
      ...opts,
    };

    const options = {
      ...defaultOptions,
      isOriginalValue: defaultOptions.origKeyframe,
    };

    return super.get(selector, options);
  }

  get keyframes() {
    return this.values;
  }

  set keyframes(keyframes) {
    this.values = keyframes;
  }

  get compressedKeyframes() {
    return this.compressedValues;
  }

  set compressedKeyframes(compressedKeyframes) {
    this.compressedValues = compressedKeyframes;
  }
}

export default new KeyframesLibrary();
