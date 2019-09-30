import { BaseLibrary, BaseLibraryOptions } from './baseLibrary';
import regex from './replace/regex';

export class KeyframesLibrary extends BaseLibrary {
  constructor() {
    super('keyframe');
  }

  // eslint-disable-next-line class-methods-use-this
  fillLibrary(data: string | Buffer): void {
    const code = data.toString();
    // set the keyframes here
    const keyframes = code.match(regex.keyframes);

    if (Array.isArray(keyframes)) {
      this.set(keyframes.map((key) => key.split(/\s+/)[1]));
    }
  } // /fillLibrary

  get(selector: string, opts: BaseLibraryOptions = {}): string {
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

  get keyframes(): { [s: string]: string } {
    return this.values;
  }

  set keyframes(keyframes) {
    this.values = keyframes;
  }

  get compressedKeyframes(): { [s: string]: string } {
    return this.compressedValues;
  }

  set compressedKeyframes(compressedKeyframes) {
    this.compressedValues = compressedKeyframes;
  }
}

export default new KeyframesLibrary();
