# Skill: design-system-foundation

First step of the **redesign phase**. Enables the Tailwind design system so the
site renders styled, and establishes the theme tokens the redesign will build on.
Run AFTER `perf-load-pass`.

## Why

Tailwind v4 utilities are currently dead because `@import "tailwindcss"` sits in
`src/App.css`, which nothing imports. The built CSS is ~0.5 kB and every
`flex`/`inset-0`/theme class is a no-op. (Vite ships `@tailwindcss/vite`; content is
auto-detected in v4, so a JS config is not required.)

## Steps

1. **Single stylesheet entry.** `src/main.tsx` imports `./index.css` only. Keep that.
2. **Import Tailwind in `index.css`.** Add `@import "tailwindcss";` at the TOP of
   `src/index.css`. Remove the Google Font `@import` lines (fonts moved to `index.html`
   `<link>` in the perf pass). Keep base `html,body` rules.
3. **Define theme tokens in v4 `@theme`** (in `index.css`) for every non-standard class
   the components use, so utilities resolve. At minimum:
   - `--color-background`, `--color-background-light`
   - `--color-foreground`, `--color-muted-foreground`, `--color-primary`,
     `--color-primary-foreground`
   - `--color-cyan-400`
   - `--font-anton: 'Anton', sans-serif;` and `--font-sans: 'Roboto', ...`
   - Custom sizing/spacing used in classes: e.g. `pl-25` → `--spacing-25`, `pb-section`
     / `w-18`/`h-18` etc. Decide sane values.
4. **Reconcile legacy config.** `tailwind.config.js` is a v3-style JS config. In v4 it is
   ignored unless loaded via `@config`; either delete it (prefer, use `@theme`) or update
   it. Do not keep duplicate/broken keys (the current `keyframes.anton` is malformed).
   Delete `src/App.css` and the commented `///?import './App.css'` line in `App.tsx`.
5. **Palette choice is part of the redesign** — if this is just a stabilization pass, keep
   colors neutral (dark `background` + cyan accent) so nothing looks abruptly broken. If a
   new palette is approved, set those values here.

## Verification

- `npm run build` succeeds.
- `dist/assets/*.css` jumps from ~0.5 kB to a real Tailwind stylesheet (tens to hundreds
  of kB), and contains the utility classes used in JSX (spot-check `.flex`, `.fixed`,
  `.bg-background`).
- No Google Font `@import` remains in CSS; fonts come from `index.html` `<link>`.
- `npm run lint` passes.
- Visual smoke: bundle + serve in a browser; sections render with intended spacing/colors.

## Review checklist

- [ ] Tailwind actually compiles (CSS size + utility presence).
- [ ] Theme tokens cover every non-standard class (no silent dead utilities).
- [ ] Fonts load, body = Roboto, display = Anton.
- [ ] No leftover duplicate/broken config; `App.css` gone or emptied.
- [ ] Build + lint green.
