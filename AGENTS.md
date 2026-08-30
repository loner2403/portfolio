# AGENTS.md — Portfolio (Harshal Lade)

Repository for the developer portfolio site. This file is the shared context for
agents working in this repo. Read it before making changes.

## What this is

- Personal developer portfolio (single page + project detail routes).
- Stack: **React 19 + TypeScript + Vite 5 + Tailwind CSS v4**.
- Animation: **GSAP (`@gsap/react`, ScrollTrigger)** and **Framer Motion**.
- Routing: `react-router-dom` v7. Deploy target: **Vercel** (`.vercel/`).
- Icons: `lucide-react` and `react-icons` (both installed).

## Commands

```bash
npm install            # install deps (node_modules is gitignored)
npm run dev            # local Vite dev server
npm run build          # tsc -b && vite build   (must pass — used to verify perf)
npm run preview        # serve the production build
npm run lint           # eslint . (flat config)
```

`npm run build` is the canonical check: it runs `tsc -b` (typecheck) then `vite build`.

## Architecture map

```
src/
  main.tsx                         # App entry: mounts Preloader, ParticleBackground, MagneticCursor, <App/> — all unconditionally
  App.tsx                          # Routes: /  and  /projects/:slug ; mounts Navbar, Footer, Analytics
  index.css                        # ONLY base body styles + Google font @imports (NO tailwind)
  App.css                          # UNUSED — contains `@import "tailwindcss"` but is NOT imported anywhere
  lib/
    data.ts                        # All content: SOCIAL_LINKS, MY_STACK, PROJECTS, MY_EXPERIENCE, GENERAL_INFO
    utils.ts                       # cn() helper (clsx + tailwind-merge)
  components/
    Navbar, Banner, AboutMe, Skills, Experiences, ProjectList, Project, ProjectDetails,
    Footer, SectionTitle, SectionFlower, ScrollProgressIndicator, TransitionLink, Template,
    Button, ParticleBackground, Preloader, MagneticCursor
```

Custom design tokens used in classes (must exist in the Tailwind theme):
`bg-background`, `bg-foreground`, `anton-font`, `font-anton`, `pb-section`, `pl-25`,
`text-cyan-400`, etc. See "Known issues" for why these currently do not resolve.

## Known issues — baseline 2026-08-28 (partially fixed on `feat/redesign-perf`)

### Correctness (still open — belongs to the design phase)
- **Tailwind CSS is not compiled.** `src/App.css` held `@import "tailwindcss"` but was never
  imported; it was deleted in the perf pass. `src/index.css` (the only imported stylesheet)
  has NO tailwind import. Result: production CSS is ~0.3 kB and every `flex`/`fixed`/theme
  utility is dead — the site renders unstyled. **Fix = `design-system-foundation` skill:**
  add `@import "tailwindcss";` to `index.css`, define the `@theme` tokens, remove legacy
  `tailwind.config.js` keys.
- Custom tokens used in classes and still undefined in v4: `foreground`, `muted-foreground`,
  `primary-foreground`, `anton-font` / `font-anton`, `pb-section`, `pl-25`, `w-18`/`h-18`.

### Performance (partially fixed in perf pass)
Done in `perf-load-pass`:
- Code-split: `ProjectDetails` route is now `lazy()` + `Suspense`; `manualChunks` split
  `react`/`motion`/`gsap`. Main `index` chunk dropped 1261.77 → 990.33 kB min
  (623.94 → 530.39 kB gzip); the 500 kB warn is gone for the vendors but the app shell
  still exceeds it.
- Fonts: removed render-blocking CSS `@import` (Roboto+Anton) from `index.css` and deleted
  `App.css`; `index.html` now loads a single combined `Anton+Roboto` `display=swap` link.
- `ParticleBackground` capped 100 → 20 (mobile) / 40 (desktop), returns `null` under
  `prefers-reduced-motion`, pauses tweens on `visibilitychange`.
- `Skills` + `ProjectList` `<img>` now `loading="lazy" decoding="async"`.

Still open (follow-up perf items):
- **`index` app-shell chunk is still ~990 kB** — the entire home page mounts eagerly.
  Next levers: route-split the home page, defer `ScrollTrigger`/animation registration,
  and audit lucide-react import surface.
- **`MagneticCursor`** (untracked) still re-renders on hover transitions, calls
  `getBoundingClientRect()` in `mousemove`, polls `document.elementFromPoint` every 500 ms,
  sets global `cursor:none` + blend modes — heavy on mobile. Follow-up: gate to `pointer:fine`
  + `prefers-reduced-motion`, ref-based writes, drop the poll.
- **`ProjectList`** still has a window `mousemove` listener that reads layout each move.
- **`Preloader`** still fakes ~2.4 s loading, locks `body` overflow, infinite particle tween.
- **`Banner`** still runs infinite tweens (`repeat:-1`).
- **Images:** `public/Images/Akash2.png` (~1.04 MB), `Akash3.png` (~1.06 MB) are huge
  background-image divs in `ProjectDetails` (no `loading`). Consider resizing/optimizing.

### Repo hygiene
- Prior to the perf pass there were **pre-existing lint failures** (15 errors / 2 warnings)
  in `Banner`, `Button`, `MagneticCursor`, `Preloader`, `ProjectDetails`, `ProjectList:52`
  (mostly `no-explicit-any` and `rules-of-hooks` / deps). None introduced by the perf pass;
  fix them as separate small tasks.
- `src/App.tsx` line 1 has a now-dead `///?import './App.css';` comment (file deleted).
- `package.json` lists `react-icons` but it is not imported anywhere (safe to drop).

## Conventions

- **No code comments** unless asked. Keep diffs minimal and ESLint-clean.
- Optimize animation vs. correctness trade-off: never animate layout (`top/left/width`);
  prefer `transform`/`opacity`. Respect `prefers-reduced-motion`.
- Small discrete changes > big rewrites. Each change must keep `npm run build` green.
- Content lives in `src/lib/data.ts` and is rendered via the components; do not hardcode
  content inside components.
- Keep `index.html` lean: move fonts to `preconnect` + a single non-render-blocking load.
- Reusable helpers (e.g. an `isReducedMotion()` / `isTouchDevice()` guard) should be added
  to `src/lib/` and shared, not duplicated per component.

## Delegated task workflow (skills)

Reusable, independently verifiable tasks live in `.opencode/skills/<name>/SKILL.md`.
Each skill has a narrow scope, an exact verification step (usually `npm run build` +
reviewing the production `dist/` output), and a review checklist. Spin up a subagent to
carry out one skill; verify the result before merging into the plan.
