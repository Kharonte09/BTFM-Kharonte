/** Shape of each document in /search-index.json (shared by server and client). */
export type SearchKind = 'artifact' | 'tool' | 'playbook' | 'detection';

export interface SearchDoc {
  /** kind */
  k: SearchKind;
  /** title */
  t: string;
  /** url (already base- and locale-prefixed) */
  u: string;
  /** context label: category or kind */
  c: string;
  /** summary */
  s: string;
  /** aliases */
  a: string[];
  /** tags */
  g: string[];
  /** extra keywords (look_for, questions, steps...) */
  w: string;
  /** "Useful for": playbooks that use this entry */
  p?: string[];
  /** "Tools": tools to start with */
  x?: string[];
}

/** Localised strings the client-side search needs (passed via data-strings). */
export interface SearchStrings {
  kinds: Record<SearchKind, string>;
  /** "{q}" is replaced with the query */
  none: string;
  related: string;
  usefulFor: string;
  tools: string;
  /** "{n}" is replaced with the count */
  one: string;
  many: string;
  error: string;
}

export const KIND_ORDER: SearchKind[] = ['playbook', 'detection', 'artifact', 'tool'];
