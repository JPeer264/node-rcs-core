import replace from './replace';
import { AttributeLibrary } from './attributeLibrary';

class IdSelectorLibrary extends AttributeLibrary {
  constructor() {
    super('id');
  }

  // eslint-disable-next-line class-methods-use-this
  getAttributeSelectorRegex() {
    return replace.regex.idAttributeSelectors;
  }

  // Get the selector char for this child class
  // eslint-disable-next-line class-methods-use-this
  selectorFirstChar() {
    return '#';
  }
}

export default new IdSelectorLibrary();
