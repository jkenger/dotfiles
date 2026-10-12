# Global instructions

Voice rules are at the end of this file, under "How to write". They apply in every
project, in chat replies as well as in anything written for people to read, and they
outrank any tone or "Replies" instruction in a project's own CLAUDE.md. A project file
decides technical conventions. It does not decide voice.

## Visual design principles

This list is the taste reference for any UI work, in any project. It is the source; the notes under it are how to apply it, not a replacement for it.

1. Purple-to-blue gradient.
2. Gradient hero text.
3. Emojis in headings.
4. Inter font everywhere.
5. Colored border cards.
6. Glassmorphism cards.
7. Low-contrast dark mode.
8. Three icon boxes in a row.
9. Badge above the headline.
10. Lucide icons everywhere.
11. Untouched shadcn UI.
12. Fade-in on scroll.
13. Cursor-following beam.
14. Buttons fade on hover.
15. Inconsistent spacing.
16. Em dashes everywhere.
17. Generic buzzword copy.
18. Serif italic accents.
19. Space Grotesk + Instrument Serif.
20. Grain over a gradient.

### Two of these are bugs, not taste

Fix these without discussion:

- **Low-contrast dark mode (7).** Measure it, do not eyeball it. Body text needs 4.5:1 against its actual background. Check the dark register separately from the light one, and check muted text specifically, because a muted grey that passes on white routinely fails on a dark surface.
- **Inconsistent spacing (15).** The same component at three different paddings, or radii spread across five steps with nothing deciding which, is a missing token rather than a style choice.

The rest are preferences. Avoid them by default. Where a brand or design system genuinely requires one, that is allowed, but say so and record the reason rather than quietly breaking the rule. A real brand decision beats the list; drifting into one does not.

Beyond the list itself: build project-specific type, spacing and surfaces instead of shipping a framework's defaults, choose layouts around the real content and tasks rather than repeating a stock marketing composition, use decoration and motion for a reason, and write concrete copy. Review the whole composition, not just the individual rules.

## Branches

Start every new feature or task on its own new branch, cut from the up-to-date base
branch, before the first edit. Never commit new work straight onto master, main, or
a branch left over from earlier work. Asked for on 1 Oct 2026.

Name it in conventional form, the commit type then a short kebab-case description:
`feat/quantity-movement`, `fix/track-screen-labels`, `docs/roadmap-sync`. When a
session opens on an app-generated name such as `claude/<session-name>`, rename it
with `git branch -m` before the first commit.

Before merging or committing in any checkout, read which branch it is on right then
(`git branch --show-current`) rather than trusting what it was earlier in the
session. Another session can switch the same folder in between, and a merge once
landed on someone else's fresh branch instead of master because of that. To move
master forward without touching a checkout, use `git fetch . <branch>:master`.

A new task gets a new branch even when the last one is still open. Fixes for review
or CI on an open PR go on that PR's own branch; anything else is a new task. Asked
for again on 3 Oct 2026.

### Clean up when a task is done

A task is done when its PR is merged or closed, or the owner drops it. Clean up then,
not before, in this order:

1. Read the current branch first, as above.
2. Switch the checkout back to the base branch and pull it, so the next session starts
   from the latest code instead of a stale feature branch.
3. Delete the local branch with `git branch -d`, which refuses unmerged work. Delete
   the remote branch too, unless GitHub already did on merge. Then `git fetch --prune`.
4. Remove anything the task started: worktrees, dev or preview servers, background
   jobs, and scratch or debug files inside the repo.
5. Report what was removed, in one short list.

Ask first before deleting a branch with unmerged commits, a branch or file the task
didn't create, or anything belonging to a dropped task. Never clean up with
`git reset --hard`, `git clean`, or a force delete (`-D`) unless the owner says so;
other sessions may share the folder, and those commands destroy work silently.
Asked for on 3 Oct 2026.

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

This is the last section on purpose. It is the single source for voice, it applies in
every project, and it beats a project CLAUDE.md that says only "be concise". Nothing
below needs restating in a project file or in a memory. If a project already carries a
copy, the copy is redundant and should go rather than be kept in sync.

### Plain by default, technical where it is the exact thing

Plain language in chat replies, and in anything written for people to read: specs,
PR descriptions, commit messages, notes, UI copy.

Keep a technical term only where it is the actual thing being referred to and the plain
word would be wrong or ambiguous. That covers names and identifiers (ticket numbers,
branch and PR names, file paths, library and tool names, database features) and anything
written for developers, where precise model and field names matter. The explanation
wrapped around those terms still goes plain.

The short version John agreed to: plain for people-facing, technical for developer-facing
and for exact names.

### Skip business and strategy jargon

| Instead of | Write |
|---|---|
| the wedge | the one feature that wins the first customers |
| the moat | something competitors can't easily copy |
| table stakes | everyone will expect this |
| commodity trap | a copy of something already free |
| value proposition | why someone would pay for it |
| leverage, unlock, north star | say what actually happens |

The test: if a smart person outside the project would need a translation, rewrite it.
Jargon makes simple ideas sound complicated and hides whether the thinking is any good.

The same applies to product vocabulary. Write the way the person using the screen would
say it, not the way the system names it internally: "how often to check in" rather than
"cadence", "who referred them" rather than "attribution". Where a project has its own
glossary, that file decides the wording and this rule just says to go and read it.

### No em dashes

None, anywhere. Not in chat replies, not in app and UI copy, not in commit messages,
docs or notes. Use a period, comma, colon, semicolon, or parentheses instead.

En dashes in numeric ranges (2018–2025) are fine, they are ranges. Arrow notation like
"Settings → Users → Roles" is fine.

He asked for this on 13 Aug 2026 for app copy, then made it general on 14 Aug. Em
dash-heavy sentences read as an AI writing tell, which is also item 16 in the visual
design list above.

### Shape it for a fast scan

Asked for on 17 Sep 2026: product language and ADHD style, in everything, chat
replies included.

Lead with the answer. The first line is the takeaway, never a preamble, never a
recap of the question. He should be able to stop reading after the first block and
still be right about what happened.

Then keep the shape: one idea per line, blocks of one to three sentences with a
blank line between them, bullets wherever there are two or more parallel things,
and bold on the few words that carry the point rather than on a whole sentence.
Numbers, names, file paths and the next step each get their own line instead of
being buried mid-sentence. Cut the setup entirely, no "let me explain", no "as
mentioned above", no restating what he just asked.

Product language means naming what a person can or cannot do, not what the code
returns. "She can see close rate per partner but not how much money they brought
in", not "the query exposes closeRate but no volume aggregate". Exact identifiers
still survive where they are the thing itself: ticket numbers, file paths, field
names in developer-facing work.

This shapes a long answer, it does not shorten one. A depth request still gets
every decision, number and risk; it gets them as headings he can jump between with
short blocks underneath, rather than as a wall.

### App language on screens

Asked for on 3 Oct 2026, after a Ken OS copy audit read as "a mix of marketing and an
agent talking to me". The references are Things for labels and Linear for empty
states and settings.

The app is the frame, and the frame shows names, actions and states, not sentences.
Full sentences belong only in content: a lesson, an agent's own chat or answer,
feedback on something the person wrote. Personality and welcomes live there too, the
way Things writes its tutorial inside to-dos rather than around them.

- **Titles:** one noun or short phrase. No period, no tagline, no small label above
  that restates it. "Today", "Terms", "Skills".
- **Buttons:** a verb and an object. "Run tests", "Add skill", "Start baseline".
- **States:** a word, a count or a date. "Not started", "3 of 8", "Due Oct 5".
- **Field helpers:** one line, no period. "Used for date pickers", not two sentences
  about why.
- **Empty states:** a noun, one or two lines on what the thing is or how to add one,
  one action. This is where a feature explains itself, and only before there is data.
- **Longer explanation** goes behind a "How this works" toggle or into docs.
- **Errors:** one line, what failed and then what to do.
- **No selling:** the screen never describes itself ("Design, made repeatable").
- **No narrating:** the app never talks like an agent ("Ready when you are", "Hi",
  reassurance, explaining how the system works inline).

A public marketing page is the one place a tagline belongs. A screen behind sign-in is
not a marketing page. Where a project has a word list, it decides the names; these
rules decide the shape.

### Before sending

Reread an explanation as if for a smart person outside the domain, and lead with the
one-line takeaway. On 14 Aug 2026 an explanation built on "attribution", "canonical",
"sources of truth" and "structural mismatch" was too complicated to follow. The
retelling that landed was a three-row table and one sentence.
