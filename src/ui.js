import { generatePattern } from './generator.js';
import { createRenderer } from './renderer.js';
import { PRESETS, clonePreset } from './presets.js';

const defaultState = clonePreset(PRESETS.retroDaisy);

export function createApp() {
  const root = document.createElement('div');
  root.className = 'shell';
  root.innerHTML = `
    <header class="topbar">
      <div>
        <div class="eyebrow">Stitch Forge</div>
        <h1>Retro Daisy Granny Square Studio</h1>
      </div>
      <div class="status">Validated recipe + live preview</div>
    </header>
    <main class="workspace">
      <section class="preview-wrap">
        <div class="preview-frame">
          <div id="preview" class="preview"></div>
          <div class="preview-legend" aria-hidden="true">
            <span><i class="legend-swatch center"></i>Center</span>
            <span><i class="legend-swatch petals"></i>Petals</span>
            <span><i class="legend-swatch border"></i>Border</span>
          </div>
          <div class="preview-tag">Three.js structure preview</div>
        </div>
      </section>
      <aside class="controls">
        <div class="panel">
          <div class="panel-title">Preset</div>
          <button class="preset-btn" id="retro-preset">Retro Daisy</button>
        </div>
        <div class="panel">
          <div class="panel-title">Generator</div>
          <label>Rounds <input type="range" id="rounds" min="3" max="8" step="1"></label>
          <label>Petal count <input type="range" id="petals" min="4" max="16" step="1"></label>
          <label>Center color <input type="color" id="centerColor"></label>
          <label>Petal color <input type="color" id="petalColor"></label>
          <label>Border color <input type="color" id="borderColor"></label>
          <label>Softness <input type="range" id="softness" min="0" max="1" step="0.01"></label>
          <label>Glow <input type="range" id="glow" min="0" max="1" step="0.01"></label>
          <label>Depth <input type="range" id="depth" min="0" max="1" step="0.01"></label>
          <div id="validation-notes" class="validation-notes"></div>
        </div>
      </aside>
      <section class="output">
        <div class="panel pattern-panel">
          <div class="panel-title row">
            <span>Pattern output</span>
            <div class="actions">
              <button id="copy-pattern">Copy Pattern</button>
              <button id="download-pattern">Download .txt</button>
            </div>
          </div>
          <div id="export-status" class="export-status" aria-live="polite"></div>
          <div id="pattern-output" class="pattern-output"></div>
        </div>
      </section>
    </main>
  `;

  const elements = {
    preview: root.querySelector('#preview'),
    rounds: root.querySelector('#rounds'),
    petals: root.querySelector('#petals'),
    centerColor: root.querySelector('#centerColor'),
    petalColor: root.querySelector('#petalColor'),
    borderColor: root.querySelector('#borderColor'),
    softness: root.querySelector('#softness'),
    glow: root.querySelector('#glow'),
    depth: root.querySelector('#depth'),
    validationNotes: root.querySelector('#validation-notes'),
    patternOutput: root.querySelector('#pattern-output'),
    exportStatus: root.querySelector('#export-status'),
    copyButton: root.querySelector('#copy-pattern'),
    downloadButton: root.querySelector('#download-pattern'),
    presetButton: root.querySelector('#retro-preset'),
  };

  const state = { ...defaultState };
  let renderer;

  function syncInputs() {
    elements.rounds.value = state.rounds;
    elements.petals.value = state.petals;
    elements.centerColor.value = state.centerColor;
    elements.petalColor.value = state.petalColor;
    elements.borderColor.value = state.borderColor;
    elements.softness.value = state.softness;
    elements.glow.value = state.glow;
    elements.depth.value = state.depth;
  }

  function setExportStatus(message, kind = 'idle') {
    elements.exportStatus.textContent = message;
    elements.exportStatus.dataset.kind = kind;
    if (kind === 'success' || kind === 'error') {
      window.clearTimeout(setExportStatus._timer);
      setExportStatus._timer = window.setTimeout(() => {
        elements.exportStatus.textContent = '';
        elements.exportStatus.dataset.kind = 'idle';
      }, 2200);
    }
  }

  function renderWarnings(warnings) {
    if (warnings.length === 0) {
      elements.validationNotes.innerHTML = '<div class="note-good">Recipe-safe Retro Daisy settings.</div>';
      return;
    }

    elements.validationNotes.innerHTML = warnings
      .map((warning) => `<div class="note-warning">${warning}</div>`)
      .join('');
  }

  function renderPattern(artifact) {
    const { formatted, summary, materials, notes, normalizedInputs } = artifact;
    root.dataset.patternText = formatted.exportText;

    root.style.setProperty('--legend-center', normalizedInputs.centerColor);
    root.style.setProperty('--legend-petals', normalizedInputs.petalColor);
    root.style.setProperty('--legend-border', normalizedInputs.borderColor);

    elements.patternOutput.innerHTML = `
      <h2>${artifact.name}</h2>
      <p class="meta">Finished size: ${summary.finishedSize}</p>
      <div class="summary-strip">
        ${formatted.summaryChips.map((chip) => `<span>${chip}</span>`).join('')}
      </div>
      <p class="meta">Materials: ${materials.join(' | ')}</p>
      <p class="meta">Abbreviations: ${formatted.abbreviationsLine}</p>
      <p class="meta">Notes: ${notes.join(' | ')}</p>
      ${formatted.rounds
        .map(
          (round) => `
            <article class="round">
              <div class="round-head">
                <span>Round ${round.index} - ${round.title}</span>
                <span>${round.countLabel}</span>
              </div>
              <p>${round.instruction}</p>
            </article>
          `,
        )
        .join('')}
    `;

    renderWarnings(artifact.warnings);
    renderer?.update(artifact);
  }

  function render() {
    const artifact = generatePattern(state);
    Object.assign(state, artifact.normalizedInputs);
    syncInputs();
    renderPattern(artifact);
    return artifact;
  }

  function setPreset() {
    Object.assign(state, clonePreset(PRESETS.retroDaisy));
    render();
  }

  function bindInput(element, key, parser = (value) => value) {
    element.addEventListener('input', () => {
      state[key] = parser(element.value);
      render();
    });
  }

  elements.presetButton.addEventListener('click', setPreset);
  bindInput(elements.rounds, 'rounds', Number);
  bindInput(elements.petals, 'petals', Number);
  bindInput(elements.centerColor);
  bindInput(elements.petalColor);
  bindInput(elements.borderColor);
  bindInput(elements.softness, 'softness', Number);
  bindInput(elements.glow, 'glow', Number);
  bindInput(elements.depth, 'depth', Number);

  elements.copyButton.addEventListener('click', async () => {
    const text = root.dataset.patternText || elements.patternOutput.innerText;
    try {
      await navigator.clipboard.writeText(text);
      elements.copyButton.textContent = 'Copied';
      setExportStatus('Pattern copied to clipboard.', 'success');
      window.setTimeout(() => {
        elements.copyButton.textContent = 'Copy Pattern';
      }, 1200);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = text;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.left = '-9999px';
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      document.body.removeChild(fallback);
      setExportStatus('Clipboard blocked. Pattern copied via fallback.', 'success');
    }
  });

  elements.downloadButton.addEventListener('click', () => {
    const text = root.dataset.patternText || elements.patternOutput.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'stitch-forge-retro-daisy.txt';
    anchor.click();
    URL.revokeObjectURL(url);
    setExportStatus('Pattern downloaded as .txt.', 'success');
  });

  renderer = createRenderer(elements.preview);
  render();

  root.destroy = () => renderer?.dispose();
  return root;
}
