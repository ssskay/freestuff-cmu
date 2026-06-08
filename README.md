# Free Stuff @ Carnegie Mellon

A public, agent-maintained catalog of free perks for Carnegie Mellon students and
alumni: searchable list, campus map, scenario guides, and a weekly link verifier.
Astro + Supabase, deploys to Vercel.

Built from [`freestuff-template`](https://github.com/ssskay/freestuff-template) (pack #2).
Engine updates flow in via `git merge upstream/main` (the template is the `upstream` remote).

## Pack files (the CMU-specific surface)
Everything else is the shared engine — don't edit it here; send changes upstream.

| Pack file | What it controls |
|---|---|
| `src/content/resources.json` | the catalog (source of record) — 53 verified CMU perks |
| `src/content/building-footprints.json` | campus map polygons (optional; currently empty) |
| `public/tokens.css` `--color-accent` | Carnegie Red → also drives the OG card |
| `public/og.png` | social card (generated: `npm run og`) |
| `src/site.config.ts` | branding, `MAP` model, categories, collections, scenarios |
| `agents/verify.config.json` | verifier school + domains + UA |
| narrative copy in `src/pages/*.astro` | school-specific body prose |

CMU is urban, so `MAP.anchor` is `null` — online resources list without a single
"campus center" pin (see `recipes/recipe-map.md`).

## Generators
- `npm run gen:schema` — regenerate the DB category CHECK from `CATEGORIES`.
- `npm run og` — regenerate `public/og.png` from name + brand color.

## Develop
`npm ci && npm run dev`. Test: `npm run test`. Typecheck: `npm run typecheck`.

## Still to wire (account steps)
Create a Supabase project + a Vercel project for this repo, set
`PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, apply `supabase/schema.sql`,
then `npm run seed`. The static catalog renders without a backend; Supabase only
powers upvotes, reports, and submissions.
