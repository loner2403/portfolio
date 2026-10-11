# Round 1 — DeepSeek proposal

**Premise: "The Trace."** The page is no longer sections about Harshal; it is the
lifecycle of one request moving through the systems he actually ships. Hero is the
ingest graph; Metrics is its throughput readout; Systems is the same graph zoomed
into production; Work is the artifacts it emits; Log is the engineer's own commit
history; Stack is the dependency manifest; Contact is the handshake. The visitor
learns how the systems are built by watching a request traverse them, not by
reading five cards.

References I am borrowing from: **Linear** (restraint, aggressive negative display
tracking, surface ladder instead of shadows, one scarce accent), **Vercel** (mono
eyebrows, engineered band rhythm, hairline cards), **Raycast** (the product UI *is*
the marketing chrome — here the graph *is* the chrome), **Sentry/PostHog**
(observability density: IDs, latencies, status pills). Changing: none of them put a
real, live data-flow on the marketing surface at hero scale. That is the twist.

## Rules I would relax (and why)

1. **"No beam backgrounds"** → allow *structured SVG signal-flow paths* in the hero
   only. Distinction I hold: these carry stage labels and real latencies, are 1px,
   opacity ≤ 0.5, and stop when off-screen. They are data, not atmosphere. Decorative
   beams stay banned.
2. **Container-bound layout** → allow two full-bleed bands (hero graph, metrics
   instrument strip) so the graph has width. Body text keeps gutters.
3. **Teal's "diagram lines only" scope expands** → teal now means "data at rest,"
   signal lime means "data in transit." One defined secondary semantic, still no
   third colour.
4. **Type scale grows** → display clamp to 6rem, one extra weight (480/500). Owner
   asked for bolder.
5. **Retire DotGrid.** It is generic AI-slop atmosphere and ~half a lazy chunk; the
   graph replaces it. Net bundle goes *down*.

Everything else (no particles, preloader, custom cursor, scroll-jacking, gradient
text, glassmorphism) stays banned.

## Global motion language

- Easing: entrances `cubic-bezier(.22,1,.36,1)` (out-quint); state changes
  `cubic-bezier(.65,0,.35,1)`; telemetry ticks stepped/linear.
- Durations: micro 120ms · standard 240ms · section reveal 520ms · hero loop ~9s.
- **Rule 1.** One thing moves per trigger; animate `transform`/`opacity`/`pathLength`
  only.
- **Rule 2.** Colour is semantic: lime = in transit, teal = settled, grey = idle.
  Nothing animates colour decoratively.
- **Rule 3.** Every animated construct has a static still worth screenshotting.
- **Rule 4.** Telemetry is honest — any simulated timing is labelled.

## Type scale

| Role | Spec |
|---|---|
| Display | `clamp(2.75rem, 6.5vw, 6rem)`, -0.04em, weight 480–500, lh 0.92, sans |
| H2 | `clamp(1.9rem, 4vw, 3rem)`, -0.03em, 500 |
| Card title | 1.25rem / 500 / sans |
| Lead | 1.05rem / 1.6 / muted |
| Body | 1rem / 1.6 |
| Label | mono 11px, uppercase, .12em, muted |
| Metric | mono `clamp(2.5rem, 5vw, 4rem)`, tabular |
| Data | mono 12px (ids, latencies, stages) |

Mono carries anything a machine would emit; sans carries anything a human says.
That split is the whole voice.

## Hero — the request graph (most detail)

**Concept.** Watch one equity-research request move through the real S-01 stages;
understand in 5s that Harshal turns retrieval into validated, persisted answers.

**Visual.** Full-bleed dark. Left third: label, H1, lead, CTAs (unchanged copy).
Right two-thirds: an inline **SVG graph**. Edges are `<path>`/`<line>` in `line`
grey; nodes are absolutely-positioned DOM chips on top (so text stays selectable and
responsive). Nodes = S-01's real stages: `plan → retrieve → analyse → project →
validate → persist`. Edge labels carry real stack: `qdrant`, `gemini/openai`,
`supabase`. A mono request chip sits top-left: `req_8f3a · research-agent`. At 1440
it is a wide left-to-right DAG; at 375 the graph is hidden and the same nodes render
as the current vertical trace list.

**Storyboard (0–10s).**
- **0.0–0.6s** Edges draw in: `pathLength` 0→1, 520ms, 40ms stagger.
- **0.6–1.2s** Node chips resolve, labels fade 120ms.
- **1.2s** A single lime dot leaves `plan` (480ms) and lands on `retrieve`; node
  pulses, latency `38ms` ticks up.
- **1.2–5.7s** The dot traverses each stage (~900ms): `retrieve 38ms` → `analyse
  1240ms` → `project 210ms` → `validate 9ms` → `persist 22ms`.
- **5.7s** `persist` completes: the dot resolves into a `✓ valid · schema` node and
  the full path glows teal for 300ms.
- **6.5s** Output: three thin bars emit from `persist` and dissolve; `stream · sse`
  appears.
- **8.5–9.0s** Reset: dot fades, edges dim to baseline, loop restarts. A faint `loop`
  tag sits bottom-right so it reads as simulation.

**Interaction.** Hover/focus a node → loop pauses, tooltip shows that stage's stack
chip + one real highlight. On desktop the dot follows the pointer along the hovered
edge segment (magnetic, one segment at a time). Tab focuses nodes; Enter pins.

**First paint.** Edges + node frames + all text are static SVG/DOM drawn immediately.
The moving dot mounts only after `inView` and a reduced-motion check. LCP is the H1
text, never the graph.

**Reduced / mobile.** No dot: all nodes lit, latencies static, edges solid — a
beautiful still. Under 768px the SVG is dropped and the vertical trace list (today's
`TracePanel` anatomy, relabelled with S-01 stages) is shown.

**Cost.** One rAF on 5 paths + one translated dot; all text static. ~6KB inline SVG,
no canvas/WebGL. Pause on `document.hidden` and off-screen via IntersectionObserver.
Risk: responsive path geometry — use `preserveAspectRatio` + `vector-effect`.

## Metrics — instrument strip

Full-bleed strip, four cells, hairline divides. Each cell: mono tabular number
(HERO_STATS) plus a static illustrative sparkline SVG. On enter, tickers count once
and a single lime sweep crosses the strip (700ms). 375px = 2×2, no sparklines.
Reduced = numbers static, no sweep. Cost negligible.

## Systems — the graph in production

Keep the bento but add a connective **bus rail**: an SVG line leaves each card and
joins the next, drawn once on scroll. S-01 stays wide and reuses the hero's six
stages, making the hero explicitly a zoom-in of S-01. Hovering a stage chip
highlights only its outgoing edge. Reduced = static 1px rail. Cost trivial.

## Work — artifacts

Rows become trace records: add a mono `art_01…` id column left of the index. Hover
extends the row hairline rightward in lime and shows the existing 240px preview.
Only the arrow nudges (2px). Mobile stacks. Cost none.

## Log — deploy history

Keep the beam but relabel: dates are commit-ish tags on the rail, the `now` entry is
a lime node, and each entry reveals at 240ms. Reduced = static left border.

## Stack — dependency manifest

Four mono manifest columns, chips as today. Twist: hover a chip and any matching
chip elsewhere on the page cross-highlights (Qdrant in Stack lights the `retrieve`
node in Systems) via one small shared context. 120ms opacity. Reduced = off.

## Contact — the handshake

Big mono email, copy button, plus a status line: `response 200 · typically < 1 day`.
Copied state 2s. Cost none.

## Footer — process footer

Reads as a status bar: `© 2026 Harshal Lade` · `Mumbai HH:MM IST` · `built with …`,
with a lime heartbeat dot that blinks each minute. Reduced = static.

## Page transitions

Home → project is a **drill-in**: the Work row's title shares a `layoutId` and
expands to the detail H1 over 380ms, then the header graph mini-map collapses into
the corner. Transform/opacity only; reduced-motion = instant crossfade. No
scroll-jacking; back is the reverse, ≤400ms.

**What the page feels like:** you pilot a live system, and by scrolling you follow
one request all the way to a persisted, validated answer.
