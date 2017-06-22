import decToAny from 'decimal-to-any';

class NameGenerator {
  constructor() {
    this.nameCounter = 1;
    this.decToAnyOptions = {
      alphabet: 'etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXVJKQGYZ',
    };
  }

  setAlphabet(alphabet) {
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
