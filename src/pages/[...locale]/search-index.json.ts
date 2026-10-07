import type { APIRoute, GetStaticPaths } from 'astro';
import {
  artifactPath,
  cheatsheetPath,
  getArtifacts,
  getCheatsheets,
  getPlaybooks,
  getTools,
  playbookPath,
  toolPath,
} from '@/lib/content';
import { plain } from '@/lib/inline';
import type { SearchDoc } from '@/lib/search-types';
import { getArtifactCategory, getToolCategory } from '@/lib/taxonomy';
import { href } from '@/lib/url';
import { localeStaticPaths } from '@/i18n/routing';
import { useTranslations, type Lang } from '@/i18n/ui';

/** One index per language: /search-index.json, /es/search-index.json */
export const getStaticPaths = (() => localeStaticPaths()) satisfies GetStaticPaths;

const words = (...parts: (string | string[] | undefined)[]) =>
  plain(parts.flat().filter(Boolean).join(' · '));

export const GET: APIRoute = async ({ props }) => {
  const lang = (props as { lang: Lang }).lang;
  const t = useTranslations(lang);
  const docs: SearchDoc[] = [];

  for (const a of await getArtifacts(lang)) {
    const d = a.data;
    docs.push({
      k: 'artifact',
      t: d.name,
      u: href(lang, artifactPath(a)),
      c: getArtifactCategory(d.category).label[lang],
      s: d.summary,
      a: d.aliases,
      g: d.tags,
      w: words(d.questions, d.look_for, d.evidence, d.tools, d.locations.map((l) => l.path)),
    });
  }

  for (const x of await getTools(lang)) {
    const d = x.data;
    docs.push({
      k: 'tool',
      t: d.name,
      u: href(lang, toolPath(x)),
      c: getToolCategory(d.category).label[lang],
      s: d.summary,
      a: d.aliases,
      g: d.tags,
      w: words(d.type, d.use_when, d.look_for, d.related_artifacts, d.platforms),
    });
  }

  for (const p of await getPlaybooks(lang)) {
    const d = p.data;
    docs.push({
      k: 'playbook',
      t: d.name,
      u: href(lang, playbookPath(p)),
      c: t('kind.playbookOne'),
      s: d.summary,
      a: [],
      g: d.tags,
      w: words(
        d.trigger,
        d.questions,
        d.steps.map((s) => s.title),
        d.steps.flatMap((s) => s.tools),
        d.iocs,
      ),
    });
  }

  for (const c of await getCheatsheets(lang)) {
    const d = c.data;
    docs.push({
      k: 'cheatsheet',
      t: d.name,
      u: href(lang, cheatsheetPath(c)),
      c: t('kind.cheatsheetOne'),
      s: d.summary,
      a: [],
      g: d.tags,
      w: words(d.sections.map((s) => s.title)),
    });
    // Individual rows (event IDs, commands, locations) are searchable too.
    for (const section of d.sections) {
      section.rows.forEach((row, i) => {
        const [first = '', ...rest] = row;
        docs.push({
          k: 'reference',
          t: plain(first),
          u: href(lang, `${cheatsheetPath(c)}#${section.id}-${i + 1}`),
          c: `${d.name} · ${section.title}`,
          s: plain(rest.filter(Boolean).join(' — ')),
          a: [],
          g: [],
          w: '',
        });
      });
    }
  }

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
