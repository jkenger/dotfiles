This file is deliberately thin. There's no single "my product" at the global
level: Ken OS, PTMS, and anything else I build each have their own product
truth.

## Where the real thing lives

Each project that uses the feature lifecycle chain keeps its own product
overview at `docs/product/product-overview.md`, scaffolded by `/setup`. That
file, not this one, is the source of truth for what a project is, who it's
for, and why it exists.

## What this file owns instead

The handful of product conventions that apply across every project:

- Product and UX copy follows the voice rules in `how-to-write.md`, especially
  "Skip business and strategy jargon" and "App language on screens." Those
  rules decide tone; a project's own glossary decides naming.
- A feature doesn't start with code. See the "Feature lifecycle chain" in
  `CLAUDE.md`: discovery and `specification` come first, acceptance criteria
  exist before implementation.

Everything else, product strategy, roadmap, prioritization, is per-project and
belongs in that project's own docs, not here.
