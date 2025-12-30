import { UnknownIconSetError } from "./errors";
import { Heroicons } from "./Heroicons";
import type { IconSet } from "./IconSet";
import { Lucide } from "./Lucide";

/**
 * Selects and returns an icon set instance based on a library name and optional variant.
 *
 * @param name - Library name optionally followed by ':' and a variant (for example, `heroicons:solid`)
 * @returns An IconSet instance configured for the requested library and variant
 * @throws UnknownIconSetError if the library part of `name` is not recognized
 */
export function getIconSet(name: string): IconSet<Record<string, string>> {
  const { library, variant } = parseLibraryVariantArg(name);

  switch (library) {
    case "lucide":
      return new Lucide();
    case "heroicons":
      if (variant) {
        return new Heroicons(variant);
      }

      return new Heroicons();
    default:
      throw new UnknownIconSetError(name);
  }
}

/**
 * Parse a "library" or "library:variant" argument into its library and optional variant.
 *
 * @param arg - Input string in the form `"library"` or `"library:variant"`
 * @returns An object with `library` set to the substring before the first `:` and `variant` set to the substring after it, or `undefined` if no variant was provided
 */
function parseLibraryVariantArg(arg: string): { library: string; variant?: string } {
  const [library, variant] = arg.split(":");
  return { library: library!, variant: variant || undefined };
}
