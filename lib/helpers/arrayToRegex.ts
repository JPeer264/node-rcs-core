function arrayToRegex(
  values: string[],
  modifier: (value: string) => string = (value) => value,
): RegExp | null {
  if (!values.length) {
    return null;
  }

  return (
    new RegExp(`(${values
      // sort by size
      .sort((a, b) => b.length - a.length)
      // add -- to ensure to only capture attributes
      .map(modifier)
      .join(')|(')
    })`, 'g')
  );
}

export default arrayToRegex;
