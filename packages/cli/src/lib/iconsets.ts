import { UnknownIconSetError } from "./errors";
import { Heroicons } from "./Heroicons";
import type { IconSet } from "./IconSet";
import { Lucide } from "./Lucide";

export function getIconSet(name: string): IconSet<Record<string, string>> {
  switch (name) {
    case "lucide":
      return new Lucide();
    case "heroicons":
      return new Heroicons();
    default:
      throw new UnknownIconSetError(name);
  }
}
