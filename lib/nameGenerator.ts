import decToAny from 'decimal-to-any';

const defaultGenerator = (
  obj: { nameCounter: number; alphabet: string; selector: string; type: string },
): string => (
  decToAny(obj.nameCounter, obj.alphabet.length, obj)
);

let customGenerator: null | typeof defaultGenerator = null;

export class NameGenerator {
  type: string;

  nameCounter = 1;

  decToAnyOptions = {
    alphabet: 'etnrisouaflchpdvmgybwxk_jqz',
  };

  constructor(type = '') {
    this.type = type;
  }

  setAlphabet(alphabet: string): void {
    this.nameCounter = 1;
    this.decToAnyOptions.alphabet = alphabet;
  }

  generate(selector: string): string {
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

  reset(): void {
    this.nameCounter = 1;
  }
}

export const useCustomGenerator = (generator: typeof defaultGenerator): void => {
  customGenerator = generator;
};
