Default visual system to start from when a project has no type, spacing, or
component system of its own yet, drawn from the
[bryl-minimal](https://github.com/bryllim/bryl-minimal-design) design
language. A real brand's choices beat this default; use it as a starting
point, not an override of one that already exists.

## Color

Not a brand accent palette: a blue-grey neutral working surface, picked
from light, dark, or system. Color is spent only on state, green for
learned/success, amber for in progress, blue for the selected item and
focus ring, red for destructive, never on decoration. Categories and
chapters are told apart by number and name, not by hue. This is Ken OS's
actual palette (`globals.css`), not a borrowed default.

| Role | Light | Dark |
|---|---|---|
| Background | `oklch(0.968 0.005 255)` | `oklch(0.205 0.004 265)` |
| Foreground | `oklch(0.2 0.008 265)` | `oklch(0.93 0.004 100)` |
| Card / popover | `oklch(0.968 0.005 255)` / `oklch(1 0 0)` | `oklch(0.205 0.004 265)` / `oklch(0.255 0.006 265)` |
| Secondary / muted | `oklch(0.94 0.006 258)` | `oklch(0.275 0.006 265)` |
| Muted foreground | `oklch(0.47 0.012 260)` | `oklch(0.74 0.006 100)` |
| Accent | `oklch(0.925 0.007 258)` | `oklch(0.3 0.007 265)` |
| Border / input | `oklch(0.905 0.007 258)` / `oklch(0.86 0.008 258)` | `oklch(0.33 0.008 265)` |
| Ring, focus, selected | `oklch(0.52 0.16 262)` | `oklch(0.76 0.11 262)` |
| Destructive | `oklch(0.53 0.19 25)` | `oklch(0.72 0.15 20)` |

State colors, always beside an icon or a word, never color alone, each with
a soft fill variant for chips and tiles:

- Learned/success (green): light `oklch(0.5 0.13 150)`, dark
  `oklch(0.8 0.13 150)`.
- In progress (amber): light `oklch(0.5 0.11 70)`, dark `oklch(0.82 0.1 80)`.
- Diff add (green, resume autofill review): light `oklch(0.45 0.11 152)`,
  dark `oklch(0.8 0.12 152)`.
- Diff remove (red, resume autofill review): light `oklch(0.5 0.16 27)`,
  dark `oklch(0.8 0.1 27)`.

Usage rules:

- Text pairs keep 4.5:1 contrast in both themes.
- Cards are panels: a fill plus a 1px border seam, no shadow or ring.
- Selection, caret, and the focus ring all key off the ring color.
- A `.light` override repeats the light values inside a dark page, so a
  forced light preview stays light regardless of the system setting.

Theming mechanics (adapt to the stack):

- Store colors as semantic tokens (background, foreground, card, border,
  ring, and so on) that are swapped wholesale when a `dark` class is set on
  the document root.
- Honor three user choices: light, dark, and system (following the OS
  preference). Persist the choice; default to system.
- Theme changes crossfade over half a second on background, text, and
  border colors.

## Typography

Four roles instead of one font doing every job:

- **Body/UI: Geist**, falling back to system-ui or sans-serif. Paragraphs,
  navigation, card titles, buttons.
- **Technical: Geist Mono**, falling back to ui-monospace or monospace.
  Labels, timestamps, tags, footer links, nav items.
- **Display: Geist Pixel**, falling back to Geist Mono. Page titles, section
  number labels, big stat values.
- **Long-form: Source Serif 4**, falling back to Georgia or serif.
  Article/blog body text only, never UI.

The signature move is the micro-label register: 9-11px mono, uppercase, wide
letter-spacing, gray rather than full-contrast text. Use it for timestamps,
tags, section markers, and button captions instead of styling them like body
text.

## Layout and spacing

- Content column: narrow, 42rem (672px) max for reading pages, up to 56rem
  (896px) only when a page genuinely needs multi-column grids.
- Navigation: a fixed left sidebar, 14rem wide, at 1024px and up; content
  shifts right to clear it. Below that, a sticky top bar (hairline bottom
  border, about 90% opaque background with blur) with a full-screen overlay
  menu.
- Padding: 1rem on mobile, 1.5rem on desktop for horizontal page padding;
  1.25rem for card padding.
- Vertical rhythm: 3.5rem block spacing between sections; 0.75rem for small
  gaps inside components; 0.75 to 1.5rem between grid cards.
- Grids: modest, 2 columns on small screens, 3 at 1024px and up. Stat rows
  divide cells with hairline rules on both axes instead of gaps: the dividers
  are the design.
- Sidebar: groups separate with 1px gray-200 rules. The active nav item is
  ink-colored with a small leading arrow; inactive items are gray and darken
  to ink on hover.

## Components

Every component follows the same recipe: hairline gray-200 border, generous
radius, near-white fill, soft low-alpha shadow, mono micro-label somewhere.

- **Radii:** large cards 16px, medium cards 12px, small elements 8px,
  inputs/minimal 6px, pills and badges fully rounded, thumbnails about 10px.
- **Shadows:** always black at low alpha with large blur and strong negative
  spread, so they read as soft ground contact, not material elevation.
  - Resting card: about 8px down, 22px blur, -14px spread, 25% black.
  - Hover: deepen to about 18px down, 36px blur, -20px spread, 40% black,
    while the card lifts 2px.
  - Modal panels: much deeper, about 40px down, 90px blur, -20px spread,
    35% black.
  - Dark mode: shadows nearly disappear, rely on borders instead.
- **Tags/pills:** fully rounded, hairline gray-300 border, 9px uppercase
  mono, gray 500, tight padding (about 2px vertical, 8px horizontal). The
  featured/champion variant inverts: ink fill, background-colored text, no
  border.
- **Buttons:** understated. Primary action: ink fill, background-colored
  text, 6-8px radius, 12px text, darkening slightly on hover. Most "buttons"
  are really mono text links with an arrow glyph that nudges up and right on
  hover.
- **Cards:** border, radius, white/gray-50 fill, soft shadow, optionally an
  inset hairline border 5px inside the edge as a framing accent. Images
  inside zoom to 1.04 scale over half a second on hover.
- **Inputs:** either invisible (transparent, borderless, mono text, no focus
  ring beyond caret) inside composed widgets, or minimal (gray-50 fill,
  gray-200 border, 6px radius, 13px mono text).
- **Modals:** full-viewport overlay, ink at 30% opacity with a strong
  background blur, a centered panel (max width about 24rem, 16px radius,
  1.75rem padding) that fades and scales from 95% to 100% over 200ms. Escape
  closes it.
- **Scrollbars:** slim, 6px, transparent track, gray-300 rounded thumb.

## Texture: the halftone motif

The signature flourish: fields of tiny round dots (a print-style halftone),
monochrome, used as page backdrops, section accents, and photo treatments.

- Construction: a repeating grid of 1px-radius dots on a roughly 9px cell
  (denser variants at 6px and 5px cells). Light theme: near-black dots at 90%
  alpha. Dark theme: off-white dots at about 42% alpha.
- Always fade the field out with a soft mask (radial or linear) so it
  dissolves at the edges instead of ending abruptly: into a corner, under a
  heading, or along the bottom edge of a photo so the image appears to
  dissolve into dots.
- Use it in at most one or two places per page. It is seasoning, not
  wallpaper.

## Motion

Motion is brief, eased, and one-directional: things settle downward-up,
never bounce.

- Micro-interactions (color, opacity, small transforms): 200ms.
- Card hovers: about 350ms for shadows, 420ms for transforms, on a strong
  ease-out curve (fast start, long gentle landing: cubic-bezier(0.16, 1,
  0.3, 1) or similar).
- Page entrance: elements fade up from 12px below over 700ms on that same
  curve, staggered about 70ms apart down the page (first at 50ms, each
  later, capped around 330ms).
- Status dots pulse by opacity (1 to 0.25 to 1) on a slow 1.8s loop.
- Theme switching crossfades colors over 500ms. If the platform offers view
  transitions, a circular reveal expanding from the click point over about
  540ms is the ideal.
- Always disable all of this under a reduced-motion preference. The design
  must be complete when perfectly still.

## Accessibility baseline

Non-negotiables that keep the minimalism honest:

- Semantic landmarks (nav/main/header/article).
- Readable contrast (the 4.5:1 rule under Color, in both themes).
- Keyboard escape routes for every overlay.
- Honor both `prefers-color-scheme` and `prefers-reduced-motion`.
- Declare support for both color schemes to the browser so form controls
  and scrollbars match the theme.

## Applying this to an existing project

When restyling something that already exists, keep its structure and stack,
then work in this order:

1. Collapse the palette to the semantic token set above.
2. Install the four font roles and recast labels into the mono micro-label
   register.
3. Thin every border to a gray-200 hairline and align radii to the
   16/12/8/6 ladder.
4. Soften shadows to the low-alpha recipe.
5. Add dark mode through token remapping.
6. Add the entrance stagger.
7. Finish with one tasteful halftone accent.

Stop before it gets busy: if a screen feels empty, that is usually correct.
