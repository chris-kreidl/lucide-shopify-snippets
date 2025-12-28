import {
  findExactMatch,
  findIconsByTag,
  findSimilar,
  getAvailableIcons,
} from "../lib/utils";
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
  if (options.tag) {
    const filtered = findIconsByTag(term);

    if (filtered && filtered.length) {
      consola.log(
        `  Found the following icons that are tagged "${term}":\n  ${filtered.join(", ")}`,
      );
    } else {
      consola.log(`  Did not find any icons tagged "${term}"`);
    }
  } else {
    const available = getAvailableIcons();

    const exact = findExactMatch(available, term);

    const similar = findSimilar(available, term);

    if (exact) {
      consola.log(`  Found exact match: ${exact}`);
    }

    if (similar.length) {
      consola.log(`  Found similar: ${similar.join(", ")}`);
    } else {
      consola.log(`  Nothing found approximating ${term}`);
    }
  }
}
