import { beforeEach, describe, expect, mock, test } from "bun:test";

// Mock node:module to avoid actual package resolution
void mock.module("module", () => ({
  createRequire: () => ({
    resolve: () => "/fake/package/package.json",
  }),
}));

const { IconSet } = await import("./IconSet");

// Concrete test implementation of abstract IconSet
class TestIconSet extends IconSet {
  override loadIcons() {
    this.iconNames = ["menu", "menus", "chevron-down", "chevron-up", "arrow-right", "arrow-left"];
  }

  loadTags() {
    this.tagMap = {
      menu: ["hamburger", "navigation"],
      "arrow-right": ["arrow", "direction"],
    };
    this.tagNames = ["arrow", "direction", "hamburger", "navigation"];
  }

  override getIcon(icon: string) {
    return `<path data-icon="${icon}" />`;
  }
}

// Test implementation that supports tags
class TaggableTestIconSet extends TestIconSet {
  override supportsTags() {
    return true;
  }
}

describe("IconSet", () => {
  describe("findExactMatch", () => {
    let iconSet: InstanceType<typeof TestIconSet>;

    beforeEach(() => {
      iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
    });

    test("finds exact match", () => {
      expect(iconSet.findExactMatch("menu")).toBe("menu");
    });

    test("finds match case-insensitively", () => {
      expect(iconSet.findExactMatch("MENU")).toBe("menu");
      expect(iconSet.findExactMatch("Menu")).toBe("menu");
      expect(iconSet.findExactMatch("CHEVRON-DOWN")).toBe("chevron-down");
    });

    test("returns null when no match", () => {
      expect(iconSet.findExactMatch("nonexistent")).toBeNull();
    });

    test("returns null for empty needle", () => {
      expect(iconSet.findExactMatch("")).toBeNull();
    });
  });

  describe("findSimilar", () => {
    let iconSet: InstanceType<typeof TestIconSet>;

    beforeEach(() => {
      iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
    });

    test("finds substring matches", () => {
      const similar = iconSet.findSimilar("arrow");
      expect(similar).toContain("arrow-right");
      expect(similar).toContain("arrow-left");
    });

    test("finds fuzzy matches for typos", () => {
      const similar = iconSet.findSimilar("manu");
      expect(similar).toContain("menu");
    });

    test("prioritizes substring matches over fuzzy matches", () => {
      const similar = iconSet.findSimilar("menu");
      expect(similar[0]).toBe("menu");
      expect(similar[1]).toBe("menus");
    });

    test("respects count limit", () => {
      const similar = iconSet.findSimilar("chevron", 1);
      expect(similar.length).toBe(1);
    });

    test("is case-insensitive", () => {
      const similar = iconSet.findSimilar("ARROW");
      expect(similar).toContain("arrow-right");
    });

    test("returns empty array when nothing similar", () => {
      const similar = iconSet.findSimilar("zzzzzzzzz");
      expect(similar).toEqual([]);
    });

    test("handles empty needle by matching everything", () => {
      const similar = iconSet.findSimilar("", 3);
      expect(similar.length).toBe(3);
    });
  });

  describe("extractPaths", () => {
    let iconSet: InstanceType<typeof TestIconSet>;

    beforeEach(() => {
      iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
    });

    test("extracts inner content from SVG", () => {
      const svg = '<svg viewBox="0 0 24 24"><path d="M4 5h16" /></svg>';
      const result = iconSet.extractPaths(svg);
      expect(result).toBe('<path d="M4 5h16" />');
    });

    test("handles multiple elements", () => {
      const svg = '<svg><path d="M1" /><circle cx="5" /></svg>';
      const result = iconSet.extractPaths(svg);
      expect(result).toBe('<path d="M1" /><circle cx="5" />');
    });

    test("throws for invalid SVG", () => {
      expect(() => iconSet.extractPaths("not an svg")).toThrow("Error parsing SVG");
    });

    test("throws for empty SVG", () => {
      expect(() => iconSet.extractPaths("<svg></svg>")).toThrow("Error parsing SVG");
    });
  });

  describe("supportsTags", () => {
    test("returns false by default", () => {
      const iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
      expect(iconSet.supportsTags()).toBe(false);
    });

    test("can be overridden to return true", () => {
      const iconSet = new TaggableTestIconSet("fake-package", { default: "icons" }, "default");
      expect(iconSet.supportsTags()).toBe(true);
    });
  });

  describe("tag methods default implementations", () => {
    let iconSet: InstanceType<typeof TestIconSet>;

    beforeEach(() => {
      iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
    });

    test("getTags returns empty array by default", () => {
      expect(iconSet.getTags()).toEqual([]);
    });

    test("findIconsByTag returns empty array by default", () => {
      expect(iconSet.findIconsByTag("arrow")).toEqual([]);
    });
  });

  describe("constructor behavior", () => {
    test("calls loadIcons on construction", () => {
      const iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
      expect(iconSet.iconNames.length).toBeGreaterThan(0);
    });

    test("does not call loadTags when supportsTags returns false", () => {
      const iconSet = new TestIconSet("fake-package", { default: "icons" }, "default");
      expect(iconSet.tagNames).toEqual([]);
      expect(iconSet.tagMap).toEqual({});
    });

    test("calls loadTags when supportsTags returns true", () => {
      const iconSet = new TaggableTestIconSet("fake-package", { default: "icons" }, "default");
      expect(iconSet.tagNames.length).toBeGreaterThan(0);
      expect(Object.keys(iconSet.tagMap).length).toBeGreaterThan(0);
    });
  });
});
