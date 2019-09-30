import regex from './replace/regex';
import { AttributeLibrary } from './attributeLibrary';

export class ClassSelectorLibrary extends AttributeLibrary {
  constructor() {
    super('class');
  }

  getAttributeSelectorRegex = (): RegExp => regex.classAttributeSelectors;

  // Get the selector char for this child class
  selectorFirstChar = (): string => '.';
}

export default new ClassSelectorLibrary();
