import { existsSync, readdirSync } from "fs";
import { createRequire } from "node:module";
import { dirname, join } from "path";
import { similarity } from "radashi";

/**
 * Locate the filesystem path of an SVG for a given lucide icon name.
 *
 * @param iconName - Icon name without the `.svg` extension
 * @returns The filesystem path to the first matching SVG file, or `null` if none is found
 */
export function resolveIconPath(iconName: string): string | null {
  const iconsDir = getLucideIconsDir();
  if (!iconsDir) return null;

  const iconPath = join(iconsDir, `${iconName}.svg`);
  return existsSync(iconPath) ? iconPath : null;
}

/**
 * List available lucide-static icon names.
 *
 * @returns An array of icon names (without `.svg` extension), or empty array if not found
 */
export function getAvailableIcons(): string[] {
  const iconsDir = getLucideIconsDir();
  if (!iconsDir || !existsSync(iconsDir)) return [];

  return readdirSync(iconsDir)
    .filter((f) => f.endsWith(".svg"))
    .map((f) => f.replace(".svg", ""));
}

/**
 * Resolve the lucide-static icons directory path.
 *
 * Uses require.resolve to find the package location, which works correctly
 * when the CLI is installed via npx or as a dependency.
 *
 * @returns The absolute path to the lucide-static icons directory, or `null` if not found
 */
export function getLucideIconsDir(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const lucidePackageJson = require.resolve("lucide-static/package.json");
    return join(dirname(lucidePackageJson), "icons");
  } catch {
    return null;
  }
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
 * Find strings similar to the needle using substring and Levenshtein matching.
 *
 * Returns substring matches first (e.g., "arrow" matches "arrow-right"),
 * then fuzzy matches for typos (e.g., "arrwo" matches "arrow").
 *
 * @param haystack - Array of strings to search
 * @param needle - String to match against
 * @param count - Maximum number of results to return (default: 5)
 * @returns Array of similar strings
 */
export function findSimilar(haystack: Array<string>, needle: string, count = 5): Array<string> {
  const n = needle.toLowerCase();

  // Substring matches first (most relevant)
  const substringMatches = haystack.filter((name) => name.toLowerCase().includes(n));

  // Fuzzy matches for typos (excluding already matched)
  const fuzzyMatches = haystack.filter(
    (name) => !substringMatches.includes(name) && similarity(name.toLowerCase(), n) <= 2,
  );

  return [...substringMatches, ...fuzzyMatches].slice(0, count);
}
