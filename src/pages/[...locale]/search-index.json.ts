import type { APIRoute, GetStaticPaths } from 'astro';
import {
  artifactPath,
  getArtifacts,
  getPlaybooks,
  getTools,
  playbookPath,
  playbooksReferencing,
  resolveRefs,
  toolPath,
} from '@/lib/content';
import { plain } from '@/lib/inline';
import type { SearchDoc } from '@/lib/search-types';
import { getArtifactCategory, getToolCategory } from '@/lib/taxonomy';
import { href } from '@/lib/url';
import { localeStaticPaths } from '@/i18n/routing';
import type { Lang } from '@/i18n/ui';

/** One index per language: /search-index.json, /es/search-index.json */
export const getStaticPaths = (() => localeStaticPaths()) satisfies GetStaticPaths;

const words = (...parts: (string | string[] | undefined)[]) =>
  plain(parts.flat().filter(Boolean).join(' · '));

export const GET: APIRoute = async ({ props }) => {
  const lang = (props as { lang: Lang }).lang;
  const docs: SearchDoc[] = [];

  const pbNames = async (entry: Parameters<typeof playbooksReferencing>[0]) =>
    (await playbooksReferencing(entry, lang)).map((p) => p.data.name);
  const toolNames = async (refs: string[]) => (await resolveRefs(refs, lang)).map((r) => r.label);

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
      w: words(d.why, d.questions, d.look_for, d.start_here, d.extract, d.locations.map((l) => l.path)),
      p: await pbNames(a),
      x: await toolNames(d.tools_start),
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
      w: words(d.type, d.use_when, d.look_for, d.related_artifacts),
      p: await pbNames(x),
    });
  }

  for (const p of await getPlaybooks(lang)) {
    const d = p.data;
    docs.push({
      k: 'playbook',
      t: d.name,
      u: href(lang, playbookPath(p)),
      c: d.scenario,
      s: d.summary,
      a: [],
      g: d.tags,
      w: words(
        d.trigger,
        d.objective,
        d.questions,
        d.initial_triage,
        d.steps.map((s) => s.title),
        d.iocs,
      ),
      x: await toolNames([...new Set(d.steps.flatMap((s) => s.tools))].slice(0, 6)),
    });
  }

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
