# Claude Android Kit — idea → production for Kotlin + Jetpack Compose

A reusable, **app-idea-agnostic** Claude Code setup: 7 subagents + 6 skills that take
any Android app idea from planning through Google Play release. Drop it into any project
and feed it your idea — nothing here is hardcoded to a single domain.

Verified June 2026. Versions live in the `android-tech-stack` skill; re-verify per project.

## Install

Copy the `.claude/` folder into the root of your project (or your home dir for global use):

```
your-project/
└── .claude/
    ├── agents/   # 7 subagent definitions (.md with YAML frontmatter)
    └── skills/   # 5 skills (each a folder with SKILL.md)
```

- **Agents** live in `.claude/agents/*.md`. Claude Code auto-discovers them; invoke
  explicitly ("use the android-architect") or let Claude delegate via the Task tool
  based on each agent's `description`.
- **Skills** live in `.claude/skills/<name>/SKILL.md`. They load progressively — only the
  `name`+`description` sit in context until a task matches, then the body loads. Agents
  reference them by name (e.g. "Load android-tech-stack").
- Restart/launch Claude Code in the project so it picks up the new files. Run `/agents`
  to confirm the subagents are registered.

## The 7 agents (the lifecycle chain)

| Step | Agent | Produces | Hands off to |
|---|---|---|---|
| 1 Planning | `android-planner` | `docs/planning/PRD.md`, `backlog.md` | architect |
| 2 Architecture | `android-architect` | `docs/architecture/ARCHITECTURE.md` + build skeleton | ui-builder, implementer |
| 3 UI | `android-ui-builder` | M3 theme, components, stateless screens, `ui-contract-*.md` | implementer |
| 4 Implementation | `android-implementer` | ViewModels, data/domain, DI, navigation | tester |
| 5 Testing | `android-tester` | test suite + `docs/testing/*-test-report.md` | reviewer |
| 6 Review | `android-reviewer` | `docs/review/*-review.md` + verdict | releaser OR back to implementer |
| 7 Release | `android-releaser` | `docs/release/RELEASE_CHECKLIST.md`, release notes, GO/NO-GO | human |

Handoffs are **file-based**: each agent reads the prior agent's docs from `docs/` and
writes its own. That keeps each subagent's context clean (subagents have isolated context
windows) and gives you reviewable artifacts at every stage. The reviewer can loop back to
the implementer; the releaser can loop back on a NO-GO.

### Suggested driving prompts

```
Use android-planner: here's my app idea — <one paragraph>.
Use android-architect to design from docs/planning/PRD.md.
Use android-ui-builder for the <feature> screens.
Use android-implementer to wire up <feature>.
Use android-tester for <feature>.
Use android-reviewer on <feature>.
Use android-releaser to prepare the Play submission.
```

Add human review gates after Planning, Architecture, and Review — those are the cheapest
places to catch a wrong direction.

## The 6 skills (shared knowledge, loaded on demand)

| Skill | What it governs |
|---|---|
| `android-tech-stack` | Pinned library/tooling/Play version matrix — single source of truth |
| `android-architecture-conventions` | MVVM+UDF, Clean layering, modularization, Hilt, state, errors |
| `compose-m3-conventions` | Material 3 + Compose *mechanics*, accessibility, adaptive (+ review CHECKLIST) |
| `mobile-ui-aesthetics` | Visual *craft* — color, typography, icons, components, graphics, motion (6 reference catalogs) |
| `android-testing-strategy` | Test pyramid, Turbine/MockK/Compose/Robolectric/Paparazzi/Maestro |
| `android-security-release-checklist` | Secure storage/network/obfuscation + Play release gate |

Multiple agents share these, so conventions stay consistent across the lifecycle and you
update a rule in exactly one place.

## Customizing
- **Change versions:** edit `android-tech-stack/SKILL.md` only — every agent reads it.
- **Change architecture defaults** (e.g. adopt KMP → Koin/Ktop): edit
  `android-architecture-conventions/SKILL.md` and note the deviation in the tech-stack skill.
- **Tighten any agent:** edit its `.md` body; keep the `description` accurate since that's
  what drives automatic delegation.

## Porting to Google AI Studio

There's no agents/skills filesystem in AI Studio, so map each agent to a **saved prompt /
system instruction** and paste the relevant skill text inline:

- Create one saved prompt per agent. Put the agent's prompt body in **System instructions**.
- Append the bodies of the skills that agent "loads" (e.g. for the architect: paste
  `android-architecture-conventions` + `android-tech-stack`) into the system instructions,
  since there's no progressive disclosure.
- Run them in sequence, pasting the previous step's output doc (PRD, ARCHITECTURE, etc.) as
  the user message — that reproduces the file-based handoff manually.
- Use a capable Gemini model with a large context window so the inlined skills + prior
  artifacts fit. Turn on the code execution / tools where the agent needs to build or search.

The agent `.md` files and skill `SKILL.md` files are plain markdown, so each is directly
copy-pasteable into an AI Studio system-instruction box.
