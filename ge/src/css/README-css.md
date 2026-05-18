This project uses a custom design system built on `base.css` and `vars.css`.
When writing HTML, CSS, or components, follow these rules strictly.
Do not override, duplicate, or contradict anything defined here.

---

## Layer order

Styles are loaded via `style.css` in this order:

```css
@layer base, pages, components, etc;
@import "./css/vars.css" layer(base);
@import "./css/base.css" layer(base);
```

- `vars.css` — all CSS custom properties (tokens)
- `base.css` — all element-level resets and defaults
- Your work goes in `pages`, `components`, or `etc` — never in `base`

---

## How the color system works

All colors are derived from `--bg` and `--fg` using `color-mix()`. This means
if `--bg` changes, the entire UI recolors coherently. Never use arbitrary hex
values — always use tokens.

```
--bg: #181118   (dark base)
--fg: #e7eee7   (light base — inverse of --bg, always stands out)
```

### Accent variants — mixed against `--bg`

Each functional color (`--pr`, `--sc`, `--da`, `--wr`) has three variants.
The percentage is how much of the accent color is mixed into `--bg`:

| Token | Mix | Use |
|---|---|---|
| `--*-subtle` | 10% | Large background areas — hover states, selected rows, subtle highlights |
| `--*-bg` | 20% | Component fills — badges, alerts, tag backgrounds |
| `--*-border` | 40% | Borders on top of `-subtle` or `-bg` fills |

The functional color itself (`--pr`, `--sc`, etc.) is used for **text and icons**
on top of these backgrounds. It reads clearly because it is mixed with `--fg`,
which is the inverse of `--bg`.

### Core backgrounds — white or black into `--bg`

| Token | Mix | Use |
|---|---|---|
| `--bg-subtle` | 5% white | Barely lifted surface — lowest emphasis background variation |
| `--bg-overlay` | 15% black | Layers sitting over content — dropdowns, modals |
| `--bg-inset` | 30% black | Recessed areas — inputs, wells, code blocks |

### Core borders — white into `--bg`

| Token | Mix | Use |
|---|---|---|
| `--border-muted` | 10% white | Separators and dividers — low emphasis structural lines |
| `--border` | 15% white | Standard borders on interactive elements |
| `--border-hover` | 20% white | Hover and focus border state |

### Functional colors

| Token | Use |
|---|---|
| `--muted` | Secondary text, placeholders, labels, captions |
| `--link` | Anchor color; on hover shifts to `--fg` with `--link` underline |

---

## Spacing scale

| Token | Value | Use |
|---|---|---|
| `--xxs` | .25rem | Tight inline gaps — icon-to-label, badge padding, hairline spacing |
| `--xs` | .5rem | Small padding — input padding, compact component gaps |
| `--sm` | 1rem | Base unit — matches the base font size (16px), general-purpose spacing |
| `--md` | 1.5rem | Medium spacing — between related elements, card padding |
| `--lg` | 2rem | Section spacing — between components or layout blocks |
| `--xlg` | 2.5rem | Large section spacing — top-level layout gaps |

`--sm` is `1rem` because it equals the base font size. It is the foundational
unit everything else is relative to.

---

## Typography

```
--font-sans   system-ui stack   default for all text
--font-mono   monospace stack   code, buttons, labels, tokens
--font-serif  Georgia stack     long-form reading, editorial
```

---

## What base.css already handles — do not redeclare

- `box-sizing: border-box` on `*, *::before, *::after`
- `html` — font, background, color, font-smoothing
- `body` — margin, padding, font-family, line-height
- `a` — color, no underline; hover shifts to `--fg` with `--link` underline
- `[hidden]` — `display: none !important`
- `p, h1–h6` — `margin-top: 0` on `:first-child`
- `h4, h5, h6` — `margin: 0`, `line-height: 1.25`
- `img, video, svg, canvas` — `display: block`, `max-width: 100%`
- `code, pre, kbd, samp` — `font-family: var(--font-mono)`, `font-size: .875em`
- `pre` — `margin: 0`, `overflow-x: auto`
- `input, textarea, select, button` — font, size, color inheritance
- `button` — full reset + `inline-flex`, mono font, `--sm` size, transitions
- `button:disabled` — `opacity: 0.5`, `cursor: default`
- `input, textarea, select` — `--bg-inset` fill, `--border` border, padding, transition; hover/focus `--border-hover`
- `textarea` — `resize: vertical`, `line-height: 1.5`
- `:focus-visible` — `2px solid var(--pr)`, `outline-offset: 2px`
- `hr` — `border-top: 1px solid var(--border-muted)`
- `table` — `border-collapse: collapse`, `width: 100%`
- Scrollbars — 4px, styled with `--bg-inset` and border tokens

---

## Rules

1. **Never hardcode colors, spacing, or font values.** Always use tokens.
2. **Never redeclare anything listed above.** Extend in `components`, `pages`, or `etc` layers only.
3. **Never write styles in the `base` layer.** Reserved for `vars.css` and `base.css`.
4. **Button resets are already applied.** Build on top — do not re-reset.
5. **Do not add `margin-top` to first children.** The base handles this for `p` and all headings.
6. **Do not override `:focus-visible`** unless replacing with an equally visible style using a token color.
7. **Do not set `font-family`** on elements already covered by base. Only set it for deliberate exceptions.
8. **Respect the link hover pattern.** Color shifts to `--fg` with a `--link` underline. Do not flatten to a simple color change.
9. **`h1`, `h2`, `h3` are intentionally unstyled** beyond `:first-child` margin. Set margins per context in the appropriate layer.
10. **Scrollbar styles are webkit-only by design.** Do not add Firefox overrides unless explicitly requested.
