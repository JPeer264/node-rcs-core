import merge from 'lodash.merge';

import keyframesLibrary from './keyframesLibrary';
import nameGenerator from './nameGenerator';
import BaseLibrary from './BaseLibrary';
import replace from './replace';

class KeyframesLibrary extends BaseLibrary {
  constructor() {
    super();

    this.keyframes = {};
    this.compressedKeyframes = {};
  }

  reset() {
    super.reset();

    this.keyframes = {};
    this.compressedKeyframes = {};
  }

  // eslint-disable-next-line class-methods-use-this
  fillLibrary(data) {
    const code = data.toString();
    // set the keyframes here
    const keyframes = code.match(replace.regex.keyframes);

    if (Object.prototype.toString.call(keyframes) === '[object Array]') {
      keyframesLibrary.set(keyframes.map(key => key.split(/\s+/)[1]));
    }
  } // /fillLibrary

  get(selector, opts = {}) {
    const optionsDefault = {
      origKeyframe: true,
    };

    const options = merge({}, optionsDefault, opts);

    let result = this.keyframes[selector] || selector;

    // fail on setted exludes
    if (this.isExcluded(selector)) {
      return selector;
    }

    // change the objects if origKeyframe are set to false
    // to get information about the compressed keyframes
    if (!options.origKeyframe) {
      result = this.compressedKeyframes[selector] || result;
    }

    return result;
  } // /get

  set(keyframe, renamedKeyframe) {
    if (!keyframe) {
      return;
    }

    // call recursive if it is an array
    if (Object.prototype.toString.call(keyframe) === '[object Array]') {
      keyframe.forEach(item => this.set(item, renamedKeyframe));

      return;
    }

    // skip excludes
    if (this.isExcluded(keyframe)) {
      return;
    }

    // checks if this keyframe was already set
    if (this.keyframes[keyframe]) {
      return;
    }

    const randomName = renamedKeyframe || nameGenerator.generate();

    // save css selector into this.selectors and this.compressedSelectors
    this.keyframes[keyframe] = randomName;
    this.compressedKeyframes[randomName] = keyframe;
  } // /set
}

export default new KeyframesLibrary();
