# R2 research — slice: award-winning websites (MiMo)

Scope: Awwwards / FWA / CSS Design Awards / Godly / Siteinspire / Land-book, areas = developer, engineering, AI, data, SaaS, personal portfolios. 2025–2026 preferred.

Source notes: `awwwards.com` and `thefwa.com` returned **403 to direct fetch**, so award labels below come from search-result snippets of those pages (marked); the live sites themselves were opened and are marked `verified`. `cssdesignawards.com`, `land-book.com`, `siteinspire.com` opened fine; `godly.website` returned only JS chrome (no items retrievable — nothing claimed from it).

## Items

### 1. Jesper Landberg — https://jesperlandberg.com/ — `verified`
Awwwards SOTD + Developer Award, Sep 29 2026 (listing snippet). A design engineer's portfolio whose homepage reads like a plain index: one-sentence positioning, a featured-work list, an "elsewhere on this site" block (full index / newsletter / llms.txt), contact last.
**Technique:** content structure over decoration — no hero image, no metrics, just a typed index; every page also serves Markdown (`Accept: text/markdown`).
**Translation:** Hero could drop adjectives for one line of positioning; Stack and Log read as index entries rather than cards; publishing an `llms.txt`/Markdown mirror is a cheap, very "engineering" proof point.

### 2. Dennis Snellenberg — https://dennissnellenberg.com/ — `verified` (award listing `unverified`)
Personal portfolio for a freelance designer/developer. Multilingual greeting swap ("Hello / स्वागत हे / …"), fixed side nav, and a work list where each row shows role + year.
**Technique:** entrance type-swap in the greeting; work presented as rows with `Interaction & Development · 2024` metadata instead of thumbnails; live local-time readout in the footer.
**Translation:** Work rows can carry role + year as mono metadata (already close); a small live signal (local time, "available") in Footer adds life without motion cost.

### 3. OceanX 2025 Year in Review — https://2025.oceanx.org/ — `verified`
Awwwards SOTD Feb 23 2026 + FWA of the Day (listing snippets). A science/data organisation's annual report rebuilt as seven numbered chapters ("chapter 01 … 07"), each with a headline, subhead, and a three-paragraph body.
**Technique:** chapter numbering as the navigation spine; long-form data prose anchored by a persistent "BACK TO TIMELINE" affordance. Built on WebGL ship-trail nav (three.js) — heavy; do not copy the engine.
**Translation:** Systems and Work can adopt explicit chapter/phase numbering with a persistent jump-to-index affordance; Log already wants `01…07`-style IDs.

### 4. NRG — Build Your Data Center — https://business.nrg.com/campaigns/build-your-data-center — `verified`
Awwwards SOTD + Developer Award, Jun 30 2026 (listing snippet). An infrastructure/energy page that turns a build process into a five-phase scroll narrative: "See our strategy come together in five simple phases."
**Technique:** staged step reveal ("Scroll to Phase 1"), a gated entry ("Enter Site") into the deeper experience, and clickable *Nodes* microinteractions for diagram elements.
**Translation:** exactly the Systems section's problem — five diagrams become five numbered phases with a scroll-driven active state, plus node hover that reveals one spec line each.

### 5. AI in Design Report 2026 — https://stateofaidesign.com/ — `verified`
Awwwards SOTD Aug 26 2026 (listing snippet). A research report as a website: an "An Inflection Point" opener with count-up stats, then three numbered chapters (01 Tools, 02 Craft, 03 Teams), each a contents list plus a read link, then video case studies.
**Technique:** editorial chart blocks and count-up stats (`0+` placeholders animating to survey numbers); navigation mirrors the document's own TOC; footer hover interaction.
**Translation:** Metrics strip = count-up stats with a "Source:" line under each (honest, since ours are illustrative); Stack could become numbered chapters with per-chapter contents lists.

### 6. Cerebrium — https://www.cerebrium.ai/ — `verified`
Awwwards SOTD Sep 10 2026 (listing snippet). Serverless-GPU SaaS that sells with evidence: cold-start bar comparisons (3.8s vs 42s vs 156s), a fake-but-honest terminal (`cerebrium run …` with progress bars), and a live capacity/regions readout.
**Technique:** proof-as-UI — charts, terminal transcripts and counters replace adjectives; segmented tabs (GPU / CPU / Startup Time) on the benchmark table.
**Translation:** Work rows can embed a small terminal transcript or benchmark bar; Metrics can pair each number with a unit and method note rather than bare digits.

### 7. Heron AI — https://heronaiapp.com/ — `verified`
Awwwards Nominee/HM, Sep 1 2026 (listing snippet). AI agent for architects; the hero is a spec card (TYPE / FOUNDED / FOCUS / LOCATION) beside a numbered boot log (`001 INITIALIZE CORE SYSTEM … 010 START EXECUTION`), plus a draggable canvas: "Click and drag your mouse to see violations."
**Technique:** boot-log as static typography (their preloader is off-contract for us); one drag interaction as the whole demo; problem cards labelled `[01]…[04]` with one-word verdicts (Manual, Disjointed, Blind, Slow).
**Translation:** Hero blueprint sheet can carry the numbered log as *static* text (no preloader); Systems problems get one-word mono verdicts; one drag/hover demo beats five equal diagrams.

### 8. Giga — https://giga.ai/ — `verified` (via Land-book feature)
AI support-agent SaaS. Its "How it works" is one continuous scroll animation with three chapters — Build / Observe / Improve — with stage buttons to jump, arrow-key inspection, and Escape to clear.
**Technique:** a single scene transformed across chapters instead of three separate sections; explicit keyboard affordances documented in-page; compliance badges (SOC 2, ISO 42001) as a quiet trust strip.
**Translation:** Systems/Work could share one persistent diagram that reconfigures per section, with stage buttons (Build→Observe→Improve ≈ Ingest→Process→Serve); Stack gets a standards/trust strip.

### 9. Terms.so — https://terms.so/ — `verified` (via Land-book feature)
Legal-SaaS landing that demos itself: a two-pane animated example (chat left, draft right) labelled "This is an animated example with sample agreements."
**Technique:** honest framing of canned demos; state annotations (`Saved`, `Drafting…`, `Resolved`) inside the mock; product claim stated once ("You'll never open DocuSign again").
**Translation:** Work project rows can show an annotated mock (state labels in mono) and label it "illustrative" — consistent with the contract's `simulated trace · illustrative timings` honesty rule.

### 10. Jitter — https://jitter.video/ — `verified`
Awwwards SOTD May 3 2025 (listing snippet). Motion-SaaS landing: "Design in motion. Now with AI." plus an auto-playing template marquee and numbered feature triads (Animate / Refine / Ship, with a `5×` proof figure).
**Technique:** templates as the hero visual (product output, not screenshots); logos of users as plain text strip; testimonials attached to named roles.
**Translation:** a low-cost marquee of Work thumbnails or Systems diagrams; Stack groups get a "used at scale" figure only where real.

### 11. Mygom.tech — https://mygom.tech/ — `verified`
Awwwards Honorable Mention, Oct 27 2025 (listing snippet). Dev/SaaS agency site with a fixed `PAGE PROGRESS 0%` readout, a free "AI Process Diagnostic" tool as the lead magnet, and services numbered `Service / 01…06`.
**Technique:** progress percentage as a persistent HUD; interactive diagnostic replacing a contact form; numbered service rows with a repeating hover echo.
**Translation:** pairs with the existing progress line — surface it as `PAGE PROGRESS NN%` in mono; Contact could offer a tiny 3-question "what do you need" triage instead of a bare email.

### 12. Unseen Studio 2025 Wrapped — https://2025.unseen.co/ — `verified`
Awwwards SOTD Mar 24 2026 + CSSDA Website of the Day Mar 9 2026 (listing snippets). A studio year-in-review as a chronological index: months as huge typographic anchors, each item tagged `[digital] [nov_25]`, inline `Open [+]` disclosures, and a `[00%]` loader counter.
**Technique:** month/name headers split per character for staggered reveal; content tags in bracket mono; disclosure rows instead of separate pages.
**Translation:** Log (experience) becomes a month/year index with bracket tags `[role] [year]` and inline `Open [+]` detail expansion — richer than a plain timeline, no new assets needed.

### 13. OKAY DEV® — https://okaydev.co/ — `verified` (award `unverified`)
Developer community/portfolio platform. The homepage is a long scrolling gallery of member portfolios with hover previews, plus a wordmark/brand-kit drawer (SVG/PNG variants, "Okay Pick" marks).
**Technique:** directory-as-homepage; brand system published as downloadable assets; role ticker (`Designers / Developers / Studios / Agencies`) swapping in place.
**Translation:** Stack could be a hover-preview directory of tools; publishing the site's own accent/token sheet mirrors "brand kit as content."

## Patterns that repeat

- **Proof beats adjectives:** benchmarks, terminal transcripts, count-up stats and state labels ship instead of claims (Cerebrium, AI in Design Report, Terms.so).
- **Numbering is the navigation:** `chapter 01`, `Service / 06`, `[01]` — mono IDs organise sections and double as jump links (OceanX, Heron, Mygom, NRG).
- **One demo, not five:** a single drag/scroll/stage-driven interaction carries the product story; everything else is static (Heron, Giga, NRG).
- **Index over cards:** award-winning portfolios and studios present text lists with role/year metadata rather than thumbnail grids (Jesper, Dennis, Unseen).
- **Honest labelling of canned content:** "illustrative", "sample", "simulated" is stated openly and reads as craft, not weakness (Terms, OceanX trace notes).
- **Restrained, single-scene motion:** transform/opacity reveals on scroll, keyboard-reachable controls, reduced-motion respected — heavy WebGL is the exception, not the norm.
