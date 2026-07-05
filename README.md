# Stitch Forge

Stitch Forge is a procedural crochet pattern generator for granny squares. This MVP focuses on one sellable design: the Retro Daisy Granny Square.

## Stack

- Vite
- Vanilla JavaScript
- Three.js with shader materials
- Shared pattern artifact pipeline for validation, formatting, and rendering

## What It Does

- Generates a Retro Daisy granny square pattern
- Validates the Retro Daisy recipe before rendering or exporting
- Renders the square in an interactive Three.js scene from the same computed pattern artifact used for export
- Uses shader-driven visual shading for yarn softness, glow, and depth
- Lets you edit colors, rounds, petal count, and visual intensity live
- Lets you copy or download the pattern as text

## Run It

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open the local Vite URL shown in the terminal.
4. Optional structural verification:
   ```bash
   npm run verify:patterns
   ```

## Use It

- Click `Retro Daisy` to load the preset.
- Adjust rounds, petal count, colors, softness, glow, and depth.
- If a setting falls outside the supported Retro Daisy recipe, Stitch Forge normalizes it and shows a recipe note.
- Rotate, pan, and zoom the preview with the mouse.
- Read the generated pattern in the lower panel.
- Click `Copy Pattern` or `Download .txt` to export it.

## Preview Behavior

The preview is a live Three.js scene using `ShaderMaterial`. The renderer consumes the same computed pattern artifact as the export formatter, so round count, petal count, and border growth stay aligned with the generated instructions. The shader handles visual depth, yarn-like ridge detail, and glow.

## Export

- `Copy Pattern` sends the current crochet instructions to the clipboard.
- `Download .txt` saves the current pattern as a plain text file.

## Supported Retro Daisy Inputs

- Rounds: `3` to `8`
- Petal counts: `4`, `8`, `12`, `16`

Unsupported values are normalized to the closest supported recipe-safe value.

## Current Architecture

- `src/ui.js`: editor shell, warning display, export actions
- `src/generator.js`: build entrypoint for the computed pattern artifact
- `src/validation.js`: input normalization and recipe safety rules
- `src/pattern-model.js`: structured rounds, counts, render bands
- `src/formatter.js`: on-screen and export formatting
- `src/renderer.js`: Three.js preview from the computed artifact
- `src/presets.js`: recipe defaults and constraints

## Known Limitations

- This MVP ships with one curated asset: Retro Daisy Granny Square.
- Pattern sizing is approximate and intended for selling/use as a practical draft rather than a grading system.
- Clipboard export depends on browser permissions.
- Safari and Chromium should both be checked before final sale use.

## License

No open-source license is granted for this repository at this time.
