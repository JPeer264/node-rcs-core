import parse5 from 'parse5';

const htmlToAst = (code) => {
  let ast = parse5.parse(code, {
    sourceCodeLocationInfo: true,
  });

  if (ast.mode === 'quirks') {
    ast = parse5.parseFragment(code, {
      sourceCodeLocationInfo: true,
    });
  }

  return ast;
};

export default htmlToAst;
