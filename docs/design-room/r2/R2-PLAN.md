# R2 plan: merged decision (Opus, senior design review)

Inputs: BRAINSTORM-BRIEF, sonnet-a-credibility (A), sonnet-b-craft (B), research-mimo, research-deepseek, contract, DESIGN-FINAL, MOTION-PLAN, `src/components/home/*`, `src/lib/data.ts`. I re-opened these pages myself: trigger.dev (Play / Replay / Full screen under "How it works"), leerob.com (Default / Long toggle, Notes), W3C WAI complex-images tutorial, cognitect.com ADR post (Title, Context, Decision, Status, Consequences), simonwillison.net (dated feed, TIL items), eugeneyan.com (dated `21 Jun 2026` writing list, "Selected Prototypes"), ogp.me (og:image and og:url are required).

## (a) Verdict

1. A is right about what fails the 40-second test: an unclear status, metrics with no sources, and no proof a reader can check. B is right about what makes the site memorable: a diagram that answers a question when you touch it.
2. Merge rule: A decides what the page says, and B decides how the Systems diagrams behave. Anything that adds motion without adding information is cut.
3. Hero: A's status line, plus B's calming of the motion: one named request instead of seven packet trains, and no pointer parallax. The owner's choice of flowing edges stays.
4. Metrics: A's provenance lines. Drop the count-up, which B rightly calls the most common portfolio trope.
5. Systems: B's highlight-to-node linking and a user-paced "run request" on S-01 and S-04, with **no timing bars**: unitless bars are still pseudo-data. Drop A's collapsed `<details>` rows, because they hide the strongest section.
6. Contact: B's title-block form carrying A's "work with me" facts. Owner-supplied cells only; a blank cell is hidden, never guessed.
7. Deep page: one "spec page" template built on ADR fields, used first for S-02 and later for projects. A's design notes and B's case-study template become one build.
8. Cut B's shell, Vitals, dimension lines and read-head, and blueprint hover previews. Cut A's GitHub "last push" line.
9. What both missed: link previews are blank (`index.html` has no `og:image` and no `og:url`, two of the four required Open Graph tags), the diagrams have no text alternative, the phone number ships in the JS bundle, and `/My_Resume.pdf` is publicly served although the site "has no résumé".
10. Do the hygiene and shape-debt pass first. A square, consistent, correct page beats any new feature.

## (b) Final additions, ranked

| # | Section | What | Reference | Effort | Perf cost |
|---|---|---|---|---|---|
| 1 | Hero + Metrics | Status line, one contact label ("Email me"), Default/Long bio rendering `GENERAL_INFO.about`; metrics static with a mono source line in `muted` | emilkowal.ski Today line, leerob.com toggle, Mercury marker-to-source | S | ~0 KB, removes NumberTicker |
| 2 | Systems | Highlight-to-node linking: hovering or focusing a bullet lights its node and edges, others dim to 30% | Already in FlowGraph (`interactive`, `activeId`); DESIGN-FINAL hover rule | S | ~0.3 KB |
| 3 | Systems | "Run request" button on S-01 and S-04 only: one lime packet walks the real `stages`, nodes light in order, a mono step log prints `plan ok > retrieve ok ...`. Replay link, no autoplay, no durations | trigger.dev Play / Replay | M | ~2 KB, user-triggered, 1 mover |
| 4 | Systems | Text alternative per diagram: `<figure role="group">` with a visible "read as text" disclosure listing stages, stores and guards | W3C WAI complex images (figure plus figcaption long description) | S | 0 |
| 5 | Hero | One named request `req_8f3a` walks the topology every ~7 s and stops on the first pointer or key input; drop `--px/--py` parallax; idle strip reads `press ⌘K to jump`. Keeps the low-contrast edge flow | B's audit; contract "max 3 movers" | S | Net CPU saving |
| 6 | Contact + Footer | Title block: email, copy, links, facts table (status, location, remote, start, overlap). Static "Mumbai, IST (UTC+5:30)"; remove the ticking clock | inngest.com "just the facts" register; DESIGN-FINAL rail cap | S | Removes a 60 s interval |
| 7 | Share | `og:image` (1200x630 still of the hero topology, lime on near-black), `og:url`, `og:image:alt`, a lime square-node favicon replacing the white Lucide glyph | ogp.me | S | 0 runtime |
| 8 | `/systems/s-02` | Spec page: title block, sticky index, FlowGraph, stage contract `<table>`, three ADR rows (Context / Decision / Consequences), "What I'd change" | cognitect ADR; Temporal one idea per row | M build, L content | Lazy route, reuses FlowGraph |
| 9 | Work | 56px titles (contract debt), rows end in `live` / `source` / `status: not public`, square preview, duplicate image fixed | emilkowal.ski project index; rauno.me/craft | S | 0 |
| 10 | Stack | Usage index computed from `SYSTEMS[].stack` and `PROJECTS[].techStack`; unused skills fold into one muted "also" line | A7 | S | 0 |
| 11 | Work to project | View transition on the row title, feature-detected, skipped under reduced motion and below 768px | web.dev same-document view transitions (B verified) | S | ~0.5 KB |
| 12 | Root | `/llms.txt` generated from the same generic wording | jesperlandberg.com (A verified) | XS | 0 |
| Gated | Notes | TIL-sized dated notes, not essays; ship only with three real ones | simonwillison.net TILs; eugeneyan.com dated list | Owner | 0 |
| Gated | Reference repo | Public repo reproducing the S-02 pattern on synthetic documents; a Source link appears only once it exists | eugeneyan.com "Selected Prototypes" | Owner | 0 |

### W1. Hero + Receipts (1, 5), 1440
```
| harshal.lade (o) available        systems work log stack contact   [⌘K] |
| SOFTWARE ENGINEER, AI & DATA PLATFORMS. [owner status]. MUMBAI.         |
| I build the agent & data systems behind AI products.                    |
| INDEX S-01..S-05          | +-- topology sheet, flowing edges ----------+ |
| lead (20 words)           | |  one packet: req_8f3a  S-03>store>S-01>.. | |
| [View systems ->] Email me| |  simulated trace · illustrative timings   | |
|                           | +-------------------------------------------+ |
|                           |  press ⌘K to jump anywhere                    |
+--------------+--------------+--------------+-----------------------------+
| 5            | 30%          | 500+         | 15+                         |
| systems built| processing   | daily users  | full-stack apps             |
| see S-01 ->  | internship 24| internship 24| freelance 24-25             |
+--------------+--------------+--------------+-----------------------------+
| Two-sentence bio.                                     [Default | Long]  |
```
375: status line wraps to two lines at most; the 5-node spine keeps its single packet; metrics 2x2 with source lines; the toggle sits under the grid at full width.

### W2. Systems row (2, 3, 4), 1440
```
S-04  Conversational assistant                    [ run request > ]  replay
+---------------------------+  +-----------------------------------------+
| summary, 2 lines          |  | [client]->[resolve]->[lookup]->[rag]    |
| > SSE streaming API  <----+--+-- hover/focus: node + edges lit, 30% dim |
| > Document retrieval      |  | [stream]<-------------[answer]<---+     |
| > Chart-ready answers     |  +-----------------------------------------+
| FastAPI · React · ...     |  req_8f3a  resolve ok > lookup ok > rag ok ..
|                           |  simulated run · no timings shown
|                           |  [+] read as text
```
375: no SVG. The stage rail is the diagram; "run request" walks a square down the rail and appends "ok" per stage; "read as text" stays.

### W3. Contact title block (6), 1440
```
[05] CONTACT
Building something with agents or data?
+----------------------+----------------------+-------------------------+
| ENGINEER             | BASE                 | STATUS                  |
| Harshal Lade         | Mumbai, IST UTC+5:30 | (o) [owner]             |
+----------------------+----------------------+-------------------------+
| EMAIL  [owner-confirmed address]  (large mono)            [ Copy ]    |
+----------------------+----------------------+-------------------------+
| REMOTE [owner]       | START [owner]        | OVERLAP [owner]         |
+----------------------+----------------------+-------------------------+
| GitHub ->            | LinkedIn ->          | Top ^                   |
[] rail ends in a square cap at the block's left edge
```
375: one column; the email breaks anywhere; Copy is full width; facts come before links.

### W4. Spec page `/systems/s-02` (8), 1440
```
<- all systems                                              Email me
S-02  Document extraction pipeline
Reference architecture, generalised. No employer data.
+---------+---------------+--------------------------+---------------+
| ROLE    | STAGES 5      | STACK Python LangGraph   | SOURCE [repo  |
| [owner] | retrieve..val | Pydantic PostgreSQL      |  or "private"]|
+---------+---------------+--------------------------+---------------+
| 01 Problem   | 3 lines, problem class only                          |
| 02 Pipeline* | [FlowGraph, interactive]                             |
| 03 Contracts | stage | in -> out | guard | cached   (<table>)        |
| 04 Decisions | context / decision / consequences  x3                |
| 05 Verified  | contract tests, evaluation harness                   |
| 06 Change    | what I would do differently                          |
```
375: the title block becomes two columns, the index becomes a horizontal mono strip (not sticky), and the table becomes stacked key/value pairs.

## (c) Build order (chunks of 3 files or fewer, for implementers)

Each chunk gets screenshots at 375, 768 and 1440 with reduced motion both on and off, plus a check that the console is clean. Before C0 the flagship confirms the owner answers to Q1 to Q8 below.

- **C0 Data hygiene.** Files: `data.ts`, `index.html`. Apply the owner-confirmed email; remove `phone`; replace em dashes in `role`, the project roles and `<title>`; de-duplicate the Resume Roaster images. Pass: Contact and the palette show the confirmed address; searching the built JS for the phone digits finds nothing; no "—" appears in the tab title.
- **C1 Shape debt.** Files: `Log.tsx`, `Contact.tsx`, `Work.tsx`. No `rounded-full` or `rounded-xl`, no Lucide icons, TracingBeam replaced by a plain left hairline (the Log dot stays with MOTION-PLAN chunk 4). Pass: no pill shapes on the page; Log reads correctly at 375.
- **C2 Hero status + CTA.** Files: `Hero.tsx`, `data.ts` (`heroStatus`), `SiteHeader.tsx`. Pass: the eyebrow shows the status; every contact CTA reads "Email me".
- **C3 Receipts + bio.** Files: `data.ts` (`source` per stat), `Metrics.tsx`, `Hero.tsx`. Pass: numbers render final on first paint; each cell has a source line; cell 1 jumps to `#system-S-01`; the toggle has `aria-pressed` and does not shift layout.
- **C4 Highlight linking.** Files: `architectures.ts` (map highlights to node ids), `Systems.tsx`, `SystemArchitecture.tsx`. Pass: tabbing to a bullet lights its node; on hover the other nodes drop to 30% opacity.
- **C5 Text alternative.** Files: `SystemArchitecture.tsx`. Pass: "read as text" opens an ordered stage list; each SVG has a short label that points to it.
- **C6 Run request.** Files: new `RunRequest.tsx`, `Systems.tsx`, `index.css`. Pass: no motion until clicked; under reduced motion the final lit state and the full log appear instantly; status text is announced through `aria-live`; only S-01 and S-04 have the button.
- **C7 Hero calm-down** (owner approval Q13). Files: `HeroSheet.tsx`, `hero-graph.ts`, `index.css`. Pass: at most 3 moving elements in view; the loop stops after the first pointer or key input; the sheet does not shift under the cursor.
- **C8 Contact block + footer.** Files: `Contact.tsx`, `SiteFooter.tsx`, `data.ts`. Pass: an empty fact hides its cell; no interval runs in the footer.
- **C9 Work proof.** Files: `Work.tsx`, `ProjectPage.tsx`. Pass: titles about 56px at 1440; every row shows live, source or `status: not public`.
- **C10 Share.** Files: `index.html`, `public/og.png`, `public/favicon.svg`. Pass: an Open Graph debugger shows the card; the tab shows a lime square.
- **C11 Stack index.** Files: `Stack.tsx`, `format.ts`. Pass: each group lists the S-ids and projects that use it.
- **C12 View transition.** Files: new `lib/navigate.ts`, `Work.tsx`, `ProjectPage.tsx`. Pass: the title morphs in Chrome; Firefox below 144, reduced motion and phone widths navigate instantly.
- **C13 Spec page** (after owner content). Files: new `SpecPage.tsx`, `App.tsx`, new `lib/specs.ts`. Pass: `/systems/s-02` renders; an unknown id falls back to 404; the label "generalised" appears beside the diagram.
- **C14 llms.txt.** Files: `public/llms.txt`. Pass: it is served and contains no employer details.

## (d) Cut list

- B's `>` shell: an easter egg that asimon.blog itself demoted. Keep only palette keywords (`cv`, `mail`, `rag`) and a "Run request S-04" action.
- Vitals command (little value for a hiring manager); waterfall bars, even unitless (they read as timings); dimension lines and the read-head (blueprint kitsch, and they compete with the Log dot); blueprint hover previews (they need invented topologies); collapsing S-03 to S-05 (it hides the best section).
- Count-up numbers, the ticking IST clock, magnetic Copy, the GitHub graph and "last push" line (his pinned repos are front-end, so they signal the wrong stack), testimonials, logo walls, a /now page he will not update, WebGL and sound.
- No new scroll-bound scenes. R2 adds none beyond MOTION-PLAN's three.

## (e) Owner inputs (exact questions)

1. **Email.** `data.ts` has `[personal email redacted]`; the brief says `harshal@harshallade.site`. Which goes public, and does the domain mailbox receive mail today?
2. **Current role.** The first Log role is `current: true` (the "now" pill) with "Sep 2025 - Present", and Contact says "open to roles". Is it still current? If not, what is the end month?
3. **Employer names.** The Log names Bull AI, Scale AI and BNP Paribas, and a metric label names BNP Paribas. The contract and DESIGN-FINAL still say "Bull AI topology" and "equity research". Can names appear while details stay generic? Should the metric label drop the bank's name?
4. **Overlapping dates.** Freelance and Scale AI both read "Sep 2024 - Sep 2025". Is that correct (concurrent work)?
5. **Résumé.** `/My_Resume.pdf` is publicly reachable even though nothing links to it. Keep it, replace it with a generic version and link it, or delete it?
6. **Phone.** `+91 ...` sits in `data.ts` and ships in the JS bundle although it is never shown. May I remove it?
7. **Thumbnail AI.** Is `github.com/loner2403/thumbnailAI` public and fine to link? Is there a live URL and a real screenshot?
8. **Resume Roaster.** It shows `cold-email-gen.png` four times, which looks like another project's image. Do you have real screenshots, a live link or source? Should "business owner" stay?
9. **Status line.** Give one line, for example "Open to [role type] at [stage] startups". Remote: yes or no? Start date or notice period? Hours of overlap with US or EU? Is "Mumbai or remote" in Contact true?
10. **Metric sources.** Is it acceptable to label 30% and 500+ as "internship, 2024" and 15+ as "freelance, 2024-25, self-reported"?
11. **Em dashes.** May "Software Engineer — AI & Data Platforms", the project roles and the page title use commas or colons instead?
12. **S-02 spec page.** Will you confirm or rewrite a stage contract table and three decisions that I draft from the stage names alone? What would you change?
13. **Hero motion.** You liked the flowing hero. Do you approve replacing the seven packet trains with one named request, keeping the edge flow? This also fixes the contract's 3-mover limit.
14. **Reference repo.** Will you publish a small synthetic-data repo of the S-02 pattern? A Source link appears only once it exists.
15. **Notes.** Can you write three short TIL-style notes, for example on prompt-schema contract tests, caching stage outputs, or what grading LLM-written code taught you about evals? If not, Notes stays hidden.

Shape debt (21 `rounded-full`/`rounded-xl`/Lucide uses outside `ui/`) needs no input: the contract already decides it.

## (f) Risks

- **Honesty.** A "run request" step log can read as a real trace, so caption every one "simulated run" and show no durations. A spec page drafted by an agent becomes invented reasoning unless he signs off on every row. Employer names next to "generalised" diagrams can still be read as that employer's design, so keep the label beside each diagram. A stale status line or "now" pill is worse than none.
- **Privacy.** The phone number in the bundle and the public PDF are live today, so fix them first.
- **Performance.** C7 must measurably lower CPU (compare a Performance panel recording before and after). The run request is IntersectionObserver-gated and stops on `document.hidden`. The spec route stays lazy. View transitions snapshot two bitmaps, so they are skipped on phones.
- **Accessibility.** The bio toggle and run buttons need real button semantics and live status; anything that responds to hover must also respond to focus; check `muted` provenance text against `bg` at 12px.
- **Generic risk.** Use title blocks only where they carry facts (Contact, spec page), and keep the diagrams on screen so text does not take over.
- **Scope.** Stop after C9 for an owner review before the remaining chunks.
