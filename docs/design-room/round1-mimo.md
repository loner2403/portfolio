# Round 1 — MiMo (opencode-go/mimo-v2.6-flash)

## Direction: "Dataflow" — the site is one architecture diagram the visitor scrolls through

Borrowing, with changes:
- **Temporal / Inngest execution graphs** — a DAG whose nodes light in run order. Change: ours never finishes; it idles as a living system, and every stage carries its real `stages[]` string from `data.ts`.
- **Jaeger / Grafana trace waterfalls** — mono latencies, hairline gutter, tabular numerals. Change: no waterfall bars; latencies sit inside diagram nodes as illustrative readouts.
- **Linear's surface ladder** (`docs/design-refs/linear.app`) — elevation by surface step + hairline, zero shadows. Chrome stays exactly as the contract specifies.
- **The Pudding's scrollytelling builds** — diagrams assemble section by section. Change: no scroll-jacking; entrances are IntersectionObserver one-shots.

Hero replaces the DotGrid with a **single SVG schematic of the real Bull AI topology** (S-03 pollers → Supabase/Postgres + Qdrant → S-01 research agent → S-04 copilot → SSE out; S-05 batch jobs branching below). One lime packet travels it. That is the fluid graphic.

### Rules I would relax (everything else stands)

| Rule | Relax to | Why |
|---|---|---|
| Hero background = DotGrid (contract §2 Hero) | Delete DotGrid; hero right/background is the schematic | Owner asked for architecture-based fluid hero; DotGrid is the "bland" pattern he flagged |
| TracePanel as a standalone card | Its six nodes become the right-hand column of the schematic (agent → stream) | One diagram instead of text + unrelated card; keeps the trace, kills the duplication |
| "Animate transform/opacity only" | + `stroke-dashoffset` and CSS `offset-path` on ≤24 SVG paths | Path travel IS the concept; both are paint-only (no layout), unlike animating width/top |
| Signal "sparingly: CTA, live dots, active beam, focus, one underline" | + travelling packets and the active node border (≤ ~1% of viewport pixels lit) | Still one accent, one grammar: lime = "data moving / live" |
| Sections separated by `border-t` | Left-gutter **bus rail**: one hairline spine connecting every section's index marker | Continuity is the story: one system, not eight stacked boxes |

Not relaxed: no particles/cursor/preloader/scroll-jacking/gradient text/glassmorphism, one accent, fonts unchanged, 375px, reduced-motion, LCP.

### Global motion language

- **Easings:** enter `cubic-bezier(.22,1,.36,1)` 400ms · exit `cubic-bezier(.4,0,1,1)` 180ms · hover 120ms ease-out · **travel = linear** (data doesn't ease) · emphasis pulse 600ms ease-in-out.
- **Four rules:** (1) chrome never animates, only content; (2) linear for flow, expo-out for arrival; (3) max 3 moving things per viewport; (4) every loop is IntersectionObserver-gated and stops on hidden tab.
- **Type scale:** display `clamp(2.6rem,6vw,5.5rem)`/0.95/-0.035em/500 · H2 `clamp(2rem,4vw,3.25rem)`/-0.03em/500 · H3 24/500 · body 17px/1.6 · mono-label 12px uppercase .08em `muted` · mono-data 13px `tabular-nums` · micro 11px `faint`.

---

## Hero (most detail)

**Concept.** In 5 seconds: *this person's product is a working data system, and I can watch a request move through it.* Left = claim; right = proof, drawn as a live schematic.

**Static first paint (no JS, LCP = H1).** One inline `<svg>` (not canvas — crisp, inspectable, ~0KB JS): 7 rounded-rect nodes on a dark grid, hairline `line` edges as beziers, mono labels, node IDs `S-01`…`S-05`, footer `simulated trace · illustrative timings` (required text preserved). Headline, lead, both CTAs painted immediately. Nothing waits on hydration.

**Storyboard (0–10s, then loop):**

| t | Frame |
|---|---|
| 0.0s | Full schematic visible, all edges `line`, all nodes outlined. Two dim packets parked at `pollers` and `batch jobs`. |
| 0.0–0.6s | Edges fade up, 40ms stagger (opacity only). |
| 0.6–2.2s | Packet 1 travels `poll · S-03 → transform → store (Supabase)` → `qdrant` via `offset-path`; each node it touches flips border to signal 400ms, then settles lit (ink border). |
| 2.2–4.0s | Agent node expands: S-01's six stages `plan → retrieve → analyse → project → validate → persist` draw as a mini chain; each shows a ticking mono ms figure (illustrative — covered by the `illustrative timings` footer). |
| 4.0–5.2s | Edge to `copilot · S-04` (`resolve → snapshot → rag → answer → stream`), SSE egress pulses once; label `stream · sse`. |
| 5.2s+ | Steady state: one packet every ~2.5s, alternating the S-01 path and the S-03 path. Idle = fully lit diagram + single slow packet. Loop pauses when hero leaves viewport. |

**Interaction.** Hover/focus a node: its edges go signal, mono tooltip shows that system's real `stages` + `stack` from `SYSTEMS`. Click → smooth-scroll to `#systems` and flash-match the `S-0x` card for 1.2s. Nodes are `<a>` with 2px signal focus ring; `aria-hidden` on the packet layer.

**Visual / layout.** ≥1024px: 7/5 columns, schematic fills the right 5 and bleeds 40px past the container's right edge (the system continues off-screen). 375px: schematic stacks under the copy, cropped to a 5-node vertical spine (pollers → store → agent → copilot → sse), one packet.

**Fluidity & motion.** Packets: `offset-path`, 1.6s linear, 3px lime dot with a 12px fading trail (opacity gradient, no blur filter). Node lit state: border-color 200ms. Everything else static.

**Typography.** H1 unchanged. Node labels mono 11px; node IDs mono 10px `faint`; stage readouts mono 11px `tabular-nums`.

**Transition in/out.** In: page load, edges stagger only. Out: as the hero scrolls away the schematic's egress edge continues down the left gutter and *becomes* the bus rail into Metrics.

**Reduced motion / mobile.** Fully lit static schematic, no packets, edges at final opacity — still reads as a diagram. Mobile = 5 nodes, packet count 1.

**Cost.** ~3KB JS (a tiny timeline state machine + IO gate), one rAF loop only while in view, `stroke-dashoffset`/`offset-path` on ≤24 paths. No WebGL, no blur, no filters. Risk: `offset-path` fallback = packet hidden, diagram still complete.

---

## Metrics

**Concept.** The request exits the diagram into four readouts — numbers as instrument gauges, not badges.
**Visual.** Existing 4-cell hairline row (2×2 mobile); numerals switch to mono-data `tabular-nums`; a 2px signal tick above the first cell on enter.
**Motion.** Count-up once when 50% in view, 900ms expo-out, stagger 80ms. Idle: static.
**Type.** Values mono 40px/500 (mobile 28px); labels mono 12px uppercase .08em `muted`.
**Transition.** Bus rail enters from above, exits below. **Reduced motion:** final values, no count. **Cost:** ~0.5KB.

## Systems

**Concept.** Zoom into the hero diagram: five systems, each running its own pipeline like a deploy preview.
**Visual.** Same bento grid (S-01 spans 4). Inside each card the `stages` string becomes a mini SVG chain of dots + hairline arrows under the title; S-01's wide card runs its chain horizontally edge-to-edge.
**Motion.** On card enter: chain draws dot-to-dot, 90ms stagger (dashoffset). Hover: chain re-runs once, 600ms, last dot pulses signal. Idle: chain complete, static. SpotlightCard kept.
**Type.** Unchanged from contract (index mono `faint`, H3 24/500, chips mono 12).
**Transition in:** rail branches into five card inputs. **Out:** cards' bottom hairlines align and feed Work's first row.
**Reduced motion:** chains drawn complete, no re-run. **Cost:** ~2KB, draws are one-shot.

## Work

**Concept.** A release log — rows of shipped things, not a gallery.
**Visual.** Index rows as today (number · title · truncated desc · 3 chips · year · ↗); add a mono `deploy` gutter marker (a 6px hairline tick) at each row's left, aligned to the bus rail. Thumbnail preview retained (240px, right, pointer-only).
**Motion.** Rows enter: 12px rise + fade, 50ms stagger, 320ms expo-out. Hover: panel bg + arrow 4px nudge + tick flips signal. Idle: static.
**Type.** Row title 18/500 sans; everything else mono 13.
**Transition in/out:** row-to-row via shared hairline. **Reduced motion:** no rise, hover bg only. **Cost:** <1KB.

## Log

**Concept.** Experience as an event log the reader scrolls through.
**Visual.** Replace TracingBeam with a plain gutter rail + a single 8px signal dot whose position is scroll-bound (transform only); entries read `2025-09 → now · Bull AI` in mono, content in sans. Mobile: same rail, tighter.
**Motion.** Dot follows scroll progress (1:1, no easing, no lag). Entry text enters 8px/300ms once. Current-role pill has a 2s breathing dot. Idle: dot parked.
**Transition in:** Work's rail is this rail. **Out:** rail terminates in a flat cap above Stack. **Reduced motion:** dot fixed at Bull AI. **Cost:** ~1KB, one scroll listener (rAF-throttled).

## Stack

**Concept.** Capability matrix — the tools the diagram runs on.
**Visual.** 4-column table (1-col mobile), group label mono, chips as today; column header hairlines carry tiny mono counts (e.g. `11`).
**Motion.** Chips fade+rise 6px, row-major stagger 25ms, one-shot. Hover chip: siblings drop to 40% opacity (opacity only), chip border → signal. Idle: all opaque.
**Transition:** in from Log's cap; out: columns' bottom ticks align to Contact. **Reduced motion:** instant. **Cost:** <1KB.

## Contact

**Concept.** The schematic's output port — the stream ends at "talk to me".
**Visual.** H2 as contract; email in mono `clamp(1.5rem,4vw,2.75rem)` with a 2px signal underline that draws left→right on enter (dashoffset); `Copy` button with 2s inline `copied`. Links row mono. A single terminal-style line above: `> open to roles · Mumbai · IST`.
**Motion.** Underline draw 500ms; copy press 120ms. Idle: static.
**Transition in:** rail's final node marker `[05]`. **Out:** rail ends in a square cap = end of trace. **Reduced motion:** underline pre-drawn. **Cost:** ~0.5KB.

## Footer

**Concept.** Trace complete.
**Visual.** Contract unchanged (© / Mumbai HH:MM IST / stack line), plus a 1px `line`→transparent gradient fade on the rail cap.
**Motion.** Clock minute update only. **Reduced motion:** identical.

## Page-to-page transitions

Route change: exiting view fades + rises 8px (180ms, exit ease); entering view fades in from 8px below (320ms expo-out, 40ms delay). Simultaneously a 2px signal **fetch line** sweeps the viewport top in 400ms linear, then fades — the only chrome animation allowed. Scroll resets to top (no jacking). `<MotionConfig reducedMotion="user">` turns it into a 100ms crossfade.

## Cost summary & risks

Total new JS ≈ 8–10KB (hero timeline, chain draws, rail dot, tickers), all IO-gated; zero always-on rAF loops offscreen; no WebGL, no filters, no layout-property animation. Main risks: `offset-path` support (graceful static fallback), and SVG scale at 375px (fixed `viewBox` + `preserveAspectRatio`, tested at 375/768/1440).
