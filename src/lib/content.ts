import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LANG, type Lang } from '@/i18n/ui';
import { getArtifactCategory, getToolCategory } from './taxonomy';
import { href } from './url';

/**
 * Content is stored per language: src/content/<collection>/<lang>/<slug>.md
 * Entry ids are therefore "<lang>/<slug>". Every accessor here takes a `lang`
 * and returns, for each slug, the translation in that language — or the
 * default-language entry as a fallback (see isFallback()).
 */

export type Tool = CollectionEntry<'tools'>;
export type Artifact = CollectionEntry<'artifacts'>;
export type Playbook = CollectionEntry<'playbooks'>;
type AnyEntry = Tool | Artifact | Playbook;
type CollectionName = 'tools' | 'artifacts' | 'playbooks';

export type EntryKind = 'artifact' | 'tool' | 'playbook';

export const slugOf = (e: AnyEntry) => e.id.slice(e.id.indexOf('/') + 1);
export const langOf = (e: AnyEntry) => e.id.slice(0, e.id.indexOf('/')) as Lang;
/** True when the entry is shown in `lang` but only exists in the default language. */
export const isFallback = (e: AnyEntry, lang: Lang) => langOf(e) !== lang;

async function localized<C extends CollectionName>(
  name: C,
  lang: Lang,
): Promise<CollectionEntry<C>[]> {
  const all = (await getCollection(name)) as CollectionEntry<C>[];
  const bySlug = new Map<string, CollectionEntry<C>>();
  for (const e of all) {
    const l = langOf(e as AnyEntry);
    const slug = slugOf(e as AnyEntry);
    if (l === lang || (l === DEFAULT_LANG && !bySlug.has(slug))) bySlug.set(slug, e);
  }
  return [...bySlug.values()];
}

const byName = (a: { data: { name: string } }, b: { data: { name: string } }) =>
  a.data.name.localeCompare(b.data.name, 'en', { sensitivity: 'base' });

const byOrder = (
  a: { data: { order: number; name: string } },
  b: { data: { order: number; name: string } },
) => a.data.order - b.data.order || byName(a, b);

export const getTools = async (lang: Lang) => (await localized('tools', lang)).sort(byName);
export const getArtifacts = async (lang: Lang) => (await localized('artifacts', lang)).sort(byName);
export const getPlaybooks = async (lang: Lang) => (await localized('playbooks', lang)).sort(byOrder);

/* ---------- Paths (unlocalised; wrap with href(lang, …)) ---------- */

export const toolPath = (t: Tool) => `/tools/${t.data.category}/${slugOf(t)}/`;
export const artifactPath = (a: Artifact) => `/artifacts/${a.data.category}/${slugOf(a)}/`;
export const playbookPath = (p: Playbook) => `/playbooks/${slugOf(p)}/`;

/* ---------- Reference codes (field-manual style identifiers) ---------- */

export function refCode(kind: EntryKind, slug: string, category?: string): string {
  const s = slug.toUpperCase().replace(/[^A-Z0-9]+/g, '-');
  switch (kind) {
    case 'artifact':
      return `ART/${getArtifactCategory(category!).code}/${s}`;
    case 'tool':
      return `TL/${getToolCategory(category!).code}/${s}`;
    case 'playbook':
      return `PB/${s}`;
  }
}

/* ---------- Cross-reference resolution ---------- */

export interface ResolvedRef {
  label: string;
  href?: string;
  kind?: EntryKind;
}

const norm = (s: string) => s.trim().toLowerCase();
type Target = { kind: EntryKind; slug: string };

let keyIndex: Promise<Map<string, Target>> | undefined;

/** Maps every slug, name and alias (in every language) to its entry. */
function buildKeyIndex(): Promise<Map<string, Target>> {
  return (async () => {
    const map = new Map<string, Target>();
    const add = (keys: string[], t: Target) => {
      for (const k of keys) if (!map.has(norm(k))) map.set(norm(k), t);
    };
    const [tools, artifacts, playbooks] = await Promise.all([
      getCollection('tools'),
      getCollection('artifacts'),
      getCollection('playbooks'),
    ]);
    // Default language first so its names win on collisions.
    const ordered = <T extends AnyEntry>(xs: T[]) =>
      [...xs].sort((a, b) => Number(langOf(a) !== DEFAULT_LANG) - Number(langOf(b) !== DEFAULT_LANG));
    for (const t of ordered(tools)) add([slugOf(t), t.data.name, ...t.data.aliases], { kind: 'tool', slug: slugOf(t) });
    for (const a of ordered(artifacts))
      add([slugOf(a), a.data.name, ...a.data.aliases], { kind: 'artifact', slug: slugOf(a) });
    for (const p of ordered(playbooks)) add([slugOf(p), p.data.name], { kind: 'playbook', slug: slugOf(p) });
    return map;
  })();
}

async function lookup(ref: string): Promise<Target | undefined> {
  keyIndex ??= buildKeyIndex();
  return (await keyIndex).get(norm(ref));
}

/**
 * Resolve a free-text reference to an internal entry when possible.
 * Unknown references are returned as plain labels (no link).
 */
export async function resolveRef(ref: string, lang: Lang): Promise<ResolvedRef> {
  const hit = await lookup(ref);
  if (!hit) return { label: ref };
  if (hit.kind === 'tool') {
    const t = (await getTools(lang)).find((x) => slugOf(x) === hit.slug)!;
    return { label: t.data.name, href: href(lang, toolPath(t)), kind: 'tool' };
  }
  if (hit.kind === 'artifact') {
    const a = (await getArtifacts(lang)).find((x) => slugOf(x) === hit.slug)!;
    return { label: a.data.name, href: href(lang, artifactPath(a)), kind: 'artifact' };
  }
  const p = (await getPlaybooks(lang)).find((x) => slugOf(x) === hit.slug)!;
  return { label: p.data.name, href: href(lang, playbookPath(p)), kind: 'playbook' };
}

export const resolveRefs = (refs: string[], lang: Lang) =>
  Promise.all(refs.map((r) => resolveRef(r, lang)));

/** Do any of these references point to the entry with this slug? */
async function refersTo(refs: string[], slug: string): Promise<boolean> {
  for (const r of refs) if ((await lookup(r))?.slug === slug) return true;
  return false;
}

/* ---------- Reverse relations ---------- */

/** Tools whose `related_artifacts` mention this artifact. */
export async function toolsForArtifact(a: Artifact, lang: Lang): Promise<Tool[]> {
  const out: Tool[] = [];
  for (const t of await getTools(lang)) if (await refersTo(t.data.related_artifacts, slugOf(a))) out.push(t);
  return out;
}

/** Every tool an artifact mentions (start, deeper and per-tool questions). */
export const artifactToolRefs = (a: Artifact) => [
  ...a.data.tools_start,
  ...a.data.tools_deeper,
  ...a.data.tool_questions.map((q) => q.tool),
];

/** Artifacts that list this tool. */
export async function artifactsForTool(t: Tool, lang: Lang): Promise<Artifact[]> {
  const out: Artifact[] = [];
  for (const a of await getArtifacts(lang)) if (await refersTo(artifactToolRefs(a), slugOf(t))) out.push(a);
  return out;
}

/** Playbooks that reference an entry (tool or artifact) in any step. */
export async function playbooksReferencing(entry: Tool | Artifact, lang: Lang): Promise<Playbook[]> {
  const out: Playbook[] = [];
  for (const p of await getPlaybooks(lang)) {
    const refs = p.data.steps.flatMap((s) => [...s.tools, ...s.artifacts]);
    if (await refersTo(refs, slugOf(entry))) out.push(p);
  }
  return out;
}
