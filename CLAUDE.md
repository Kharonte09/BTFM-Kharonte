# CLAUDE.md — Kharonte Blue Team Field Manual

Este fichero contiene la especificación original del proyecto. Es la fuente de verdad para cualquier decisión de producto, diseño o contenido.

## Notas operativas (para Claude)

- Stack: Astro + TypeScript + Tailwind CSS + Content Collections (Markdown/YAML) + Fuse.js (búsqueda client-side). Sitio 100 % estático.
- El contenido vive en `src/content/{playbooks,artifacts,tools}/{en,es}/` (mismo nombre de fichero en ambos idiomas = mismo slug); los esquemas en `src/content.config.ts`. Nunca hardcodear contenido en componentes.
- i18n: inglés por defecto en `/`, español en `/es/`. Rutas en `src/pages/[...locale]/`; textos de interfaz en `src/i18n/ui.ts`; enlaces de página con `href(lang, path)`. Si falta la traducción se muestra la versión inglesa con aviso. Toda ficha nueva debe crearse en los dos idiomas.
- Español: la estructura y la explicación en español, pero la **jerga del sector se queda en inglés** (es como se habla en un SOC). En inglés: Blue Team Field Manual, logs / event logs / logging, triage, headers (correo), strings (extraídos de binarios), logon / Logon types, workflow, mail gateway, defang, credential dumping, fingerprint, Alternate Data Streams, y los nombres oficiales de eventos de Windows/Sysmon. Títulos que son jerga también en inglés (Windows Event Logs, PowerShell Logs, Malware Triage). En español lo que es natural en DFIR: artefactos, herramientas, registro (de Windows), persistencia, movimiento lateral, volcado de memoria, tareas programadas. Nunca traducir comandos, rutas, Event IDs ni nombres de herramientas.
- **Enfoque playbook-oriented:** la web gira alrededor de los playbooks ("Tengo… → playbook"). Portada y menú empiezan por playbooks; artefactos y herramientas son referencia de apoyo y enlazan de vuelta a los playbooks ("Se usa en los playbooks"). Cada playbook tiene `scenario` (etiqueta "Tengo…"), `icon`, `questions` (estilo BTLO) y progreso por pasos/preguntas guardado en `localStorage` (`kh-pb:<slug>`). Se usan para retos tipo BTLO.
- **Alcance del contenido:** basado en la experiencia del autor y en el temario de BTL1 (Phishing, Threat Intel, Digital Forensics, SIEM, Incident Response). No añadir artefactos que no encajen ahí (se eliminaron Amcache y Shimcache). Los documentos (Office, PDF) van dentro de la categoría Phishing, como adjuntos.
- **Sin cheatsheets:** se eliminaron por decisión del autor (esas tablas las consulta en Google o en una IA). Aunque la especificación de abajo las menciona (§5, §20, §21), no se deben volver a añadir salvo que el autor lo pida.
- Tema: oscuro por defecto, claro opcional (`data-theme` en `<html>`, tokens redefinidos en `src/styles/global.css`, variante `light:`).
- Las relaciones entre entradas se hacen por slug (`tools: [pecmd]`, `related_artifacts: [prefetch]`). El build falla si un slug no existe.
- Todos los enlaces internos deben pasar por `href(lang, path)` (páginas) o `url()` (assets) de `src/lib/url.ts` para respetar `base` en GitHub Pages (project pages).
- Base/site se controlan con `SITE_URL` y `BASE_PATH` (ver `astro.config.mjs` y el workflow).
- Reglas de contenido: no inventar funcionalidades. Lo dudoso se marca con `review: true` en el frontmatter (se muestra un aviso "Pending review").
- Comandos: `npm run dev`, `npm run build` (incluye `astro check`), `npm run preview`.

---

# Kharonte Blue Team Field Manual — MVP

## 0. TU PAPEL

Actúa como **Senior Frontend Engineer + UX/UI Designer + Technical Information Architect especializado en cybersecurity tooling**.

Vas a construir conmigo el MVP de una web llamada:

**KHARONTE — Blue Team Field Manual**

El proyecto será open source y estará alojado en **GitHub Pages**.

No quiero una landing page de IA ni una web corporativa. Quiero construir una **herramienta técnica de consulta para Blue Team / DFIR / Malware Analysis**, útil durante el análisis de un incidente.

Toma decisiones técnicas razonables por tu cuenta cuando no haya una decisión explícita. No me hagas preguntas sobre detalles menores que puedas resolver profesionalmente.

---

# 1. OBJETIVO DEL PROYECTO

Crear una web estática que funcione como una combinación de:

* Blue Team Field Manual
* Knowledge Base
* Playbook
* Cheatsheet
* Tool reference
* Artifact reference

La idea central:

> "Tengo delante un artefacto o un problema. ¿Qué hago ahora?"

Ejemplos:

* Tengo un `.exe` sospechoso.
* Tengo un `.docx` sospechoso.
* Tengo un email de phishing.
* Tengo logs de Windows.
* Tengo eventos de Sysmon.
* Tengo una IP sospechosa.
* Tengo un PCAP.
* Tengo un memory dump.
* Tengo un `.lnk`.
* Tengo PowerShell sospechoso.

La aplicación debe ayudar a responder:

1. Qué estoy analizando.
2. Qué debo comprobar primero.
3. Qué herramientas puedo utilizar.
4. Qué artefactos/indicadores debo buscar.
5. Qué resultados son relevantes.
6. Qué herramienta utilizar después.
7. Qué puedo extraer como IOC.
8. Cuándo escalar a un análisis más profundo.

NO debe intentar sustituir al analista.

---

# 2. PRINCIPIO FUNDAMENTAL

La web NO debe presentarse como:

"Una IA que analiza tu incidente."

NO.

Debe presentarse como:

"Una referencia técnica para ayudarte a analizarlo."

El contenido debe ser práctico y orientado a workflow.

---

# 3. STACK

Usa:

* Astro
* TypeScript
* Tailwind CSS
* MDX/Markdown para contenido
* Lucide Icons o equivalente ligero
* Fuse.js o equivalente para búsqueda client-side si resulta necesario

No utilizar:

* Backend
* Base de datos
* Kubernetes
* Docker
* APIs externas
* Autenticación
* Login
* CMS externo
* LLM API
* Analytics obligatorio

Todo debe funcionar como sitio estático.

---

# 4. DEPLOYMENT

El proyecto debe estar preparado desde el principio para:

**GitHub → GitHub Pages**

Implementa:

* Git repository limpio
* `.gitignore`
* `README.md`
* GitHub Actions
* workflow para build + deploy
* configuración correcta de Astro para GitHub Pages
* configuración preparada para custom domain

Un dominio propio es opcional y futuro: NO dependas de él para que la aplicación funcione ni lo menciones en el repositorio.

El proyecto debe funcionar también desde:

```text
https://USERNAME.github.io/REPOSITORY/
```

si GitHub Pages utiliza project pages.

---

# 5. ESTRUCTURA DE INFORMACIÓN

La aplicación tendrá inicialmente estas áreas principales:

## ARTIFACTS

Artefactos que puede encontrar un analista.

Categorías iniciales:

### Windows

* Windows Event Logs
* Sysmon
* Prefetch
* Registry
* Amcache
* Shimcache
* LNK
* Jump Lists
* Scheduled Tasks
* Services
* PowerShell logs

### Email

* EML
* Email headers
* Attachments
* URLs
* Authentication results

### Documents

* DOCX
* XLSX
* PDF
* OLE
* VBA/macros
* XLM

### Binaries

* EXE
* DLL
* PE
* .NET assemblies
* Scripts

### Network

* PCAP
* DNS
* HTTP
* TLS
* IP
* Domain

### Memory

* RAM dump
* Processes
* Network connections
* DLLs
* Handles

---

# 6. TOOLS

Crear fichas individuales de herramientas.

Categorías:

### DFIR

* KAPE
* Velociraptor
* Autopsy
* FTK Imager
* Eric Zimmerman Tools

### Windows

* EvtxECmd
* PECmd
* RECmd
* MFTECmd
* AmcacheParser

### Malware Analysis

* PEStudio
* Detect It Easy
* FLOSS
* capa
* YARA
* VirusTotal
* ANY.RUN
* Hybrid Analysis

### Network

* Wireshark
* tshark
* Zeek

### Reversing

* Ghidra
* x64dbg
* dnSpy / ILSpy

### General

* CyberChef
* jq
* grep
* PowerShell

IMPORTANTE:

No inventes funcionalidades.

Si existe incertidumbre sobre una herramienta, deja el contenido preparado para revisión en vez de afirmar algo dudoso.

---

# 7. PLAYBOOKS

Crear workflows de alto nivel.

MVP:

### Phishing Investigation

```text
Email
 ↓
Headers
 ↓
Authentication
 ↓
URLs
 ↓
Attachments
 ↓
Infrastructure
 ↓
User interaction
 ↓
Endpoint investigation
 ↓
IOCs
 ↓
Conclusion
```

### Suspicious EXE

```text
Hash
 ↓
File identification
 ↓
Metadata
 ↓
Static analysis
 ↓
Reputation
 ↓
Sandbox
 ↓
Network behaviour
 ↓
Persistence
 ↓
Deep analysis
 ↓
IOCs
```

### Suspicious PowerShell

```text
Command
 ↓
Encoding
 ↓
Deobfuscation
 ↓
Execution context
 ↓
Parent process
 ↓
Network activity
 ↓
Persistence
 ↓
IOCs
```

### Windows Endpoint Investigation

```text
Timeline
 ↓
Processes
 ↓
Logons
 ↓
Persistence
 ↓
Network
 ↓
Files
 ↓
Registry
 ↓
User activity
 ↓
IOCs
```

### Malware Triage

```text
Identify
 ↓
Hash
 ↓
Static
 ↓
Reputation
 ↓
Dynamic
 ↓
Behaviour
 ↓
Extract IOCs
 ↓
Classify
```

---

# 8. TOOL PAGE DESIGN

Cada herramienta debe tener una ficha consistente.

Ejemplo:

# FLOSS

**Category:** Malware Analysis
**Type:** Static Analysis
**Platform:** Windows / Linux

### What is it?

Una explicación técnica corta.

### Use it when

Cuándo tiene sentido utilizarla.

### Look for

* Strings
* URLs
* Domains
* Commands
* API references
* Interesting paths

### Typical workflow

```text
Sample
 ↓
FLOSS
 ↓
Review strings
 ↓
Extract IOCs
 ↓
Correlate with sandbox
```

### Complements

* PEStudio
* DIE
* capa
* YARA

### Output

Qué información produce.

### Operational notes

Errores comunes o consideraciones.

No convertir cada página en un tutorial gigantesco.

---

# 9. ARTIFACT PAGE DESIGN

Cada artefacto tendrá:

* Qué es
* Qué evidencia proporciona
* Dónde encontrarlo
* Qué preguntas responde
* Herramientas para analizarlo
* Qué buscar
* Limitaciones
* Artefactos relacionados

Ejemplo:

# Windows Event Logs

### Questions answered

* Who logged in?
* When?
* From where?
* What process executed?
* Was there lateral movement?
* Was persistence created?

### Useful logs

* Security
* System
* Application
* PowerShell
* Sysmon

### Useful tools

* Event Viewer
* EvtxECmd
* Hayabusa
* Chainsaw

---

# 10. SEARCH

La búsqueda es una característica fundamental.

Debe poder buscar:

* herramientas
* artefactos
* técnicas
* playbooks
* IOCs
* términos

Ejemplo:

Buscar:

```text
prefetch
```

debe devolver:

```text
Artifact
Windows Prefetch

Tools
PECmd

Related
Execution
Program Execution
Timeline
```

La búsqueda debe ser rápida y funcionar completamente en cliente.

---

# 11. NAVEGACIÓN

Diseña una navegación clara.

Desktop:

```text
KHARONTE

Artifacts
Tools
Playbooks
Cheatsheets

Search
```

En móvil debe convertirse en navegación responsive.

Cada página debe tener breadcrumbs.

Ejemplo:

```text
Artifacts / Windows / Prefetch
```

---

# 12. HOMEPAGE

La homepage NO debe ser una landing page convencional.

Debe sentirse como una herramienta.

Propuesta:

```text
KHARONTE

BLUE TEAM
FIELD MANUAL

A practical reference for
DFIR, detection and malware analysis.

[ Search tools, artifacts, techniques... ]

──────────────────────────────

START WITH AN ARTIFACT

[ Windows ] [ Email ] [ Documents ]
[ Binary ] [ Network ] [ Memory ]

──────────────────────────────

POPULAR PLAYBOOKS

Phishing
Suspicious EXE
PowerShell
Endpoint Investigation

──────────────────────────────

TOOLS

DFIR
Malware Analysis
Network
Reversing
```

La búsqueda debe tener mucho protagonismo.

---

# 13. VISUAL DESIGN

Esta parte es MUY IMPORTANTE.

NO quiero:

* Cyberpunk genérico.
* Matrix.
* Verde hacker.
* Neón excesivo.
* Skulls.
* Hoods.
* Robots.
* "AI assistant" estética.
* Dashboard corporativo genérico.
* Landing page SaaS.

Quiero una estética:

**technical / dark / editorial / field manual / forensic workstation**

Inspiración conceptual:

* documentación técnica
* herramientas DFIR
* manuales militares
* interfaces de investigación
* terminales
* documentación de ingeniería
* publicaciones técnicas

Pero con una identidad propia.

---

# 14. IDENTIDAD KHARONTE

La identidad visual debe utilizar:

* Negro / near-black
* Blanco roto
* Gris
* Un único color de acento naranja/rojo relacionado con Kharonte

Evitar gradients exagerados.

Tipografía:

* Inter
* IBM Plex Sans
* JetBrains Mono

Puedes combinar:

UI:

Inter / IBM Plex Sans

Technical:

JetBrains Mono

La interfaz debe sentirse seria y profesional.

---

# 15. MICROINTERACCIONES

Utiliza animaciones mínimas:

* hover
* focus
* expansión
* navegación
* search results

NO utilizar:

* partículas
* backgrounds animados
* glitches constantes
* efectos hacker
* animaciones que dificulten la lectura

La prioridad es:

**Usabilidad > estética.**

---

# 16. RESPONSIVE

Debe funcionar correctamente en:

* Desktop
* Laptop
* Tablet
* Mobile

La experiencia móvil no debe ser simplemente una versión comprimida.

---

# 17. ACCESSIBILITY

Implementar:

* semantic HTML
* keyboard navigation
* visible focus states
* contrast adecuado
* aria labels donde corresponda
* reduced motion

---

# 18. SEO

Añadir:

* title
* description
* Open Graph
* favicon
* canonical
* sitemap
* robots.txt

Preparar estructura SEO-friendly.

---

# 19. CONTENT MODEL

No hardcodear el contenido de cada herramienta dentro de componentes.

Crear un modelo estructurado.

Por ejemplo:

```yaml
name:
category:
subcategory:
description:
platforms:
use_when:
look_for:
workflow:
tools:
related_artifacts:
outputs:
difficulty:
tags:
```

Lo mismo para artifacts y playbooks.

La aplicación debe leer estos contenidos.

---

# 20. MVP CONTENT

No intentes crear 200 páginas.

El MVP debe tener aproximadamente:

### Tools

10–15 herramientas bien documentadas.

### Artifacts

10–15 artefactos.

### Playbooks

4–5.

### Cheatsheets

2–3.

La calidad importa más que la cantidad.

---

# 21. CHEATSHEETS

Crear inicialmente:

### Windows Event IDs

Tabla consultable con eventos relevantes.

### Common DFIR Commands

PowerShell / Windows / Linux.

Ejemplos:

```powershell
Get-WinEvent
Get-FileHash
Get-Process
Get-NetTCPConnection
```

y equivalentes útiles.

---

# 22. TECHNICAL QUALITY

El código debe:

* estar tipado
* ser modular
* evitar duplicación
* tener componentes reutilizables
* mantener contenido separado de UI
* tener nombres claros
* ser sencillo de mantener

No sobreingenierizar.

Este proyecto debe poder mantenerlo una sola persona.

---

# 23. README

Crear README profesional explicando:

* Qué es Kharonte
* Objetivo
* Features
* Stack
* Estructura
* Desarrollo local
* Build
* Deployment
* GitHub Pages
* Custom domain
* Cómo añadir contenido
* Roadmap

Incluir ejemplos de:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

# 24. GITHUB ACTIONS

Crear:

```text
.github/workflows/deploy.yml
```

Debe:

1. Checkout
2. Setup Node
3. Install dependencies
4. Build Astro
5. Upload artifact
6. Deploy GitHub Pages

Utilizar las acciones oficiales recomendadas actualmente por GitHub.

---

# 25. CALIDAD DEL CONTENIDO

Reglas:

* No inventar información técnica.
* No afirmar que una herramienta hace algo si no está verificado.
* Diferenciar hechos de recomendaciones.
* Evitar información desactualizada cuando sea relevante.
* No llenar páginas con texto innecesario.
* Priorizar workflows reales.
* Usar terminología profesional de DFIR/Blue Team.

Cuando una herramienta tenga diferentes versiones o haya cambiado de nombre, reflejarlo correctamente.

---

# 26. SEGURIDAD

La aplicación es únicamente una referencia técnica.

No debe ejecutar muestras, scripts ni malware.

No subir muestras reales al repositorio.

No incluir secretos.

No incluir API keys.

No incluir credenciales.

No incluir datos personales.

---

# 27. FUTURO — NO IMPLEMENTAR TODAVÍA

Dejar arquitectura preparada para futuras features:

* filtros avanzados
* tags
* relaciones entre artifacts/tools/playbooks
* ATT&CK mapping
* IOC utilities
* hash lookup
* VirusTotal API
* AbuseIPDB
* Shodan
* local LLM
* RAG
* generación de informes
* timeline builder
* case workspace

Pero NO implementarlas en el MVP.

---

# 28. WORKFLOW DE DESARROLLO

Antes de escribir mucho código:

1. Analiza los requisitos.
2. Propón una arquitectura de carpetas.
3. Define el modelo de contenido.
4. Define el sistema visual.
5. Implementa el shell de la aplicación.
6. Implementa navegación.
7. Implementa búsqueda.
8. Implementa contenido.
9. Implementa responsive.
10. Implementa SEO.
11. Implementa GitHub Actions.
12. Ejecuta build.
13. Corrige errores.
14. Revisa visualmente el resultado.
15. Deja el proyecto preparado para commit.

No pares después de crear solamente una homepage.

El resultado debe ser un **MVP funcional completo**.

---

# 29. GIT

Inicializa Git si todavía no existe.

Haz commits lógicos durante el desarrollo.

Ejemplo:

```text
feat: initialize Astro application
feat: add content architecture
feat: add artifact navigation
feat: add tool reference
feat: add playbooks
feat: add search
feat: add responsive UI
ci: add GitHub Pages deployment
docs: add project documentation
```

No hagas commits gigantescos si pueden dividirse razonablemente.

---

# 30. FINAL REVIEW

Antes de terminar, comprueba:

* `npm run build` funciona.
* No hay TypeScript errors.
* No hay broken links.
* Navegación funciona.
* Search funciona.
* Mobile funciona.
* GitHub Pages está configurado.
* No existen secretos.
* README explica deployment.
* El contenido está separado del código.
* El diseño parece una herramienta técnica, no una landing page de IA.

Al finalizar, dame:

1. Resumen de lo construido.
2. Estructura del proyecto.
3. Cómo ejecutarlo localmente.
4. Cómo subirlo a GitHub.
5. Cómo activar GitHub Pages.
6. Cómo añadir nuevos artifacts/tools/playbooks.
7. Próximas mejoras recomendadas.

IMPORTANTE:

No quiero que conviertas esto en un proyecto gigantesco.

El objetivo es conseguir una **V1 pequeña, sólida, bonita y realmente utilizable**, que posteriormente pueda crecer hasta convertirse en la referencia técnica de Kharonte.
