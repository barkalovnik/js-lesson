// ==========================================================================
// COFFEE & EDITORIAL DESIGN SYSTEM: APPLICATION ENGINE
// Features: Real-time syntax highlighting overlay, theme switcher (4 palettes),
// custom SVG icon engine, strict sharp geometry, live sandboxed DOM.
// ==========================================================================

const COFFEE_STORAGE_KEY = "js_episodes_coffee_v1";
const THEME_STORAGE_KEY = "js_episodes_theme_choice";

// Minimal SVG Icon Library
const ICONS = {
  prompt: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M4 17l6-6-6-6M12 19h8"/></svg>`,
  vars: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18"/><path d="M8 12h8M12 8v8"/></svg>`,
  conditions: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M6 3v18M18 9l-6 6-6-6"/></svg>`,
  while: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  for: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  arrays: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M8 4H4v16h4M16 4h4v16h-4"/></svg>`,
  functions: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M9 17c2 0 3-1 3-3V7c0-2-1-3-3-3M6 11h8M14 7l4 10M18 7l-4 10"/></svg>`,
  objects: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><path d="M7 4c-2 0-3 1-3 3v2c0 2-1 3-3 3 2 0 3 1 3 3v2c0 2 1 3 3 3M17 4c2 0 3 1 3 3v2c0 2 1 3 3 3-2 0-3 1-3 3v2c0 2-1 3-3 3"/></svg>`,
  classes: `<svg class="ep-icon-svg" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  check: `<svg style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.5;" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  bulb: `<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 5.5V17h8v-2.5c1.5-1 3-3 3-5.5a7 7 0 0 0-7-7z"/></svg>`,
  terminal: `<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  cup: `<svg style="width:16px;height:16px;stroke:var(--accent);fill:none;stroke-width:2;" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>`
};

const EPISODE_ICON_MAP = {
  1: ICONS.prompt,
  2: ICONS.vars,
  3: ICONS.conditions,
  4: ICONS.while,
  5: ICONS.for,
  6: ICONS.arrays,
  7: ICONS.functions,
  8: ICONS.objects,
  9: ICONS.classes
};

// Stripping emojis from titles for strict editorial look
function stripEmojis(str) {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
}

// State
let curEpId = 1;
let curLvlNum = 1;
let trainerState = {
  solved: {},
  code: {}
};

// --------------------------------------------------------------------------
// SYNTAX HIGHLIGHTING ENGINE (Fast Regex Tokenizer)
// --------------------------------------------------------------------------
function highlightCode(raw) {
  let text = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // String literals: "...", '...', `...`
  text = text.replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, '<span class="hl-str">$&</span>');

  // Comments: // ...
  text = text.replace(/(\/\/[^\n]*)/g, '<span class="hl-comm">$&</span>');

  // Keywords
  const keywords = /\b(function|return|class|extends|super|new|const|let|var|if|else|switch|case|default|break|continue|while|do|for|of|in|throw|try|catch|typeof|instanceof)\b/g;
  text = text.replace(keywords, '<span class="hl-kw">$&</span>');

  // DOM APIs
  const domApis = /\b(document|window|getElementById|querySelector|querySelectorAll|createElement|appendChild|removeChild|remove|textContent|innerHTML|style|classList|add|toggle|contains|addEventListener|onclick|value)\b/g;
  text = text.replace(domApis, '<span class="hl-dom">$&</span>');

  // Numbers
  text = text.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="hl-num">$&</span>');

  return text;
}

// --------------------------------------------------------------------------
// THEME CONTROLLER
// --------------------------------------------------------------------------
function initTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) || "theme-espresso";
  document.body.setAttribute("data-theme", saved);
  const selector = document.getElementById("theme-select");
  if (selector) selector.value = saved;
}

function switchTheme(themeName) {
  document.body.setAttribute("data-theme", themeName);
  localStorage.setItem(THEME_STORAGE_KEY, themeName);
}

// --------------------------------------------------------------------------
// STORAGE
// --------------------------------------------------------------------------
function loadState() {
  try {
    const raw = localStorage.getItem(COFFEE_STORAGE_KEY);
    if (raw) trainerState = JSON.parse(raw);
  } catch (e) {
    console.warn("Storage load error", e);
  }
}

function saveState() {
  try {
    localStorage.setItem(COFFEE_STORAGE_KEY, JSON.stringify(trainerState));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

// --------------------------------------------------------------------------
// INITIALIZATION
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadState();
  initSidebar();
  selectEpisode(1, 1);
  updateOverallProgress();

  const themeSelector = document.getElementById("theme-select");
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => switchTheme(e.target.value));
  }
});

// --------------------------------------------------------------------------
// SIDEBAR RENDERER
// --------------------------------------------------------------------------
function initSidebar() {
  const menu = document.getElementById("episodes-menu-list");
  menu.innerHTML = "";

  EPISODES.forEach(ep => {
    const solvedCount = ep.levels.filter(lvl => trainerState.solved[lvl.id]).length;
    const isCompleted = solvedCount === ep.levels.length;

    const item = document.createElement("div");
    item.className = `ep-nav-item ${ep.id === curEpId ? "active" : ""}`;
    item.id = `ep-nav-${ep.id}`;
    item.onclick = () => selectEpisode(ep.id, 1);

    const iconSvg = EPISODE_ICON_MAP[ep.id] || ICONS.prompt;
    const cleanName = stripEmojis(ep.shortName);

    item.innerHTML = `
      <div class="ep-info-wrap">
        ${iconSvg}
        <span class="ep-label">${cleanName}</span>
      </div>
      <span class="ep-fraction ${isCompleted ? 'all-done' : ''}" id="fraction-${ep.id}">
        ${solvedCount}/${ep.levels.length}
      </span>
    `;

    menu.appendChild(item);
  });
}

function selectEpisode(epId, lvlNum = 1) {
  curEpId = epId;
  curLvlNum = lvlNum;

  document.querySelectorAll(".ep-nav-item").forEach(el => el.classList.remove("active"));
  const activeNavItem = document.getElementById(`ep-nav-${epId}`);
  if (activeNavItem) activeNavItem.classList.add("active");

  const ep = EPISODES.find(e => e.id === epId);
  if (!ep) return;

  const iconSvg = EPISODE_ICON_MAP[ep.id] || ICONS.prompt;
  document.getElementById("ep-headline-text").innerHTML = `${iconSvg} ${stripEmojis(ep.title)}`;
  document.getElementById("ep-desc-text").textContent = stripEmojis(ep.desc);

  renderLevelTabs(ep);
  loadLevel(ep, curLvlNum);
}

// --------------------------------------------------------------------------
// 6 LEVEL TABS
// --------------------------------------------------------------------------
function renderLevelTabs(ep) {
  const tabsRow = document.getElementById("level-tabs-row");
  tabsRow.innerHTML = "";

  ep.levels.forEach(lvl => {
    const isAct = lvl.num === curLvlNum;
    const isSolved = trainerState.solved[lvl.id];
    const isNoCode = lvl.type === "nocode";

    const btn = document.createElement("button");
    btn.className = `level-tab-sharp ${isAct ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
    btn.onclick = () => {
      curLvlNum = lvl.num;
      renderLevelTabs(ep);
      loadLevel(ep, lvl.num);
    };

    const typeTag = isNoCode ? "ТЕОРИЯ" : "DOM API";
    const checkIcon = isSolved ? ` ${ICONS.check}` : "";

    btn.innerHTML = `
      <span>LVL.${lvl.num}</span>
      <span class="level-kind-indicator">${typeTag}</span>
      <span>${checkIcon}</span>
    `;

    tabsRow.appendChild(btn);
  });
}

// --------------------------------------------------------------------------
// LOAD LEVEL VIEWPORT
// --------------------------------------------------------------------------
function loadLevel(ep, lvlNum) {
  const lvl = ep.levels.find(l => l.num === lvlNum);
  if (!lvl) return;

  const viewport = document.getElementById("level-viewport-container");
  viewport.innerHTML = "";

  if (lvl.type === "nocode") {
    renderNoCodeView(lvl, viewport);
  } else {
    renderCodeView(lvl, viewport);
  }
}

// --------------------------------------------------------------------------
// NO-CODE VIEW (Theory, Gotchas, Quiz, Memory Inspector)
// --------------------------------------------------------------------------
function renderNoCodeView(lvl, container) {
  const stage = document.createElement("div");
  stage.className = "nocode-stage";

  const isSolved = trainerState.solved[lvl.id];
  const cleanTitle = stripEmojis(lvl.title);

  stage.innerHTML = `
    <!-- Theory Block -->
    <div class="sharp-card">
      <div class="card-title-serif">
        <span style="font-family:var(--font-mono);font-size:0.85rem;color:var(--text-muted);">[LVL ${lvl.num}]</span> ${cleanTitle}
      </div>
      <div class="theory-prose">${lvl.explanation}</div>
    </div>

    <!-- Fact Callout -->
    <div class="coffee-fact-box">
      <div class="fact-title-label">
        ${ICONS.bulb}
        <span>ИНТЕРЕСНЫЙ ФАКТ / АРХИТЕКТУРА ЯЗЫКА</span>
      </div>
      <div class="fact-body">${lvl.fact}</div>
    </div>

    <!-- Interactive Challenge Station -->
    <div class="sharp-interactive-station">
      <div class="station-badge">КОНТРОЛЬ ПОНИМАНИЯ НЮАНСА</div>
      <div class="station-question">${lvl.taskText}</div>

      <div id="interactive-station-area"></div>

      <div id="interactive-feedback-dock" style="margin-top: 1.25rem;">
        ${isSolved ? '<div class="sharp-banner success">[СТАТУС: УСПЕШНО ЗАВЕРШЕНО] Уровень пройден.</div>' : ''}
      </div>

      <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <button class="btn-sharp btn-outline" onclick="stepPrevLevel()">НАЗАД</button>
        <button class="btn-sharp btn-accent" onclick="stepNextLevel()">СЛЕДУЮЩИЙ УРОВЕНЬ</button>
      </div>
    </div>
  `;

  container.appendChild(stage);

  const area = document.getElementById("interactive-station-area");

  if (lvl.interactiveType === "prompt_calculator") {
    // Memory Type-Inspector
    area.innerHTML = `
      <div style="background:var(--bg-canvas);border:1px solid var(--border);padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;">
          <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);">ПРЕОБРАЗОВАНИЕ ТИПОВ:</span>
          <label style="display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;">
            <input type="checkbox" id="unary-plus-toggle" style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent);">
            <span style="font-family:var(--font-mono);font-size:0.82rem;font-weight:bold;color:var(--accent);">+prompt() [Унарный плюс]</span>
          </label>
        </div>

        <div style="background:var(--bg-surface);border:1px solid var(--border);padding:0.85rem 1rem;font-family:var(--font-mono);font-size:0.9rem;display:flex;align-items:center;justify-content:space-between;">
          <span style="color:var(--text-muted);">prompt("5") + prompt("5") =</span>
          <span id="prompt-xray-output" style="color:var(--text-main);font-weight:bold;">[Ожидание]</span>
        </div>

        <button class="btn-sharp btn-accent" style="align-self:flex-start;" onclick="execPromptXray('${lvl.id}')">
          ВЫЧИСЛИТЬ В ПАМЯТИ
        </button>
      </div>
    `;
  } else if (lvl.options) {
    const grid = document.createElement("div");
    grid.className = "quiz-sharp-grid";

    lvl.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-sharp";
      btn.innerHTML = `<span>${opt}</span><span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-dim);">[0${idx+1}]</span>`;
      btn.onclick = () => execQuizChoice(lvl, idx, btn);
      grid.appendChild(btn);
    });

    area.appendChild(grid);
  }
}

window.execPromptXray = function(lvlId) {
  const isPlus = document.getElementById("unary-plus-toggle").checked;
  const out = document.getElementById("prompt-xray-output");
  const dock = document.getElementById("interactive-feedback-dock");

  if (isPlus) {
    out.innerHTML = `<span style="color:var(--status-success);">10</span> <span style="font-size:0.75rem;color:var(--text-muted);">(number)</span>`;
    trainerState.solved[lvlId] = true;
    saveState();
    dock.innerHTML = `<div class="sharp-banner success">[ВЕРНО] Унарный плюс выполнил приведение типов к числу: 5 + 5 = 10.</div>`;
    updateOverallProgress();
    updateEpisodeTabs();
  } else {
    out.innerHTML = `<span style="color:var(--status-error);">"55"</span> <span style="font-size:0.75rem;color:var(--text-muted);">(string конкатенация)</span>`;
    dock.innerHTML = `<div class="sharp-banner error">[ОШИБКА] prompt() возвращает строку! Без унарного плюса строки склеились в "55". Включите чекбокс.</div>`;
  }
};

function execQuizChoice(lvl, chosenIdx, btnEl) {
  const dock = document.getElementById("interactive-feedback-dock");
  document.querySelectorAll(".quiz-option-sharp").forEach(b => b.classList.remove("correct", "wrong"));

  if (chosenIdx === lvl.correctIndex) {
    btnEl.classList.add("correct");
    trainerState.solved[lvl.id] = true;
    saveState();
    dock.innerHTML = `<div class="sharp-banner success">[ВЕРНО] Ответ совпадает с архитектурным поведением движка JavaScript.</div>`;
    updateOverallProgress();
    updateEpisodeTabs();
  } else {
    btnEl.classList.add("wrong");
    dock.innerHTML = `<div class="sharp-banner error">[ОШИБКА] Неверно. Перечитайте теоретический блок выше и повторите попытку.</div>`;
  }
}

// --------------------------------------------------------------------------
// CODE VIEW (Two Columns: Spec & Workbench with Overlay Syntax Highlighting)
// --------------------------------------------------------------------------
function renderCodeView(lvl, container) {
  const split = document.createElement("div");
  split.className = "code-split-grid";

  const isSolved = trainerState.solved[lvl.id];
  const cleanTitle = stripEmojis(lvl.title);
  const cleanLegend = stripEmojis(lvl.legend);

  split.innerHTML = `
    <!-- Left Column: Specification & Live DOM Stage -->
    <div class="spec-column">
      
      <div class="legend-sharp-box">
        <div class="legend-sharp-label">СЮЖЕТНАЯ ЛЕГЕНДА ЗАДАНИЯ</div>
        <div style="font-size:0.9rem;line-height:1.55;color:var(--text-main);">${cleanLegend}</div>
      </div>

      <div class="task-sharp-box">
        <div class="task-sharp-title">ТРЕБОВАНИЯ К DOM API:</div>
        <div style="font-size:0.9rem;line-height:1.55;color:var(--text-main);">${lvl.instruction}</div>
      </div>

      <!-- Live Virtual DOM Sandbox Window -->
      <div class="sharp-browser-frame">
        <div class="browser-header-sharp">
          <div class="window-squares">
            <div class="window-sq"></div>
            <div class="window-sq"></div>
            <div class="window-sq"></div>
          </div>
          <div class="browser-uri-sharp">
            dom://episode-${curEpId}/level-${lvl.num}.live
          </div>
        </div>
        <div class="dom-live-arena" id="dom-live-stage">
          ${lvl.domHtml || ''}
        </div>
      </div>

      <div style="display:flex;gap:0.5rem;align-items:center;">
        <button class="btn-sharp btn-hint-coffee" onclick="toggleHintDrawer()">
          ${ICONS.bulb} ПОДСКАЗКА
        </button>
      </div>
      <div id="hint-drawer-content" style="display:none;background:var(--bg-surface);border:1px dashed var(--accent);padding:0.9rem;font-family:var(--font-mono);font-size:0.82rem;color:var(--accent);">
        ${lvl.hint}
      </div>

    </div>

    <!-- Right Column: Code Editor & Terminal Output -->
    <div class="workbench-column">
      
      <div class="workbench-status">
        <span>JAVASCRIPT / ES2024 (DOM API)</span>
        <span>CTRL + ENTER ДЛЯ ЗАПУСКА</span>
      </div>

      <!-- Synchronized Syntax-Highlighted Code Editor -->
      <div class="code-highlighter-wrapper">
        <pre class="code-backdrop" aria-hidden="true"><code id="code-backdrop-content"></code></pre>
        <textarea id="code-workbench-input" class="code-input-area" spellcheck="false"></textarea>
      </div>

      <div class="workbench-actions-bar">
        <div style="display:flex;gap:0.5rem;">
          <button class="btn-sharp btn-accent" onclick="runDomAssertionTest()">
            ${ICONS.terminal} ЗАПУСТИТЬ ТЕСТЫ
          </button>
          <button class="btn-sharp btn-outline" onclick="resetCurrentCode()">СБРОС</button>
        </div>
        <div style="display:flex;gap:0.35rem;">
          <button class="btn-sharp btn-outline" onclick="stepPrevLevel()">ПРЕД</button>
          <button class="btn-sharp btn-outline" onclick="stepNextLevel()">СЛЕД</button>
        </div>
      </div>

      <div class="terminal-dock">
        <div class="terminal-title-sharp">КОНСОЛЬ ПРОВЕРКИ ТЕСТОВ DOM</div>
        <div class="terminal-stream" id="terminal-stream-log">
          ${isSolved ? '<div class="sharp-banner success">[СТАТУС: ТЕСТЫ УЖЕ ПРОЙДЕНЫ] Измените код для повторной проверки.</div>' : '<span style="color:var(--text-dim);font-family:var(--font-mono);">Нажмите [ЗАПУСТИТЬ ТЕСТЫ] для верификации DOM...</span>'}
        </div>
      </div>

    </div>
  `;

  container.appendChild(split);

  const inputArea = document.getElementById("code-workbench-input");
  const backdrop = document.getElementById("code-backdrop-content");

  // Load user code or starter
  const initial = trainerState.code[lvl.id] || lvl.starterCode;
  inputArea.value = initial;
  backdrop.innerHTML = highlightCode(initial) + "\n";

  // Sync scroll
  inputArea.addEventListener("scroll", () => {
    backdrop.parentElement.scrollTop = inputArea.scrollTop;
    backdrop.parentElement.scrollLeft = inputArea.scrollLeft;
  });

  // Live syntax highlighter on input
  inputArea.addEventListener("input", () => {
    const val = inputArea.value;
    backdrop.innerHTML = highlightCode(val) + "\n";
    trainerState.code[lvl.id] = val;
    saveState();
  });

  // Tab key & Ctrl+Enter
  inputArea.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runDomAssertionTest();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = inputArea.selectionStart;
      const end = inputArea.selectionEnd;
      inputArea.value = inputArea.value.substring(0, start) + "  " + inputArea.value.substring(end);
      inputArea.selectionStart = inputArea.selectionEnd = start + 2;
      backdrop.innerHTML = highlightCode(inputArea.value) + "\n";
    }
  });
}

// --------------------------------------------------------------------------
// TEST EXECUTION
// --------------------------------------------------------------------------
window.runDomAssertionTest = function() {
  const ep = EPISODES.find(e => e.id === curEpId);
  const lvl = ep.levels.find(l => l.num === curLvlNum);
  if (!lvl || lvl.type !== "code") return;

  const inputArea = document.getElementById("code-workbench-input");
  const userCode = inputArea.value;
  trainerState.code[lvl.id] = userCode;
  saveState();

  const stage = document.getElementById("dom-live-stage");
  stage.innerHTML = lvl.domHtml || "";

  const stream = document.getElementById("terminal-stream-log");

  try {
    const resultMsg = lvl.test(userCode, stage);

    trainerState.solved[lvl.id] = true;
    saveState();

    stream.innerHTML = `
      <div class="sharp-banner success">
        [PASS] ВСЕ ТЕСТЫ УСПЕШНО ПРОЙДЕНЫ
      </div>
      <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted);margin-top:0.35rem;">
        ${stripEmojis(resultMsg)}
      </div>
    `;

    updateOverallProgress();
    updateEpisodeTabs();

  } catch (err) {
    stream.innerHTML = `
      <div class="sharp-banner error">
        [FAIL] ОШИБКА ВЫПОЛНЕНИЯ ТЕСТА DOM
      </div>
      <div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--status-error);margin-top:0.35rem;">
        ${err.message}
      </div>
    `;
  }
};

window.resetCurrentCode = function() {
  const ep = EPISODES.find(e => e.id === curEpId);
  const lvl = ep.levels.find(l => l.num === curLvlNum);
  if (!lvl) return;
  if (confirm("Сбросить написанный код к исходному шаблону?")) {
    const inputArea = document.getElementById("code-workbench-input");
    const backdrop = document.getElementById("code-backdrop-content");
    inputArea.value = lvl.starterCode;
    backdrop.innerHTML = highlightCode(lvl.starterCode) + "\n";
    delete trainerState.code[lvl.id];
    saveState();
  }
};

window.toggleHintDrawer = function() {
  const drawer = document.getElementById("hint-drawer-content");
  drawer.style.display = drawer.style.display === "none" ? "block" : "none";
};

window.stepNextLevel = function() {
  if (curLvlNum < 6) {
    selectEpisode(curEpId, curLvlNum + 1);
  } else if (curEpId < EPISODES.length) {
    selectEpisode(curEpId + 1, 1);
  } else {
    alert("Все 54 уровня тренажёра успешно завершены.");
  }
};

window.stepPrevLevel = function() {
  if (curLvlNum > 1) {
    selectEpisode(curEpId, curLvlNum - 1);
  } else if (curEpId > 1) {
    selectEpisode(curEpId - 1, 6);
  }
};

function updateEpisodeTabs() {
  const ep = EPISODES.find(e => e.id === curEpId);
  if (ep) {
    renderLevelTabs(ep);
    const fraction = document.getElementById(`fraction-${ep.id}`);
    const solved = ep.levels.filter(l => trainerState.solved[l.id]).length;
    if (fraction) {
      fraction.textContent = `${solved}/${ep.levels.length}`;
      if (solved === ep.levels.length) fraction.classList.add("all-done");
    }
  }
}

function updateOverallProgress() {
  const solvedCount = Object.keys(trainerState.solved).length;
  const total = EPISODES.length * 6; // 54
  const pct = Math.round((solvedCount / total) * 100);

  const fill = document.getElementById("global-progress-fill");
  const val = document.getElementById("global-progress-val");
  if (fill) fill.style.width = `${pct}%`;
  if (val) val.textContent = `${solvedCount} / ${total} (${pct}%)`;
}
