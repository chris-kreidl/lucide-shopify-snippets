# @ckreidl/lucide-shopify-snippets

Add [Lucide](https://lucide.dev) icon snippets to your Shopify theme.

## Usage

```bash
npx @ckreidl/lucide-shopify-snippets add menu chevron-down arrow-right
```

This creates Liquid snippets in your `snippets` directory:

```text
snippets/
  icon-menu.liquid
  icon-chevron-down.liquid
  icon-arrow-right.liquid
```

Use them in your theme:

```liquid
{% render 'icon-menu' %}
{% render 'icon-menu', size: 32 %}
{% render 'icon-menu', class: 'text-primary' %}
{% render 'icon-menu', stroke_width: 1.5 %}
```

## Commands

### add

Add icon snippets to your theme:

```bash
npx @ckreidl/lucide-shopify-snippets add <icons...> [options]

Options:
  -d, --dir <path>      Snippets directory (default: "snippets")
  -p, --prefix <prefix> Prefix for snippet filenames (default: "icon-")
  -f, --force           Overwrite existing snippets
```

### search

Search for icons by name:

```bash
npx @ckreidl/lucide-shopify-snippets search <icon>
```

Example:

```bash
npx @ckreidl/lucide-shopify-snippets search arrow
# Found similar: arrow-up, arrow-down, arrow-left, arrow-right, ...
```
