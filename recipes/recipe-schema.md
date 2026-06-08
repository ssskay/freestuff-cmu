# Recipe: categories + database schema

Categories live in **one** place: `CATEGORIES` in `src/site.config.ts`.
The `category` CHECK constraint in `supabase/schema.sql` is generated from it —
never hand-edit the block between `-- <category-check:start>` and `:end>`.
After changing `CATEGORIES`, run `npm run gen:schema`, then re-apply the schema
in Supabase. The `schema-check` test fails if the file drifts from the config.
