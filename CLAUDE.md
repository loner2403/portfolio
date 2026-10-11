# CLAUDE.md

@AGENTS.md

Everything shared (stack, contract, hard rules, design loop, skill table) is in `AGENTS.md`. This file only adds what is specific to Claude Code.

## Skill routing

Invoke these with the Skill tool, not from memory:

- Visual redesign or "this looks slop": `redesign-existing-projects` first, then `design-taste-frontend`.
- New hero or major section: `image-to-code` if an image tool exists, else `design-taste-frontend`.
- Before saying a UI chunk is done: `web-design-guidelines` on the changed files, then `agent-browser` screenshots at 375 / 768 / 1440 and a clean `errors` output.
- gstack stages (`design-review`, `qa-only`, `review`) still apply for verification; their auto-fix is routed through an implementer per the global workflow.

## Rules that override skill defaults

- `docs/V3-CONTROL-ROOM.md` beats every skill. If `design-taste-frontend` or `image-to-code` proposes gradients, glassmorphism, particles, extra accent colours or invented stats, drop that part.
- Global orchestration still applies: as a flagship you brief and verify; implementers write production code. Quote the skill rules into the brief.
- Skill folders under `.claude/skills/` are vendored copies. Do not edit them; override behaviour in `AGENTS.md` instead.
- `agent-browser` keeps a background Chrome daemon: run `agent-browser close --all` when done, and never leave a dev server running.
- Use `agent-browser snapshot -i`, not the full snapshot, unless you need static text.
- Memory: the active rebuild is this worktree, branch `feat/v3`. Earlier redesigns were rejected.
