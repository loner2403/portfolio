# V3.1 "Dataflow" — merged design (DRAFT for owner approval)

Sources: round 1 and 2 of Claude, DeepSeek, MiMo (`docs/design-room/`). Nothing here is built yet.
Where the three agreed, it is stated as decided. Where I (flagship) overruled or added, it is marked **[Claude call]**.

## Spine

The page is one architecture diagram. The hero draws the Bull AI topology; its egress edge runs down the left gutter as a **bus rail** that connects every section marker `[01]…[05]` and ends in a square cap at Contact. One stroke language everywhere: 1px lines, 4px square nodes, lime packets.

## Decided (all three agree)

- Retire DotGrid, TracePanel card, AnimatedBeam, SpotlightCard, TracingBeam. One hand-built SVG vocabulary.
- Lime = data in transit only. Teal is cut. No third colour.
- Hero geometry hand-authored and frozen; labels, ids, stages and stack read from `SYSTEMS`.
- Hero shows topology only (7 nodes, `S-01…S-05` map 1:1 to the Systems rows). Stage chains live in Systems, not the hero.
- Hero draws once; no scroll-bound path animation. Scroll drives exactly one thing: the Log dot.
- Hover or focus a node: its path brightens, everything else dims to 30%, tooltip shows real `stages` + `stack`. Click scrolls to that Systems row.
- Motion allowlist: `transform`, `opacity`, `pathLength`, `stroke-dashoffset`, `offset-path`. Max 3 movers per viewport. Every loop is IntersectionObserver-gated and stops on `document.hidden`.
- Type ceiling 5.5rem. Metrics stay container-bound as a hairline strip.
- Square or 2px radii instead of pills.

## Global tokens

Enter `cubic-bezier(.22,1,.36,1)` 520ms · exit `cubic-bezier(.4,0,1,1)` 180ms · hover 120ms ease-out · travel linear · pulse 600ms · line-draw 900ms one-shot.
Type: Display `clamp(2.6rem,6vw,5.5rem)`/500/0.94/-0.035em · H2 `clamp(1.9rem,4vw,3rem)` · H3 1.25–1.5rem · lead 1.05rem · body 1rem · metric mono `clamp(2.5rem,5vw,4rem)` tabular · label mono 11px uppercase .12em · data mono 12px · micro mono 10px faint. Mono = anything a machine emits; sans = anything a human says.

## Sections

| Section | Design |
|---|---|
| **Hero** | Left: label, H1 (agent & data systems underlined), lead, one filled CTA + one text link. Right: SVG topology S-03 pollers → Supabase/Postgres + Qdrant → S-01 agent → S-04 copilot → SSE out, S-05 batch below. Request chip `req_8f3a · research-agent`. Storyboard: 0–0.6s edges fade up, 0.6–2.4s packet runs pollers→store→qdrant, 2.4–4s agent node lights and copilot edge draws, 4–5s fully lit (the 5-second read), then one packet per ~2.5s alternating paths, dim and loop at ~9s. Footer inside SVG: `simulated trace · illustrative timings`. |
| **Metrics** | Hairline strip, four cells, mono tabular numbers from `HERO_STATS`, 2px lime tick draws on enter, count-up 900ms. 2×2 on mobile. |
| **Systems** | Cards dropped. Five full-width rows, diagram side alternates 7/5. Each row draws its real `stages` as an SVG pipeline with one packet; stack as a single mono line. S-01 row carries the illustrative per-stage latencies. |
| **Work** | Oversized index rows (title ~56px at desktop), mono id column, lime rule under the hovered row, thumbnail preview on pointer devices only. |
| **Log** | Own `useScroll` rail with one 8px lime dot (transform only), mono dates, `current` role breathes. |
| **Stack** | Legend of the diagram: plain mono columns, hovered chip dims siblings to 40%. No cross-section highlighting. |
| **Contact** | Rail ends at a `contact` node. Email in large mono with a lime underline that draws once, copy button, plain links. |
| **Footer** | One mono line: © · IST clock · stack. Rail terminates in a cap. |
| **Route change** | 180ms exit, 320ms enter (8px rise), plus a 2px lime fetch line sweeping the top in 400ms. Reduced motion: 100ms crossfade. |

## Fallbacks

Reduced motion: fully drawn still, no packets. Under 768px: **[Claude call]** keep a simplified SVG (5-node vertical spine, one packet) instead of dropping it, because a hero without its diagram on mobile is the bland page again. `offset-path` unsupported: packet hidden, diagram intact.

## Contract changes needed

Delete the DotGrid and TracePanel hero spec; add the bus rail and enumerated motion allowlist; allow `offset-path` and `stroke-dashoffset`; replace pill chips with square chips; update the beam ban to "decorative beams only".

## Open risk **[Claude call]**

The agents converged on a clean, safe diagram: nodes, hairlines, one packet. That fixes "generic card hero" but may still read as **tidy rather than fluid**, which is what you asked for. Proposed upgrade, still within the allowlist and cost budget: draw edges as smooth cubic Béziers (not right-angle lines) with a continuous low-contrast `stroke-dashoffset` flow on every edge, so the whole diagram visibly streams even between packets. Decision for you: tidy (as above) or flowing (Béziers plus constant edge flow).
