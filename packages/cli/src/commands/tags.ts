import consola from "consola";
import { getIconSet } from "../lib/iconsets";

/**
 * Print available tags for an icon library along with the number of icons in each tag.
 *
 * Logs a header and one line per tag in the form:
 * "    * <tag> [<n> icon(s)]". If the library does not expose tags or none are found, a warning is logged; errors encountered while retrieving the icon set are logged as errors.
 *
 * @param library - Icon library identifier (e.g., "lucide", "heroicons")
 */
export function listTags(library: string): void {
  try {
    const iconset = getIconSet(library);

    if (!iconset.supportsTags()) {
      consola.warn(` ${library} does not provide tags`);
      return;
    }

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