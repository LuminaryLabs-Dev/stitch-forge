# Operations

## Local development

```bash
npm ci
npm run dev
```

Vite prints the local URL. The application requires a browser with WebGL support for the structural preview; pattern generation and text export are ordinary browser JavaScript paths.

## Verification and build

```bash
npm run verify:patterns
npm run build
```

The pattern check covers default, minimum, maximum, and normalized-petal scenarios. The build writes ignored output to `dist/` and currently reports a JavaScript chunk larger than 500 kB as a Vite warning.

## User workflow

1. Load the Retro Daisy preset.
2. Adjust rounds, petal count, colors, and preview-only visual controls.
3. Review any normalization note and the generated round instructions.
4. Copy the instructions or download `stitch-forge-retro-daisy.txt`.

## Deployment

The Pages workflow runs on pushes to `main` or manual dispatch:

```text
npm ci -> npm run build -> upload dist -> deploy Pages
```

Live site: <https://luminarylabs-dev.github.io/stitch-forge/>

Verify local checks, the Actions run, HTTP availability, and Human View separately. A green deployment does not prove WebGL output.

## Current operational limitation

The preview canvas initializes at `0 x 0` because the renderer measures its container before the app is attached. Resizing the viewport creates a non-zero canvas through the existing resize handler. Do not use the initial live preview as release evidence until the initialization order is repaired and browser-tested.
