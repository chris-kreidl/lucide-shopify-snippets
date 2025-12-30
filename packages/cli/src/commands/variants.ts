import consola from "consola";
import { getIconSet } from "../lib/iconsets";

/**
 * Print available icon variants
 *
 * @param library - Icon library to search (e.g., "lucide", "heroicons")
 *
 * Logs a header "Found the following variants:" followed by one line per variant in the format:
 * "    * <variant>".
 */
export function listVariants(library: string): void {
  try {
    const iconset = getIconSet(library);

    if (Object.keys(iconset.variants).length === 1) {
      consola.log(`  ${library} contains only one variant: ${Object.keys(iconset.variants)[0]}`);
      return;
    }

    consola.log(`  ${library} contains the following variants:`);

    Object.entries(iconset.variants).forEach(([k, _v]) => {
      if (k === "default") {
        consola.log(`    * ${k} (${iconset.variants.default})`);
      } else {
        consola.log(`    * ${k}`);
      }
    });
  } catch (err) {
    consola.error(`  ${(err as Error).message}`);
  }
}
