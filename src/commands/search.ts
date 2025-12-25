import { similarity } from "radashi";
import { getAvailableIcons } from "../lib/utils";
import consola from "consola";

/**
 * Searches available icon names for an exact match and up to five similar matches, then logs the results.
 *
 * Similar matches are those whose similarity to the query is less than or equal to 2; at most five similar names are shown.
 *
 * @param icon - Icon name to search for
 */
export function searchIcons(icon: string): void {
  const available = getAvailableIcons();

  const exact = available.find((name) => name.toLowerCase() === icon.toLowerCase());

  const similar = available
    .filter((name) => similarity(name.toLowerCase(), icon.toLowerCase()) <= 2)
    .slice(0, 5);

  if (exact) {
    consola.log(`  Found exact match: ${exact}`);
  }

  if (similar.length) {
    consola.log(`  Found similar: ${similar.join(", ")}`);
  } else {
    consola.log(`  Nothing found approximating ${icon}`);
  }
}