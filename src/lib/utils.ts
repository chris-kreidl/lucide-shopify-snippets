import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

export function resolveIconPath(iconName: string): string | null {
  // Try to find the lucide-static package
  const possiblePaths = [
    // When running from node_modules/.bin or npx
    join(process.cwd(), "node_modules", "lucide-static", "icons", `${iconName}.svg`),
    // When running from the package itself during development
    join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "node_modules",
      "lucide-static",
      "icons",
      `${iconName}.svg`,
    ),
  ];

  for (const iconPath of possiblePaths) {
    if (existsSync(iconPath)) {
      return iconPath;
    }
  }

  return null;
}

export function getAvailableIcons(): string[] {
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

  for (const iconsDir of possiblePaths) {
    if (existsSync(iconsDir)) {
      return readdirSync(iconsDir)
        .filter((f) => f.endsWith(".svg"))
        .map((f) => f.replace(".svg", ""));
    }
  }

  return [];
}
