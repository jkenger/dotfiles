---
description: One-shot project onboarding - detect tech stack, create CLAUDE.md, hooks, and commands
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(cat:*), Bash(ls:*), Bash(jq:*), Bash(node:*), Bash(npx:*), Bash(pnpm:*), Bash(npm:*), Bash(yarn:*), Bash(bun:*), Bash(cargo:*), Bash(go:*), Bash(python:*), Bash(pip:*), Bash(git:*)
---

Project root:
!`pwd`

Existing config:
!`ls -la .claude/ 2>/dev/null || echo "No .claude directory"`
!`ls -la CLAUDE.md .claude/CLAUDE.md 2>/dev/null || echo "No CLAUDE.md found"`

Package info:
!`cat package.json 2>/dev/null | head -50 || echo "No package.json"`
!`cat Cargo.toml 2>/dev/null | head -20 || echo "No Cargo.toml"`
!`cat go.mod 2>/dev/null | head -10 || echo "No go.mod"`
!`cat pyproject.toml 2>/dev/null | head -30 || echo "No pyproject.toml"`

TypeScript config:
!`cat tsconfig.json 2>/dev/null | head -30 || echo "No tsconfig.json"`

CI config:
!`ls .github/workflows/ .forgejo/workflows/ .woodpecker/ .circleci/ .gitlab-ci.yml 2>/dev/null || echo "No CI config found"`

Set up this project for Claude Code using the global framework. Analyze the project and create all necessary configuration.

## Precondition: empty folder nested in a parent repo

Before analysis begins, check whether the project root is **both** empty
(no `package.json`/`Cargo.toml`/`go.mod`/`pyproject.toml`, no framework
files) **and** nested inside a different parent git repository — run
`git rev-parse --show-toplevel` from here; if it resolves above this folder
rather than to it, this folder has no `.git` of its own.

If both are true, stop before running any detection and ask:

> This folder is empty and sits inside `<parent repo name>`, which already
> serves its own purpose. Running a full scaffold here has nothing to
> analyze, and running it on the parent root instead would be circular.
> 1. Cancel.
> 2. Treat this folder as a new, real project.
> 3. Run `/setup` on the parent repo root instead.

Proceed with the rest of this command only after the human picks option 2,
using this folder as the project root. Skip this check entirely when the
folder has its own `.git`, already has files, or the parent directory isn't
a git repository.

## Analysis Phase

1. **Detect tech stack**: language, framework, package manager, test runner, linter, formatter, build tool. If the project's `CLAUDE.md` already has a "Planned stack" section from an earlier `/setup` run (made when the stack was only chosen, not yet scaffolded), compare it against what's actually detected now. A mismatch — something planned that isn't installed, or vice versa — gets flagged explicitly in the summary ("planned Vitest, found no test runner — was it skipped, or has the plan changed?"), never silently re-detected as if no plan had ever been made.
2. **Detect TypeScript strict config**: check for `strict`, `noUncheckedIndexedAccess`, `noImplicitAny` etc.
3. **Detect CI pipeline**: what CI system, steps, and commands run; whether stacks will use GitHub-native linking or ordinary dependent PRs; and whether required merge-queue checks handle `merge_group`
4. **Detect existing config**: check for existing CLAUDE.md, .claude/ directory, hooks, commands
5. **Check for DDD**: look for glossary files, domain directories, bounded context structure
6. **Check for hexagonal architecture**: look for ports/, adapters/, domain/ directory structure
7. **Check for 12-factor patterns**: look for Dockerfile, docker-compose.yml, Procfile, .env.example, process.env usage, PORT binding, Kubernetes manifests (k8s/, deployment.yaml)
8. **Check for shadcn/ui**: look for `components.json` at the project root. Pure detection, like the three checks above — if found, just record that the plumbing already exists in the generated `CLAUDE.md`. Never make a visual/token decision here; applying the project's actual visual system on top of it is a separate, deliberate step that happens when real UI gets built, not at `/setup` time (see `default-visual-system.md`'s "Setting this up fresh, via shadcn" section).
9. **Detect monorepo workspaces**: look for `workspaces` in package.json, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or multiple `apps/`/`packages/` directories. List each workspace found, with its own language/framework/test runner where it differs from the root.
10. **Determine deployment topology.** Skip this question when step 9 already found an existing monorepo or multiple deployables — topology is already decided by what's on disk. Otherwise ask:

    > How many independently deployable services does this need right now?
    > 1. **One app** (default — recommended unless you already know of a second deployable or a separate team owning a separate service)
    > 2. **A monorepo** with multiple apps/packages
    > 3. **Microservices** (confirm separate teams already own separate services before picking this — most projects don't need this yet)

    Default silently to option 1 when the project is greenfield with nothing on disk suggesting otherwise; don't interrupt a clear single-app setup to ask. Record the answer in the generated `CLAUDE.md`. Choosing option 3 does not scaffold anything here — each service gets its own `/setup` run later.
11. **Detect an existing `docs/` layout**: if `docs/` already exists, list its subfolders and whether each holds flat per-feature files (e.g. `docs/architecture/auth-sign-in.md`) or nested per-feature folders. Do not assume a blank slate — plenty of real projects have been writing docs for a while before `/setup` ever runs.
12. **Ask whether this project uses the global CLAUDE.md's feature lifecycle chain** (specification → design → plan → implement → verify → review → learn). If the project is small, a library, or has no interest in the chain, skip it. Otherwise, scaffold or adapt the `docs/` structure below based on what step 11 found.

## Generation Phase

Create the following, skipping any that already exist (ask before overwriting).

**Deferral rule:** any step below whose content depends on commands, files, or
installed dependencies that don't exist yet (no `package.json` or equivalent
manifest — the stack is only planned, not yet scaffolded) must defer,
explicitly and visibly. State the deferral in the summary presented to the
human; never let it pass silently. Note what's deferred in the generated
`CLAUDE.md`'s "Planned stack" section, so a later `/setup` run picks it up
once the scaffold command has actually been executed. Steps 3, 5, 6, and 7
below point back to this rule instead of repeating it.

### 1. Project CLAUDE.md (`.claude/CLAUDE.md`)

Include sections based on what was detected:
- **Project commands**: exact build, test, lint, typecheck, dev commands from package.json/Makefile
- **Tech stack**: framework, language version, key dependencies
- **TypeScript config**: note strict mode settings, especially `noUncheckedIndexedAccess` if enabled
- **Monorepo structure**: if applicable, map workspaces and their purposes, and list which workspaces got their own `CLAUDE.md` from step 2
- **CI pipeline**: CI system, pipeline steps, known environment differences from local
- **DDD glossary location**: if DDD detected, point to glossary file
- **12-factor services**: if 12-factor patterns detected, add `For 12-factor service patterns, load the \`twelve-factor\` skill.` and note the `twelve-factor-audit` agent is available for compliance audits
- **Testing**: test runner, test command, any special setup needed
- **Setup checklist**: one `- [ ]` line per deferred item from the deferral
  rule, plus any still-unresolved question from the Analysis Phase (e.g. a
  topology or docs-adoption choice the human hasn't made yet). Flip a line to
  `- [x]` on a later `/setup` run once that item is actually resolved — don't
  re-ask or re-defer something already checked off. This checklist is scoped
  to *setup* gaps only, never ordinary project maturity (no CI yet, few tests
  written) — those are normal and don't belong here. If this checklist has
  unchecked items, mention it to the human near the start of the session —
  `CLAUDE.md` loads into context every session, so this needs no separate
  mechanism to be seen.

Keep it concise and actionable — this replaces the need to run `/init`.

### 2. Per-workspace CLAUDE.md (monorepo only)

Only when Analysis step 9 found more than one workspace. Claude Code loads the
root `CLAUDE.md` plus the nearest one to whatever file it's editing, so these
compose automatically; never duplicate root content into a workspace file.

Ask which workspaces need their own `CLAUDE.md` — present the detected list
and let the user pick. A workspace needs one only when it has commands,
conventions, or boundaries that differ from the root (a different test
runner, a pattern that applies to that app only, like Server Components in
the web app but not a CLI package). Skip workspaces with nothing to add.

For each selected workspace, create `<workspace>/CLAUDE.md` holding only its
delta:
- Its own build/test/lint/typecheck commands, if different from root
- Patterns specific to that workspace
- Nothing already true repo-wide — that stays in the root file only

List the created files under the root `CLAUDE.md`'s "Monorepo structure"
section so the mapping is visible from one place.

### 3. Project hooks (`.claude/settings.json`)

Subject to the deferral rule above — there's no real typecheck command to wire
up until a manifest exists.

Generate a PostToolUse hook for typecheck after Write/Edit on .ts/.tsx files:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path // empty'); if [[ \"$FILE\" == *.ts || \"$FILE\" == *.tsx ]]; then <TYPECHECK_CMD> 2>&1 | tail -20; fi; exit 0"
          }
        ]
      }
    ]
  }
}
```

Use the actual typecheck command detected from the project (e.g., `pnpm typecheck`, `npx tsc --noEmit`, `yarn tsc --noEmit`).

### 4. Docs structure (`docs/`)

Only when step 12 of the Analysis Phase confirmed the project wants the feature
lifecycle chain.

**If step 11 found no existing `docs/` layout**, create this fresh, skipping any
folder that already exists:

```
docs/
├── product/
│   ├── product-overview.md
│   └── requirements/
├── architecture/
│   ├── system-overview.md
│   ├── database-design.md
│   └── decisions/
├── specifications/
│   └── .gitkeep
└── development/
    ├── coding-standards.md
    └── testing-strategy.md
```

Seed each file with a title and one sentence on what goes there, not a template
essay. `docs/specifications/` stays empty until the first feature; each feature
then gets its own `docs/specifications/<feature>/` holding `specification.md`,
`technical-design.md`, and `implementation-plan.md`.

**If step 11 found an existing `docs/` layout**, do not scaffold over it or
force it into the nested `specifications/<feature>/` shape above. Present what
was found and ask which fits:

- **Adopt as-is**: change nothing on disk. Map the chain's roles onto the
  existing folders (e.g. a project that already keeps flat per-feature files
  directly under `docs/product/` and `docs/architecture/`, the way Ken OS
  does, keeps doing that — `specification` and `codebase-design`/`adr` write
  `docs/product/<feature>.md` and `docs/architecture/<feature>.md` directly,
  no `specifications/` nesting).
- **Add alongside**: keep every existing folder and file untouched, and add
  only what's missing from the structure above (commonly `docs/development/`,
  since most projects don't have one yet).
- **Skip**: the project already has its own documentation practice and
  doesn't want the chain's folders at all. Note this in the generated
  `CLAUDE.md` so a later run of `/setup` doesn't ask again.

Whichever applies, record the actual resolved paths in the generated project
CLAUDE.md so the chain's skills write to where this project really keeps its
docs, not to a convention it never adopted.

Add to the generated project CLAUDE.md so the chain's skills write here instead
of their own fallbacks:
- Story artifact home for `specification`: `docs/specifications/<feature>/specification.md`, or the resolved equivalent from the adopt/alongside choice above
- Plan owner for `planning`/`/plan`: `docs/specifications/<feature>/implementation-plan.md` (overrides its `plans/` fallback), or the resolved equivalent
- Decision record home for `adr`: `docs/architecture/decisions/` (overrides its `docs/adr/` fallback), or the resolved equivalent

### 5. PR workflow notes (in the project CLAUDE.md)

Subject to the deferral rule above — there are no real quality-gate commands
to record until a manifest exists.

Do not generate a project `/pr` command or a project PR-review agent — PR creation is ordinary agent-led work gated by the global `panel-review` skill's `references/pr-readiness.md`, and reviews run through the global `/panel-review` skill, which auto-detects project traits. Instead, record in the generated project CLAUDE.md:

- The detected quality-gate commands (typecheck, lint, test, build) so the PR-readiness gate can run them
- Any project-specific review lenses `/panel-review` should include by default (e.g. `hexagonal-architecture`, `domain-driven-design`) based on the detected architecture

### 6. Baseline folder scaffold (`src/`)

Only when the detected or selected framework is Next.js App Router, Analysis
step 10 resolved to **One app**, and the project has no established code
structure of its own yet beyond the framework-required route folder (an
existing structure is preserved untouched, never overwritten to match this
baseline).

Subject to the deferral rule above — with no `package.json` yet, `app/`
doesn't exist anywhere to find the sibling location of.

First find where `app/` actually lives — `create-next-app` puts it at the
project root by default, or under `src/app/` when the "use a `src/`
directory" option was taken. Create the other three baseline folders as
**siblings of that same `app/`**, not forced under `src/`:

```
<wherever app/ lives>/
├── app/                (already exists — never duplicated at the other location)
├── design-system/
│   └── README.md        one line: primitives and tokens only, never a product import
├── platform/
│   └── README.md         one line: named runtime capabilities, never a lib/utils dump
└── generated/
    └── .gitkeep
```

Do not create `features/` — it is earned the first time an interaction is
reused across more than one route, never scaffolded empty on day one. Seed
`design-system/README.md` and `platform/README.md` with the one-line rule
each folder exists to enforce, not an empty placeholder.

Skip this step entirely for the **monorepo** or **microservices** topology
answers from step 10 — a monorepo's per-app baseline is scaffolded only once a
real app exists inside it, and microservices get their own `/setup` run per
service.

### 7. Project README (`README.md`)

Skip if `README.md` already exists with real content — ask before overwriting rather than replacing a maintained one. A framework's own default placeholder (e.g. `create-next-app`'s stock "bootstrapped with create-next-app" line) is not real content; generate over it without asking.

Also subject to the deferral rule above — with no `package.json` yet, most sections below would describe commands that don't run.

**When deferred, create no `README.md` at all, not even a "planned" or placeholder one.** `create-next-app` (and other framework scaffolders) refuse to run in a directory that already contains a `README.md`, regardless of its content — a well-meaning placeholder blocks the exact scaffold command the checklist tells the human to run next. State the deferral as a checklist item instead (see step 1), and let the real README get generated after scaffolding, on the `/setup` run the checklist already points to.

Generate from the project info already gathered in the Analysis Phase. This file is the front door for a human landing on the repo, not a second copy of `CLAUDE.md` or `docs/` — every section is a pointer or a few lines, never a restatement of the deeper doc:

1. **Title + one-line description**
2. **What this project is for** — one short paragraph; link to `docs/product/product-overview.md` for the full why, when the project has it
3. **Tech stack** — flat list: framework, language, database, key dependencies, from the detected manifest
4. **Project structure** — the folder tree, one line per top-level folder and what it owns
5. **Architecture** — two or three sentences; link to `docs/architecture/system-overview.md` and `docs/architecture/decisions/` for the real design and decision records
6. **Features** — only when Analysis step 12 confirmed the project adopted the feature lifecycle chain. One line per existing feature, linking to its `docs/specifications/<feature>/specification.md` (or the resolved equivalent from the adopt/alongside choice in Generation step 4). Do not create a README inside the feature's source folder — the spec file is the one place that fact lives, and a second copy will drift from it.
7. **Getting started** — clone, install, run, using the detected package manager
8. **Environment variables** — point to `.env.example` if one exists or is needed; list variable names only, never values
9. **Commands** — dev/build/test/lint/typecheck, the same commands recorded in the generated `CLAUDE.md`'s "Project commands" section
10. **Testing** — how to run the suite; link to `docs/development/testing-strategy.md` when present rather than restating strategy here
11. **Contributing** — one line: new branch per task, PR against the base branch; link to `CLAUDE.md`'s git section for the full rules
12. **Attribution** — credit for the project's template/scaffold origin, third-party code, or assets, only if any apply; omit the section entirely rather than leaving it empty
13. **License** — name and link to the `LICENSE` file if one exists; omit if the project has none yet rather than guessing one

## Constraints

- **Do NOT overwrite existing files** without asking
- **Do NOT install packages** or modify project code
- **Do NOT create skills or agents that duplicate the global ones** — the global framework provides those
- **Do NOT edit any file outside the project root** — including a parent repository's `.gitignore`, `CLAUDE.md`, or other config, even when this project being nested inside one (per the empty-folder precondition above) means it would need an entry there. Surface that as a note to the human instead of writing it yourself.
- Present a summary of what will be created and ask for approval before writing files
- Keep all generated files concise and project-specific
