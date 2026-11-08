// ========================================================
// ЛОГИКА ТРЕНАЖЁРА С ЭПИЗОДАМИ И УРОВНЯМИ
// ========================================================

const STORAGE_KEY = "js_episodes_trainer_v1";

const SUCCESS_JOKES = [
  "Красава! Даже линтер пустил скупую слезу счастья 🥲",
  "Код чистый, сервер не упал! Заслуженный плюс к карме 🚀",
  "Твой тимлид молча закрыл пуллреквест и поставил аппрув 🎉",
  "Кот накормлен, баги побеждены! Беги за кофе ☕",
  "Сеньор-помидор ставит 10/10 🍅",
  "Работает как швейцарские часы с неоновой подсветкой ✨⏱️"
];

const ERROR_JOKES = [
  "Ой-вэй! Что-то пошло не по плану... Почитай ошибку ниже! 💥",
  "Где-то в мире грустит один кот. Попробуй исправить! 😿",
  "Код споткнулся о суровую реальность. Подсказка уже ждёт тебя! 🧐",
  "Почти получилось! Ещё чуть-чуть дотянуть логику 🛠️"
];

let currentEpisodeId = 1;
let currentLevelNum = 1; // 1 to 6
let trainerState = {
  solved: {}, // { [levelId]: true }
  userCode: {} // { [levelId]: "..." }
};

// LocalStorage
function loadTrainerState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) trainerState = JSON.parse(raw);
  } catch (e) {
    console.warn("Storage load error", e);
  }
}

function saveTrainerState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainerState));
  } catch (e) {
    console.warn("Storage save error", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTrainerState();
  initEpisodeSidebar();
  selectEpisode(1, 1);
  updateTotalProgress();
});

// Инициализация боковой панели эпизодов
function initEpisodeSidebar() {
  const container = document.getElementById("episode-list");
  container.innerHTML = "";

  EPISODES.forEach(ep => {
    const solvedCount = ep.levels.filter(lvl => trainerState.solved[lvl.id]).length;
    const isCompleted = solvedCount === ep.levels.length;

    const item = document.createElement("div");
    item.className = `episode-item ${ep.id === currentEpisodeId ? "active" : ""}`;
    item.id = `sidebar-ep-${ep.id}`;
    item.onclick = () => selectEpisode(ep.id, 1);

    item.innerHTML = `
      <div class="episode-item-info">
        <span class="episode-icon">${ep.icon}</span>
        <span class="episode-name">${ep.shortName}</span>
      </div>
      <span class="episode-pill ${isCompleted ? 'completed' : ''}" id="ep-pill-${ep.id}">
        ${solvedCount}/${ep.levels.length}
      </span>
    `;

    container.appendChild(item);
  });
}

// Выбор эпизода и уровня
function selectEpisode(epId, lvlNum = 1) {
  currentEpisodeId = epId;
  currentLevelNum = lvlNum;

  // Подсветка в сайдбаре
  document.querySelectorAll(".episode-item").forEach(el => el.classList.remove("active"));
  const activeSidebarItem = document.getElementById(`sidebar-ep-${epId}`);
  if (activeSidebarItem) activeSidebarItem.classList.add("active");

  const ep = EPISODES.find(e => e.id === epId);
  if (!ep) return;

  // Заголовок эпизода
  document.getElementById("ep-title").innerHTML = `${ep.icon} ${ep.title}`;
  document.getElementById("ep-desc").textContent = ep.desc;

  renderLevelTabs(ep);
  loadLevel(ep, currentLevelNum);
}

// Рендер 6 табов уровней (3 No-Code + 3 Code with DOM)
function renderLevelTabs(ep) {
  const tabsContainer = document.getElementById("level-tabs");
  tabsContainer.innerHTML = "";

  ep.levels.forEach(lvl => {
    const isAct = lvl.num === currentLevelNum;
    const isSolved = trainerState.solved[lvl.id];
    const isNoCode = lvl.type === "nocode";

    const btn = document.createElement("button");
    btn.className = `level-tab-btn ${isAct ? 'active' : ''} ${isSolved ? 'solved' : ''}`;
    btn.id = `lvl-tab-${lvl.num}`;
    btn.onclick = () => {
      currentLevelNum = lvl.num;
      renderLevelTabs(ep);
      loadLevel(ep, lvl.num);
    };

    const typeTag = isNoCode ? "🧠 Теория" : "💻 DOM-код";
    const check = isSolved ? " ✓" : "";
    btn.innerHTML = `
      <span>Ур. ${lvl.num}</span>
      <span class="badge-tag">${typeTag}</span>
      <span>${check}</span>
    `;

    tabsContainer.appendChild(btn);
  });
}

// Загрузка конкретного уровня
function loadLevel(ep, lvlNum) {
  const lvl = ep.levels.find(l => l.num === lvlNum);
  if (!lvl) return;

  const contentArea = document.getElementById("level-content-area");
  contentArea.innerHTML = "";

  if (lvl.type === "nocode") {
    renderNoCodeView(lvl, contentArea);
  } else {
    renderCodeView(lvl, contentArea);
  }
}

// ==========================================
// РЕНДЕР NO-CODE УРОВНЯ (1 - 3)
// ==========================================
function renderNoCodeView(lvl, container) {
  const view = document.createElement("div");
  view.className = "nocode-view";

  const isSolved = trainerState.solved[lvl.id];

  view.innerHTML = `
    <!-- Теория и нюанс -->
    <div class="theory-card">
      <h3>🧠 ${lvl.title}</h3>
      <div class="theory-body">${lvl.explanation}</div>
    </div>

    <!-- Интересный факт -->
    <div class="fact-card">
      <div class="fact-title">💡 Любопытный факт под капотом</div>
      <div class="fact-text">${lvl.fact}</div>
    </div>

    <!-- Интерактивный тренажёр-симулятор без кода -->
    <div class="interactive-simulator-card">
      <div class="sim-header">🎮 Интерактивная проверка нюанса</div>
      <p style="font-size: 0.9rem; margin-bottom: 1rem; color: #cbd5e1;">${lvl.taskText}</p>
      
      <div id="nocode-interactive-box">
        <!-- Генерируется ниже -->
      </div>

      <div id="nocode-feedback" style="margin-top: 1rem; font-size: 0.88rem;">
        ${isSolved ? '<div class="banner success">✅ Уровень уже успешно пройден!</div>' : ''}
      </div>

      <div style="margin-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <button class="btn btn-secondary" onclick="prevLevel()">⬅️ Назад</button>
        <button class="btn btn-primary" onclick="nextLevel()">Следующий уровень ➡️</button>
      </div>
    </div>
  `;

  container.appendChild(view);

  // Наполнение интерактива
  const box = document.getElementById("nocode-interactive-box");

  if (lvl.interactiveType === "prompt_calculator") {
    // Интерактивный калькулятор унарного плюса
    box.innerHTML = `
      <div style="background:#090d16; border:1px solid var(--border); border-radius:8px; padding:1rem; display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <input type="checkbox" id="calc-unary-plus" style="width:18px; height:18px; cursor:pointer;">
          <label for="calc-unary-plus" style="color:var(--accent); font-weight:bold; cursor:pointer;">Использовать унарный плюс: +prompt()</label>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span style="font-family:var(--font-mono); color:#94a3b8;">prompt("5") + prompt("5") = </span>
          <span id="calc-res-display" style="font-family:var(--font-mono); font-size:1.2rem; font-weight:bold; color:#f8fafc;">???</span>
        </div>
        <button class="btn btn-primary" style="align-self:flex-start;" onclick="testPromptCalc('${lvl.id}')">Вычислить результат</button>
      </div>
    `;
  } else if (lvl.options) {
    // Викторина с выбором
    const optContainer = document.createElement("div");
    optContainer.className = "quiz-options";

    lvl.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option-btn";
      btn.innerHTML = optText;
      btn.onclick = () => checkQuizAnswer(lvl, idx, btn);
      optContainer.appendChild(btn);
    });

    box.appendChild(optContainer);
  }
}

// Проверка интерактивного калькулятора prompt
window.testPromptCalc = function(lvlId) {
  const usePlus = document.getElementById("calc-unary-plus").checked;
  const display = document.getElementById("calc-res-display");
  const fb = document.getElementById("nocode-feedback");

  if (usePlus) {
    display.textContent = "10 (число)";
    display.style.color = "lime";
    trainerState.solved[lvlId] = true;
    saveTrainerState();
    fb.innerHTML = `<div class="banner success">🎉 Точно! +prompt("5") + +prompt("5") дало число 10! Ловушка склейки строк обезврежена.</div>`;
    updateTotalProgress();
    updateEpisodeTabs();
  } else {
    display.textContent = '"55" (строка!)';
    display.style.color = "orange";
    fb.innerHTML = `<div class="banner error">⚠️ Ловушка сработала! Без унарного плюса строки склеились в "55"! Включи галочку выше.</div>`;
  }
};

// Проверка викторин
function checkQuizAnswer(lvl, selectedIdx, btnElement) {
  const fb = document.getElementById("nocode-feedback");
  const allBtns = document.querySelectorAll(".quiz-option-btn");
  allBtns.forEach(b => b.classList.remove("selected", "correct", "wrong"));

  if (selectedIdx === lvl.correctIndex) {
    btnElement.classList.add("correct");
    trainerState.solved[lvl.id] = true;
    saveTrainerState();
    fb.innerHTML = `<div class="banner success">✅ Абсолютно верно! Отличная интуиция в нюансах JS!</div>`;
    updateTotalProgress();
    updateEpisodeTabs();
  } else {
    btnElement.classList.add("wrong");
    fb.innerHTML = `<div class="banner error">❌ Не совсем так! Перечитай блок теории выше и попробуй ещё раз.</div>`;
  }
}

// ==========================================
// РЕНДЕР CODE С DOM УРОВНЯ (4 - 6)
// ==========================================
function renderCodeView(lvl, container) {
  const view = document.createElement("div");
  view.className = "code-view";

  const isSolved = trainerState.solved[lvl.id];

  view.innerHTML = `
    <!-- Левая колонка: Легенда, Задание, Виртуальный DOM -->
    <div class="code-left-panel">
      
      <div class="legend-box">
        <div class="legend-badge">📖 Сюжет задания</div>
        <div style="font-size: 0.88rem; color: #cbd5e1; line-height: 1.5;">${lvl.legend}</div>
      </div>

      <div class="instruction-box">
        <h3>🎯 Задание для DOM:</h3>
        <p style="font-size: 0.88rem; line-height: 1.5; color: #f8fafc;">${lvl.instruction}</p>
      </div>

      <!-- Live Virtual DOM Sandbox -->
      <div class="dom-preview-card">
        <div class="dom-preview-header">
          <span>🌐 Интерактивный DOM-контейнер</span>
          <small style="color: var(--text-muted); font-size: 0.7rem;">(изменения видны вживую)</small>
        </div>
        <div id="dom-sandbox-container">
          ${lvl.domHtml || ''}
        </div>
      </div>

      <!-- Подсказка -->
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <button class="btn btn-hint" onclick="toggleHint()">💡 Подсказка</button>
      </div>
      <div class="hint-box" id="level-hint-box">
        <div style="font-size: 0.85rem; color: #fde68a;">${lvl.hint}</div>
      </div>

    </div>

    <!-- Правая колонка: Редактор кода + Консоль -->
    <div class="code-right-panel">
      <div class="editor-header">
        <span>JavaScript + DOM API</span>
        <span style="font-size: 0.72rem; color: #64748b;">Ctrl + Enter для запуска • Tab: 2 пробела</span>
      </div>

      <div class="editor-wrapper">
        <textarea id="code-input" spellcheck="false"></textarea>
      </div>

      <div class="editor-footer">
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-primary" onclick="runCodeTest()">🚀 Запустить и проверить код</button>
          <button class="btn btn-secondary" onclick="resetLevelCode()">🔄 Сброс</button>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-secondary" onclick="prevLevel()">⬅️</button>
          <button class="btn btn-secondary" onclick="nextLevel()">➡️</button>
        </div>
      </div>

      <div class="console-panel">
        <div class="console-title">📊 Консоль проверки и тестов</div>
        <div class="console-output" id="code-console-out">
          ${isSolved ? '<div class="banner success">✅ Уровень успешно решён! Можно изменить код и запустить снова.</div>' : '<span style="color:var(--text-muted)">Нажмите "Запустить и проверить код" (или Ctrl+Enter)...</span>'}
        </div>
      </div>
    </div>
  `;

  container.appendChild(view);

  // Инициализация редактора
  const editor = document.getElementById("code-input");
  editor.value = trainerState.userCode[lvl.id] || lvl.starterCode;

  // Tab и Ctrl+Enter
  editor.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCodeTest();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + "  " + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
  });

  editor.addEventListener("input", () => {
    trainerState.userCode[lvl.id] = editor.value;
    saveTrainerState();
  });
}

// Запуск теста кода с DOM
window.runCodeTest = function() {
  const ep = EPISODES.find(e => e.id === currentEpisodeId);
  const lvl = ep.levels.find(l => l.num === currentLevelNum);
  if (!lvl || lvl.type !== "code") return;

  const editor = document.getElementById("code-input");
  const userCode = editor.value;
  trainerState.userCode[lvl.id] = userCode;
  saveTrainerState();

  const domSandbox = document.getElementById("dom-sandbox-container");
  // Сбрасываем HTML перед запуском
  domSandbox.innerHTML = lvl.domHtml || "";

  const consoleOut = document.getElementById("code-console-out");

  try {
    const successMsg = lvl.test(userCode, domSandbox);

    trainerState.solved[lvl.id] = true;
    saveTrainerState();

    const joke = SUCCESS_JOKES[Math.floor(Math.random() * SUCCESS_JOKES.length)];

    consoleOut.innerHTML = `
      <div class="banner success">
        🎉 ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!
        <div style="font-size:0.8rem; font-style:italic; margin-top:0.3rem;">${joke}</div>
      </div>
      <div style="color:#cbd5e1; font-size:0.85rem;">${successMsg}</div>
    `;

    updateTotalProgress();
    updateEpisodeTabs();

  } catch (err) {
    const joke = ERROR_JOKES[Math.floor(Math.random() * ERROR_JOKES.length)];

    consoleOut.innerHTML = `
      <div class="banner error">
        ❌ ОШИБКА В ТЕСТЕ DOM:
        <div style="font-size:0.8rem; font-style:italic; margin-top:0.3rem;">${joke}</div>
      </div>
      <div style="color:#fca5a5; font-size:0.85rem;">${err.message}</div>
    `;
  }
};

window.resetLevelCode = function() {
  const ep = EPISODES.find(e => e.id === currentEpisodeId);
  const lvl = ep.levels.find(l => l.num === currentLevelNum);
  if (!lvl) return;
  if (confirm("Сбросить код задания к исходному?")) {
    document.getElementById("code-input").value = lvl.starterCode;
    delete trainerState.userCode[lvl.id];
    saveTrainerState();
  }
};

window.toggleHint = function() {
  const box = document.getElementById("level-hint-box");
  box.classList.toggle("visible");
};

// Навигация по уровням
window.nextLevel = function() {
  if (currentLevelNum < 6) {
    selectEpisode(currentEpisodeId, currentLevelNum + 1);
  } else if (currentEpisodeId < EPISODES.length) {
    selectEpisode(currentEpisodeId + 1, 1);
  } else {
    alert("🏆 Поздравляем! Вы прошли все уровни тренажёра!");
  }
};

window.prevLevel = function() {
  if (currentLevelNum > 1) {
    selectEpisode(currentEpisodeId, currentLevelNum - 1);
  } else if (currentEpisodeId > 1) {
    selectEpisode(currentEpisodeId - 1, 6);
  }
};

function updateEpisodeTabs() {
  const ep = EPISODES.find(e => e.id === currentEpisodeId);
  if (ep) {
    renderLevelTabs(ep);
    const pill = document.getElementById(`ep-pill-${ep.id}`);
    const solvedCount = ep.levels.filter(lvl => trainerState.solved[lvl.id]).length;
    if (pill) {
      pill.textContent = `${solvedCount}/${ep.levels.length}`;
      if (solvedCount === ep.levels.length) pill.classList.add("completed");
    }
  }
}

function updateTotalProgress() {
  const solvedCount = Object.keys(trainerState.solved).length;
  const totalLevels = EPISODES.length * 6; // 54
  const pct = Math.round((solvedCount / totalLevels) * 100);

  const fillEl = document.getElementById("overall-progress-fill");
  const textEl = document.getElementById("overall-progress-text");
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (textEl) textEl.textContent = `${solvedCount} / ${totalLevels} (${pct}%)`;
}
