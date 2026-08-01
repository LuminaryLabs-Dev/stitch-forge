# Stitch Forge Repository Guide

## Purpose

Stitch Forge is a static Vite application that creates one validated Retro Daisy crochet-pattern artifact and uses it for displayed instructions, plain-text export, and Three.js preview parameters.

## Start here

1. Read `memory.md`, `README.md`, and `docs/ARCHITECTURE.md`.
2. Inspect `src/generator.js`, `src/validation.js`, and `src/pattern-model.js` before changing recipe behavior.
3. Inspect `src/formatter.js` and `src/renderer.js` before changing artifact consumers.
4. Run structural verification and the production build after relevant changes.

## Commands

```bash
npm ci
npm run dev
npm run verify:patterns
npm run build
npm run preview
```

## Architecture rules

- Keep instructions, summaries, exports, and preview parameters derived from the same pattern artifact.
- Normalize unsupported values before generation, formatting, rendering, or export.
- Retro Daisy supports 3 through 8 rounds and 4, 8, 12, or 16 petals.
- Keep the application browser-local and static unless a deliberate architecture change is approved.
- Keep preview-only softness, glow, and depth separate from crochet instructions.
- Preserve clipboard fallback and plain-text download behavior.
- Retain the renderer's update/dispose lifecycle when changing preview code.
- Keep `node_modules/`, `dist/`, environment files, credentials, and keys untracked.

## Known defect

At `main` commit `7c376021dce26919eca8de8f0bc0fc9d804cfdd3`, the renderer is created while its container is detached. Its initial dimensions are `0 x 0`; a viewport resize later creates a non-zero canvas. Do not claim initial preview health until this behavior is repaired and validated in Chromium and Safari.

## Deployment

`.github/workflows/deploy-pages.yml` uses Node 22, `npm ci`, and `npm run build`, then deploys `dist/` to GitHub Pages on pushes to `main` or manual dispatch. Verify source checks, workflow status, and the live URL independently.
