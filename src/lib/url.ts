import { DEFAULT_LANG, LOCALES, type Lang } from '@/i18n/ui';

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/**
 * Builds an internal URL that respects Astro's `base` (needed for GitHub
 * project pages, e.g. /REPOSITORY/). Use it for assets and for already
 * localised paths. For pages, use `href(lang, path)`.
 *
 *   url('/tools/')            → /REPOSITORY/tools/
 *   url('search-index.json')  → /REPOSITORY/search-index.json
 */
export function url(path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  const [pathname, hash] = clean.split('#', 2);
  const isFile = /\.[a-z0-9]+$/i.test(pathname ?? '');
  const withSlash = pathname && !isFile && !pathname.endsWith('/') ? `${pathname}/` : (pathname ?? '');
  const joined = `${BASE}/${withSlash}`;
  return hash ? `${joined}#${hash}` : joined;
}

/** Path with locale prefix (none for the default language). */
export function localePath(lang: Lang, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === DEFAULT_LANG ? clean : `/${lang}${clean}`;
}

/** Localised, base-aware page URL. */
export const href = (lang: Lang, path = '/') => url(localePath(lang, path));

/** Absolute URL (for canonical / Open Graph). */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'http://localhost:4321').toString();
}

/** Strip base and locale prefix: "/REPO/es/tools/" → "/tools/". */
export function unlocalizedPath(pathname: string): string {
  let p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  if (!p.startsWith('/')) p = `/${p}`;
  for (const l of LOCALES) {
    if (l === DEFAULT_LANG) continue;
    if (p === `/${l}` || p.startsWith(`/${l}/`)) return p.slice(l.length + 1) || '/';
  }
  return p;
}

/** Current language from a request URL. */
export function getLang(u: URL): Lang {
  const p = BASE && u.pathname.startsWith(BASE) ? u.pathname.slice(BASE.length) : u.pathname;
  const seg = p.split('/').filter(Boolean)[0];
  return (LOCALES as readonly string[]).includes(seg ?? '') ? (seg as Lang) : DEFAULT_LANG;
}
