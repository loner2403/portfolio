# Round 2 research — DeepSeek

Slice: interaction and content patterns (telemetry widgets, CLI easter eggs, command palettes, scroll-driven diagrams, case-study storytelling, proof sections, restrained 3D, sound, micro-interactions). Every item marked `verified` was opened live on 2026-10-09; nothing from memory. No servers or builds were run. Translations respect the hard rules (one accent, stroke-only motion, reduced motion, low memory).

---

### 1. Langfuse — LLM observability · verified
`https://langfuse.com/`
Distinctive: the page speaks the product's language — "Hierarchical traces capture every LLM call, tool invocation, and retrieval step" — over a counter header (21 of the Fortune 50 · 90B+ ops/month · 100k+ engineers).
Technique: machine vocabulary as copy; proof-by-counter strip; its carousel prints "Auto-advance is active. Press Escape to pause auto-advance."
→ Hero: keep trace vocabulary exact (stage, latency, req id) — this audience reads it. Metrics: each cell gets a mono source note, not swagger. Any auto-loop stops permanently on first user interaction.

### 2. Temporal — durable execution · verified
`https://temporal.io/`
Distinctive: "Write code as if failure doesn't exist"; "How it works" is four numbered rows, one idea + one diagram each. Proof is named: quotes with role and company (OpenAI, HashiCorp) and "23,556 stars · MIT".
Technique: one-idea-per-row education; real names attached to claims; OSS stats as trust chips.
→ Systems: each row states one idea, one diagram, one consequence. Never fake a quote; the format dies without real names.

### 3. Inngest + Trigger.dev — workflow platforms · both verified
`https://www.inngest.com/` · `https://trigger.dev/`
Distinctive: Inngest's hero is `npm install inngest` with a Copied state; "Trace every background job, agent, and event from trigger to completion"; a security block opening "No fancy animations here—just the facts." Trigger.dev adds a how-it-works demo with Play / Replay / Full screen, realtime run status, quotes that each open a customer story, and OSS chips (16.5k stars, Apache 2.0).
Technique: code-as-hero; user-paced demos; every testimonial opens a real story.
→ Systems: add a mono `↻ replay` on each row to re-run the draw. Work: rows end on a case study (problem → stages → outcome), not a gallery.

### 4. terminal.shop — CLI as storefront · verified
`https://www.terminal.shop/`
Distinctive: you order coffee over SSH; the page is a terminal transcript (`ssh terminal.shop`, known_hosts block, an email line, nothing else), titled "wip: terminal (initial commit)".
Technique: one command as the whole pitch; copy-to-clipboard on code; commit-message humour.
→ Contact: frame the email as the one command (`mail harshal`) with the existing copy button — same primitive, sharper voice. Footer: borrow the version-tag joke (`© 2026 · build 3.1`).

### 5. The Monospace Web · verified
`https://owickstrom.github.io/the-monospace-web/`
Distinctive: a page laid out on a character grid; architecture drawn as ASCII box-drawing figures (message-passing diagram, bar chart) inside `<pre>`; responsive "in character-sized steps"; no JS.
Technique: text-mode diagrams as a first-class medium.
→ Systems: an ASCII rendering is the honest 375px fallback and a possible desktop "text mode" — zero SVG bytes, on-brand for JetBrains Mono. Project pages: architecture appendix as aligned `<pre>` blocks.

### 6. A hidden terminal, and its demotion · verified
`https://asimon.blog/2025-12-30-building-an-interactive-terminal-shell/`
Distinctive: backtick opens a shell — 12 commands, virtual filesystem, tab completion, session-persistent history, `role="dialog"` + aria-live + focus trap + reduced motion. Later demoted from header button to easter egg: "adoption is a design input, not a launch metric."
Technique: keep the toy small, spec it for a11y, hide it behind a key, never in nav.
→ If a `~`-terminal ships: ~8 commands (`whoami`, `open systems`, `cat about`), history persisted, one footer hint; never displace the email CTA.

### 7. cmdk + Raycast — command palettes · both verified
`https://cmdk.paco.me/` (→ github.com/dip/cmdk) · `https://www.raycast.com/`
Distinctive: cmdk is the palette primitive — unstyled, auto filter/sort, keywords as aliases, nested "pages" with Esc/Backspace to go back. Raycast shows a palette as a brand: the keyboard illustration doubles as the spec sheet (Fast / Ergonomic / Personal / "99.8% crash-free").
Technique: nested pages inside the palette; keyboard art as content.
→ Palette: ship pages (Navigate / Projects / Actions) so ⌘K can drill into a project keyboard-first; keywords like `cv`, `mail` must hit; put `⌘K` in the hero's mono footer so it's found inside 40 seconds.

### 8. rauno.me/craft — dated micro-work index · verified
`https://rauno.me/craft`
Distinctive: a catalogue where each entry is title + month/year + "View prototype / View production" — prototypes ("⌘K Breadcrumbs") sit beside essays ("Invisible Details of Interaction Design") and productions ("Testimonials · Sept 2025").
Technique: micro-work presented as dated, verifiable entries with live links.
→ Work: a second tier under the three big rows — a small dated craft list linking to live artifacts — volume and currency at almost no build cost.

### 9. emilkowalski.ski — proof by proximity · verified
`https://emilkowal.ski/`
Distinctive: "Today I work on the Web team at Linear. Previously… Vercel." The project index (Sonner, Vaul, animations.dev) gives each project a one-line pitch and a live link; the writing index doubles as expertise.
Technique: Today/Previously line; project index with live URLs.
→ Hero/Footer: a `Today` line ("Software engineer · AI & data platforms · Mumbai") beats a vibe. Work: attach the live URL or repo where it exists. Stack: "used here" tags belong here, not in the hero.

### 10. leerob.com — verbosity as a control · verified
`https://leerob.com/`
Distinctive: the bio has a Default / Long toggle — the visitor chooses depth; "Notes" is a personal-axioms list; blog titles carry the employment proof (SpaceX, Cursor, Vercel).
Technique: verbosity as a control; notes as a mini-principles section.
→ Hero: short bio by default, Long reveals the second paragraph (remembered, no layout jump; opacity/height with existing tokens). A footer strip could hold 3–4 "notes" one-liners.

### 11. Mercury — footnoted claims, pre-rendered "3D" · verified
`https://mercury.com/`
Distinctive: nearly every claim is footnoted; the credibility band is four real numbers (300K+ · 1 in 3 · $20B+/mo · 4.9 App Store); press headlines carry the number and link out ($5.2B, $650M); the hero ships as pre-rendered frame images, not live WebGL — film feel, no GPU cost. teenage.engineering/products/ob-4 (verified) does the restraint cousin: instrument specs (72 hrs, 2×38 W) as terse design objects.
Technique: footnoted claims; outcome-first press wall; pre-rendered motion.
→ Metrics: a footnote marker and one source line per cell ("résumé, 2026") — the honesty is the brand. Any "3D" impression: pre-rendered frames or CSS. Stack: spec-table styling.

### 12. Bruno Simon — the cost ceiling, and two stealable patterns · verified
`https://bruno-simon.com/`
Distinctive: the full-3D portfolio (Three.js/WebGPU, Rapier, Howler) also displays its cost: renderer/quality selectors and a controls cheat-sheet, with its social features currently offline. Two small patterns are worth stealing: an explicit Audio toggle ("Audio — Toggles sound", plus `L` to mute) and a "Behind the scene" appendix naming every library, devlog and MIT source, with CC0 music credits.
Technique: sound opt-in with keyboard mute; build-story appendix.
→ If sound ships: one toggle, off by default, remembered, `M` to mute — no autoplay. Project pages: a "how it was built" block (stack, source, credits) is the cheapest credibility on the site. The 3D: a deliberate no.

### 13. Josh Comeau + Scroll-Driven Animations · both verified
`https://www.joshwcomeau.com/` · `https://scroll-driven-animations.style/`
Distinctive: Josh's index is a ranked "Popular Content" 1–10 list and his articles are demos — "Scroll-Driven Animations" (`animation-timeline`, no JS) and "Squash and Stretch" for SVG micro-interactions. Bramus's gallery makes it concrete: progress bar, image reveal, cover-card-to-fixed-header — CSS and WAAPI versions, off the main thread.
Technique: CSS `scroll()`/`view()` timelines as zero-JS scrub; squash/stretch on small elements.
→ Systems: where a scrub is simple (row draw, tick strip), the CSS timeline beats a second JS system; keep GSAP for the hero rail hand-off. Log dot: 1.15 overshoot on arrival reads alive. Transitions: cover-card-to-fixed-header suits the Work-row → project morph.

### 14. Live GitHub activity on a portfolio · verified
`https://www.amityadav.tech/writing/display-github-contributions-portfolio` (May 2026)
Distinctive: an AI/ML engineer embedded a live contribution graph plus PR feed — GraphQL, `contributionLevel` quartiles, a pulse on notable days (external contribution, or ≥5 commits), Radix tooltips, hourly refresh; his rule: "design from the recruiter's perspective — what they need to know in 10 seconds."
Technique: real activity, refreshed, explained on hover, linked out.
→ Work/Footer: a `last ship · 2h ago` mono line built at build time gives the signal at 1% of the cost; a full graph only on a dedicated page — and only if it is actually green, because an empty graph is negative proof.

---

## Patterns that repeat (max 6)

- **Trace vocabulary, not taglines.** Traces, stages, latencies, run status as copy (Langfuse, Inngest, Temporal, Trigger.dev).
- **Proof furniture.** Counters, named quotes, star counts, footnotes, linked press headlines — every claim points somewhere (Mercury, Temporal, Trigger.dev, Langfuse).
- **Terminal as texture, easter egg as reward.** Small, a11y-spec'd, behind a key, never the nav (terminal.shop, asimon.blog, Monospace Web).
- **User-paced motion.** Demos get Play/Replay, carousels get Escape, scroll scenes can stay CSS and off-main-thread (Trigger.dev, Langfuse, Bramus).
- **Small dated entries sell better than one big case study** in a 40-second scan (rauno.me/craft, leerob.com).
- **Restraint reads premium.** Pre-rendered frames over WebGL, one sound toggle off by default, terse specs (Mercury, Bruno Simon, teenage.engineering).
