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

## Analysis Phase

1. **Detect tech stack**: language, framework, package manager, test runner, linter, formatter, build tool
2. **Detect TypeScript strict config**: check for `strict`, `noUncheckedIndexedAccess`, `noImplicitAny` etc.
3. **Detect CI pipeline**: what CI system, steps, and commands run; whether stacks will use GitHub-native linking or ordinary dependent PRs; and whether required merge-queue checks handle `merge_group`
4. **Detect existing config**: check for existing CLAUDE.md, .claude/ directory, hooks, commands
5. **Check for DDD**: look for glossary files, domain directories, bounded context structure
6. **Check for hexagonal architecture**: look for ports/, adapters/, domain/ directory structure
7. **Check for 12-factor patterns**: look for Dockerfile, docker-compose.yml, Procfile, .env.example, process.env usage, PORT binding, Kubernetes manifests (k8s/, deployment.yaml)
8. **Detect monorepo workspaces**: look for `workspaces` in package.json, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`, or multiple `apps/`/`packages/` directories. List each workspace found, with its own language/framework/test runner where it differs from the root.
9. **Ask whether this project uses the global CLAUDE.md's feature lifecycle chain** (specification → design → plan → implement → verify → review → learn). If yes, scaffold the `docs/` structure below. If the project is small, a library, or already has its own docs convention, skip it.

## Generation Phase

Create the following, skipping any that already exist (ask before overwriting):

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

Keep it concise and actionable — this replaces the need to run `/init`.

### 2. Per-workspace CLAUDE.md (monorepo only)

Only when Analysis step 8 found more than one workspace. Claude Code loads the
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

Only when step 9 of the Analysis Phase confirmed the project wants the feature
lifecycle chain. Create, skipping any that already exist:

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

Add to the generated project CLAUDE.md so the chain's skills write here instead
of their own fallbacks:
- Story artifact home for `specification`: `docs/specifications/<feature>/specification.md`
- Plan owner for `planning`/`/plan`: `docs/specifications/<feature>/implementation-plan.md` (overrides its `plans/` fallback)
- Decision record home for `adr`: `docs/architecture/decisions/` (overrides its `docs/adr/` fallback)

### 5. PR workflow notes (in the project CLAUDE.md)

Do not generate a project `/pr` command or a project PR-review agent — PR creation is ordinary agent-led work gated by the global `panel-review` skill's `references/pr-readiness.md`, and reviews run through the global `/panel-review` skill, which auto-detects project traits. Instead, record in the generated project CLAUDE.md:

- The detected quality-gate commands (typecheck, lint, test, build) so the PR-readiness gate can run them
- Any project-specific review lenses `/panel-review` should include by default (e.g. `hexagonal-architecture`, `domain-driven-design`) based on the detected architecture

## Constraints

- **Do NOT overwrite existing files** without asking
- **Do NOT install packages** or modify project code
- **Do NOT create skills or agents that duplicate the global ones** — the global framework provides those
- Present a summary of what will be created and ask for approval before writing files
- Keep all generated files concise and project-specific
