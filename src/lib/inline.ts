/**
 * Minimal inline formatter for short frontmatter strings.
 * Supports `code` and **bold**. Everything else is HTML-escaped.
 */
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(text: string): string {
  return text
    .split(/(`[^`]+`)/g)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 1
        ? `<code>${escape(part.slice(1, -1))}</code>`
        : escape(part).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'),
    )
    .join('');
}

/** Strip inline markup, for plain-text contexts (search index, meta tags). */
export const plain = (text: string) => text.replace(/`/g, '').replace(/\*\*/g, '');
