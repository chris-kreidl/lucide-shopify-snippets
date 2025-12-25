import { describe, expect, test } from "bun:test";
import {
  findExactMatch,
  findSimilar,
  getAvailableIcons,
  resolveIconPath,
} from "./utils.ts";

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

  test("returns null when no match", () => {
    expect(findExactMatch(icons, "nonexistent")).toBeNull();
  });

  test("returns null for empty haystack", () => {
    expect(findExactMatch([], "menu")).toBeNull();
  });
});

describe("findSimilar", () => {
  const icons = ["menu", "menus", "chevron-down", "chevron-up", "arrow-right", "arrow-left"];

  test("finds similar icons within default threshold", () => {
    const similar = findSimilar(icons, "manu");
    expect(similar).toContain("menu");
  });

  test("respects count limit", () => {
    const similar = findSimilar(icons, "chevron", 2);
    expect(similar.length).toBeLessThanOrEqual(2);
  });

  test("is case-insensitive", () => {
    const similar = findSimilar(icons, "MENU");
    expect(similar).toContain("menu");
  });

  test("returns empty array when nothing similar", () => {
    const similar = findSimilar(icons, "zzzzzzzzz");
    expect(similar).toEqual([]);
  });

  test("returns empty array for empty haystack", () => {
    expect(findSimilar([], "menu")).toEqual([]);
  });
});

describe("resolveIconPath", () => {
  test("resolves existing icon to a path", () => {
    const path = resolveIconPath("menu");
    expect(path).not.toBeNull();
    expect(path).toContain("menu.svg");
  });

  test("returns null for nonexistent icon", () => {
    expect(resolveIconPath("this-icon-does-not-exist-12345")).toBeNull();
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
