/**
 * UI strings. Content (tools, artifacts…) is translated in src/content/<collection>/<lang>/,
 * this file only covers the interface.
 */
export const LOCALES = ['en', 'es'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_NAMES: Record<Lang, string> = { en: 'English', es: 'Español' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', es: 'es_ES' };

const en = {
  'site.title': 'KHARONTE — Blue Team Field Manual',
  'site.description':
    'Open-source Blue Team field manual: artifacts, tools, playbooks and cheatsheets for DFIR, detection engineering and malware analysis.',

  'nav.artifacts': 'Artifacts',
  'nav.tools': 'Tools',
  'nav.playbooks': 'Playbooks',
  'nav.cheatsheets': 'Cheatsheets',
  'nav.search': 'Search',
  'nav.about': 'About',
  'nav.main': 'Main',
  'nav.footer': 'Footer',
  'nav.menu': 'Menu',
  'nav.skip': 'Skip to content',
  'nav.home': 'KHARONTE — home',
  'nav.searchAria': 'Search (press / or Ctrl+K)',
  'nav.subtitle': 'Blue Team Field Manual',

  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'lang.label': 'Language',

  'footer.disclaimer':
    'A technical reference to support analysis — not a replacement for the analyst. Verify against primary sources before acting on any entry.',
  'footer.meta': 'Static · No tracking · No external APIs · Open source',

  'crumb.index': 'Index',
  'crumb.label': 'Breadcrumb',
  'toc.title': 'On this page',
  'entry.details': 'Entry details',

  'meta.category': 'Category',
  'meta.type': 'Type',
  'meta.platform': 'Platform',
  'meta.license': 'License',
  'meta.level': 'Level',
  'meta.also': 'Also',
  'meta.official': 'Official',
  'meta.updated': 'Updated',
  'meta.tags': 'Tags',
  'meta.steps': 'Steps',

  'difficulty.basic': 'basic',
  'difficulty.intermediate': 'intermediate',
  'difficulty.advanced': 'advanced',

  'review.title': 'Pending review.',
  'review.body':
    'Parts of this entry have not been fully verified. Cross-check with the official documentation before relying on it.',
  'fallback.title': 'Not translated yet.',
  'fallback.body': 'This entry is only available in English for now.',

  'sec.what': 'What is it?',
  'sec.useWhen': 'Use it when',
  'sec.lookFor': 'Look for',
  'sec.workflow': 'Typical workflow',
  'sec.examples': 'Examples',
  'sec.output': 'Output',
  'sec.notes': 'Operational notes',
  'sec.complements': 'Complements',
  'sec.related': 'Related',
  'sec.evidence': 'Evidence provided',
  'sec.location': 'Where to find it',
  'sec.questions': 'Questions answered',
  'sec.tools': 'Tools',
  'sec.limitations': 'Limitations',
  'sec.start': 'Start here when',
  'sec.steps': 'Workflow',
  'sec.iocs': 'IOCs to extract',
  'sec.escalateWhen': 'Escalate when',
  'sec.pbNotes': 'Notes',
  'sec.relatedPlaybooks': 'Related playbooks',

  'related.artifacts': 'Artifacts',
  'related.usedIn': 'Used in playbooks',
  'step.tools': 'Tools',
  'step.artifacts': 'Artifacts',
  'step.escalate': 'Escalate',
  'ref.missing': 'Not documented in Kharonte yet',
  'flow.label': 'Workflow',

  'copy.copy': 'copy',
  'copy.copied': 'copied',
  'copy.failed': 'failed',
  'copy.aria': 'Copy command',

  'search.label': 'Search tools, artifacts, techniques',
  'search.placeholder': 'Search tools, artifacts, event IDs, techniques…',
  'search.try': 'Try',
  'search.results': 'Search results',
  'search.count.one': '{n} result',
  'search.count.many': '{n} results',
  'search.none': 'No matches for “{q}”. Try a tool, artifact, event ID or technique.',
  'search.related': 'Related',
  'search.error': 'Search index could not be loaded.',
  'search.navigate': 'navigate',
  'search.open': 'open',
  'search.close': 'close',
  'search.dialog': 'Search the field manual',
  'search.noscript': 'Search requires JavaScript. Browse the sections from the main menu instead.',
  'search.title': 'Search',
  'search.summary':
    'Tools, artifacts, playbooks, event IDs, commands and techniques. Everything runs in your browser.',
  'search.description':
    'Search tools, artifacts, playbooks, event IDs and commands in the Kharonte field manual.',

  'kind.artifact': 'Artifacts',
  'kind.tool': 'Tools',
  'kind.playbook': 'Playbooks',
  'kind.cheatsheet': 'Cheatsheets',
  'kind.reference': 'Reference',
  'kind.playbookOne': 'Playbook',
  'kind.cheatsheetOne': 'Cheatsheet',

  'cat.entries': '{n} entries',
  'cat.empty': 'No entries yet. Contributions welcome.',
  'cat.nav.artifacts': 'Artifact categories',
  'cat.nav.tools': 'Tool categories',

  'artifacts.title': 'Artifacts',
  'artifacts.summary':
    'Evidence you will meet during an investigation: what it is, where it lives, which questions it answers and which tools parse it.',
  'artifacts.catTitle': '{label} artifacts',
  'tools.title': 'Tools',
  'tools.summary':
    'Tool reference cards: when to reach for each tool, what to look for in its output and what to run next.',
  'tools.catTitle': '{label} tools',
  'playbooks.title': 'Playbooks',
  'playbooks.summary':
    'High-level investigation workflows. Each step states its goal, the tools and artifacts involved, and when to escalate.',
  'playbooks.steps': '{n} steps',
  'cheatsheets.title': 'Cheatsheets',
  'cheatsheets.summary': 'Filterable quick-reference tables for use during an investigation.',
  'cheatsheets.rows': '{n} rows',
  'cheatsheets.sections': 'Sections',
  'cheatsheets.filter': 'Filter rows',
  'cheatsheets.filterPlaceholder': 'Filter rows… (e.g. 4624, logon, Get-WinEvent)',

  'home.kicker': 'Ref. manual · v0.1',
  'home.h1a': 'Blue Team',
  'home.h1b': 'Field Manual',
  'home.lead': 'A practical reference for DFIR, detection and malware analysis.',
  'home.lead2': 'You have an artifact in front of you — what do you do next?',
  'home.contents': 'Contents',
  'home.start': 'Start with an artifact',
  'home.allArtifacts': 'All artifacts →',
  'home.playbooks': 'Playbooks',
  'home.allPlaybooks': 'All playbooks →',
  'home.tools': 'Tools',
  'home.allTools': 'All tools →',
  'home.cheatsheets': 'Cheatsheets',
  'home.scope': 'Scope',
  'home.scopeText':
    'Kharonte is a reference to support your analysis, not an automated analyst. It never executes samples and does not call external services. Verify findings against primary sources.',

  'about.title': 'About this manual',
  'about.summary':
    'Kharonte is an open-source reference for Blue Team, DFIR and malware analysis work. It helps you decide what to look at next — it does not analyse anything for you.',
  'about.description': 'What Kharonte is, what it is not, and how its content is written.',
  'about.principles': 'Principles',
  'about.p1':
    '**Reference, not an analyst.** Entries describe what to check, which tools help and what output matters. The judgement stays with you.',
  'about.p2':
    '**Workflow first.** Every page answers: what is this, what do I check first, what next, what can I extract as an IOC, and when do I escalate.',
  'about.p3':
    '**No invented capabilities.** Tool behaviour is described conservatively. Entries that still need verification carry a visible **Pending review** notice.',
  'about.p4':
    '**Facts vs. recommendations.** “Look for” and “Operational notes” are analyst guidance; “Evidence”, “Where to find it” and “Output” are factual.',
  'about.safety': 'Safety',
  'about.s1': 'The site is fully static. It does not execute samples or scripts and does not call external APIs.',
  'about.s2': 'Commands are shown for reference only. Run them in an appropriate, isolated environment.',
  'about.s3':
    'Uploading a file to public services (e.g. VirusTotal, public sandboxes) can disclose it. Check your organisation’s policy and prefer hash lookups.',
  'about.s4': 'The repository contains no samples, secrets or personal data.',
  'about.contribute': 'Contributing',
  'about.c1':
    'Content lives in Markdown/YAML files under `src/content/`. See the repository README for the content model and how to add tools, artifacts, playbooks and cheatsheets.',

  'nf.title': 'Not found',
  'nf.kicker': '404 · No artifact at this path',
  'nf.h1': 'Nothing recovered here.',
  'nf.body': 'The page may have moved. Search the manual or go back to the',
  'nf.index': 'index',
} as const;

export type UiKey = keyof typeof en;

const es: Record<UiKey, string> = {
  'site.title': 'KHARONTE — Blue Team Field Manual',
  'site.description':
    'Blue Team Field Manual de código abierto: artefactos, herramientas, playbooks y cheatsheets para DFIR, ingeniería de detección y análisis de malware.',

  'nav.artifacts': 'Artefactos',
  'nav.tools': 'Herramientas',
  'nav.playbooks': 'Playbooks',
  'nav.cheatsheets': 'Cheatsheets',
  'nav.search': 'Buscar',
  'nav.about': 'Acerca de',
  'nav.main': 'Principal',
  'nav.footer': 'Pie de página',
  'nav.menu': 'Menú',
  'nav.skip': 'Saltar al contenido',
  'nav.home': 'KHARONTE — inicio',
  'nav.searchAria': 'Buscar (pulsa / o Ctrl+K)',
  'nav.subtitle': 'Blue Team Field Manual',

  'theme.toLight': 'Cambiar a tema claro',
  'theme.toDark': 'Cambiar a tema oscuro',
  'lang.label': 'Idioma',

  'footer.disclaimer':
    'Una referencia técnica para apoyar el análisis, no un sustituto del analista. Contrasta con fuentes primarias antes de actuar sobre cualquier ficha.',
  'footer.meta': 'Estático · Sin rastreo · Sin APIs externas · Código abierto',

  'crumb.index': 'Inicio',
  'crumb.label': 'Ruta de navegación',
  'toc.title': 'En esta página',
  'entry.details': 'Detalles de la ficha',

  'meta.category': 'Categoría',
  'meta.type': 'Tipo',
  'meta.platform': 'Plataforma',
  'meta.license': 'Licencia',
  'meta.level': 'Nivel',
  'meta.also': 'También',
  'meta.official': 'Oficial',
  'meta.updated': 'Actualizado',
  'meta.tags': 'Etiquetas',
  'meta.steps': 'Pasos',

  'difficulty.basic': 'básico',
  'difficulty.intermediate': 'intermedio',
  'difficulty.advanced': 'avanzado',

  'review.title': 'Pendiente de revisión.',
  'review.body':
    'Partes de esta ficha no se han verificado por completo. Contrasta con la documentación oficial antes de confiar en ella.',
  'fallback.title': 'Aún sin traducir.',
  'fallback.body': 'Por ahora esta ficha solo está disponible en inglés.',

  'sec.what': '¿Qué es?',
  'sec.useWhen': 'Úsala cuando',
  'sec.lookFor': 'Qué buscar',
  'sec.workflow': 'Workflow típico',
  'sec.examples': 'Ejemplos',
  'sec.output': 'Salida',
  'sec.notes': 'Notas operativas',
  'sec.complements': 'Complementos',
  'sec.related': 'Relacionado',
  'sec.evidence': 'Evidencia que aporta',
  'sec.location': 'Dónde encontrarlo',
  'sec.questions': 'Preguntas que responde',
  'sec.tools': 'Herramientas',
  'sec.limitations': 'Limitaciones',
  'sec.start': 'Empieza aquí cuando',
  'sec.steps': 'Workflow',
  'sec.iocs': 'IOCs a extraer',
  'sec.escalateWhen': 'Escala cuando',
  'sec.pbNotes': 'Notas',
  'sec.relatedPlaybooks': 'Playbooks relacionados',

  'related.artifacts': 'Artefactos',
  'related.usedIn': 'Se usa en los playbooks',
  'step.tools': 'Herramientas',
  'step.artifacts': 'Artefactos',
  'step.escalate': 'Escalar',
  'ref.missing': 'Aún no documentado en Kharonte',
  'flow.label': 'Workflow',

  'copy.copy': 'copiar',
  'copy.copied': 'copiado',
  'copy.failed': 'error',
  'copy.aria': 'Copiar comando',

  'search.label': 'Buscar herramientas, artefactos, técnicas',
  'search.placeholder': 'Busca herramientas, artefactos, Event IDs, técnicas…',
  'search.try': 'Prueba',
  'search.results': 'Resultados de búsqueda',
  'search.count.one': '{n} resultado',
  'search.count.many': '{n} resultados',
  'search.none': 'Sin resultados para «{q}». Prueba con una herramienta, artefacto, Event ID o técnica.',
  'search.related': 'Relacionado',
  'search.error': 'No se pudo cargar el índice de búsqueda.',
  'search.navigate': 'moverse',
  'search.open': 'abrir',
  'search.close': 'cerrar',
  'search.dialog': 'Buscar en el Field Manual',
  'search.noscript': 'La búsqueda necesita JavaScript. Navega por las secciones desde el menú principal.',
  'search.title': 'Buscar',
  'search.summary':
    'Herramientas, artefactos, playbooks, Event IDs, comandos y técnicas. Todo se ejecuta en tu navegador.',
  'search.description':
    'Busca herramientas, artefactos, playbooks, Event IDs y comandos en el Field Manual de Kharonte.',

  'kind.artifact': 'Artefactos',
  'kind.tool': 'Herramientas',
  'kind.playbook': 'Playbooks',
  'kind.cheatsheet': 'Cheatsheets',
  'kind.reference': 'Referencia',
  'kind.playbookOne': 'Playbook',
  'kind.cheatsheetOne': 'Cheatsheet',

  'cat.entries': '{n} fichas',
  'cat.empty': 'Aún no hay fichas. Se aceptan contribuciones.',
  'cat.nav.artifacts': 'Categorías de artefactos',
  'cat.nav.tools': 'Categorías de herramientas',

  'artifacts.title': 'Artefactos',
  'artifacts.summary':
    'Evidencias que encontrarás en una investigación: qué son, dónde están, qué preguntas responden y qué herramientas las analizan.',
  'artifacts.catTitle': 'Artefactos: {label}',
  'tools.title': 'Herramientas',
  'tools.summary':
    'Fichas de herramientas: cuándo usar cada una, qué buscar en su salida y qué ejecutar después.',
  'tools.catTitle': 'Herramientas: {label}',
  'playbooks.title': 'Playbooks',
  'playbooks.summary':
    'Workflows de investigación de alto nivel. Cada paso indica su objetivo, las herramientas y artefactos implicados y cuándo escalar.',
  'playbooks.steps': '{n} pasos',
  'cheatsheets.title': 'Cheatsheets',
  'cheatsheets.summary': 'Tablas de consulta rápida con filtro, para usar durante una investigación.',
  'cheatsheets.rows': '{n} filas',
  'cheatsheets.sections': 'Secciones',
  'cheatsheets.filter': 'Filtrar filas',
  'cheatsheets.filterPlaceholder': 'Filtrar filas… (p. ej. 4624, logon, Get-WinEvent)',

  'home.kicker': 'Ref. manual · v0.1',
  'home.h1a': 'Blue Team',
  'home.h1b': 'Field Manual',
  'home.lead': 'Una referencia práctica para DFIR, detección y análisis de malware.',
  'home.lead2': 'Tienes un artefacto delante: ¿qué haces ahora?',
  'home.contents': 'Contenido',
  'home.start': 'Empieza por un artefacto',
  'home.allArtifacts': 'Todos los artefactos →',
  'home.playbooks': 'Playbooks',
  'home.allPlaybooks': 'Todos los playbooks →',
  'home.tools': 'Herramientas',
  'home.allTools': 'Todas las herramientas →',
  'home.cheatsheets': 'Cheatsheets',
  'home.scope': 'Alcance',
  'home.scopeText':
    'Kharonte es una referencia para apoyar tu análisis, no un analista automático. Nunca ejecuta muestras ni llama a servicios externos. Contrasta los hallazgos con fuentes primarias.',

  'about.title': 'Sobre este manual',
  'about.summary':
    'Kharonte es una referencia de código abierto para Blue Team, DFIR y análisis de malware. Te ayuda a decidir qué mirar después; no analiza nada por ti.',
  'about.description': 'Qué es Kharonte, qué no es y cómo se escribe su contenido.',
  'about.principles': 'Principios',
  'about.p1':
    '**Referencia, no analista.** Las fichas describen qué comprobar, qué herramientas ayudan y qué salida importa. El criterio sigue siendo tuyo.',
  'about.p2':
    '**Workflow primero.** Cada página responde: qué es, qué compruebo primero, qué hago después, qué puedo extraer como IOC y cuándo escalo.',
  'about.p3':
    '**Sin capacidades inventadas.** El comportamiento de las herramientas se describe de forma conservadora. Las fichas pendientes de verificar muestran un aviso visible de **Pendiente de revisión**.',
  'about.p4':
    '**Hechos frente a recomendaciones.** «Qué buscar» y «Notas operativas» son criterio del analista; «Evidencia», «Dónde encontrarlo» y «Salida» son hechos.',
  'about.safety': 'Seguridad',
  'about.s1': 'El sitio es totalmente estático. No ejecuta muestras ni scripts y no llama a APIs externas.',
  'about.s2': 'Los comandos son solo de referencia. Ejecútalos en un entorno adecuado y aislado.',
  'about.s3':
    'Subir un fichero a servicios públicos (p. ej. VirusTotal o sandboxes públicas) puede exponerlo. Revisa la política de tu organización y prioriza las búsquedas por hash.',
  'about.s4': 'El repositorio no contiene muestras, secretos ni datos personales.',
  'about.contribute': 'Contribuir',
  'about.c1':
    'El contenido está en ficheros Markdown/YAML en `src/content/`. Consulta el README del repositorio para ver el modelo de contenido y cómo añadir herramientas, artefactos, playbooks y cheatsheets.',

  'nf.title': 'No encontrado',
  'nf.kicker': '404 · No hay artefacto en esta ruta',
  'nf.h1': 'Aquí no se ha recuperado nada.',
  'nf.body': 'Puede que la página se haya movido. Busca en el manual o vuelve al',
  'nf.index': 'inicio',
};

const DICTS: Record<Lang, Record<UiKey, string>> = { en, es };

export function useTranslations(lang: Lang) {
  return (key: UiKey, vars?: Record<string, string | number>) => {
    let s = DICTS[lang][key] ?? DICTS.en[key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };
}
