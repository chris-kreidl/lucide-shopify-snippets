import { describe, expect, test } from "bun:test";
import {
  findExactMatch,
  findIconsByTag,
  findSimilar,
  getAvailableIcons,
  resolveIconPath,
} from "./utils.ts";
import { IconNotFoundError } from "./errors.ts";

describe("findExactMatch", () => {
  const icons = ["menu", "chevron-down", "arrow-right", "ArrowLeft"];

  test("finds exact match", () => {
    expect(findExactMatch(icons, "menu")).toBe("menu");
  });

  test("finds match case-insensitively", () => {
    expect(findExactMatch(icons, "MENU")).toBe("menu");
    expect(findExactMatch(icons, "Menu")).toBe("menu");
    expect(findExactMatch(icons, "arrowleft")).toBe("ArrowLeft");
  });

  test("matches hyphenated names", () => {
    expect(findExactMatch(icons, "chevron-down")).toBe("chevron-down");
    expect(findExactMatch(icons, "CHEVRON-DOWN")).toBe("chevron-down");
  });

  test("returns null when no match", () => {
    expect(findExactMatch(icons, "nonexistent")).toBeNull();
  });

  test("returns null for empty haystack", () => {
    expect(findExactMatch([], "menu")).toBeNull();
  });

  test("returns null for empty needle", () => {
    expect(findExactMatch(icons, "")).toBeNull();
  });
});

describe("findSimilar", () => {
  const icons = ["menu", "menus", "chevron-down", "chevron-up", "arrow-right", "arrow-left"];

  test("finds substring matches", () => {
    const similar = findSimilar(icons, "arrow");
    expect(similar).toContain("arrow-right");
    expect(similar).toContain("arrow-left");
  });

  test("finds fuzzy matches for typos", () => {
    const similar = findSimilar(icons, "manu");
    expect(similar).toContain("menu");
  });

  test("prioritizes substring matches over fuzzy matches", () => {
    const similar = findSimilar(icons, "menu");
    expect(similar[0]).toBe("menu");
    expect(similar[1]).toBe("menus");
  });

  test("respects count limit", () => {
    const similar = findSimilar(icons, "chevron", 2);
    expect(similar.length).toBeLessThanOrEqual(2);
  });

  test("is case-insensitive", () => {
    const similar = findSimilar(icons, "ARROW");
    expect(similar).toContain("arrow-right");
  });

  test("returns empty array when nothing similar", () => {
    const similar = findSimilar(icons, "zzzzzzzzz");
    expect(similar).toEqual([]);
  });

  test("returns empty array for empty haystack", () => {
    expect(findSimilar([], "menu")).toEqual([]);
  });

  test("handles empty needle by matching everything", () => {
    const similar = findSimilar(icons, "", 3);
    expect(similar.length).toBe(3);
  });

  test("handles single character needle", () => {
    const similar = findSimilar(icons, "m", 10);
    expect(similar).toContain("menu");
    expect(similar).toContain("menus");
  });

  test("handles needle longer than haystack items", () => {
    const similar = findSimilar(icons, "this-is-a-very-long-search-term");
    expect(similar).toEqual([]);
  });
});

describe("resolveIconPath", () => {
  test("resolves existing icon to a path", () => {
    const path = resolveIconPath("menu");
    expect(path).not.toBeNull();
    expect(path).toContain("menu.svg");
  });

  test("throws for nonexistent icon", () => {
    expect(() => resolveIconPath("this-icon-does-not-exist-12345")).toThrow(IconNotFoundError);
  });

  test("returns null for empty string", () => {
    expect(() => resolveIconPath("")).toThrow(IconNotFoundError);
  });

  test("returns null for path traversal attempts", () => {
    expect(() => resolveIconPath("../package")).toThrow(IconNotFoundError);
    expect(() => resolveIconPath("../../etc/passwd")).toThrow(IconNotFoundError);
  });

  test("returns null for names with special characters", () => {
    expect(() => resolveIconPath("menu<script>")).toThrow(IconNotFoundError);
    expect(() => resolveIconPath("menu;rm -rf")).toThrow(IconNotFoundError);
  });
});

describe("getAvailableIcons", () => {
  test("returns array of icon names", () => {
    const icons = getAvailableIcons();
    expect(Array.isArray(icons)).toBe(true);
    expect(icons.length).toBeGreaterThan(0);
  });

  test("includes known icons", () => {
    const icons = getAvailableIcons();
    expect(icons).toContain("menu");
    expect(icons).toContain("chevron-down");
    expect(icons).toContain("arrow-right");
  });

  test("icon names do not include .svg extension", () => {
    const icons = getAvailableIcons();
    const hasExtension = icons.some((icon) => icon.endsWith(".svg"));
    expect(hasExtension).toBe(false);
  });
});

describe("findIconsByTag", () => {
  test("returns array of icons for valid tag", () => {
    const icons = findIconsByTag("arrow");
    expect(icons).toBeDefined();
    expect(Array.isArray(icons)).toBe(true);
    expect(icons!.length).toBeGreaterThan(0);
  });

  test("finds icons case-insensitively", () => {
    const lower = findIconsByTag("arrow");
    const upper = findIconsByTag("ARROW");
    const mixed = findIconsByTag("Arrow");

    expect(lower).toEqual(upper);
    expect(lower).toEqual(mixed);
  });

  test("returns empty array when no icons match tag", () => {
    const icons = findIconsByTag("this-tag-definitely-does-not-exist-12345");
    expect(icons).toBeDefined();
    expect(icons).toEqual([]);
  });

  test("finds icons with common tags", () => {
    // "menu" tag should match icons like menu, menu-square, etc.
    const icons = findIconsByTag("menu");
    expect(icons).toBeDefined();
    expect(icons!.length).toBeGreaterThan(0);
  });

  test("returns icons that actually exist", () => {
    const taggedIcons = findIconsByTag("arrow");
    const availableIcons = getAvailableIcons();

    expect(taggedIcons).toBeDefined();
    for (const icon of taggedIcons!) {
      expect(availableIcons).toContain(icon);
    }
  });
});
