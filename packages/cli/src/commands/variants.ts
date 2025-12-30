import consola from "consola";
import { getIconSet } from "../lib/iconsets";

/**
 * Print available icon variants
 *
 * @param library - Icon library to search (e.g., "lucide", "heroicons")
 *
 * Logs a header "Found the following variants:" followed by one line per tag in the format:
 * "    * <variant>".
 */
export function listVariants(library: string) {
  try {
    const iconset = getIconSet(library);

    if (Object.keys(iconset.variants).length === 1) {
      console.log(`${library} contains only one variant: ${Object.keys(iconset.variants)[0]}`);
      return;
    }

    console.log(`${library} contains the following variants:`);

    Object.entries(iconset.variants).map(([k, _v]) => {
      if (k === "default") {
        console.log(`  * ${k} (${iconset.variants.default})`);
      } else {
        console.log(`  * ${k}`);
      }
    });
  } catch (err) {
    consola.error(`  ${(err as Error).message}`);
  }
}
