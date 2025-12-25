#!/usr/bin/env node
import { program } from "commander";
import { addIcons } from "./commands/add.ts";

program
  .name("lucide-shopify-snippets")
  .description("Add Lucide icon snippets to your Shopify theme")
  .version("0.1.0");

program
  .command("add")
  .description("Add icon snippet(s) to your Shopify theme")
  .argument("<icons...>", "Icon name(s) to add (e.g., menu chevron-down)")
  .option("-d, --dir <path>", "Snippets directory", "snippets")
  .option("-p, --prefix <prefix>", "Prefix for snippet filenames", "icon-")
  .option("-f, --force", "Overwrite output files if already exists")
  .action(addIcons);

program.parse();
