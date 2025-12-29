import { beforeEach, describe, expect, mock, test } from "bun:test";
import { IconNotFoundError } from "../lib/errors";

// Mock fs module
const mockExistsSync = mock((_path: string) => false);
const mockMkdirSync = mock((_path: string, _options?: object) => undefined);
const mockReadFileSync = mock(
  (_path: string, _encoding?: string) => '<svg><path d="M4 5h16" /></svg>',
);
const mockWriteFileSync = mock((_path: string, _content: string) => undefined);

void mock.module("fs", () => ({
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
  readFileSync: mockReadFileSync,
  writeFileSync: mockWriteFileSync,
}));

// Mock utils
const mockResolveIconPath = mock((_name: string): string => "/fake/path/menu.svg");
const mockGetAvailableIcons = mock((): string[] => ["menu", "arrow-right", "chevron-down"]);
const mockFindSimilar = mock((_haystack: string[], _needle: string): string[] => ["menu"]);

void mock.module("../lib/utils", () => ({
  resolveIconPath: mockResolveIconPath,
  getAvailableIcons: mockGetAvailableIcons,
  findSimilar: mockFindSimilar,
}));

// Mock consola
const mockConsolaLog = mock((..._args: unknown[]) => {});
const mockConsolaError = mock((..._args: unknown[]) => {});

void mock.module("consola", () => ({
  consola: {
    log: mockConsolaLog,
    error: mockConsolaError,
  },
}));

// Import after mocks are set up
const { addIcons } = await import("./add");

describe("addIcons", () => {
  beforeEach(() => {
    mockExistsSync.mockReset();
    mockMkdirSync.mockReset();
    mockReadFileSync.mockReset();
    mockWriteFileSync.mockReset();
    mockResolveIconPath.mockReset();
    mockConsolaLog.mockReset();
    mockConsolaError.mockReset();

    // Default implementations
    mockExistsSync.mockImplementation(() => false);
    mockReadFileSync.mockImplementation(() => '<svg><path d="M4 5h16" /></svg>');
    mockResolveIconPath.mockImplementation(() => "/fake/path/icon.svg");
  });

  test("creates snippets directory if it doesn't exist", async () => {
    mockExistsSync.mockImplementation(() => false);

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: false });

    expect(mockMkdirSync).toHaveBeenCalled();
  });

  test("does not create directory if it exists", async () => {
    mockExistsSync.mockImplementation((path: string) => {
      return path.endsWith("snippets");
    });

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: false });

    expect(mockMkdirSync).not.toHaveBeenCalled();
  });

  test("writes snippet file for valid icon", async () => {
    mockExistsSync.mockImplementation(() => false);

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: false });

    expect(mockWriteFileSync).toHaveBeenCalled();
    const call = mockWriteFileSync.mock.calls[0];
    expect(call?.[0]).toContain("icon-menu.liquid");
    expect(call?.[1]).toContain("<svg");
  });

  test("uses custom prefix", async () => {
    mockExistsSync.mockImplementation(() => false);

    await addIcons(["menu"], { dir: "snippets", prefix: "lucide-", force: false });

    const call = mockWriteFileSync.mock.calls[0];
    expect(call?.[0]).toContain("lucide-menu.liquid");
  });

  test("skips existing files without force flag", async () => {
    mockExistsSync.mockImplementation(() => true);

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: false });

    expect(mockWriteFileSync).not.toHaveBeenCalled();
    expect(mockConsolaError).toHaveBeenCalled();
  });

  test("overwrites existing files with force flag", async () => {
    mockExistsSync.mockImplementation(() => true);

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: true });

    expect(mockWriteFileSync).toHaveBeenCalled();
  });

  test("logs error for nonexistent icon", async () => {
    mockResolveIconPath.mockImplementation(() => {
      throw new IconNotFoundError("this-icon-does-not-exist-12345");
    });

    await addIcons(["this-icon-does-not-exist-12345"], {
      dir: "snippets",
      prefix: "icon-",
      force: false,
    });

    expect(mockConsolaError).toHaveBeenCalled();
    expect(mockWriteFileSync).not.toHaveBeenCalled();
  });

  test("processes multiple icons", async () => {
    mockExistsSync.mockImplementation(() => false);

    await addIcons(["menu", "arrow"], { dir: "snippets", prefix: "icon-", force: false });

    expect(mockWriteFileSync).toHaveBeenCalledTimes(2);
  });

  test("logs summary with success count", async () => {
    mockExistsSync.mockImplementation(() => false);

    await addIcons(["menu"], { dir: "snippets", prefix: "icon-", force: false });

    const calls = mockConsolaLog.mock.calls;
    const summaryCall = calls.find((call) => String(call?.[0]).includes("Done!"));
    expect(summaryCall).toBeDefined();
    expect(String(summaryCall?.[0])).toContain("1 icon(s)");
  });
});
