# Development workflow

This explains how I actually work with Claude Code day to day. `claude/.claude/CLAUDE.md`
holds the instructions the agent follows; this is the human-readable version of the same
system — why it's shaped this way, not a rule the agent executes.

## The core idea: spec first, then test-drive it

Most AI coding failures I've hit come from the same root cause: the agent makes a real
decision — what happens on bad input, which of two reasonable behaviors is "correct" —
silently, inside the code, because nobody ever asked. By the time it's wrong, it's wrong
in a way that looks like working code.

The fix isn't "write better prompts." It's separating two different jobs that both feel
like "building a feature":

- **Deciding what the feature should do** — specification-driven development (SDD).
- **Building it correctly once that's decided** — test-driven development (TDD).

SDD doesn't replace TDD. It feeds it: the acceptance criteria SDD produces become the
tests TDD writes first.

## How I decide which one a request needs

Not a keyword trigger — a judgment call on one question: **does this already have agreed
acceptance criteria?**

| Signal | Path |
|---|---|
| A new feature or module, described as an outcome ("I want users to be able to X"), with a real decision hiding in it (what happens on empty input, which of two behaviors is right) | **SDD first** — specification, then TDD |
| A bug fix, a tweak, or a one-line request with one obvious, undisputed outcome | **Straight to TDD** — no spec needed |

The default is a suggestion, not a gate. I can always say "skip the spec, just build it"
(accepting the risk of a silent decision) or "this needs a spec first" even for something
small.

## The chain, end to end

1. **Specification** — one question at a time, never a questionnaire. Every assumption I'd
   otherwise make silently becomes a question instead. Output: acceptance criteria,
   written to `docs/specifications/<feature>/specification.md`.
2. **Split, only if it came back too big** — an epic-sized spec becomes child stories,
   each re-entering this chain on its own.
3. **Technical design** — the module's contract: what it owns, what it exposes, any real
   architectural decision gets an ADR. Written to `technical-design.md` and
   `docs/architecture/decisions/`.
4. **Plan the slices** — broken into the smallest vertical slices that each leave the
   codebase in a known-good state. Default: one slice, one trunk-based PR. A slice only
   becomes a stack when later work genuinely needs to start before an earlier PR merges.
5. **Implement** — RED (failing test first) → GREEN (minimum code to pass) → REFACTOR
   (only if it adds real value), one slice at a time. Mutation testing runs once per PR
   at the end, not after every increment — it's a gate, not a tic.
6. **Review** — a second pass before anything merges, through a different lens than the
   one that wrote the code.
7. **Learn** — a genuinely durable fact (a gotcha, a decision, a convention worth keeping)
   gets written down somewhere it'll actually be found again: an ADR, a glossary entry,
   a skill update. Not everything is worth keeping — only what the next session would
   otherwise rediscover the hard way.

### Chain integrity: each step's artifact gates the next one

Two real features exposed the same failure in different places: a `formatGreeting`
function skipped specification entirely and silently decided what empty input should
do; a feedback form skipped technical design and silently decided to persist to a flat
JSON file, a fact that never made it into the architecture overview. Neither failure
was "forgetting a rule" — it was that nothing actually checked whether the previous
step's artifact existed before the next step proceeded.

The fix: `specification.md` is a precondition for implementation, not a suggestion that
enough conversation happened. A system-shaping decision (new persistence, a new external
dependency, a new trust boundary, a new deployable) needs `technical-design.md` written
*before* the code decides it, not backfilled after. `progress-guardian` is the agent that
checks this backward — before approving a plan, it confirms the earlier artifacts exist,
not just that later slices are tracked correctly. `tdd-guardian` checks the same thing at
its own entry point, since either agent can get bypassed if a session jumps straight to
coding without invoking either one.

## Getting a new project onto this workflow

`/setup` is the onboarding step: it detects what's already there, asks only what it can't
detect, and scaffolds the `docs/` structure this chain reads and writes. It's idempotent —
safe to run again later to pick up anything that was deferred the first time (most often
because the stack was only planned, not yet scaffolded).

The folder structure escalates with evidence instead of being decided up front: every
project starts route-colocated (`app/` + `design-system/` + `platform/` + `generated/`),
earns a `features/<feature>/` the first time an interaction is reused across more than one
route, and earns a monorepo package only once a second app genuinely needs to share it.

## Keeping this in sync

`claude/.claude/` in this repo is the source of truth; `~/.claude/` is the live copy Claude
Code actually reads. They drift — I've had a stale live `CLAUDE.md` silently miss this
whole chain because nobody re-ran the sync after an edit. `node scripts/claude-md.js
status` catches that; `save`/`install` fixes it. Run `status` whenever something that
should be working isn't — stale config is the first thing to rule out, not the last.

**Don't trust the sync tool's own output blindly either.** It has lied before: it reported
a file as "already saved" when it wasn't (another process had changed the live file out
from under it between edit and save), and its directory-backup step crashed outright on
Windows (`agents/` specifically) until that got fixed to back up file-by-file instead of
the whole directory at once. After `save` or `install`, verify with a direct `diff` or
`grep` for what actually changed — the tool catching drift doesn't mean the tool itself
is drift-proof.

### Which files move together

These describe the same system from different angles. Changing one is a signal to check
the others, not a reason to assume they're still accurate:

| Change this | Check this |
|---|---|
| `CLAUDE.md`'s Feature lifecycle chain | `WORKFLOW.md` (the human explanation of the same chain) |
| `CLAUDE.md`'s chain, or its agent references | `agents/progress-guardian.md`, `agents/tdd-guardian.md` (the enforcement) |
| `CLAUDE.md`'s Hard architecture / folder baseline | `commands/setup.md` (what actually gets scaffolded) |
| `DESIGN.md` / `default-visual-system.md` | `commands/setup.md`'s baseline-folder step, if the scaffold should reflect it |
| Anything under `claude/.claude/` | `~/.claude/` — the live copy, via `node scripts/claude-md.js status` |

This table itself drifts the same way everything else does — update it when a new
cross-reference gets discovered, the same way a surviving mutant gets added as a test
case instead of just fixed once and forgotten.
