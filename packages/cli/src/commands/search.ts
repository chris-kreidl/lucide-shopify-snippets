import { Lucide } from "../lib/Lucide";
import consola from "consola";

interface SearchOptions {
  tag: boolean;
}

/**
 * Searches available icon names for an exact match and up to five similar matches, then logs the results.
 *
 * Similar matches are those whose similarity to the query is less than or equal to 2; at most five similar names are shown.
 *
 * When `tag` option is specified, searches tag list for icons matching specified tag and logs a list of those icons.
 *
 * @param term - Search term
 * @param options - Configuration for output:
 * - `tag`: when `true`, searches for icons tagged as specified term
 */
export function searchIcons(term: string, options: SearchOptions): void {
  try {
    const lucide = new Lucide();

    if (options.tag) {
      const filtered = lucide.findIconsByTag(term);

      if (filtered.length) {
        consola.log(
          `  Found the following icons that are tagged "${term}":\n  ${filtered.join(", ")}`,
        );
      } else {
        consola.log(`  Did not find any icons tagged "${term}"`);
      }
    } else {
      const exact = lucide.findExactMatch(term);
      const similar = lucide.findSimilar(term);

      if (exact) {
        consola.log(`  Found exact match: ${exact}`);
      }

      if (similar.length) {
        consola.log(`  Found similar: ${similar.join(", ")}`);
      } else {
        consola.log(`  Nothing found approximating ${term}`);
      }
    }
  } catch (error) {
    consola.error(`  ${(error as Error).message}`);
  }
}
