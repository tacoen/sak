# System Instructions: Semantic HTML, CSS, & JS Generation

Follow these instructions precisely. You can make mistakes, so before generating code, always ask for confirmation by first listing exactly what you plan to build, in order.

---

## 1. File Structure & Architecture
Generate exactly three files based on the app name (e.g. `fm` for File Manager):

- **HTML:** Semantic HTML5 only. All external scripts use `type="module"`.
- **CSS:** `/css/{app-name}.css` – strictly scoped with `@layer base, pages, components, etc;`.
- **JavaScript:** `/script.js` – ES module. Handles all logic, events, and state. No inline scripts or `onclick` attributes.

### Layer Order
- `base`: System-owned (`vars.css` + `base.css`). Never write here.
- `pages`, `components`: Your feature and reusable UI code.
- `etc`: Always last. Place all utility classes, global modifiers, and high-specificity overrides here.

---

## 2. Component Selector Rules (@layer components)
- Never use bare element selectors (`button`, `div`, `input`).
- Always use `.class`, `#id`, or qualified selectors (`button.btn`, `.card::after`).

---

## 3. Design Tokens (vars.css)
Use only design tokens via `var(--token-name)`. Exceptions: `0`, `1px`–`3px`, `100%`. No raw numbers, pixels, or hex colors elsewhere.

---

## 4. Do Not Duplicate Base Styles
`base.css` already provides:
- `box-sizing: border-box`
- Typography flow, link behavior, first-child margin reset
- Media defaults (`max-width: 100%`, block)
- Form control base styles + transitions
- Native focus-visible ring
- `hr` dividers

Build on top. Do not reset or redeclare.

---

## 5. Layer Responsibilities
**@layer components:**
- Alerts, badges, tags
- Modals, dropdowns, popovers
- Cards, tabs, media objects, form groups

**@layer pages or etc:**
- Page layouts, grids, sidebars, headers/footers
- Raw typography and un-wrapped native elements

---

## 6. JavaScript Requirements
- Write clean, modular ES6+ code.
- Add robust error handling: wrap all async operations, DOM queries, and critical logic in try/catch.
- Log meaningful errors with `console.error()` and provide user-friendly fallbacks where appropriate.
- Use defensive programming: null checks, optional chaining, and early returns.

---

## 7. Generation Checklist (follow in order)
1. Output clean semantic HTML5.
2. Output full CSS inside `/css/{app-name}.css` with correct `@layer` blocks.
3. Ensure no bare tags in `@layer components`.
4. Place utilities/overrides in `@layer etc` at the very bottom.
5. Output all JS as a single ES module for `/script.js` with error handling.
6. Final scan: zero unauthorized raw values or colors in CSS.