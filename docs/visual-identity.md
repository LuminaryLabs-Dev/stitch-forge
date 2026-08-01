# Visual Identity

Stitch Forge uses a restrained editorial identity that connects crochet craft with its structured pattern pipeline. The artwork represents real repository behavior: adjustable recipe inputs become a validated artifact, formatted instructions, and a Retro Daisy square.

## Visual brief

- **Audience:** crocheters, pattern authors, and developers exploring procedural craft tools.
- **Metaphor:** stitch loops and layered paper pieces assembled into a repeatable granny-square pattern.
- **Style:** flat paper-cut forms with light screen-print texture and clear input-to-output movement.
- **Avoid:** photorealistic yarn, glossy 3D interfaces, neon machinery, invented product features, cropped focal objects, and text embedded in generated artwork.

## Palette

| Role | Color | Use |
| --- | --- | --- |
| Forest | `#0B6E49` | Primary mark and structural accents. |
| Cocoa | `#2B1A14` | Dark grounding color and high-contrast backgrounds. |
| Daisy yellow | `#F2C14E` | Petal and process highlights. |
| Warm paper | `#F4E8D0` | Editorial background and neutral space. |
| Coral | `#D96C4A` | Limited secondary emphasis. |

Keep sufficient contrast around the mark and do not rely on color alone to explain a sequence. The transparent logo variants are preferred over manually removing their background.

## Asset meanings

- `logo-transparent.png` is the primary full-resolution mark.
- `logo-1024.png`, `logo-512.png`, and `logo-256.png` are padded size variants.
- `logo-mask.svg` is the editable single-color version.
- `cover-1280x640.png` presents the pattern pipeline without labels or unsupported claims.
- `social-card.png` combines the mark and cover for repository sharing.
- `manifest.json` records dimensions, hashes, palette inputs, and generation settings.

## Safe use

Keep the full mark visible with clear space around it. Do not stretch, crop, rotate, add shadows, or place it over visually busy or low-contrast content. Generated covers may illustrate the procedural flow, but they must not imply physical stitch simulation, additional recipes, or production capabilities absent from the repository.

## Regeneration

Regenerate through Repo Image Studio, inspect every source and derivative, then validate the complete pack before replacing an approved asset:

```bash
python "$REPO_IMAGE_STUDIO_ROOT/scripts/build_image_pack.py" validate \
  --pack-dir docs/assets/brand
```

Asset replacement is a reviewed documentation change. Preserve the source images and manifest so later revisions remain reproducible and auditable.
