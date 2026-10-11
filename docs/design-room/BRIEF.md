# Design Room brief — V3 portfolio creative direction

DESIGN ONLY. Do not edit any file outside `docs/design-room/`. Do not run `npm`, dev servers, or any build. You only read files and write markdown.

## Owner feedback (verbatim intent)

The current page "looks very bland, no design creativity, very basic". The owner wants something **architecture-based with fluid graphics on the hero**: the site should walk a visitor through **how Harshal's systems are actually built**, the way an architecture diagram or a data flow comes alive. Take inspiration from real references, add our own twist, then design **section by section**: how fluid it is, what transitions it uses, the typography, the motion.

## What to read first

1. `docs/V3-CONTROL-ROOM.md` — current contract (tokens, page map, hard rules). The owner has now asked for a bolder direction, so you MAY propose relaxing a rule, but you must list each rule you would relax and why.
2. `src/lib/data.ts` — real content (SYSTEMS has the real architecture stages and stacks, HERO_STATS, experience, projects). Never invent metrics, clients or results. Illustrative visuals must be labelled as illustrative.
3. `docs/design-refs/*/DESIGN.md` — reference design systems (linear.app, vercel, raycast, posthog, sentry, supabase, warp, stripe).
4. `src/components/home/*.tsx` — what exists today.

## Constraints that still hold unless you argue otherwise

- Stack: React 19, TS, Vite, Tailwind v4 tokens, `motion`, `gsap`. Prefer SVG, CSS and canvas (2D) over WebGL/three.js unless you justify the bundle cost.
- One accent colour (signal lime `#C6FF3D`) on dark `#0E1210`; fonts Space Grotesk + JetBrains Mono unless you propose a swap with reasons.
- Animate `transform`/`opacity`; `prefers-reduced-motion` gets a static but still beautiful version; mobile at 375px must work (a simplified version is fine).
- Hero must be understood in under 5 seconds and must not tank LCP. Machine is low on memory: no heavy always-on effects.
- No particles-for-the-sake-of-particles, no custom cursor, no preloader, no scroll-jacking, no gradient text, no glassmorphism.

## What to produce

Sections to design, in order: **Hero, Metrics, Systems, Work, Log, Stack, Contact, Footer, page-to-page transitions, and global motion language**.

For each section give:
- **Concept** (one or two sentences, what the visitor feels and learns)
- **Visual** (what is drawn, in what technique: SVG/canvas/CSS, layout at 1440 and 375)
- **Fluidity & motion** (what moves, trigger, duration/easing, what the idle state is)
- **Typography** (sizes, weights, tracking, mono vs sans usage)
- **Transition in/out** (how it enters from the previous section and hands off to the next)
- **Reduced-motion / mobile fallback**
- **Cost** (rough JS/CPU cost and risk)

Plus a short **global motion language** (easing curves, durations, a 3-4 rule system) and a **type scale**.

Hero deserves the most detail: describe the fluid architecture graphic as a concrete storyboard (frame by frame, 0–10 s), which real data systems from `SYSTEMS` it shows, how the visitor can interact, and what the static first paint looks like.

Be concrete and opinionated. Name real references (sites or products) you are drawing from and say what you are borrowing and what you are changing. Avoid generic words like "sleek" and "modern". Keep your document under ~1,800 words.
