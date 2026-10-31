# dotfiles

My Claude Code setup: global CLAUDE.md, skills, agents, slash commands, and hooks.

Most of it comes from [citypaul/.dotfiles](https://github.com/citypaul/.dotfiles). [SOURCE.md](SOURCE.md) records the exact commit and what was left out.

## Install on a new machine

Claude Code reads skills, agents, commands, and hooks from `~/.claude`.

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

The `case` line skips three skills that duplicate the mattpocock plugin.

Then install the global config files:

```bash
cd ~/dotfiles
node scripts/claude-md.js install
```

And the format hook, which runs each file Claude writes or edits through the project's own Prettier (does nothing without Prettier installed, needs only Node):

```bash
cd ~/dotfiles/claude/.claude
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

Restart Claude Code. Running either step again is safe: `install` backs up an existing file first, and the hook script never adds a duplicate entry.

## What's here

| Path | What it is |
|---|---|
| `claude/.claude/CLAUDE.md` | Global rules, a copy of `~/.claude/CLAUDE.md` |
| `claude/.claude/PRODUCT.md` | Pointer to each project's own product overview, plus the product conventions that apply everywhere |
| `claude/.claude/DESIGN.md` | Visual design taste reference |
| `claude/.claude/default-visual-system.md` | Default color/type/layout/component/motion system |
| `claude/.claude/how-to-write.md` | Voice and writing rules |
| `claude/.claude/CLAUDE.citypaul.md` | citypaul's development rules, unedited, reference only |
| `claude/.claude/skills/` | 50 skills: testing, refactoring, debugging, planning, API and architecture design, React, XState, writing |
| `claude/.claude/agents/` | 9 agents, such as `tdd-guardian`, `ts-enforcer`, `refactor-scan`, `adr` |
| `claude/.claude/commands/` | `/plan`, `/continue`, `/setup` |
| `claude/.claude/hooks/` | `prettier.js` and the `settings.json` entry that turns it on |
| `claude/.claude/settings.json` | Reference only, not installed |
| `scripts/claude-md.js` | Keeps the repo copies and the live `~/.claude` files in step |

## Keeping CLAUDE.md in sync

The repo keeps copies of the live global files under `claude/.claude/`. Symlinks don't work on Windows, so a small script copies between the two.

| Command | What it does |
|---|---|
| `node scripts/claude-md.js status` | Exits 1 if any copy differs |
| `node scripts/claude-md.js save` | Copies live files into the repo |
| `node scripts/claude-md.js install` | Copies repo files into `~/.claude`, backing up first |

After editing a live file, run `save`, then commit.

## Upstream

Copying citypaul's `CLAUDE.md` over mine would overwrite my own rules, so his stays as `CLAUDE.citypaul.md` for reference. My global file has a "Development" section instead: core rules, a skill-routing table, and a note mapping his `tdd`, `codebase-design`, `debugging`, and `grill-me` names to the mattpocock plugin.

Left out on purpose: `settings.json` (would replace my model, plugins, and status line; its `jq` format hook is replaced by `prettier.js`), the "use `agent-browser` first" rule, and the third-party skills his installer pulls in separately.

To pull in new upstream changes:

```bash
git clone --depth 1 https://github.com/citypaul/.dotfiles.git /tmp/citypaul
diff -r -x CLAUDE.md /tmp/citypaul/claude/.claude claude/.claude
diff /tmp/citypaul/claude/.claude/CLAUDE.md claude/.claude/CLAUDE.citypaul.md
```

The first diff skips `CLAUDE.md`, since that path holds my own rules now. Copy across what's useful, then update the commit reference in [SOURCE.md](SOURCE.md).

## License

MIT, from citypaul/.dotfiles. See [LICENSE](LICENSE). Some skills carry their own `LICENSE` or `NOTICE` file.
