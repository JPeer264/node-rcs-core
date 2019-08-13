import replace from './replace';
import { AttributeLibrary } from './attributeLibrary';

class ClassSelectorLibrary extends AttributeLibrary {

  // eslint-disable-next-line class-methods-use-this
  getAttributeSelectorRegex() {
    return replace.regex.classAttributeSelectors;
  }

  // Get the selector char for this child class
  // eslint-disable-next-line class-methods-use-this
  selectorFirstChar() {
    return '.';
  }
}

export default new ClassSelectorLibrary();
