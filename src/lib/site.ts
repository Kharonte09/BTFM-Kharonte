import type { UiKey } from '@/i18n/ui';

export const SITE = {
  name: 'KHARONTE',
} as const;

export const NAV: readonly { key: UiKey; href: string }[] = [
  { key: 'nav.artifacts', href: '/artifacts/' },
  { key: 'nav.tools', href: '/tools/' },
  { key: 'nav.playbooks', href: '/playbooks/' },
  { key: 'nav.cheatsheets', href: '/cheatsheets/' },
];
