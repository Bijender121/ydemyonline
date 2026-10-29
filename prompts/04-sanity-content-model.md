# 04 — Sanity Content Model, Standalone Studio, Server Data Layer

## Goal

Model Vertex's content in Sanity (course, module, lesson, instructor, category), run the Studio as its own workspace (`studio/`), and give the web app a server-only read client plus a typed data layer. Replace the home page fixture with a real GROQ query. Seed a small, coherent dataset so the home page renders real content.

Out of scope (later tasks): video documents + ingestion, the Context document, search, progress records, and the catalog / course / lesson / instructor pages themselves. Their query helpers are added now so those tasks only build UI.

## Skills / docs read

- `AGENTS.md` (§5, §6, §7, §8, §12, §13).
- `sanity-best-practices`: `project-structure.md`, `nextjs.md` (§1 architecture, §3 caching, §5 migrating an embedded Studio), `schema.md`, `typegen.md`. Global rules: generated `_id`s, references for relationships, `@sanity/icons/<Name>` subpath imports, omit redundant `title`s, `defineField`/`defineArrayMember` everywhere, video stored as an embed URL only.
- Next docs: `01-getting-started/08-caching.md`, `09-revalidating.md` — with `cacheComponents: true`, CMS data uses `"use cache"` + `cacheTag` + a long `cacheLife`, invalidated with `revalidateTag` from a webhook.

## Code inspected

- Embedded Studio scaffold: root `sanity.config.ts` (`'use client'`, basePath `/studio`), `sanity.cli.ts`, `src/app/studio/[[...tool]]/page.tsx`, `src/sanity/{env,structure}.ts`, empty `src/sanity/schemaTypes/index.ts`.
- `src/sanity/lib/client.ts`: tokenless CDN client, not server-only. `src/sanity/lib/live.ts`: `defineLive` with no tokens (unused).
- `src/sanity/lib/image.ts`: `urlFor` via `@sanity/image-url` — keep.
- `src/lib/data/courses.ts`: `server-only`, `"use cache"`, fixture `CourseSummary[]` (slug, title, summary, icon {src, alt}, level, durationSeconds, moduleCount). Only consumer: `src/app/(site)/page.tsx` (renders `<Image src={icon.src}>` in `CourseCard layout="tile"`).
- `package.json`: `sanity`, `@sanity/vision`, `styled-components` exist only for the embedded Studio. `next-sanity` 13, `@sanity/image-url` 2.
- `tsconfig.json` includes `**/*.ts`; ESLint ignores agent folders only.
- Designs `design/vertex-course.png`, `vertex-lesson.png`: course shows popular badge, level, total duration, module count, student count, 4 learning outcomes (icon + title + description), module rows (number, title, summary, summed duration). Lesson shows label "Lesson 5.1", title, one-line summary, duration, level (from course), student count, Overview text, "In this lesson you will" list, Pro Tip, Resources (doc / guide / GitHub repo), previous / next lesson.
- Sanity CLI 6.7 is logged in. Dataset `production` exists, is **public**, and has 0 documents.

## Decisions and assumptions

### 1. Workspaces (user chose "Add studio/")

- New `studio/` standalone Sanity Studio with its own `package.json` (`sanity`, `@sanity/vision`, `@sanity/icons`, `react`, `react-dom`, `styled-components`, `typescript`), `tsconfig.json`, `.gitignore`, `.env.example`, `sanity.config.ts`, `sanity.cli.ts`, `structure.ts`, `schemaTypes/`.
- The Next app stays at the repo root as the web workspace.
- Remove the embedded Studio: delete root `sanity.config.ts`, `sanity.cli.ts`, `src/app/studio/`, `src/sanity/structure.ts`, `src/sanity/schemaTypes/`. Uninstall `sanity`, `@sanity/vision`, `styled-components` from the root. Keep `next-sanity` and `@sanity/image-url`.
- Root `tsconfig.json` and `eslint.config.mjs` exclude `studio/`.
- Studio env: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` (in `studio/.env`, gitignored; `studio/.env.example` committed).

### 2. Schema (`studio/schemaTypes/`)

`documents/`, `objects/`, kebab-case files, every type gets an icon and a `preview`.

- **category** (`TagIcon`): `title` (req), `slug` (req, from title), `description` (text).
- **instructor** (`UserIcon`): `name` (req), `slug` (req), `photo` (image, hotspot, `alt`), `expertise` (string, e.g. "Senior Frontend Engineer"), `bio` (Portable Text: normal paragraphs, bold/italic/link only).
- **course** (`BookIcon`): `title` (req), `slug` (req), `summary` (text, req, max 200 warn), `coverImage` (image, hotspot, `alt`, req), `level` (radio: beginner / intermediate / advanced, req), `price` (number ≥ 0, USD; 0 = free), `popular` (boolean, default false), `studentCount` (integer ≥ 0, display only), `learningOutcomes` (array of `learningOutcome`, max 6), `instructor` (ref → instructor, req), `category` (ref → category, req), `modules` (array of `module`, min 1). Field groups: Content, Marketing, Curriculum.
- **learningOutcome** object: `icon` (string from a fixed list: layers, database, gauge, cloud, code, shield, rocket, zap, server, globe, lock, terminal — the web maps these to lucide icons), `title` (req), `description` (text, req).
- **module** object (embedded in course, not a document): `title` (req), `summary` (text), `lessons` (array of refs → lesson, min 1, unique). Preview shows lesson count. Numbers ("Module 5", "Lesson 5.1") are derived from order, never stored.
- **lesson** (`PlayIcon`): `title` (req), `slug` (req, unique), `summary` (text, req, max 200 warn — the design's subtitle and the search card description), `videoUrl` (url, req, custom validation: host must be YouTube, Vimeo, or Bunny), `poster` (image, hotspot, `alt`), `durationSeconds` (integer > 0, req), `freePreview` (boolean, default false, label only), `studentCount` (integer ≥ 0), `notes` (Portable Text: normal, h2, h3, blockquote, bullet / number lists, bold/italic/code/link, plus inline image with alt), `keyPoints` (array of strings, max 8), `proTip` (text), `resources` (array of `resource`). Groups: Content, Video, Resources. No parent course field; the course is derived with `references()`.
- **resource** object: `type` (radio: documentation / guide / repository / article / video, req), `title` (req), `description` (text), `url` (url, http/https, req).

Studio structure: Courses, Lessons, Instructors, Categories (each a document type list). Vision tool on.

### 3. TypeGen

- `studio/sanity.cli.ts`: `typegen: { enabled: true, path: "../src/**/*.{ts,tsx}", schema: "schema.json", generates: "../sanity.types.ts", overloadClientMethods: true }`.
- Script in `studio/package.json`: `"typegen": "sanity schema extract --enforce-required-fields --force && sanity typegen generate"`.
- Commit `sanity.types.ts` at the repo root (skill option A); `studio/schema.json` gitignored.

### 4. Web data access (server-only)

- `src/sanity/env.ts`: keep `projectId`, `dataset`, `apiVersion` (client-safe). Add `src/sanity/lib/token.ts` (`server-only`) exporting `SANITY_API_READ_TOKEN`, throwing if missing.
- `src/sanity/lib/client.ts`: `import "server-only"`, `createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", token })`.
- `src/sanity/lib/fetch.ts`: `sanityFetch({ query, params, tags })` with `"use cache"`, `cacheLife("max")`, `cacheTag("sanity", ...tags)`, typed via `ClientReturn<Q>`.
- Delete `src/sanity/lib/live.ts`: Live Content against a private dataset needs a browser token, which AGENTS.md forbids.
- `src/app/api/revalidate/route.ts`: Sanity webhook target. Verifies the signature with `parseBody` from `next-sanity/webhook` and `SANITY_REVALIDATE_SECRET`, then calls `revalidateTag` for the document's `_type` (and `"sanity"`). Invalid signature → 401. Without this route, edits would never show up while the cache is set to `max`.
- `src/sanity/lib/image.ts`: unchanged (asset CDN URLs are public by design; no token involved).

### 5. Queries + data layer

`src/sanity/queries.ts` (`defineQuery`, unique names, `_key` in every array projection):

- `COURSES_QUERY` — catalog / home: `slug`, `title`, `summary`, `coverImage`, `level`, `popular`, `studentCount`, `price`, `moduleCount: count(modules)`, `durationSeconds: math::sum(modules[].lessons[]->durationSeconds)`, ordered by title.
- `COURSE_QUERY($slug)` — detail: the fields above + `learningOutcomes[]`, `instructor->{name, slug, photo, expertise}`, `category->{title, slug}`, `modules[]{_key, title, summary, durationSeconds: math::sum(lessons[]->durationSeconds), lessons[]->{_id, title, slug, durationSeconds, freePreview}}`.
- `LESSON_QUERY($slug)` — the lesson's fields + `"course": *[_type == "course" && references(^._id)][0]{ slug, title, coverImage, level, instructor->{...}, modules[]{_key, title, lessons[]->{_id, title, slug, durationSeconds}} }`. Lesson label and previous / next are derived in TS from the course's module order.
- `INSTRUCTOR_QUERY($slug)` — instructor + `"courses": *[_type == "course" && references(^._id)]` (same card projection).
- `CATEGORIES_QUERY`.
- `COURSE_SLUGS_QUERY`, `LESSON_SLUGS_QUERY` for later `generateStaticParams`.

`src/lib/data/` (`server-only`, thin wrappers over `sanityFetch` with tags):

- `courses.ts`: `getCourses()`, `getCourse(slug)`. `CourseSummary` keeps its shape for the home page, except `icon` becomes `{ src: urlFor(coverImage).width(144).height(144).url(), alt }`. Level is title-cased for display.
- `lessons.ts`: `getLesson(slug)` returns the lesson + course context + derived `moduleNumber`, `lessonNumber` (e.g. 5 / 1), `previous`, `next`.
- `instructors.ts`: `getInstructor(slug)`. `categories.ts`: `getCategories()`.
- Missing slugs return `null` (pages call `notFound()` later).

Home page: `next.config.ts` gets `images.remotePatterns` for `cdn.sanity.io`. No other markup changes.

### 6. Dataset, deploys, seed

- Set `production` to **private**: `npx sanity datasets visibility set production private`. This is a project setting; it's reversible.
- Read token: create a Viewer token with `npx sanity tokens add "vertex-web-read" --role=viewer`, and put it in `.env.local` as `SANITY_API_READ_TOKEN` (I write it there; never committed).
- `npx sanity cors add http://localhost:3000` is not needed (all reads are server-side), so skip it.
- From `studio/`: `npx sanity schema deploy` and `npx sanity deploy` (hosted Studio; the hostname is asked interactively the first time, so if it prompts I'll ask you for a name, suggesting `vertex-learning`). AGENTS.md §12: the Context MCP later needs a deployed Studio application.
- Seed: `studio/scripts/seed.ts`, run with `npx sanity exec scripts/seed.ts --with-user-token`. Idempotent: it looks documents up by slug and creates only what's missing (generated `_id`s, references from the returned ids). Content:
  - Categories: Web Development, DevOps.
  - One instructor (placeholder name you can edit) + photo-less.
  - Three courses matching the current fixture (Next.js for Production, Docker Essentials, TypeScript Deep Dive), cover images uploaded from `public/courses/*.svg`.
  - Next.js course: the design's 12 module titles + summaries, 4 learning outcomes from the design; Module 5 "Data Fetching & Caching" has the design's 5 lessons with summary, key points, pro tip, notes, resources. Other modules get 1–2 lessons each on their own topic so content stays coherent (§7). Docker / TypeScript: 2–3 modules with 1–2 lessons each.
  - **Video URLs**: I won't make up URLs. Every seeded lesson gets `videoUrl` left empty, so Studio shows a required-field warning until you paste real YouTube / Vimeo / Bunny links. Durations are plausible authored values.

### 7. Env

`.env.example` adds: `NEXT_PUBLIC_SANITY_PROJECT_ID=`, `NEXT_PUBLIC_SANITY_DATASET=`, `NEXT_PUBLIC_SANITY_API_VERSION=`, `SANITY_API_READ_TOKEN=`, `SANITY_REVALIDATE_SECRET=`. `studio/.env.example`: `SANITY_STUDIO_PROJECT_ID=`, `SANITY_STUDIO_DATASET=`.

## Files expected to change

- New: `studio/**` (package.json, tsconfig.json, .gitignore, .env.example, sanity.config.ts, sanity.cli.ts, structure.ts, schemaTypes/{index.ts, documents/{course,lesson,instructor,category}.ts, objects/{module,learning-outcome,resource}.ts}, scripts/seed.ts), `src/sanity/queries.ts`, `src/sanity/lib/{fetch,token}.ts`, `src/lib/data/{lessons,instructors,categories}.ts`, `src/app/api/revalidate/route.ts`, `sanity.types.ts`.
- Changed: `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `.env.example`, `src/sanity/lib/client.ts`, `src/lib/data/courses.ts`, `.env.local` (not committed).
- Deleted: root `sanity.config.ts`, `sanity.cli.ts`, `src/app/studio/`, `src/sanity/structure.ts`, `src/sanity/schemaTypes/`, `src/sanity/lib/live.ts`.

## Security

- Dataset becomes private; every read goes through the `server-only` client with `SANITY_API_READ_TOKEN`. The token never gets a `NEXT_PUBLIC_` prefix and is never imported from a client module (`server-only` makes that a build error).
- No write token in the web app in this task. The seed uses your CLI user token locally only.
- The revalidate webhook verifies signatures; a request without a valid signature is rejected and can't touch the cache.
- No secrets committed; `.env.example` files contain empty values.

## Acceptance criteria

- `cd studio && npm run dev` opens the Studio at http://localhost:3333 with Courses, Lessons, Instructors, Categories; validation behaves as specified (e.g. a non-YouTube/Vimeo/Bunny URL is rejected).
- `/studio` no longer exists in the Next app; the root no longer depends on `sanity`.
- Anonymous `curl` to the dataset query API returns no documents (private).
- Home page shows the three seeded courses from Sanity with cover icons, level, summed duration, and module count.
- `sanity.types.ts` is generated and the query helpers are typed from it.
- Removing `SANITY_API_READ_TOKEN` fails loudly server-side, never silently returns empty.

## Checks

- Studio: `npm install`, `npm run typegen`, `npx tsc --noEmit`, `npx sanity schema deploy`, `npx sanity deploy`, seed run.
- Web: `npm install`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run dev` and load `/`.
- Live check: GROQ `count(*[_type == "course"])` with token = 3; anonymous = 0.

## Manual test steps

1. `cd studio && npm run dev` → open http://localhost:3333, sign in, open Courses → "Next.js for Production" → Curriculum shows 12 modules.
2. Open any lesson, paste `https://example.com/video` into Video URL → validation error. Paste a YouTube URL → accepted. Publish.
3. From the repo root `npm run dev` → open http://localhost:3000 → three course tiles from Sanity.
4. Open http://localhost:3000/studio → 404.
5. Edit a course summary in Studio and publish → once the webhook is configured (see report), the home page shows it after a refresh.
