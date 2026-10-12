# dotfiles

My Claude Code setup: development rules, skills, agents and slash commands.

Most of it comes from [citypaul/.dotfiles](https://github.com/citypaul/.dotfiles). [SOURCE.md](SOURCE.md) records the exact commit and what was left out.

## What's here

| Path | What it is |
|---|---|
| `claude/.claude/CLAUDE.md` | citypaul's development rules, unedited |
| `claude/.claude/skills/` | 50 skills: testing, refactoring, debugging, planning, API and architecture design, React, XState, writing |
| `claude/.claude/agents/` | 9 agents, such as `tdd-guardian`, `ts-enforcer`, `refactor-scan`, `adr` |
| `claude/.claude/commands/` | `/plan`, `/continue`, `/setup` |
| `claude/.claude/settings.json` | Reference only, not installed |

## Install on a new machine

Claude Code reads skills, agents and commands from `~/.claude`. Copy them there, leaving out the three skills that duplicate the mattpocock plugin:

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

Then restart Claude Code.

## How it fits with my global CLAUDE.md

Copying citypaul's `CLAUDE.md` over `~/.claude/CLAUDE.md` would replace my own rules, so I don't. My global file has a "Development" section instead. It contains:

- the core rules: test first, strict TypeScript, immutable data, small steps
- a table of which skill to use for which job
- a note mapping citypaul's `tdd`, `codebase-design`, `debugging` and `grill-me` to the mattpocock plugin skills

Left out on purpose:

- `settings.json`, because it would replace my model, plugins and status line, and its format hook needs `jq`
- the "use `agent-browser` first" rule, because I use the in-app browser
- third-party skills his installer pulls in separately, such as impeccable and clarity

## Update from upstream

```bash
git clone --depth 1 https://github.com/citypaul/.dotfiles.git /tmp/citypaul
diff -r /tmp/citypaul/claude/.claude claude/.claude
```

Copy across what you want, then update the commit in [SOURCE.md](SOURCE.md).

## License

MIT, from citypaul/.dotfiles. See [LICENSE](LICENSE). Some skills carry their own `LICENSE` or `NOTICE` file.
