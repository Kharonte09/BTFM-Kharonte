import type { IconName, Localized } from './taxonomy';

/**
 * Home page "Start with what you have" entry points. Each one sends the
 * analyst to the most useful starting page: a playbook when there is a full
 * investigation, otherwise the artifact page.
 */
export interface EntryPoint {
  id: string;
  icon: IconName;
  label: Localized;
  hint: Localized;
  target: { kind: 'playbook' | 'artifact'; slug: string };
}

export const ENTRY_POINTS: EntryPoint[] = [
  {
    id: 'email',
    icon: 'email',
    label: { en: 'Email', es: 'Email' },
    hint: { en: 'Suspicious message, link or attachment', es: 'Mensaje, enlace o adjunto sospechoso' },
    target: { kind: 'playbook', slug: 'phishing-investigation' },
  },
  {
    id: 'file',
    icon: 'malware',
    label: { en: 'Suspicious file', es: 'Fichero sospechoso' },
    hint: { en: 'EXE, DLL, document or unknown file', es: 'EXE, DLL, documento o fichero desconocido' },
    target: { kind: 'playbook', slug: 'malware-triage' },
  },
  {
    id: 'endpoint',
    icon: 'windows',
    label: { en: 'Windows endpoint', es: 'Endpoint Windows' },
    hint: { en: 'A host you think is compromised', es: 'Un equipo que crees comprometido' },
    target: { kind: 'playbook', slug: 'windows-endpoint-investigation' },
  },
  {
    id: 'network',
    icon: 'network',
    label: { en: 'Network traffic', es: 'Tráfico de red' },
    hint: { en: 'A PCAP to analyse', es: 'Un PCAP que analizar' },
    target: { kind: 'artifact', slug: 'pcap' },
  },
  {
    id: 'powershell',
    icon: 'terminal',
    label: { en: 'PowerShell', es: 'PowerShell' },
    hint: { en: 'Encoded or suspicious commands', es: 'Comandos codificados o sospechosos' },
    target: { kind: 'playbook', slug: 'suspicious-powershell' },
  },
  {
    id: 'memory',
    icon: 'memory',
    label: { en: 'Memory', es: 'Memoria' },
    hint: { en: 'A RAM image', es: 'Una imagen de RAM' },
    target: { kind: 'artifact', slug: 'memory-dump' },
  },
];
