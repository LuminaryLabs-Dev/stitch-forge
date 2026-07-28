# Project Memory

## Purpose

Stitch Forge is a lightweight procedural crochet-pattern studio for generating, previewing, validating, and exporting a Retro Daisy granny square pattern.

## Architecture

- Vite provides the development and production build surface.
- `src/ui.js` owns controls, status feedback, and export actions.
- `src/generator.js`, `src/validation.js`, and `src/pattern-model.js` produce one validated pattern artifact.
- `src/formatter.js` and `src/renderer.js` consume that shared artifact for text output and the Three.js preview.
- `src/presets.js` defines supported recipe defaults and constraints.

## Conventions

- Keep the preview and exported instructions driven by the same computed artifact.
- Normalize unsupported inputs through recipe validation before rendering or export.
- Keep the app static and browser-local unless the architecture is intentionally revised.
- Keep generated dependencies, build output, local configuration, and credentials out of Git.
- Run `npm run verify:patterns` and `npm run build` before release.
- Deploy GitHub Pages from `main` through `.github/workflows/deploy-pages.yml`; treat the local build, Actions result, and live site as separate release gates.
