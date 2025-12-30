import consola from "consola";
import { getIconSet } from "../lib/iconsets";

/**
 * List and print available variants for the specified icon library.
 *
 * Logs a header indicating whether the library contains only one variant or multiple variants,
 * then prints each variant on its own indented line. For the "default" variant the associated
 * value is shown in parentheses.
 *
 * @param library - Icon library to inspect (for example "lucide" or "heroicons")
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