# Architecture

## Runtime shape

```text
index.html
  -> src/main.js
    -> src/ui.js
      -> src/generator.js
        -> src/validation.js
        -> src/pattern-model.js
        -> src/formatter.js
      -> src/renderer.js
```

Stitch Forge has no implemented backend or persistence layer. Vite serves a static browser application, and `src/main.js` mounts the UI into `#app`.

## Pattern artifact

`generatePattern()` is the composition boundary:

1. `src/presets.js` supplies Retro Daisy defaults and constraints.
2. `src/validation.js` normalizes rounds, petals, colors, and visual settings.
3. `src/pattern-model.js` builds rounds, stitch metadata, materials, notes, summaries, warnings, and render bands.
4. `src/formatter.js` derives display-ready rounds and plain-text export content.
5. `src/ui.js` applies normalized values back to local state and presents the artifact.

Two presentation paths consume that artifact:

- the pattern panel presents instructions, materials, abbreviations, notes, and summaries;
- the Three.js renderer maps normalized colors, summaries, and render bands into shader uniforms.

This is the main consistency invariant. Recipe behavior belongs in validation and pattern construction, not duplicated in UI or shader code.

## Rendering boundary

`src/renderer.js` creates a plane mesh, custom shader material, lights, orbit controls, animation loop, and resize handler. The renderer returns `update()` and `dispose()` methods to the UI.

The current initialization order is defective: `createApp()` calls `createRenderer()` before `src/main.js` attaches the returned root to the document. The detached preview reports zero width and height, and `renderer.setSize()` creates a `0 x 0` canvas. A later viewport resize invokes the handler with real dimensions. This defect is independent of pattern generation and formatting but blocks trustworthy initial-preview claims.

## Export boundary

Clipboard export uses the Clipboard API with a temporary-textarea fallback. Download export creates a browser-local text blob named `stitch-forge-retro-daisy.txt`. Neither path sends pattern data to a server in the inspected implementation.

## Deployment

`.github/workflows/deploy-pages.yml` installs locked dependencies with Node 22, runs the production build, uploads `dist/`, and deploys GitHub Pages after pushes to `main` or manual dispatch. `vite.config.js` uses a relative base path for static hosting.
