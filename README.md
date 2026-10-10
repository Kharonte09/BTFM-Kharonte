# BTFM Kharonte

Kharonte repository used **only** as a **Blue Team Field Manual (BTFM)**: a static, playbook-oriented reference for DFIR, detection and malware analysis — playbooks backed by artifact and tool pages, in English and Spanish.

It is a reference to support analysis, not an analyst. It does not execute samples or call external services.

The question it answers: **"I have this in front of me. What do I do next?"** — every page leads with *Start here*, then what to look for, which tools to use, how to correlate, which IOCs to extract, common mistakes and what next.

## Content principles

- Do not add content merely to increase the number of pages. Every artifact, tool or playbook must have operational value for a Blue Team / DFIR analyst.
- Prefer "what should I do next?" over encyclopedic explanations.
- Only document tools, artifacts and workflows that are well understood, useful, and relevant to the author's actual workflow. Each entry states its `coverage` (basic / intermediate / advanced).

## Development

Requires Node.js ≥ 22.12.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # type check + static build → dist/
npm run preview
npm run check:links
```

## Content

Content lives in `src/content/<collection>/<lang>/` (`en/` and `es/`, same file name in both):

```text
src/content/
├── playbooks/    *.md
├── detections/   *.md   (one attack per file: where to look + hunt commands)
├── artifacts/    *.md
└── tools/        *.md
```

The schemas in `src/content.config.ts` define every field; the build reports any invalid entry. Interface strings are in `src/i18n/ui.ts`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, once Pages is enabled in **Settings → Pages → Source: GitHub Actions**.

## License

MIT
