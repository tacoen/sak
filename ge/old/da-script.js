// da-script.js — geUI Build Reference Entry Point
// Single ES module. Imports geUIHelper + icx. No inline onclick anywhere.

import geUIHelper from './src/js/geui.js';
import icx from './src/js/ge-icon.js';

// ─────────────────────────────────────────────────
//  EXTENSION: geDropdown
//  Extends geUIHelper. Manages .dd-trigger → .dd-menu.
//  Closing siblings on open; global click closes all.
// ─────────────────────────────────────────────────
class geDropdown extends geUIHelper {
  static init(triggerSelector) {
    try {
      geUIHelper.els(triggerSelector).forEach(trigger => {
        const menu = trigger.nextElementSibling;
        if (!menu) return;

        geUIHelper.on(trigger, 'click', e => {
          e.stopPropagation();
          // Close all other open dropdowns
          geUIHelper.els('.dd-menu.active').forEach(m => {
            if (m !== menu) geUIHelper.removeClass(m, 'active');
          });
          geUIHelper.toggleClass(menu, 'active');
        });
      });

      document.addEventListener('click', () => {
        geUIHelper.els('.dd-menu.active').forEach(m =>
          geUIHelper.removeClass(m, 'active')
        );
      });
    } catch (e) {
      geUIHelper.error('geDropdown.init failed', e);
    }
  }
}

// ─────────────────────────────────────────────────
//  initDaAccordion
//  Handles the outer .da-accordion page sections.
//  Uses .da-acc-header (NOT .accordion-header) to
//  avoid conflict with inner .demo-accordion items
//  which are handled by geUIHelper.accordion().
// ─────────────────────────────────────────────────
function initDaAccordion() {
  try {
    geUIHelper.els('.da-accordion').forEach(accordion => {

      // Click handler on the accordion container (event delegation)
      geUIHelper.on(accordion, 'click', e => {
        const header = e.target.closest('.da-acc-header');
        if (!header) return;
        _toggleDaItem(header);
      });

      // Keyboard handler
      geUIHelper.on(accordion, 'keydown', e => {
        const header = e.target.closest('.da-acc-header');
        if (!header) return;

        const headers = accordion.querySelectorAll('.da-acc-header');
        const index = Array.from(headers).indexOf(header);

        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            _toggleDaItem(header);
            break;
          case 'ArrowDown':
            e.preventDefault();
            headers[(index + 1) % headers.length]?.focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            headers[(index - 1 + headers.length) % headers.length]?.focus();
            break;
          case 'Escape': {
            const item = header.parentElement;
            if (item.classList.contains('active')) {
              geUIHelper.removeClass(item, 'active');
              header.setAttribute('aria-expanded', 'false');
            }
            break;
          }
        }
      });
    });
  } catch (e) {
    geUIHelper.error('initDaAccordion failed', e);
  }
}

function _toggleDaItem(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('active');
  geUIHelper.toggleClass(item, 'active');
  header.setAttribute('aria-expanded', String(!isOpen));
}

// ─────────────────────────────────────────────────
//  initContextMenu
//  Right-click on #ctxTarget → position and show #ctxMenu
// ─────────────────────────────────────────────────
function initContextMenu() {
  try {
    const target = geUIHelper.el('#ctxTarget');
    const menu   = geUIHelper.el('#ctxMenu');
    if (!target || !menu) return;

    geUIHelper.on(target, 'contextmenu', e => {
      e.preventDefault();
      menu.style.left = e.clientX + 'px';
      menu.style.top  = e.clientY + 'px';
      geUIHelper.addClass(menu, 'active');
      icx.delayreplace('[data-icon]');
    });

    // Close on any click elsewhere
    document.addEventListener('click', () =>
      geUIHelper.removeClass(menu, 'active')
    );

    // Close if contextmenu fires outside the target
    document.addEventListener('contextmenu', e => {
      if (!target.contains(e.target)) {
        geUIHelper.removeClass(menu, 'active');
      }
    });

    // Wire context menu items → toast feedback
    geUIHelper.els('.ctx-item').forEach(item => {
      geUIHelper.on(item, 'click', () => {
        const action = item.dataset.action || 'action';
        const type   = action === 'delete' ? 'error' : 'info';
        geUIHelper.toast(`Context: ${action}`, type, 2000);
      });
    });
  } catch (e) {
    geUIHelper.error('initContextMenu failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initToasts
// ─────────────────────────────────────────────────
function initToasts() {
  try {
    const onClick = (id, fn) => {
      const el = geUIHelper.el(`#${id}`);
      if (el) geUIHelper.on(el, 'click', fn);
    };

    onClick('toastSuccess', () => geUIHelper.toast('Saved successfully!', 'success'));
    onClick('toastError',   () => geUIHelper.toast('Something went wrong. Please retry.', 'error', 5000));
    onClick('toastInfo',    () => geUIHelper.toast('Here is some useful information.', 'info'));
    onClick('toastWarning', () => geUIHelper.toast('This action cannot be undone.', 'warning'));
  } catch (e) {
    geUIHelper.error('initToasts failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initModals
// ─────────────────────────────────────────────────
function initModals() {
  try {
    const onClick = (id, fn) => {
      const el = geUIHelper.el(`#${id}`);
      if (el) geUIHelper.on(el, 'click', fn);
    };

    // Info modal
    onClick('openInfoModal',    () => geUIHelper.modal('open',  'infoModal'));
    onClick('closeInfoModal',   () => geUIHelper.modal('close', 'infoModal'));
    onClick('confirmInfoModal', () => {
      geUIHelper.toast('Confirmed!', 'success');
      geUIHelper.modal('close', 'infoModal');
    });

    // Danger modal
    onClick('openDangerModal',    () => geUIHelper.modal('open',  'dangerModal'));
    onClick('closeDangerModal',   () => geUIHelper.modal('close', 'dangerModal'));
    onClick('confirmDangerModal', () => {
      geUIHelper.toast('Item deleted.', 'error', 2000);
      geUIHelper.modal('close', 'dangerModal');
    });
  } catch (e) {
    geUIHelper.error('initModals failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initForm
// ─────────────────────────────────────────────────
function initForm() {
  try {
    const form = geUIHelper.el('#daContactForm');
    if (!form) return;

    geUIHelper.handleForm(form, async (data) => {
      // Simulate async save
      await new Promise(r => setTimeout(r, 300));
      console.log('[da] form submitted:', data);
      return { ok: true };
    });
  } catch (e) {
    geUIHelper.error('initForm failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initThemeToggle
// ─────────────────────────────────────────────────
function initThemeToggle() {
  try {
    const btn = geUIHelper.el('#themeToggle');
    if (!btn) return;

    const updateIcon = () => {
      const theme = geUIHelper.getCurrentTheme();
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
    geUIHelper.error('initThemeToggle failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initCopyButtons
//  Each .da-copy-btn copies the nearest .da-code pre text
// ─────────────────────────────────────────────────
function initCopyButtons() {
  try {
    geUIHelper.els('.da-copy-btn').forEach(btn => {
      geUIHelper.on(btn, 'click', async () => {
        const wrap = btn.closest('.da-code-wrap');
        const pre  = wrap?.querySelector('.da-code');
        if (!pre) return;

        try {
          await navigator.clipboard.writeText(pre.textContent.trim());
          // Brief visual feedback: swap icon to check
          const prev = btn.innerHTML;
          btn.innerHTML = icx.icon('check');
          setTimeout(() => { btn.innerHTML = prev; }, 1200);
          geUIHelper.toast('Code copied!', 'success', 1500);
        } catch {
          geUIHelper.toast('Could not copy — select and copy manually.', 'warning', 3000);
        }
      });
    });
  } catch (e) {
    geUIHelper.error('initCopyButtons failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initSidebarNav
//  Smooth scroll to sections; highlight active link
// ─────────────────────────────────────────────────
function initSidebarNav() {
  try {
    geUIHelper.els('a.da-nav-item[href^="#"]').forEach(link => {
      geUIHelper.on(link, 'click', e => {
        e.preventDefault();
        const target = geUIHelper.el(link.getAttribute('href'));
        if (!target) return;

        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Expand the accordion item if it isn't already open
        const item = target.closest?.('.accordion-item') ?? target;
        if (item && !item.classList.contains('active')) {
          const header = item.querySelector('.da-acc-header');
          if (header) _toggleDaItem(header);
        }

        // Mark active sidebar link
        geUIHelper.els('a.da-nav-item').forEach(l =>
          geUIHelper.removeClass(l, 'active')
        );
        geUIHelper.addClass(link, 'active');
      });
    });
  } catch (e) {
    geUIHelper.error('initSidebarNav failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initDropdownItemFeedback
//  Dropdown items toast on click so the demo feels alive
// ─────────────────────────────────────────────────
function initDropdownItemFeedback() {
  try {
    geUIHelper.els('.dd-item').forEach(item => {
      geUIHelper.on(item, 'click', () => {
        const label = item.textContent.trim();
        const type  = item.classList.contains('dd-item-danger') ? 'error' : 'info';
        geUIHelper.toast(label, type, 1800);
      });
    });
  } catch (e) {
    geUIHelper.error('initDropdownItemFeedback failed', e);
  }
}

// ─────────────────────────────────────────────────
//  initVmenuFeedback
//  vmenu items show toast on click; toggle active class
// ─────────────────────────────────────────────────
function initVmenuFeedback() {
  try {
    geUIHelper.els('a.vmenu-item').forEach(item => {
      geUIHelper.on(item, 'click', e => {
        e.preventDefault();
        // Update active state within the same .vmenu
        const vmenu = item.closest('.vmenu');
        vmenu?.querySelectorAll('a.vmenu-item').forEach(i =>
          geUIHelper.removeClass(i, 'active')
        );
        if (!item.classList.contains('vmenu-item-danger')) {
          geUIHelper.addClass(item, 'active');
        }
        const label = item.textContent.trim();
        const type  = item.classList.contains('vmenu-item-danger') ? 'error' : 'info';
        geUIHelper.toast(label, type, 1800);
      });
    });
  } catch (e) {
    geUIHelper.error('initVmenuFeedback failed', e);
  }
}

// ─────────────────────────────────────────────────
//  Boot
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    // 1. Hydrate all [data-icon] elements
    icx.replace();

    // 2. Outer page accordion (da-acc-header, custom handler)
    initDaAccordion();

    // 3. Inner demo accordion (accordion-header, geUIHelper handles it)
    geUIHelper.accordion('.demo-accordion');

    // 4. Tabs
    geUIHelper.tabs('.tabmenu');

    // 5. Dropdown
    geDropdown.init('.dd-trigger');

    // 6. Context menu
    initContextMenu();

    // 7. Modals
    initModals();

    // 8. Toasts
    initToasts();

    // 9. Form
    initForm();

    // 10. Theme toggle
    initThemeToggle();

    // 11. Copy buttons
    initCopyButtons();

    // 12. Sidebar nav + active link
    initSidebarNav();

    // 13. Demo feedback (dropdown + vmenu)
    initDropdownItemFeedback();
    initVmenuFeedback();

    console.info('[da] Build Reference ready.');
  } catch (e) {
    geUIHelper.error('da boot failed', e);
  }
});
