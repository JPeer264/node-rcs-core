import test from 'ava';

import rcs from '../lib';

function replaceCssMacro(t, input, expected, options = {}) {
  rcs.fillLibraries(input, options);

  t.is(rcs.replace.css(input), expected);
  t.is(rcs.replace.css(new Buffer(input)), expected);
}


test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.keyframesLibrary.reset();
});

/* *** *
 * GET *
 * *** */
test('should replace keyframes properly',
  replaceCssMacro,
  `
    :root {
      --main-bg-color: coral;
      --my-gradient: linear-gradient(var(--main-bg-color), var(--bottom-color));
    }

    #div1 {
      background-color: var(--main-bg-color);
    }
  `,
`
    :root {
      --a: coral;
      --b: linear-gradient(var(--a), var(--bottom-color));
    }

    #c {
      background-color: var(--a);
    }
  `,
);
