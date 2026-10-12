# Source

Copied from https://github.com/citypaul/.dotfiles

Commit: `cd4028d57d6e4e95814f7b8ee55ca13c23a9c2f0` (2 Oct 2026, package version 4.18.0)

License: MIT, see `LICENSE`. Some skills carry their own `LICENSE` or `NOTICE`; those stay with the skill.

## Kept

- `claude/.claude/CLAUDE.md`: development guidelines
- `claude/.claude/skills/`: 50 skills
- `claude/.claude/agents/`: 9 agents plus their README
- `claude/.claude/commands/`: `/continue`, `/plan`, `/setup`
- `claude/.claude/settings.json`: reference only, not active

## Left out

- Shell and terminal config: zsh, oh-my-zsh, tmux, alacritty, ghostty, zellij, herdr, gnupg, opencode
- Repo machinery: install scripts, evals, tests, CI workflows, changesets, release notes, planning docs
- `skills/folder-structure`: deprecated alias for `structure-codebase`
- `skills/*/agents/openai.yaml`: Codex metadata, not used by Claude Code

## Not in the upstream repo

The upstream installer also pulls third-party skills (impeccable, web-quality, clarity, simple-english, Vercel React and Next.js, grill-me, writing-for-agents, skill-creator, seo-audit, skill-doctor). The `CLAUDE.md` mentions them with "when installed". They are not copied here.
