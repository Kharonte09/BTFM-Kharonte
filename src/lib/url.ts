/**
 * Builds an internal URL that respects Astro's `base` (needed for GitHub
 * project pages, e.g. /REPOSITORY/). Always use this for internal links.
 *
 *   url('/tools/')            → /REPOSITORY/tools/
 *   url('search-index.json')  → /REPOSITORY/search-index.json
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  const [pathname, hash] = clean.split('#', 2);
  const isFile = /\.[a-z0-9]+$/i.test(pathname ?? '');
  const withSlash = pathname && !isFile && !pathname.endsWith('/') ? `${pathname}/` : (pathname ?? '');
  const joined = `${base}/${withSlash}`;
  return hash ? `${joined}#${hash}` : joined;
}

/** Absolute URL (for canonical / Open Graph). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'https://kharonte.es').toString();
}
