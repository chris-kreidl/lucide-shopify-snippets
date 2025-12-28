#!/usr/bin/env node
import { program } from "commander";
import { addIcons } from "./commands/add.ts";
import { searchIcons } from "./commands/search.ts";
import { version } from "../package.json";

program
  .name("lucide-shopify-snippets")
  .description("Add Lucide icon snippets to your Shopify theme")
  .version(version);

program
  .command("add")
  .description("Add icon snippet(s) to your Shopify theme")
  .argument("<icons...>", "Icon name(s) to add (e.g., menu chevron-down)")
  .option("-d, --dir <path>", "Snippets directory", "snippets")
  .option("-p, --prefix <prefix>", "Prefix for snippet filenames", "icon-")
  .option("-f, --force", "Overwrite output files if already exists")
  .action(addIcons);

program
  .command("search")
  .description("Search Lucide library for icons")
  .argument("<term>", "Search term. Searches icon name if tag option not set")
  .option("-t, --tag", "Search tags")
  .action(searchIcons);

program.parse();
