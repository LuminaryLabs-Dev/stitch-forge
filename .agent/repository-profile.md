# Repository Profile

## Identity

- Repository: `LuminaryLabs-Dev/stitch-forge`
- Visibility: public
- Default branch: `main`
- Documentation source commit: `7c376021dce26919eca8de8f0bc0fc9d804cfdd3`
- Pages URL: `https://luminarylabs-dev.github.io/stitch-forge/`

## Purpose

Stitch Forge is a browser-local procedural crochet-pattern studio for one curated Retro Daisy Granny Square recipe. A shared artifact carries normalized inputs, rounds, stitch counts, summaries, notes, formatted text, and render bands to the UI, exporter, and preview.

## Architecture

- Vite and vanilla JavaScript provide the static application shell.
- Three.js provides the structural shader preview.
- GitHub Pages deploys `dist/` from `main` through Actions.
- No backend, authentication, external API, or persistence service is present in the inspected source.

## Baseline evidence

- `npm run verify:patterns`: four scenarios passed.
- `npm run build`: passed with one large-chunk warning.
- Pages: HTTP 200 and successful workflow for the source commit.
- Human View: interface and pattern output load, but initial canvas is `0 x 0`.
- Resize probe: existing handler creates a non-zero canvas after viewport resize.
- Console: one missing favicon request; no application exception observed.

## Boundaries

- This documentation cycle does not modify source, dependencies, workflows, tests, configuration, runtime assets, or licensing.
- The initial preview defect remains a product issue and must not be presented as fixed.
- Finished-size output is approximate.
- No open-source license is granted.

## Continuity

Inspect current remote and worktree state before acting. Preserve unrelated changes, use a review branch, keep generated evidence out of source, and update this profile only when durable facts change.
