# 02 — Vertex Home Page

## Goal

Build the home page (`/`) from `design/vertex-home.png`: site header, hero (eyebrow pill, display headline, subtitle, Explore Courses CTA, large search box with ⌘K), All Courses section with three course tiles, a "new courses every week" divider, and the decorative orange bar band at the bottom. The page sits inside the shared site frame (hatched side gutters + bordered canvas) that every page design uses.

**Data (decided with the user):** the UI is built now against a typed, server-only `getCourses()` that returns the three courses in the design. The Sanity task replaces only that function's body with a GROQ query; the page doesn't change. Bell and avatar are presentational placeholders until the Clerk task.

## Skills / docs read

- `AGENTS.md` (sections 3, 5, 7, 14).
- `prompts/01-design-system.md` (tokens and components to reuse).
- Next docs: `01-getting-started/05-server-and-client-components.md` (`server-only` ships with Next, no install), `03-api-reference/01-directives/use-cache.md` (Cache Components is on; data functions use `"use cache"`).
- No Sanity / Clerk / PostHog skill applies yet. `getCourses()` is shaped so the Sanity task can drop in a query.

## Code inspected

- `src/app/page.tsx` (placeholder), `src/app/layout.tsx`, `src/app/globals.css` tokens.
- `src/components/layout/site-nav.tsx`, `src/components/ui/{button,input,icon,logo}.tsx`, `src/components/cards/course-card.tsx`.
- `design/vertex-course.png`, `vertex-lesson.png`, `vertex-search.png` headers: same header (logo, Courses / My Learning, bell, avatar) and the same hatched frame, so both go in a shared layout.

## Decisions and assumptions

1. **Scale.** The 1024px image is read as a 1280px desktop viewport (×1.25), with values snapped to design-system tokens. Visual check is done at 1280px against the image scaled to match.
2. **Route group `(site)`.** `src/app/(site)/layout.tsx` renders the frame + `SiteHeader`; `src/app/(site)/page.tsx` is the home page. Later pages (course, lesson, search, my learning) go in the same group. `/design-system` stays outside it.
3. **Site frame.** Body background is the canvas color with a subtle diagonal hatch (CSS `repeating-linear-gradient`) visible only in the side gutters. A centered column (~1205px at 1280) has a solid canvas background and 1px `neutral-100`-ish side borders. On mobile the gutters collapse to 0.
4. **SiteHeader.** Reuses `SiteNav` (logo + Courses / My Learning, active state) plus a right cluster: a notifications bell button (presentational, `aria-label="Notifications"`) and an avatar placeholder (neutral circle with a user icon; real user image in the Clerk task). Bottom border. `SiteNav` link size goes from 14px to 16px to match the page designs; the logo gets slightly larger. This also updates the `/design-system` nav sample, which matches the page designs better.
5. **Hero.**
   - Eyebrow pill "INTELLIGENT LEARNING": `primary-500` text, wide tracking, `primary-100` tint background, `primary-200` border, `rounded-sm`.
   - Headline: Playfair Display, ~72/80, two lines ("Search your learning / in plain English."). Larger than Display 1, so it's a page-specific size with a responsive step-down (≈40px on mobile).
   - Subtitle: `text-heading-3` regular, `neutral-500`/`700`, max ~2 lines.
   - CTA: `Button` primary with arrow-right icon, linking to `/courses`. Add a `xl` button size (56px tall, `px-6`, 18px text) for hero CTAs, rather than overriding classes.
6. **Hero search.** `SearchInput` gets a `size="lg"` (≈80px tall, `rounded-lg`, `shadow-sm`, larger icon, placeholder and ⌘K kbd). The hero search is a small client component: a GET `<form action="/search">` with `name="q"`, so it works without JS, plus a ⌘K / Ctrl+K listener that focuses the input. `/search` doesn't exist yet (search task), so submitting shows the 404 until then.
7. **Course tiles.** Add a `layout="tile"` to `CourseCard` (the existing compact layout stays the default):
   - ~72px icon tile (image, `rounded-md`), Playfair `text-heading-1`-sized title, `body-lg` `neutral-500` summary, a divider, then a meta row: level (bar-chart icon), duration (clock), modules (file icon), all `text-small`.
   - White card, `rounded-lg`, `border-neutral-100`, `shadow-sm`, hover `shadow-md`; the whole card links to `/courses/[slug]` (not built yet).
   - Grid: 3 columns desktop, 2 tablet, 1 mobile.
8. **Course icons.** The fixture ships three simple SVG icon tiles in `public/courses/` (a black "N" tile, a blue "TS" tile, a simplified whale-and-containers mark) so the page matches the design. They're stand-ins; in the Sanity task the icon comes from the course image field. Rendered with `next/image`.
9. **Section header.** "All Courses" in Playfair `text-display-2`-ish (36px) on the left; "View all courses →" as a `Button variant="text"` with an arrow on the right, linking to `/courses`.
10. **Divider + bars.** A centered line with a star icon and "New courses and lessons added every week." (`body-lg`, `neutral-700`) and hairlines either side. Below, a decorative `aria-hidden` band of ~14 orange bars at varying heights in two clusters, each a vertical gradient from `primary-300` to transparent with a soft blur, matching the image. Pure CSS, no images.
11. **Data function.** `src/lib/data/courses.ts`: `import "server-only"`, `"use cache"`, returns `CourseSummary[]` (`slug, title, summary, icon {src, alt}, level, durationSeconds, moduleCount`). The page awaits it inside the server component. The duration shows via the existing `formatDuration`.

## Files to touch

- `src/app/page.tsx` → delete (moved into the group).
- `src/app/(site)/layout.tsx` — new; frame + header.
- `src/app/(site)/page.tsx` — new; home page.
- `src/app/globals.css` — hatch gutter utility (if not expressible inline).
- `src/components/layout/site-header.tsx` — new.
- `src/components/layout/site-nav.tsx` — link/logo sizing.
- `src/components/home/hero-search.tsx` — new (client).
- `src/components/home/bars-band.tsx` — new (decorative).
- `src/components/ui/button.tsx` — `xl` size.
- `src/components/ui/input.tsx` — `size="lg"` for `SearchInput`.
- `src/components/cards/course-card.tsx` — `layout="tile"`.
- `src/lib/data/courses.ts` — new fixture data function + type.
- `public/courses/{nextjs,docker,typescript}.svg` — new stand-in icons.

## Requirements

- Desktop (1280px) layout, spacing, type, and colors match `design/vertex-home.png`; no restyling.
- Responsive: header keeps logo, links, and icons on one row down to 375px (smaller gaps); hero text scales down; search box full width; tiles stack; bars band scales and doesn't cause horizontal scroll; 16px side gutter.
- All values come from tokens, except the hero headline size and the decorative bar geometry, which are page-specific.
- Accessible: one `h1`; the section uses an `h2`; the search input has a label; bell and avatar have accessible names; decorative elements are `aria-hidden`.
- The page stays a server component; only `hero-search.tsx` is a client component.

## Security

- No tokens, env, or network calls. `server-only` on the data module keeps the future Sanity token path off the client. The search form only navigates (GET); nothing is written.

## Acceptance criteria

- `/` matches the design at 1280px; `/design-system` still renders.
- ⌘K / Ctrl+K focuses the hero search; Enter navigates to `/search?q=<query>`.
- Tiles link to `/courses/<slug>`; Explore Courses and View all courses link to `/courses`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` pass, and `/` is prerendered.

## Checks to run

- `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run dev`.
- Headless screenshots at 1280px and 375px compared with the design.

## Manual test steps

1. `npm run dev`, open http://localhost:3000.
2. Compare with `design/vertex-home.png` at ~1280px width.
3. Press ⌘K (Ctrl+K on Windows/Linux): the search box focuses. Type "caching", press Enter: the URL becomes `/search?q=caching` (404 until the search task).
4. Hover a course tile: the shadow lifts. Click it: it goes to `/courses/nextjs-for-production` (404 until the course task).
5. Narrow to ~375px: header stays on one row, hero scales, tiles stack, no horizontal scroll.

## Implementation notes (post-build)

- **Scale changed from the plan.** Measurements (96px header, 16px nav links, 44px fields) line up 1:1 with a 1024px viewport, so the image was treated as 1024px desktop, not ×1.25 at 1280. Visual checks were side by side at 1024px.
- Hero CTA: `xl` button is 60px tall (`h-15`). Hero search `lg` is 84px tall on desktop and 64px on mobile; the ⌘K hint is hidden on mobile.
- Course tile meta row is 10px to fit on one line as in the design. That's smaller than the 12px `small` token, and the card's minimum height only applies from `sm` up.
- Bars band uses a salmon tint (`#fca386`) specific to that illustration, not a token. It's pinned to the bottom of the page so tall windows don't show bare canvas below it.
- Fixed class conflicts found along the way: `SearchInput` padding with a shortcut (also affected task 01's `md` size), `LogoMark` default size, and text-variant button sizes (now `textSizes`), so no caller overrides compete in CSS order.
- Stale `.next` route types referencing the removed `src/app/page.tsx` were regenerated by the build.
