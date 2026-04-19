    const picker = document.getElementById('picker');
    const hexInput = document.getElementById('hexInput');
    const rgbaInput = document.getElementById('rgbaInput');
    const paletteDiv = document.getElementById('palette');
    const themeToggle = document.getElementById('themeToggle');
    const slider = document.getElementById('slider');

    function initTheme() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      updateSlider();
    }

    function toggleTheme() {

      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateSlider();
    }

    function updateSlider() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      slider.textContent = isDark ? '🌙' : '☀️';
    }

    // Safe copy function using old textarea method
    function copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');   // Old but very reliable method
      document.body.removeChild(textarea);
    }

    function normalizeColor(input) {
      const canvas = document.createElement('canvas');
      canvas.width = 1; canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = input;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      const hex = "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
      return { hex, rgba: `rgb(${r}, ${g}, ${b})` };
    }

    function addSwatch(categoryTitle, label, cssColor) {
      let catDiv = Array.from(document.querySelectorAll('.category'))
                        .find(el => el.querySelector('h2').textContent === categoryTitle);

      if (!catDiv) {
        catDiv = document.createElement('div');
        catDiv.className = 'category';
        catDiv.innerHTML = `<h2>${categoryTitle}</h2><div class="swatches-container"></div>`;
        paletteDiv.appendChild(catDiv);
      }

      const { hex } = normalizeColor(cssColor);
      const item = document.createElement('div');
      item.className = 'swatch-item';

      item.innerHTML = `
        <div class="swatch" style="background: ${cssColor}">
          <span class='pick'>#</span><span style="opacity:0.2">/</span><span class='inv'>a</span>
        </div>
        <div class="swatch-info">
          <span class="swatch-label" style="color: ${cssColor}">${label}</span>
          <div><span class="hex-label" title="Click to copy">${hex}</span></div>
        </div>
      `;

      // FIXED CLICK HANDLER - using safe copy function
      item.querySelector('.hex-label').addEventListener('click', function(e) {
        copyToClipboard(hex);
        const el = e.target;
        const original = el.textContent;
        el.textContent = 'COPIED ✓';
        setTimeout(() => el.textContent = original, 800);
      });

      catDiv.querySelector('.swatches-container').appendChild(item);
    }

    function updatePalette(baseColor) {
      paletteDiv.innerHTML = '';
      const { hex: hexBase, rgba: rgbaBase } = normalizeColor(baseColor);

      const colorSchema = [
        { cat: 'Basics', label: 'Inverse', spec: `rgb(from ${hexBase} calc(255 - r) calc(255 - g) calc(255 - b))` },
        { cat: 'Basics', label: 'Shade 10%', spec: `color-mix(in oklch, ${hexBase}, black 10%)` },
        { cat: 'Basics', label: 'Shade 20%', spec: `color-mix(in oklch, ${hexBase}, black 20%)` },
        { cat: 'Basics', label: 'Shade 30%', spec: `color-mix(in oklch, ${hexBase}, black 30%)` },
        { cat: 'Basics', label: 'Shade 40%', spec: `color-mix(in oklch, ${hexBase}, black 40%)` },
        { cat: 'Basics', label: 'Shade 50%', spec: `color-mix(in oklch, ${hexBase}, black 50%)` },
        { cat: 'Basics', label: 'Shade 60%', spec: `color-mix(in oklch, ${hexBase}, black 60%)` },
        { cat: 'Basics', label: 'Tint 20%', spec: `color-mix(in oklch, ${hexBase}, white 20%)` },
        { cat: 'Basics', label: 'Tint 40%', spec: `color-mix(in oklch, ${hexBase}, white 40%)` },
        { cat: 'Basics', label: 'Tint 60%', spec: `color-mix(in oklch, ${hexBase}, white 60%)` },
        { cat: 'Mixed', label: 'Cyan', spec: `color-mix(in oklch, ${hexBase}, cyan 60%)` },
        { cat: 'Mixed', label: 'Red', spec: `color-mix(in oklch, ${hexBase}, red 60%)` },
        { cat: 'Mixed', label: 'Green', spec: `color-mix(in oklch, ${hexBase}, green 60%)` },
        { cat: 'Mixed', label: 'Blue', spec: `color-mix(in oklch, ${hexBase}, blue 60%)` },
        { cat: 'Mixed', label: 'Yellow', spec: `color-mix(in oklch, ${hexBase}, yellow 60%)` },
        { cat: 'Mixed', label: 'Purple', spec: `color-mix(in oklch, ${hexBase}, purple 60%)` },
        { cat: 'Harmonies', label: 'Compl.', spec: `oklch(from ${rgbaBase} l 0.12 calc(h + 180))` },
        { cat: 'Harmonies', label: 'Ana. +30°', spec: `oklch(from ${rgbaBase} l 0.12 calc(h + 30))` },
        { cat: 'Harmonies', label: 'Ana. -30°', spec: `oklch(from ${rgbaBase} l 0.12 calc(h - 30))` },
        { cat: 'Tertiary', label: '+60° Hue', spec: `oklch(from ${rgbaBase} l 0.12 calc(h + 60))` },
        { cat: 'Tertiary', label: '+120° Hue', spec: `oklch(from ${rgbaBase} l 0.12 calc(h + 120))` },
        { cat: 'Tertiary', label: '-60° Hue', spec: `oklch(from ${rgbaBase} l 0.12 calc(h - 60))` }
      ];

      colorSchema.forEach(item => addSwatch(item.cat, item.label, item.spec));
    }

    function saveLastColor(value) {
      localStorage.setItem('colorPlayground.lastColor', value);
    }

    function syncAll(sourceValue, skipElement) {
      const { hex, rgba } = normalizeColor(sourceValue);
      const invData = normalizeColor(`rgb(from ${hex} calc(255 - r) calc(255 - g) calc(255 - b))`);
      
      const root = document.documentElement;
      root.style.setProperty('--pick', hex);
      root.style.setProperty('--inv', invData.hex);

      if (skipElement !== picker) picker.value = hex;
      if (skipElement !== hexInput) hexInput.value = hex;
      if (skipElement !== rgbaInput) rgbaInput.value = rgba;

      saveLastColor(hex);
      updatePalette(hex);
    }

    picker.addEventListener('input', (e) => syncAll(e.target.value, picker));
    hexInput.addEventListener('change', (e) => syncAll(e.target.value, hexInput));
    rgbaInput.addEventListener('change', (e) => syncAll(e.target.value, rgbaInput));
    themeToggle.addEventListener('click', toggleTheme);

    window.addEventListener('load', () => {
      initTheme();
      const savedColor = localStorage.getItem('colorPlayground.lastColor');
      syncAll(savedColor || picker.value);
    });
