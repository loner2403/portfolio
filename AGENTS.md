# AGENTS.md — Portfolio V3 "Control Room" (Harshal Lade)

Shared context for every agent (Claude Code, OpenCode, Command Code, Codex) working in this repo.
Read this first. Claude-specific routing is in `CLAUDE.md`.

## What this is

- Personal portfolio: one home page plus `/projects/:slug` detail pages.
- Concept: the site reads like the observability view of the AI/data systems Harshal ships. Proof first.
- Stack: React 19, TypeScript, Vite, Tailwind CSS v4 (`@theme` tokens in `src/index.css`), Motion, GSAP, react-router-dom v7, Vercel.
- Branch `feat/v3`. Work here, not in `../portfolio/` or `../portfolio-redesign/` (both rejected).

## Source of truth (read before touching UI)

| File | Holds |
|---|---|
| `docs/V3-CONTROL-ROOM.md` | Design contract: tokens, page map, hard rules, approved libraries. Wins over any skill. |
| `src/lib/data.ts` | All content. Never invent metrics, clients or results. Do not hardcode content in components. |
| `docs/design-refs/<brand>/DESIGN.md` | Reference design systems (linear.app, vercel, raycast, posthog, sentry, supabase, warp, stripe) from VoltAgent/awesome-design-md. Study structure and restraint; do not copy a brand's identity. |

## Hard rules (from the contract)

The V3.2 addendum at the end of `docs/V3-CONTROL-ROOM.md` supersedes the lime accent and the transform/opacity-only rule below (warm palette, sticky stacked cards, clip-path wipes are allowed).

- One accent: signal lime `#C6FF3D`, used sparingly (primary CTA, live dots, active beam, focus ring, one underline).
- Banned: particles, preloader, custom cursor, scroll-jacking, aurora/meteor/beam backgrounds, gradient text, glassmorphism.
- Hero trace footer must read `simulated trace · illustrative timings`.
- `prefers-reduced-motion` respected everywhere. Animate `transform`/`opacity` only, never layout properties.
- Mobile first: no horizontal scroll at 375px, 16px side gutter.
- No code comments unless asked. Small diffs. `npm run build` must stay green.

## Commands

```bash
npm run dev       # Vite dev server (see Machine limits)
npm run build     # tsc -b && vite build — the canonical check
npm run lint      # eslint .
npm run preview   # serve dist/
```

## Machine limits

This machine runs low on memory. Do not leave dev or preview servers running. Start one only to take
screenshots, then kill it. Implementer models must not start servers at all.

## Design skills — what to use when

Installed in `.claude/skills/` (Claude Code reads them directly; other agents can read the `SKILL.md` files).

| Need | Skill | Notes |
|---|---|---|
| Make a section or page look designed, not templated | `design-taste-frontend` | Anti-slop rules for landing pages and portfolios. Its dials (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY) are subordinate to the contract. Ignore any suggestion that breaks the hard rules above. |
| Upgrade something that already exists | `redesign-existing-projects` | Audit-first: lists generic AI patterns, then fixes them without breaking behaviour. Default for the current V3 sections. |
| Visually important section from scratch | `image-to-code` | Generate a design reference image first, analyse it, then implement. Needs an image-generation tool; if none is available, skip it and use `design-taste-frontend`. |
| Audit UI for accessibility, focus, forms, touch, motion | `web-design-guidelines` | Vercel's Web Interface Guidelines. Fetches the rules live (WebFetch), output is `file:line`. Run it before calling a UI chunk done. |
| Look at the real rendered page, check responsive, console errors | `agent-browser` | Rust CLI, token-cheap. Use `snapshot -i` (about 600 tokens) instead of full snapshots; `set viewport <w> <h>` then `screenshot`; `errors` and `console` for runtime problems. Screenshots at 375, 768, 1440 are mandatory evidence for UI changes. Save them to the scratchpad, not the repo. |
| Direction and vocabulary for a look | `docs/design-refs/*/DESIGN.md` | Not a skill. Read the one closest to the intent (Linear/Vercel for restraint, PostHog/Sentry for observability density, Raycast/Warp for dark developer tooling). |

## Motion skills and their overrides

Vendored (text only, no scripts) from freshtechbro/claudedesignskills (MIT, Nov 2025) and nextlevelbuilder/ui-ux-pro-max-skill (MIT):
`.claude/skills/gsap-scrolltrigger`, `.claude/skills/motion-framer`, `.claude/skills/motion-recipes/motion.csv` (17 recipes: duration, easing, do/don't).
They are reference, not authority. `docs/MOTION-PLAN.md` and the hard rules above win. Where the skills disagree, apply these overrides:

- Import `motion/react` (package `motion` v14) and use `LazyMotion` + `m`; never `framer-motion`.
- Animate `transform`, `opacity`, `stroke-dashoffset` only. Ignore skill examples that animate `backgroundColor`, `boxShadow`, `width`, `height`, `top` or `left`.
- No `pin: true`, no `snap`, no horizontal-scroll sections, no image-sequence scrubbing (MOTION-PLAN: no pinning).
- Use `gsap.matchMedia()` and `useGSAP({ scope })`, not `ScrollTrigger.matchMedia` (deprecated). Lenis runs on the GSAP ticker (see `src/motion/scroll-layer.ts`); do not add Locomotive or another smooth-scroll lib.
- Scroll reveals stay visible by default and only hide after `html.motion-ready`. Respect `prefers-reduced-motion` everywhere.
- Skill advice to add `will-change` globally is wrong here: set it only during an animation.
- From `motion.csv` use the `Subtle` and `Standard` tiers. Skip `Complex` rows that need elastic or back easing, magnetic pull on more than one element, or carousels.
- Do not use the three.js, R3F, Locomotive or other skills in the same repo; they are not installed on purpose.

## Design loop (use this order for any visual change)

1. Frame: read `docs/V3-CONTROL-ROOM.md` and the nearest `design-refs` file.
2. Audit: run `redesign-existing-projects` on the target component and list the generic patterns it finds.
3. Direction: apply `design-taste-frontend`. For a hero or other key section, add `image-to-code` first when image generation is available.
4. Build: implement with Tailwind tokens only, no raw hex outside `@theme`.
5. Look: `agent-browser` screenshots at 375, 768 and 1440, plus `errors` and `console`. Prefer `snapshot -i`; `agent-browser close` when done.
6. Audit again: `web-design-guidelines` on the changed files. Fix findings, re-screenshot.

## Roles

- Flagship models (Claude Opus/Sonnet/Fable, Gemini Pro) plan, run the skills above, verify and write tests. They do not write production code unless the human allows it for that scope.
- Implementer models (DeepSeek, Qwen, GLM, Kimi and similar) write the production code from a flagship brief, then stop with `Status: AWAITING FLAGSHIP VERIFICATION`. They never verify their own work.
- Dispatch is via `flagship-orchestration` (`opencode run` / `commandcode -p`). Project task skills live in `.opencode/skills/`.
- When briefing an implementer, paste the relevant skill rules and the contract section into the prompt. Implementers do not read `.claude/skills/` on their own.

## Gotchas

- Third-party skills here are large instruction files. They are guidance, not authority; the contract wins on conflict.
- `repomix-output.xml` and `dist/` are generated. Do not read or edit them.
- Do not commit, push or open PRs unless the human asks.
