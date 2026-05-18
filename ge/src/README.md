# System Instructions: ge Project — HTML, CSS & JS Generation

Follow these instructions precisely. Before generating any code, list exactly what you plan to build (files, components, logic) and wait for confirmation.

---

## 1. Project Structure

### The ge library lives in `src/`

```
src/
├── style.css          ← master CSS import (links vars + base)
├── css/
│   ├── vars.css       ← all design tokens
│   └── base.css       ← all element resets & defaults
└── js/
    ├── geui.js        ← UI helper class
    ├── ge-icon.js     ← icon manager
    ├── icons.js       ← icon definitions
    └── index.html     ← visual icon editor (open in browser)
```

`src/style.css` wires the foundation:
```css
@layer base, pages, components, etc;
@import "./css/vars.css" layer(base);
@import "./css/base.css" layer(base);
```

### Starting a new project

Copy `src/` to the new project root. The new project root then looks like:

```
{project}/
├── css/
│   ├── vars.css
│   └── base.css
├── js/
│   ├── geui.js
│   ├── ge-icon.js
│   ├── icons.js
│   └── index.html     ← icon editor
├── style.css
├── index.html         ← app entry point (name freely)
├── script.js          ← app JS (name freely)
└── style-app.css      ← app CSS (name freely)
```

Name app files however makes sense for the project — there is no enforced naming convention. The only rule is that app files sit at the project root alongside `style.css`.

### HTML head template

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Name</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="your-app-styles.css">
</head>
<body>
  <!-- content -->
  <script type="module" src="your-script.js"></script>
</body>
</html>
```

Rules:
- `data-theme="dark"` (or `"light"`) on `<html>` — always present
- `style.css` loads first, then the app CSS
- One `<script type="module">` at end of `<body>` pointing to `{name}-script.js`
- Never import `geui.js` or `ge-icon.js` directly from HTML
- Never use inline `onclick` or `<script>` blocks

### JS entry point template

`{name}-script.js` is the single entry point. It imports the ge libraries and owns all app logic:

```js
// fm-script.js
import geUIHelper from './js/geui.js';
import icx from './js/ge-icon.js';

document.addEventListener('DOMContentLoaded', () => {
  icx.replace();
  // initialise components, bind events, set up state…
});
```

`geUIHelper` auto-initialises theme and global keyboard shortcuts on import. Do not call `initTheme()` manually.

---

## 2. CSS Layer Architecture

```css
@layer base, pages, components, etc;
```

| Layer | Owner | Purpose |
|---|---|---|
| `base` | **System only** | `vars.css` + `base.css`. Never write here. |
| `pages` | You | Full-page layouts, grids, sidebars, headers, footers |
| `components` | You | Reusable UI: cards, badges, tabs, dropdowns, modals, form groups |
| `etc` | You | Utilities, modifiers, overrides — always last |

Your CSS file must open with:
```css
@layer pages {  }
@layer components {  }
@layer etc {  }
```

---

## 3. CSS Rules

### 3.1 — No bare tag selectors in `@layer components`

```css
/* ✗ Wrong */
@layer components { button { … } input { … } div { … } }

/* ✓ Right */
@layer components { button.btn { … } .card input { … } .field { … } }
```

Bare element selectors belong in `@layer pages` or `@layer etc` only, and only when scoped to a layout context.

### 3.2 — Tokens only. No raw values.

All colors, spacing, and type must use `var(--token)`. The only allowed exceptions are `0`, `1px`, `2px`, `3px`, and `100%`.

```css
/* ✗ Wrong */
padding: 12px;
color: #e7eee7;
font-size: 0.875rem;

/* ✓ Right */
padding: var(--sm);
color: var(--fg);
font-size: var(--sm);
```

### 3.3 — Spacing tokens (from `vars.css`)

| Token | Value | Use |
|---|---|---|
| `--vxs` | .25rem | Hairline gaps, badge padding, icon-to-label |
| `--xs` | .5rem | Input padding, compact component gaps |
| `--sm` | .75rem | Base unit — button font size, small padding |
| `--md` | 1rem | General spacing, base font size equivalent |
| `--lg` | 1.5rem | Between related components |
| `--xlg` | 2rem | Section spacing |
| `--vlg` | 2.5rem | Top-level layout gaps |

### 3.4 — Color tokens (from `vars.css`)

```
--bg          dark/light base background
--fg          foreground (always readable on --bg)
--muted       secondary text, labels, captions
--link        anchor color

--bg-subtle   5% white into --bg   (lowest emphasis surface)
--bg-inset    30% black into --bg  (inputs, wells, code blocks)
--bg-overlay  15% black into --bg  (dropdowns, modals)

--border-muted   10% white  (dividers)
--border         15% white  (standard interactive borders)
--border-hover   20% white  (hover/focus borders)
```

Functional colors and their variants:

```
--pr  --pr-subtle  --pr-bg  --pr-border   (primary / cyan)
--sc  --sc-subtle  --sc-bg  --sc-border   (success / green)
--da  --da-subtle  --da-bg  --da-border   (danger / red)
--wr  --wr-subtle  --wr-bg  --wr-border   (warning / yellow)
```

Usage pattern: use `--*-subtle` for large hover areas, `--*-bg` for fills (badges/alerts), `--*-border` for borders on top of those fills, and the functional color itself (`--pr`, `--sc`, etc.) for text/icons on those fills.

### 3.5 — Typography tokens

```
--font-sans    system-ui stack   default everywhere
--font-mono    monospace stack   buttons, labels, code, tokens
--font-serif   Georgia stack     long-form reading
```

### 3.6 — Do not redeclare what `base.css` already handles

These are already set — never rewrite them:
`box-sizing`, `html` (font, bg, color, smoothing), `body` (margin, padding, line-height), `a` (color + hover), `[hidden]`, headings first-child margin, `h4–h6` (margin/line-height), `img/video/svg/canvas` (display:block), `code/pre/kbd/samp` (font), `pre` (overflow), all form elements (font inheritance), `button` (full reset + inline-flex + mono font + transitions), `button:disabled`, `input/textarea/select` (bg, border, padding, hover/focus), `textarea` (resize, line-height), `:focus-visible` (2px solid `--pr`), `hr`, `table` (border-collapse), scrollbars.

Base also includes: `.overlay`, `.modal`, `.toast-container`, `.toast`, `.toast-success/error/info/warning`, `.accordion-header`, `.accordion-content`, `.accordion-item.active`.

---

## 4. JavaScript Requirements

### 4.1 — Module setup

See section 1 for the full entry point template. Import paths from the project root:

```js
// your-script.js  (whatever you named it)
import geUIHelper from './js/geui.js';
import icx from './js/ge-icon.js';

document.addEventListener('DOMContentLoaded', () => {
  icx.replace();
  geUIHelper.tabs('.tabmenu');   // if tabs are used
  geUIHelper.accordion('.accordion');  // if accordions are used
  // …
});
```

### 4.2 — geUIHelper API

```js
// DOM
geUIHelper.el('#id')          // querySelector
geUIHelper.els('.class')      // querySelectorAll → array

// Visibility
geUIHelper.show(el)
geUIHelper.hide(el)
geUIHelper.toggle(el)

// Classes
geUIHelper.addClass(el, 'active')
geUIHelper.removeClass(el, 'active')
geUIHelper.toggleClass(el, 'active')

// Events
geUIHelper.on(el, 'click', handler)

// Theme
geUIHelper.setTheme('dark' | 'light')
geUIHelper.getCurrentTheme()      // returns 'dark' | 'light'

// Toast
geUIHelper.toast('Message', 'success' | 'error' | 'info' | 'warning', durationMs)

// Modal
geUIHelper.modal('open', 'modalId')
geUIHelper.modal('close', 'modalId')
geUIHelper.modal('destroy', 'modalId')

// Tabs — pass selector for .tabmenu elements
geUIHelper.tabs('.tabmenu')

// Accordion
geUIHelper.accordion('.accordion')

// Form (with HTML5 validation)
geUIHelper.handleForm(formEl, async (data, form) => {
  // return { ok: true } or true on success
})

// Keyboard shortcuts
geUIHelper.onKey('Ctrl+S', () => { … })
geUIHelper.onKey('Escape', () => { … })

// Error (logs + shows error toast)
geUIHelper.error('Something failed', errorObj)
```

### 4.3 — Icon API

```js
// Render icon as HTML string (inject into innerHTML)
icx.icon('trash')                // → SVG HTML string
icx.icon('edit', 'my-class')    // → SVG with extra classes

// Replace all [data-icon] elements in the DOM (call after load)
icx.replace()

// Replace icons in a newly injected subtree
icx.delayreplace('[data-icon]')
```

In HTML, declare icons declaratively:
```html
<svg data-icon="trash" class="icon-sm"></svg>
<svg data-icon="edit"></svg>
```

Available icon names (from `icons.js`): `activity-heartbeat`, `adjustments-horizontal`, `ai-agents`, `ai-chara`, `ai-content`, `ai-dialog`, `ai-file`, `ai-fill`, `api-book`, `archive`, `arrow-left`, `arrow-right`, `blockquote`, `book`, `books`, `chart-infographic`, `check`, `checkup-list`, `download`, `edit`, `eye`, `file-text`, `file-text-ai`, `folder`, `folder-bolt`, `folder-share`, `folder-symlink`, `github`, `grip-vertical`, `h-1` through `h-6`, `input-ai`, `layout-kanban`, `letter-s-fill`, `library-photo`, `list`, `list-numbers`, `lock`, `lock-open-2`, `markdown`, `moon`, `notebook`, `pencil`, `photo`, `refresh`, `settings-cog`, `subtitles-ai`, `sun`, `sun-moon`, `synote`, `t-save`, `device-floppy`, `thrash`, `trash`, `upload`, `user`, `user-star`, `users-group`, `video`, `x`.

**Adding or editing icons — use `icons.html`:**

Open `js/icons.html` in a browser to manage the icon library visually. It provides a searchable grid of all icons with add, edit, rename, and delete actions, plus a live SVG preview. Changes are saved to `localStorage`. When done, click **Export icons.js** to download the updated file and replace `js/icons.js` in the project. Never hand-edit `icons.js` directly — always use `icons.html` as the editor.

### 4.4 — JS code quality

- ES6+ only. No `var`. Use `const` and `let`.
- Wrap async operations and DOM queries in `try/catch`.
- Use `console.error()` for errors, plus `geUIHelper.error()` for user-visible failures.
- Defensive: null checks, optional chaining (`?.`), early returns.
- No `innerHTML` with user-supplied data — sanitise or use DOM methods.
- State lives in module-level variables or a single state object. No global pollution.

---

## 5. HTML Requirements

- Semantic HTML5: use `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>` appropriately.
- `<html lang="en" data-theme="dark">` — theme attribute required.
- `<button>` elements get descriptive `aria-label` when icon-only.
- `<input>` always paired with `<label>` (explicit `for`/`id`).
- For modals: use the `.overlay` + `.modal` structure from `base.css`. Give the modal an `id`.
- Icons: use `<svg data-icon="name">` — `icx.replace()` will hydrate them.

---

## 6. Component Patterns

### Button
```html
<button class="btn btn-primary">
  <svg data-icon="check"></svg>
  Save
</button>
```

```css
@layer components {
  button.btn {
    gap: var(--vxs);
    padding: var(--xs) var(--sm);
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  button.btn-primary {
    background: var(--pr-bg);
    border-color: var(--pr-border);
    color: var(--pr);
  }
}
```

### Card
```html
<div class="card">…</div>
```

```css
@layer components {
  .card {
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: var(--md);
  }
}
```

### Badge / Tag
```css
@layer components {
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--vxs);
    padding: var(--vxs) var(--xs);
    border-radius: 4px;
    font-size: var(--sm);
    background: var(--pr-bg);
    border: 1px solid var(--pr-border);
    color: var(--pr);
  }
}
```

### Modal (using base.css structure)
```html
<div class="overlay" id="myOverlay">
  <div class="modal" id="myModal">
    <h4>Title</h4>
    <p>Content</p>
    <button class="btn" onclick="">Close</button>
  </div>
</div>
```

```js
geUIHelper.modal('open', 'myModal');
geUIHelper.modal('close', 'myModal');
```

### Tabs
```html
<ul class="tabmenu" data-scope="tabContent">
  <li class="active" data-tab="tab1">Tab 1</li>
  <li data-tab="tab2">Tab 2</li>
</ul>
<div id="tabContent">
  <div class="tab active" id="tab1">…</div>
  <div class="tab" id="tab2" hidden>…</div>
</div>
```

```js
geUIHelper.tabs('.tabmenu');
```

---

## 7. Generation Checklist

Run through this in order before outputting any file:

1. [ ] Listed what will be built — waited for confirmation
2. [ ] HTML is semantic HTML5 with correct `data-theme` and module imports
3. [ ] CSS opens with correct `@layer` declarations
4. [ ] No bare tag selectors inside `@layer components`
5. [ ] Zero raw hex colors, pixel values, or rem values — all tokens
6. [ ] Nothing from `base.css` is redeclared
7. [ ] `.overlay`/`.modal` structure used for modals (not custom)
8. [ ] JS is a single ES module with `import` statements at top
9. [ ] All DOM queries are null-checked, async ops are wrapped in `try/catch`
10. [ ] `icx.replace()` is called after DOM is ready
11. [ ] `geUIHelper.tabs()` / `geUIHelper.accordion()` called if used
12. [ ] Final scan: no unauthorized raw values remain in CSS
