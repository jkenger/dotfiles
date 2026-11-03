# Global instructions

Voice rules are at the end of this file, under "How to write". They apply in every
project, in chat replies as well as in anything written for people to read, and they
outrank any tone or "Replies" instruction in a project's own CLAUDE.md. A project file
decides technical conventions. It does not decide voice.

## Hard architecture

Default stack for new projects, unless a project's own CLAUDE.md says otherwise.
Changing it needs a direct ask, not an assumption.

- **Framework:** Next.js, App Router
- **UI:** React
- **Language:** TypeScript, strict mode

**Folder structure** — every project starts with the same four folders:

```
src/
├── app/              # Next.js App Router: routes, layouts, route groups only
├── components/ui/    # presentational-only primitives + tokens — the common location for this layer across the React ecosystem; also matches shadcn's own default output path, if/when a project uses it
├── platform/         # named runtime capabilities (api-client, analytics, storage)
└── generated/        # generated API clients/types, never hand-edited
```

Keep a route's own UI, data-fetching, and tests inside its `app/<route>/`
folder. Add `features/<feature>/` only once an interaction is reused across
more than one route — never scaffold it empty on day one. `platform/` holds
named capabilities, never a generic `lib`/`utils` dump.

`ui/` means presentational only — no business logic, no data fetching, even
when its shape looks app-specific (a chat bubble styled for this one app is
still `ui/` if it has no logic in it). `components/` directly, not under
`ui/`, is a judgment call rather than a folder `/setup` ever scaffolds: reach
for it only when a file genuinely spans more than one route or feature right
now, with evidence, or belongs to the app's own shell (a root header, a theme
provider) — never for "might get reused someday." If nothing currently needs
it, don't create it.

## Product

@~/.claude/PRODUCT.md

## Visual design principles

@~/.claude/DESIGN.md

## Git & version control

### Branches

- Start every new feature or task on its own new branch, cut from the up-to-date
  base branch, before the first edit. (Asked for 1 Oct 2026.)
- Never commit new work straight onto master, main, or a branch left over from
  earlier work.
- Name it `<type>/<short-kebab-description>`: `feat/quantity-movement`,
  `fix/track-screen-labels`, `docs/roadmap-sync`.
- Session opens on an app-generated name like `claude/<session-name>`? Rename it
  with `git branch -m` before the first commit.
- Before merging or committing, check the current branch right then
  (`git branch --show-current`), not what it was earlier in the session. Another
  session can switch the same folder in between.
- To move master forward without touching a checkout, use
  `git fetch . <branch>:master`.
- A new task gets a new branch even when the last one is still open. (Asked for
  again 3 Oct 2026.)
- Fixes for review or CI on an open PR go on that PR's own branch. Anything else
  is a new task.

### Clean up when a task is done

A task is done when its PR is merged or closed, or the owner drops it. Clean up
then, not before, in this order: (Asked for 3 Oct 2026.)

1. Read the current branch first, as above.
2. Switch the checkout back to the base branch and pull it.
3. Delete the local branch with `git branch -d` (refuses unmerged work). Delete
   the remote branch too, unless GitHub already did on merge. Then
   `git fetch --prune`.
4. Remove anything the task started: worktrees, dev or preview servers,
   background jobs, scratch or debug files.
5. Report what was removed, in one short list.

Ask first before deleting:
- a branch with unmerged commits,
- a branch or file the task didn't create,
- anything belonging to a dropped task.

Never clean up with `git reset --hard`, `git clean`, or a force delete (`-D`)
unless the owner says so. Other sessions may share the folder.

### Commit messages

- Subject line follows conventional commits: a type matching the branch's prefix,
  then a short description. `feat: add quantity movement tracking`,
  `fix: correct track screen labels`.
- This only fixes the subject line. The rest of the commit workflow (heredoc body,
  co-author line, asking before staging and before committing) stays whatever the
  harness already does by default.

### Rebase and force-push

- On your own feature branch, rebase onto the latest base branch and force-push
  freely, any time before the branch has an open PR with review activity or you
  know someone else has pulled it.
- Once a PR has reviewers, or the branch might be shared, ask first before
  rebasing or force-pushing it.
- Never force-push `main` or `master`, full stop.

## Development

Adapted from citypaul/.dotfiles on 12 Oct 2026. The skills it names live in
`~/.claude/skills`. A project's own CLAUDE.md, tests and conventions win over this.

### Core rules

- **Test first for behavior changes.** Write a failing behavior test, write the least
  code that passes it, then tidy while it stays green. Pure refactors start from
  passing tests instead of a fake failing one.
- **Test behavior, not implementation.** Go through the public interface at the layer
  the claim is about. Coverage numbers are not proof.
- **TypeScript strict**, when the project's stack is TypeScript (per Hard
  architecture above, or a project's own override). No unexplained `any`,
  `unknown` at untrusted boundaries, no type assertion without a reason.
  Validate with a schema at trust boundaries and derive the type from it.
- **Prefer immutable data and pure functions.** Keep side effects at the edges and
  make them obvious.
- **Small steps.** Every increment leaves the code working.
- **Plan-only means plan-only.** When asked for a plan or a document, write no code.
- **Mutation testing once per PR**, at the end, not after every step.

### React and Next.js patterns

- **Server Components by default.** Add `use client` only when the component
  needs interactivity, hooks, or browser APIs, and keep it as low in the tree
  as possible.
- **Server Actions for mutations.** Go through a Server Action, not a separate
  API route, unless an external consumer genuinely needs that route.

### Which skill for which job

| Job | Skill |
|---|---|
| Test-first workflow | `mattpocock-skills:tdd`, then `testing` |
| Bug or runtime failure | `mattpocock-skills:diagnosing-bugs` |
| CI failure | `ci-debugging` |
| Module design and interfaces | `mattpocock-skills:codebase-design` |
| Folder and package layout | `structure-codebase` |
| Architecture audit of a repo | `improve-codebase-architecture` |
| Refactor or simplify | `refactoring`, `reduce-system-complexity` |
| Untested legacy code | `characterisation-tests`, `finding-seams` |
| Types and schemas | `typescript-strict` |
| Data transformations | `functional` |
| UI and React tests | `front-end-testing`, `react-testing` |
| React or Next.js speed | `react-performance` |
| Async UI flows (loading, retry, submit) | `xstate` |
| HTTP APIs | `api-design`, `bff-design`, `bff-entry-points` |
| Login, OAuth, OIDC | `secure-oauth-oidc` |
| CLIs | `cli-design` |
| Fuzzy idea to acceptance criteria | `specification`, then `story-splitting` |
| Poke holes in a plan or spec | `find-gaps` |
| Implementation plan | `planning` (or `/plan`), `stack-pull-requests` |
| Does the work meet the spec | `acceptance-review` |
| Review a branch or PR | `panel-review`, `double-check` |
| Library or build-it-ourselves choice | `evaluate-existing-solutions` |
| Domain names and glossary | `ubiquitous-language` |
| Where a learning should be written down | `expectations` |

Some copied skills still say `tdd`, `codebase-design` or `debugging`. Read those as
`mattpocock-skills:tdd`, `mattpocock-skills:codebase-design` and
`mattpocock-skills:diagnosing-bugs`. Where one says `grill-me`, use
`mattpocock-skills:grilling`.

### Feature lifecycle chain

When a new feature or module starts as an idea with no acceptance criteria yet,
during discovery, ideation, or a "let's build X" conversation, suggest starting
this chain instead of going straight to code. Don't enforce it for a bug fix, a
tweak, or a one-line request; those can skip straight to `mattpocock-skills:tdd`.

`/setup` scaffolds the `docs/` folders this chain reads and writes, for a project
that opts into it.

1. **Specification** — `specification`. Writes acceptance criteria to
   `docs/specifications/<feature>/specification.md`.
2. **Split, only if the map comes back too big** — `story-splitting` turns an
   epic-sized spec into child stories; each then re-enters this chain on its own.
3. **Technical design** — `mattpocock-skills:codebase-design` for the module
   contract; `adr` for any decision with real alternatives. Writes to
   `docs/specifications/<feature>/technical-design.md` and
   `docs/architecture/decisions/`.
4. **Mockups, only for a feature with a real visual surface** — draw the
   chosen frames and states using the host's canvas/artifact capability, with
   a brief alongside them saying which frames, states, and words to draw.
   Writes to `docs/specifications/<feature>/mockups/brief.md` and
   `docs/specifications/<feature>/mockups/canvas/`. Needs step 1's acceptance
   criteria and step 3's state decisions settled first — you can't draw states
   that haven't been decided yet. Code follows the chosen mockups, never the
   other way around; skip this step entirely for a feature with no screen
   (a pure function, a CLI, a background job).
5. **Plan the slices** — `/plan` (`planning`). Writes to
   `docs/specifications/<feature>/implementation-plan.md`. Test design isn't a
   separate stage: each slice's failing test comes immediately before its code,
   inside the RED-GREEN-REFACTOR cycle `planning` already runs.
6. **Implement** — `mattpocock-skills:tdd`, `testing`, `functional`,
   `typescript-strict`, one slice at a time.
7. **Verify** — `tdd-guardian` for process, `mutation-testing` at end of phase,
   `ts-enforcer` for types.
8. **Review and deliver** — `panel-review` or `double-check`;
   `stack-pull-requests` if a slice needs review layers. `progress-guardian`
   tracks every gate above and asks for commit approval.
9. **Learn** — `learn` routes durable facts through `expectations`; `adr` for
   decisions; `docs-guardian` for maintained docs.

**Chain integrity**: each step's artifact is a precondition for the next step,
not a suggestion that enough conversation happened. Before implementation
(step 6) starts for a new feature or module, confirm step 1's
`specification.md` actually exists — don't let "we talked about it" substitute
for a written artifact. Before implementing any decision that would change the
system's shape (new persistence, a new external dependency, a new trust
boundary, a new deployable), confirm step 3's `technical-design.md` captures it
first; don't let the decision get made silently inside the code and
rediscovered later. For a feature with a real screen, confirm step 4's mockup
brief exists before implementation starts too — don't let code decide what a
screen looks like when nobody drew it first. `progress-guardian` is the
checkpoint that verifies this backward, not only forward: before approving a
plan or starting implementation, it checks that the artifacts the earlier steps were supposed to produce
actually exist, the same way it tracks slice progress going forward.

## How to write

This is the last section on purpose, and it outranks a project CLAUDE.md that says
only "be concise."

@~/.claude/how-to-write.md
