import decToAny from 'decimal-to-any';

let customGenerator = null;

export class NameGenerator {
  constructor(type) {
    this.type = type;
    this.nameCounter = 1;
    this.decToAnyOptions = {
      alphabet: 'etnrisouaflchpdvmgybwxk_jqz',
    };
  }

  setAlphabet(alphabet) {
    this.nameCounter = 1;
    this.decToAnyOptions.alphabet = alphabet;
  }

  generate(selector) {
    const generatedName = typeof customGenerator === 'function'
      ? (
        customGenerator({
          selector,
          type: this.type,
          alphabet: this.decToAnyOptions.alphabet,
          nameCounter: this.nameCounter,
        })
      ) : (
        decToAny(
          this.nameCounter,
          this.decToAnyOptions.alphabet.length,
          this.decToAnyOptions,
        )
      );

    this.nameCounter += 1;

    return generatedName;
  }

  reset() {
    this.nameCounter = 1;
  }
}

export const useCustomGenerator = (generator) => {
  customGenerator = generator;
};

// @deprecated: this will get removed in v3
export default new NameGenerator();
