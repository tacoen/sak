// ken.js — geUI Showcase Entry Point
// Demonstrates geUIHelper + icx full API, plus the extension pattern from README-js.md.

import geUIHelper from './src/js/geui.js';
import icx from './src/js/ge-icon.js';

// ─────────────────────────────────────────────────
//  EXTENSION: geDropdown  (pattern from README-js.md)
//  Extends geUIHelper so it inherits all base methods
//  while adding its own initDropdown static method.
// ─────────────────────────────────────────────────
class geDropdown extends geUIHelper {
  /**
   * Wire dropdown triggers.
   * @param {string} triggerSelector  — selector for trigger buttons
   */
  static initDropdown(triggerSelector) {
    try {
      geUIHelper.els(triggerSelector).forEach(trigger => {
        const menu = trigger.nextElementSibling;
        if (!menu) return;

        geUIHelper.on(trigger, 'click', e => {
          e.stopPropagation();
          // Close all other open dropdowns
          geUIHelper.els('.ken-dropdown-menu.active').forEach(m => {
            if (m !== menu) geUIHelper.removeClass(m, 'active');
          });
          geUIHelper.toggleClass(menu, 'active');
        });
      });

      // Global click → close all open dropdowns
      document.addEventListener('click', () => {
        geUIHelper.els('.ken-dropdown-menu.active').forEach(m => {
          geUIHelper.removeClass(m, 'active');
        });
      });
    } catch (e) {
      geUIHelper.error('geDropdown.initDropdown failed', e);
    }
  }
}

// ─────────────────────────────────────────────────
//  Icon list (all names available in icons.js)
// ─────────────────────────────────────────────────
const ALL_ICONS = [
  'activity-heartbeat', 'adjustments-horizontal', 'ai-agents', 'ai-chara',
  'ai-content', 'ai-dialog', 'ai-file', 'ai-fill', 'api-book', 'archive',
  'arrow-left', 'arrow-right', 'blockquote', 'book', 'books',
  'chart-infographic', 'check', 'checkup-list', 'download', 'edit',
  'eye', 'file-text', 'file-text-ai', 'folder', 'folder-bolt',
  'folder-share', 'folder-symlink', 'github', 'grip-vertical',
  'input-ai', 'layout-kanban', 'letter-s-fill', 'library-photo',
  'list', 'list-numbers', 'lock', 'lock-open-2', 'markdown', 'moon',
  'notebook', 'pencil', 'photo', 'refresh', 'settings-cog',
  'subtitles-ai', 'sun', 'sun-moon', 'synote', 't-save', 'device-floppy',
  'trash', 'upload', 'user', 'user-star', 'users-group', 'video', 'x',
];

// ─────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────

/** Safely bind a click handler; no-ops if el is null. */
function onClick(id, fn) {
  try {
    const el = geUIHelper.el(`#${id}`);
    if (!el) { console.warn(`ken.js: #${id} not found`); return; }
    geUIHelper.on(el, 'click', fn);
  } catch (e) {
    geUIHelper.error(`onClick binding failed for #${id}`, e);
  }
}

// ─────────────────────────────────────────────────
//  Render icon grid using icx.icon() JS API
// ─────────────────────────────────────────────────
function buildIconGrid() {
  try {
    const grid = geUIHelper.el('#iconGrid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();

    ALL_ICONS.forEach(name => {
      const cell = document.createElement('div');
      cell.className = 'icon-cell';
      cell.title = name;

      // icx.icon() renders the SVG as an HTML string
      const svgStr = icx.icon(name);
      const label = document.createElement('span');
      label.className = 'icon-cell-name';
      label.textContent = name;

      const wrap = document.createElement('div');
      wrap.innerHTML = svgStr;
      const svg = wrap.firstChild;

      if (svg) cell.appendChild(svg);
      cell.appendChild(label);
      fragment.appendChild(cell);
    });

    grid.appendChild(fragment);
  } catch (e) {
    geUIHelper.error('Icon grid failed', e);
  }
}

// ─────────────────────────────────────────────────
//  Toast section
// ─────────────────────────────────────────────────
function initToasts() {
  onClick('toastSuccess', () => geUIHelper.toast('✓ Operation completed successfully!', 'success'));
  onClick('toastError',   () => geUIHelper.toast('✗ Something went wrong. Please retry.', 'error', 5000));
  onClick('toastInfo',    () => geUIHelper.toast('ℹ Ctrl+K opens search anywhere.', 'info'));
  onClick('toastWarning', () => geUIHelper.toast('⚠ This action cannot be undone.', 'warning'));
}

// ─────────────────────────────────────────────────
//  Modal section
// ─────────────────────────────────────────────────
function initModal() {
  onClick('openDemoModal', () => geUIHelper.modal('open', 'demoModal'));
  onClick('closeDemoModal', () => geUIHelper.modal('close', 'demoModal'));

  // Confirm button inside modal — also closes
  onClick('closeDemoModal2', () => {
    geUIHelper.toast('Confirmed!', 'success');
    geUIHelper.modal('close', 'demoModal');
  });

  // Destroy removes the node from the DOM entirely
  onClick('destroyDemoModal', () => {
    geUIHelper.toast('modal("destroy") — node removed. Refresh to restore.', 'info', 4000);
    geUIHelper.modal('destroy', 'demoModal');
  });
}

// ─────────────────────────────────────────────────
//  Theme section buttons (setDark / setLight / readTheme)
// ─────────────────────────────────────────────────
function initThemeSection() {
  onClick('setDark', () => {
    geUIHelper.setTheme('dark');
    geUIHelper.toast("setTheme('dark') applied", 'info', 1500);
  });

  onClick('setLight', () => {
    geUIHelper.setTheme('light');
    geUIHelper.toast("setTheme('light') applied", 'info', 1500);
  });

  onClick('readTheme', () => {
    const t = geUIHelper.getCurrentTheme();
    geUIHelper.toast(`getCurrentTheme() → "${t}"`, 'info');
  });
}

// ─────────────────────────────────────────────────
//  Form with HTML5 validation via handleForm
// ─────────────────────────────────────────────────
function initForm() {
  try {
    const form = geUIHelper.el('#demoForm');
    if (!form) return;

    geUIHelper.handleForm(form, async (data, _form) => {
      // Simulated async submission
      await new Promise(r => setTimeout(r, 400));

      // handleForm shows success toast + resets form automatically on { ok: true }
      console.log('[ken demo] form submitted:', data);
      return { ok: true };
    });
  } catch (e) {
    geUIHelper.error('Form init failed', e);
  }
}

// ─────────────────────────────────────────────────
//  Theme toggle
// ─────────────────────────────────────────────────
function initThemeToggle() {
  try {
    const btn = geUIHelper.el('#themeToggle');
    if (!btn) return;

    const updateIcon = () => {
      const theme = geUIHelper.getCurrentTheme();
      // Replace icon via icx.icon() into the button
      btn.innerHTML = icx.icon(theme === 'dark' ? 'sun' : 'moon');
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    };

    geUIHelper.on(btn, 'click', () => {
      const next = geUIHelper.getCurrentTheme() === 'dark' ? 'light' : 'dark';
      geUIHelper.setTheme(next);
      updateIcon();
      geUIHelper.toast(`Theme → ${next}`, 'info', 1500);
    });

    updateIcon();
  } catch (e) {
    geUIHelper.error('Theme toggle failed', e);
  }
}

// ─────────────────────────────────────────────────
//  Keyboard shortcuts (geUIHelper.onKey)
// ─────────────────────────────────────────────────
function initKeyboardShortcuts() {
  // Ctrl+S → simulated save
  geUIHelper.onKey('Ctrl+S', () => {
    geUIHelper.toast('Ctrl+S — Document saved!', 'success');
  });

  // Ctrl+K → search shortcut (global, already registered by geUIHelper.initGlobalKeys)
  // We override it here to show a more descriptive toast
  geUIHelper.onKey('Ctrl+K', () => {
    geUIHelper.toast('Ctrl+K — Search palette opened (demo)', 'info');
  });

  // Ctrl+Shift+D → toggle dark/light
  geUIHelper.onKey('Ctrl+Shift+D', () => {
    const next = geUIHelper.getCurrentTheme() === 'dark' ? 'light' : 'dark';
    geUIHelper.setTheme(next);
    geUIHelper.toast(`Ctrl+Shift+D → theme: ${next}`, 'info', 1500);
  });

  // T → fire test toast
  geUIHelper.onKey('t', () => {
    geUIHelper.toast('T key pressed — test toast fired!', 'info', 2000);
  }, { preventDefault: false });
}

// ─────────────────────────────────────────────────
//  Accordion (geUIHelper.accordion)
// ─────────────────────────────────────────────────
function initAccordion() {
  // Single-mode accordion (data-single attr closes others on open)
  geUIHelper.accordion('.accordion');
}

// ─────────────────────────────────────────────────
//  DOM utility demos (show/hide/toggle/class)
// ─────────────────────────────────────────────────
function initDomUtils() {
  const target = geUIHelper.el('#utilTarget');

  onClick('utilShow',         () => { geUIHelper.show(target);              geUIHelper.toast('show() called', 'info', 1500); });
  onClick('utilHide',         () => { geUIHelper.hide(target);              geUIHelper.toast('hide() called', 'info', 1500); });
  onClick('utilToggle',       () => { geUIHelper.toggle(target);            geUIHelper.toast('toggle() called', 'info', 1500); });
  onClick('utilAddClass',     () => { geUIHelper.addClass(target, 'text-pr'); geUIHelper.toast('addClass(text-pr)', 'info', 1500); });
  onClick('utilRemoveClass',  () => { geUIHelper.removeClass(target, 'text-pr'); geUIHelper.toast('removeClass(text-pr)', 'info', 1500); });
  onClick('utilToggleClass',  () => { geUIHelper.toggleClass(target, 'text-pr'); geUIHelper.toast('toggleClass(text-pr)', 'info', 1500); });
}

// ─────────────────────────────────────────────────
//  geDropdown (extension demo)
// ─────────────────────────────────────────────────
function initDropdown() {
  geDropdown.initDropdown('.ken-dropdown-trigger');
}

// ─────────────────────────────────────────────────
//  Sidebar smooth scroll
// ─────────────────────────────────────────────────
function initSidebarNav() {
  try {
    geUIHelper.els('a.ken-nav-item[href^="#"]').forEach(link => {
      geUIHelper.on(link, 'click', e => {
        e.preventDefault();
        const target = geUIHelper.el(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  } catch (e) {
    geUIHelper.error('Sidebar nav failed', e);
  }
}

// ─────────────────────────────────────────────────
//  Boot
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Replace all [data-icon] elements in the DOM
    icx.replace();

    // 2. Build icon grid via icx.icon() JS API
    buildIconGrid();

    // 3. Components
    geUIHelper.tabs('.tabmenu');
    initAccordion();

    // 4. Interactions
    initToasts();
    initModal();
    initForm();
    initThemeToggle();
    initThemeSection();
    initKeyboardShortcuts();
    initDomUtils();
    initDropdown();
    initSidebarNav();

    // 5. Log ready
    console.info('[ken] geUI showcase ready. geUIHelper + icx + geDropdown loaded.');
  } catch (e) {
    geUIHelper.error('Ken boot failed', e);
  }
});
