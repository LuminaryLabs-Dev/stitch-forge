# Stitch Forge Documentation

Stitch Forge turns recipe-safe Retro Daisy controls into one structured pattern artifact. That artifact drives summaries, round instructions, text export, and preview parameters.

| Need | Read |
| --- | --- |
| Repository orientation | [`../README.md`](../README.md) |
| Architecture and boundaries | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| Local operation and deployment | [`OPERATIONS.md`](OPERATIONS.md) |
| Automated and human validation | [`VALIDATION.md`](VALIDATION.md) |
| Brand assets and usage | [`visual-identity.md`](visual-identity.md) |

## Implemented scope

- One curated recipe: Retro Daisy Granny Square.
- Three through eight rounds.
- Four, eight, twelve, or sixteen petals after normalization.
- Browser-local generation, display, copy, and plain-text download.
- Three.js shader preview parameters derived from the same artifact as the instructions.
- GitHub Pages deployment from `main`.

Finished-size values are estimates. The preview is a shader-based structural representation, not a physical crochet simulation or grading system.

## Current limitation

The current renderer measures a detached preview container and initializes the canvas at `0 x 0`. See [`VALIDATION.md`](VALIDATION.md) for the observed evidence and release gate.
