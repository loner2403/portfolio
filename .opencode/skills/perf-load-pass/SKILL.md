# Skill: perf-load-pass

Independent, verifiable performance task for the portfolio app. Runs in the
**production perf pass** — safe, non-redesign wins only. Defer any design-system /
theme changes to the redesign skill.

## Scope (DO these)

1. **Consolidate fonts (kill render-blocking CSS `@import` + duplicate Anton).**
   - `src/index.css` still has `@import url('https://fonts.googleapis.com/css2?...Roboto...')`
     and `...Anton...`. Remove BOTH `@import url(...)` lines from `index.css`.
   - `src/App.css` (unused, holds `@import "tailwindcss"` + the same 2 font imports) can
     be deleted; nothing imports it. If you prefer not to delete, empty it of font
     `@import`s — but deleting is cleaner.
   - `index.html` `<head>` already has `preconnect` for fonts.googleapis / fonts.gstatic and
     an `Anton` `<link>`. Add a single combined `<link>` for BOTH `Roboto` + `Anton` there if
     both are used (they are: body font = Roboto, display = Anton). Keep `display=swap`.
     Use `<link rel="preconnect">` for the two font origins; put the stylesheet `<link>`
     last. No `@import` remains anywhere.
2. **Code-split the `ProjectDetails` route + vendor chunks.**
   - In `src/App.tsx`, replace the static `import ProjectDetails from ...` with
     `const ProjectDetails = lazy(() => import('./components/ProjectDetails'))` and wrap the
     route element in `<Suspense fallback={...}>`. Import `lazy, Suspense` from `react`.
   - In `vite.config.ts`, add `build.rollupOptions.output.manualChunks` to split the heavy
     vendors so no single chunk dominates: e.g. `react` (react, react-dom, react-router-dom),
     `motion` (framer-motion), `gsap` (gsap, @gsap/react). Verify the warn goes away or
     shrink these buckets.
3. **Lighten `ParticleBackground`.**
   - Reduce particle count (target ~40 on desktop, ~20 on small screens).
   - Respect `prefers-reduced-motion` → render 0 particles (or skip animations).
   - Pause tweens when the tab is hidden or the section is off-screen so infinite tweens do
     not run unseen. (Use `document.hidden` / `visibilitychange`, or IntersectionObserver.)
   - Keep the visual identical — only fewer/capped particles.
4. **Non-critical images: `loading="lazy"` + `decoding="async"`.**
   - `ProjectDetails` detail images (below the fold) get `loading="lazy" decoding="async"`.
   - `ProjectList` preview thumbnails and `Skills` logos get `loading="lazy" decoding="async"`.

## Scope (DO NOT touch)

- Do NOT change the visual design, colors, spacing, or typography.
- Do NOT do the Tailwind/theme enablement (that is the redesign skill, separate).
- Do NOT rewrite `MagneticCursor` in this pass (separate follow-up; risky for behavior).
- Do NOT add/remove/animate layout properties; only `transform`/`opacity` if you must tweak.

## Verification (must all pass)

- `npm run build` succeeds (this is the gate).
- Proven by `dist/` output: the JS bundle is split (no single chunk near 1,000 kB; the
  previous single chunk was 1,261.77 kB / 623.94 kB gzip).
- `dist/assets/*.css` no longer contains `@import url(...)` Google Font strings.
- `rg` shows zero `@import url('https://fonts.googleapis.com` remaining in `src/**/*.css`.
- `npm run lint` passes.
- Visual behavior unchanged on desktop (verify by reading the diff; no class/JSX removals
  that would drop content).

## Review checklist for the lead

- [ ] Build green, chunk sizes reported and reduced.
- [ ] No Google Font `@import` left; fonts still load via `index.html` `<link>` only.
- [ ] Lazy route has a fallback and doesn't break the `/projects/:slug` path.
- [ ] Particles capped + reduced-motion/tab-hidden aware.
- [ ] Images lazy + async.
- [ ] No design/color changes; no content dropped.
