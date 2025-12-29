import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { generateSnippet } from "../generator";
import { consola } from "consola";
import { findSimilar, getAvailableIcons, resolveIconPath } from "../lib/utils";

interface AddOptions {
  dir: string;
  prefix: string;
  force: boolean;
}

/**
 * Convert a list of icon names into Liquid snippet files in the specified directory.
 *
 * Creates the target directory if missing, resolves each icon to its SVG source, generates a snippet file named with the provided prefix, skips unresolved icons (and logs up to five similar suggestions), and respects the `force` option when deciding whether to overwrite existing files. Logs progress and a summary of successes and failures.
 *
 * @param icons - Array of icon names to convert into snippet files
 * @param options - Configuration for output:
 *   - `dir`: target directory for generated snippets
 *   - `prefix`: filename prefix for each generated snippet
 *   - `force`: when `true`, overwrite existing files; otherwise skip existing files
 */
export async function addIcons(icons: string[], options: AddOptions): Promise<void> {
  try {
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
        const similar = findSimilar(available, iconName);

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
  } catch (error) {
    consola.error(`  ${(error as Error).message}`);
  }
}
