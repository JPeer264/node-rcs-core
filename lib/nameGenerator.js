import decToAny from 'decimal-to-any';

let customGenerator = null;

export class NameGenerator {
  constructor() {
    this.nameCounter = 1;
    this.decToAnyOptions = {
      alphabet: 'etnrisouaflchpdvmgybwxk_jqz',
    };
  }

  setAlphabet(alphabet) {
    this.nameCounter = 1;
    this.decToAnyOptions.alphabet = alphabet;
  }

  generate() {
    const generatedName = typeof customGenerator === 'function'
      ? customGenerator(this.nameCounter, this.decToAnyOptions.alphabet)
      : (
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

export default new NameGenerator();
