# Recipe: brand color

The brand color is single-sourced: `--color-accent` in `public/tokens.css`.
It may be any CSS color. If you use `oklch(...)`, the OG generator converts it to
sRGB automatically (`scripts/lib/oklch-to-hex.mts`). After changing it, run
`npm run og` to regenerate the social card so it matches.
