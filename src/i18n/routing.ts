import { DEFAULT_LANG, LOCALES, type Lang } from './ui';

/**
 * Pages live under src/pages/[...locale]/. The default language is served
 * without a prefix (locale = undefined), other languages under /<lang>/.
 */
export const localeParam = (lang: Lang) => (lang === DEFAULT_LANG ? undefined : lang);

/** getStaticPaths entries for a page that only varies by language. */
export const localeStaticPaths = () =>
  LOCALES.map((lang) => ({ params: { locale: localeParam(lang) }, props: { lang } }));

/** Expand per-language static paths: one set of params/props per language. */
export async function perLocale<P extends Record<string, string>, X extends object>(
  build: (lang: Lang) => Promise<{ params: P; props: X }[]> | { params: P; props: X }[],
) {
  const out: { params: P & { locale: string | undefined }; props: X & { lang: Lang } }[] = [];
  for (const lang of LOCALES) {
    for (const { params, props } of await build(lang)) {
      out.push({ params: { ...params, locale: localeParam(lang) }, props: { ...props, lang } });
    }
  }
  return out;
}
