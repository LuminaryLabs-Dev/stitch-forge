# Validation

## Automated checks

```bash
npm run verify:patterns
npm run build
```

`verify:patterns` generates four scenarios: default, minimum rounds/petals, maximum rounds/petals, and an unsupported ten-petal request. It checks round alignment, formatted-round alignment, square-compatible petal normalization, positive stitch totals, first-round export content, and valid border-band ordering.

The production build must complete. Record its emitted file sizes and warnings rather than treating warnings as failures or hiding them.

## Browser checks

For Chromium and Safari, verify:

- initial preview canvas dimensions and visible content;
- supported and unsupported control changes;
- normalization notes;
- displayed and exported round consistency;
- clipboard success or fallback behavior;
- downloaded filename and content;
- responsive layout and console errors.

## Observed baseline at main

Source commit: `7c376021dce26919eca8de8f0bc0fc9d804cfdd3`

- Four structural pattern scenarios passed.
- The Vite production build passed with one large-chunk warning.
- The deployed Pages URL returned HTTP 200.
- The most recent observed deployment workflow for this commit succeeded.
- Chromium loaded the interface and generated pattern text.
- The initial preview canvas measured `0 x 0` because rendering began before document attachment.
- A viewport resize created a non-zero drawing buffer, confirming the resize path runs, but it does not repair initial-load behavior.
- The only observed console error was a missing `/favicon.ico` request; this documentation cycle does not alter runtime assets.

## Release gate

The initial canvas defect remains a failing Human View gate. Do not describe the live preview as validated or sale-ready until initial sizing is repaired, the square is visibly inspected without manual resize, control changes update it, and Chromium and Safari evidence is retained.
