import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export function resolveIconPath(iconName: string): string | null {
  // Try to find the lucide-static package
  const possiblePaths = getPossiblePaths().map((dir) => join(dir, `${iconName}.svg`));

  for (const iconPath of possiblePaths) {
    if (existsSync(iconPath)) {
      return iconPath;
    }
  }

  return null;
}

export function getAvailableIcons(): string[] {
  const possiblePaths = getPossiblePaths();

  for (const iconsDir of possiblePaths) {
    if (existsSync(iconsDir)) {
      return readdirSync(iconsDir)
        .filter((f) => f.endsWith(".svg"))
        .map((f) => f.replace(".svg", ""));
    }
  }

  return [];
}

function getPossiblePaths(): Array<string> {
  const possiblePaths = [
    join(process.cwd(), "node_modules", "lucide-static", "icons"),
    join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "node_modules",
      "lucide-static",
      "icons",
    ),
  ];

  return possiblePaths;
}
