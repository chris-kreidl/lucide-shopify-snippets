import consola from "consola";
import { findIconsByTag, parseIconTagMap } from "../lib/utils";
import { alphabetical, flat, unique } from "radashi";

/**
 * Print available icon tags and the number of icons for each tag.
 *
 * If the icon-tag map cannot be parsed, an error is logged and the function returns early.
 *
 * Logs a header "Found the following tags:" followed by one line per tag in the format:
 * "    * <tag> [<n> icon(s)]".
 */
export function listTags() {
  try {
    const repo = parseIconTagMap();

    const tags = alphabetical(unique(flat(Object.values(repo))), (k) => k);

    if (tags.length) {
      consola.log(`  Found the following tags:`);

      tags.forEach((tag) => {
        const icons = findIconsByTag(tag, repo);
        consola.log(`    * ${tag} [${icons.length} icon${icons.length === 1 ? "" : "s"}]`);
      });
    } else {
      consola.warn(`  Couldn't find any tags?`);
    }
  } catch (err) {
    consola.error(`  ${(err as Error).message}`);
  }
}
