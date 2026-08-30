# Portfolio Redesign — Plan & Wireframes

Branch: `feat/redesign-perf`. Target: **refine the current identity** (dark + neon-cyan +
Anton) into a cleaner, systematic design system. Structure stays **sectioned home page +
per-project detail pages**.

Goals:
- Look intentional and cohesive (consistent tokens, spacing, type scale, motion).
- Fast: small initial JS, non-blocking assets, 60fps animations, `prefers-reduced-motion`.
- Content lives in `src/lib/data.ts` only (kill hardcoded data in components).

---

## 1. Design system

### Colors (Tailwind v4 `@theme` tokens)
| Token | Value | Use |
|---|---|---|
| `--color-background` | `#0b0d13` | page base (deep) |
| `--color-surface` | `#12151f` | cards/surfaces |
| `--color-border` | `#262a3a` | hairline borders |
| `--color-foreground` | `#e7e9ee` | body text |
| `--color-muted-foreground` | `#9aa0ac` | secondary text |
| `--color-primary` | `#22d3ee` | accent (cyan) |
| `--color-primary-foreground` | `#0b0d13` | text on primary |
| `--color-accent` | `#8b5cf6` | secondary accent (violet) |

Keep the existing dark-cyan feel; tighten it into a token system. Define ONLY tokens the
code uses (no dead names).

### Typography
- Display: **Anton** (uppercase, tight leading) — hero, section titles, project titles.
- Body: **Roboto** (sans). Numbers/labels: **Roboto Mono** (add one mono face for stats / tags).

### Spacing & layout
- Uniform horizontal gutter: `px-6 md:px-10` and a centered `max-w-6xl` (or 7xl) container.
- Section rhythm: `py-24 md:py-32`. Consistent `section` container component.

### Motion
- Reveal-on-scroll via GSAP ScrollTrigger: `opacity + y` (or transform), once, ~0.6–0.9s.
- Never animate layout (`top/left/width/height`); use `transform` + `opacity`.
- Gate all heavy/tween animations behind `prefers-reduced-motion` and fine-pointer checks.

---

## 2. Sitemap

```
/                    Home (sections, ordered below)
            ├─ hero
            ├─ ticker (marquee)
            ├─ about
            ├─ stack (skills)
            ├─ selected-projects
            ├─ experience (timeline)
            ├─ recognition (testimonials / stats)
            └─ contact + footer
/projects/:slug      Project detail
**                  /404-ish (not-found fallback)
```
Navbar + Footer mount on all pages. Preloader + ParticleBackground + MagneticCursor are
global but performance-gated.

---

## 3. Home page wireframes

### 3.1 Navbar
```
┌──────────────────────────────────────────────────────────────┐
│  HARSHAL·L                          [≡]   (fixed, top-right) │
└──────────────────────────────────────────────────────────────┘
   Overlay (opens from right, full-height, ~500px):
   ┌──────────────────────────────┐
   │  MENU          SOCIAL         │
   │  Home           GitHub        │
   │  About          LinkedIn      │
   │  Projects       Mail          │
   │  Experience                   │
   │  Contact                      │
   └──────────────────────────────┘
```
- Fixed top bar, index + wordmark left, hamburger right.
- Menu = slide-in panel (already built in `Navbar`). Keep, but constrain to menu/social/contact.

### 3.2 Hero
```
┌──────────────────────────────────────────────────────────────┐
│                    (particle/gradient bg)                     │
│                                                               │
│  FULL-STACK ██████████ (huge Anton, cyan)                      │
│  DEVELOPER   ██████████ (huge Anton, white)                    │
│                                                               │
│  Hi! I'm Harshal. I build fast, accessible web systems for    │
│  real users — 1.5+ yrs across enterprise + product work.      │
│                                                               │
│  [ Hire Me (neon) ]   [ View Work (ghost) ]                    │
│                                                               │
│  ┌─────────┬─────────┬─────────┐                              │
│  │ 1.5+ Yrs│ 12+ Proj│ 4k+ Hrs │   (stat chips, mono type)   │
│  └─────────┴─────────┴─────────┘                              │
│                                                               │
│                    ↓ scroll                                   │
└──────────────────────────────────────────────────────────────┘
```
- Full viewport (`min-h-svh`). Two-line display headline. Short value prop. Two CTAs.
- 3 stat counters — **move the hardcoded stats into `data.ts`**.
- Keep subtle animated gradient + particles (already perf-capped).

### 3.3 Ticker / marquee (extra flair — NEW)
```
┌──────────────────────────────────────────────────────────────┐
│  React / TS / Node / Next / GSAP / Prisma /  AWS / ...  ➝     │
│  ◄ React / TS / Node / Next / GSAP / Prisma / AWS ...         │
└──────────────────────────────────────────────────────────────┘
```
- A single-row, infinitely-scrolling mixed-content strip (`transform` only, pause on
  reduced-motion). Driven by `MY_STACK` icons + names.

### 3.4 About
```
┌──────────────────────────────────────────────────────────────┐
│  ┌─────────────┐   ABOUT / WHO I AM                           │
│  │             │   ┌──────────────────────────────────────┐ │
│  │   photo /   │   │ Full-stack dev, 1.5+ yrs. Blend of    │ │
│  │   portrait  │   │ frontend craft + solid backend.       │ │
│  │   (rounded) │   │ Performance, a11y, responsive.        │ │
│  │             │   └──────────────────────────────────────┘ │
│  └─────────────┘   [ ↓ Resume (neon) ]                        │
└──────────────────────────────────────────────────────────────┘
```
- Two-column: portrait (left) + bio (right). Resume CTA. Content from `data.ts`.

### 3.5 Stack / skills
```
┌──────────────────────────────────────────────────────────────┐
│  MY STACK                                                     │
│  FRONTEND                          BACKEND                    │
│  ▢▢▢▢▢▢▢▢  React  Next  TS  Tailwind│ ▢▢  Node  Express  Spring │
│  DATABASE                          TOOLS                      │
│  ▢▢▢  Postgres  Prisma  Mongo      │ ▢▢  Git  Docker  AWS      │
└──────────────────────────────────────────────────────────────┘
```
- Grouped 2×2 grid of logo chips, grouped by category from `MY_STACK`. Keep hover lift.

### 3.6 Selected projects
```
┌──────────────────────────────────────────────────────────────┐
│  SELECTED PROJECTS                                            │
│  01  MUSIC PORTFOLIO                    /React · TS · GSAP ➝ │
│  02  BLOGGING PLATFORM                  /React · Hono · Prisma│
│  03  RESUME ROASTER                     /Next · Postgres · GPT│
│                                                   ┌──────────┐│
│                               (floating preview │ img │)   ││
│                                                   └──────────┘│
└──────────────────────────────────────────────────────────────┘
```
- Editorial index list (existing `ProjectList`). Each row: index, big title (hover → follow
  preview image + tech stack reveal). Row click → `/projects/:slug`.

### 3.7 Experience / timeline
```
┌──────────────────────────────────────────────────────────────┐
│  WORK EXPERIENCE                                              │
│  │                                                           │
│  ●──  LLM Trainer — Scale AI              May 2025 → Now     │
│  │     Fine-tuned LLM pipelines ... [tags]                   │
│  ●──  Full Stack (Freelance)               Aug 2024 → Now     │
│  │     React · Prisma · Postgres ... [tags]                  │
│  ●──  Tech Architect Intern — BNP Paribas Jan 2024 → Jul 2024│
│        Spring Boot · React · Camunda ... [tags]              │
└──────────────────────────────────────────────────────────────┘
```
- Vertical timeline. **Source of truth = one `MY_EXPERIENCE` entry[] in `data.ts`** that
  includes role/company/period/location/bullets/tech. Remove the hardcoded arrays in
  `AboutMe` and delete the orphaned `Experiences.tsx` (or repurpose). Interactive highlight
  on hover/focus. Collapse on mobile to stacked cards.

### 3.8 Recognition (testimonials / stats — extra flair, optional)
```
┌──────────────────────────────────────────────────────────────┐
│  WHAT PEOPLE SAY            or   │ 12+ projects  │ 3 employers│
│  ┌────────────┐ ┌────────────┐   │ 4k+ hrs      │ ...        │
│  │ "quote…"   │ │ "quote…"   │   └──────────────┘            │
│  │ — name, role││ — name, role│                              │
│  └────────────┘ └────────────┘                               │
└──────────────────────────────────────────────────────────────┘
```
- Either a testimonial band or a GitHub-style stats row — pick one, driven by `data.ts`.

### 3.9 Contact + Footer
```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐ │
│  │  HAVE A PROJECT IN MIND?                                │ │
│  │  har...@gmail.com  →  (huge Anton email link)           │ │
│  │  [ Hire Me ]                                            │ │
│  └────────────────────────────────────────────────────────┘ │
│  github · linkedin · mail                                  │
│  © 2026 Harshal Lade · All rights reserved                 │
└──────────────────────────────────────────────────────────────┘
```
- Big CTA block + email (existing `Footer`, id="contact") + social links + copyright.

---

## 4. Project detail page (route `/projects/:slug`)

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back                                                  (→) │
│  MUSIC PORTFOLIO     (huge Anton)      [GitHub] [Live]        │
│  ──────────────────────────────────────────────────────────── │
│  Year            2025                      (sticky meta:     │
│  Tech & Technique  React · TS · GSAP        title + links    │
│  Description      ……  (rich HTML)          fades on scroll ) │
│  My Role          ……                     │                    │
│  ┌────────────────────────────────────┐  │                    │
│  │   project image (16:9, parallax)   │  │                    │
│  └────────────────────────────────────┘  │                    │
│  ┌────────────────────────────────────┐  │                    │
│  │   project image (parallax)         │  │                    │
│  └────────────────────────────────────┘  │                    │
└──────────────────────────────────────────────────────────────┘
```
- Uses the existing `ProjectDetails` structure: back link, title, GitHub/Live links, meta
  columns, and full-width parallax images (`containerRef` + `#info`/`#images` ScrollTriggers).
- Keep, but (a) font/type scale consistent, (b) lazy-load images, (c) add a not-found fallback,
  (d) sticky in-view meta column already present — tidy.

---

## 5. Shared / global

| Piece | Plan |
|---|---|
| `ScrollProgressIndicator` | keep top bar progress (thin, `transform`). |
| `Preloader` | remove fake delay; either skip or a ~600ms branded reveal with reduced-motion-off. Content-page gate: only on first visit. |
| `ParticleBackground` | keep (perf-capped). |
| `MagneticCursor` | keep on desktop only (`pointer:fine` + no reduced-motion); simplify to ref-based, drop `elementFromPoint` poll. |
| `TransitionLink` | keep page-transition wrapper. |
| `SectionTitle` / `SectionFlower` | tick up to new type scale; standardize. |
| `Template` / `Button` | `Button` variants already exist — keep; remove the dead `gsap` fallback object at the bottom of `Button.tsx`. |

---

## 6. Data refactor (`src/lib/data.ts`)

Move ALL content to data (per AGENTS.md convention):
- `GENERAL_INFO`, `SOCIAL_LINKS` (add more socials if desired).
- `MY_STACK` (add icons already present; add a `ticker` list).
- `PROJECTS` — normalize; keep for detail pages. Consider adding a `featured` flag.
- `MY_EXPERIENCE` → single source with `role/company/period/location/bullets/tech` (merge
  the BNP + Freelance + Scale AI entries currently hardcoded in `AboutMe`).
- NEW: `HERO_STATS` (3 counters + suffix), `TESTIMONIALS` (or `GITHUB_STATS`), `TICKER_ITEMS`.
- `AboutMe` (bio paragraph) + all copy → `data.ts`.

---

## 7. Build order (incremental, each keeps `npm run build` green)

1. **design-system-foundation** (skill) — enable Tailwind, define `@theme` tokens, correct
   type/colors, delete dead `tailwind.config.js` keys + `App.css`. PREREQUISITE — site is
   unstyled until here.
2. **Data layer** — move AboutMe/Banner copy + stats + experience into `data.ts`; single
   `MY_EXPERIENCE`; add `TESTIMONIALS`/ticker. Replace hardcoded arrays.
3. **Type & spacing pass** — apply the token/type scale across sections (Navbar, Hero,
   SectionTitle, Project, Footer). Standardize container + section rhythm.
4. **New sections** — Ticker/marquee (`Marquee.tsx`), Recognition/testimonials
   (`Recognition.tsx`). Wire into home route.
5. **Project detail polish** — type scale, lazy images, not-found fallback, sticky meta tidy.
6. **Animation guardrails** — reduced-motion + fine-pointer gates across Banner/About/Skills/
   ProjectList/Preloader/MagneticCursor.
7. **Perf follow-ups (from `perf-load-pass`)** — home route-split, MagneticCursor refactor,
   asset optimization (Akash*.png → webp), drop `react-icons` dep, fix lint.
8. **Accessibility & polish** — aria labels, focus states, contrast, SEO meta, og image.

Each numbered task = a `general` subagent run + lead verification (`npm run build`, review
diff, confirm no dead classes/data).

---

## 8. Acceptance criteria (whole redesign)

- Tailwind compiles; tokens resolve; no dead utilities.
- All content from `data.ts`; no hardcoded arrays in components.
- Initial JS ≤ ~900 kB min (`index` shell), CSS ≥ real Tailwind output, fonts from
  `index.html` only, `prefers-reduced-motion` respected everywhere.
- Sections match the wireframes above (desktop + mobile).
- `npm run build` and `npm run lint` (after pre-existing lint fixes) pass.
