import consola from "consola";
import { findIconsByTag, parseIconTagMap } from "../lib/utils";
import { alphabetical, flat, unique } from "radashi";

export function listTags() {
  const repo = parseIconTagMap();

  if (!repo) {
    consola.error("  Cannot parse Lucide tag data");
    return;
  }

  const tags = alphabetical(unique(flat(Object.values(repo))), (k) => k);

  consola.log(`  Found the following tags:`);
  tags.forEach((tag) => {
    const icons = findIconsByTag(tag, repo);
    consola.log(`    * ${tag} [${icons?.length || 0} icons]`);
  });
}
