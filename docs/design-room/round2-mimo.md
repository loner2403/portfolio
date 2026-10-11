# Round 2 — MiMo cross-critique

## 1. Steal list

1. **Claude's Systems full-width rows, cards dropped** (`round1-claude.md:51`). Beats my SpotlightCard retention because border + spotlight + badge + chips on every card *is* the "bland, no creativity" pattern the owner named. Rows also give a 6-stage chain real width; my 4-col bento squeezes one into ~280px.
2. **Claude's hover focus: target path brightens, everything else dims to 30%** (`round1-claude.md:34`). Beats my "chain re-runs on hover" — a re-run is a second motion system that fights the one-shot draw and needs a timeline pause. Dim-to-30 is one property, reversible, reads in one glance.
3. **DeepSeek's request identity chip** (`round1-deepseek.md:75`): `req_8f3a · research-agent`. Turns my anonymous lime dot into a specific request. One mono span of cost, and it gives the footer's `simulated trace` label something concrete to refer to.
4. **DeepSeek's per-stage latencies** (`round1-deepseek.md:85`): `retrieve 38ms → analyse 1240ms → …`. Right content, wrong room — it moves into Systems' S-01 row where the six stages live. My round-1 ticking ms inside the hero was the same mistake.
5. **Claude's retire list** (`round1-claude.md:92`): DotGrid, AnimatedBeam, TracingBeam, SpotlightCard out; one hand-built stroke vocabulary. DeepSeek conceded it (`round2-deepseek.md:11`); I should have led with it in round 1.

## 2. Attack list

1. **My hero runs three diagrams in ten seconds** — topology, then S-01's six-stage expansion, then S-04's five stages, plus alternating packets (`round1-mimo.md:46-47`). DeepSeek's hit lands (`round2-deepseek.md:34`): nobody parses three DAGs in a 5-second budget, and the chains duplicate Systems. **Fix: cut all in-hero stage expansion.** Hero = topology + request chip + packets; stage chains exist only in Systems rows.
2. **My card retention** (`round1-mimo.md:78`). Steal #1 is also the fix: full-width rows, hairline separators, no border/spotlight/badge. Relabelling the interior never worked.
3. **My 40px right bleed past the container** (`round1-mimo.md:52`). I attacked Claude's bleed then wrote my own. Any leftover translate at 375px = horizontal scroll = hard contract fail, and clipped overflow kills the "continues off-screen" idea anyway. **Fix: schematic clipped inside the container.** Continuity is sold by the egress edge becoming the bus rail, not by bleed.
4. **Claude's scroll-bound retraction** (`round1-claude.md:36`): `pathLength` → 40% while scrolling a large SVG. Continuous scroll-linked paint is the top jank risk on this low-memory machine and contradicts his own "scroll drives one thing" (the Log line). **Fix: hero draw is one-shot; the exit is a static edge.** Scroll keeps exactly one consumer: the Log dot.
5. **DeepSeek's full-bleed bands** (`round1-deepseek.md:24`) **and cross-section chip highlight** (`round1-deepseek.md:136`). Bands buy width the graph doesn't need and break container discipline at both breakpoints. The cross-highlight needs a global shared context to light one chip for 120ms, and it is dead below 768px. **Fix: metrics stay container-bound as a hairline strip; cut the cross-highlight.** Also confirmed dead: teal (`round2-deepseek.md:25`) — one accent, agreed.

## 3. Disagreements

- **Hero technique:** my 7-node topology vs DeepSeek's S-01 stage traversal vs Claude's 3-lane router. **Mine.** Deciding reason: the hero must preview the page — five `S-0x` nodes map 1:1 onto the five Systems rows, so the visitor has learned the page index before scrolling. DeepSeek's stage DAG tells one pipeline and leaves four systems unexplained; Claude's lanes need decoding.
- **Geometry: hand-authored vs data-generated** (Claude's open question, `round1-claude.md:97`). **Hand-authored paths; labels, ids and `stages` read from `SYSTEMS`.** A 5-second composition is a design act — auto-positioned nodes rearrange on every content edit, and hero geometry must be screenshot-frozen once. Systems rows are the data-driven pipelines, so edits still surface.
- **Metrics:** Claude's borderless 24px-staggered row vs my hairline strip vs DeepSeek's full-bleed. **Hairline strip, inside the container.** Stagger is asymmetry with no referent; the strip continues the bus-rail hairline grammar. (DeepSeek already sided with me, `round2-deepseek.md:68`.)
- **Type ceiling:** 5.5rem vs DeepSeek's 6rem. **5.5rem** — he conceded (`round2-deepseek.md:61`); at 6rem the H1 crowds the diagram column near 1024, and boldness is bought by contrast and tracking, not px.
- **Motion rule:** "transform/opacity only" vs an enumerated allowlist. **Enumerated:** `transform`, `opacity`, `pathLength`, `stroke-dashoffset`, `offset-path`. All paint-only, and a reviewer can grep five tokens. A blanket ban would outlaw the packet — the whole concept.
- **Hover physics:** Claude's spring vs ease-out. **120ms ease-out.** One easing system; springs on hairlines read rubbery.

## 4. Merged hero (0–10 s)

- **Static first paint (LCP = H1):** inline SVG, 7 nodes, hairline edges, mono labels, request chip `req_8f3a · research-agent`, one packet parked at `pollers`; copy, lead, filled CTA + text link; in-SVG footer `simulated trace · illustrative timings`. Nothing waits on JS.
- **0.0–0.6 s** edges fade up, 40 ms stagger (opacity only).
- **0.6–2.4 s** packet 1 travels `poll · S-03 → store (Supabase) → qdrant`, 1.8 s linear via `offset-path`; each touched node border → lime 300 ms, then settles ink.
- **2.4–4.0 s** agent node lights; edge to `copilot · S-04` draws 900 ms; `stream · sse` egress pulses once.
- **4.0–5.0 s** full topology lit at final contrast — the 5-second read: one request, five systems.
- **5.0–8.5 s** steady state: one packet every ~2.5 s, alternating the S-03 and S-04 paths.
- **8.5–9.0 s** dim to baseline, loop; IntersectionObserver-gated, stops on `document.hidden`.
- **Interaction:** hover/focus a node → its path brightens, rest 30%; tooltip shows real `stages` + `stack`; click scrolls to that Systems row; 2 px lime focus ring; packet layer `aria-hidden`.
- **Transition out:** egress edge continues down the left gutter and becomes the bus rail into Metrics.
- **375px:** SVG dropped → 5-node vertical spine under the copy, one packet, no hover.
- **Reduced motion:** fully drawn still, edges at final opacity, no packets.

## 5. Merged motion language and type scale

**Motion.** Enter `cubic-bezier(.22,1,.36,1)` 520 ms · exit `cubic-bezier(.4,0,1,1)` 180 ms · hover 120 ms ease-out · travel **linear** · pulse 600 ms ease-in-out · line-draw 900 ms one-shot · count-up 900 ms expo-out, 80 ms stagger.
Rules: (1) allowlist only — `transform`, `opacity`, `pathLength`, `stroke-dashoffset`, `offset-path`; (2) one moving thing per trigger, max 3 movers per viewport; (3) every loop IO-gated and stopped on `document.hidden`; (4) lime = in transit only; colour never animates decoratively; (5) scroll drives exactly one thing (Log dot).

**Type.**
- Display: `clamp(2.6rem, 6vw, 5.5rem)` / 500 / lh 0.94 / −0.035em, sans
- H2: `clamp(1.9rem, 4vw, 3rem)` / 500 / −0.03em
- H3 (Systems row title): 1.5rem / 500
- Lead: 1.05rem / 1.6 / muted
- Body: 1rem / 1.6
- Metric: mono `clamp(2.5rem, 5vw, 4rem)` / `tabular-nums`
- Label: mono 11px / uppercase / .12em / muted
- Data: mono 12px / `tabular-nums`
- Micro: mono 10px / faint
