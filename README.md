# dotfiles

My Claude Code setup: my global CLAUDE.md, skills, agents, slash commands and hooks.

Most of it comes from [citypaul/.dotfiles](https://github.com/citypaul/.dotfiles). [SOURCE.md](SOURCE.md) records the exact commit and what was left out.

## What's here

| Path | What it is |
|---|---|
| `claude/.claude/CLAUDE.md` | My global rules, a copy of `~/.claude/CLAUDE.md` |
| `claude/.claude/CLAUDE.citypaul.md` | citypaul's development rules, unedited, reference only |
| `scripts/claude-md.js` | Keeps the repo copy and `~/.claude/CLAUDE.md` in step |
| `claude/.claude/skills/` | 50 skills: testing, refactoring, debugging, planning, API and architecture design, React, XState, writing |
| `claude/.claude/agents/` | 9 agents, such as `tdd-guardian`, `ts-enforcer`, `refactor-scan`, `adr` |
| `claude/.claude/commands/` | `/plan`, `/continue`, `/setup` |
| `claude/.claude/hooks/` | `prettier.js`, a format-on-edit hook, and `settings-snippet.json`, the entry that turns it on |
| `claude/.claude/settings.json` | Reference only, not installed |

## Install on a new machine

Claude Code reads skills, agents, commands and hooks from `~/.claude`. Copy them there, leaving out the three skills that duplicate the mattpocock plugin:

```bash
git clone https://github.com/jkenger/dotfiles.git ~/dotfiles
cd ~/dotfiles/claude/.claude
mkdir -p ~/.claude/skills ~/.claude/agents ~/.claude/commands
for s in skills/*/; do
  case "$(basename "$s")" in tdd|codebase-design|debugging) continue ;; esac
  cp -r "$s" ~/.claude/skills/
done
cp skills/REFERENCES.md ~/.claude/skills/
cp -r agents/. ~/.claude/agents/
cp commands/*.md ~/.claude/commands/
```

### Format hook

`hooks/prettier.js` formats each file Claude writes or edits with the project's own Prettier. It does nothing in a repo without Prettier in `node_modules`, skips repos that use Biome or dprint, and never blocks an edit. It needs only Node.

From the same folder, copy it in and add the hook entry to your existing `~/.claude/settings.json`. This keeps a backup at `~/.claude/settings.json.bak` and changes nothing else in the file:

```bash
mkdir -p ~/.claude/hooks
cp hooks/prettier.js ~/.claude/hooks/
cp ~/.claude/settings.json ~/.claude/settings.json.bak 2>/dev/null || echo '{}' > ~/.claude/settings.json
node -e '
const fs = require("fs");
const [file, snippetFile] = process.argv.slice(1);
const settings = JSON.parse(fs.readFileSync(file, "utf8"));
const entry = JSON.parse(fs.readFileSync(snippetFile, "utf8")).hooks.PostToolUse[0];
settings.hooks = settings.hooks || {};
const list = (settings.hooks.PostToolUse = settings.hooks.PostToolUse || []);
const installed = list.some((e) => (e.hooks || []).some((h) => (h.command || "").includes("prettier.js")));
if (!installed) list.push(entry);
fs.writeFileSync(file, JSON.stringify(settings, null, 2) + "\n");
' ~/.claude/settings.json hooks/settings-snippet.json
```

Running it again does not add a second entry.

### Ponytail plugin

`settings.json` lists `ponytail@ponytail` under `enabledPlugins`: [Ponytail](https://github.com/DietrichGebert/ponytail), a "lazy senior dev" mode that pushes for the smallest change that fully solves the task and names what it skipped. Unlike the `claude-code-plugins` entries, its marketplace is not built in, so it needs registering once before Claude Code can resolve it:

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

Send those as two separate prompts in Claude Code. Switch modes any time with `/ponytail lite`, `/ponytail full` (default), `/ponytail ultra`, or turn it off with `/ponytail off`.

### Global CLAUDE.md

From the repo root:

```bash
cd ~/dotfiles
node scripts/claude-md.js install
```

If a `~/.claude/CLAUDE.md` already exists and differs, it is backed up next to itself first, as `CLAUDE.md.bak-<date>`.

Then restart Claude Code.

## Keeping my global CLAUDE.md tracked

The live file is `~/.claude/CLAUDE.md`, and the repo keeps a copy at `claude/.claude/CLAUDE.md`. Symlinks are blocked on my Windows machine, so a small Node script copies between the two instead.

| Command | What it does |
|---|---|
| `node scripts/claude-md.js status` | Says whether the two copies differ (exit 1 if they do) |
| `node scripts/claude-md.js save` | Copies `~/.claude/CLAUDE.md` into the repo |
| `node scripts/claude-md.js install` | Copies the repo file into `~/.claude`, with a backup first |

After editing my rules, I run `save`, then commit. Line endings are ignored when comparing, because git may check the repo copy out with Windows line endings.

## How it fits with citypaul's CLAUDE.md

Copying citypaul's `CLAUDE.md` over `~/.claude/CLAUDE.md` would replace my own rules, so I don't. His file is kept as `CLAUDE.citypaul.md` for reference, and my global file has a "Development" section instead. It contains:

- the core rules: test first, strict TypeScript, immutable data, small steps
- a table of which skill to use for which job
- a note mapping citypaul's `tdd`, `codebase-design`, `debugging` and `grill-me` to the mattpocock plugin skills

Left out on purpose:

- `settings.json`, because it would replace my model, plugins and status line. Its `jq` format hook has been replaced by `hooks/prettier.js`, which gets added to my own settings instead
- the "use `agent-browser` first" rule, because I use the in-app browser
- third-party skills his installer pulls in separately, such as impeccable and clarity

## Update from upstream

```bash
git clone --depth 1 https://github.com/citypaul/.dotfiles.git /tmp/citypaul
diff -r -x CLAUDE.md /tmp/citypaul/claude/.claude claude/.claude
diff /tmp/citypaul/claude/.claude/CLAUDE.md claude/.claude/CLAUDE.citypaul.md
```

The first diff skips `CLAUDE.md`, because that path now holds my own rules. The second compares his rules with the reference copy.

Copy across what you want, then update the commit in [SOURCE.md](SOURCE.md).

## License

MIT, from citypaul/.dotfiles. See [LICENSE](LICENSE). Some skills carry their own `LICENSE` or `NOTICE` file.
