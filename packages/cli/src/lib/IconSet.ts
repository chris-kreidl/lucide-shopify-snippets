import { createRequire } from "module";
import { dirname } from "path";
import { similarity } from "radashi";
import type { IconsTagMap } from "./types";

export abstract class IconSet {
  packageDirectory: string;
  iconNames: Array<string> = [];
  tagNames: Array<string> = [];
  tagMap: IconsTagMap = {};

  abstract loadIcons(): void;
  abstract loadTags(): void;
  abstract getIcon(icon: string): string;

  constructor(packageName: string) {
    this.packageDirectory = this.resolvePackageDirectory(packageName);
    this.loadIcons();

    if (this.supportsTags()) this.loadTags();
  }

  /**
   * Resolves package directory
   *
   * @returns {string} Full path to package directory
   */
  resolvePackageDirectory(packageName: string): string {
    const require = createRequire(import.meta.url);
    const packageDirectory = dirname(require.resolve(`${packageName}/package.json`));

    return packageDirectory;
  }

  /**
   * Find an exact case-insensitive match in an array of strings.
   *
   * @param needle - String to find
   * @returns The matched string from haystack, or `null` if not found
   */
  findExactMatch(needle: string): string | null {
    return this.iconNames.find((name) => name.toLowerCase() === needle.toLowerCase()) ?? null;
  }

  /**
   * Find strings similar to the needle using substring and Levenshtein matching.
   *
   * Returns substring matches first (e.g., "arrow" matches "arrow-right"),
   * then fuzzy matches for typos (e.g., "arrwo" matches "arrow").
   *
   * @param needle - String to match against
   * @param count - Maximum number of results to return (default: 5)
   * @returns Array of similar strings
   */
  findSimilar(needle: string, count = 5): Array<string> {
    const n = needle.toLowerCase();

    // Substring matches first (most relevant)
    const substringMatches = this.iconNames.filter((name) => name.toLowerCase().includes(n));

    // Fuzzy matches for typos (excluding already matched)
    const fuzzyMatches = this.iconNames.filter(
      (name) => !substringMatches.includes(name) && similarity(name.toLowerCase(), n) <= 2,
    );

    return [...substringMatches, ...fuzzyMatches].slice(0, count);
  }

  extractPaths(svg: string): string {
    const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    if (!innerMatch || !innerMatch[1]) throw new Error(`Error parsing SVG`);
    const innerContent = innerMatch[1].trim();

    return innerContent;
  }

  supportsTags(): boolean {
    return false;
  }

  getTags(): Array<string> {
    return [];
  }

  /* oxlint-disable-next-line no-unused-vars */
  findIconsByTag(tag: string): Array<string> {
    return [];
  }
}
