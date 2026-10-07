import type { APIRoute } from 'astro';
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
import { url } from '@/lib/url';

const words = (...parts: (string | string[] | undefined)[]) =>
  plain(parts.flat().filter(Boolean).join(' · '));

export const GET: APIRoute = async () => {
  const docs: SearchDoc[] = [];

  for (const a of await getArtifacts()) {
    const d = a.data;
    docs.push({
      k: 'artifact',
      t: d.name,
      u: url(artifactPath(a)),
      c: getArtifactCategory(d.category).label,
      s: d.summary,
      a: d.aliases,
      g: d.tags,
      w: words(d.questions, d.look_for, d.evidence, d.tools, d.locations.map((l) => l.path)),
    });
  }

  for (const t of await getTools()) {
    const d = t.data;
    docs.push({
      k: 'tool',
      t: d.name,
      u: url(toolPath(t)),
      c: getToolCategory(d.category).label,
      s: d.summary,
      a: d.aliases,
      g: d.tags,
      w: words(d.type, d.use_when, d.look_for, d.related_artifacts, d.platforms),
    });
  }

  for (const p of await getPlaybooks()) {
    const d = p.data;
    docs.push({
      k: 'playbook',
      t: d.name,
      u: url(playbookPath(p)),
      c: 'Playbook',
      s: d.summary,
      a: [],
      g: d.tags,
      w: words(
        d.trigger,
        d.steps.map((s) => s.title),
        d.steps.flatMap((s) => s.tools),
        d.iocs,
      ),
    });
  }

  for (const c of await getCheatsheets()) {
    const d = c.data;
    docs.push({
      k: 'cheatsheet',
      t: d.name,
      u: url(cheatsheetPath(c)),
      c: 'Cheatsheet',
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
          u: url(`${cheatsheetPath(c)}#${section.id}-${i + 1}`),
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
