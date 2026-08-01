# Contributing

Contributions should preserve the shared pattern-artifact pipeline that keeps validated instructions and preview parameters aligned.

## Local setup

```bash
npm ci
npm run dev
```

The deployment workflow uses Node 22 and the committed lockfile.

## Implementation rules

- Route supported recipe changes through validation and the pattern model.
- Keep display text and downloaded text derived from the formatter.
- Keep the renderer a consumer of artifact metadata rather than a second source of recipe truth.
- Preserve recipe-safe rounds and petal constraints unless a documented recipe change intentionally expands them.
- Follow the existing vanilla JavaScript module style with semicolons and two-space indentation.
- Do not commit dependencies, build output, environment files, credentials, or private keys.

## Validation

```bash
npm run verify:patterns
npm run build
```

UI, preview, or export changes also require browser checks. Confirm initial preview sizing, control updates, normalization notes, displayed instructions, clipboard fallback, downloaded file content, responsive layout, and console output. The current initial `0 x 0` preview defect is documented in [docs/VALIDATION.md](docs/VALIDATION.md) and should remain a failing gate until repaired.

## Review summary

Describe the user outcome, affected artifact boundary, checks performed, visible proof, and any browser or deployment limitation. Do not treat a successful build as proof that WebGL output or export interactions work.
