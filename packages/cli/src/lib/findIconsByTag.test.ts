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

  test("returns undefined and logs error when file read fails", () => {
    mockReadFileSync.mockImplementation(() => {
      const error = new Error("ENOENT: no such file or directory");
      (error as NodeJS.ErrnoException).code = "ENOENT";
      throw error;
    });

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
    const errorMessage = String(mockConsolaError.mock.calls[0]?.[0]);
    expect(errorMessage).toContain("Cannot read Lucide tag map");
    expect(errorMessage).toContain("ENOENT");
  });

  test("returns undefined and logs error for invalid JSON", () => {
    mockReadFileSync.mockImplementation(() => "{ invalid json }");

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
    const errorMessage = String(mockConsolaError.mock.calls[0]?.[0]);
    expect(errorMessage).toContain("Cannot parse Lucide tag map");
  });

  test("returns undefined and logs error for null JSON", () => {
    mockReadFileSync.mockImplementation(() => "null");

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
    const errorMessage = String(mockConsolaError.mock.calls[0]?.[0]);
    expect(errorMessage).toContain("invalid");
  });

  test("returns undefined and logs error for array JSON", () => {
    mockReadFileSync.mockImplementation(() => "[]");

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
    const errorMessage = String(mockConsolaError.mock.calls[0]?.[0]);
    expect(errorMessage).toContain("invalid");
  });

  test("returns undefined and logs error for empty object", () => {
    mockReadFileSync.mockImplementation(() => "{}");

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
    const errorMessage = String(mockConsolaError.mock.calls[0]?.[0]);
    expect(errorMessage).toContain("invalid");
  });

  test("returns undefined and logs error when tag values are not arrays", () => {
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({
        menu: "not-an-array",
      }),
    );

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
  });

  test("returns undefined and logs error when tag array contains non-strings", () => {
    mockReadFileSync.mockImplementation(() =>
      JSON.stringify({
        menu: ["valid", 123, "also-valid"],
      }),
    );

    const result = findIconsByTag("arrow");

    expect(result).toBeUndefined();
    expect(mockConsolaError).toHaveBeenCalled();
  });
});
