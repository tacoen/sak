import { IconManager } from './ge-icon.js';
import icons from './icons.js';

class IconIndex extends IconManager {
    constructor(icons) {
        super();
        this.mergeIcons(icons);
        this.keeper = JSON.parse(localStorage.getItem('keeper')) || {}; // load saved collection

        this.renderGrid(this.icons);

        // Search
        let timeout;
        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.filterIcons(searchInput.value), 120);
        });

        // Theme toggle
        this.initTheme();
    }

    filterIcons(term) {
        const lower = term.toLowerCase().trim();
        const filtered = Object.fromEntries(
            Object.entries(this.icons).filter(([key]) => key.toLowerCase().includes(lower))
        );
        this.renderGrid(filtered);
    }

    renderGrid(filteredIcons) {
        const container = document.createElement('div');
        container.id = "icon-index";

        if (Object.keys(filteredIcons).length === 0) {
            container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-light);padding:3rem;">No icons found</p>`;
            document.getElementById('icon-index').replaceWith(container);
            return;
        }

        Object.keys(filteredIcons).forEach(key => {
            const card = document.createElement('div');
            card.className = 'icon-card';
            card.innerHTML = `${this.icons[key]}<span>${key}</span>`;
            card.addEventListener('click', () => this.inspect(key));
            container.appendChild(card);
        });

        document.getElementById('icon-index').replaceWith(container);
        document.getElementById('icon-count').textContent = Object.keys(filteredIcons).length;
    }

    initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const isDark = document.documentElement.classList.contains('dark');
        toggle.textContent = isDark ? '🌙' : '☀️';

        toggle.addEventListener('click', () => {
            const nowDark = document.documentElement.classList.toggle('dark');
            toggle.textContent = nowDark ? '🌙' : '☀️';
            localStorage.setItem('theme', nowDark ? 'dark' : 'light');
        });
    }

    inspect(iconKey) {
        let inspectDiv = document.querySelector('.icon-inspect-div');
        if (inspectDiv) inspectDiv.remove();

        inspectDiv = document.createElement('div');
        inspectDiv.className = 'icon-inspect-div';
        inspectDiv.innerHTML = `
            <div class="inspect-header">
                <strong>${iconKey}</strong>
                <a class="close" style="cursor:pointer;color:#ef4444;font-size:1.4rem;">✕</a>
            </div>
            <div class="inspect-preview" id="preview-area">
                ${this.icons[iconKey]}
            </div>
            <div class="inspect-body">
                <div class="control-group">
                    <label>Size Presets</label>
                    <div class="presets">
                        <button class="preset-btn" data-size="32">32</button>
                        <button class="preset-btn" data-size="48">48</button>
                        <button class="preset-btn active" data-size="64">64</button>
                        <button class="preset-btn" data-size="96">96</button>
                        <button class="preset-btn" data-size="128">128</button>
                    </div>
                </div>
                <div class="control-group">
                    <label>Stroke Width <span id="stroke-val">1</span></label>
                    <input type="range" id="stroke" min="0.5" max="4" step="0.1" value="1">
                </div>
                <div class="color-section">
                    <div class="control-group">
                        <label>Stroke Color</label>
                        <input type="color" id="stroke-color" value="#333333">
                    </div>
                    <div class="control-group">
                        <label>Fill Color</label>
                        <input type="color" id="fill-color" value="#ffffff">
                    </div>
                </div>
                <div class="copy-section">
                    <button id="copy-data" class="btn btn-primary">Code</button>
                    <button id="copy-svg" class="btn btn-secondary">SVG</button>
                </div>
                <div class="copy-section">
                    <button id="collect-btn" class="btn btn-secondary">+ Collect</button>
                    <button id="json-btn" class="btn btn-secondary">icons.js</button>
                </div>
            </div>
        `;
        document.body.appendChild(inspectDiv);

        const previewArea = inspectDiv.querySelector('.inspect-preview');
        const strokeSlider = inspectDiv.querySelector('#stroke');
        const strokeVal = inspectDiv.querySelector('#stroke-val');

        // Stroke slider only updates the number (no live preview)
        strokeSlider.addEventListener('input', () => {
            strokeVal.textContent = strokeSlider.value;
        });

        // Size presets
        inspectDiv.querySelectorAll('.preset-btn').forEach(btn => {
            btn.onclick = () => {
                inspectDiv.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                previewArea.style.width = previewArea.style.height = `${btn.dataset.size}px`;
            };
        });

        // Buttons
        inspectDiv.querySelector('#copy-data').addEventListener('click', () => this.copyToClipboard(`<i data-icon="${iconKey}"></i>`));
        inspectDiv.querySelector('#copy-svg').addEventListener('click', () => this.copyToClipboard(this.icons[iconKey]));
        inspectDiv.querySelector('#collect-btn').addEventListener('click', () => this.collectIcon(iconKey));
        inspectDiv.querySelector('#json-btn').addEventListener('click', () => this.downloadIconsJS());

        inspectDiv.querySelector('.close').addEventListener('click', () => inspectDiv.remove());

        this.replace();
    }

    // ==================== COLLECT ====================
    collectIcon(iconKey) {
        if (this.keeper[iconKey]) {
            this.showToast('⭐ Already collected!');
            return;
        }

        this.keeper[iconKey] = this.icons[iconKey];
        localStorage.setItem('keeper', JSON.stringify(this.keeper));
        this.showToast('⭐ Collected!');
    }

    // ==================== DOWNLOAD icons.js ====================
    downloadIconsJS() {
        if (Object.keys(this.keeper).length === 0) {
            this.showToast('Nothing collected yet!');
            return;
        }

        let jsContent = 'const icons = {\n';
        Object.entries(this.keeper).forEach(([name, svg], index, arr) => {
            const escaped = svg.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            jsContent += `    "${name}": "${escaped}"`;
            if (index < arr.length - 1) jsContent += ',';
            jsContent += '\n';
        });
        jsContent += '};\nexport default icons;';

        const blob = new Blob([jsContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'icons.js';
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('📤 icons.js downloaded!');
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 999999);
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast();
    }

    showToast(msg = '✅ Copied!') {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.icxIndex = new IconIndex(icons);
});