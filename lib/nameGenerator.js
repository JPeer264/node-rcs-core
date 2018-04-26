import decToAny from 'decimal-to-any';

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
    const generatedName = decToAny(
      this.nameCounter,
      this.decToAnyOptions.alphabet.length,
      this.decToAnyOptions,
    );

    this.nameCounter += 1;

    return generatedName;
  }

  reset() {
    this.nameCounter = 1;
  }
}

export default new NameGenerator();
