/**
 * Fixed taxonomy for the field manual. Categories are code, not content:
 * adding a new category is a deliberate structural change.
 * Content entries reference these ids in their frontmatter.
 */

export type IconName =
  | 'windows'
  | 'email'
  | 'documents'
  | 'binaries'
  | 'network'
  | 'memory'
  | 'dfir'
  | 'malware'
  | 'reversing'
  | 'general';

export interface Category {
  id: string;
  label: string;
  /** Short code used in reference identifiers, e.g. ART/WIN/PREFETCH */
  code: string;
  description: string;
  icon: IconName;
}

export const ARTIFACT_CATEGORIES = [
  {
    id: 'windows',
    label: 'Windows',
    code: 'WIN',
    description: 'Event logs, registry, execution and persistence artifacts on Windows endpoints.',
    icon: 'windows',
  },
  {
    id: 'email',
    label: 'Email',
    code: 'EML',
    description: 'Messages, headers, authentication results, links and attachments.',
    icon: 'email',
  },
  {
    id: 'documents',
    label: 'Documents',
    code: 'DOC',
    description: 'Office files, OLE containers, macros and PDF.',
    icon: 'documents',
  },
  {
    id: 'binaries',
    label: 'Binaries',
    code: 'BIN',
    description: 'PE executables, DLLs, .NET assemblies and scripts.',
    icon: 'binaries',
  },
  {
    id: 'network',
    label: 'Network',
    code: 'NET',
    description: 'Packet captures, DNS, HTTP, TLS and infrastructure indicators.',
    icon: 'network',
  },
  {
    id: 'memory',
    label: 'Memory',
    code: 'MEM',
    description: 'RAM images: processes, connections, injected code and handles.',
    icon: 'memory',
  },
] as const satisfies readonly Category[];

export const TOOL_CATEGORIES = [
  {
    id: 'dfir',
    label: 'DFIR',
    code: 'DFIR',
    description: 'Collection, triage and forensic acquisition.',
    icon: 'dfir',
  },
  {
    id: 'windows',
    label: 'Windows Forensics',
    code: 'WIN',
    description: 'Parsers for Windows artifacts — mostly Eric Zimmerman tools.',
    icon: 'windows',
  },
  {
    id: 'malware-analysis',
    label: 'Malware Analysis',
    code: 'MAL',
    description: 'File identification, static analysis, rules and reputation.',
    icon: 'malware',
  },
  {
    id: 'network',
    label: 'Network',
    code: 'NET',
    description: 'Packet and protocol analysis.',
    icon: 'network',
  },
  {
    id: 'reversing',
    label: 'Reversing',
    code: 'REV',
    description: 'Disassemblers, decompilers and debuggers.',
    icon: 'reversing',
  },
  {
    id: 'general',
    label: 'General',
    code: 'GEN',
    description: 'Decoding, data wrangling and shell utilities.',
    icon: 'general',
  },
] as const satisfies readonly Category[];

export type ArtifactCategoryId = (typeof ARTIFACT_CATEGORIES)[number]['id'];
export type ToolCategoryId = (typeof TOOL_CATEGORIES)[number]['id'];

export const artifactCategoryIds = ARTIFACT_CATEGORIES.map((c) => c.id) as [
  ArtifactCategoryId,
  ...ArtifactCategoryId[],
];
export const toolCategoryIds = TOOL_CATEGORIES.map((c) => c.id) as [
  ToolCategoryId,
  ...ToolCategoryId[],
];

export function getArtifactCategory(id: string): Category {
  const found = ARTIFACT_CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown artifact category: ${id}`);
  return found;
}

export function getToolCategory(id: string): Category {
  const found = TOOL_CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown tool category: ${id}`);
  return found;
}

export const DIFFICULTY = ['basic', 'intermediate', 'advanced'] as const;
export type Difficulty = (typeof DIFFICULTY)[number];
