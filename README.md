# @ckreidl/lucide-shopify-snippets

Add [Lucide](https://lucide.dev) icon snippets to your Shopify theme.

## Usage

```bash
npx @ckreidl/lucide-shopify-snippets add menu chevron-down arrow-right
```

This creates Liquid snippets in your `snippets` directory:

```
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

## Options

```bash
npx @ckreidl/lucide-shopify-snippets add <icons...> [options]

Options:
  -d, --dir <path>      Snippets directory (default: "snippets")
  -p, --prefix <prefix> Prefix for snippet filenames (default: "icon-")
  -f, --force           Overwrite existing snippets
```
