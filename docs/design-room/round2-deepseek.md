# Round 2 — DeepSeek cross-critique

## 1. Steal list

1. **MiMo's left-gutter bus rail.** One hairline spine connecting every section's
   index marker, better than my full-bleed bands. It makes the whole page one
   diagram with one cheap path instead of widening the layout and inviting
   horizontal scroll. Adopt as the page skeleton; my bands are the cut.
2. **MiMo's `offset-path` packets with a declared fallback.** Packet hidden →
   diagram still complete. This beats my magnetic rAF dot that follows the
   pointer along an edge: less JS, no coordinate math, no pointer state. Adopt
   `offset-path`, delete my pointer-follow idea.
3. **Claude's "retire the Magic UI family, one hand-built SVG vocabulary."** My
   plan kept reusing system components; Claude is right that fewer deps and one
   stroke language is the actual coherence. Adopt the retire list.
4. **Claude's hover: hovered path brightens, everything else dims to 30%.** My
   version pauses the loop, which reads as broken. Claude's dim-to-30 is a
   clearer focus mechanic and needs no timeline pause. Adopt.
5. **MiMo's "hero egress edge continues down and becomes the bus rail."** A
   single transition mechanism across the entire page beats my per-section
   hand-offs. Adopt.

## 2. Attack list

1. **My teal secondary (data-at-rest).** On `#0E1210`, teal vs grey-idle is a
   near-invisible distinction, it adds a token, and it dilutes "one accent." The
   semantics ("settled" vs "idle") do no work a visitor can perceive in 5 s.
   **Cut teal.** Lime = in transit; everything else is line grey. My idea, dead.
2. **MiMo keeps the bento + `SpotlightCard`.** Cards with border + spotlight +
   badge + chips on every system is the exact "bland, no creativity" pattern the
   owner flagged. Relabelling the interior does not fix it. **Fix:** drop cards
   for full-width rows (Claude's diagram rows are closer). MiMo's card retention
   is the weakest carry-over.
3. **MiMo's hero overload.** Over 10 s it draws the 7-node topology, then expands
   S-01's six stages *inside the hero*, then expands S-04's five stages, then runs
   two alternating packets. That is three diagrams in one hero; nobody reads it in
   5 s (a hard constraint). **Fix:** hero shows topology only; the six S-01 stages
   are Systems' job. Cut the in-hero stage expansion.
4. **Claude's full-bleed SVG behind the H1, bleeding off the right edge.** Hairlines
   at 4% opacity behind display text risk legibility, and "bleeding past the
   container" is a horizontal-scroll bug waiting at 1440 and 375. **Fix:** contain
   and clip the SVG; no bleed below 1024.
5. **Claude's scroll-bound retraction (`pathLength` → 40% as you scroll).** A
   continuous scroll-driven animation on a large SVG path is the most likely jank
   source on this low-memory machine. **Fix:** one-shot draw, no scroll binding.
   Keep scroll only for the Log dot (one transform).
6. **My DOM node-chips positioned over SVG.** Two coordinate systems to keep in
   sync, and the graph is hidden at 375 anyway. **Fix:** labels live in the SVG
   (`<text>`), or the node is one component, never both.

## 3. Disagreements

- **Hand-authored vs data-generated hero geometry** (Claude's open question, my
  answer): **hand-author the hero SVG, data-drive only the labels and stage list
  from `SYSTEMS`.** Responsive path geometry is where every hero in this round
  breaks; generating positions from data multiplies that risk with no visual gain.
  Fixed lane config, content from `data.ts`.
- **Hero hero-technique:** MiMo's single schematic topology wins over Claude's
  3-lane smart-router and my S-01-zoom. Deciding reason: 5-second comprehension.
  One packet, one path, one story; complexity is earned later in Systems.
- **Type ceiling:** Claude/MiMo cap at 5.5rem, I proposed 6rem. **Side with 5.5rem.**
  At 6rem the H1 collides with the diagram column near 1024, and the owner's
  "bolder" is bought by layout and contrast, not by 8 more px of type.
- **Motion rule wording:** "transform/opacity only" vs MiMo's dashoffset/offset-path.
  MiMo is right in substance — those are paint-only — but the rule should be
  **enumerated, not loosened by permission**: `transform`, `opacity`, `pathLength`,
  `stroke-dashoffset`, `offset-path`. Enumerated means a reviewer can gate it.
- **Metrics:** Claude's borderless staggered row vs MiMo's hairline strip. Side with
  **hairline strip** — it matches the bus-rail hairline language; Claude's stagger
  is asymmetry for its own sake.

## 4. Merged hero (≤12 lines)

- **Static first paint (LCP = H1):** inline SVG topology painted immediately — 7
  nodes, hairline edges, mono labels, one packet parked at `pollers`. Copy, lead,
  and one filled CTA + one text link painted. Node labels from `SYSTEMS`. Nothing
  waits on hydration. Footer in-SVG: `simulated trace · illustrative timings`.
- **0.0–0.6 s** edges fade up, 40 ms stagger (opacity only).
- **0.6–2.2 s** packet 1 travels `poll · S-03 → store (Supabase) → qdrant` via
  `offset-path`, 1.6 s linear; each touched node flips border to lime 300 ms, then
  settles.
- **2.2–4.0 s** agent node lights; edge to `copilot · S-04` draws; `stream · sse`
  egress pulses once.
- **4.0–8.5 s** steady state: one packet every ~2.5 s alternating the S-03 and S-04
  paths; idle = fully lit diagram, one slow packet.
- **8.5–9.0 s** dim to idle baseline (no scroll binding); loop, IO-gated, stops on
  `document.hidden`.
- **Interaction:** hover/focus a node → its path brightens, all others 30%; mono
  tooltip shows that system's real `stages` + `stack`; click smooth-scrolls to its
  Systems row; nodes keyboard-focusable, 2 px lime ring; packet layer `aria-hidden`.
- **Transition out:** hero egress edge continues down the left gutter and *becomes*
  the bus rail into Metrics.
- **375px:** SVG dropped; the 7 nodes render as a 5-node vertical spine under the
  copy, one packet, no hover.
- **Reduced motion:** fully drawn, edges at final opacity, no packets — a still that
  reads as a diagram.
- **Cost:** one rAF while in view, `offset-path`/opacity on ≤10 paths, ~4 KB JS, no
  canvas, no blur, no filters. `offset-path` unsupported → packet hidden, diagram
  intact.

## 5. Merged motion language and type scale

**Motion (final numbers).** Enter `cubic-bezier(.22,1,.36,1)` 520 ms · exit
`cubic-bezier(.4,0,1,1)` 180 ms · hover 120 ms ease-out · **travel linear** (data
does not ease) · pulse 600 ms ease-in-out · line-draw 900 ms (one-shot).

Rules: (1) one moving thing per trigger; (2) animate only `transform`, `opacity`,
`pathLength`, `stroke-dashoffset`, `offset-path`; (3) max 3 movers per viewport;
(4) every loop is IntersectionObserver-gated and stops on `document.hidden`; lime
means in-transit only.

**Type scale (final).**
- Display: `clamp(2.6rem, 6vw, 5.5rem)` / 500 / lh 0.94 / tracking −0.035em, sans
- H2: `clamp(1.9rem, 4vw, 3rem)` / 500 / −0.03em
- H3: 1.25rem / 500
- Lead: 1.05rem / 1.6 / muted
- Body: 1rem / 1.6
- Label: mono 11px / uppercase / .12em / muted
- Data: mono 12px / `tabular-nums`
- Micro: mono 10px / faint
