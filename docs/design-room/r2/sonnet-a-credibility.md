# R2 brainstorm A: credibility and profile (Sonnet)

Design read: developer portfolio for founders and hiring managers at AI/data startups, dark observability language, Linear/Vercel/Sentry restraint. Dials 6 / 4 / 4. The contract beats the skills where they conflict.

## 0. Verified, and corrected

Opened and confirmed: emilkowal.ski (Today / Previously line; projects with one-line pitch and live link), leerob.com (Default / Long bio toggle; Notes list), rauno.me/craft (title, month year, "View Production" per row), linear.app/method (numbered principles, one page each), trigger.dev (quotes link to full stories; 16.5k stars, Apache 2.0; dated changelog), inngest.com ("No fancy animations here-just the facts"), temporal.io (quotes carry name, title, company), jesperlandberg.com (links /llms.txt), nownownow.com/about, amityadav.tech.

Corrections to the research files: Mercury's headline numbers (300K+, $20B+/mo, 4.9) carry no footnote; markers sit on rate and cashback claims and resolve to a disclaimers block. Temporal's rows are five and unnumbered. Cerebrium's bars state no method and name no competitor: a warning, not a model. The GitHub post never discusses empty graphs. Not opened, not relied on: Heron, Giga, Terms, OceanX, NRG, Mygom, Unseen, Bruno Simon, terminal.shop.

## 1. Audit, and what changes

Hygiene first (owner input):
- Email: `data.ts` has gmail; the brief says harshal@harshallade.site.
- The first Log role is `current` (a "now" pill) while Contact says "open to roles". If it ended, the pill is false.
- Employer names sit in the Log and the BNP Paribas metric label while Systems promises generic. Add nothing employer-internal.
- Resume Roaster repeats `cold-email-gen.png` four times. Thumbnail AI has no image or link, yet github.com/loner2403 pins a `thumbnailAI` repo (confirm it is public and intended).
- `GENERAL_INFO.about` and `resumeUrl` are never rendered. The sharpest sentence ("evaluation harnesses with prompt-schema contract tests") is unused.
- Em-dashes in rendered strings (Log title, project roles, page title); the skill bans them.

| Section | Strong | Weak for the 40-second test | Change |
|---|---|---|---|
| Hero | Specific H1, original diagram, honest "simulated" label | Availability lives only in a header dot; eyebrow is a category, not a status | A1 |
| Metrics | Real, résumé-sourced | 3 of 4 numbers are intern or freelance, no provenance; the AI number counts the diagrams | A2 |
| Systems | Honest disclaimer | Five equal rows before any shipped product; claims, no reasoning, nothing verifiable | A3 to A5 |
| Work | Clean index rows | 1 of 3 has a live link; no scope or proof per row | A6 |
| Log | Clear chronology | Résumé paragraphs; five bullets to learn one thing | one outcome sentence per role, bullets in `<details>` |
| Stack | No logos, honest | 40 equal chips | A7 |
| Contact | Email plus copy | No terms, no next step | A8 |

## 2. Generic but true: six rules

1. Be specific about reasoning, not facts: the failure mode, the guard, the test. Never the client or domain.
2. Every sentence traces to a `data.ts` field. Keep a claim ledger in the PR, not on the page.
3. Label the abstraction beside every diagram: "Reference architecture, generalised. No employer data."
4. Show limits ("what I would change"). They read as seniority.
5. No number unless measured and sourced; use countable structure from the diagram data.
6. Prefer artifacts he owns. His pinned repos are all TypeScript front-end work, so the AI-platform claim is currently unverifiable (A5).

## 3. Additions

**A1. Today line and Long bio (Hero).** The eyebrow becomes one status line; H1, lead and the CTA pair stay. Contact intent gets one label, "Email me", in hero, header and Contact (not "Get in touch" plus "Let's talk"). `GENERAL_INFO.about` renders under the Receipts strip behind a Default / Long toggle. Borrows Emil's Today line and leerob.com's toggle; drops "Previously" because employers stay generic.

**A2. Receipts (Metrics).** Same four cells, each with a mono provenance line in `muted` (not `faint`, roughly 3:1 contrast). Cell one, "5 systems", jumps to Systems. Borrows Mercury's marker-to-source mechanic and Trigger.dev's linked stats; sources here are the résumé, labelled self-reported.

**A3. Rules I ship by (Systems header).** Five one-line rules, each ending in its system, then one featured row, one full row, three compact rows. Each maps to an existing highlight: schema-validated outputs (S-01), contract tests, cached steps, repeatable runs, evaluation harnesses (S-02), recoverable checkpoints (S-03). The owner words them and drops any he does not hold. Borrows Linear Method and leerob Notes; five lines, not a page each.

**A4. Design notes, S-02 (route `/systems/s-02`).** Reuses `FlowGraph`; stage hover shows input, output, guard. No new dependency. Borrows Temporal's one idea per row, Inngest's facts register and Trigger.dev's quote-to-story link; the story is reasoning, not a customer.

**A5. Reference repo and Source links.** A small public repo reproducing the S-02 pattern on synthetic documents: schema validation, cached stages, contract tests, a tiny eval script. Highest credibility per byte; costs owner time, no JS. Add `sourceCode` to Thumbnail AI.

**A6. Work rows carry proof.** Title, one-line pitch, scope ("sole developer"), then `live` and `source` where they exist; fix or drop the repeated image. Borrows Emil's project index. A second dated tier needs the owner's own list; do not invent it.

**A7. Stack as usage index.** Chips grouped by where they appear, computed from `SYSTEMS[].stack` and `PROJECTS[].techStack` (Python: S-01, S-02, S-03, S-05). Unused skills collapse to one muted "also" line. No new claims.

**A8. Work with me (Contact).** A facts table, not prose, in Inngest's register. The footer IST clock becomes the "overlap" fact (the skill bans decorative locale strips; a working-hours fact is functional).

**A9. Notes (optional).** Dated index rows like rauno.me/craft. Ship only with three real notes; one entry is negative proof. Candidate topics, each traceable to his résumé and each needing his draft: contract tests for prompts and schemas; caching stage outputs; checkpointing a polling service; what judging LLM-written code for RLHF taught me about building evals.

**A10. Cheap extras.** `/llms.txt` with the same generic wording. A build-time `last public push` line, hidden if older than 90 days. A /now line only if he will update it monthly; stale is worse than absent.

## 4. Wireframes

**W1. Hero and Receipts (A1, A2), 1440**
```
+--------------------------------------------------------------------------+
| harshal.lade  (dot) available             systems work log notes stack   |
| Software engineer, AI and data platforms. Open to startup roles. Mumbai. |
| I build the AGENT & DATA SYSTEMS behind AI products.                     |
| INDEX S-01..S-05            | [ simulated architecture sheet ......... ] |
| lead, 20 words max          | [ .................................... ] |
| [View systems ->]  Email me |                                            |
+---------------+---------------+---------------+--------------------------+
| 5             | 30%           | 500+          | 15+                      |
| AI/data systems| processing   | daily users   | full-stack apps          |
| jump to S-01  | time cut      | same project  | freelance, 2024-25       |
| resume, 2026  | internship2024| internship2024| self-reported            |
+---------------+---------------+---------------+--------------------------+
| Bio: two sentences.                                           [Long +]   |
```
375: eyebrow wraps to two lines at most; cells 2x2; one "Sources: résumé 2026, self-reported" line under the grid.

**W2. Systems header (A3), 1440**
```
SYSTEMS    Systems I've built
Reference architectures, generalised. No employer data.
RULES I SHIP BY
 Validate model output against a schema.                    S-01
 Test prompts and schemas like APIs, with contract tests.   S-02
 Cache each stage so every run is repeatable.               S-02
 Checkpoint ingestion so a failure resumes, not restarts.   S-03
 Evaluate with a harness, not by eye.                       S-02
---------------------------------------------------------------------
S-02 featured | [full diagram, 8 cols]       | Read the design notes ->
S-01          | [full diagram]
S-03 Data ingestion      ingest > transform > checkpoint > load    [+]
S-04 Conversational assistant   resolve > ... > stream            [+]
S-05 Batch analysis jobs        schedule > ... > store             [+]
```
375: S-id on its own line above each rule; compact rows are `<details>` with the diagram inside, painted only when opened.

**W3. Design notes page (A4), 1440**
```
<- all systems                                          Email me
S-02  Document extraction pipeline
Reference architecture, generalised. No employer data.
+--------------------+---------------------------------------------+
| ON THIS PAGE (nav) | Problem class (3 lines)                     |
|  problem           | Pipeline [FlowGraph; hover a stage:         |
|  stage contracts   |           in / out / guard / cached]        |
|  decisions         | Stage contracts (real <table>)              |
|  failure modes     |  stage   in -> out      guard      cached   |
|  verification      | Decisions (3): decision / why / cost        |
|  what I'd change   | Failure modes handled                       |
|  reference repo    | Verified by: contract tests, eval harness   |
|                    | What I would change                         |
|                    | [Reference repo ->]  [Email me]             |
+--------------------+---------------------------------------------+
```
375: nav becomes a native `<select>` jump; the table becomes stacked key/value pairs. Cells are drafted from stage names; the owner confirms every one.

**W4. Contact with Work with me (A8), 1440**
```
CONTACT   Building something with agents or data?
+------------------------------------+---------------------------------+
| harshal@harshallade.site   [Copy]  | WORK WITH ME                    |
| [Email me]  GitHub  LinkedIn       | Status     open to roles        |
| Resume: owner decision             | Start      [owner: date/notice] |
|                                    | Location   Mumbai, IST          |
| Put in the email:                  | Remote     [owner]              |
|  the problem in two lines          | Overlap    [owner: hours, US/EU]|
|  team size and stage               | Best fit   [owner: 1-2 roles]   |
|  the stack                         | References on request [owner]   |
+------------------------------------+---------------------------------+
```
375: single column, table first, email second.

## 5. Ranking (hiring-manager impact vs cost)

| # | Item | Impact | Cost |
|---|---|---|---|
| 1 | A8 Work with me | High | No JS; owner facts |
| 2 | A2 Receipts provenance | High | Trivial |
| 3 | A1 Today line, Long bio | High | Trivial |
| 4 | A5 Reference repo | Highest | Owner time; 0 JS |
| 5 | A4 Design notes S-02 | Very high | Low JS, medium content |
| 6 | A3 Rules, compact rows | High | Trivial |
| 7 | A6 Work proof rows | Medium-high | Trivial plus assets |
| 8 | A7 Stack usage index | Medium | Trivial |

## 6. Cut or avoid

- Testimonials and quote walls (none exist; Temporal's format needs real named people), employer logo wall, awards tally.
- GitHub contribution graph: pinned repos are front-end, so it signals the wrong stack (my judgement, not the cited post's).
- Benchmark bars, uptime counters, a "years of experience" headline.
- Calendar embeds (third-party JS). A plain link at most.
- Résumé PDF unless it matches the generic policy; otherwise "résumé on request".
- Uses page (duplicates Stack), WebGL, sound, terminal as navigation.

## 7. Risks

- Honesty: rules or stage tables he does not hold; "reference architecture" misread as employer design (keep the label beside every diagram); a stale "now" pill. Blank owner-input cells are hidden, never guessed.
- Performance: all additions are static; A4 reuses `FlowGraph` on a route; the GitHub fetch runs at build and fails soft.
- Accessibility: real `<table>` and `<details>`; `aria-expanded` on Long; provenance in `muted`; reduced motion unchanged.
- Looking generic: a 4-up stat row and numbered labels per section are templated tells. The contract keeps `[01]` labels, so new sections add no sub-eyebrows. Keep diagrams on screen in A3 and A4 so text does not take over. Notes stays hidden until it has three entries.
