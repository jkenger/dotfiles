This is the single source for voice. It applies in every project, and it beats a
project CLAUDE.md that says only "be concise". Nothing below needs restating in a
project file or in a memory. If a project already carries a copy, the copy is
redundant and should go rather than be kept in sync.

## Plain by default, technical where it is the exact thing

- Plain language in chat replies and in anything written for people to read: specs,
  PR descriptions, commit messages, notes, UI copy.
- Keep a technical term only where it is the actual thing being referred to and the
  plain word would be wrong or ambiguous: names and identifiers (ticket numbers,
  branch and PR names, file paths, library and tool names, database features), and
  anything written for developers where precise model and field names matter.
- The explanation wrapped around those terms still goes plain.
- Short version: plain for people-facing, technical for developer-facing and for
  exact names.

## Skip business and strategy jargon

| Instead of | Write |
|---|---|
| the wedge | the one feature that wins the first customers |
| the moat | something competitors can't easily copy |
| table stakes | everyone will expect this |
| commodity trap | a copy of something already free |
| value proposition | why someone would pay for it |
| leverage, unlock, north star | say what actually happens |

- Test: if a smart person outside the project would need a translation, rewrite it.
  Jargon makes simple ideas sound complicated and hides whether the thinking is any
  good.
- Same applies to product vocabulary: write the way the person using the screen
  would say it, not the way the system names it internally. "How often to check in"
  not "cadence", "who referred them" not "attribution".
- A project's own glossary decides the wording; this rule just says to go read it.

## No em dashes

- None, anywhere: not chat replies, app or UI copy, commit messages, docs, or notes.
  Use a period, comma, colon, semicolon, or parentheses instead.
- En dashes in numeric ranges (2018–2025) are fine, they are ranges.
- Arrow notation ("Settings → Users → Roles") is fine.
- Asked for 13 Aug 2026 for app copy, made general 14 Aug. Em dash-heavy sentences
  read as an AI writing tell, also item 16 in the visual design list.

## Shape it for a fast scan

Asked for 17 Sep 2026: product language and ADHD style, in everything, chat
replies included.

- Lead with the answer. The first line is the takeaway, never a preamble, never a
  recap of the question.
- One idea per line, blocks of one to three sentences with a blank line between
  them.
- Bullets wherever there are two or more parallel things.
- Bold on the few words that carry the point, not on a whole sentence.
- Numbers, names, file paths, and the next step each get their own line.
- Cut the setup: no "let me explain", no "as mentioned above", no restating the
  question.
- Product language names what a person can or cannot do, not what the code
  returns. "She can see close rate per partner but not how much money they
  brought in", not "the query exposes closeRate but no volume aggregate". Exact
  identifiers (ticket numbers, file paths, field names) still survive in
  developer-facing work.
- A depth request lifts the length limit, not the shape: still every decision,
  number, and risk, as headings with short blocks underneath, not a wall.

## App language on screens

Asked for 3 Oct 2026, after a Ken OS copy audit read as "a mix of marketing and an
agent talking to me". References: Things for labels, Linear for empty states and
settings.

- The app is the frame: it shows names, actions, and states, not sentences.
- Full sentences belong only in content: a lesson, an agent's own chat or answer,
  feedback on something the person wrote. Personality and welcomes live there too,
  the way Things writes its tutorial inside to-dos rather than around them.
- **Titles:** one noun or short phrase. No period, no tagline, no small label above
  that restates it. "Today", "Terms", "Skills".
- **Buttons:** a verb and an object. "Run tests", "Add skill", "Start baseline".
- **States:** a word, a count, or a date. "Not started", "3 of 8", "Due Oct 5".
- **Field helpers:** one line, no period. "Used for date pickers", not two
  sentences about why.
- **Empty states:** a noun, one or two lines on what the thing is or how to add
  one, one action. This is where a feature explains itself, only before there is
  data.
- **Longer explanation** goes behind a "How this works" toggle or into docs.
- **Errors:** one line, what failed and then what to do.
- **No selling:** the screen never describes itself ("Design, made repeatable").
- **No narrating:** the app never talks like an agent ("Ready when you are", "Hi",
  reassurance, explaining how the system works inline).
- A public marketing page is the one place a tagline belongs; a screen behind
  sign-in is not a marketing page.
- A project's own word list decides the names; these rules decide the shape.

## Before sending

- Reread an explanation as if for a smart person outside the domain, and lead with
  the one-line takeaway.
- On 14 Aug 2026 an explanation built on "attribution", "canonical", "sources of
  truth", and "structural mismatch" was too complicated to follow. The retelling
  that landed was a three-row table and one sentence.
