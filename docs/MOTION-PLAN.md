# Motion plan — V3.1 "Dataflow" (DRAFT for owner approval)

Goal: make the site stand out with scroll-driven and interactive motion, while staying fast on a low-memory machine and on phones. This plan relaxes two earlier rules (see "Rules changed").

## 1. What each tool is for

| Tool | Role here | Why |
|---|---|---|
| **GSAP 3.15 + ScrollTrigger** | Scroll-linked scenes (scrubbed draws, parallax, batched reveals), the Log rail | Best scroll control; one shared ticker; all plugins are installed locally and free |
| **GSAP SplitText** | Headline and H2 line/word reveals, Contact heading | Cleaner than hand-split spans; handles resize and wrapping |
| **GSAP DrawSVG** | Scrubbed edge draw in the diagrams | Draws any path without precomputing `pathLength` |
| **`gsap.quickTo`** | Magnetic Copy button, cursor-adjacent preview on Work rows | Cheapest way to follow the pointer |
| **Lenis** (1.3, ~3 KB) | Smooth wheel scrolling on desktop only | Tiny, keeps native `position: sticky` and fixed header working; we drive it from the GSAP ticker |
| **Motion (Framer Motion)** | React state UI: route transitions, hover/tap, shared `layoutId` (Work row to project page), `NumberTicker` | Idiomatic in React; declarative; presence animations |
| **CSS** | First-paint entrance (already built), looping flow/packets/rings | Zero JS cost, GPU-friendly, runs before any library loads |

Not using: **ScrollSmoother** (wraps the page in a transformed container, which tends to break `position: sticky` and fixed children and costs more memory than Lenis), WebGL/three.js (bundle and memory cost outweigh the benefit here), a custom cursor and preloader (banned by the contract).

## 2. Load strategy (this is the optimisation)

1. **First paint stays CSS-only.** The hero entrance (word reveal, sheet fade, plot-in, flow, packets, rings) already needs no JS library. LCP is the H1 text.
2. **Lazy motion layer.** A `MotionLayer` component mounts after `window.load` plus `requestIdleCallback` (fallback timeout 1.2 s) and dynamically imports `gsap`, `ScrollTrigger`, `SplitText`, `DrawSVGPlugin` and `lenis` in one async chunk (`motion-scroll`). Nothing in this chunk is on the critical path.
3. **Progressive enhancement.** Below-the-fold elements that will be scroll-revealed are visible by default. When the layer is ready it adds `html.motion-ready`; only then do reveal elements below the fold get their hidden start state. If JS fails or the user prefers reduced motion, the page is fully visible and static.
4. **Switch Motion to `LazyMotion` + `domAnimation` + `m` components**, replacing the eager 118 KB `motion` chunk with roughly a quarter of it. `MotionConfig reducedMotion="user"` stays.
5. **Delete dead code**: `ui/animated-beam.tsx`, `ui/tracing-beam.tsx` (Log gets a GSAP rail), drop `react-icons` if unused.
6. **Code-split further**: route-level `lazy()` for the project page already exists; keep it.

Budget (targets, to be measured): added JS for the scroll layer <= 55 KB gzipped, loaded after LCP; total eager JS lower than today; LCP <= 2.0 s on a mid laptop profile; no long task > 100 ms during scroll; scroll at >= 55 fps at 1440 and 375.

## 3. Runtime rules

- **One RAF**: `gsap.ticker` drives Lenis (`autoRaf: false`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `lagSmoothing(0)`). No other rAF loops for scroll.
- **`gsap.matchMedia()`** splits behaviour:
  - `(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 1024px)`: Lenis, scrubbed scenes, parallax, magnetic button.
  - `(prefers-reduced-motion: no-preference) and (max-width: 1023px)`: native scroll, simple one-shot reveals only (opacity/translate), no scrub, no parallax.
  - `(prefers-reduced-motion: reduce)`: nothing runs; end states shown.
- **Cleanup**: all scenes created inside `useGSAP({ scope })` or `gsap.context`, so route changes and unmounts revert them. `ScrollTrigger.refresh()` after fonts load and after route mount.
- **Limits**: <= 25 ScrollTriggers at once, prefer `ScrollTrigger.batch` for lists; **no pinning** (memory and mobile risk); animate only `transform`, `opacity`, `stroke-dashoffset`; never `filter`/blur/layout properties; `force3D` off by default, `will-change` only during the animation.
- **Anchors and a11y**: hash links and the hero index use `lenis.scrollTo`; keyboard and find-in-page keep working (Lenis is disabled on touch and reduced motion); `scroll-behavior: smooth` is removed on desktop while Lenis is active to avoid double smoothing.
- **Visibility**: every loop stays IntersectionObserver-gated and pauses on `document.hidden` (already built for CSS loops).

## 4. Where each effect goes

| Place | Effect | Tool | Mobile |
|---|---|---|---|
| Global | Smooth wheel scroll; 2px lime scroll-progress line under the header (scaleX) | Lenis + ScrollTrigger | Native scroll, no progress line |
| Header | Active-section highlight as you scroll (marker follows the rail node) | ScrollTrigger | Same, CSS only |
| **Hero** (signature 1) | On scroll-out: sheet drifts up slower than the page and settles to 0.97 scale; H1 words rise slightly at different speeds (parallax by word index); lanes' packets keep running | ScrollTrigger scrub | Off |
| **Hero to Systems** | The hero's last edge keeps drawing down the rail into S-01 as you scroll (scrubbed draw on the rail segment) | DrawSVG + scrub | Off |
| Metrics | Lime ticks scrub-draw; numbers count once; strip cells rise 12px in stagger | ScrollTrigger batch + existing `NumberTicker` | Reveal only |
| **Systems** (signature 2) | Each row's architecture draws **with scroll** (scrub 0.6): groups fade, nodes plot in stagger, edges draw, packets start when complete; text column fades up with SplitText lines | DrawSVG + ScrollTrigger | One-shot time-based draw (current CSS behaviour) |
| Systems hover | Hovered row brightens flow; hovered node dims others (built) | CSS / engine | n/a |
| Work | Rows reveal in a batch; thumbnail preview follows the pointer with spring easing and a clip-path reveal; shared `layoutId` on the row title for the route transition | `quickTo` + Motion `layoutId` | Reveal only, no preview |
| **Log** (signature 3) | Own rail with a lime dot whose position is scroll-bound (scrub 1:1, transform only); entries fade up 12px as the dot passes | ScrollTrigger scrub | Dot parked, entries reveal |
| Stack | Group columns reveal in stagger; hovered chip dims siblings | batch + CSS | Reveal only |
| Contact | H2 reveals by lines (SplitText); email underline draws; **Copy** button is magnetic (`quickTo`, 8px max); end cap on the rail pulses once when reached | SplitText, `quickTo`, DrawSVG | Reveal only |
| Footer | IST clock ticks; rail cap | existing | same |
| Route changes | 180 ms exit, 320 ms enter with 8px rise; shared title `layoutId`; 2px lime fetch line across the top | Motion `AnimatePresence` | 100 ms crossfade |
| Section headings (all) | `[0N] LABEL` types in via clip, H2 lines mask-reveal | SplitText + batch | Fade |

Three **signature moments** carry the "stands out" goal: the hero scroll-out into the rail, the scrubbed architecture draw in Systems, and the Log rail dot. Everything else is deliberately light so these read clearly.

## 5. Rules changed

- "Scroll drives exactly one thing (Log dot)" becomes "scroll drives the three signature scenes plus batched reveals, desktop only".
- "Max 3 movers per viewport" stays for continuous loops (packets, rings, flow); scrubbed scenes are scroll-bound and do not count.
- "No scroll-jacking" is kept: Lenis smooths wheel input but never blocks, pins, or snaps; it is off on touch and reduced motion.

## 6. Risks and how they are handled

| Risk | Mitigation |
|---|---|
| Low-memory machine | No pinning, <= 25 triggers, lazy chunk, `LazyMotion`, remove dead libraries, measure heap before/after |
| Smooth scroll hurts accessibility or anchors | Desktop pointer-fine only, `lenis.scrollTo` for hashes, opt-out under reduced motion |
| Flash of hidden content | Progressive enhancement via `html.motion-ready`; above-the-fold never hidden by JS |
| Scroll jank | Single ticker, transform/opacity only, scrub values smoothed, performance checks per chunk |
| Over-animation reads as noisy | Three signature moments, restrained elsewhere; owner reviews each chunk in the browser |

## 7. Implementation chunks (each verified before the next)

1. **Foundation**: `MotionLayer` (lazy chunk, `motion-ready` class, `gsap.matchMedia`, Lenis on the GSAP ticker, `useGSAP` helpers, anchor handling), `LazyMotion` migration, delete dead components. Acceptance: build green, eager JS smaller, nothing visibly changes, reduced motion and mobile verified.
2. **Reveals and headings**: SplitText section headings, batched reveals (Metrics, Work, Stack), scroll-progress line, header active marker.
3. **Signature 1 + 2**: hero scroll-out, hero-to-Systems rail draw, scrubbed architecture draw in Systems rows.
4. **Work, Log, Contact**: pointer-follow preview, `layoutId` route transition, Log rail dot, magnetic Copy, Contact heading and cap.
5. **Measure and tune**: bundle report, Lighthouse and long-task check at 1440 and 375, heap comparison, fix regressions, final screenshots.

Chunks 2 to 4 also restyle the remaining old sections (Work rows, Log, Stack, Contact buttons to squares, Footer) so the redesign finishes at the same time.
