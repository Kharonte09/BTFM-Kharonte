import type { Lang } from '@/i18n/ui';

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
  | 'general'
  | 'terminal'
  | 'indicators';

export type Localized = Record<Lang, string>;

export interface Category {
  id: string;
  label: Localized;
  /** Short code used in reference identifiers, e.g. ART/WIN/PREFETCH */
  code: string;
  description: Localized;
  icon: IconName;
}

export const ARTIFACT_CATEGORIES = [
  {
    id: 'windows',
    label: { en: 'Windows', es: 'Windows' },
    code: 'WIN',
    description: {
      en: 'Event logs, registry, execution and persistence artifacts on Windows endpoints.',
      es: 'Registros de eventos, registro, ejecución y persistencia en endpoints Windows.',
    },
    icon: 'windows',
  },
  {
    id: 'email',
    label: { en: 'Email', es: 'Email' },
    code: 'EML',
    description: {
      en: 'Messages, headers, authentication results, links and attachments.',
      es: 'Mensajes, headers, resultados de autenticación, enlaces y adjuntos.',
    },
    icon: 'email',
  },
  {
    id: 'documents',
    label: { en: 'Documents', es: 'Documentos' },
    code: 'DOC',
    description: {
      en: 'Office documents and PDF — usually delivered as attachments.',
      es: 'Documentos Office y PDF — normalmente llegan como adjuntos.',
    },
    icon: 'documents',
  },
  {
    id: 'binaries',
    label: { en: 'Binaries', es: 'Binarios' },
    code: 'BIN',
    description: {
      en: 'PE executables, DLLs, .NET assemblies and scripts.',
      es: 'Ejecutables PE, DLL, ensamblados .NET y scripts.',
    },
    icon: 'binaries',
  },
  {
    id: 'network',
    label: { en: 'Network', es: 'Red' },
    code: 'NET',
    description: {
      en: 'Packet captures, DNS, HTTP, TLS and infrastructure indicators.',
      es: 'Capturas de tráfico, DNS, HTTP, TLS e indicadores de infraestructura.',
    },
    icon: 'network',
  },
  {
    id: 'memory',
    label: { en: 'Memory', es: 'Memoria' },
    code: 'MEM',
    description: {
      en: 'RAM images: processes, connections, injected code and handles.',
      es: 'Imágenes de RAM: procesos, conexiones, código inyectado y handles.',
    },
    icon: 'memory',
  },
  {
    id: 'indicators',
    label: { en: 'Indicators / IOCs', es: 'Indicadores / IOCs' },
    code: 'IOC',
    description: {
      en: 'IPs, domains, URLs and hashes: things to enrich, scope and pivot on — not evidence sources.',
      es: 'IPs, dominios, URLs y hashes: cosas que enriquecer, acotar y pivotar — no fuentes de evidencia.',
    },
    icon: 'indicators',
  },
] as const satisfies readonly Category[];

export const TOOL_CATEGORIES = [
  {
    id: 'dfir',
    label: { en: 'DFIR', es: 'DFIR' },
    code: 'DFIR',
    description: {
      en: 'Collection, triage and forensic acquisition.',
      es: 'Recolección, triage y adquisición forense.',
    },
    icon: 'dfir',
  },
  {
    id: 'windows',
    label: { en: 'Windows Forensics', es: 'Windows Forensics' },
    code: 'WIN',
    description: {
      en: 'Parsers for Windows artifacts — mostly Eric Zimmerman tools.',
      es: 'Parsers de artefactos Windows, sobre todo las herramientas de Eric Zimmerman.',
    },
    icon: 'windows',
  },
  {
    id: 'malware-analysis',
    label: { en: 'Malware Analysis', es: 'Análisis de malware' },
    code: 'MAL',
    description: {
      en: 'File identification, static analysis, rules and reputation.',
      es: 'Identificación de ficheros, análisis estático, reglas y reputación.',
    },
    icon: 'malware',
  },
  {
    id: 'network',
    label: { en: 'Network', es: 'Red' },
    code: 'NET',
    description: { en: 'Packet and protocol analysis.', es: 'Análisis de paquetes y protocolos.' },
    icon: 'network',
  },
  {
    id: 'reversing',
    label: { en: 'Reversing', es: 'Reversing' },
    code: 'REV',
    description: {
      en: 'Disassemblers, decompilers and debuggers.',
      es: 'Desensambladores, descompiladores y depuradores.',
    },
    icon: 'reversing',
  },
  {
    id: 'general',
    label: { en: 'General', es: 'General' },
    code: 'GEN',
    description: {
      en: 'Decoding, data wrangling and shell utilities.',
      es: 'Decodificación, tratamiento de datos y utilidades de shell.',
    },
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

export const ICON_NAMES = [
  'windows',
  'email',
  'documents',
  'binaries',
  'network',
  'memory',
  'dfir',
  'malware',
  'reversing',
  'general',
  'terminal',
  'indicators',
] as const satisfies readonly IconName[];

/** Author's knowledge level of an entry (shown as "Coverage"). */
export const COVERAGE = ['basic', 'intermediate', 'advanced'] as const;
export type Coverage = (typeof COVERAGE)[number];
