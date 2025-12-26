import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://chris-kreidl.github.io",
  base: "/lucide-shopify-snippets",
  integrations: [
    starlight({
      title: "Lucide Shopify Snippets",
      logo: {
        src: '~/assets/logo.svg'
      },
      social: {
        github: "https://github.com/chris-kreidl/lucide-shopify-snippets",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
          ],
        },
        {
          label: "Commands",
          items: [
            { label: "add", slug: "commands/add" },
            { label: "search", slug: "commands/search" },
          ],
        },
      ],
    }),
  ],
});
