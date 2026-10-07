# BTFM Kharonte

Kharonte repository used **only** as a **Blue Team Field Manual (BTFM)**: a static reference for DFIR, detection and malware analysis — artifacts, tools, playbooks and cheatsheets, in English and Spanish.

It is a reference to support analysis, not an analyst. It does not execute samples or call external services.

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
├── artifacts/    *.md
├── tools/        *.md
├── playbooks/    *.md
└── cheatsheets/  *.yaml
```

The schemas in `src/content.config.ts` define every field; the build reports any invalid entry. Interface strings are in `src/i18n/ui.ts`.

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, once Pages is enabled in **Settings → Pages → Source: GitHub Actions**.

## License

MIT
