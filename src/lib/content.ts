import { getCollection, type CollectionEntry } from 'astro:content';
import { getArtifactCategory, getToolCategory } from './taxonomy';
import { url } from './url';

export type Tool = CollectionEntry<'tools'>;
export type Artifact = CollectionEntry<'artifacts'>;
export type Playbook = CollectionEntry<'playbooks'>;
export type Cheatsheet = CollectionEntry<'cheatsheets'>;

export type EntryKind = 'artifact' | 'tool' | 'playbook' | 'cheatsheet';

const byName = (a: { data: { name: string } }, b: { data: { name: string } }) =>
  a.data.name.localeCompare(b.data.name, 'en', { sensitivity: 'base' });

const byOrder = (
  a: { data: { order: number; name: string } },
  b: { data: { order: number; name: string } },
) => a.data.order - b.data.order || byName(a, b);

export const getTools = async () => (await getCollection('tools')).sort(byName);
export const getArtifacts = async () => (await getCollection('artifacts')).sort(byName);
export const getPlaybooks = async () => (await getCollection('playbooks')).sort(byOrder);
export const getCheatsheets = async () => (await getCollection('cheatsheets')).sort(byOrder);

/* ---------- URLs ---------- */

export const toolPath = (t: Tool) => `/tools/${t.data.category}/${t.id}/`;
export const artifactPath = (a: Artifact) => `/artifacts/${a.data.category}/${a.id}/`;
export const playbookPath = (p: Playbook) => `/playbooks/${p.id}/`;
export const cheatsheetPath = (c: Cheatsheet) => `/cheatsheets/${c.id}/`;

/* ---------- Reference codes (field-manual style identifiers) ---------- */

export function refCode(kind: EntryKind, id: string, category?: string): string {
  const slug = id.toUpperCase().replace(/[^A-Z0-9]+/g, '-');
  switch (kind) {
    case 'artifact':
      return `ART/${getArtifactCategory(category!).code}/${slug}`;
    case 'tool':
      return `TL/${getToolCategory(category!).code}/${slug}`;
    case 'playbook':
      return `PB/${slug}`;
    case 'cheatsheet':
      return `CS/${slug}`;
  }
}

/* ---------- Cross-reference resolution ---------- */

export interface ResolvedRef {
  label: string;
  href?: string;
  kind?: EntryKind;
}

type RefTarget = Omit<ResolvedRef, 'label'> & { label: string };

let refIndex: Promise<Map<string, RefTarget>> | undefined;

const norm = (s: string) => s.trim().toLowerCase();

async function buildRefIndex(): Promise<Map<string, RefTarget>> {
  const map = new Map<string, RefTarget>();
  const add = (keys: string[], target: RefTarget) => {
    for (const k of keys) if (!map.has(norm(k))) map.set(norm(k), target);
  };
  for (const t of await getTools()) {
    add([t.id, t.data.name, ...t.data.aliases], {
      label: t.data.name,
      href: url(toolPath(t)),
      kind: 'tool',
    });
  }
  for (const a of await getArtifacts()) {
    add([a.id, a.data.name, ...a.data.aliases], {
      label: a.data.name,
      href: url(artifactPath(a)),
      kind: 'artifact',
    });
  }
  for (const p of await getPlaybooks()) {
    add([p.id, p.data.name], { label: p.data.name, href: url(playbookPath(p)), kind: 'playbook' });
  }
  return map;
}

/**
 * Resolve a free-text reference to an internal entry when possible.
 * Unknown references are returned as plain labels (no link).
 */
export async function resolveRef(ref: string): Promise<ResolvedRef> {
  refIndex ??= buildRefIndex();
  const hit = (await refIndex).get(norm(ref));
  return hit ? { ...hit } : { label: ref };
}

export const resolveRefs = (refs: string[]) => Promise.all(refs.map(resolveRef));

/* ---------- Reverse relations ---------- */

/** Tools whose `related_artifacts` mention this artifact, or listed by the artifact itself. */
export async function toolsForArtifact(a: Artifact): Promise<Tool[]> {
  const keys = new Set([a.id, a.data.name, ...a.data.aliases].map(norm));
  return (await getTools()).filter((t) => t.data.related_artifacts.some((r) => keys.has(norm(r))));
}

/** Playbooks that reference an entry (tool or artifact) in any step. */
export async function playbooksReferencing(entry: Tool | Artifact): Promise<Playbook[]> {
  const keys = new Set([entry.id, entry.data.name, ...entry.data.aliases].map(norm));
  return (await getPlaybooks()).filter((p) =>
    p.data.steps.some((s) => [...s.tools, ...s.artifacts].some((r) => keys.has(norm(r)))),
  );
}

/** Artifacts that list this tool in their `tools`. */
export async function artifactsForTool(t: Tool): Promise<Artifact[]> {
  const keys = new Set([t.id, t.data.name, ...t.data.aliases].map(norm));
  return (await getArtifacts()).filter((a) => a.data.tools.some((r) => keys.has(norm(r))));
}
