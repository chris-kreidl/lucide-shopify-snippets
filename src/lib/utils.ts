import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { similarity } from "radashi";
import { fileURLToPath } from "url";

/**
 * Locate the filesystem path of an SVG for a given lucide icon name.
 *
 * @param iconName - Icon name without the `.svg` extension
 * @returns The filesystem path to the first matching SVG file, or `null` if none is found
 */
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

/**
 * List available lucide-static icon names by scanning configured icon directories.
 *
 * Reads the first existing icons directory and returns the names of files ending with `.svg`
 * with the `.svg` extension removed. If no icons directory is present, returns an empty array.
 *
 * @returns An array of available icon names (SVG filenames without the `.svg` extension), or an empty array if none are found.
 */
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

/**
 * Candidate filesystem paths where lucide-static SVG icons may be installed.
 *
 * @returns An array of absolute directory paths to search for lucide-static icons, ordered by preference.
 */
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

/**
 * Find an exact case-insensitive match in an array of strings.
 *
 * @param haystack - Array of strings to search
 * @param needle - String to find
 * @returns The matched string from haystack, or `null` if not found
 */
export function findExactMatch(haystack: Array<string>, needle: string): string | null {
  return haystack.find((name) => name.toLowerCase() === needle.toLowerCase()) ?? null;
}

/**
 * Find strings similar to the needle using Levenshtein distance.
 *
 * @param haystack - Array of strings to search
 * @param needle - String to match against
 * @param count - Maximum number of results to return (default: 5)
 * @returns Array of similar strings (Levenshtein distance <= 2)
 */
export function findSimilar(haystack: Array<string>, needle: string, count = 5): Array<string> {
  return haystack
    .filter((name) => similarity(name.toLowerCase(), needle.toLowerCase()) <= 2)
    .slice(0, count);
}
