import { join } from "path";
import { IconSet } from "./IconSet";
import { existsSync, readdirSync, readFileSync } from "fs";
import { safeDestr } from "destr";
import type { IconsTagMap } from "./types";
import { IconNotFoundError, InvalidTagMapStructureError } from "./errors";
import { alphabetical, flat, unique } from "radashi";

export class Lucide extends IconSet {
  constructor() {
    super("lucide-static");
  }

  loadIcons() {
    const iconsDir = join(this.packageDirectory, "icons");
    if (!existsSync(iconsDir)) throw new Error("Could not find icons directory");

    this.iconNames = readdirSync(iconsDir)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.replace(".svg", ""));
  }

  getIcon(icon: string) {
    if (!this.findExactMatch(icon)) {
      throw new IconNotFoundError(icon);
    }

    const iconPath = join(this.packageDirectory, `icons/${icon}.svg`);
    const svgContent = readFileSync(iconPath, "utf-8");

    return this.extractPaths(svgContent);
  }

  override supportsTags(): boolean {
    return true;
  }

  override loadTags() {
    const repoPath = join(this.packageDirectory, "tags.json");
    let rawRepo: string;

    try {
      rawRepo = readFileSync(repoPath, "utf-8");
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      throw new Error(`Cannot read tags.json: ${error.code ?? error.message}`);
    }

    const repo = safeDestr<IconsTagMap>(rawRepo);

    if (!repo || typeof repo !== "object" || Array.isArray(repo)) {
      throw new InvalidTagMapStructureError(
        "Lucide tag map is invalid; expected non-empty object of string arrays.",
      );
    }

    const entries = Object.entries(repo);
    const hasInvalidEntry = entries.some(
      ([key, value]) =>
        typeof key !== "string" ||
        !Array.isArray(value) ||
        value.some((tag) => typeof tag !== "string"),
    );

    if (!entries.length || hasInvalidEntry) {
      throw new InvalidTagMapStructureError(
        "Lucide tag map is invalid; expected non-empty object of string arrays.",
      );
    }

    this.tagNames = alphabetical(unique(flat(Object.values(repo))), (k) => k);
    this.tagMap = repo;
  }

  override findIconsByTag(tag: string): Array<string> {
    const filtered = Object.entries(this.tagMap)
      .filter(([, tags]) => tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
      .map(([icon]) => icon);

    return filtered;
  }
}
