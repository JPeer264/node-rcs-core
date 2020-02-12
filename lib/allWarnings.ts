export interface Source {
  line: number;
  file: string;
  text: string;
}

export class Warnings {
  ranOnMinifiedFiles = false;

  warningArray: { [s: string]: Source[] } = {};

  constructor() {
    this.reset();
  }

  summary(text: string): string {
    if (text.length > 120) {
      this.ranOnMinifiedFiles = this.ranOnMinifiedFiles || text.length > 500;

      return `${text.slice(0, 120)}...`;
    }

    return text;
  }

  reset(): void {
    this.warningArray = {};
    this.ranOnMinifiedFiles = false;
  }

  append(value: string, source: Source | undefined): void {
    if (value in this.warningArray) {
      if (
        source
        && (
          this.warningArray[value].findIndex((e) => ((
            e.file === source.file && e.line === source.line)
          )) === -1
        )
      ) {
        this.warningArray[value].push(source);
      }
    } else {
      this.warningArray[value] = source ? [source] : [];
    }
  }

  warn(): void {
    const keys = Object.keys(this.warningArray);
    if (!keys.length) return;

    // eslint-disable-next-line no-console
    console.warn('WARNING: The following selectors were not found in the rename table, but '
      + 'appears in the compressed map. In order to avoid that some other selectors '
      + 'are used instead, they were appended with \'_conflict\'. You need to fix this '
      + 'either by:\n');
    // eslint-disable-next-line no-console
    console.warn('- Creating a CSS rule with the selector name and re-run the process, or');
    // eslint-disable-next-line no-console
    console.warn('- Excluding the selectors so it\'s not renamed, or');
    // eslint-disable-next-line no-console
    console.warn('- Adding the value to the reserved selectors table so it\'s not used as a possible short name\n\n');

    // eslint-disable-next-line no-console
    console.warn('The failing selector are:');
    keys.forEach((key) => {
      const line = this.warningArray[key];
      if (line.length) {
        // eslint-disable-next-line no-console
        console.warn(` - '${key}' found in: `);
        // eslint-disable-next-line no-console
        line.forEach((e) => console.warn(`    ${e.file}(${e.line}): ${this.summary(e.text)}`));
      } else {
        // eslint-disable-next-line no-console
        console.warn(` - '${key}'`);
      }
    });

    if (this.ranOnMinifiedFiles) {
      // eslint-disable-next-line no-console
      console.warn('WARNING: You shouldn\'t run this software on minified files as it\'ll be '
        + 'hard to debug errors whenever they happens.\n');
    }
  }
}

export default new Warnings();
