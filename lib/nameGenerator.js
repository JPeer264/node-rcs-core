import decToAny from 'decimal-to-any';

let customGenerator = null;

const defaultGenerator = obj => decToAny(obj.nameCounter, obj.alphabet.length, obj);

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
    const genFunc = typeof customGenerator === 'function' ? customGenerator : defaultGenerator;
    const generatedName = genFunc({
      selector,
      type: this.type,
      alphabet: this.decToAnyOptions.alphabet,
      nameCounter: this.nameCounter,
    });

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
