3.7.0 - October, 20 2021

* 4a2378c Chore: update dependencies | remove package-lock.json (closes #143) (#144) (Jan Peer Stöcklmair)

3.6.5 - July, 14 2021

* aa4fec1 Fix: replace multiple variables after each other (closes #137) (#138) (Jan Peer Stöcklmair)
* 47f88e2 Chore: add gh workflow (JPeer264)
* b2fdb13 Style: update styling (JPeer264)

3.6.4 - June, 25 2021

* 2385e68 Fix: use replaceHTML for noscript tags (ref: #134) (JPeer264)

3.6.3 - June, 25 2021

* 9b87f3c Fix: replace noscript html elements (closes #134) (JPeer264)

3.6.2 - June, 25 2021

* 992dfe7 Fix: also add escaped brackets (closes #133) (#135) (Jan Peer Stöcklmair)

3.6.1 - June, 25 2021

* 66cc023 Fix: do not remove special characters when there is no match (#130) (Jan Peer Stöcklmair)

3.6.0 - January, 07 2021

* 9f59986 Feat: setInclude | warn on already excluded values (#121) (Jan Peer Stöcklmair)
* 2907583 Chore(deps): bump lodash from 4.17.15 to 4.17.20 (#118) (dependabot[bot])

3.5.1 - November, 12 2020

* 0537718 Fix: get values even if they have some line breaks and whitespaces (JPeer264)
* af50ba1 Docs: add Analyse.org (Jan Peer Stöcklmair)

3.5.0 - September, 23 2020

* 076761e Feat: replace vue class selectors (#117) (Jan Peer Stöcklmair)

3.4.0 - August, 09 2020

* c32aa0e Docs: improve optimize docs (JPeer264)
* 6dc7b0c Feat: add first draft of optimize (closes #111) (#114) (Jan Peer Stöcklmair)

3.3.1 - May, 11 2020

* cd47f54 Chore: fix types for AttributeLibrary.getAll (JPeer264)
* c5e9f0d Chore: add funding.yml (Jan Peer Stöcklmair)

3.3.0 - March, 17 2020

* bbd93bc Feat: add basic exclude list to make the renaming safer (closes #110) (JPeer264)

3.2.0 - March, 16 2020

* 347b639 Fix: statistics had unsused instead of unused (JPeer264)
* b894240 Feat: add load to statistics (JPeer264)
* 95a3441 Feat: add rcs.statistics.generate | deprecate rcs.stats (JPeer264)
* 69e5ec2 Docs: add missing load doc (JPeer264)

3.1.0 - March, 09 2020

* 989fcd2 Feat: add css variables to mapping (JPeer264)
* 739fc79 Feat: add keyframes, attributeSelectors (JPeer264)
* 00a5c02 Docs: add mapping documentation (JPeer264)
* 9cb18e5 Feat: add mapping for selectors (JPeer264)

3.0.4 - March, 05 2020

* 82dd759 Test: wording (JPeer264)
* af7159f Fix: correct way of transforming JSX and non JSX strings (JPeer264)
* 18ac2d6 Docs: add links in readme for npm overview (JPeer264)

3.0.3 - February, 20 2020

* 6cb593d Chore: do not include examples into npm package (minify download size) (JPeer264)

3.0.2 - February, 15 2020

* 8aa23a7 Chore: rimraf dest before building (JPeer264)
* 8188d23 Chore: add correct declaration types (JPeer264)
* c40818a Docs: wording (JPeer264)

3.0.1 - February, 14 2020

* 0008a41 Fix: do not rewrite href, src etc (JPeer264)
* 9ee2a04 3.0.0 (JPeer264)
* 54ab9db Docs: add plugins (JPeer264)
* 7876206 Docs: update docs (JPeer264)
* 2e3e8c2 Chore: add more os to travis (JPeer264)
* eb71b36 Chore: update travis badge (JPeer264)
* 81a04f5 Chore: update dependencies (closes #99) (JPeer264)
* 07a3be3 Chore: remove yarn.lock | remove node v8 support (JPeer264)
* e552e73 Fix: more consistent getter when not defined (closes #102) (JPeer264)
* 521cee8 Chore: update eslint files in __tests__ (JPeer264)
* 81faae8 Refactor: more consistent stats (closes #103) (JPeer264)
* e09944d Fix: remove merge whereever possible (closes #107) (JPeer264)
* 4ec76f3 Fix: apply fix from 2.6.3 (closes #105) (JPeer264)
* 295bd25 Feat: remove options.extend (closes #104) (JPeer264)
* 1d95142 Refactor: add missing refactored test (JPeer264)
* 9c2b8da Refactor: tests from JS to TS (#108) (Jan Peer Stöcklmair)
* 8483ea7 Chore: update espree to make all tests work (JPeer264)
* 857c3a9 Refactor: main lib to ts (no tests refactored) (#106) (Jan Peer Stöcklmair)

3.0.0 - February, 13 2020

* 54ab9db Docs: add plugins (JPeer264)
* 7876206 Docs: update docs (JPeer264)
* 2e3e8c2 Chore: add more os to travis (JPeer264)
* eb71b36 Chore: update travis badge (JPeer264)
* 81a04f5 Chore: update dependencies (closes #99) (JPeer264)
* 07a3be3 Chore: remove yarn.lock | remove node v8 support (JPeer264)
* e552e73 Fix: more consistent getter when not defined (closes #102) (JPeer264)
* 521cee8 Chore: update eslint files in __tests__ (JPeer264)
* 81faae8 Refactor: more consistent stats (closes #103) (JPeer264)
* e09944d Fix: remove merge whereever possible (closes #107) (JPeer264)
* 4ec76f3 Fix: apply fix from 2.6.3 (closes #105) (JPeer264)
* 295bd25 Feat: remove options.extend (closes #104) (JPeer264)
* 1d95142 Refactor: add missing refactored test (JPeer264)
* 9c2b8da Refactor: tests from JS to TS (#108) (Jan Peer Stöcklmair)
* 8483ea7 Chore: update espree to make all tests work (JPeer264)
* 857c3a9 Refactor: main lib to ts (no tests refactored) (#106) (Jan Peer Stöcklmair)

3.0.0-alpha.3 - November, 24 2019

* 09eb21b Fix: do not fail on ~ (JPeer264)
* f5706a9 Chore: drop support for node v6 | add v12 (JPeer264)
* dcb3ac3 Chore: add typescript eslint (JPeer264)
* 95d0c95 Chore: update husky | add lint-staged (JPeer264)
* bdfbd1a Chore: update eslint to 6.5.0 (JPeer264)
* e5902a7 Refactor: change from babel to typescript (JPeer264)
* 6449cda Remove ava and move to jest (closes #98) (#101) (Jan Peer Stöcklmair)

3.0.0-alpha.2 - September, 16 2019

* c2d35da Rework attribute selector to fix #96 (#97) (X-Ryl669)

3.0.0-alpha.1 - August, 22 2019

* b093cf4 Fix selector mismatch (#95) (X-Ryl669)
* d91bde4 Better error reporting (#94) (X-Ryl669)

3.0.0-alpha.0 - August, 19 2019

* b02269a Add support for custom generator and independant name generator per library. (#92) (X-Ryl669)
* 48d89bb Rework the selector library code so it's not mixing stuff (#91) (X-Ryl669)
* 55ff974 Fix label for attribute (#90) (X-Ryl669)
* 10ddbd9 Prevent mini size (#89) (X-Ryl669)

2.6.2 - August, 01 2019

* 92925bf Fix: rename multiple matches of css variables in css (JPeer264)
* f41a31d Docs: add some live examples (JPeer264)

2.6.1 - July, 23 2019

* ae5533e Fix: replace fallback css variables (JPeer264)
* df6f7c6 Fix #84 and #83 (#86) (X-Ryl669)

2.6.0 - June, 22 2019

* 19c2951 Test: test if css is getting replaced in html (JPeer264)
* a7c5ddd Feat: fill libraries with html (#82) (Jan Peer Stöcklmair)
* 08a7341 Feat: extract value from html tags (#81) (Jan Peer Stöcklmair)
* 596c591 Feat: replace css variables in js files (#80) (Jan Peer Stöcklmair)
* 905fcb7 Feat: add stats for keyframes and cssVariables (#79) (Jan Peer Stöcklmair)
* 099245c Style: change variable names (JPeer264)
* 14e00c7 Docs: update docs properly (JPeer264)

2.5.1 - May, 10 2019

* 0cf1c96 2.5.0 (JPeer264)

2.5.0 - May, 10 2019

* b93e537 Feat: css variables support (#78) (Jan Peer Stöcklmair)

2.4.7 - February, 13 2019

* ddf4055 Fix: ignore invalid selectors (closes #75) (#77) (Jan Peer Stöcklmair)

2.4.6 - February, 06 2019

* 6569160 Chore: update espree and enable ecmaversion 10 (closes #73) (#74) (Jan Peer Stöcklmair)

2.4.5 - February, 02 2019

* 6644a6d CI: cache node_modules for travis (#72) (Jan Peer Stöcklmair)
* b4f3c9e Fix: just replace javascript in html (closes #70 (#71) (Jan Peer Stöcklmair)

2.4.4 - January, 08 2019

* 7b150a0 Fix: do not track percentage as selector (closes #69) (JPeer264)

2.4.3 - December, 23 2018

* 4237eac Fix: rename escaped selectors (#68) (Jan Peer Stöcklmair)

2.4.2 - December, 16 2018

* 2896bec Fix: allow escaped selectors (closes #65) (#66) (Jan Peer Stöcklmair)

2.4.1 - September, 01 2018

* 09e3b1a Fix: pug variables in script (#63) (Jan Peer Stöcklmair)
* abe34fd Feat: set regexp as excludes (closes #29) (#62) (Jan Peer Stöcklmair)

2.4.0 - August, 28 2018

* c255703 Feat: rcs.replace.pug (#61) (Jan Peer Stöcklmair)
* 78840f7 Docs: add HTML custom attribute trigger (#60) (Jan Peer Stöcklmair)

2.3.1 - July, 24 2018

* 6672133 Chore: update parse5-traverse (closes #58) (#59) (Jan Peer Stöcklmair)

2.3.0 - July, 23 2018

* 867da34 Feat: stats (closes #55) (#57) (Jan Peer Stöcklmair)
* 49507c3 Feat: trigger more HTML tag attributes (closes #53) (#56) (Jan Peer Stöcklmair)

2.2.0 - July, 09 2018

* c7efd4e Feat: replace HTML (closes #50) (#52) (Jan Peer Stöcklmair)
* ed3fc92 Chore: change Node testing in travis (#54) (Jan Peer Stöcklmair)

2.1.0 - June, 18 2018

* fdbb29c Feat: use espree as parser and allow options for it (#49) (Jan Peer Stöcklmair)

2.0.1 - June, 05 2018

* b51cb60 Fix: gready attribute selector (#48) (Bert Verhelst)
* 5e3c66c Docs: update examples (#47) (Jan Peer Stöcklmair)
* c0f53e0 Chore: update travis notifications (#46) (Jan Peer Stöcklmair)
* 4141040 Chore: update git in package.json (#45) (Jan Peer Stöcklmair)
* ee11322 Test: improve coverage (#44) (Jan Peer Stöcklmair)

2.0.0 - April, 28 2018

* d60510c Docs: remove helper docs (#43) (Jan Peer Stöcklmair)
* e4b8b93 Feat: add tilde attribute selector (ref #26) (#42) (Jan Peer Stöcklmair)
* 2c0dbfd Feat: add dash attribute selector (ref #26) (#41) (Jan Peer Stöcklmair)
* b775514 Chore: just use lodash.merge (#40) (Jan Peer Stöcklmair)
* c675513 Refactor: remove helper (#39) (Jan Peer Stöcklmair)
* 6918a3b Feat: add equal attribute selector (ref #26) (#38) (Jan Peer Stöcklmair)
* 5ac4625 Feat: smart way to replace attributeSelectors (closes #36) (#37) (Jan Peer Stöcklmair)

1.0.5 - April, 26 2018

* d874a54 Chore: ignore .DS_Store (#35) (Jan Peer Stöcklmair)
* 35babe2 Fix: attributeSelectors without quotes (closes #33) (#34) (Jan Peer Stöcklmair)

1.0.4 - February, 11 2018

* 1ba5b12 Refactor: use postcss in replacecss (#32) (Jan Peer Stöcklmair)
* 3d35bde Refactor: use postcss for selectorLibrary (#31) (Jan Peer Stöcklmair)

1.0.3 - February, 09 2018

* d3d0ef6 Fix: match selectors after pseudo elements (#30) (Jan Peer Stöcklmair)

1.0.2 - July, 16 2017

* e263154 Remove: uppercase alphabets (#28) (Dutiyesh Salunkhe)
