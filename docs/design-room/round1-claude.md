# Round 1 — Claude: "The Living Diagram"

Dials (design-taste-frontend): **DESIGN_VARIANCE 7, MOTION_INTENSITY 6, VISUAL_DENSITY 5.**
Variance 7, not 8+: the content is technical proof for hiring managers; asymmetry should come from the diagram, not from chaos. Motion 6 because the hero must visibly move (the skill's "motion claimed, motion shown" rule), but only the diagram loops; everything else is entry and hover. Density 5: breathing hero, denser Systems.

## Skill audit findings (current site)

- Hero is the stock split: label, H1, lead, filled pill + ghost pill, card on the right. Fingerprint of generic AI landing pages.
- Dot-grid background is decoration with no meaning, and it is off entirely on mobile and reduced motion, so the hero then is just a flat dark screen.
- TracePanel is a bordered card with a vertical list: reads as a UI mock, not as architecture. It shows one system as a list; nothing shows how the five systems relate.
- Metrics: four equal bordered cells (the "equal columns" pattern) and the numbers carry no relation to the hero or to Systems.
- Systems: card + border + spotlight + pill badge + chips on every card. Pipelines are a text string with arrows, the most interesting content rendered as the least visual element.
- Every section is `border-t` and uniform `py-24`: no rhythm, no overlap, no depth.
- Pill buttons, pill badges and pill chips everywhere (uniform radius). Single typeface family, weight 500 for everything.
- Strength to keep: tokens, one accent, mono labels, real data.

## Concept spine

A portfolio that is the **architecture diagram of the platform you hired him to build**. One continuous schematic drawn in SVG, which starts as the hero, then *hands its lines down* into each section: the same stroke language (1px line, 4px nodes, lime packets) appears as the stage pipelines in Systems, the spine of the Log, and the connector in Contact. References: Linear's near-black restraint and hairline discipline, Sentry's trace-waterfall density, Supabase's schematic diagrams, Vercel's architectural grid. Our twist: the diagram is data-driven from `SYSTEMS`, so it can never drift from the content.

## Global motion language

1. One easing: `cubic-bezier(.22,1,.36,1)` (out-expo) for all entry; spring `stiffness 120, damping 22` for hover physics.
2. Durations: 120 ms hover, 500 ms entry, 900 ms line-draw, 8 s idle loop (hero only).
3. Lines draw (`pathLength`), nodes fade+scale 0.9→1, packets travel; nothing else animates.
4. Scroll drives one thing only: line-draw progress (`useScroll` → `pathLength`). No pinning, no hijack.
Type: Space Grotesk 500 display, **JetBrains Mono for everything structural**. Scale: 88/80, 52, 32, 20, 16, mono 13 and 11. Add `text-wrap: balance`, `tabular-nums`, weights 400/500/600.

## Hero

- **Concept:** in five seconds the visitor sees a live platform diagram and the H1 explaining it.
- **Visual:** full-bleed SVG, 12-col grid hairlines at 4% opacity, behind and around the text. Left 6 cols: label, H1 (agent & data systems keeps the underline), lead, one filled CTA plus a plain text link (no ghost pill). Right/bleeding off the right edge: the schematic, 3 lanes. Lane A *ingest*: `S-03 pollers` → `Supabase / PostgreSQL`. Lane B *reason*: `S-02 pipeline` and `S-01 agents` ↔ `Qdrant`, writing to `Supabase`. Lane C *serve*: `S-04 copilot` (FastAPI SSE) → `React client`, with `S-05 batch jobs` on GCP feeding storage. Nodes are small mono tags (id + name), 1px squares not pills. Footer label: `illustrative topology · not a deployment map`.
- **Storyboard (0–10 s):** 0.0 grid + node dots fade in, static first paint is already the full diagram with dim lines. 0.4–1.6 lines draw lane by lane (ingest, reason, serve), stagger 150 ms. 1.6 first lime packet leaves `S-03`; 2.2 packet reaches the database, node ticks `+1 row` style micro-label (not a metric). 3–6 a request pulse enters `S-04`, fans through Qdrant retrieval, returns as a streaming dash train to the client. 6–8 agent lane lights stage by stage (`plan → retrieve → … → persist`, real stages). 8–10 everything decays to idle dim, loop. 
- **Interaction:** hover a node = its whole path brightens, rest dims to 30%, a mono tooltip shows stack chips. Click = smooth-scroll to its Systems row. Keyboard focusable nodes.
- **Typography:** H1 clamp(2.6rem, 6vw, 5.5rem), tracking -0.035em; node labels mono 11, uppercase ids faint, names ink.
- **Transition out:** as you scroll, line `pathLength` retracts to 40% and nodes shrink into the left rail; the Systems pipelines draw in from the same y.
- **Fallback:** reduced motion = fully drawn, no packets, one lit lane. Mobile 375: diagram becomes vertical 3-lane stack under the H1, 6 nodes only, packets on a single lane; no hover.
- **Cost:** ~12 SVG paths, motion `pathLength` + CSS offset-path for packets; < 8 KB JS, no canvas. Low risk. Replaces DotGrid and TracePanel (removes the gsap/dot canvas cost).

## Metrics

- **Concept:** stats read like a build-log footer, not a KPI card row.
- **Visual:** one 4-column row with no borders; numbers 72px light-weight mono-tabular, labels 11px mono under a 1px lime tick; column offsets stagger by 24px vertically (variance). Numbers are `HERO_STATS` only.
- **Motion:** counter on view, 700 ms out-expo, stagger 80 ms; the 1px tick draws left→right.
- **Transition in:** the hero diagram's baseline continues as the row's top line. Out: line forks into the five Systems rails.
- **Fallback:** 2×2, instant values. **Cost:** trivial.

## Systems

- **Concept:** each system is a labelled diagram you can read in 10 seconds, not a card.
- **Visual:** drop the cards. Five full-width rows (`S-01` … `S-05`), alternating 7/5 layout (diagram side flips each row). The diagram is the `stages` array drawn as an SVG pipeline: squares joined by lines with a lime packet. Title, summary and 3 highlights sit beside it; stack is a single mono line separated by `·`, not chips. S-01 is taller and shows the full lane map; rows have no borders, only a hairline between them and a faint grid behind the diagram.
- **Motion:** on view, pipeline draws left→right (900 ms), nodes pop in sequence; a packet runs once, then idles. Hover = pipeline brightens and stage names reveal.
- **Typography:** title 32/500, summary 16 muted max 52ch, stages mono 12.
- **Transition:** rails from Metrics drop into the rows and become each pipeline's left terminal.
- **Fallback:** static drawn pipelines; mobile stacks diagram above text, stages wrap into two lines. **Cost:** low (5 small SVGs).

## Work

- **Concept:** an index, with proof of life on hover.
- **Visual:** keep index rows, but oversized: title 56px, index number mono, tech as mono line. A thin lime rule extends under the hovered row; the thumbnail preview follows with spring offset, clipped by a 2px-radius mask (no rounded-everything).
- **Motion:** row translateX 8px on hover, title weight shifts 500→600 (variable font). **Transition:** list lines draw in as one long path from the Systems terminal. **Fallback:** no preview on touch; rows tap through. **Cost:** low.

## Log

- **Concept:** the timeline is the same spine line continuing down the page.
- **Visual:** a single vertical 1px line (replace TracingBeam with our own `useScroll` pathLength line, one less dependency), entries hang off it with a mono date node. Current role gets the pulsing signal dot. Two-column: dates left in mono, content right, offset 40px.
- **Motion:** line draws with scroll; entries fade+rise 12px. **Fallback:** full line, no draw. **Cost:** low.

## Stack

- **Concept:** a legend for the diagram, not a table of chips.
- **Visual:** groups as columns of plain mono lists; items that appear in the hero diagram get a small lime square. Hovering a hero-linked tool highlights it if the diagram is visible (no cross-scroll magic).
- **Motion:** staggered fade. **Fallback:** single column. **Cost:** trivial.

## Contact

- **Concept:** the diagram ends at an open port.
- **Visual:** the spine ends in a large `contact` node; H2 at display size, email in 40px mono with a copy action, links as plain underlined text. A last lime packet arrives when the section enters, then rests.
- **Motion:** line draw 900 ms, copy confirms inline. **Fallback:** static. **Cost:** trivial.

## Footer

Left-aligned mono single line: copyright, IST clock, stack. Hairline continues from the spine and terminates. No link farm.

## Page transitions

Route changes: 200 ms opacity cross-fade plus 8px rise; project page header draws its own short line from the clicked row's y (shared `layoutId` on the index number only). No full-screen wipes.

## Rules I would relax (and why)

- "No aurora/meteor/beam backgrounds": keep banned as *backgrounds*. Flowing lines are now content (the diagram), not a decorative layer.
- Magic UI AnimatedBeam, DotGrid, SpotlightCard, TracingBeam: retire. Fewer deps, a single hand-built SVG vocabulary.
- Pill shape: replace with squares/2px radii to break the generic look. Contract rules on accent, motion gating, and 375px stay.

## Open question for the other voices

Do we hand-author the hero SVG layout, or generate the node positions from `SYSTEMS` with a fixed lane config so data changes stay safe?
