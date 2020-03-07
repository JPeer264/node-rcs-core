import selectorsLibrary from '../selectorsLibrary';

export interface GenerateMappingOptions {
  origValues?: boolean;
}

const generate = (opts: GenerateMappingOptions = {}): { [s: string]: string } => {
  if (Object.prototype.toString.call(opts) !== '[object Object]') {
    console.warn(`Mapping input is not an valid object. Found ${opts} instead`);

    return {};
  }

  const { origValues = true }: GenerateMappingOptions = opts;

  const cssClassMapping = selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: !origValues,
    addSelectorType: true,
  });

  const cssIdMapping = selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: !origValues,
    addSelectorType: true,
  });

  return { ...cssClassMapping, ...cssIdMapping };
};

export default generate;
