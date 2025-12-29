import { UnknownIconSetError } from "./errors";
import type { IconSet } from "./IconSet";
import { Lucide } from "./Lucide";

export function getIconSet(name: string): IconSet {
  switch (name) {
    case "lucide":
      return new Lucide();
    default:
      throw new UnknownIconSetError(name);
  }
}
