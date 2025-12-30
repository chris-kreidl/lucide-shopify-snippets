import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { generateSnippet } from "../generator";
import { consola } from "consola";
import { IconNotFoundError } from "../lib/errors";
import { getIconSet } from "../lib/iconsets";

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
 * @param library - Icon library to search (e.g., "lucide", "heroicons")
 * @param icons - Array of icon names to convert into snippet files
 * @param options - Configuration for output:
 *   - `dir`: target directory for generated snippets
 *   - `prefix`: filename prefix for each generated snippet
 *   - `force`: when `true`, overwrite existing files; otherwise skip existing files
 */
export async function addIcons(
  library: string,
  icons: string[],
  options: AddOptions,
): Promise<void> {
  try {
    const snippetsDir = join(process.cwd(), options.dir);

    // Ensure snippets directory exists
    if (!existsSync(snippetsDir)) {
      consola.log(`Creating ${options.dir} directory...`);
      mkdirSync(snippetsDir, { recursive: true });
    }

    let successCount = 0;
    let errorCount = 0;
    const iconset = getIconSet(library);

    for (const iconName of icons) {
      const start = performance.now();

      let svgContent: string;
      try {
        svgContent = iconset.getIcon(iconName);
      } catch (err) {
        if (err instanceof IconNotFoundError) {
          consola.error(`  Icon "${iconName}" not found`);

          const similar = iconset.findSimilar(iconName);

          if (similar.length > 0) {
            consola.log(`  Did you mean: ${similar.join(", ")}?`);
          }

          errorCount++;
          continue;
        }

        throw err;
      }

      try {
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
        consola.log(
          `✅ [${duration.toFixed(2)} ms] (${iconset.variants[iconset.variant]}) ${options.prefix}${iconName}.liquid`,
        );
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
    consola.error(error instanceof Error ? error.message : String(error));
  }
}
