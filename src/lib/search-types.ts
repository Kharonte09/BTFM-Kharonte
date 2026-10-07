/** Shape of each document in /search-index.json (shared by server and client). */
export type SearchKind = 'artifact' | 'tool' | 'playbook' | 'cheatsheet' | 'reference';

export interface SearchDoc {
  /** kind */
  k: SearchKind;
  /** title */
  t: string;
  /** url (already base-prefixed) */
  u: string;
  /** context label: category or cheatsheet section */
  c: string;
  /** summary */
  s: string;
  /** aliases */
  a: string[];
  /** tags */
  g: string[];
  /** extra keywords (look_for, questions, steps...) */
  w: string;
}

export const KIND_LABEL: Record<SearchKind, string> = {
  artifact: 'Artifacts',
  tool: 'Tools',
  playbook: 'Playbooks',
  cheatsheet: 'Cheatsheets',
  reference: 'Reference',
};

export const KIND_ORDER: SearchKind[] = ['artifact', 'tool', 'playbook', 'cheatsheet', 'reference'];
