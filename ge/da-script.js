// da-script.js — geUI Builder
// Single ES module. All builder logic lives here.

import geUIHelper from './src/js/geui.js';
import icx from './src/js/ge-icon.js';

// ─────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────

const ICONS = [
  '', 'activity-heartbeat', 'adjustments-horizontal', 'archive',
  'arrow-right', 'book', 'books', 'check', 'checkup-list', 'download',
  'edit', 'eye', 'file-text', 'folder', 'folder-bolt', 'folder-share',
  'github', 'layout-kanban', 'letter-s-fill', 'list', 'list-numbers',
  'lock', 'lock-open-2', 'moon', 'notebook', 'pencil', 'refresh',
  'settings-cog', 'sun', 'sun-moon', 'device-floppy', 'trash', 'upload',
  'user', 'user-star', 'users-group', 'x',
];

const PALETTE = [
  { id: 'accordion',    label: 'Accordion',    icon: 'list-numbers' },
  { id: 'dropdown',     label: 'Dropdown',     icon: 'folder' },
  { id: 'vmenu',        label: 'Vert. Menu',   icon: 'layout-kanban' },
  { id: 'contextmenu',  label: 'Context Menu', icon: 'adjustments-horizontal' },
  { id: 'tabs',         label: 'Tabs',         icon: 'list' },
  { id: 'modal',        label: 'Modal',        icon: 'eye' },
  { id: 'toast',        label: 'Toast',        icon: 'activity-heartbeat' },
  { id: 'buttons',      label: 'Buttons',      icon: 'check' },
  { id: 'badges',       label: 'Badges',       icon: 'letter-s-fill' },
  { id: 'cards',        label: 'Cards',        icon: 'notebook' },
  { id: 'form',         label: 'Form',         icon: 'edit' },
];

// ─────────────────────────────────────────────────
//  DEFAULT CONFIGS
// ─────────────────────────────────────────────────

function defaultConfig(id) {
  const map = {
    accordion: {
      single: true,
      items: [
        { title: 'What is this?',        content: 'Your answer goes here.' },
        { title: 'How does it work?',    content: 'Another answer here.' },
        { title: 'Can I add more?',      content: 'Yes — click Add Section.' },
      ],
    },
    dropdown: {
      label: 'Open Menu', variant: 'primary', icon: 'folder',
      items: [
        { type: 'item',    label: 'New File', icon: 'file-text',    danger: false },
        { type: 'item',    label: 'Save',     icon: 'device-floppy',danger: false },
        { type: 'divider' },
        { type: 'item',    label: 'Delete',   icon: 'trash',        danger: true  },
      ],
    },
    vmenu: {
      items: [
        { group: 'Main',    label: 'Dashboard', icon: 'layout-kanban', state: 'active' },
        { group: '',        label: 'Notes',      icon: 'notebook',      state: 'normal' },
        { group: '',        label: 'Library',    icon: 'books',         state: 'normal' },
        { group: 'Account', label: 'Settings',   icon: 'settings-cog',  state: 'normal' },
        { group: '',        label: 'Delete',     icon: 'trash',         state: 'danger' },
      ],
    },
    contextmenu: {
      items: [
        { type: 'item',    label: 'Edit',   icon: 'edit',         danger: false },
        { type: 'item',    label: 'Copy',   icon: 'download',     danger: false },
        { type: 'item',    label: 'Share',  icon: 'folder-share', danger: false },
        { type: 'divider' },
        { type: 'item',    label: 'Delete', icon: 'trash',        danger: true  },
      ],
    },
    tabs: {
      items: [
        { label: 'Overview', content: 'Content for the overview tab.' },
        { label: 'Details',  content: 'Content for the details tab.'  },
        { label: 'Settings', content: 'Content for the settings tab.' },
      ],
    },
    modal: {
      title: 'Modal Title', titleIcon: 'eye', titleVariant: 'primary',
      body: 'Your modal content goes here.',
      cancelText: 'Cancel', showCancel: true,
      confirmText: 'Confirm', confirmVariant: 'primary',
    },
    toast: {
      message: 'Operation completed!', type: 'success', duration: 3000,
    },
    buttons: {
      items: [
        { label: 'Save',   variant: 'primary', icon: 'device-floppy', iconOnly: false },
        { label: 'Cancel', variant: 'default', icon: '',              iconOnly: false },
        { label: 'Delete', variant: 'danger',  icon: 'trash',         iconOnly: false },
      ],
    },
    badges: {
      items: [
        { label: 'active',   variant: 'success', icon: 'check' },
        { label: 'pending',  variant: 'warning',  icon: ''      },
        { label: 'v2.1.0',   variant: 'primary',  icon: ''      },
        { label: 'archived', variant: 'muted',    icon: 'lock'  },
      ],
    },
    cards: {
      items: [
        { title: 'Default Card', body: 'Neutral card for general content.', variant: 'default', footerBtn: 'View',   btnVariant: 'default', showFooter: true },
        { title: 'Success Card', body: 'Completed or positive status.',      variant: 'success', footerBtn: 'Done',   btnVariant: 'success', showFooter: true },
        { title: 'Danger Card',  body: 'Destructive actions or errors.',     variant: 'danger',  footerBtn: 'Delete', btnVariant: 'danger',  showFooter: true },
      ],
    },
    form: {
      submitText: 'Submit', showReset: true, resetText: 'Reset',
      fields: [
        { label: 'Full Name', type: 'text',     name: 'name',    required: true,  placeholder: 'Ada Lovelace'      },
        { label: 'Email',     type: 'email',    name: 'email',   required: true,  placeholder: 'ada@example.com'   },
        { label: 'Role',      type: 'select',   name: 'role',    required: false, placeholder: ''                  },
        { label: 'Message',   type: 'textarea', name: 'message', required: false, placeholder: 'Tell us anything…' },
      ],
    },
  };
  return JSON.parse(JSON.stringify(map[id]));
}

// ─────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────

let activeId = null;
const configs = {};

function getConfig(id) {
  if (!configs[id]) configs[id] = defaultConfig(id);
  return configs[id];
}

// ─────────────────────────────────────────────────
//  SMALL HELPERS
// ─────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function iconOpt(sel) {
  // Returns <select> of icon names, with data-key attribute
  const opts = ICONS.map(n =>
    `<option value="${n}"${n === sel ? ' selected' : ''}>${n || '(no icon)'}</option>`
  ).join('');
  return `<select class="icon-pick">${opts}</select>`;
}

function iconOptKeyed(val, key) {
  const opts = ICONS.map(n =>
    `<option value="${n}"${n === val ? ' selected' : ''}>${n || '(no icon)'}</option>`
  ).join('');
  return `<select data-key="${key}">${opts}</select>`;
}

function vpick(val, key, variants = ['default','primary','success','danger','warning','ghost']) {
  const btns = variants.map(v =>
    `<button type="button" class="da-vp-btn${v === val ? ' active' : ''}" data-variant="${v}" data-key="${key}">${v}</button>`
  ).join('');
  return `<div class="da-vp">${btns}</div>`;
}

function delBtn(index) {
  return `<button type="button" class="da-item-del" data-del="${index}" aria-label="Remove"><svg data-icon="x"></svg></button>`;
}

function setNested(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let k = 0; k < parts.length - 1; k++) {
    cur = cur[parts[k]];
    if (cur == null) return;
  }
  cur[parts[parts.length - 1]] = value;
}

function arrKey(id) {
  return id === 'form' ? 'fields' : 'items';
}

function svgTag(name) {
  return name ? `<svg data-icon="${name}"></svg>` : '';
}

// indent helper for code gen
function ind(n) { return '  '.repeat(n); }

// ─────────────────────────────────────────────────
//  CONFIG FORM RENDERERS
// ─────────────────────────────────────────────────

const configForms = {

  accordion(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <input type="text" placeholder="Section title"
            value="${esc(item.title)}" data-key="items.${i}.title">
          <textarea rows="2" placeholder="Section content"
            data-key="items.${i}.content">${esc(item.content)}</textarea>
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('list-numbers')} Accordion</div>
      <div class="da-toggle-row">
        <span class="da-toggle-label">Close others when one opens</span>
        <label class="da-toggle">
          <input type="checkbox" data-key="single" ${cfg.single ? 'checked' : ''}>
          <span class="da-toggle-track"></span>
        </label>
      </div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">
          ${svgTag('check')} Add Section
        </button>
      </div>`;
  },

  dropdown(cfg) {
    const rows = cfg.items.map((item, i) => {
      if (item.type === 'divider') return `
        <div class="da-item-row" style="align-items:center;">
          <span class="text-muted text-mono text-sm" style="flex:1;">── divider ──</span>
          ${delBtn(i)}
        </div>`;
      return `
        <div class="da-item-row">
          <div class="da-item-fields">
            <div class="da-item-inline">
              <input type="text" placeholder="Item label"
                value="${esc(item.label)}" data-key="items.${i}.label" style="flex:1;">
              ${iconOptKeyed(item.icon, `items.${i}.icon`)}
              <label style="display:flex;align-items:center;gap:var(--vxs);
                font-family:var(--font-mono);font-size:var(--sm);color:var(--muted);
                cursor:pointer;flex-shrink:0;">
                <input type="checkbox" data-key="items.${i}.danger"
                  ${item.danger ? 'checked' : ''}> danger
              </label>
            </div>
          </div>
          ${delBtn(i)}
        </div>`;
    }).join('');
    return `
      <div class="da-config-title">${svgTag('folder')} Dropdown Menu</div>
      <div class="da-field">
        <span class="da-field-label">Button text</span>
        <input type="text" value="${esc(cfg.label)}" data-key="label">
      </div>
      <div class="da-field">
        <span class="da-field-label">Button color</span>
        ${vpick(cfg.variant, 'variant', ['default','primary','success','danger','warning','ghost'])}
      </div>
      <div class="da-field">
        <span class="da-field-label">Button icon</span>
        ${iconOptKeyed(cfg.icon, 'icon')}
      </div>
      <hr class="da-config-sep">
      <div class="da-field-label" style="margin-bottom:var(--xs)">Menu items</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Item</button>
        <button type="button" class="btn btn-sm" id="addDivider">${svgTag('list')} Add Divider</button>
      </div>`;
  },

  vmenu(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <input type="text" placeholder="Group heading (optional)"
            value="${esc(item.group)}" data-key="items.${i}.group"
            style="font-size:var(--sm);color:var(--muted);">
          <div class="da-item-inline">
            <input type="text" placeholder="Item label"
              value="${esc(item.label)}" data-key="items.${i}.label" style="flex:1;">
            ${iconOptKeyed(item.icon, `items.${i}.icon`)}
            <select data-key="items.${i}.state" style="flex-shrink:0;">
              <option value="normal" ${item.state==='normal'?'selected':''}>Normal</option>
              <option value="active" ${item.state==='active'?'selected':''}>Active</option>
              <option value="danger" ${item.state==='danger'?'selected':''}>Danger</option>
            </select>
          </div>
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('layout-kanban')} Vertical Menu</div>
      <p class="text-muted text-sm" style="margin:0 0 var(--xs);">
        Fill in a <em>Group heading</em> to start a new labelled section above that item.
      </p>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Item</button>
      </div>`;
  },

  contextmenu(cfg) {
    const rows = cfg.items.map((item, i) => {
      if (item.type === 'divider') return `
        <div class="da-item-row" style="align-items:center;">
          <span class="text-muted text-mono text-sm" style="flex:1;">── divider ──</span>
          ${delBtn(i)}
        </div>`;
      return `
        <div class="da-item-row">
          <div class="da-item-inline" style="flex:1;">
            <input type="text" placeholder="Item label"
              value="${esc(item.label)}" data-key="items.${i}.label" style="flex:1;">
            ${iconOptKeyed(item.icon, `items.${i}.icon`)}
            <label style="display:flex;align-items:center;gap:var(--vxs);
              font-family:var(--font-mono);font-size:var(--sm);color:var(--muted);
              cursor:pointer;flex-shrink:0;">
              <input type="checkbox" data-key="items.${i}.danger"
                ${item.danger ? 'checked' : ''}> danger
            </label>
          </div>
          ${delBtn(i)}
        </div>`;
    }).join('');
    return `
      <div class="da-config-title">${svgTag('adjustments-horizontal')} Context Menu</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Item</button>
        <button type="button" class="btn btn-sm" id="addDivider">${svgTag('list')} Add Divider</button>
      </div>`;
  },

  tabs(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <input type="text" placeholder="Tab label"
            value="${esc(item.label)}" data-key="items.${i}.label">
          <textarea rows="2" placeholder="Tab content"
            data-key="items.${i}.content">${esc(item.content)}</textarea>
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('list')} Tabs</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Tab</button>
      </div>`;
  },

  modal(cfg) {
    return `
      <div class="da-config-title">${svgTag('eye')} Modal</div>
      <div class="da-field">
        <span class="da-field-label">Title text</span>
        <input type="text" value="${esc(cfg.title)}" data-key="title">
      </div>
      <div class="da-field">
        <span class="da-field-label">Title color</span>
        ${vpick(cfg.titleVariant, 'titleVariant', ['default','primary','success','danger','warning'])}
      </div>
      <div class="da-field">
        <span class="da-field-label">Title icon</span>
        ${iconOptKeyed(cfg.titleIcon, 'titleIcon')}
      </div>
      <div class="da-field">
        <span class="da-field-label">Body text</span>
        <textarea rows="3" data-key="body">${esc(cfg.body)}</textarea>
      </div>
      <hr class="da-config-sep">
      <div class="da-field">
        <span class="da-field-label">Confirm button text</span>
        <input type="text" value="${esc(cfg.confirmText)}" data-key="confirmText">
      </div>
      <div class="da-field">
        <span class="da-field-label">Confirm button color</span>
        ${vpick(cfg.confirmVariant, 'confirmVariant', ['default','primary','success','danger','warning'])}
      </div>
      <div class="da-toggle-row">
        <span class="da-toggle-label">Show cancel button</span>
        <label class="da-toggle">
          <input type="checkbox" data-key="showCancel" ${cfg.showCancel ? 'checked' : ''}>
          <span class="da-toggle-track"></span>
        </label>
      </div>
      <div class="da-field" id="cancelField" ${!cfg.showCancel ? 'hidden' : ''}>
        <span class="da-field-label">Cancel button text</span>
        <input type="text" value="${esc(cfg.cancelText)}" data-key="cancelText">
      </div>`;
  },

  toast(cfg) {
    return `
      <div class="da-config-title">${svgTag('activity-heartbeat')} Toast Notification</div>
      <div class="da-field">
        <span class="da-field-label">Message</span>
        <input type="text" value="${esc(cfg.message)}" data-key="message">
      </div>
      <div class="da-field">
        <span class="da-field-label">Type</span>
        <div class="da-vp">
          ${['success','error','info','warning'].map(t =>
            `<button type="button" class="da-vp-btn${t===cfg.type?' active':''}"
              data-variant="${t}" data-key="type">${t}</button>`).join('')}
        </div>
      </div>
      <div class="da-field">
        <span class="da-field-label">Duration (seconds)</span>
        <input type="number" min="1" max="30" step="0.5"
          value="${cfg.duration / 1000}" data-key="duration" data-multiply="1000">
      </div>`;
  },

  buttons(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <div class="da-item-inline">
            <input type="text" placeholder="Button text"
              value="${esc(item.label)}" data-key="items.${i}.label"
              style="flex:1;" ${item.iconOnly ? 'disabled' : ''}>
            ${iconOptKeyed(item.icon, `items.${i}.icon`)}
          </div>
          <div class="da-item-inline">
            ${vpick(item.variant, `items.${i}.variant`)}
            <label style="display:flex;align-items:center;gap:var(--vxs);
              font-family:var(--font-mono);font-size:var(--sm);color:var(--muted);
              cursor:pointer;white-space:nowrap;flex-shrink:0;">
              <input type="checkbox" data-key="items.${i}.iconOnly"
                ${item.iconOnly ? 'checked' : ''}> icon only
            </label>
          </div>
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('check')} Buttons</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Button</button>
      </div>`;
  },

  badges(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <div class="da-item-inline">
            <input type="text" placeholder="Badge text"
              value="${esc(item.label)}" data-key="items.${i}.label" style="flex:1;">
            ${iconOptKeyed(item.icon, `items.${i}.icon`)}
          </div>
          ${vpick(item.variant, `items.${i}.variant`, ['default','primary','success','danger','warning','muted'])}
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('letter-s-fill')} Badges</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Badge</button>
      </div>`;
  },

  cards(cfg) {
    const rows = cfg.items.map((item, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <input type="text" placeholder="Card title"
            value="${esc(item.title)}" data-key="items.${i}.title">
          <textarea rows="2" placeholder="Card body"
            data-key="items.${i}.body">${esc(item.body)}</textarea>
          <div class="da-item-inline">
            <span class="text-muted text-sm text-mono" style="flex-shrink:0;">Color:</span>
            ${vpick(item.variant, `items.${i}.variant`, ['default','primary','success','danger','warning'])}
          </div>
          <div class="da-toggle-row" style="margin-bottom:0;">
            <span class="da-toggle-label">Show footer button</span>
            <label class="da-toggle">
              <input type="checkbox" data-key="items.${i}.showFooter"
                ${item.showFooter ? 'checked' : ''}>
              <span class="da-toggle-track"></span>
            </label>
          </div>
          ${item.showFooter ? `
          <div class="da-item-inline">
            <input type="text" placeholder="Button text"
              value="${esc(item.footerBtn)}" data-key="items.${i}.footerBtn" style="flex:1;">
            ${vpick(item.btnVariant, `items.${i}.btnVariant`, ['default','primary','success','danger','warning'])}
          </div>` : ''}
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('notebook')} Cards</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Card</button>
      </div>`;
  },

  form(cfg) {
    const rows = cfg.fields.map((field, i) => `
      <div class="da-item-row">
        <div class="da-item-fields">
          <div class="da-item-inline">
            <input type="text" placeholder="Field label"
              value="${esc(field.label)}" data-key="fields.${i}.label" style="flex:1;">
            <select data-key="fields.${i}.type">
              ${['text','email','password','number','url','tel','select','textarea'].map(t =>
                `<option value="${t}"${t===field.type?' selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="da-item-inline">
            <input type="text" placeholder="Placeholder text"
              value="${esc(field.placeholder)}" data-key="fields.${i}.placeholder" style="flex:1;">
            <label style="display:flex;align-items:center;gap:var(--vxs);
              font-family:var(--font-mono);font-size:var(--sm);color:var(--muted);
              cursor:pointer;flex-shrink:0;">
              <input type="checkbox" data-key="fields.${i}.required"
                ${field.required ? 'checked' : ''}> required
            </label>
          </div>
        </div>
        ${delBtn(i)}
      </div>`).join('');
    return `
      <div class="da-config-title">${svgTag('edit')} Form</div>
      <div class="da-item-list">${rows}</div>
      <div class="da-add-row">
        <button type="button" class="btn btn-sm" id="addItem">${svgTag('check')} Add Field</button>
      </div>
      <hr class="da-config-sep">
      <div class="da-field">
        <span class="da-field-label">Submit button text</span>
        <input type="text" value="${esc(cfg.submitText)}" data-key="submitText">
      </div>
      <div class="da-toggle-row">
        <span class="da-toggle-label">Show Reset button</span>
        <label class="da-toggle">
          <input type="checkbox" data-key="showReset" ${cfg.showReset ? 'checked' : ''}>
          <span class="da-toggle-track"></span>
        </label>
      </div>`;
  },
};

// ─────────────────────────────────────────────────
//  PREVIEW RENDERERS (use actual ge UI CSS classes)
// ─────────────────────────────────────────────────

const previews = {

  accordion(cfg) {
    const items = cfg.items.map((item, i) => `
      <div class="accordion-item ${i===0?'active':''}">
        <div class="accordion-header">
          <span>${esc(item.title)}</span>
          <svg data-icon="arrow-right" class="accordion-chevron"></svg>
        </div>
        <div class="accordion-content">${esc(item.content)}</div>
      </div>`).join('');
    return `<div class="accordion"${cfg.single?' data-single':''}>${items}</div>`;
  },

  dropdown(cfg) {
    const btnCls = cfg.variant==='default' ? 'btn' : `btn btn-${cfg.variant}`;
    const iconH  = cfg.icon ? svgTag(cfg.icon) : '';
    const items  = cfg.items.map(item => {
      if (item.type === 'divider') return `<hr class="dd-divider">`;
      const cls   = item.danger ? 'dd-item dd-item-danger' : 'dd-item';
      const iH    = item.icon ? svgTag(item.icon) : '';
      return `<div class="${cls}">${iH} ${esc(item.label)}</div>`;
    }).join('');
    return `
      <div style="display:flex;flex-direction:column;gap:var(--xs);align-items:flex-start;">
        <button class="${btnCls}">
          ${iconH} ${esc(cfg.label)} <svg data-icon="arrow-right"></svg>
        </button>
        <div class="dd-menu" style="position:relative;display:flex;flex-direction:column;">${items}</div>
      </div>`;
  },

  vmenu(cfg) {
    let html = '<nav class="vmenu">';
    let lastGroup = null;
    cfg.items.forEach(item => {
      if (item.group && item.group !== lastGroup) {
        html += `<span class="vmenu-label">${esc(item.group)}</span>`;
        lastGroup = item.group;
      }
      const cls = item.state==='active' ? 'vmenu-item active'
                : item.state==='danger' ? 'vmenu-item vmenu-item-danger'
                : 'vmenu-item';
      const iH = item.icon ? svgTag(item.icon) : '';
      html += `<a class="${cls}" href="#">${iH} ${esc(item.label)}</a>`;
    });
    html += '</nav>';
    return html;
  },

  contextmenu(cfg) {
    const items = cfg.items.map(item => {
      if (item.type === 'divider') return `<hr class="ctx-divider">`;
      const cls = item.danger ? 'ctx-item ctx-item-danger' : 'ctx-item';
      const iH  = item.icon ? svgTag(item.icon) : '';
      return `<div class="${cls}">${iH} ${esc(item.label)}</div>`;
    }).join('');
    return `<div class="ctx-menu" style="position:relative;display:flex;flex-direction:column;max-width:200px;">${items}</div>`;
  },

  tabs(cfg) {
    if (!cfg.items.length) return `<p class="text-muted text-sm">Add at least one tab.</p>`;
    const scopeId = 'previewTabContent';
    const tabEls  = cfg.items.map((item, i) =>
      `<li class="${i===0?'active':''}" data-tab="ptab-${i}">${esc(item.label)}</li>`).join('');
    const panels  = cfg.items.map((item, i) =>
      `<div class="tab${i===0?' active':''} tab-panels" id="ptab-${i}"${i!==0?' hidden':''}>${esc(item.content)}</div>`).join('');
    return `
      <ul class="tabmenu" data-scope="${scopeId}">${tabEls}</ul>
      <div id="${scopeId}">${panels}</div>`;
  },

  modal(cfg) {
    const titleColorMap = { primary:'text-pr',success:'text-sc',danger:'text-da',warning:'text-wr',default:'' };
    const titleCls = titleColorMap[cfg.titleVariant] || '';
    const iconH    = cfg.titleIcon ? svgTag(cfg.titleIcon) : '';
    const cancelBtn = cfg.showCancel
      ? `<button class="btn">${esc(cfg.cancelText)}</button>` : '';
    const confirmCls = cfg.confirmVariant==='default' ? 'btn' : `btn btn-${cfg.confirmVariant}`;
    return `
      <div class="da-modal-preview">
        <div class="modal-head">
          <h4 class="${titleCls}">${iconH} ${esc(cfg.title)}</h4>
        </div>
        <p class="text-sm text-muted">${esc(cfg.body)}</p>
        <div class="modal-foot">
          ${cancelBtn}
          <button class="${confirmCls}">${esc(cfg.confirmText)}</button>
        </div>
      </div>`;
  },

  toast(cfg) {
    const typeMap = { success:'toast-success', error:'toast-error', info:'toast-info', warning:'toast-warning' };
    const cls = typeMap[cfg.type] || 'toast-info';
    return `
      <p class="text-muted text-sm" style="margin-bottom:var(--xs);">Preview — the real toast appears bottom-right:</p>
      <div class="da-toast-preview ${cls}">${esc(cfg.message)}</div>
      <p class="text-muted text-sm" style="margin-top:var(--xs);">Stays for ${cfg.duration/1000} second${cfg.duration!==1000?'s':''}.</p>`;
  },

  buttons(cfg) {
    const btns = cfg.items.map(item => {
      const cls      = item.variant==='default' ? 'btn' : `btn btn-${item.variant}`;
      const iconH    = item.icon ? svgTag(item.icon) : '';
      const iconOnly = item.iconOnly ? ' btn-icon' : '';
      const label    = item.iconOnly ? '' : esc(item.label);
      const aria     = item.iconOnly ? ` aria-label="${esc(item.label)}"` : '';
      return `<button class="${cls}${iconOnly}"${aria}>${iconH}${label}</button>`;
    }).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:var(--xs);">${btns}</div>`;
  },

  badges(cfg) {
    const items = cfg.items.map(item => {
      const iH = item.icon ? svgTag(item.icon) : '';
      return `<span class="badge badge-${item.variant}">${iH}${esc(item.label)}</span>`;
    }).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:var(--xs);">${items}</div>`;
  },

  cards(cfg) {
    const cards = cfg.items.map(item => {
      const varCls  = item.variant!=='default' ? ` da-card-${item.variant}` : '';
      const btnCls  = item.btnVariant==='default' ? 'btn' : `btn btn-${item.btnVariant}`;
      const footer  = item.showFooter
        ? `<div class="da-card-foot"><button class="${btnCls}" style="font-size:var(--sm);">${esc(item.footerBtn)}</button></div>` : '';
      return `
        <div class="da-card${varCls}">
          <div class="da-card-head">${esc(item.title)}</div>
          <div class="da-card-body">${esc(item.body)}</div>
          ${footer}
        </div>`;
    }).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:var(--sm);">${cards}</div>`;
  },

  form(cfg) {
    const fields = cfg.fields.map((field, i) => {
      const id  = `pfield-${i}`;
      const req = field.required ? ' required' : '';
      const ph  = field.placeholder ? ` placeholder="${esc(field.placeholder)}"` : '';
      const reqMark = field.required ? ' <span style="color:var(--da)">*</span>' : '';
      let input;
      if (field.type === 'textarea') {
        input = `<textarea id="${id}" rows="2"${ph}${req}></textarea>`;
      } else if (field.type === 'select') {
        input = `<select id="${id}"${req}><option value="">Select…</option></select>`;
      } else {
        input = `<input type="${field.type}" id="${id}"${ph}${req}>`;
      }
      return `
        <div class="da-form-group">
          <label for="${id}">${esc(field.label)}${reqMark}</label>
          ${input}
        </div>`;
    }).join('');
    const reset = cfg.showReset ? `<button type="reset" class="btn">${esc(cfg.resetText)}</button>` : '';
    return `
      <form class="da-form" novalidate>
        ${fields}
        <div class="da-form-actions">
          <button type="submit" class="btn btn-primary">${esc(cfg.submitText)}</button>
          ${reset}
        </div>
      </form>`;
  },
};

// ─────────────────────────────────────────────────
//  CODE GENERATORS
// ─────────────────────────────────────────────────

const codeGen = {

  accordion(cfg) {
    const single = cfg.single ? ' data-single' : '';
    const items  = cfg.items.map(item =>
`  <div class="accordion-item">
    <div class="accordion-header">
      ${item.title}
      <svg data-icon="arrow-right" class="accordion-chevron"></svg>
    </div>
    <div class="accordion-content">
      ${item.content}
    </div>
  </div>`).join('\n');
    return `<!-- HTML -->
<div class="accordion"${single}>
${items}
</div>

<!-- JS -->
geUIHelper.accordion('.accordion');`;
  },

  dropdown(cfg) {
    const btnCls  = cfg.variant==='default' ? 'btn' : `btn btn-${cfg.variant}`;
    const iconL   = cfg.icon ? `\n    <svg data-icon="${cfg.icon}"></svg>` : '';
    const itemLines = cfg.items.map(item => {
      if (item.type === 'divider') return `  <hr class="dd-divider">`;
      const cls  = item.danger ? 'dd-item dd-item-danger' : 'dd-item';
      const iL   = item.icon ? `<svg data-icon="${item.icon}"></svg> ` : '';
      return `  <div class="${cls}">${iL}${item.label}</div>`;
    }).join('\n');
    return `<!-- HTML -->
<div class="dd-wrap">
  <button class="${btnCls} dd-trigger">${iconL}
    ${cfg.label} <svg data-icon="arrow-right"></svg>
  </button>
  <div class="dd-menu" role="menu">
${itemLines}
  </div>
</div>

<!-- JS — geDropdown extends geUIHelper -->
class geDropdown extends geUIHelper {
  static init(sel) {
    geUIHelper.els(sel).forEach(trigger => {
      const menu = trigger.nextElementSibling;
      geUIHelper.on(trigger, 'click', e => {
        e.stopPropagation();
        geUIHelper.els('.dd-menu.active').forEach(m => {
          if (m !== menu) geUIHelper.removeClass(m, 'active');
        });
        geUIHelper.toggleClass(menu, 'active');
      });
    });
    document.addEventListener('click', () =>
      geUIHelper.els('.dd-menu.active').forEach(m =>
        geUIHelper.removeClass(m, 'active')));
  }
}
geDropdown.init('.dd-trigger');`;
  },

  vmenu(cfg) {
    let lines = [];
    let lastGroup = null;
    cfg.items.forEach(item => {
      if (item.group && item.group !== lastGroup) {
        lines.push(`  <span class="vmenu-label">${item.group}</span>`);
        lastGroup = item.group;
      }
      const cls = item.state==='active' ? 'vmenu-item active'
                : item.state==='danger' ? 'vmenu-item vmenu-item-danger'
                : 'vmenu-item';
      const iL  = item.icon ? `<svg data-icon="${item.icon}"></svg> ` : '';
      lines.push(`  <a class="${cls}" href="#">${iL}${item.label}</a>`);
    });
    return `<!-- HTML — no JS required -->
<nav class="vmenu">
${lines.join('\n')}
</nav>`;
  },

  contextmenu(cfg) {
    const items = cfg.items.map(item => {
      if (item.type === 'divider') return `  <hr class="ctx-divider">`;
      const cls = item.danger ? 'ctx-item ctx-item-danger' : 'ctx-item';
      const iL  = item.icon ? `<svg data-icon="${item.icon}"></svg> ` : '';
      return `  <div class="${cls}">${iL}${item.label}</div>`;
    }).join('\n');
    return `<!-- Place outside app div (position:fixed) -->
<div id="myCtxMenu" class="ctx-menu" role="menu">
${items}
</div>

<!-- Right-click target -->
<div id="myTarget">Right-click me</div>

<!-- JS -->
const target = geUIHelper.el('#myTarget');
const menu   = geUIHelper.el('#myCtxMenu');

geUIHelper.on(target, 'contextmenu', e => {
  e.preventDefault();
  menu.style.left = e.clientX + 'px';
  menu.style.top  = e.clientY + 'px';
  geUIHelper.addClass(menu, 'active');
});

document.addEventListener('click', () =>
  geUIHelper.removeClass(menu, 'active'));`;
  },

  tabs(cfg) {
    const scope  = 'myTabContent';
    const tabEls = cfg.items.map((item, i) =>
      `  <li${i===0?' class="active"':''} data-tab="tab-${i}">${item.label}</li>`).join('\n');
    const panels = cfg.items.map((item, i) =>
      `  <div class="tab${i===0?' active':''} tab-panels" id="tab-${i}"${i!==0?' hidden':''}>${item.content}</div>`).join('\n');
    return `<!-- HTML -->
<ul class="tabmenu" data-scope="${scope}">
${tabEls}
</ul>

<div id="${scope}">
${panels}
</div>

<!-- JS -->
geUIHelper.tabs('.tabmenu');`;
  },

  modal(cfg) {
    const titleColorMap = { primary:'text-pr',success:'text-sc',danger:'text-da',warning:'text-wr',default:'' };
    const titleCls  = titleColorMap[cfg.titleVariant] || '';
    const iL        = cfg.titleIcon ? `<svg data-icon="${cfg.titleIcon}"></svg> ` : '';
    const cancelLine = cfg.showCancel
      ? `\n    <button class="btn" id="closeModal">${cfg.cancelText}</button>` : '';
    const confirmCls = cfg.confirmVariant==='default' ? 'btn' : `btn btn-${cfg.confirmVariant}`;
    return `<!-- Place OUTSIDE app div, before </body> -->
<div id="myModal" class="modal" role="dialog" aria-modal="true">
  <div class="modal-head">
    <h4 class="${titleCls}">${iL}${cfg.title}</h4>
  </div>
  <p>${cfg.body}</p>
  <div class="modal-foot">${cancelLine}
    <button class="${confirmCls}" id="confirmModal">${cfg.confirmText}</button>
  </div>
</div>

<!-- JS -->
geUIHelper.modal('open',  'myModal');
geUIHelper.modal('close', 'myModal');`;
  },

  toast(cfg) {
    return `<!-- JS only — no HTML needed -->
geUIHelper.toast(
  '${cfg.message}',
  '${cfg.type}',
  ${cfg.duration}
);`;
  },

  buttons(cfg) {
    return `<!-- HTML -->
${cfg.items.map(item => {
  const cls      = item.variant==='default' ? 'btn' : `btn btn-${item.variant}`;
  const iL       = item.icon ? `<svg data-icon="${item.icon}"></svg> ` : '';
  const iconOnly = item.iconOnly ? ' btn-icon' : '';
  const aria     = item.iconOnly ? ` aria-label="${item.label}"` : '';
  const label    = item.iconOnly ? '' : item.label;
  return `<button class="${cls}${iconOnly}"${aria}>${iL}${label}</button>`;
}).join('\n')}`;
  },

  badges(cfg) {
    return `<!-- HTML -->
${cfg.items.map(item => {
  const iL = item.icon ? `<svg data-icon="${item.icon}"></svg> ` : '';
  return `<span class="badge badge-${item.variant}">${iL}${item.label}</span>`;
}).join('\n')}`;
  },

  cards(cfg) {
    return `<!-- HTML -->
${cfg.items.map(item => {
  const varCls  = item.variant!=='default' ? ` da-card-${item.variant}` : '';
  const btnCls  = item.btnVariant==='default' ? 'btn' : `btn btn-${item.btnVariant}`;
  const footer  = item.showFooter
    ? `\n  <div class="da-card-foot">\n    <button class="${btnCls}">${item.footerBtn}</button>\n  </div>` : '';
  return `<div class="da-card${varCls}">
  <div class="da-card-head">${item.title}</div>
  <div class="da-card-body">${item.body}</div>${footer}
</div>`;
}).join('\n\n')}`;
  },

  form(cfg) {
    const fieldLines = cfg.fields.map((field, i) => {
      const id  = `field-${i}`;
      const req = field.required ? ' required' : '';
      const ph  = field.placeholder ? ` placeholder="${field.placeholder}"` : '';
      const reqMark = field.required ? ' *' : '';
      let input;
      if (field.type === 'textarea') {
        input = `<textarea id="${id}" name="${field.name||'field'+i}" rows="3"${ph}${req}></textarea>`;
      } else if (field.type === 'select') {
        input = `<select id="${id}" name="${field.name||'field'+i}"${req}>\n    <option value="">Select…</option>\n  </select>`;
      } else {
        input = `<input type="${field.type}" id="${id}" name="${field.name||'field'+i}"${ph}${req}>`;
      }
      return `  <div class="da-form-group">
    <label for="${id}">${field.label}${reqMark}</label>
    ${input}
  </div>`;
    }).join('\n');
    const resetLine = cfg.showReset ? `\n    <button type="reset" class="btn">${cfg.resetText}</button>` : '';
    return `<!-- HTML -->
<form id="myForm" class="da-form" novalidate>
${fieldLines}
  <div class="da-form-actions">
    <button type="submit" class="btn btn-primary">${cfg.submitText}</button>${resetLine}
  </div>
</form>

<!-- JS -->
const form = geUIHelper.el('#myForm');
geUIHelper.handleForm(form, async (data) => {
  console.log('Submitted:', data);
  return { ok: true };
});`;
  },
};

// ─────────────────────────────────────────────────
//  NEW ITEM DEFAULTS (when "Add X" is clicked)
// ─────────────────────────────────────────────────

const newItemDefaults = {
  accordion:   { title: 'New Section',  content: 'Content here.' },
  dropdown:    { type: 'item', label: 'New Item', icon: '', danger: false },
  vmenu:       { group: '', label: 'New Item', icon: '', state: 'normal' },
  contextmenu: { type: 'item', label: 'New Item', icon: '', danger: false },
  tabs:        { label: 'New Tab', content: 'Tab content here.' },
  buttons:     { label: 'Button', variant: 'default', icon: '', iconOnly: false },
  badges:      { label: 'label', variant: 'muted', icon: '' },
  cards:       { title: 'New Card', body: 'Card content.', variant: 'default', footerBtn: 'Action', btnVariant: 'default', showFooter: true },
  form:        { label: 'New Field', type: 'text', name: 'field', required: false, placeholder: '' },
};

// ─────────────────────────────────────────────────
//  MAIN CONTROLLER
// ─────────────────────────────────────────────────

function selectComponent(id) {
  activeId = id;
  geUIHelper.els('.da-tile').forEach(t =>
    t.classList.toggle('active', t.dataset.component === id));
  geUIHelper.hide(geUIHelper.el('#daWelcome'));
  const ws = geUIHelper.el('#daWorkspace');
  ws.removeAttribute('hidden');
  updateAll();
}

function updateAll() {
  if (!activeId) return;
  const cfg = getConfig(activeId);
  renderConfig(cfg);
  renderPreview(cfg);
  renderCode(cfg);
}

function renderConfig(cfg) {
  const el = geUIHelper.el('#daConfig');
  el.innerHTML = configForms[activeId](cfg);
  icx.replace();
  bindConfigEvents(cfg);
}

function renderPreview(cfg) {
  const el = geUIHelper.el('#daPreviewInner');
  el.innerHTML = previews[activeId](cfg);
  icx.replace();
  // Re-init interactive components
  if (activeId === 'accordion') geUIHelper.accordion('#daPreviewInner .accordion');
  if (activeId === 'tabs')      geUIHelper.tabs('#daPreviewInner .tabmenu');
}

function renderCode(cfg) {
  const pre = geUIHelper.el('#daCodeOutput');
  pre.className = '';
  pre.textContent = codeGen[activeId](cfg);
}

// ─────────────────────────────────────────────────
//  CONFIG EVENT BINDING
// ─────────────────────────────────────────────────

function bindConfigEvents(cfg) {
  const container = geUIHelper.el('#daConfig');

  // Text inputs + textareas
  container.querySelectorAll('input[type=text], input[type=number], textarea').forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    el.addEventListener('input', () => {
      const mult = el.dataset.multiply ? Number(el.dataset.multiply) : 1;
      const val  = el.type === 'number' ? Number(el.value) * mult : el.value;
      setNested(cfg, key, val);
      renderPreview(cfg);
      renderCode(cfg);
    });
  });

  // Checkboxes
  container.querySelectorAll('input[type=checkbox]').forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    el.addEventListener('change', () => {
      setNested(cfg, key, el.checked);
      if (key === 'showCancel') {
        const f = geUIHelper.el('#cancelField');
        if (f) f.hidden = !el.checked;
      }
      updateAll();
    });
  });

  // Selects
  container.querySelectorAll('select').forEach(el => {
    const key = el.dataset.key;
    if (!key) return;
    el.addEventListener('change', () => {
      setNested(cfg, key, el.value);
      updateAll();
    });
  });

  // Variant picker buttons
  container.querySelectorAll('button.da-vp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key     = btn.dataset.key;
      const variant = btn.dataset.variant;
      if (!key) return;
      btn.closest('.da-vp')?.querySelectorAll('.da-vp-btn')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setNested(cfg, key, variant);
      renderPreview(cfg);
      renderCode(cfg);
    });
  });

  // Delete item buttons
  container.querySelectorAll('.da-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const ak  = arrKey(activeId);
      const arr = cfg[ak];
      if (!arr) return;
      arr.splice(Number(btn.dataset.del), 1);
      updateAll();
    });
  });

  // Add item
  const addBtn = geUIHelper.el('#addItem');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const ak = arrKey(activeId);
      if (cfg[ak]) cfg[ak].push({ ...newItemDefaults[activeId] });
      updateAll();
    });
  }

  // Add divider
  const divBtn = geUIHelper.el('#addDivider');
  if (divBtn) {
    divBtn.addEventListener('click', () => {
      const ak = arrKey(activeId);
      if (cfg[ak]) cfg[ak].push({ type: 'divider' });
      updateAll();
    });
  }
}

// ─────────────────────────────────────────────────
//  COPY BUTTON
// ─────────────────────────────────────────────────

function initCopyBtn() {
  const btn = geUIHelper.el('#daCopyBtn');
  if (!btn) return;
  geUIHelper.on(btn, 'click', async () => {
    const pre = geUIHelper.el('#daCodeOutput');
    if (!pre || !pre.textContent.trim()) {
      geUIHelper.toast('Select a component first.', 'warning');
      return;
    }
    try {
      await navigator.clipboard.writeText(pre.textContent.trim());
      const orig = btn.innerHTML;
      btn.innerHTML = icx.icon('check') + ' Copied!';
      btn.classList.replace('btn-primary', 'btn-success');
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.classList.replace('btn-success', 'btn-primary');
      }, 1500);
    } catch {
      geUIHelper.toast('Could not copy — please select and copy manually.', 'warning');
    }
  });
}

// ─────────────────────────────────────────────────
//  PALETTE
// ─────────────────────────────────────────────────

function buildPalette() {
  const list = geUIHelper.el('#daPaletteList');
  if (!list) return;
  list.innerHTML = PALETTE.map(p =>
    `<button class="da-tile" data-component="${p.id}">
       <svg data-icon="${p.icon}"></svg>${p.label}
     </button>`).join('');
  geUIHelper.els('.da-tile').forEach(tile =>
    geUIHelper.on(tile, 'click', () => selectComponent(tile.dataset.component))
  );
}

// ─────────────────────────────────────────────────
//  THEME TOGGLE
// ─────────────────────────────────────────────────

function initThemeToggle() {
  const btn = geUIHelper.el('#themeToggle');
  if (!btn) return;
  const update = () => {
    btn.innerHTML = icx.icon(geUIHelper.getCurrentTheme() === 'dark' ? 'sun' : 'moon');
  };
  geUIHelper.on(btn, 'click', () => {
    geUIHelper.setTheme(geUIHelper.getCurrentTheme() === 'dark' ? 'light' : 'dark');
    update();
  });
  update();
}

// ─────────────────────────────────────────────────
//  BOOT
// ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  try {
    icx.replace();
    buildPalette();
    icx.replace(); // hydrate palette icons
    initCopyBtn();
    initThemeToggle();
    console.info('[da] Builder ready.');
  } catch (e) {
    geUIHelper.error('da boot failed', e);
  }
});
