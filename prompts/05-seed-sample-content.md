# 05 — Seed Sample Content (10+ courses, cross-course search data)

## Goal

Fill the `production` dataset with a realistic, coherent catalog so the catalog, course, lesson, instructor pages and the cross-course search have real data: a handful of instructors and categories, and at least 10 courses about programming, web development, AI, data, infrastructure, and security, each with modules and lessons that genuinely cover their module's topic.

Keep the relations consistent: a module's duration and lesson count are the sum of its lessons, and a course's are the sum of its modules. Nothing aggregated is stored; it is all derived from lessons.

Out of scope: video documents / transcript ingestion, the Context document, search, progress, any web UI change.

## Skills / docs read

- `AGENTS.md` §7 (coherent content, Portable Text, video embeds), §8 (data shapes), §9, §12–13.
- `sanity-migration` (`SKILL.md`): deterministic IDs, `createOrReplace` so reruns converge, no fetch-then-create for references, validate before import.
- `sanity-best-practices`: references for relationships, `_key` on array items, images as asset references.

## Code inspected

- `studio/schemaTypes/**`: course (modules embedded, outcomes icon from a fixed list of 12), lesson (`summary` **required**, `durationSeconds`, `poster`, `videoUrl` restricted to YouTube/Vimeo/Bunny hosts, `resources[].type` ∈ documentation/guide/repository/article/video), instructor (`expertise` is a **string**), category.
- `src/sanity/queries.ts`: module and course durations are already derived with `math::sum(lessons[]->durationSeconds)` / `math::sum(modules[].lessons[]->durationSeconds)`; module count with `count(modules)`. So "module = sum of lessons, course = sum of modules" holds automatically as long as nothing aggregated is stored.
- `studio/scripts/seed.ts`: old seed (3 courses, 1 placeholder instructor, 2 categories, lessons with **no** `videoUrl`). This is what is in the dataset today (~47 docs, random generated `_id`s).
- `studio/scripts/seed/seed.ndjson` + `videos.json` (untracked draft): 6 categories, 5 instructors, 10 courses × 4 modules × 3 lessons = 120 lessons, each with a unique real YouTube URL matched to the lesson topic (from `videos.json`), YouTube thumbnail, duration = the video's length, Portable Text notes, key points, pro tips. Good content, but it **does not match the schema**:
  - lesson uses `thumbnail` / `duration` instead of `poster` / `durationSeconds`, and has no `summary` (required);
  - instructor `expertise` is an array (schema: string);
  - learning outcome icons `workflow`, `sparkles`, `puzzle` are not in the allowed list;
  - every resource has `type: "link"` (not allowed);
  - course covers are random picsum photos, but the design (`design/vertex-home.png`, `vertex-search.png`) shows a square tech logo tile (N, Docker whale, TS);
  - `_id`s contain a dot (`course.x`), which Sanity treats as a path id (sub-path visibility rules). Use dash ids instead.
- `public/courses/{nextjs,docker,typescript}.svg`: 72×72 rounded-square logo style used by the old seed.

## Decisions and assumptions

1. **Source of truth = `studio/scripts/seed/seed.ndjson`**, corrected in place to match the schema (one-off transform, not committed). Catalog stays as drafted:
   - Categories (6): Web Development, AI Engineering, Backend & Infrastructure, Data, Languages, Security.
   - Instructors (5): Mira Kovac, Daniel Okafor, Priya Raman, Tomas Berg, Alina Costa (fictional, randomuser.me portraits).
   - Courses (10): Next.js App Router in Depth · React Performance Engineering · TypeScript for Application Developers · Building AI Apps with LLMs · Retrieval-Augmented Generation from Scratch · Python for Data Work · System Design Foundations · PostgreSQL for Developers · DevOps with Docker and Kubernetes · Practical Web Security. 4 modules × 3 lessons each = 120 lessons.
   - Deliberate topic overlap across courses (caching, data fetching, Docker, auth, streaming, indexes, Suspense…) so cross-course search returns multi-course results.
2. **Fixes applied to the ndjson**
   - `_id`: `type.slug` → `type-slug`; all `_ref`s rewritten to match.
   - Lesson: `thumbnail` → `poster`, `duration` → `durationSeconds`; add an authored one-sentence `summary` (≤ 200 chars) per lesson, distinct from the notes intro.
   - Instructor `expertise` → a single string, e.g. "React, Next.js & Web Performance".
   - Outcome icons remapped to the allowed list by meaning (workflow → layers/server, sparkles → zap, puzzle → code).
   - Resource `type`: official docs → `documentation`, github.com → `repository`, otherwise `article`.
   - Cover: `coverImage` points at a local SVG logo tile in `studio/scripts/seed/covers/<course>.svg` (same 72×72 style as `public/courses`; shapes/paths, no fonts except where the existing TS tile does it). Reuse the three existing tiles where they fit (Next.js, TypeScript, Docker).
   - Student counts: lesson `studentCount` ≤ its course's `studentCount` (already true; asserted).
3. **`studio/scripts/seed.ts` rewritten** as the single, idempotent seeder (`npm run seed`):
   - Reads `seed.ndjson`, runs integrity checks and aborts before writing if any fail: every `_ref` resolves; every lesson belongs to exactly one module of exactly one course; every module has ≥ 1 lesson; required fields present; `durationSeconds` positive integer; `videoUrl` host allowed; outcome icon and resource type in the schema lists; slugs unique per type; `_key`s unique per array.
   - Resolves `_sanityAsset` values (`image@https://…` remote, `image@file://covers/x.svg` local to `scripts/seed/`) by uploading through `client.assets.upload` (Sanity dedupes by hash, so reruns reuse assets).
   - Writes everything with `createOrReplace` in one transaction (categories, instructors, lessons, courses).
   - Prunes the old seed: deletes `course`, `lesson`, `instructor`, `category` docs (published and `drafts.`) whose `_id` is not in the seed, in the same transaction so references never dangle. Orphaned old cover assets are left alone.
   - Prints a summary per course: modules, lessons, total duration, and checks it equals the sum of its module totals.
4. **Video URLs**: keep the draft's YouTube URLs. Before seeding, verify each one is a live, embeddable video via YouTube oEmbed; any that fail get replaced with another real video on the same topic (never invented). Durations stay = the video's real length so resume and timestamps line up later.
5. `videos.json` stays as the provenance record (title, channel, duration per lesson video); the video ingestion task will reuse it.

## Files expected to change

- Changed: `studio/scripts/seed.ts` (rewritten), `studio/scripts/seed/seed.ndjson` (fixed), `studio/scripts/seed/videos.json` (exact lengths, SQL injection replacement), `studio/schemaTypes/documents/lesson.ts` (`VIDEO_HOSTS` exported for the seed check; no schema change).
- New: `studio/scripts/seed/covers/*.svg` (10 tiles).
- Dataset `production`: +141 docs (6 categories, 5 instructors, 10 courses, 120 lessons), −old seed docs.
- No web or schema changes.

## Security

- Seeder runs locally with the CLI user token (`sanity exec --with-user-token`); no token added to any file or env.
- No new secrets. Dataset stays private; the web reads with the existing server-only viewer token.
- Remote assets are fetched only from fixed hosts in the seed (i.ytimg.com, randomuser.me).

## Acceptance criteria

- `count(*[_type=="course"]) == 10`, `lesson == 120`, `instructor == 5`, `category == 6`; no old seed docs or drafts remain.
- Every course has ≥ 3 modules, every module ≥ 1 lesson, and no lesson is unreferenced or referenced twice.
- For every course: `math::sum(modules[].lessons[]->durationSeconds)` equals the sum of each module's `math::sum(lessons[]->durationSeconds)` (checked by query).
- Every lesson has title, slug, summary, notes, keyPoints, a YouTube `videoUrl` that resolves, a poster, and `durationSeconds`.
- Studio shows no validation errors on seeded docs.
- Re-running `npm run seed` changes nothing (same ids, same asset ids).
- Home page shows seeded courses with logo tiles, level, summed duration, module count.

## Checks

- Studio: `npx tsc --noEmit`, `npm run seed` (twice, second run is a no-op), GROQ verification queries via `npx sanity documents query`, `npx sanity documents validate` if available.
- Web: `npx tsc --noEmit`, `npm run lint`, `npm run dev` and load `/` (no code change, so no build).

## Manual test steps

1. `cd studio && npm run seed` → summary lists 10 courses, each "4 modules · 12 lessons · Xh Ym", and "pruned N old docs".
2. `npm run dev` in `studio/` → http://localhost:3333 → Courses shows 10; open "Building AI Apps with LLMs" → Curriculum → 4 modules, each "3 lessons"; open a lesson → Video tab has a YouTube URL and poster, no validation warnings.
3. Instructors shows 5 with photos; Categories shows 6.
4. Vision: `*[_type=="course"]{title, "total": math::sum(modules[].lessons[]->durationSeconds), "mods": math::sum(modules[]{"d": math::sum(lessons[]->durationSeconds)}.d)}` → `total == mods` for every row.
5. Root `npm run dev` → http://localhost:3000 → home tiles come from the new catalog (restart the dev server first; cached data uses `cacheLife("max")`).
