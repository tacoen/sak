// file: geui.js

export default class geUIHelper {

  static el(sel) { return document.querySelector(sel); }
  static els(sel) { return [...document.querySelectorAll(sel)]; }

  static show(el) { if(el) el.style.display = ''; }
  static hide(el) { if(el) el.style.display = 'none'; }
  static toggle(el) { if(el) el.style.display = el.style.display === 'none' ? '' : 'none'; }

  static addClass(el, cls) { el?.classList.add(cls); }
  static removeClass(el, cls) { el?.classList.remove(cls); }
  static toggleClass(el, cls) { el?.classList.toggle(cls); }

  static on(el, ev, fn, opt) { el?.addEventListener(ev, fn, opt); }

  // ==================== COPY ====================
  // Wire a copy button to a textarea or pre element. No clipboard API — uses execCommand.
  // Usage: geUIHelper.copy(btnEl, targetEl)
  // Usage: geUIHelper.copy(btnEl, targetEl, { success: 'Copied!', duration: 1500 })
  static copy(btn, target, options = {}) {
    if (!btn || !target) return;
    const { success = 'Copied!', duration = 1500 } = options;
    const label = btn.textContent;

    geUIHelper.on(btn, 'click', () => {
      try {
        if (target.tagName === 'TEXTAREA') {
          target.select();
          target.setSelectionRange(0, 99999);
        } else {
          const sel = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(target);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        const ok = document.execCommand('copy');
        window.getSelection()?.removeAllRanges();

        if (ok) {
          btn.textContent = success;
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = label;
            btn.disabled = false;
          }, duration);
        }
      } catch (e) {
        geUIHelper.error('Copy failed', e);
      }
    });
  }

  // ==================== EASY KEYBOARD SHORTCUTS ====================
  static onKey(keyCombo, callback, options = {}) {
    const { target = document, preventDefault = true } = options;

    const handler = (e) => {
      const pressed = [];
      if (e.ctrlKey) pressed.push('Ctrl');
      if (e.altKey) pressed.push('Alt');
      if (e.shiftKey) pressed.push('Shift');
      if (e.metaKey) pressed.push('Meta');

      pressed.push(e.key.toUpperCase());

      const combo = pressed.join('+');

      if (combo === keyCombo.toUpperCase() || 
          e.key.toUpperCase() === keyCombo.toUpperCase()) {
        if (preventDefault) e.preventDefault();
        callback(e);
      }
    };

    geUIHelper.on(target, 'keydown', handler);
    return handler; // return so user can remove listener if needed
  }

  // Example shortcuts
  static initGlobalKeys() {
    // Example: Ctrl/Cmd + K → open search
    geUIHelper.onKey('Ctrl+K', () => {
      geUIHelper.toast('Search opened (demo)', 'info');
    });

    // Example: Escape anywhere
    geUIHelper.onKey('Escape', () => {
      const activeModal = geUIHelper.el('.modal.active');
      if (activeModal) geUIHelper.modal('close', activeModal.id);
    });
  }

  // ==================== ERROR HANDLER ====================
  static error(msg, err = null) {
    const fullMsg = `[geUI] ${msg}`;
    console.error(fullMsg, err || '');
    geUIHelper.toast(fullMsg, 'error', 5000);
  }

  // ==================== AUTO INIT THEME ====================
  static {
    try {
      geUIHelper.initTheme();
      geUIHelper.initGlobalKeys();   // auto init global shortcuts
    } catch (e) {
      geUIHelper.error('Initialization failed', e);
    }
  }

  // ==================== THEME ====================
  static setTheme(theme) {
    try {
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
    } catch (e) {
      geUIHelper.error('Failed to set theme', e);
    }
  }

  static initTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) {
        geUIHelper.setTheme(saved);
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        geUIHelper.setTheme(isDark ? 'dark' : 'light');
      }
    } catch (e) {
      geUIHelper.error('Theme init failed', e);
    }
  }

  static getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme');
  }

  // ==================== TOAST ====================
  static toast(msg, type = 'info', duration = 3000) {
    try {
      let container = geUIHelper.el('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = msg;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    } catch (e) {
      console.error('[geUI] Toast failed', e);
    }
  }

  // ==================== FORM ====================

  // Ensure the form has a name attribute, and every field has a unique id.
  // Called automatically by handleForm — safe to call manually after dynamic
  // fields are injected into an existing form.
  static prepareForm(form) {
    if (!form) return;

    // ── Form name ──────────────────────────────────────────────
    if (!form.name) {
      form.name = form.id || `form-${Math.random().toString(36).slice(2, 7)}`;
    }

    // ── Field ids ──────────────────────────────────────────────
    // Track all ids already present in the document so we never collide.
    const usedIds = new Set(
      [...document.querySelectorAll('[id]')].map(el => el.id)
    );

    const fields = form.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
      if (field.id) return; // already has one — leave it alone

      // Derive a readable base from name / type / tag, then make it unique.
      const base = (field.name || field.type || field.tagName.toLowerCase())
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      let candidate = `${form.name}-${base}`;
      let suffix = 2;
      while (usedIds.has(candidate)) {
        candidate = `${form.name}-${base}-${suffix++}`;
      }

      field.id = candidate;
      usedIds.add(candidate);

      // Wire any label that references this field by name but has no for= yet.
      // Look for a label that is a sibling ancestor and has no for attribute.
const label = field.closest('label') ??
  form.querySelector(`label[for="${field.name}"]`) ??
  (field.previousElementSibling?.matches?.('label') && !field.previousElementSibling.htmlFor
    ? field.previousElementSibling
    : null);

      if (label && !label.htmlFor) label.htmlFor = field.id;
    });
  }

  static handleForm(form, onSuccess) {
    if (!form) return;
    try {
      form.noValidate = false;

      // Guarantee accessible ids/names before the first submit attempt.
      geUIHelper.prepareForm(form);

      form.addEventListener('submit', async e => {
        e.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          geUIHelper.toast('Please fix the errors', 'error');
          return;
        }

        try {
          const data = Object.fromEntries(new FormData(form));
          const result = await onSuccess(data, form);
          if (result?.ok || result === true) {
            geUIHelper.toast('Success!', 'success');
            form.reset();
          }
        } catch (err) {
          geUIHelper.error('Form submission error', err);
        }
      });
    } catch (e) {
      geUIHelper.error('Failed to setup form handler', e);
    }
  }

  // ==================== TABS with Full ARIA & Keyboard ====================
  static tabs(selector = '.tabmenu') {
    try {
      document.querySelectorAll(selector).forEach(menu => {
        menu.setAttribute('role', 'tablist');

        const tabs = menu.querySelectorAll('li');
        const scope = menu.dataset.scope;
        const container = document.getElementById(scope);

        tabs.forEach((tab, index) => {
          tab.setAttribute('role', 'tab');
          tab.setAttribute('tabindex', '0');
          tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');

          // Click
          tab.addEventListener('click', () => {
            geUIHelper._activateTab(tab, tabs, container);
          });

          // Keyboard
          tab.addEventListener('keydown', e => {
            geUIHelper._handleTabKeyboard(e, tab, index, tabs, container);
          });
        });

        // Activate first tab if none active
        if (!menu.querySelector('li.active') && tabs.length > 0) {
          geUIHelper._activateTab(tabs[0], tabs, container);
        }

        // Set tabpanel roles on content
        if (container) {
          container.querySelectorAll('.tab').forEach(panel => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '0');
          });
        }
      });
    } catch (e) {
      geUIHelper.error('Tabs initialization failed', e);
    }
  }

  static _activateTab(tab, tabs, container) {
    tabs.forEach(t => {
      geUIHelper.removeClass(t, 'active');
      t.setAttribute('aria-selected', 'false');
    });

    geUIHelper.addClass(tab, 'active');
    tab.setAttribute('aria-selected', 'true');

    if (container) {
      container.querySelectorAll('.tab').forEach(p => {
        geUIHelper.removeClass(p, 'active');
        p.setAttribute('hidden', 'true');
      });

      const target = container.querySelector(`#${tab.dataset.tab}`);
      if (target) {
        geUIHelper.addClass(target, 'active');
        target.removeAttribute('hidden');
      }
    }
  }

  static _handleTabKeyboard(e, tab, index, tabs, container) {
    const count = tabs.length;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const next = tabs[(index + 1) % count];
        next.focus();
        geUIHelper._activateTab(next, tabs, container);
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prev = tabs[(index - 1 + count) % count];
        prev.focus();
        geUIHelper._activateTab(prev, tabs, container);
        break;

      case 'Home':
        e.preventDefault();
        tabs[0].focus();
        geUIHelper._activateTab(tabs[0], tabs, container);
        break;

      case 'End':
        e.preventDefault();
        tabs[count - 1].focus();
        geUIHelper._activateTab(tabs[count - 1], tabs, container);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        geUIHelper._activateTab(tab, tabs, container);
        break;
    }
  }

  // ==================== ACCORDION ====================
  static accordion(selector = '.accordion') {
    try {
      geUIHelper.els(selector).forEach(accordion => {
        geUIHelper.on(accordion, 'click', e => {
          const header = e.target.closest('.accordion-header');
          if (!header) return;
          geUIHelper._toggleAccordionItem(header, accordion);
        });

        geUIHelper.on(accordion, 'keydown', e => {
          const header = e.target.closest('.accordion-header');
          if (!header) return;

          const headers = accordion.querySelectorAll('.accordion-header');
          const index = Array.from(headers).indexOf(header);
          geUIHelper._accordionKeyboard(e, header, index, headers, accordion);
        });

        const headers = accordion.querySelectorAll('.accordion-header');
        headers.forEach(header => {
          header.setAttribute('tabindex', '0');
          header.setAttribute('role', 'button');
          header.setAttribute('aria-expanded', header.parentElement.classList.contains('active') ? 'true' : 'false');

          const content = header.nextElementSibling;
          if (content) content.setAttribute('role', 'region');
        });
      });
    } catch (e) {
      geUIHelper.error('Accordion initialization failed', e);
    }
  }

  static _toggleAccordionItem(header, accordion) {
    const item = header.parentElement;
    const isOpen = item.classList.contains('active');

    if (accordion.hasAttribute('data-single') && !isOpen) {
      accordion.querySelectorAll('.accordion-item.active').forEach(i => {
        geUIHelper.removeClass(i, 'active');
        const h = i.querySelector('.accordion-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });
    }

    geUIHelper.toggleClass(item, 'active');
    header.setAttribute('aria-expanded', !isOpen);
  }

  static _accordionKeyboard(e, header, index, headers, accordion) {
    const itemCount = headers.length;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        geUIHelper._toggleAccordionItem(header, accordion);
        break;

      case 'ArrowDown':
        e.preventDefault();
        headers[(index + 1) % itemCount].focus();
        break;

      case 'ArrowUp':
        e.preventDefault();
        headers[(index - 1 + itemCount) % itemCount].focus();
        break;

      case 'Home':
        e.preventDefault();
        headers[0].focus();
        break;

      case 'End':
        e.preventDefault();
        headers[itemCount - 1].focus();
        break;

      case 'Escape':
        const item = header.parentElement;
        if (item.classList.contains('active')) {
          geUIHelper.removeClass(item, 'active');
          header.setAttribute('aria-expanded', 'false');
        }
        break;
    }
  }

  // ==================== MODAL ====================
  static modal(action, modalId) {
    try {
      const modal = geUIHelper.el(`#${modalId}`);
      if (!modal) {
        geUIHelper.error(`Modal #${modalId} not found`);
        return;
      }

      let overlay = geUIHelper.el('.overlay') || geUIHelper.createOverlay();

      if (action === 'open') {
        geUIHelper._lastFocused = document.activeElement;
        if (modal.parentNode !== overlay) overlay.appendChild(modal);
        
        geUIHelper.show(overlay);
        geUIHelper.show(modal);
        geUIHelper.addClass(overlay, 'active');
        geUIHelper.addClass(modal, 'active');

        geUIHelper.trapFocus(modal);
      } 
      else if (action === 'close') {
        geUIHelper.releaseFocus();
        geUIHelper.hide(modal);
        geUIHelper.hide(overlay);
        geUIHelper.removeClass(modal, 'active');
        geUIHelper.removeClass(overlay, 'active');

        geUIHelper._lastFocused?.focus();
        delete geUIHelper._lastFocused;
      } 
      else if (action === 'destroy') {
        geUIHelper.releaseFocus();
        modal.remove();
      }
    } catch (e) {
      geUIHelper.error(`Modal ${action} failed`, e);
    }
  }

  static trapFocus(modal) {
    const focusable = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', geUIHelper._trapHandler = e => {
      if (e.key === 'Escape') { geUIHelper.modal('close', modal.id); return; }
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    });

    first?.focus();
  }

  static releaseFocus() {
    if (geUIHelper._trapHandler) {
      document.removeEventListener('keydown', geUIHelper._trapHandler);
      delete geUIHelper._trapHandler;
    }
  }

  static createOverlay() {
    let overlay = geUIHelper.el('.overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay';
      document.body.appendChild(overlay);

      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          const activeModal = geUIHelper.el('.modal.active');
          if (activeModal) geUIHelper.modal('close', activeModal.id);
        }
      });
    }
    return overlay;
  }
}