import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://chris-kreidl.github.io",
  base: "/shopify-icon-snippets",
  integrations: [
    starlight({
      title: "Shopify Icon Snippets",
      logo: {
        src: "~/assets/logo.svg",
      },
      social: {
        github: "https://github.com/chris-kreidl/shopify-icon-snippets",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Supported Libraries", slug: "getting-started/libraries" },
          ],
        },
        {
          label: "Commands",
          items: [
            { label: "add", slug: "commands/add" },
            { label: "search", slug: "commands/search" },
            { label: "tags", slug: "commands/tags" },
          ],
        },
      ],
    }),
  ],
});
