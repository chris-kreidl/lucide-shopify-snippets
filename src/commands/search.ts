import { similarity } from "radashi";
import { getAvailableIcons } from "../lib/utils";
import consola from "consola";

export async function searchIcons(icon: string): Promise<void> {
  const available = getAvailableIcons();

  const exact = available.find(name => name.toLowerCase() === icon.toLowerCase());

  const similar = available
    .filter((name) => similarity(name.toLowerCase(), icon.toLowerCase()) <= 2)
    .slice(0, 5);

  if(exact) {
    consola.log(`  Found exact match: ${exact}`)
  }

  if (similar.length) {
    consola.log(`  Found similar: ${similar.join(", ")}`);
  } else {
    consola.log(`  Nothing found approximating ${icon}`);
  }
}
