import regex from './replace/regex';
import { AttributeLibrary } from './attributeLibrary';

class ClassSelectorLibrary extends AttributeLibrary {
  constructor() {
    super('class');
  }

  // eslint-disable-next-line class-methods-use-this
  getAttributeSelectorRegex() {
    return regex.classAttributeSelectors;
  }

  // Get the selector char for this child class
  // eslint-disable-next-line class-methods-use-this
  selectorFirstChar() {
    return '.';
  }
}

export default new ClassSelectorLibrary();
