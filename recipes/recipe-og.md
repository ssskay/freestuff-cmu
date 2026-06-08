# Recipe: social (OG) image

`public/og.png` (1200×630) is generated, not hand-made.
Run `npm run og`. It reads `SITE.name` from `src/site.config.ts` and the brand
color from `public/tokens.css`, renders an SVG, and rasterises it with sharp.
To restyle the card, edit `renderOgSvg` in `scripts/gen-og.mts`.
