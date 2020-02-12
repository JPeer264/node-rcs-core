import parse5 from 'parse5';

type HtmlToAstReturn = ReturnType<typeof parse5.parseFragment> | ReturnType<typeof parse5.parse>;

const htmlToAst = (code: string): HtmlToAstReturn => {
  let ast = parse5.parse(code, {
    sourceCodeLocationInfo: true,
  });

  if ((ast as any).mode === 'quirks') {
    ast = parse5.parseFragment(code, {
      sourceCodeLocationInfo: true,
    });
  }

  return ast;
};

export default htmlToAst;
