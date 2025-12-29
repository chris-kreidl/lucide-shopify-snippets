import consola from "consola";
import { Lucide } from "../lib/Lucide";
import { getIconSet } from "../lib/iconsets";

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
    const iconset = getIconSet('lucide');

    if (iconset.tagNames.length) {
      consola.log(`  Found the following tags:`);

      iconset.tagNames.forEach((tag) => {
        const icons = iconset.findIconsByTag(tag);
        consola.log(`    * ${tag} [${icons.length} icon${icons.length === 1 ? "" : "s"}]`);
      });
    } else {
      consola.warn(`  Couldn't find any tags?`);
    }
  } catch (err) {
    consola.error(`  ${(err as Error).message}`);
  }
}
