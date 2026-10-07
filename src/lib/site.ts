export const SITE = {
  name: 'KHARONTE',
  title: 'KHARONTE — Blue Team Field Manual',
  tagline: 'A practical reference for DFIR, detection and malware analysis.',
  description:
    'Open-source Blue Team field manual: artifacts, tools, playbooks and cheatsheets for DFIR, detection engineering and malware analysis.',
} as const;

export const NAV = [
  { label: 'Artifacts', href: '/artifacts/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Playbooks', href: '/playbooks/' },
  { label: 'Cheatsheets', href: '/cheatsheets/' },
] as const;
