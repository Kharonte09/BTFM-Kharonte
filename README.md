# KHARONTE — Blue Team Field Manual

> *You have an artifact in front of you. What do you do next?*

**Kharonte** is an open-source, static technical reference for Blue Team, DFIR and malware analysis work. It combines a field manual, knowledge base, playbooks, cheatsheets, and tool and artifact references into one fast, searchable site.

It is a **reference to support your analysis — not an analyst**. It never executes samples, never calls external APIs, and has no backend.

---

## Objective

Help an analyst, during a real investigation, answer:

1. What am I looking at?
2. What should I check first?
3. Which tools can I use?
4. Which artifacts and indicators should I look for?
5. Which results matter?
6. Which tool comes next?
7. What can I extract as an IOC?
8. When should I escalate to deeper analysis?

## Features

- **Artifacts** — Windows (Event Logs, Sysmon, Prefetch, Registry, Amcache, Shimcache, LNK, Scheduled Tasks, PowerShell logs), Email, Documents, Binaries, Network and Memory. Each entry covers: what it is, evidence provided, where to find it, questions answered, tools, what to look for, limitations, related artifacts.
- **Tools** — consistent reference cards: what it is, when to use it, what to look for, typical workflow, example commands (copy button), output, operational notes, complements.
- **Playbooks** — Phishing, Suspicious EXE, Suspicious PowerShell, Windows Endpoint Investigation, Malware Triage. Each step has a goal, actions, tools, artifacts and escalation criteria.
- **Cheatsheets** — Windows Event IDs, Common DFIR Commands, Persistence Locations; filterable tables with deep links to each row.
- **Search** — client-side fuzzy search (Fuse.js) over tools, artifacts, playbooks, cheatsheets **and individual cheatsheet rows** (search `4624`, `Get-WinEvent`, `T1053.005`). Grouped results, "related" tag suggestions, full keyboard support (`/` or `Ctrl K`, `↑ ↓`, `Enter`, `Esc`).
- **Cross-linking** — references between tools, artifacts and playbooks are resolved automatically, including reverse relations ("used in playbooks").
- **Pending review flag** — entries with content that still needs verification show a visible notice.
- Responsive, accessible (semantic HTML, skip link, visible focus, ARIA combobox/listbox search, `prefers-reduced-motion`), SEO-ready (canonical, Open Graph, sitemap, robots.txt, breadcrumbs JSON-LD).

## Stack

| | |
| --- | --- |
| Framework | [Astro](https://astro.build) 7 (static output) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Content | Astro Content Collections — Markdown + YAML, validated with Zod |
| Search | Fuse.js, static JSON index, lazy-loaded |
| Icons | Lucide (`@lucide/astro`) |
| Fonts | Inter + JetBrains Mono, self-hosted via Fontsource |
| Hosting | GitHub Pages via GitHub Actions |

No backend, database, external APIs, analytics, CMS or authentication.

## Project structure

```text
.
├── .github/workflows/deploy.yml   # Build + deploy to GitHub Pages
├── public/                        # Static files (favicon, OG image)
├── scripts/
│   ├── check-links.mjs            # Internal link + anchor checker (runs in CI)
│   └── og-image.mjs               # Regenerates public/og.png
├── src/
│   ├── content.config.ts          # Content model (Zod schemas)
│   ├── content/
│   │   ├── artifacts/*.md
│   │   ├── tools/*.md
│   │   ├── playbooks/*.md
│   │   └── cheatsheets/*.yaml
│   ├── components/                # Reusable UI (Section, Flow, RefList, SearchPanel…)
│   ├── layouts/                   # BaseLayout (SEO shell), EntryLayout (2-column reference)
│   ├── lib/
│   │   ├── taxonomy.ts            # Artifact & tool categories
│   │   ├── content.ts             # Queries, URLs, cross-reference resolution
│   │   ├── url.ts                 # Base-path aware URL helper
│   │   └── …
│   ├── pages/                     # Routes (+ search-index.json, robots.txt endpoints)
│   ├── scripts/search.ts          # Client-side search
│   └── styles/global.css          # Design tokens + base styles
├── astro.config.mjs
├── CLAUDE.md                      # Original product specification
└── CNAME.example
```

Routes:

```text
/                                  Home
/artifacts/  /artifacts/<category>/  /artifacts/<category>/<slug>/
/tools/      /tools/<category>/      /tools/<category>/<slug>/
/playbooks/  /playbooks/<slug>/
/cheatsheets/ /cheatsheets/<slug>/
/search/?q=…
```

## Local development

Requires **Node.js ≥ 22.12**.

```bash
npm install
npm run dev          # http://localhost:4321
```

## Build

```bash
npm run build        # astro check (types + content schemas) + static build → dist/
npm run preview      # serve dist/ locally
npm run check:links  # verify every internal link and #anchor in dist/
```

The build fails on TypeScript errors and on content that does not match the schema.

## Deployment

### GitHub Pages (project pages — default)

1. Push the repository to GitHub (see below).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The workflow (`.github/workflows/deploy.yml`) runs: checkout → setup Node → `actions/configure-pages` → `npm ci` → `npm run build` → link check → upload artifact → `actions/deploy-pages`.

`configure-pages` tells the build where the site will live, through two environment variables read by `astro.config.mjs`:

| Variable | Project pages | Custom domain |
| --- | --- | --- |
| `SITE_URL` | `https://USERNAME.github.io` | `https://kharonte.es` |
| `BASE_PATH` | `/REPOSITORY` | `/` |

So the same code works at `https://USERNAME.github.io/REPOSITORY/` and at a custom domain without changes. All internal links go through `url()` in `src/lib/url.ts`, which prefixes the base path.

To reproduce a project-pages build locally:

```bash
SITE_URL=https://USERNAME.github.io BASE_PATH=/REPOSITORY npm run build
BASE_PATH=/REPOSITORY npm run check:links
```

(On Windows Git Bash, prefix with `MSYS_NO_PATHCONV=1` so `/REPOSITORY` is not rewritten as a Windows path.)

### Custom domain (kharonte.es)

The site does **not** depend on the domain. When you are ready:

1. **Settings → Pages → Custom domain:** enter `kharonte.es` and save. With GitHub Actions deployments, this setting is what GitHub uses.
2. At your DNS provider, create the records GitHub documents for apex domains (`A`/`AAAA` records to GitHub Pages IPs, and optionally a `CNAME` for `www` → `USERNAME.github.io`).
3. Once the certificate is issued, enable **Enforce HTTPS**.
4. Optional: `cp CNAME.example public/CNAME` to keep the domain recorded in the repository and in the published files. GitHub ignores this file for Actions-based deployments, so step 1 is still required.

After the domain is set, `configure-pages` reports `https://kharonte.es` with an empty base path, and the next deploy builds for the root automatically.

## Publishing to GitHub

```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Then enable Pages with **Source: GitHub Actions** as described above.

## Adding content

All content lives in `src/content/`. Components never contain entry-specific text. The schemas in `src/content.config.ts` are the source of truth; the build tells you exactly which field is wrong.

**Cross references** (`tools`, `complements`, `related_artifacts`, `related_playbooks`, playbook step `tools`/`artifacts`) are plain strings. If the string matches an entry's slug, name or alias, it becomes a link; otherwise it renders as a dashed "not documented yet" chip. You can mention tools that do not have a page yet.

Text fields support inline `` `code` `` and `**bold**`. Quote YAML strings that contain `: `, `#`, or start with a backtick.

Set `review: true` on any entry that still needs expert verification.

### New tool — `src/content/tools/<slug>.md`

```yaml
---
name: Hayabusa
summary: One-line description (max 220 chars).
category: windows            # dfir | windows | malware-analysis | network | reversing | general
type: Event log triage
platforms: [Windows, Linux, macOS]
license: Open source (…)     # optional
homepage: https://…          # optional
difficulty: basic            # basic | intermediate | advanced
aliases: []
tags: [event logs, sigma]
use_when: [ … ]
look_for: [ … ]
workflow: [Step 1, Step 2, Step 3]
examples:
  - label: What it does
    command: 'tool.exe --flag value'
outputs: [ … ]
notes: [ … ]
complements: [EvtxECmd, Chainsaw]
related_artifacts: [windows-event-logs]
review: true
---

Short "What is it?" explanation in Markdown.
```

### New artifact — `src/content/artifacts/<slug>.md`

```yaml
---
name: Jump Lists
summary: …
category: windows            # windows | email | documents | binaries | network | memory
aliases: []
tags: []
evidence: [ … ]
locations:
  - label: Automatic destinations
    path: C:\Users\<user>\AppData\Roaming\Microsoft\Windows\Recent\AutomaticDestinations\
questions: [ … ]
tools: [JLECmd]
look_for: [ … ]
limitations: [ … ]
related_artifacts: [lnk]
---

Markdown body (tables allowed).
```

### New playbook — `src/content/playbooks/<slug>.md`

```yaml
---
name: Ransomware Triage
summary: …
order: 6
trigger: When to start this playbook.
tags: []
steps:
  - title: Scope
    goal: What this step must achieve.
    actions: [ … ]
    tools: [Velociraptor]
    artifacts: [windows-event-logs]
    escalate: Optional escalation criterion.
iocs: [ … ]
escalate_when: [ … ]
related_playbooks: [windows-endpoint-investigation]
---

Optional notes.
```

### New cheatsheet — `src/content/cheatsheets/<slug>.yaml`

```yaml
name: Linux Artifacts
summary: …
order: 4
tags: []
sections:
  - id: auth
    title: Authentication
    note: Optional note.
    columns: [Path, What it contains]
    mono: [0]                # zero-based columns rendered in monospace
    rows:
      - ['/var/log/auth.log', 'SSH and sudo activity (Debian/Ubuntu).']
```

Every row is indexed by search and deep-linkable (`/cheatsheets/<slug>/#<section-id>-<n>`).

### New category

Categories are defined in `src/lib/taxonomy.ts` (label, short code, description, icon). Adding one there makes it available to the schema, routes, navigation and home page.

## Content rules

- Do not invent tool capabilities. When unsure, describe conservatively and set `review: true`.
- "Evidence", "Where to find it" and "Output" are **facts**; "Look for" and "Operational notes" are **analyst guidance**.
- Reflect renames and successors (e.g. YARA → YARA-X, dnSpy → dnSpyEx, Volatility 2 → 3).
- Never commit samples, evidence, secrets, API keys, credentials or personal data (`.gitignore` blocks common evidence formats).

## Roadmap

Not implemented in the MVP; the content model and cross-reference layer are designed to support them:

- Advanced filters and tag pages
- MITRE ATT&CK mapping per entry
- More artifacts (Jump Lists, ShellBags, SRUM, browser history, Linux, cloud) and tools (Hayabusa, Chainsaw, Zeek, Volatility 3, oletools, ILSpy, x64dbg)
- IOC utilities (defang/refang, extraction) — client-side only
- Optional integrations (hash lookup, VirusTotal, AbuseIPDB, Shodan) behind explicit user API keys
- Local LLM / RAG over the manual
- Report generation, timeline builder, case workspace

## License

MIT for the code. Tool names and trademarks belong to their respective owners.
