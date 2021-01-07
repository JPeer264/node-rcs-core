export interface Source {
  line: number;
  file: string;
  text: string;
}

export type WarningTypes = 'compressed' | 'ignoredFound';

export class Warnings {
  ranOnMinifiedFiles = false;

  list: Record<WarningTypes, { [s: string]: Source[] }> = {
    compressed: {},
    ignoredFound: {},
  };

  /**
  * @deprecated This has been renamed to
  *   'rcs.warnings.list.compressed' instead of 'rcs.warnings.warningArray
  */
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
    this.list = {
      compressed: {},
      ignoredFound: {},
    };
    this.ranOnMinifiedFiles = false;
  }

  append(value: string, source: Source | undefined, warningType: WarningTypes = 'compressed'): void {
    if (warningType === 'compressed') {
      if (value in this.list) {
        if (
          source
          && (
            this.list[warningType][value].findIndex((e) => ((
              e.file === source.file && e.line === source.line)
            )) === -1
          )
        ) {
          this.list[warningType][value].push(source);
        }
      } else {
        this.list[warningType][value] = source ? [source] : [];
      }

      this.warningArray = this.list.compressed;
    }
  }

  warn(): void {
    const compressedEntries = Object.entries(this.list.compressed);

    if (!compressedEntries.length) return;

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

    compressedEntries.forEach(([key, line]) => {
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
