/**
 * Generates a Shopify Liquid snippet from a Lucide SVG icon.
 *
 * The generated snippet supports the following parameters:
 * - size: Width and height in pixels (default: 24)
 * - class: Additional CSS classes to add
 * - stroke_width: Stroke width (default: 2)
 *
 * Usage in Liquid:
 *   {% render 'icon-menu' %}
 *   {% render 'icon-menu', size: 32 %}
 *   {% render 'icon-menu', size: 24, class: 'text-primary' %}
 *   {% render 'icon-menu', stroke_width: 1.5 %}
 */
export function generateSnippet(svgContent: string, iconName: string): string {
  // Extract the inner content of the SVG (paths, circles, etc.)
  // const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  // if (!innerMatch || !innerMatch[1]) throw new Error(`Error parsing Lucide SVG`);
  // const innerContent = innerMatch[1].trim();

  // Build the Liquid snippet
  const snippet = `{%- comment -%}
  Lucide icon: ${iconName}
  Usage:
    {% render 'icon-${iconName}' %}
    {% render 'icon-${iconName}', size: 32 %}
    {% render 'icon-${iconName}', class: 'custom-class' %}
    {% render 'icon-${iconName}', stroke_width: 1.5 %}
{%- endcomment -%}
{%- liquid
  assign size = size | default: 24
  assign stroke_width = stroke_width | default: 2
-%}
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="{{ size }}"
  height="{{ size }}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="{{ stroke_width }}"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-${iconName}{% if class %} {{ class }}{% endif %}"
  aria-hidden="true"
>
${svgContent}
</svg>
`;

  return snippet;
}
