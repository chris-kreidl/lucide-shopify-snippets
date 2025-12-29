import { beforeEach, describe, expect, mock, test } from "bun:test";

// Mock consola
const mockConsolaError = mock((..._args: unknown[]) => {});

void mock.module("consola", () => ({
  default: {
    error: mockConsolaError,
  },
}));

// Mock fs
const mockReadFileSync = mock((_path: string, _encoding?: string) => "{}");

void mock.module("node:fs", () => ({
  readFileSync: mockReadFileSync,
  existsSync: () => true,
  readdirSync: () => [],
}));

// Mock node:module to control getLucideIconsDir
void mock.module("node:module", () => ({
  createRequire: () => ({
    resolve: () => "/fake/lucide-static/package.json",
  }),
}));

// Import after mocks
const { findIconsByTag } = await import("./utils.ts");

describe("findIconsByTag error handling", () => {
  beforeEach(() => {
    mockConsolaError.mockReset();
    mockReadFileSync.mockReset();
    mockReadFileSync.mockImplementation(() => "{}");
  });

  test("returns icons matching tag from valid tags.json", () => {
    const tagsJson = JSON.stringify({
      "arrow-up": ["arrow", "direction", "up"],
      "arrow-down": ["arrow", "direction", "down"],
      menu: ["hamburger", "navigation"],
    });
    mockReadFileSync.mockImplementation(() => tagsJson);

    const result = findIconsByTag("arrow");

    expect(result).toBeDefined();
    expect(result).toContain("arrow-up");
    expect(result).toContain("arrow-down");
    expect(result).not.toContain("menu");
  });

  test("matches tags case-insensitively", () => {
    const tagsJson = JSON.stringify({
      "arrow-up": ["Arrow", "Direction"],
    });
    mockReadFileSync.mockImplementation(() => tagsJson);

    const result = findIconsByTag("arrow");

    expect(result).toContain("arrow-up");
  });

  test("returns empty array when no tags match", () => {
    const tagsJson = JSON.stringify({
      menu: ["hamburger", "navigation"],
    });
    mockReadFileSync.mockImplementation(() => tagsJson);

    const result = findIconsByTag("arrow");

    expect(result).toBeDefined();
    expect(result).toEqual([]);
  });

  test("throws when file read fails", () => {
    mockReadFileSync.mockImplementation(() => {
      const error = new Error("ENOENT: no such file or directory");
      (error as NodeJS.ErrnoException).code = "ENOENT";
      throw error;
    });

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws for invalid JSON", () => {
    mockReadFileSync.mockImplementation(() => "{ invalid json }");

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws for null JSON", () => {
    mockReadFileSync.mockImplementation(() => "null");

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws for array JSON", () => {
    mockReadFileSync.mockImplementation(() => "[]");

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws for empty object", () => {
    mockReadFileSync.mockImplementation(() => "{}");

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws when tag values are not arrays", () => {
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({
        menu: "not-an-array",
      }),
    );

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });

  test("throws when tag array contains non-strings", () => {
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({
        menu: ["valid", 123, "also-valid"],
      }),
    );

    expect(() => { findIconsByTag("arrow") }).toThrow();
  });
});
