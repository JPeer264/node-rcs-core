import regex from './replace/regex';
import { AttributeLibrary } from './attributeLibrary';

export class IdSelectorLibrary extends AttributeLibrary {
  constructor() {
    super('id');
  }

  getAttributeSelectorRegex = (): RegExp => regex.idAttributeSelectors;

  // Get the selector char for this child class
  selectorFirstChar = (): string => '#';
}

export default new IdSelectorLibrary();
