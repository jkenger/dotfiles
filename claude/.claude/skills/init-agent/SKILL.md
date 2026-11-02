---
name: init-agent
description: Create, audit or restructure a project's agent instructions (CLAUDE.md, AGENTS.md, .claude/rules, .claude/settings.json). Use when starting a project's agent setup, when one of those files is being edited or has grown long, or when an agent keeps ignoring a project rule.
---

# Init agent instructions

Goal: a fresh session in this repo can be told "run the tests" and succeed first try, and loads only the rules for the files it touches.

## Steps

1. **Survey.** List every `CLAUDE.md`, `AGENTS.md`, `.claude/rules/*.md` and `.claude/settings.json` in the repo (skip `node_modules`). Note line counts, which files import others (`@AGENTS.md`), and which agents read them: AGENTS.md is shared with Codex and other tools, `.claude/rules` and settings are Claude Code only. Done when every instruction file and its readers are listed.

2. **Prove the commands.** Read `package.json` (or the build file), the README setup section and `.env.example`. Run the test and check commands from a clean state. Done when every command the file will list has actually run, and each failure is either fixed or flagged as its own task with the real cause (a line-ending or stale generated file counts).

3. **Sort every rule** into one home, using the table below. Done when each existing line has a home or is cut.

4. **Write.** Root file first, then rule files, then settings. Done when every check in "Before finishing" passes.

5. **Report** what moved where, what was cut, and what still fails.

## Where each rule lives

| The rule | Home |
|---|---|
| Setup, build, test commands; repo map; cross-cutting boundaries | root `CLAUDE.md` / `AGENTS.md` |
| Applies only to some folders (a module, the schema, UI) | `.claude/rules/<area>.md` with `paths:` |
| Applies to one package of a monorepo and to everything in it | that package's own `CLAUDE.md` / `AGENTS.md` |
| Domain-specific but must stay always-loaded | root file, inside `<important if="...">` |
| The harness can enforce it (permissions, attribution, model, env file access) | `.claude/settings.json` |
| Already stated by a config file, script name or `--help` | nowhere; leave it to the environment |
| Background a rule needs but only sometimes | a doc, named by a one-line pointer |

## Root file

- Under 200 lines; aim near 60.
- Opens with one line on what the project is, then a numbered setup from a fresh clone, then the verify commands, then the map.
- One line per area rule file, so agents that never load `.claude/rules` still reach it: `` `database.md`: schema, migrations, hosted migrations. ``
- When CLAUDE.md and AGENTS.md both exist, one holds the content and the other is the single line `@AGENTS.md`.

## Rule files

```markdown
---
paths:
  - "apps/web/drizzle/**"
  - "apps/web/src/lib/schema.ts"
---

# Database and migrations

- ...
```

- Name by area, not by tool. One area per file.
- Globs cover every folder the area spans: routes, API routes, components, packages, content.
- A file without `paths:` loads every session; give it one unless it truly applies everywhere.

## `<important if>`

```markdown
<important if="you are changing sign-in, sessions, or anything that writes to external systems">
- ...
</important>
```

The condition names the situation in the words a task would use. Wrap only rules that stay in an always-loaded file; a `paths:` rule file is already conditional.

## Settings

Move anything enforceable out of prose. Common cases:

- Credentials: deny `Read(**/.env)`, `Read(**/.env.local)`, `Read(**/.env.*.local)`.
- Attribution: `attribution.commit` / `attribution.pr` instead of "never add Co-Authored-By".
- Commands that must never run: `permissions.deny` on the Bash pattern.

## Writing each line

- State the target behavior. "Generated files change only through `lab:generate`" beats "never hand-edit generated files". Keep a prohibition only for a hard guardrail, paired with what to do instead.
- One meaning in one place. A rule in a rule file is not repeated in the root.
- Cut lines the model already obeys by default, and lines a one-command lookup answers.
- Keep reasons that no file confesses: the gotcha, the owner decision, why a migration must be backward compatible.
- Leave tool-generated blocks alone (for example the Next.js block between `BEGIN:nextjs-agent-rules` markers, which `next dev` rewrites).

## Half-finished migrations

While surveying, look for two patterns doing one job (an ORM beside raw queries, two styling systems, old and new router). The model may copy the wrong one. Finish the migration if it is small; otherwise flag it as its own task and name the current pattern in the matching rule file.

## Before finishing

- Root file under 200 lines; each rule file has `paths:`.
- Every command in the root file ran in step 2, or its failure is reported.
- Every original rule is in exactly one home, or was cut on purpose.
- Every rule file is named from AGENTS.md when AGENTS.md is shared with other agents.
- The project's own voice rules hold (for example, no em dashes).
