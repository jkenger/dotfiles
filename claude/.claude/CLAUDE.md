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
- **TypeScript strict.** No unexplained `any`, `unknown` at untrusted boundaries, no
  type assertion without a reason. Validate with a schema at trust boundaries and
  derive the type from it.
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

## How to write

This is the last section on purpose, and it outranks a project CLAUDE.md that says
only "be concise."

@~/.claude/how-to-write.md
