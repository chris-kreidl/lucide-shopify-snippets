import { UnknownIconSetError } from "./errors";
import { Heroicons } from "./Heroicons";
import type { IconSet } from "./IconSet";
import { Lucide } from "./Lucide";

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

function parseLibraryVariantArg(arg: string): { library: string; variant?: string } {
  const [library, variant] = arg.split(":");
  return { library: library!, variant: variant || undefined };
}
