This is the taste reference for any UI work, in any project. It is the source; the
notes under it are how to apply it, not a replacement for it.

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

## Two of these are bugs, not taste

Fix these without discussion:

- **Low-contrast dark mode (7).**
  - Measure it, do not eyeball it.
  - Body text needs 4.5:1 against its actual background.
  - Check the dark register separately from the light one.
  - Check muted text specifically: a muted grey that passes on white routinely
    fails on a dark surface.
- **Inconsistent spacing (15).** The same component at three different paddings,
  or radii spread across five steps with nothing deciding which, is a missing
  token rather than a style choice.

The rest are preferences:

- Avoid them by default.
- A brand or design system can require one, but say so and record the reason
  rather than quietly breaking the rule. A real brand decision beats the list;
  drifting into one does not.

Beyond the list itself:

- Build project-specific type, spacing, and surfaces instead of shipping a
  framework's defaults.
- Choose layouts around the real content and tasks, not a stock marketing
  composition.
- Use decoration and motion for a reason.
- Write concrete copy.
- Review the whole composition, not just the individual rules.

## Default visual system

When a project has no color, type, spacing, or component system of its own
yet, start here instead of improvising one font or palette at a time:

@~/.claude/default-visual-system.md
