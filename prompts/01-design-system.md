# 01 — Vertex Design System

## Goal

Turn `design/vertex-designsystem.png` into the foundation every Vertex page builds on: design tokens (color, type, spacing, radius, shadow) in Tailwind v4, the two brand fonts, and the reusable UI primitives shown in the sheet (icons, buttons, inputs, badges, status indicators, progress bar, cards, navigation). Add a `/design-system` reference page that renders the sheet so it can be compared side by side with the image.

No data, auth, Sanity, search, or analytics in this task. Components take plain props.

## Skills / docs read

- `AGENTS.md` (sections 3, 5, 6, 13, 14).
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` (Tailwind v4 via `@import "tailwindcss"`, globals in root layout).
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` and `03-api-reference/02-components/font.md` (`next/font/google`, `variable` option).
- No Sanity / Clerk / PostHog skills apply — this is UI only.

## Code inspected

- `package.json`: Next 16.4.3, React 19.3, Tailwind v4 via `@tailwindcss/turbopack` loader (`next.config.ts`), no UI libs.
- `next.config.ts`: `cacheComponents`, `partialPrefetching`, turbopack CSS rule — left unchanged.
- `src/app/layout.tsx`: Geist fonts, placeholder metadata.
- `src/app/globals.css`: create-next-app tokens + dark-mode block.
- `src/app/page.tsx`: create-next-app placeholder.
- Repo is still a single Next app at the root (no `studio/` + `web/` split yet).

## Decisions and assumptions

1. **Location.** Build in the current root app (`src/`). It becomes the `web` workspace when the Studio/web split happens; moving `src/` is mechanical. I will not restructure the repo in this task.
2. **Tokens as Tailwind v4 `@theme`.** Replace the default palette for brand use:
   - `--color-primary-{500,400,300,200,100}`: `#F97316 #FB923C #FDBA74 #FED7AA #FFEEE5`.
   - `--color-neutral-{900,700,500,300,200,100,50}`: `#0F172A #334155 #64748B #CBD5E1 #E2E8F0 #F1F5F9 #FAFAFC`; `white` stays `#FFFFFF`.
   - Lesson badge color (blue/indigo tint in the sheet) as `--color-lesson` / `--color-lesson-soft`; success green for "Completed" as `--color-success`.
   - Radius: `xs 4px, sm 8px, md 12px, lg 16px, xl 24px, full`.
   - Shadows: `sm 0 1px 2px 0 rgba(15,23,42,.05)`, `md 0 4px 12px -2px rgba(15,23,42,.08)`, `lg 0 12px 24px -4px rgba(15,23,42,.10)`, `xl 0 20px 40px -8px rgba(15,23,42,.12)`.
   - Spacing: Tailwind's default 4px base (`--spacing: 0.25rem`) already matches the 4/8/12/16/24/32/40/48/64 scale — keep it.
3. **Type scale** as Tailwind `--text-*` tokens with paired line heights and utility classes:
   - `display-1` 48/56 Playfair Bold, `display-2` 36/44 Playfair Bold, `heading-1` 28/36 Inter SemiBold, `heading-2` 22/30 Inter SemiBold, `heading-3` 18/26 Inter Medium, `body-lg` 16/24, `body` 14/20, `small` 12/16 (Inter Regular).
   - Fonts via `next/font/google`: `Playfair_Display` → `--font-display`, `Inter` → `--font-sans`. Geist removed.
4. **Light only.** The sheet is a light theme; drop the create-next-app dark-mode block. Body: neutral-900 text on white, Inter.
5. **Icons.** Add `lucide-react` (outline, 24px grid, 2px stroke, round caps — matches the spec). "Filled" style = same icon with `fill="currentColor"`, exposed via a small `Icon` wrapper with `variant="outline" | "filled"`. No custom icon set.
6. **`cn` helper.** A tiny local class-joiner in `src/lib/cn.ts`; no `clsx`/`tailwind-merge` dependency.
7. **Components are presentational** (server components unless they need interactivity). Cards take plain props; later tasks map Sanity data onto them. Links use `next/link`.
8. **Reference page** `/design-system` reproduces the sheet layout (sections 01–14) using the real tokens and components, so the image and the live page can be compared. It is a dev reference, not linked from navigation. The root `page.tsx` placeholder becomes a minimal page linking to it until the catalog task replaces it.
9. **Brand mark.** The orange chevron "V" logo is recreated as an inline SVG `Logo` component (mark + optional "Vertex" wordmark).

## Files to touch

- `package.json` / `package-lock.json` — add `lucide-react`.
- `src/app/globals.css` — tokens, type-scale utilities, base styles.
- `src/app/layout.tsx` — Inter + Playfair Display, Vertex metadata.
- `src/app/page.tsx` — replace placeholder.
- `src/app/design-system/page.tsx` — reference page.
- `src/lib/cn.ts`
- `src/components/ui/`:
  - `logo.tsx`, `icon.tsx`
  - `button.tsx` — variants `primary | secondary | tertiary | text`, sizes `md | lg`, states default/hover/disabled; renders `<button>` or `next/link` when `href` is given; optional trailing icon (external-link for tertiary, play-circle for text).
  - `input.tsx` — `SearchInput` (search icon, placeholder, optional `⌘K` kbd hint).
  - `select.tsx` — native `<select>` styled to the spec with chevron (keeps a11y, no custom listbox).
  - `badge.tsx` — `video | lesson | popular`.
  - `status.tsx` — `in-progress | completed | now-playing | locked`.
  - `progress-bar.tsx` — value 0–100 with optional "35% complete" label, `role="progressbar"`.
  - `breadcrumbs.tsx`, `pagination.tsx` (prev/next, current page, ellipsis; links via `href` builder).
- `src/components/cards/`: `course-card.tsx`, `lesson-video-card.tsx`, `lesson-card.tsx`, `resource-card.tsx`.
- `src/components/layout/site-nav.tsx` — logo + Courses / My Learning links with active state (client component for `usePathname`).

## Requirements

- Every value in the sheet (hex, sizes, line heights, weights, radii, shadows, button/field specs: height 44px, radius 12px, padding 0 16px lg / 0 12px md, border 1px `#E2E8F0`, focus border `#FB923C`) comes from a token, not an inline magic number.
- Buttons and inputs have visible `focus-visible` styles and real `disabled` states.
- Cards match the sheet: course card (icon tile, title, summary, level / duration / module count meta row); lesson video card (VIDEO badge, title, description, "Lesson 5.1 · 12:45", "Watch from 12:45" text action); lesson card (LESSON badge, title, description, "Module 5", "View lesson" action); resource card (file icon, title, description, "PDF · 1.2 MB", external-link icon).
- Responsive: the reference page grid collapses to a single column on mobile with a 16px gutter and no horizontal scroll; cards stretch full width.
- Desktop layout of the reference page matches the image; no restyling beyond it.

## Security

- No secrets, env vars, network calls, or data access. Lucide is a pure render-time dependency. External links in components use `rel="noopener noreferrer"`.

## Acceptance criteria

- `/design-system` visually matches `design/vertex-designsystem.png` at desktop width for all 14 sections.
- Tokens are usable as Tailwind utilities (e.g. `bg-primary-500`, `text-neutral-700`, `rounded-md`, `shadow-lg`, `text-heading-1`, `font-display`).
- Hover, focus, and disabled states work on buttons, input, and select.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.

## Checks to run

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run dev` and load `/design-system`.

## Manual test steps

1. `npm run dev`, open http://localhost:3000/design-system.
2. Put it beside `design/vertex-designsystem.png` at ~1280px width; compare each section (colors, type, spacing, radius/shadows, icons, buttons, inputs, badges, status, progress, cards, navigation, principles).
3. Hover each button; Tab through buttons, search input, and select to see focus rings; confirm disabled row ignores clicks.
4. Shrink the window to ~375px: sections stack, no horizontal scroll, cards full width.
5. Open http://localhost:3000 — placeholder page links to the reference page.

## Implementation notes (post-build)

- `tsconfig.json` excludes and ESLint ignores now cover `agent/`, `.agents/`, `.claude/`. The skill reference apps in `agent/` produced 190 type errors that broke `tsc` and `next build`; they are not app code.
- Lucide's `CirclePlay` draws its triangle beneath the circle, so `Icon variant="filled"` renders a dedicated filled play glyph, and keeps the inner strokes of `Clock`, `FileText` and `Search` visible (`filledDetail` map in `icon.tsx`).
- Text buttons take `size="sm"` (12px) for in-card actions instead of overriding classes, since there is no `tailwind-merge`.
- On the reference page, the icons / buttons / inputs row sizes the buttons column to its content so spec-sized (44px) buttons fit at 1280px. The sheet image is a scaled-down board, so its buttons look smaller than the 44px spec.
- Mobile: the type-scale table and button matrix scroll horizontally inside their panels; the page itself does not.
