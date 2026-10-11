# R2 Sonnet B: interaction and craft

Design read: developer portfolio for AI-startup hiring managers, blueprint/dark-tech language, redesign-preserve. Dials 6 / 5 / 5 (variance / motion / density). Thesis: his production systems are proprietary, so interaction is the portfolio. Each addition lets a diagram answer a question (what runs, in what order, what is stored) instead of just moving.

## 0. What I opened, and corrections to the research files

Confirmed: Trigger.dev (trigger.dev) has Play / Replay / Full screen on its how-it-works demo (run status is a separate section). Cerebrium (cerebrium.ai) shows a `cerebrium run` transcript with progress bars plus cold-start bars; its second numeric set is unlabelled, so I borrow structure only. terminal.shop shows `ssh terminal.shop` under "wip: terminal (initial commit)". asimon.blog (2025-12-30 post): backtick shell, 12 commands, dialog role, focus trap, localStorage history, demoted to an easter egg. cmdk README (github.com/dip/cmdk): `keywords` aliases exist, but nested pages are hand-built. Heron (heronaiapp.com): boot log `001 INITIALIZE CORE SYSTEM` to `010 START EXECUTION`. scroll-driven-animations.style: 14 demos, CSS and/or WAAPI, polyfill when unsupported. reactrouter.com/api/components/Link: `viewTransition` exists only in Framework and Data modes. web.dev (same-document-view-transitions-are-now-baseline-newly-available): Baseline since Firefox 144.

Not confirmed, so not relied on: NRG's clickable "Nodes" (page shows only "five simple phases" and "Scroll to Phase 1"); Unseen's "Open [+]" (external links, not inline disclosure; bracket tags are real); terminal.shop "copy to clipboard" (a comment line, no button); Langfuse "Escape to pause" and Giga stage buttons (absent on their homepages).

## 1. Audit

- **Hero.** Strong: word-mask H1, sheet with corner marks, rulers and title block, index-to-graph cross-hover. Generic or risky: seven edges each run a 3-circle packet train, dash flow and a ring at once, which breaks the contract's "3 movers" and is the likeliest memory cost; pointer parallax (`--px/--py`, permanent `will-change`) moves hover targets under the cursor; the most useful sentence (stages plus stack) sits in a 12px faint strip, empty by default; no hint that ⌘K exists. Missing: one request you can follow.
- **Metrics.** Clean strip, but count-ups are the commonest portfolio trope and "5 systems built" counts rows on this page.
- **Systems.** The strongest section: five distinct, real-stage diagrams. But after the draw nothing responds (`interactive` is off), bullets are inert, five same-shape rows zigzag, and mobile degrades to a text list with no motion.
- **Work.** Weakest. Rows are `text-xl`, not the 56px spec; two of three projects have no thumbnail or live URL, so the hover preview rarely fires; the case-study page is a prose dump with pill chips and a small "Next project".
- **Log, Stack, Contact, header, palette, project page.** Still old language: TracingBeam, `rounded-full` pills, `rounded-xl` cards, lucide icons, blurred palette overlay, an em dash in the document title. MOTION-PLAN's three signature scenes are unbuilt; no route transition; no skip link.

## 2. Additions

**A1. Trace run (signature 1). Systems.** A real `<button>` "run request" under each diagram sends one lime packet through that system's actual `stages`; nodes light on arrival and a waterfall grows below (scaleX). S-01 and S-04 (request lifecycles) get the waterfall; S-02, S-03, S-05 only light in order, which avoids latency claims for batch jobs and breaks the row monotony. Bars are unitless unless the owner approves numbers; always captioned `simulated trace · illustrative timings`. Replay link, no autoplay. Borrows Trigger.dev's user-paced Play/Replay and Cerebrium's terminal-as-proof; changes: SVG, honest label, our own vocabulary. Reuses FlowGraph path maths and `.packet` CSS, ~2 KB. Mobile: the stage list is the trace, a square walks down its rail.

**A2. Highlight-to-node linking. Systems.** Map each existing `highlights` string to a node id (S-02 "Cached intermediate steps" to `cache`). Hover or focus a bullet: node and edges light, the rest dims to 30%. FlowGraph already takes `activeId`; lift state as Hero does. No new claims, ~0.3 KB.

**A3. One named request in the hero.** Replace seven looping trains with a single `req_8f3a` packet walking S-03, store, S-01, S-04, client every ~7s. The info line becomes a ticker (`req_8f3a ingest ok > retrieve ok > rag ...`); when idle it reads `press ⌘K to jump anywhere`. The loop stops on first pointer or key input. Drop pointer parallax. Borrows Heron's numbered-log voice as static text (a preloader would be off-contract). Net CPU falls.

**A4. One command surface with a `>` shell. Global.** Upgrade the existing cmdk palette: pages (Systems, Projects), keywords (`cv`, `mail`, `rag`), "Run trace S-01", "Vitals", "Open terminal". `>` switches the list to a mini shell: `help ls cat open trace vitals mail clear`, a virtual filesystem built from `data.ts`, history in sessionStorage. No header button; it lives in the lazy palette chunk. Borrows asimon.blog's a11y spec and demotion lesson, terminal.shop's dry voice. Cap at 8 commands.

**A5. Case-study template. Work pages.** Title-block header (year, role, stack, links, status), sticky section index, one architecture drawing per project in FlowGraph vocabulary, three mono "choice / why / cost" rows, full-width Next row that reuses the Work row. Projects with no URL show `status: not public` instead of nothing.

**A6. Row-to-page view transition.** Name the row title and index `view-transition-name`; the H1 inherits it. The site uses `BrowserRouter` (declarative), where `Link viewTransition` is unavailable, so use a ~10-line helper: feature-detect, `document.startViewTransition(() => flushSync(() => navigate(to)))`, skipped under reduced motion. Cheaper than `layoutId` across a lazy route.

**A7. Contact as drawing title block. Contact and footer.** The bus rail ends in a square cap on a bordered grid of real fields. Static `Mumbai (IST)`; drop the ticking clock (the skill lists locale strips as a tell).

**A8. Dimension-line headers and rail read-head. All sections.** Replace label plus hairline with a dimension line: end ticks, label inline, line draws scaleX on enter. A fixed 6px lime square sits in the left gutter at the same 45% line the active-section trigger uses; markers and Log ticks ignite as they scroll past. It replaces TracingBeam and the desktop progress line; nothing scrubs.

**A9. Blueprint hover preview. Work.** The row hover shows that project's 240x150 architecture, not a screenshot, so rows without images still reward hover. Needs owner-confirmed topologies.

**A10. Vitals, measured here.** Terminal and palette command printing LCP, transfer size and request count from `PerformanceObserver` in the visitor's tab, labelled `measured in this tab`. Ship only if the numbers are good.

**A11. Micro-interactions.** `translate-y-px` press on every button; square Copy with a stroke-drawn tick; magnetic Copy (8px, pointer fine, per MOTION-PLAN); Work row title shifts 8px with a 2px lime rule drawing; skip-to-content link; marker pings once when it activates.

## 3. Wireframes (1440, with 375 notes)

**W1. Systems row with trace run (A1, A2)**
```
S-04 Conversational assistant                       [ run request > ]  replay
+--------------------------+ +---------------------------------------------+
| 2-line summary           | | [client]-question->[resolve]->[lookup]->[rag]|
| # SSE streaming API   <--+-+-hover: node+edges lit, others 30%            |
| # Document retrieval     | |    ^                                   |      |
| # Chart-ready answers    | | [stream]<-----------[answer]<----------+  (o) |
| FastAPI . React . ...    | +---------------------------------------------+
+--------------------------+  trace req_8f3a        relative time ------->
                              resolve  ##
                              lookup     ###
                              rag           ######
                              answer              ####
                              stream                  #####
                              simulated trace . illustrative timings
```
375: no diagram; the stage list gets a `run` button, the packet walks the rail, bars sit inline per stage.

**W2. Palette and shell (A4)**
```
+----------------------------------------------------------+
| > _                                                  esc |
+----------------------------------------------------------+
| NAVIGATE  Systems >   Work >   Log   Stack   Contact     |
| RUN       Trace S-01   Trace S-04   (simulated)          |
| ACTIONS   Copy email   Mail   GitHub   LinkedIn          |
| SITE      Vitals   Open terminal                         |
+----------------------------------------------------------+
| up/down move . enter select . right open . bksp back     |
shell:  $ ls systems        S-01 S-02 S-03 S-04 S-05
        $ trace S-04        resolve ## lookup ### ... (simulated)
```
375: full-width sheet from the top, 16px gutter, same list; `>` via the on-screen shell item.

**W3. Case-study header (A5, A6)**
```
< all work                                   01/03   next: Blog Platform >
BLOG PLATFORM        (title morphs from the Work row)
+---------+--------------------+-------------------------+----------------+
| 2024    | Full-stack, sole   | Hono Workers React      | LIVE >  SOURCE >|
| YEAR    | ROLE               | Prisma PostgreSQL STACK | STATUS public   |
+---------+--------------------+-------------------------+----------------+
| 01 Overview | prose, 65ch                                                |
| 02 Build *  | +--- architecture drawing (owner-confirmed topology) ---+  |
| 03 Choices  | | [React]->[Hono @ Workers]->[Prisma]->[PostgreSQL]      |  |
| 04 Outcome  | choice | why | cost   (3 mono rows, owner input)         |
| (sticky)    |                                                            |
| NEXT  02  Blog Platform  2024                                        >   |
```
375: title block stacks to two columns; the index becomes a horizontal mono strip, no sticky.

**W4. Contact title block (A7)**
```
|  [05] |-- CONTACT ------------------------------------------------|
|  Building something with agents or data? Let's talk.
|  +-----------------------+------------------+----------------------+
|  | ENGINEER Harshal Lade | BASE Mumbai, IST | STATUS (o) open to   |
|  |                       |                  | AI/data roles        |
|  +-----------------------+------------------+----------------------+
|  | EMAIL  harshal@...  (large mono)              [ copy ]          |
|  +-----------------------+------------------+----------------------+
|  | GITHUB >              | LINKEDIN >       | TOP ^                |
|  +-----------------------+------------------+----------------------+
[]  rail terminates in a square cap at the block's left edge
```
375: one column, email stays `break-all`, copy full width.

## 4. New sections (owner input flagged)

- **Case-study content** (needs input): per project, the real topology, 2-3 decisions with trade-offs, outcome only if true. Thumbnail AI and Resume Roaster have no URL or images.
- **Notes** (optional, needs input): 3-4 one-line engineering opinions he writes himself (leerob.com "Notes" pattern, which I did not open). Skip if he has none.
- **`/llms.txt`** generated from `data.ts` (cheap proof from Jesper Landberg's pattern; unopened by me). No Writing, Now or Playground sections: the shell and trace run are the playground.

## 5. Ranking (impact on a hiring manager vs cost)

1. A1 + A2 Trace run and node linking: high, medium effort, ~2 KB.
2. A3 Hero named request: high, small, saves CPU.
3. A5 Case-study template: high, large (content-bound), 0 KB.
4. A4 Palette plus shell: medium-high, medium, ~3 KB lazy.
5. A7 Contact title block: medium, small.
6. A6 View transition: medium, small, ~0.5 KB.
7. A8 Dimension headers and read-head: medium, small.
8. A11 Micro-interactions plus the shape pass (squares everywhere): medium, small, clears the contract debt.

## 6. Cut or avoid

Pinned or morphing single-scene Systems (pinning is banned; five geometries do not morph); hero word and pointer parallax; DeepSeek's `build 3.1` footer joke (the skill bans version footers); a fake terminal typed in the hero; marquees; count-up "ms" precision; sound and WebGL; a live GitHub graph unless genuinely active; testimonials without real names; scramble or glitch text.

## 7. Risks

- **Honesty.** Unitless bars, always captioned. Highlight-to-node mapping uses existing strings only. Topologies for case studies need his sign-off. Keep stage names generic. `data.ts` has `[personal email redacted]` but the brief says `harshal@harshallade.site`: confirm.
- **Performance.** Every loop gated by IntersectionObserver and `document.hidden`. View transitions snapshot two bitmaps: skip on mobile and reduced motion. Shell, trace and vitals code stay in lazy chunks.
- **Accessibility.** Run is a button with status text; waterfall has a text alternative; shell uses dialog, live region, focus return; hover info must also fire on focus; reduced motion shows the finished waterfall.
- **Generic risk.** Dimension lines and title blocks tip into blueprint kitsch if decorative: each must carry data. Do not run waterfalls on all five rows.
