# 03 — Clerk Authentication

## Goal

Add Clerk authentication to the web app using the existing Clerk application `app_3LHmc7dtL4GyLbWSbNIGvIhaiki` (selected in the Clerk Dashboard). Browsing stays public. Replace the header's avatar placeholder with real auth controls, and protect only the per-user route that exists in the nav (`/my-learning`).

## Checklist (from the Clerk setup guide)

1. Set up Clerk in this project with `init`, linked to the selected application.
2. Clerk's agent skills are already installed on this machine, so skip them (`--no-skills`).
3. Start the app with Clerk installed and verify.

## Skills / docs read

- `AGENTS.md` (sections 5, 6, 7, 12, 13).
- Clerk setup guide (pasted by the user) — Step 1a, Step 3, Step 4, critical rules.
- Next docs: `03-api-reference/03-file-conventions/proxy.md` — `middleware` is deprecated in Next 16 and renamed to `proxy.ts`, placed in `src/` next to `app/`.

## Code inspected

- `package.json`: Next 16.4.3, React 19.3, no auth packages. Node v26.7 (≥ 20.9 required).
- No `proxy.ts` / `middleware.ts`, no auth routes, no sessions or user records. No other auth provider, so no migration.
- `next.config.ts`: `cacheComponents: true` → anything reading auth in a Server Component must sit inside `<Suspense>`.
- `src/app/layout.tsx`: root layout, `<body>` wraps children.
- `src/components/layout/site-header.tsx`: avatar placeholder marked "until the Clerk task".
- `src/components/ui/button.tsx`: existing Button for the signed-out control.
- `.gitignore`: ignores `.env*`, so a committed `.env.example` needs an exception.
- Env files were not read (per the Clerk guide).

## Decisions and assumptions

1. **Run init against the selected app.** From the repo root:
   `npx -y clerk@latest init --app app_3LHmc7dtL4GyLbWSbNIGvIhaiki --no-skills`
   Dashboard sign-in does not authenticate the CLI. If `init` needs it, you'll run `npx -y clerk@latest auth login` in your own terminal first; I won't create an accountless app or pick a different one.
2. **What init is expected to add**, then reviewed and adjusted to this repo:
   - `@clerk/nextjs` dependency.
   - `ClerkProvider` **inside `<body>`** in `src/app/layout.tsx`.
   - `src/proxy.ts` with `clerkMiddleware()` and the standard matcher (Next 16 file name, not `middleware.ts`).
   - Keys in `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
   - Sign-in / sign-up routes if it generates them; if so they move into `src/app/(site)/` only if needed for the frame, and their `<SignIn />` / `<SignUp />` are wrapped in `<Suspense>`.
3. **Route protection in `src/proxy.ts`.** `createRouteMatcher(['/my-learning(.*)'])` + `await auth.protect()`. Everything else stays public. Later features (progress API) add their routes to this matcher.
4. **Header controls** (`site-header.tsx`), in place of the avatar placeholder, wrapped in `<Suspense>` with the current placeholder circle as the fallback so layout doesn't shift:
   - Signed in: `<UserButton />`, sized to the design avatar (52px desktop / 36px mobile) via `appearance.elements.avatarBox`.
   - Signed out: `<SignInButton mode="modal">` wrapping the existing `Button` (small, secondary) labeled "Sign in". The design shows only the signed-in state, so this is the minimal addition.
   - No `<SignUpButton />` in the header; the sign-in modal links to sign-up. Keeps the header matching the design.
5. **Env.** Add `.env.example` listing `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=` (empty), and `!.env.example` to `.gitignore`.
6. **No shadcn.** No `components.json`, so skip `@clerk/ui` theming.
7. **Not in scope:** progress records, `/my-learning` page itself (it 404s after sign-in until that task), organizations, sign-in method configuration.

## Files expected to change

- `package.json`, `package-lock.json`
- `src/app/layout.tsx`
- `src/proxy.ts` (new)
- `src/components/layout/site-header.tsx`
- `.env.example` (new), `.gitignore`
- `.env.local` (written by init, not committed)
- Possibly `src/app/sign-in/[[...sign-in]]/page.tsx`, `src/app/sign-up/[[...sign-up]]/page.tsx` if init creates them.

## Security

- `CLERK_SECRET_KEY` stays server-only; only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` reaches the browser.
- Protection happens in `src/proxy.ts`, not client code.
- No keys hardcoded or committed; `.env.example` has empty values.

## Acceptance criteria

- Signed out: header shows "Sign in"; home page renders normally; `/my-learning` redirects to sign-in.
- Signed in: header shows the Clerk avatar menu at the design's avatar size; sign-out returns to signed-out state.
- `npm run build` passes with `cacheComponents` on (no uncached-request-data errors).

## Checks

- `npx -y clerk@latest doctor`
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- `npm run dev` and load `/`.

## Manual test steps

1. `npm run dev`, open http://localhost:3000.
2. Confirm "Sign in" appears top-right where the avatar was.
3. Click it, sign up as your first test user (verification code `424242` in dev).
4. Confirm the avatar appears in the header; open its menu and sign out.
5. While signed out, visit http://localhost:3000/my-learning — you're sent to sign-in.
