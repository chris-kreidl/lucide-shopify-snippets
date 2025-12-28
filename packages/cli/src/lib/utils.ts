import consola from "consola";
import { safeDestr } from "destr";
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

type IconsTagMap = {
  [icon: string]: Array<string>;
};

/**
 * Find icons matching specified tag
 *
 * Returns array of string names that match the requested tag
 *
 * @param term - string to search tags against
 * @returns Array of strings or `undefined` if tags can't be loaded.
 */
export function findIconsByTag(term: string): Array<string> | undefined {
  let repo: IconsTagMap;

  const iconsDir = getLucideIconsDir();

  if (!iconsDir) {
    consola.error("Cannot find Lucide icons directory");
    return;
  }

  const repoPath = join(iconsDir, "../tags.json");
  let rawRepo: string;

  try {
    rawRepo = readFileSync(repoPath, "utf-8");
  } catch (err) {
    const error = err as { message?: string; code?: string };
    const code = error.code ? ` (${error.code})` : "";
    const message = error.message ? `: ${error.message}` : "";
    consola.error(`  Cannot read Lucide tag map${code}${message}`);
    return;
  }

  try {
    repo = safeDestr<IconsTagMap>(rawRepo);
  } catch (err) {
    const error = err as { message?: string; code?: string };
    const code = error.code ? ` (${error.code})` : "";
    const message = error.message ? `: ${error.message}` : "";
    const prefix =
      err instanceof SyntaxError ? "Cannot parse Lucide tag map" : "Invalid Lucide tag map";
    consola.error(`  ${prefix}${code}${message}`);
    return;
  }

  if (!repo || typeof repo !== "object" || Array.isArray(repo)) {
    consola.error("  Lucide tag map is invalid; expected non-empty object of string arrays.");
    return;
  }

  const entries = Object.entries(repo);
  const hasInvalidEntry = entries.some(
    ([key, value]) =>
      typeof key !== "string" ||
      !Array.isArray(value) ||
      value.some((tag) => typeof tag !== "string"),
  );

  if (!entries.length || hasInvalidEntry) {
    consola.error("  Lucide tag map is invalid; expected non-empty object of string arrays.");
    return;
  }

  const filtered = Object.entries(repo)
    .filter(([, tags]) => tags.some((t) => t.toLowerCase() === term.toLowerCase()))
    .map(([icon]) => icon);

  return filtered;
}
