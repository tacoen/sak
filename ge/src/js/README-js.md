**✅ Updated README.md with your preferred project structure:**

```markdown
# geUIHelper

Lightweight, fast, and opinionated UI helper class for modern vanilla JavaScript.

## Project Structure

```bash
project/
├── main.js
├── js/
│   ├── geuihelper.js
│   ├── geMenu.js
│   └── geForm.js          # (optional)
└── css/
    ├── base.css
    └── vars.css
```

---

## Installation & Setup

In `main.js`:

```js
import geUIHelper from './js/geuihelper.js';

// Theme auto-initializes on import
geUIHelper.tabs('.tabmenu');
```

---

## All Available Methods

### Core Utilities

```js
geUIHelper.el('#id')
geUIHelper.els('.class')

geUIHelper.show(el)
geUIHelper.hide(el)
geUIHelper.toggle(el)

geUIHelper.addClass(el, 'active')
geUIHelper.removeClass(el, 'active')
geUIHelper.toggleClass(el, 'active')

geUIHelper.on(el, 'click', handler)
```

### Theme

```js
geUIHelper.setTheme('dark')
geUIHelper.setTheme('light')
geUIHelper.getCurrentTheme()
```

### Toast

```js
geUIHelper.toast('Success message', 'success')
geUIHelper.toast('Error message', 'error', 5000)
```

### Modal

```js
geUIHelper.modal('open', 'myModal')
geUIHelper.modal('close', 'myModal')
geUIHelper.modal('destroy', 'myModal')
```

### Tabs

```js
geUIHelper.tabs('.tabmenu')
geUIHelper.tabs('#customTabs')
```

### Form with HTML5 Validation

```js
const form = geUIHelper.el('#myForm');
const url = form.getAttribute('action');

geUIHelper.handleForm(form, async (data) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res;
});
```

### Error Handling

```js
geUIHelper.error('Something went wrong', error);
```


### Simple single key

```js

geUIHelper.onKey('f', () => console.log('F pressed'));

// With modifiers
geUIHelper.onKey('Ctrl+S', () => {
  geUIHelper.toast('Saved!', 'success');
});

// Ctrl + Shift + P
geUIHelper.onKey('Ctrl+Shift+P', () => { /* open command palette */ });

// Global Escape already handled automatically
```

---

## Extending geUIHelper

### Example: `js/geMenu.js`

```js
import geUIHelper from './geuihelper.js';

export default class geMenu extends geUIHelper {

  static initDropdown(triggerSelector, menuSelector) {
    geUIHelper.els(triggerSelector).forEach(trigger => {
      const menu = trigger.nextElementSibling;
      geUIHelper.on(trigger, 'click', e => {
        e.stopPropagation();
        geUIHelper.toggleClass(menu, 'active');
      });
    });
  }
}
```

### Usage in `main.js`

```js
import geMenu from './js/geMenu.js';

geMenu.initDropdown('.dropdown-trigger', '.dropdown-menu');
geMenu.toast('Ready', 'success');
```

---

**Simple, clean, and ready to use.**

Save this as `README.md` in your project root.  
Let me know if you want to add more sections!