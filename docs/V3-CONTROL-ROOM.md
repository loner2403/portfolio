# V3 — "Control Room" design contract

Branch `feat/v3` (worktree `portfolio-v3/`, based on `feat/redesign-perf`). Owner-approved 2026-10-04.
Replaces the Rauno/Nikola redesign (left untouched on `feat/rauno-stage`) and the old dark/cyan site.

**Concept.** The portfolio reads like the observability view of the agent and data systems Harshal ships.
Proof first: real systems, real numbers from the résumé, a live-looking (clearly labelled *simulated*) agent trace.
Audience: founders / hiring managers at AI startups. They decide in ~40 seconds.

**Hard rules**
- Content source of truth: `src/lib/data.ts` (from the 2026 résumé). Never invent metrics, clients, or results.
- The hero trace is illustrative. Its footer must say `simulated trace · illustrative timings`.
- One accent colour (signal lime) used sparingly: primary CTA, live dots, active beam, focus ring, one underline.
- No particles, preloader, custom cursor, scroll-jacking, aurora/meteor/beam backgrounds, gradient text, glassmorphism.
- Respect `prefers-reduced-motion` everywhere (`<MotionConfig reducedMotion="user">` + CSS + canvas gates).
- Mobile first: no horizontal scroll at 375px; 16px side gutter.

## V3.1 addendum — "Dataflow" (owner-approved 2026-10-09, supersedes conflicting text below)

Full design: `docs/design-room/DESIGN-FINAL.md`. Owner chose the **flowing** variant: Bézier edges plus constant edge flow.
- Hero = SVG architecture topology of the Bull AI systems (replaces DotGrid and TracePanel). Page-wide **bus rail** in the left gutter connects section markers.
- Retired: DotGrid, TracePanel card, AnimatedBeam, SpotlightCard, TracingBeam. Teal token is not used.
- Lime = data in transit only (packets, active node, live dots, focus ring, CTA).
- Motion allowlist: `transform`, `opacity`, `pathLength`, `stroke-dashoffset`, `offset-path`. Max 3 movers per viewport. Every loop is IntersectionObserver-gated and stops on `document.hidden`. Scroll drives only the Log dot.
- Beam ban now means decorative beams/backgrounds only. Flowing lines that carry labels are content.
- Shape: squares / 2px radii, no pill buttons, badges or chips.
- Mobile keeps a simplified diagram (5-node vertical spine). No horizontal scroll at 375px.

## 1. Tokens (Tailwind v4 `@theme` in `src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0E1210` | page |
| `--color-panel` | `#141916` | cards, trace panel |
| `--color-panel-2` | `#1A201C` | hover / inset |
| `--color-line` | `#26302A` | hairlines, borders |
| `--color-ink` | `#EDE9DF` | primary text |
| `--color-muted` | `#8E968F` | secondary text |
| `--color-faint` | `#5A625C` | tertiary / index numbers |
| `--color-signal` | `#C6FF3D` | THE accent |
| `--color-signal-ink` | `#0E1210` | text on signal |
| `--color-teal` | `#4FB8A8` | secondary diagram lines only |
| `--font-sans` | `"Space Grotesk Variable", system-ui, sans-serif` | display + body |
| `--font-mono` | `"JetBrains Mono Variable", ui-monospace, monospace` | labels, metrics, chips, code |

Fonts self-hosted via `@fontsource-variable/space-grotesk` and `@fontsource-variable/jetbrains-mono` (no Google Fonts link).

Type scale: display `clamp(2.6rem, 6vw, 5.5rem)` / line-height .95 / tracking -0.035em, weight 500.
H2 `clamp(2rem, 4vw, 3.25rem)` tracking -0.03em. Body 16–18px / 1.6. Label: mono 12px uppercase tracking .08em, `muted`.

Layout: container `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10`. Sections `py-24 md:py-32`, separated by `border-t border-line`.
Section header pattern: mono label row `[01] SYSTEMS` + hairline that fills the row, then the H2.
Radius: 12px cards, 999px pills. Shadows: none (borders only). Focus: 2px signal outline, offset 2px.

## 2. Page map

`/` home: Header → Hero → Metrics → Systems → Work → Log → Stack → Contact → Footer
`/projects/:slug` project detail (same shell) · `*` 404 · ⌘K command palette on every route.

### Header (`data-testid="site-header"`)
Sticky, `bg/80` + `backdrop-blur-sm` + bottom hairline once scrolled. Left: mono wordmark `harshal.lade` + signal dot + `available` (if `GENERAL_INFO.available`).
Centre/right: links `systems · work · log · stack · contact` (mono 13px, hash links to section ids; on non-home routes they go to `/#id`).
Right: `⌘K` button (`data-testid="cmdk-trigger"`, shows `Ctrl K` on non-Mac). Mobile (<768px): wordmark + ⌘K + menu button → full-width sheet with the links.

### Hero (`id="top"`, `data-testid="hero"`)
Two columns on ≥1024px (7/5), stacked on mobile (text first).
- Label: `SOFTWARE ENGINEER · AI & DATA PLATFORMS · MUMBAI`
- H1: **I build the agent & data systems behind equity research.** — "agent & data systems" gets a 2px signal underline.
- Lead (muted): `GENERAL_INFO.heroLead`.
- CTAs: `View systems →` (signal filled, `#systems`) and `Résumé ↗` (outline, opens `GENERAL_INFO.resumeUrl` in new tab).
- Background: React Bits **DotGrid**, very low contrast (dots `#1F2722`, active `#C6FF3D` at low proximity), only behind the hero, lazy-loaded, not rendered when reduced motion is set (static CSS dot pattern instead).
- Right column: **TracePanel** (`data-testid="trace-panel"`): card with header `trace · research-agent` + pill `● streaming`.
  Nodes (vertical, mono): `request` → `resolve_company` → `retrieve · qdrant` → `reason · gemini` → `validate · schema` → `stream · sse`.
  Connected with Magic UI **AnimatedBeam** (base line `line`, moving gradient in signal→teal). Nodes light up in sequence (~600ms each), each shows a ticking latency in `ms`, then loop every ~8s.
  Footer row (mono 11px faint): `simulated trace · illustrative timings`. Reduced motion → static, all nodes lit.

### Metrics (`data-testid="metrics"`)
Four cells in a bordered row (2×2 on mobile), Magic UI **NumberTicker** counting once when in view:
`15+` full-stack apps shipped · `30%` data-processing time cut (BNP Paribas) · `500+` daily users served · `5` AI & data systems in production at Bull AI.

### Systems (`id="systems"`) — `[01] SYSTEMS` / H2 "Systems in production" / sub "Bull AI · Sep 2025 → now · proprietary, so architecture over screenshots."
Bento grid (`data-testid="system-card"` ×5) built from `SYSTEMS` in data.ts; React Bits **SpotlightCard** hover (spotlight colour `rgba(198,255,61,.08)`).
Card anatomy: mono index `S-01`, title, one-sentence summary, `stages` rendered as a mono pipeline `retrieve → parse → …` (if present), `highlights` as bullet list (max 4), `stack` as mono chips.
Grid: ≥1024px 6 columns: S-01 spans 4, S-02 spans 2, S-03 2, S-04 2, S-05 2. Single column on mobile.

### Work (`id="work"`) — `[02] WORK` / H2 "Selected work"
Index rows (`data-testid="work-row"`, one per PROJECTS item), full-width, hairline separated:
`01` · title · short description (1 line, truncate) · tech (first 3, mono) · year · `↗`. Whole row links to `/projects/:slug`.
Hover (pointer devices): row background `panel`, arrow nudges, and if `thumbnail` is non-empty a 240px preview card fades in at the right side. No thumbnail → no preview.

### Log (`id="log"`) — `[03] LOG` / H2 "Experience log"
`MY_EXPERIENCE` as a timeline with Aceternity **TracingBeam** on ≥768px (plain left border on mobile).
Entry (`data-testid="log-entry"`): mono line `2025-09 → now` (derive from `duration`) + company + `current` pill, title, points as bullet list, skills chips.
Under Scale AI add the note line (muted): "Evaluation work: judging and correcting LLM-written code for RLHF/SFT."

### Stack (`id="stack"`) — `[04] STACK` / H2 "Tools I reach for"
`RESUME_SKILL_GROUPS` as a 4-column table (1 column mobile): group label in mono, items as chips. No logos.

### Contact (`id="contact"`) — `[05] CONTACT`
H2: **Building something with agents or data? Let's talk.**
Email in large mono with a `Copy` button (`data-testid="copy-email"`, toast/inline "copied" for 2s), plus links: GitHub, LinkedIn, Résumé. Availability line.

### Footer
Hairline top. `© 2026 Harshal Lade` · `Mumbai HH:MM IST` (Asia/Kolkata, updates each minute) · `Built with React, Vite, Tailwind`.

### Project detail (`data-testid="project-detail"`)
Back link `← all work`, mono label `PROJECT · {year}`, H1 title, role, stack chips, `Live ↗` / `Source ↗` buttons when URLs exist,
description rendered with `html-react-parser` inside a prose block styled with the tokens, image gallery (bordered, lazy) when images exist.
Unknown slug → the 404 view.

### 404 (`data-testid="not-found"`)
Mono `404 · node not found in graph` + link home.

### Command palette (`data-testid="command-palette"`)
`cmdk` in a dialog. Opens with ⌘K / Ctrl+K and the header button; Esc closes. Groups:
Navigate (Systems, Work, Log, Stack, Contact → scroll / route to `/#id`), Projects (each → `/projects/:slug`),
Actions (Copy email, Open résumé, GitHub, LinkedIn). Mono, panel background, signal highlight for the active item.

## 3. Libraries (owner-approved)
Magic UI (AnimatedBeam, NumberTicker), React Bits (DotGrid, SpotlightCard), Motion Primitives (optional TextMorph), Aceternity (TracingBeam only).
Installed as source via the shadcn CLI into `src/components/ui/`, adapted for Vite (no `next/*`). Animation runtime: `motion` (`motion/react`).
Not used: Aceternity backgrounds, Meteors, Aurora, particle/ballpit/WebGL backgrounds, globe.
