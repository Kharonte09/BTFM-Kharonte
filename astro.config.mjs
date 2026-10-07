// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deployment target is controlled by environment variables so the same code
 * works on a custom domain (https://kharonte.es) and on GitHub project pages
 * (https://USERNAME.github.io/REPOSITORY/).
 *
 *   SITE_URL   absolute origin, e.g. https://username.github.io
 *   BASE_PATH  path prefix,     e.g. /REPOSITORY  (use / for a custom domain)
 *
 * The GitHub Actions workflow fills both from actions/configure-pages.
 */
const site = process.env.SITE_URL || 'https://kharonte.es';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Languages are routed by src/pages/[...locale]/ (English at /, Spanish at /es/).
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
