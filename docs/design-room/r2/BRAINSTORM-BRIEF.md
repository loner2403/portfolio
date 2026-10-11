# Brainstorm brief — round 2 additions and wireframes

DESIGN ONLY. Edit nothing outside `docs/design-room/r2/`. Do not run npm, dev servers, builds or deploys. Do not write production code. You may fetch web pages to verify claims.

## Goal
The owner likes the current site ("looks cool and smooth") but wants it to stand out more and to represent his profile better. Decide **what to add, in which sections, as wireframes**, using award-site inspiration. Be concrete and opinionated; generic advice is a failure.

## The audience and the test
Founders and hiring managers at AI/data startups who decide in about 40 seconds. Harshal Lade: software engineer, AI and data platforms, Mumbai. Profile facts you may rely on (from his own site): builds LLM agent workflows, retrieval-augmented generation, multi-stage extraction pipelines, scheduled data-ingestion services, a conversational assistant with streaming responses, batch analysis jobs; earlier roles include LLM training/evaluation work, freelance full-stack delivery (15+ apps) and a bank internship; projects Thumbnail AI, Blog Platform, Resume Roaster. Hard limits: never invent metrics, clients, awards, testimonials, dates or employers; former-employer details are deliberately generic and must stay generic; no résumé download is on the site right now; email is harshal@harshallade.site.

## Constraints that still hold (the owner may relax a rule only with a stated reason)
One accent colour, lime #C6FF3D, on near-black; Space Grotesk plus JetBrains Mono; no particles, preloader, custom cursor, scroll-jacking, gradient text or glassmorphism; animate transform/opacity/stroke only; reduced motion static; mobile first (375px); low-memory machine, so no heavy always-on WebGL; JS budget matters (the motion layer is already ~57 KB gzipped, lazy-loaded).

## Read first
1. `docs/design-room/r2/research-mimo.md` and `research-deepseek.md`: leads gathered by cheaper models. Treat them as **unverified**; open at least the items you rely on. If a file is missing or empty, say so and do your own research.
2. `docs/V3-CONTROL-ROOM.md` (V3.1 addendum on top), `docs/design-room/DESIGN-FINAL.md`, `docs/MOTION-PLAN.md`.
3. `AGENTS.md` and `CLAUDE.md` at the repo root of portfolio-v3, and apply the installed skills' rules by reading `.claude/skills/design-taste-frontend/SKILL.md` and `.claude/skills/redesign-existing-projects/SKILL.md` (anti-slop checks, audit-first).
4. Current components in `src/components/home/` and `src/lib/data.ts`, so your audit reflects what is really there.

## What to produce (one file; at most ~1,800 words)
1. **Honest audit** of the current site: per section, what is strong, what is still generic, what is missing for the 40-second test.
2. **Additions**: for each, name, section, why it helps this profile, which award-site pattern inspired it (cite the URL you opened), and an **ASCII wireframe** (1440 layout plus a 375 note) for the 3 or 4 biggest ones.
3. **New sections** worth adding (for example Writing, Principles, Now, Playground, Case study), with the content the owner would need to supply (flag anything that needs his input; do not fabricate it).
4. **Ranking**: impact on a hiring manager versus cost (JS weight, memory, implementation effort), top 8 ordered.
5. **Cut or avoid**: things that look impressive but break the constraints or the profile.
6. **Risks**: honesty, performance, accessibility, and what could make the page look generic.
Name real references and say what you borrow and what you change.
