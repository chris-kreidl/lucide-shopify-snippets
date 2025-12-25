import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { generateSnippet } from "../generator.ts";
import { consola } from "consola";
import { similarity } from "radashi";

interface AddOptions {
  dir: string;
  prefix: string;
  force: boolean;
}

function resolveIconPath(iconName: string): string | null {
  // Try to find the lucide-static package
  const possiblePaths = [
    // When running from node_modules/.bin or npx
    join(process.cwd(), "node_modules", "lucide-static", "icons", `${iconName}.svg`),
    // When running from the package itself during development
    join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "node_modules",
      "lucide-static",
      "icons",
      `${iconName}.svg`,
    ),
  ];

  for (const iconPath of possiblePaths) {
    if (existsSync(iconPath)) {
      return iconPath;
    }
  }

  return null;
}

function getAvailableIcons(): string[] {
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

  for (const iconsDir of possiblePaths) {
    if (existsSync(iconsDir)) {
      return readdirSync(iconsDir)
        .filter((f: string) => f.endsWith(".svg"))
        .map((f: string) => f.replace(".svg", ""));
    }
  }

  return [];
}

export async function addIcons(icons: string[], options: AddOptions): Promise<void> {
  const snippetsDir = join(process.cwd(), options.dir);

  // Ensure snippets directory exists
  if (!existsSync(snippetsDir)) {
    consola.log(`Creating ${options.dir} directory...`);
    mkdirSync(snippetsDir, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (const iconName of icons) {
    const start = performance.now();

    const iconPath = resolveIconPath(iconName);

    if (!iconPath) {
      consola.error(`Error: Icon "${iconName}" not found.`);

      // Suggest similar icons
      const available = getAvailableIcons();
      const similar = available
        .filter((name) => similarity(name.toLowerCase(), iconName.toLowerCase()) <= 2)
        .slice(0, 5);

      if (similar.length > 0) {
        consola.log(`  Did you mean: ${similar.join(", ")}?`);
      }

      errorCount++;
      continue;
    }

    try {
      const svgContent = readFileSync(iconPath, "utf-8");
      const snippet = generateSnippet(svgContent, iconName);
      const outputPath = join(snippetsDir, `${options.prefix}${iconName}.liquid`);

      // check if output target already exists.
      if (existsSync(outputPath) && !options.force) {
        errorCount++;
        consola.error(`File ${outputPath} already exists`);
        continue;
      }

      writeFileSync(outputPath, snippet);
      const duration = performance.now() - start;
      consola.log(`✅ [${duration.toFixed(2)} ms] ${options.prefix}${iconName}.liquid`);
      successCount++;
    } catch (error) {
      consola.error(`Error processing "${iconName}":`, error);
      errorCount++;
    }
  }

  consola.log(
    `\nDone! Added ${successCount} icon(s)${errorCount > 0 ? `, ${errorCount} failed` : ""}.`,
  );
}
