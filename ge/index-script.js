const root = document.documentElement;

// ── Color utils ───────────────────────────────────────────────────
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    return { r: parseInt(hex.substr(0,2),16), g: parseInt(hex.substr(2,2),16), b: parseInt(hex.substr(4,2),16) };
}
function rgbToHex(r,g,b) {
    return '#' + [r,g,b].map(x => Math.round(x).toString(16).padStart(2,'0')).join('');
}
function mix(c1, c2, pct) {
    const a = hexToRgb(c1), b = hexToRgb(c2), p = pct/100;
    return rgbToHex(a.r*(1-p)+b.r*p, a.g*(1-p)+b.g*p, a.b*(1-p)+b.b*p);
}
function invertHex(hex) {
    hex = hex.replace('#','');
    return '#' + [0,2,4].map(i => (255 - parseInt(hex.substr(i,2),16)).toString(16).padStart(2,'0')).join('');
}

// ── State ─────────────────────────────────────────────────────────
const state = { '--bg': '#181118', '--fg': '#e7eee7' };

function calcAccents(fg) {
    state['--muted'] = mix('#808080', fg, 50);
    state['--link']  = mix('#0000ff', fg, 50);
    state['--pr']    = mix('#00ccff', fg, 50);
    state['--sc']    = mix('#008000', fg, 50);
    state['--da']    = mix('#ff0000', fg, 50);
    state['--wr']    = mix('#ffff00', fg, 50);
}

function applyState() {
    for (const [k,v] of Object.entries(state)) {
        root.style.setProperty(k, v);
    }
    document.getElementById('prPicker').value = state['--pr'];
    document.getElementById('scPicker').value = state['--sc'];
    document.getElementById('daPicker').value = state['--da'];
    document.getElementById('wrPicker').value = state['--wr'];
    document.getElementById('hexValue').textContent = state['--bg'].toUpperCase();
    updateExport();
}

function updateExport() {
    document.getElementById('cssOutput').value =
`:root {
    --white: #ffffff;
    --black: #000000;
    --bg: #181118;
    --fg: #e7eee7;
    --vxs: .25rem;
    --xs: .5rem;
    --sm: .75rem;
    --md: 1rem;
    --lg: 1.5rem;
    --xlg: 2rem;
    --scroll-width: 4px;
}
body {
    --muted: ${state['--muted']};
    --link: ${state['--link']};
    --pr: ${state['--pr']};
    --sc: ${state['--sc']};
    --da: ${state['--da']};
    --wr: ${state['--wr']};
    --bg-subtle: color-mix(in srgb, var(--bg), var(--white) 5%);
    --bg-inset: color-mix(in srgb, var(--bg), var(--black) 30%);
    --bg-overlay: color-mix(in srgb, var(--bg), var(--black) 15%);
    --border-muted: color-mix(in srgb, var(--bg), var(--white) 10%);
    --border: color-mix(in srgb, var(--bg), var(--white) 15%);
    --border-hover: color-mix(in srgb, var(--bg), var(--white) 20%);
    --pr-bg: color-mix(in srgb, var(--bg), var(--pr) 20%);
    --pr-subtle: color-mix(in srgb, var(--bg), var(--pr) 10%);
    --pr-border: color-mix(in srgb, var(--bg), var(--pr) 40%);
    --sc-bg: color-mix(in srgb, var(--bg), var(--sc) 20%);
    --sc-subtle: color-mix(in srgb, var(--bg), var(--sc) 10%);
    --sc-border: color-mix(in srgb, var(--bg), var(--sc) 40%);
    --da-bg: color-mix(in srgb, var(--bg), var(--da) 20%);
    --da-subtle: color-mix(in srgb, var(--bg), var(--da) 10%);
    --da-border: color-mix(in srgb, var(--bg), var(--da) 40%);
    --wr-bg: color-mix(in srgb, var(--bg), var(--wr) 20%);
    --wr-subtle: color-mix(in srgb, var(--bg), var(--wr) 10%);
    --wr-border: color-mix(in srgb, var(--bg), var(--wr) 40%);
}`;
}

// ── Pickers ───────────────────────────────────────────────────────
function initPicker(id, variable) {
    document.getElementById(id).addEventListener('input', e => {
        const val = e.target.value;
        state[variable] = val;

        if (variable === '--bg') {
            const fg = invertHex(val);
            state['--fg'] = fg;
            root.style.setProperty('--fg', fg);
            document.getElementById('fgPicker').value = fg;
            calcAccents(fg);
        }

        if (variable === '--fg') {
            calcAccents(val);
        }

        applyState();
    });
}

// ── Export panel ──────────────────────────────────────────────────
document.getElementById('exportToggle').addEventListener('click', () => {
    document.getElementById('exportPanel').classList.toggle('open');
});
document.getElementById('exportClose').addEventListener('click', () => {
    document.getElementById('exportPanel').classList.remove('open');
});

// ── Token popup ───────────────────────────────────────────────────
const popup = document.getElementById('ge-popup');
const skip = new Set(['ge-popup', 'exportPanel', 'cssOutput']);

document.querySelectorAll('[style],[class]').forEach(el => {
    if (skip.has(el.id)) return;
    el.addEventListener('mouseenter', e => {
        const s = el.getAttribute('style') || '';
        if (!s.trim()) return;
        const lines = s.split(';').map(x => x.trim()).filter(Boolean);
        popup.innerHTML = lines.map(l => `<div>${l};</div>`).join('');
        popup.style.display = 'block';
        move(e);
    });
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', () => { popup.style.display = 'none'; });
});

function move(e) {
    const x = e.clientX + 12, y = e.clientY + 12;
    const pw = popup.offsetWidth, ph = popup.offsetHeight;
    popup.style.left = (x + pw > window.innerWidth  ? window.innerWidth  - pw - 8 : x) + 'px';
    popup.style.top  = (y + ph > window.innerHeight ? y - ph - 24 : y) + 'px';
}

// ── Init ──────────────────────────────────────────────────────────
calcAccents(state['--fg']);
applyState();
initPicker('bgPicker', '--bg');
initPicker('fgPicker', '--fg');
initPicker('prPicker', '--pr');
initPicker('scPicker', '--sc');
initPicker('daPicker', '--da');
initPicker('wrPicker', '--wr');

// ── Docs modal ────────────────────────────────────────────────────
const modal        = document.getElementById('ge-modal');
const modalTitle   = document.getElementById('geModalTitle');
const modalBody    = document.getElementById('geModalBody');
const modalBackdrop = document.getElementById('geModalBackdrop');
const modalClose   = document.getElementById('geModalClose');

function openModal(src, title) {
    modalTitle.textContent = title;
    modalBody.innerHTML = '<p style="color:var(--muted);font-family:var(--font-mono);font-size:.8rem;">Loading...</p>';
    modal.classList.add('open');

    fetch(src)
        .then(r => {
            if (!r.ok) throw new Error(r.status);
            return r.text();
        })
        .then(text => {
            if (src.endsWith('.css')) {
                // Render CSS as a code block
                modalBody.innerHTML = `<pre><code>${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`;
            } else {
                modalBody.innerHTML = marked.parse(text);
            }
        })
        .catch(() => {
            modalBody.innerHTML = '<p style="color:var(--da);font-family:var(--font-mono);font-size:.8rem;">Could not load file. Make sure it exists at the expected path.</p>';
        });
}

function closeModal() {
    modal.classList.remove('open');
    modalBody.innerHTML = '';
}

document.querySelectorAll('.ge-doc-link').forEach(btn => {
    btn.addEventListener('click', () => {
        openModal(btn.dataset.src, btn.dataset.title);
    });
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });