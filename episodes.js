// ========================================================
// ДАННЫЕ 9 ЭПИЗОДОВ ТРЕНАЖЁРА (54 УРОВНЯ)
// Каждый эпизод: 3 уровня без кода (нюансы + интерактивы) + 3 уровня с кодом и DOM
// ========================================================

const EPISODES = [
  // ======================================================
  // ЭПИЗОД 1: Ввод и вывод (prompt и alert)
  // ======================================================
  {
    id: 1,
    title: "Эпизод 1: Ввод и вывод с помощью prompt и alert",
    shortName: "1. Prompt & Alert",
    icon: "💬",
    desc: "Диалоговые окна браузера, блокировка потока, тайп-кастинг и подводные камни строк.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "1-1",
        num: 1,
        type: "nocode",
        title: "Ловушка склейки строк: prompt ВСЕГДА возвращает string! 🪤",
        explanation: `
          Функция <code>prompt()</code> всегда возвращает <b>строку</b> (тип <code>string</code>), даже если пользователь ввёл число <code>100</code>!
          <br><br>
          Если сложить два результата: <code>prompt() + prompt()</code>, JavaScript выполнит <b>конкатенацию</b> (склейку): <code>"5" + "5" = "55"</code>!
          <br>
          Чтобы сложить числа математически, нужно применить <b>унарный плюс</b>: <code>+prompt()</code> или обернуть в <code>Number(prompt())</code>.
        `,
        fact: "В 1995 году Брендан Эйх добавил alert() и prompt() за первые 10 дней создания JS. Эти окна являются <b>модальными</b>: они намертво замораживают весь поток выполнения страницы и отрисовку, пока пользователь не нажмёт кнопку!",
        interactiveType: "prompt_calculator",
        taskText: "Переключите тумблер унарного плюса и нажмите «Вычислить», чтобы получить сумму 10 вместо строки '55':"
      },
      // Level 2 (No-Code)
      {
        id: "1-2",
        num: 2,
        type: "nocode",
        title: "Отмена против Пустой строки: null vs '' 🎭",
        explanation: `
          Когда открывается <code>prompt()</code>, у пользователя есть два способа «не вводить значение»:
          <ul>
            <li>Нажать <b>«Отмена»</b> (или клавишу Esc) ➔ вернётся специальный примитив <code>null</code>.</li>
            <li>Нажать <b>«ОК»</b> с пустым полем ➔ вернётся пустая строка <code>""</code>.</li>
          </ul>
          Для JS это абсолютно разные вещи: <code>typeof null === "object"</code> (исторический баг JS), а <code>typeof "" === "string"</code>!
        `,
        fact: "Если передать в prompt значение по умолчанию: <code>prompt('Вопрос', 'ответ')</code>, в старых версиях Internet Explorer без второго параметра поле заполнялось строкой <code>'undefined'</code>!",
        interactiveType: "quiz_prompt_null",
        taskText: "Что вернёт вызов <code>prompt('Имя')</code>, если пользователь нажал кнопку «Отмена» (Cancel)?",
        options: ["false", "undefined", "null", "'' (пустую строку)"],
        correctIndex: 2
      },
      // Level 3 (No-Code)
      {
        id: "1-3",
        num: 3,
        type: "nocode",
        title: "Привидения alert(): всё превращается в строку 👻",
        explanation: `
          Окно <code>alert(x)</code> не может отображать сложные структуры как консоль. Перед выводом оно неявно вызывает метод <code>.toString()</code> у переданного значения:
          <ul>
            <li><code>alert([1, 2, 3])</code> ➔ превращается в строку <code>"1,2,3"</code></li>
            <li><code>alert({})</code> ➔ превращается в легендарный <code>"[object Object]"</code></li>
            <li><code>alert(null)</code> ➔ выводит строку <code>"null"</code></li>
          </ul>
          Кроме того, вызов <code>alert()</code> сам по себе всегда возвращает <code>undefined</code>!
        `,
        fact: "Строка <code>[object Object]</code> стала главным интернет-мемом JavaScript-сообщества. Она порождена внутренним алгоритмом <code>Object.prototype.toString()</code>.",
        interactiveType: "string_converter",
        taskText: "Выберите, что именно покажет <code>alert({ name: 'Кот' })</code>:",
        options: ["{ name: 'Кот' }", "[object Object]", "undefined", "NaN"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "1-4",
        num: 4,
        type: "code",
        title: "Приветственный баннер в DOM 🏷️",
        legend: "Создаём приветственный баннер для сайта. Нужно спросить имя гостя и вывести его в заголовок страницы.",
        domHtml: `<h1 id="welcome-banner" style="color:#38bdf8;">Ожидание гостя...</h1>`,
        instruction: "Напишите функцию <code>greetUser(name)</code>. Она должна найти элемент <code>#welcome-banner</code> и записать в его <code>textContent</code> строку: <code>'Привет, ' + name + '!'</code>. Если передано пустое имя или null — записать <code>'Привет, Аноним!'</code>.",
        starterCode: `function greetUser(name) {
  // Найди #welcome-banner и обнови textContent:
  
}`,
        hint: "Используй: `const title = document.getElementById('welcome-banner'); title.textContent = 'Привет, ' + (name ? name : 'Аноним') + '!';`",
        test: (code, dom) => {
          dom.innerHTML = `<h1 id="welcome-banner">Старт</h1>`;
          const fn = new Function("document", `${code}; return greetUser;`)(document);
          fn("Алексей");
          const el = dom.querySelector("#welcome-banner");
          if (el.textContent !== "Привет, Алексей!") throw new Error("Ожидалось 'Привет, Алексей!', а получено: " + el.textContent);
          fn("");
          if (el.textContent !== "Привет, Аноним!") throw new Error("Для пустого имени ожидалось 'Привет, Аноним!'");
          return "Приветственный баннер отлично обновляет DOM! 🌟";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "1-5",
        num: 5,
        type: "code",
        title: "Калькулятор площади для DOM 📐",
        legend: "Пользователь вводит сторону квадрата. Вычислите площадь и отобразите результат в карточке результата.",
        domHtml: `<div id="square-box" style="padding:10px; background:#1e293b; border-radius:6px;">Площадь: 0</div>`,
        instruction: "Напишите функцию <code>renderSquareArea(side)</code>. Преобразуйте <code>side</code> в число с помощью унарного плюса. Вычислите площадь (<code>side ** 2</code>) и выведите в элемент <code>#square-box</code> текст: <code>'Площадь квадрата: ' + area + ' кв. м'</code>.",
        starterCode: `function renderSquareArea(side) {
  // Преобразуй в число, посчитай площадь и выведи в #square-box:
  
}`,
        hint: "`const num = +side; const area = num * num; document.getElementById('square-box').textContent = 'Площадь квадрата: ' + area + ' кв. м';`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="square-box">0</div>`;
          const fn = new Function("document", `${code}; return renderSquareArea;`)(document);
          fn("5");
          const el = dom.querySelector("#square-box");
          if (!el.textContent.includes("25 кв. м")) throw new Error("Для стороны '5' ожидалось '... 25 кв. м', получено: " + el.textContent);
          return "Математика и DOM сошлись воедино! 📐✨";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "1-6",
        num: 6,
        type: "code",
        title: "Модальное подтверждение секретного режима 🔒",
        legend: "Если пользователь подтвердил доступ (confirm === true), меняем оформление секретной панели в DOM.",
        domHtml: `<div id="secret-panel" style="padding:10px; background:#334155;">Секретный режим выключен</div>`,
        instruction: "Напишите функцию <code>toggleSecretMode(isConfirmed)</code>. Если <code>isConfirmed === true</code>, добавьте элементу <code>#secret-panel</code> класс <code>'unlocked'</code>, зелёный фон (<code>style.backgroundColor = 'green'</code>) и текст <code>'Доступ разрешён! 🔓'</code>. Иначе — красный фон (<code>'crimson'</code>) и текст <code>'Доступ заблокирован! 🚫'</code>.",
        starterCode: `function toggleSecretMode(isConfirmed) {
  // Обнови стили и текст #secret-panel:
  
}`,
        hint: "Используй `if (isConfirmed) { ... } else { ... }` для изменения style.backgroundColor и textContent.",
        test: (code, dom) => {
          dom.innerHTML = `<div id="secret-panel">Статус</div>`;
          const fn = new Function("document", `${code}; return toggleSecretMode;`)(document);
          fn(true);
          const el = dom.querySelector("#secret-panel");
          if (el.textContent !== "Доступ разрешён! 🔓" || el.style.backgroundColor !== "green") {
            throw new Error("Неверное оформление при подтверждении (isConfirmed=true)!");
          }
          fn(false);
          if (el.textContent !== "Доступ заблокирован! 🚫" || el.style.backgroundColor !== "crimson") {
            throw new Error("Неверное оформление при отказе (isConfirmed=false)!");
          }
          return "Секретный режим корректно реагирует на подтверждение! 🔐";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 2: Переменные (let, const, +=, -=)
  // ======================================================
  {
    id: 2,
    title: "Эпизод 2: Переменные и операторы +=, -=",
    shortName: "2. Переменные (+=, -=)",
    icon: "📦",
    desc: "Области видимости let/const, Temporal Dead Zone, составные операторы накопления +=, -=, *=.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "2-1",
        num: 1,
        type: "nocode",
        title: "Константа не константна? const vs let 🧱",
        explanation: `
          Ключевое слово <code>const</code> защищает от перезаписи <b>саму переменную</b> (ссылку в памяти), но НЕ защищает внутренности объекта или массива!
          <br><br>
          <code>const num = 10; num = 20;</code> ➔ 💥 <code>TypeError: Assignment to constant variable</code>.
          <br>
          Но: <code>const arr = [1, 2]; arr.push(3);</code> ➔ ✅ Работает на ура!
        `,
        fact: "В старом JS до 2015 года (ES6) был только `var`. У него не было блочной области видимости (он «утекал» из блоков `if` и `for`) и он всплывал (hoisting), что породило миллионы багов.",
        interactiveType: "const_sandbox",
        taskText: "Какая из этих строк вызовет фатальную ошибку TypeError при выполнении?",
        options: [
          "let score = 10; score += 5;",
          "const name = 'Барсик'; name = 'Мурзик';",
          "const items = []; items.push('пицца');",
          "const user = { age: 20 }; user.age = 21;"
        ],
        correctIndex: 1
      },
      // Level 2 (No-Code)
      {
        id: "2-2",
        num: 2,
        type: "nocode",
        title: "Магия операторов += и -=: Сложение чисел vs Склейка 🧮",
        explanation: `
          Оператор <code>a += b</code> — это сокращение от <code>a = a + b</code>.
          <br>
          Но будь осторожен с типами!
          <ul>
            <li>Если <code>x = 10</code>, то <code>x += 5</code> ➔ <code>15</code> (число).</li>
            <li>Если <code>x = "10"</code>, то <code>x += 5</code> ➔ <code>"105"</code> (строка!).</li>
            <li>А вот с <code>-=</code> всегда происходит математика: <code>"10" -= 2</code> ➔ <code>8</code>, потому что у строк нет вычитания!</li>
          </ul>
        `,
        fact: "Операторы `+=` и `-=` пришли из языка C. Они были созданы в 1970-х годах, чтобы помочь ранним компиляторам генерировать более короткие инструкции процессора (ADD и SUB) без лишнего копирования регистра.",
        interactiveType: "op_assign_sim",
        taskText: "Чему равно значение переменной <code>val</code> после кода: <code>let val = 20; val += 10; val -= 5;</code>?",
        options: ["35", "25", "20105", "15"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "2-3",
        num: 3,
        type: "nocode",
        title: "Инкремент: почему x++ и ++x работают по-разному? ⏱️",
        explanation: `
          И <code>x++</code>, и <code>++x</code> увеличивают значение переменной на 1. Но разница в том, <b>что именно возвращает выражение</b> в момент вызова:
          <ul>
            <li><b>Постфиксный (x++):</b> СНАЧАЛА возвращает старое значение, а ПОТОМ увеличивает.</li>
            <li><b>Префиксный (++x):</b> СНАЧАЛА увеличивает, а ПОТОМ возвращает новое значение.</li>
          </ul>
          Пример: <code>let a = 5; let b = a++;</code> ➔ <code>b === 5</code>, а <code>a === 6</code>!
        `,
        fact: "Название языка программирования «C++» придумал Рик Масситти в 1983 году как шутку: язык Си, увеличенный на единичку через постфиксный инкремент.",
        interactiveType: "increment_visualizer",
        taskText: "Что будет в переменной `y` после выполнения: <code>let x = 3; let y = ++x;</code>?",
        options: ["3", "4", "5", "undefined"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "2-4",
        num: 4,
        type: "code",
        title: "Пополнение баланса через += 💰",
        legend: "В онлайн-кошельке отображается баланс. При пополнении нужно прибавить сумму через оператор += и обновить DOM.",
        domHtml: `<div id="wallet-card">Баланс: <span id="balance-val">100</span> ₽</div>`,
        instruction: "Напишите функцию <code>topUpBalance(amount)</code>. Считайте число из <code>#balance-val</code> в переменную <code>let balance</code>. Прибавьте сумму через <code>balance += amount</code> и запишите новое значение обратно в <code>#balance-val</code>.",
        starterCode: `function topUpBalance(amount) {
  // Считай баланс, прибавь amount через += и запиши в #balance-val:
  
}`,
        hint: "Не забудь превратить текст в число: `let balance = +document.getElementById('balance-val').textContent; balance += amount; ...`",
        test: (code, dom) => {
          dom.innerHTML = `<span id="balance-val">100</span>`;
          const fn = new Function("document", `${code}; return topUpBalance;`)(document);
          fn(50);
          const el = dom.querySelector("#balance-val");
          if (el.textContent.trim() !== "150") throw new Error("Баланс должен был стать 150, а получен: " + el.textContent);
          fn(25);
          if (el.textContent.trim() !== "175") throw new Error("После второго пополнения ожидалось 175, а получено: " + el.textContent);
          return "Оператор += пополнил кошелёк безупречно! 💳💵";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "2-5",
        num: 5,
        type: "code",
        title: "Получение урона боссом через -= 💥",
        legend: "Рейд наносит удар по дракону. Здоровье босса должно уменьшиться с помощью оператора -=.",
        domHtml: `<div id="boss-hp" style="font-weight:bold; color:red;">400</div>`,
        instruction: "Напишите функцию <code>dealDamage(dmg)</code>. Получите текущее здоровье из <code>#boss-hp</code>, уменьшите его через <code>hp -= dmg</code> (не давая упасть ниже 0 через <code>Math.max(0, hp)</code>) и обновите текст <code>#boss-hp</code>.",
        starterCode: `function dealDamage(dmg) {
  // Считай здоровье, отними dmg через -= и обнови #boss-hp:
  
}`,
        hint: "`let hp = +document.getElementById('boss-hp').textContent; hp -= dmg; if (hp < 0) hp = 0; document.getElementById('boss-hp').textContent = hp;`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="boss-hp">400</div>`;
          const fn = new Function("document", `${code}; return dealDamage;`)(document);
          fn(150);
          const el = dom.querySelector("#boss-hp");
          if (el.textContent.trim() !== "250") throw new Error("После 150 урона ожидалось 250 HP!");
          fn(300);
          if (el.textContent.trim() !== "0") throw new Error("Здоровье не должно опускаться ниже 0!");
          return "Оператор -= нанёс сокрушительный удар по боссу! 🐉🗡️";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "2-6",
        num: 6,
        type: "code",
        title: "Накопление логов в DOM через += 📜",
        legend: "Чат-бот регистрирует системные события, прикрепляя новые строки через innerHTML +=.",
        domHtml: `<div id="log-console" style="background:#090d16; padding:8px;"></div>`,
        instruction: "Напишите функцию <code>appendLog(message)</code>. Найдите <code>#log-console</code> и добавьте в него новую строку с помощью <code>innerHTML += '<p class=\"log-row\">' + message + '</p>'</code>.",
        starterCode: `function appendLog(message) {
  // Добавь новую строку параграфа через innerHTML += :
  
}`,
        hint: "`document.getElementById('log-console').innerHTML += '<p class=\"log-row\">' + message + '</p>';`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="log-console"></div>`;
          const fn = new Function("document", `${code}; return appendLog;`)(document);
          fn("Сервер запущен");
          fn("Пользователь вошёл");
          const rows = dom.querySelectorAll("#log-console .log-row");
          if (rows.length !== 2) throw new Error("В логе должно быть ровно 2 записи!");
          if (!rows[1].textContent.includes("Пользователь вошёл")) throw new Error("Текст второй строки не совпадает!");
          return "Логи накапливаются через += идеально! 📜✨";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 3: Условия (if/else, ===, switch)
  // ======================================================
  {
    id: 3,
    title: "Эпизод 3: Условия и булева логика",
    shortName: "3. Условия",
    icon: "🔀",
    desc: "Truthy/Falsy, строгое сравнение ===, NaN, тернарный оператор и switch.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "3-1",
        num: 1,
        type: "nocode",
        title: "Ловушка Truthy и Falsy: пустой массив — это true! 🕳️",
        explanation: `
          В JavaScript в логическом контексте (например, внутри <code>if (...)</code>) любое значение неявно приводится к <code>true</code> или <code>false</code>.
          <br><br>
          Запомни ровно <b>8 falsy-значений</b> (все остальные — truthy!):
          <code>false, 0, -0, 0n, "", null, undefined, NaN</code>.
          <br><br>
          ⚠️ <b>Главная ловушка:</b> пустой массив <code>[]</code> и пустой объект <code>{}</code> — это <b>TRUTHY</b>!
          Поэтому <code>if ([])</code> выполнится ВСЕГДА!
        `,
        fact: "Из-за того, что пустой массив `[]` является объектом, он truthy. Чтобы проверить, пуст ли массив, программисты всегда проверяют его длину: `if (arr.length === 0)`.",
        interactiveType: "truthy_sorter",
        taskText: "Какое из этих выражений в условии `if` считается ИСТИННЫМ (truthy)?",
        options: ["0", "'' (пустая строка)", "[] (пустой массив)", "NaN"],
        correctIndex: 2
      },
      // Level 2 (No-Code)
      {
        id: "3-2",
        num: 2,
        type: "nocode",
        title: "Строгое === против коварного == 🥊",
        explanation: `
          Нестрогое равенство <code>==</code> пытается подогнать типы друг под друга перед сравнением, порождая абсурд:
          <ul>
            <li><code>0 == false</code> ➔ <code>true</code> (число приводится к булеву)</li>
            <li><code>"" == 0</code> ➔ <code>true</code> (пустая строка приводится к нулю)</li>
            <li><code>null == undefined</code> ➔ <code>true</code></li>
          </ul>
          Строгое равенство <code>===</code> проверяет <b>и значение, и тип</b> без приведения типов.
        `,
        fact: "Создатель JavaScript Брендан Эйх позже признался, что введение нестрогого `==` с неявным приведением типов было его самой большой ошибкой в дизайне языка, которую исправили добавлением `===`.",
        interactiveType: "equality_matrix",
        taskText: "Что вернёт строгое сравнение <code>'5' === 5</code>?",
        options: ["true", "false", "NaN", "TypeError"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "3-3",
        num: 3,
        type: "nocode",
        title: "Короткое замыкание: && и || как фильтры ⚡",
        explanation: `
          Логические операторы в JS возвращают не просто true/false, а <b>само значение, на котором остановилась проверка</b>:
          <ul>
            <li><code>A && B</code>: ищет первое <i>ложное</i> (falsy) значение. Если всё истинно — вернёт последнее.</li>
            <li><code>A || B</code>: ищет первое <i>истинное</i> (truthy) значение. Если всё ложно — вернёт последнее.</li>
          </ul>
          Пример: <code>const name = user || "Гость";</code>
        `,
        fact: "В современном стандарте появился оператор нулевого слияния `??` (Nullish Coalescing). В отличие от `||`, он считает 'пустыми' только `null` и `undefined`, не ломаясь на числе `0` или пустой строке `''`.",
        interactiveType: "short_circuit_circuit",
        taskText: "Что вернёт выражение: <code>null || 'Значение по умолчанию'</code>?",
        options: ["null", "'Значение по умолчанию'", "true", "false"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "3-4",
        num: 4,
        type: "code",
        title: "Умный светофор в DOM 🚦",
        legend: "Управляем виртуальным перекрёстком. Функция красит светофор в зависимости от переданного цвета.",
        domHtml: `<div id="traffic-light" style="padding:15px; border-radius:50%; width:50px; height:50px; background:grey; text-align:center; color:white;"></div>`,
        instruction: "Напишите функцию <code>setSignal(color)</code>. Найдите <code>#traffic-light</code>. Если `color === 'red'`, покрасьте фон в красный (`'red'`) и выведите текст `'СТОЙ'`. Если `'green'` — зелёный (`'green'`) и текст `'ИДИ'`. Иначе — жёлтый (`'gold'`) и текст `'ЖДИ'`.",
        starterCode: `function setSignal(color) {
  // Реализуй условия if/else if/else и настрой #traffic-light:
  
}`,
        hint: "`const el = document.getElementById('traffic-light'); if (color === 'red') { el.style.backgroundColor = 'red'; el.textContent = 'СТОЙ'; } else ...`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="traffic-light"></div>`;
          const fn = new Function("document", `${code}; return setSignal;`)(document);
          const el = dom.querySelector("#traffic-light");
          fn("red");
          if (el.style.backgroundColor !== "red" || el.textContent !== "СТОЙ") throw new Error("Красный сигнал настроен неверно!");
          fn("green");
          if (el.style.backgroundColor !== "green" || el.textContent !== "ИДИ") throw new Error("Зелёный сигнал настроен неверно!");
          fn("yellow");
          if (el.style.backgroundColor !== "gold" || el.textContent !== "ЖДИ") throw new Error("Жёлтый сигнал настроен неверно!");
          return "Светофор безошибочно регулирует движение в DOM! 🚦🚗";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "3-5",
        num: 5,
        type: "code",
        title: "Индикатор силы пароля 🔐",
        legend: "Форма регистрации должна моментально подсвечивать, подходит ли пароль под требования безопасности.",
        domHtml: `<div id="pwd-badge" class="badge">Проверка...</div>`,
        instruction: "Напишите функцию <code>checkPasswordLength(pwd)</code>. Если длина пароля <code>pwd.length >= 8</code>, добавьте блоку <code>#pwd-badge</code> класс <code>'strong'</code>, стиль <code>color = 'lightgreen'</code> и текст <code>'Надёжный пароль'</code>. Иначе — класс <code>'weak'</code>, стиль <code>color = 'salmon'</code> и текст <code>'Слишком короткий'</code>.",
        starterCode: `function checkPasswordLength(pwd) {
  // Проверь длину пароля и обнови #pwd-badge:
  
}`,
        hint: "Используй `pwd.length >= 8` в ветвлении `if / else`.",
        test: (code, dom) => {
          dom.innerHTML = `<div id="pwd-badge"></div>`;
          const fn = new Function("document", `${code}; return checkPasswordLength;`)(document);
          const el = dom.querySelector("#pwd-badge");
          fn("supersecret123");
          if (!el.classList.contains("strong") || el.textContent !== "Надёжный пароль") throw new Error("Длинный пароль не отмечен как 'Надёжный пароль'!");
          fn("123");
          if (!el.classList.contains("weak") || el.textContent !== "Слишком короткий") throw new Error("Короткий пароль не отмечен как 'Слишком короткий'!");
          return "Индикатор пароля надёжно информирует пользователя! 🛡️";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "3-6",
        num: 6,
        type: "code",
        title: "Бейдж статуса через тернарный оператор 🟢⚪",
        legend: "Отобразите статус присутствия пользователя с помощью тернарного оператора '?:'.",
        domHtml: `<span id="user-status-dot">Неизвестно</span>`,
        instruction: "Напишите функцию <code>renderOnlineStatus(isOnline)</code>. С помощью <b>тернарного оператора</b> задайте элементу <code>#user-status-dot</code> текст: <code>isOnline ? 'В сети 🟢' : 'Не в сети ⚪'</code> и цвет (<code>style.color = isOnline ? 'lime' : 'gray'</code>).",
        starterCode: `function renderOnlineStatus(isOnline) {
  // Используй тернарный оператор:
  
}`,
        hint: "`const el = document.getElementById('user-status-dot'); el.textContent = isOnline ? 'В сети 🟢' : 'Не в сети ⚪'; el.style.color = isOnline ? 'lime' : 'gray';`",
        test: (code, dom) => {
          dom.innerHTML = `<span id="user-status-dot"></span>`;
          const fn = new Function("document", `${code}; return renderOnlineStatus;`)(document);
          const el = dom.querySelector("#user-status-dot");
          fn(true);
          if (el.textContent !== "В сети 🟢" || el.style.color !== "lime") throw new Error("Ошибка при isOnline = true!");
          fn(false);
          if (el.textContent !== "Не в сети ⚪" || el.style.color !== "gray") throw new Error("Ошибка при isOnline = false!");
          return "Тернарный оператор изящно оформил статус в DOM! 🟢✨";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 4: Циклы while и do while
  // ======================================================
  {
    id: 4,
    title: "Эпизод 4: Циклы while и do while",
    shortName: "4. Циклы while",
    icon: "🔁",
    desc: "Пред-условие vs пост-условие, опасность бесконечного цикла, прерывание break.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "4-1",
        num: 1,
        type: "nocode",
        title: "Главная тайна do...while: 1 гарантированный шаг 👣",
        explanation: `
          В обычном <code>while (условие)</code> условие проверяется <b>ДО</b> выполнения тела. Если условие сразу ложно — тело не выполнится <b>ни разу (0 раз)</b>.
          <br><br>
          В цикле <code>do { ... } while (условие)</code> условие проверяется <b>ПОСЛЕ</b> выполнения тела!
          Это гарантирует, что тело цикла выполнится <b>как минимум один раз</b> в любом случае!
        `,
        fact: "Цикл `do...while` идеально подходит для опроса пользователя или броска игральной кости: бросить кубик нужно хотя бы один раз, прежде чем проверять, выпала ли шестёрка.",
        interactiveType: "while_vs_dowhile",
        taskText: "Сколько раз выполнится код внутри `do { count++; } while (false);`?",
        options: ["0 раз", "1 раз", "Бесконечно", "Вызовет SyntaxError"],
        correctIndex: 1
      },
      // Level 2 (No-Code)
      {
        id: "4-2",
        num: 2,
        type: "nocode",
        title: "Кошмар разработчика: Бесконечный цикл ☠️",
        explanation: `
          Если в цикле <code>while</code> условие никогда не становится <code>false</code> (например, забыли написать <code>i++</code>):
          <br>
          Движок JavaScript попадает в бесконечный цикл. Так как JS однопоточный (Event Loop), вкладка браузера намертво зависает, вентиляторы ноутбука начинают гудеть, а страница перестаёт реагировать на клики!
        `,
        fact: "Современные браузеры мониторят выполнение скрипта: если скрипт крутится в цикле более нескольких секунд без пауз, браузер выбрасывает диалоговое окно «Страница не отвечает, остановить процесс?».",
        interactiveType: "infinite_loop_detector",
        taskText: "В каком цикле допущена критическая ошибка, приводящая к вечному зависанию?",
        options: [
          "let i = 0; while (i < 5) { i++; }",
          "let i = 0; while (i < 5) { console.log(i); }",
          "let i = 10; while (i > 0) { i--; }",
          "let i = 0; do { i++; } while (i < 3);"
        ],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "4-3",
        num: 3,
        type: "nocode",
        title: "Экстренный стоп-кран: оператор break 🛑",
        explanation: `
          Оператор <code>break</code> мгновенно прекращает выполнение цикла и выбрасывает управление наружу, даже если условие цикла всё ещё <code>true</code>!
          <br><br>
          Это полезно, когда мы ищем элемент в коллекции: как только нужный объект найден, крутить цикл дальше бессмысленно — дёргаем <code>break</code>.
        `,
        fact: "В JavaScript у циклов бывают метки (labels), например: `outer: for(...) { inner: while(...) { break outer; } }`. Это позволяет прерывать внешний цикл прямо изнутри глубоко вложенного!",
        interactiveType: "break_conveyor",
        taskText: "Что выведет код: <code>let i = 1; while(i <= 10) { if(i === 3) break; i++; } console.log(i);</code>?",
        options: ["10", "3", "2", "4"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "4-4",
        num: 4,
        type: "code",
        title: "Обратный отсчёт космодрома через while 🚀",
        legend: "Генерируем элементы обратного отсчёта запуска ракеты с помощью цикла while.",
        domHtml: `<div id="countdown-list"></div>`,
        instruction: "Напишите функцию <code>renderCountdown(start)</code>. С помощью цикла <code>while (start > 0)</code> добавляйте в <code>#countdown-list</code> элементы вида: <code>'<div class=\"step\">' + start + '...</div>'</code>, уменьшая <code>start--</code>. После цикла добавьте <code>'<div>🚀 Поехали!</div>'</code>.",
        starterCode: `function renderCountdown(start) {
  // Цикл while (start > 0) и добавление шагов в #countdown-list:
  
}`,
        hint: "`const c = document.getElementById('countdown-list'); while (start > 0) { c.innerHTML += '<div class=\"step\">' + start + '...</div>'; start--; } c.innerHTML += '<div>🚀 Поехали!</div>';`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="countdown-list"></div>`;
          const fn = new Function("document", `${code}; return renderCountdown;`)(document);
          fn(3);
          const steps = dom.querySelectorAll("#countdown-list .step");
          if (steps.length !== 3) throw new Error("Должно быть ровно 3 шага отсчёта!");
          if (!dom.querySelector("#countdown-list").innerHTML.includes("Поехали!")) throw new Error("Не найдена финальная фраза 'Поехали!'");
          return "Обратный отсчёт на while отправляет ракету в космос! 🌌🚀";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "4-5",
        num: 5,
        type: "code",
        title: "Генератор звёзд рейтинга через while ⭐",
        legend: "Отрисовываем визуальный рейтинг отеля или товара в интернет-магазине с помощью звёздочек.",
        domHtml: `<div id="stars-row"></div>`,
        instruction: "Напишите функцию <code>renderStars(count)</code>. Очистите <code>#stars-row</code>. С помощью цикла <code>while (count > 0)</code> добавляйте символ <code>'⭐'</code> внутрь <code>#stars-row</code>, уменьшая <code>count--</code>.",
        starterCode: `function renderStars(count) {
  // Очисти контейнер и в цикле while добавь звёзды:
  
}`,
        hint: "`const el = document.getElementById('stars-row'); el.textContent = ''; while (count > 0) { el.textContent += '⭐'; count--; }`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="stars-row"></div>`;
          const fn = new Function("document", `${code}; return renderStars;`)(document);
          fn(5);
          const el = dom.querySelector("#stars-row");
          if (el.textContent !== "⭐⭐⭐⭐⭐") throw new Error("Ожидалось 5 звёзд: ⭐⭐⭐⭐⭐, получено: " + el.textContent);
          return "Рейтинг из звёзд на while сияет в интерфейсе! ⭐⭐⭐⭐⭐";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "4-6",
        num: 6,
        type: "code",
        title: "Гарантированная лотерея через do...while 🎰",
        legend: "Игрок крутит колесо фортуны хотя бы один раз. Цикл do...while генерирует шаги розыгрыша.",
        domHtml: `<ul id="lottery-spins"></ul>`,
        instruction: "Напишите функцию <code>spinLottery(rolls)</code>. С помощью цикла <code>do...while</code> добавляйте в <code>#lottery-spins</code> строки: <code>'<li>Спин #' + step + '</li>'</code>. Цикл должен сделать хотя бы 1 шаг, и продолжаться, пока <code>step < rolls</code>.",
        starterCode: `function spinLottery(rolls) {
  let step = 0;
  // Напиши цикл do { ... } while (step < rolls);
  
}`,
        hint: "`do { step++; document.getElementById('lottery-spins').innerHTML += '<li>Спин #' + step + '</li>'; } while (step < rolls);`",
        test: (code, dom) => {
          dom.innerHTML = `<ul id="lottery-spins"></ul>`;
          const fn = new Function("document", `${code}; return spinLottery;`)(document);
          fn(0); // Даже для 0 должен быть 1 шаг!
          if (dom.querySelectorAll("#lottery-spins li").length !== 1) {
            throw new Error("При rolls = 0 цикл do...while обязан выполнить 1 шаг!");
          }
          dom.innerHTML = `<ul id="lottery-spins"></ul>`;
          fn(3);
          if (dom.querySelectorAll("#lottery-spins li").length !== 3) {
            throw new Error("При rolls = 3 должно быть 3 шага!");
          }
          return "Гарантированный do...while оправдал своё предназначение! 🎰✨";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 5: Циклы for
  // ======================================================
  {
    id: 5,
    title: "Эпизод 5: Циклы for, for...of и итераторы",
    shortName: "5. Циклы for",
    icon: "🔄",
    desc: "Анатомия for, лексическая область видимости let в цикле, перебор значений for...of.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "5-1",
        num: 1,
        type: "nocode",
        title: "Анатомия for: в каком порядке крутятся шестерёнки? ⚙️",
        explanation: `
          Заголовок <code>for (1.инициализация; 2.условие; 4.шаг) { 3.тело }</code> выполняется строго по схеме:
          <ol>
            <li><b>Инициализация</b> (выполняется РОВНО ОДИН РАЗ на старте).</li>
            <li><b>Проверка условия</b> (если false — цикл мгновенно завершается).</li>
            <li><b>Тело цикла</b> (код внутри фигурных скобок).</li>
            <li><b>Шаг (инкремент)</b> (только ПОСЛЕ завершения тела).</li>
            <li>Возврат к пункту 2!</li>
          </ol>
        `,
        fact: "Любую из трёх частей цикла `for` можно оставить пустой! Например, `for (;;)` — это абсолютно легальный бесконечный цикл в JS.",
        interactiveType: "for_stepper",
        taskText: "Что происходит в цикле for сразу ПОСЛЕ завершения выполнения тела цикла на текущей итерации?",
        options: ["Снова инициализация", "Выполняется шаг (инкремент)", "Сразу проверяется условие", "Цикл завершается"],
        correctIndex: 1
      },
      // Level 2 (No-Code)
      {
        id: "5-2",
        num: 2,
        type: "nocode",
        title: "Ловушка замыкания в цикле: var против let 💣",
        explanation: `
          Классический вопрос на собеседованиях:
          <code>for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }</code>
          <br>
          Этот код выведет: <b>3, 3, 3</b>! Почему? Переменная <code>var</code> одна на весь цикл. К моменту срабатывания таймера цикл уже закончился и <code>i</code> стало 3.
          <br><br>
          А с <code>let</code> движок создаёт <b>новую переменную i на КАЖДОЙ итерации цикла</b>, поэтому выведется: <b>0, 1, 2</b>!
        `,
        fact: "Поведение `let` в заголовке `for` специально описано в спецификации ECMAScript: под капотом создаётся отдельная область видимости окружения (Lexical Environment) для каждого шага цикла.",
        interactiveType: "var_let_closure",
        taskText: "Что выведет `for (let i = 0; i < 3; i++)` внутри отложенного таймера?",
        options: ["3, 3, 3", "0, 1, 2", "undefined, undefined, undefined", "0, 0, 0"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "5-3",
        num: 3,
        type: "nocode",
        title: "for...of против for...in: не путай ключи и значения! 🔑📦",
        explanation: `
          В JS есть два похожих цикла:
          <ul>
            <li><code>for (let item of array)</code> ➔ достаёт <b>ЗНАЧЕНИЯ</b> элементов. Подходит для массивов и строк.</li>
            <li><code>for (let key in object)</code> ➔ достаёт <b>КЛЮЧИ / ИНДЕКСЫ</b>. Создан для объектов.</li>
          </ul>
          Если применить <code>for...in</code> к массиву <code>['кот', 'пёс']</code>, переменная получит строковые индексы: <code>"0"</code>, <code>"1"</code>!
        `,
        fact: "Цикл `for...of` работает благодаря протоколу итерируемости (Symbol.iterator). С его помощью можно перебирать не только массивы, но и строки, Set, Map и даже свои кастомные генераторы.",
        interactiveType: "for_of_in_matcher",
        taskText: "Какой цикл лучше всего использовать для прямого перебора значений массива без возни с индексами?",
        options: ["for...in", "for...of", "while(false)", "switch"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "5-4",
        num: 4,
        type: "code",
        title: "Генератор полосатой сетки в DOM 🏁",
        legend: "Создаём шахматную или полосатую разметку через классический цикл for с индексами.",
        domHtml: `<div id="striped-list" style="display:flex; flex-direction:column; gap:4px;"></div>`,
        instruction: "Напишите функцию <code>renderStripedList(count)</code>. Очистите <code>#striped-list</code>. Циклом <code>for (let i = 0; i < count; i++)</code> создавайте строки <code>'<div class=\"row ' + (i % 2 === 0 ? 'even' : 'odd') + '\">Строка ' + i + '</div>'</code> и добавляйте в контейнер.",
        starterCode: `function renderStripedList(count) {
  // Цикл for и добавление строк с чередованием even / odd:
  
}`,
        hint: "`const c = document.getElementById('striped-list'); c.innerHTML = ''; for(let i = 0; i < count; i++) { c.innerHTML += '<div class=\"row ' + (i % 2 === 0 ? 'even' : 'odd') + '\">Строка ' + i + '</div>'; }`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="striped-list"></div>`;
          const fn = new Function("document", `${code}; return renderStripedList;`)(document);
          fn(4);
          const rows = dom.querySelectorAll("#striped-list .row");
          if (rows.length !== 4) throw new Error("Должно быть 4 строки!");
          if (!rows[0].classList.contains("even") || !rows[1].classList.contains("odd")) {
            throw new Error("Классы even и odd не чередуются!");
          }
          return "Полосатый список отрендерен циклом for! 🏁";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "5-5",
        num: 5,
        type: "code",
        title: "Таблица умножения на карточках ✖️",
        legend: "Генерируем интерактивные карточки таблицы умножения для школьников.",
        domHtml: `<div id="mult-cards" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;"></div>`,
        instruction: "Напишите функцию <code>renderTable(num)</code>. Циклом <code>for (let i = 1; i <= 6; i++)</code> добавляйте в <code>#mult-cards</code> блоки: <code>'<div class=\"card\">' + num + ' × ' + i + ' = ' + (num * i) + '</div>'</code>.",
        starterCode: `function renderTable(num) {
  // Напиши цикл for от 1 до 6:
  
}`,
        hint: "`for (let i = 1; i <= 6; i++) { container.innerHTML += ... }`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="mult-cards"></div>`;
          const fn = new Function("document", `${code}; return renderTable;`)(document);
          fn(7);
          const cards = dom.querySelectorAll("#mult-cards .card");
          if (cards.length !== 6) throw new Error("Ожидалось 6 карточек!");
          if (!cards[0].textContent.includes("7 × 1 = 7") || !cards[5].textContent.includes("7 × 6 = 42")) {
            throw new Error("Результаты умножения неверны!");
          }
          return "Таблица умножения создана циклом for! ✖️✨";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "5-6",
        num: 6,
        type: "code",
        title: "Перебор коллекции элементов for...of 🎨",
        legend: "Пройдитесь циклом for...of по найденным кнопкам в DOM и измените их оформление.",
        domHtml: `<div id="btns"><button class="tag">JS</button><button class="tag">HTML</button><button class="tag">CSS</button></div>`,
        instruction: "Напишите функцию <code>highlightTags()</code>. Найдите все элементы с классом <code>.tag</code> через <code>document.querySelectorAll('.tag')</code>. С помощью цикла <code>for (const tag of tags)</code> добавьте каждому тегу стиль <code>tag.style.border = '2px solid cyan'</code> и прибавьте к тексту эмодзи <code>' ⚡'</code>.",
        starterCode: `function highlightTags() {
  // Используй цикл for...of по найденным элементам:
  
}`,
        hint: "`const tags = document.querySelectorAll('.tag'); for (const tag of tags) { tag.style.border = '2px solid cyan'; tag.textContent += ' ⚡'; }`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="btns"><button class="tag">JS</button><button class="tag">HTML</button></div>`;
          const fn = new Function("document", `${code}; return highlightTags;`)(document);
          fn();
          const tags = dom.querySelectorAll(".tag");
          if (tags[0].style.border !== "2px solid cyan" || !tags[0].textContent.includes("⚡")) {
            throw new Error("Стили или текст тегов не обновились через for...of!");
          }
          return "Цикл for...of стилизовал все элементы DOM! 🎨⚡";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 6: Массивы
  // ======================================================
  {
    id: 6,
    title: "Эпизод 6: Массивы и функциональные методы",
    shortName: "6. Массивы",
    icon: "📚",
    desc: "Мутации vs копии, магия map/filter/reduce, очистка через length = 0.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "6-1",
        num: 1,
        type: "nocode",
        title: "Методы-мутанты против чистых методов 🧬",
        explanation: `
          В JavaScript методы массивов делятся на два враждующих лагеря:
          <ul>
            <li><b>Мутирующие (ломают оригинал):</b> <code>push, pop, shift, unshift, splice, reverse, sort</code>.</li>
            <li><b>Немутирующие (возвращают новую копию):</b> <code>slice, concat, map, filter</code>.</li>
          </ul>
          Мутации опасны: случайно отсортировав исходный массив товаров, ты можешь сломать данные в пяти других местах приложения!
        `,
        fact: "В 2023 году в спецификацию добавили безопасные копирующие методы `toSorted()`, `toReversed()`, `toSpliced()`. Они делают то же самое, но возвращают новый массив, не трогая оригинал.",
        interactiveType: "mutator_sorter",
        taskText: "Какой из этих методов НЕ мутирует исходный массив, а возвращает новую копию?",
        options: ["arr.push(x)", "arr.splice(0, 1)", "arr.slice(0, 2)", "arr.reverse()"],
        correctIndex: 2
      },
      // Level 2 (No-Code)
      {
        id: "6-2",
        num: 2,
        type: "nocode",
        title: "Трюк со свойством length: мгновенная очистка ✂️",
        explanation: `
          В JS свойство <code>arr.length</code> — не просто счётчик, а <b>управляющее свойство</b>!
          <br>
          Если уменьшить length вручную: <code>arr.length = 2</code>, все элементы после 2-го индекса будут безвозвратно удалены.
          <br>
          А <code>arr.length = 0</code> — это самый быстрый способ полностью опустошить существующий массив без создания нового объекта в памяти!
        `,
        fact: "Если, наоборот, увеличить `arr.length = 100`, массив не заполнится нулями, а превратится в «разреженный массив» (sparse array) с пустыми слотами (empty slots), которые игнорируются методами forEach и map.",
        interactiveType: "array_length_hack",
        taskText: "Что станет с массивом `let a = [10, 20, 30, 40]`, если выполнить `a.length = 2`?",
        options: ["Ничего, length только для чтения", "Останется [10, 20]", "Станет [30, 40]", "Вызовет ошибку"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "6-3",
        num: 3,
        type: "nocode",
        title: "Святая троица: map, filter и reduce 🧙‍♂️",
        explanation: `
          Функциональные методы заменяют 90% циклов <code>for</code>:
          <ul>
            <li><code>filter(fn)</code>: оставляет только те элементы, для которых колбэк вернул <code>true</code>. Размер массива уменьшается или остаётся прежним.</li>
            <li><code>map(fn)</code>: трансформирует каждый элемент по формуле. Длина массива ВСЕГДА совпадает с исходной!</li>
            <li><code>reduce(fn, init)</code>: сворачивает весь массив в одно итоговое значение (число, объект, строку).</li>
          </ul>
        `,
        fact: "Метод `reduce` настолько фундаментален, что и `map`, и `filter` можно написать через `reduce` в 3 строчки кода.",
        interactiveType: "map_filter_combo",
        taskText: "Какой метод вернёт массив ТОЧНО ТАКОЙ ЖЕ длины, как исходный, но с изменёнными элементами?",
        options: ["filter", "map", "pop", "find"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "6-4",
        num: 4,
        type: "code",
        title: "Рендер меню пиццерии из массива 🍕",
        legend: "Берём массив строк с названиями пицц и генерируем красивые карточки в DOM.",
        domHtml: `<div id="pizza-menu" style="display:flex; gap:8px;"></div>`,
        instruction: "Напишите функцию <code>renderPizzas(pizzaList)</code>. Найдите <code>#pizza-menu</code>. С помощью метода <code>.map()</code> превратите каждую пиццу в <code>'<div class=\"pizza-item\">🍕 ' + item + '</div>'</code>, объедините через <code>.join('')</code> и запишите в <code>innerHTML</code>.",
        starterCode: `function renderPizzas(pizzaList) {
  // Преврати массив пицц в карточки через map и join:
  
}`,
        hint: "`document.getElementById('pizza-menu').innerHTML = pizzaList.map(p => '<div class=\"pizza-item\">🍕 ' + p + '</div>').join('');`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="pizza-menu"></div>`;
          const fn = new Function("document", `${code}; return renderPizzas;`)(document);
          fn(["Пепперони", "Маргарита"]);
          const items = dom.querySelectorAll("#pizza-menu .pizza-item");
          if (items.length !== 2) throw new Error("Ожидалось 2 карточки пиццы!");
          if (!items[0].textContent.includes("Пепперони")) throw new Error("Текст первой пиццы не совпадает!");
          return "Массив пицц красиво материализовался в DOM! 🍕✨";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "6-5",
        num: 5,
        type: "code",
        title: "Фильтр выполненных задач (.filter) ✅",
        legend: "В списке дел нужно отобразить только завершённые задачи.",
        domHtml: `<ul id="done-tasks"></ul>`,
        instruction: "Напишите функцию <code>renderDoneTasks(tasks)</code>. Массив <code>tasks</code> состоит из объектов: <code>{ text: 'Купить хлеб', done: true }</code>. Отфильтруйте через <code>.filter(t => t.done)</code> только выполненные задачи и добавьте их в <code>#done-tasks</code> в виде <code>'<li>✅ ' + t.text + '</li>'</code>.",
        starterCode: `function renderDoneTasks(tasks) {
  // Отфильтруй выполненные и отрисуй li:
  
}`,
        hint: "`const done = tasks.filter(t => t.done); document.getElementById('done-tasks').innerHTML = done.map(t => '<li>✅ ' + t.text + '</li>').join('');`",
        test: (code, dom) => {
          dom.innerHTML = `<ul id="done-tasks"></ul>`;
          const fn = new Function("document", `${code}; return renderDoneTasks;`)(document);
          fn([
            { text: "Помыть кота", done: false },
            { text: "Выучить массивы", done: true },
            { text: "Запустить тесты", done: true }
          ]);
          const lis = dom.querySelectorAll("#done-tasks li");
          if (lis.length !== 2) throw new Error("Должно остаться ровно 2 выполненные задачи!");
          return "Метод .filter() безупречно отобрал нужные пункты в DOM! ✅📋";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "6-6",
        num: 6,
        type: "code",
        title: "Подсчёт и вывод итогового чека (.reduce) 🧾",
        legend: "Посчитайте сумму всех цен в корзине и отобразите в блоке итоговой стоимости.",
        domHtml: `<div id="cart-summary">Итого: <span id="cart-total">0</span> ₽</div>`,
        instruction: "Напишите функцию <code>calcCartTotal(prices)</code>. Используя <code>prices.reduce((sum, p) => sum + p, 0)</code>, посчитайте общую сумму массива чисел и запишите её в элемент <code>#cart-total</code>.",
        starterCode: `function calcCartTotal(prices) {
  // Посчитай сумму через reduce и обнови #cart-total:
  
}`,
        hint: "`const total = prices.reduce((acc, curr) => acc + curr, 0); document.getElementById('cart-total').textContent = total;`",
        test: (code, dom) => {
          dom.innerHTML = `<span id="cart-total">0</span>`;
          const fn = new Function("document", `${code}; return calcCartTotal;`)(document);
          fn([120, 250, 30]);
          const el = dom.querySelector("#cart-total");
          if (el.textContent.trim() !== "400") throw new Error("Сумма должна быть 400, получено: " + el.textContent);
          return "Метод .reduce() свёл весь массив к одной правильной сумме! 🧾💰";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 7: Функции
  // ======================================================
  {
    id: 7,
    title: "Эпизод 7: Функции, колбэки и замыкания",
    shortName: "7. Функции",
    icon: "⚡",
    desc: "Всплытие (Hoisting), стрелочные функции, параметры по умолчанию, колбэки и функции первого класса.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "7-1",
        num: 1,
        type: "nocode",
        title: "Всплытие функций: почему Declaration работает раньше объявления? 🎈",
        explanation: `
          Обычное объявление <code>function sayHi() {}</code> (Function Declaration) «всплывает» (hoisting) на самый верх области видимости на этапе компиляции.
          Поэтому её можно вызывать <b>выше строчки, где она написана</b>!
          <br><br>
          А вот стрелочные функции <code>const sayHi = () => {}</code> или функциональные выражения <code>const f = function() {}</code> НЕ всплывают!
          Попытка вызвать их до объявления вызовет ошибку <code>ReferenceError</code>!
        `,
        fact: "Всплытие функций было создано для того, чтобы взаимно-рекурсивные функции (когда функция A вызывает функцию B, а B вызывает A) могли работать независимо от порядка их написания в файле.",
        interactiveType: "hoisting_sim",
        taskText: "Какой синтаксис функции позволяет безопасно вызывать её ВЫШЕ места её объявления?",
        options: [
          "const test = () => {}",
          "function test() {}",
          "const test = function() {}",
          "let test = () => {}"
        ],
        correctIndex: 1
      },
      // Level 2 (No-Code)
      {
        id: "7-2",
        num: 2,
        type: "nocode",
        title: "Параметры по умолчанию: защита от undefined 🛡️",
        explanation: `
          Если в функцию не передать аргумент: <code>say('Барсик')</code> для <code>function say(name, greeting = 'Привет')</code>, параметр получит значение <code>undefined</code>.
          <br>
          Параметры по умолчанию срабатывают <b>ТОЛЬКО если аргумент строго равен undefined</b>!
          Если передать <code>null</code>: <code>say('Барсик', null)</code>, дефолт НЕ сработает, и в переменной останется <code>null</code>.
        `,
        fact: "Параметром по умолчанию может быть не просто константа, а вызов другой функции: `function createUser(id = generateUUID()) {}`!",
        interactiveType: "default_param_tester",
        taskText: "Что вернёт `function greet(msg = 'Привет') { return msg; }` при вызове `greet(undefined)`?",
        options: ["undefined", "'Привет'", "null", "NaN"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "7-3",
        num: 3,
        type: "nocode",
        title: "Стрелочные функции: у них нет своего this! 🏹",
        explanation: `
          Стрелочные функции <code>() => {}</code> созданы не только ради краткости. Главное их отличие:
          <ul>
            <li>У них <b>НЕТ своего контекста this</b>! Они берут <code>this</code> из окружающей области видимости (лексический this).</li>
            <li>У них нет массива <code>arguments</code>.</li>
            <li>Их <b>НЕЛЬЗЯ</b> вызывать с оператором <code>new</code> (они не могут быть конструкторами).</li>
          </ul>
        `,
        fact: "Потеря `this` внутри методов объектов и таймеров setTimeout была главной головной болью фронтендеров до 2015 года. Приходилось везде писать `var self = this;` или использовать `.bind(this)`.",
        interactiveType: "arrow_this_demo",
        taskText: "Что произойдёт при попытке создать объект через `new (() => {})`?",
        options: ["Создастся пустой объект", "TypeError: ... is not a constructor", "Вернётся undefined", "Сработает нормально"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "7-4",
        num: 4,
        type: "code",
        title: "Генератор цветных бейджей (Фабрика тегов) 🏷️",
        legend: "Напишите переиспользуемую функцию, которая динамически создаёт цветные бейджики в интерфейсе.",
        domHtml: `<div id="badge-container" style="display:flex; gap:6px;"></div>`,
        instruction: "Напишите функцию <code>createBadge(text, bgColor = 'dodgerblue')</code>. Она должна создать через <code>document.createElement('span')</code> элемент, присвоить ему класс <code>'badge'</code>, текст <code>text</code>, фон <code>style.backgroundColor = bgColor</code>, цвет текста <code>'white'</code> и прикрепить в <code>#badge-container</code>.",
        starterCode: `function createBadge(text, bgColor = 'dodgerblue') {
  // Создай span, настрой стили и добавь в #badge-container:
  
}`,
        hint: "`const b = document.createElement('span'); b.className = 'badge'; b.textContent = text; b.style.backgroundColor = bgColor; b.style.color = 'white'; document.getElementById('badge-container').appendChild(b);`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="badge-container"></div>`;
          const fn = new Function("document", `${code}; return createBadge;`)(document);
          fn("JavaScript", "orange");
          fn("TypeScript");
          const badges = dom.querySelectorAll("#badge-container .badge");
          if (badges.length !== 2) throw new Error("Должно быть создано 2 бейджа!");
          if (badges[0].style.backgroundColor !== "orange") throw new Error("Цвет первого бейджа должен быть orange!");
          if (badges[1].style.backgroundColor !== "dodgerblue") throw new Error("У второго бейджа должен сработать дефолтный цвет dodgerblue!");
          return "Функция-фабрика штампует бейджи в DOM как по маслу! 🏷️✨";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "7-5",
        num: 5,
        type: "code",
        title: "Колбэк завершения анимации 🎬",
        legend: "Функция выполняет изменение элемента и вызывает переданную функцию обратного вызова (callback).",
        domHtml: `<div id="anim-box" style="width:50px; background:purple;">Блок</div><div id="anim-msg">Ожидание...</div>`,
        instruction: "Напишите функцию <code>expandBox(width, onComplete)</code>. Она должна изменить ширину <code>#anim-box</code> на <code>width + 'px'</code>, а затем вызвать колбэк <code>onComplete('Готово!')</code>, который обновит статус в <code>#anim-msg</code>.",
        starterCode: `function expandBox(width, onComplete) {
  // Измени ширину #anim-box и вызови onComplete('Готово!'):
  
}`,
        hint: "`document.getElementById('anim-box').style.width = width + 'px'; if (typeof onComplete === 'function') onComplete('Готово!');`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="anim-box"></div><div id="anim-msg"></div>`;
          const fn = new Function("document", `${code}; return expandBox;`)(document);
          let cbCalled = false;
          fn(200, (res) => {
            cbCalled = true;
            dom.querySelector("#anim-msg").textContent = res;
          });
          const box = dom.querySelector("#anim-box");
          if (box.style.width !== "200px") throw new Error("Ширина блока не изменилась на 200px!");
          if (!cbCalled || dom.querySelector("#anim-msg").textContent !== "Готово!") throw new Error("Колбэк onComplete не вызвался!");
          return "Функция с колбэком отработала по всем канонам асинхронного JS! 🎬👍";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "7-6",
        num: 6,
        type: "code",
        title: "Фабрика Toast-уведомлений 🍞",
        legend: "Создаём всплывающие уведомления (тосты), которые появляются в правом углу страницы.",
        domHtml: `<div id="toast-wrapper" style="display:flex; flex-direction:column; gap:6px;"></div>`,
        instruction: "Напишите функцию <code>showToast(message, isSuccess = true)</code>. Создайте <code>div</code> с классом <code>'toast'</code>, текстом <code>message</code>. Если <code>isSuccess === true</code> — покрасьте фон в <code>'#15803d'</code> (зелёный), иначе — в <code>'#b91c1c'</code> (красный). Добавьте элемент в <code>#toast-wrapper</code>.",
        starterCode: `function showToast(message, isSuccess = true) {
  // Создай тост и добавь в #toast-wrapper:
  
}`,
        hint: "`const t = document.createElement('div'); t.className = 'toast'; t.textContent = message; t.style.backgroundColor = isSuccess ? '#15803d' : '#b91c1c'; document.getElementById('toast-wrapper').appendChild(t);`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="toast-wrapper"></div>`;
          const fn = new Function("document", `${code}; return showToast;`)(document);
          fn("Успешно сохранено!", true);
          fn("Ошибка соединения", false);
          const toasts = dom.querySelectorAll("#toast-wrapper .toast");
          if (toasts.length !== 2) throw new Error("Должно быть создано 2 уведомления!");
          if (toasts[1].style.backgroundColor !== "rgb(185, 28, 28)" && toasts[1].style.backgroundColor !== "#b91c1c") {
            throw new Error("Цвет ошибочного тоста должен быть красным!");
          }
          return "Тост-нотификации изящно появляются в DOM! 🍞🔔";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 8: Объекты
  // ======================================================
  {
    id: 8,
    title: "Эпизод 8: Объекты и структуры данных",
    shortName: "8. Объекты",
    icon: "🗺️",
    desc: "Передача по ссылке vs копирование, квадратные скобки obj[key], Optional Chaining (?.) и деструктуризация.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "8-1",
        num: 1,
        type: "nocode",
        title: "Ловушка ссылок: копируя объект, ты копируешь ключ от квартиры! 🔑",
        explanation: `
          Примитивы (числа, строки) копируются <b>по значению</b>:
          <code>let a = 5; let b = a; b = 10;</code> ➔ в <code>a</code> останется 5.
          <br><br>
          А объекты хранятся в куче памяти (heap). Переменная содержит лишь <b>ссылку</b> (адрес) на объект:
          <code>const user1 = { name: "Барсик" };</code><br>
          <code>const user2 = user1; // скопировали ссылку!</code><br>
          <code>user2.name = "Мурзик";</code> ➔ 💥 <code>user1.name</code> ТОЖЕ стал "Мурзик"!
        `,
        fact: "Чтобы сделать настоящую полную независимую копию вложенного объекта, в современном JS появился глобальный встроенный метод `structuredClone(obj)`. До него приходилось писать костыль `JSON.parse(JSON.stringify(obj))`.",
        interactiveType: "reference_pointer_sim",
        taskText: "Что будет в `objA.count` после кода: `let objA = { count: 1 }; let objB = objA; objB.count = 99;`?",
        options: ["1", "99", "undefined", "TypeError"],
        correctIndex: 1
      },
      // Level 2 (No-Code)
      {
        id: "8-2",
        num: 2,
        type: "nocode",
        title: "Квадратные скобки: obj[prop] против obj.prop 🗄️",
        explanation: `
          Точечная нотация <code>obj.name</code> ищет свойство с <b>буквальным именем 'name'</b>.
          <br>
          Но если имя свойства лежит в переменной <code>let key = "age"</code> или содержит пробелы/дефисы <code>"user-role"</code>:
          точка не сработает!
          <br><br>
          Нужно использовать квадратные скобки: <code>obj[key]</code> или <code>obj["user-role"]</code>.
        `,
        fact: "Свойства объектов в JS всегда приводятся к строкам (или Symbol). Если написать `obj[{}] = 123`, ключ превратится в строку `\"[object Object]\"`!",
        interactiveType: "bracket_notation_sim",
        taskText: "Как обратиться к свойству объекта `data`, имя которого хранится в переменной `let field = 'email'`?",
        options: ["data.field", "data[field]", "data->email", "data(field)"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "8-3",
        num: 3,
        type: "nocode",
        title: "Спасительный знак вопроса: Optional Chaining (?.) 🦺",
        explanation: `
          Если обратиться к свойству несуществующего объекта: <code>user.address.city</code>, когда <code>address === undefined</code>:
          JS выбросит фатальную ошибку: 💥 <code>Cannot read properties of undefined (reading 'city')</code>!
          <br><br>
          Оператор <code>?.</code> (Optional Chaining) мягко останавливает проверку:
          <code>user?.address?.city</code> вернёт просто <code>undefined</code> без краша приложения!
        `,
        fact: "До появления `?.` в 2020 году фронтендеры писали кошмарные конструкции вида: `user && user.address && user.address.city && user.address.city.name`.",
        interactiveType: "optional_chaining_shield",
        taskText: "Что вернёт `const obj = {}; return obj?.profile?.name;`?",
        options: ["Фатальная ошибка TypeError", "undefined", "null", "false"],
        correctIndex: 1
      },
      // Level 4 (Code with DOM)
      {
        id: "8-4",
        num: 4,
        type: "code",
        title: "Рендер профиля пользователя из объекта 👤",
        legend: "Данные пользователя пришли с сервера в объекте. Отрендерите карточку профиля в DOM.",
        domHtml: `<div id="profile-widget" style="padding:10px; border:1px solid #475569; border-radius:8px;"></div>`,
        instruction: "Напишите функцию <code>renderUserProfile(user)</code>. Объект <code>user</code> содержит: <code>{ name: 'Иван', role: 'Сеньор', avatar: '🧙' }</code>. Отрендерите внутрь <code>#profile-widget</code> HTML: <code>'<div class=\"avatar\">' + user.avatar + '</div><h3>' + user.name + '</h3><p>' + user.role + '</p>'</code>.",
        starterCode: `function renderUserProfile(user) {
  // Отрендери поля объекта в #profile-widget:
  
}`,
        hint: "`document.getElementById('profile-widget').innerHTML = '<div class=\"avatar\">' + user.avatar + '</div><h3>' + user.name + '</h3><p>' + user.role + '</p>';`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="profile-widget"></div>`;
          const fn = new Function("document", `${code}; return renderUserProfile;`)(document);
          fn({ name: "Алиса", role: "Архитектор", avatar: "👩‍💻" });
          const w = dom.querySelector("#profile-widget");
          if (!w.innerHTML.includes("Алиса") || !w.innerHTML.includes("Архитектор") || !w.innerHTML.includes("👩‍💻")) {
            throw new Error("Не все поля объекта отображены в карточке!");
          }
          return "Карточка профиля успешно собрана из свойств объекта! 👤✨";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "8-5",
        num: 5,
        type: "code",
        title: "Сборщик настроек из полей DOM в объект ⚙️",
        legend: "Считайте значения нескольких чекбоксов и инпутов и упакуйте их в аккуратный объект конфигурации.",
        domHtml: `<input id="cfg-theme" value="dark"><input id="cfg-volume" value="80">`,
        instruction: "Напишите функцию <code>collectSettings()</code>. Считайте тему из <code>#cfg-theme</code> и громкость (числом!) из <code>#cfg-volume</code>. Верните объект: <code>{ theme: ..., volume: ... }</code>.",
        starterCode: `function collectSettings() {
  // Собери и верни объект с настройками:
  
}`,
        hint: "`return { theme: document.getElementById('cfg-theme').value, volume: +document.getElementById('cfg-volume').value };`",
        test: (code, dom) => {
          dom.innerHTML = `<input id="cfg-theme" value="cyberpunk"><input id="cfg-volume" value="95">`;
          const fn = new Function("document", `${code}; return collectSettings;`)(document);
          const res = fn();
          if (!res || res.theme !== "cyberpunk" || res.volume !== 95) {
            throw new Error("Ожидался объект { theme: 'cyberpunk', volume: 95 }, получено: " + JSON.stringify(res));
          }
          return "Данные из DOM идеально упакованы в JavaScript-объект! ⚙️📦";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "8-6",
        num: 6,
        type: "code",
        title: "Интерактивная корзина на объекте-словаре 🛒",
        legend: "Храним товары в объекте как ключ-значение: { 'яблоки': 3, 'бананы': 2 }. Отрендерите список в DOM.",
        domHtml: `<ul id="cart-dictionary-list"></ul>`,
        instruction: "Напишите функцию <code>renderInventory(inventoryObj)</code>. С помощью <code>Object.entries(inventoryObj)</code> переберите пары <code>[item, count]</code> и наполните <code>#cart-dictionary-list</code> тегами: <code>'<li>' + item + ': ' + count + ' шт.</li>'</code>.",
        starterCode: `function renderInventory(inventoryObj) {
  // Используй Object.entries(...) для обхода ключей и значений:
  
}`,
        hint: "`document.getElementById('cart-dictionary-list').innerHTML = Object.entries(inventoryObj).map(([k, v]) => '<li>' + k + ': ' + v + ' шт.</li>').join('');`",
        test: (code, dom) => {
          dom.innerHTML = `<ul id="cart-dictionary-list"></ul>`;
          const fn = new Function("document", `${code}; return renderInventory;`)(document);
          fn({ "Манго": 4, "Авокадо": 2 });
          const lis = dom.querySelectorAll("#cart-dictionary-list li");
          if (lis.length !== 2) throw new Error("Должно быть 2 строки товаров!");
          if (!lis[0].textContent.includes("Манго: 4 шт.")) throw new Error("Неверная строка товара!");
          return "Объект-словарь отображён через Object.entries()! 🛒✨";
        }
      }
    ]
  },

  // ======================================================
  // ЭПИЗОД 9: Классы
  // ======================================================
  {
    id: 9,
    title: "Эпизод 9: Классы и объектно-ориентированное программирование",
    shortName: "9. Классы и ООП",
    icon: "🧬",
    desc: "Синтаксис class, прототипы под капотом, extends и super(), приватные поля (#), get/set.",
    levels: [
      // Level 1 (No-Code)
      {
        id: "9-1",
        num: 1,
        type: "nocode",
        title: "Класс — это просто функция в красивой обёртке! 🍬",
        explanation: `
          В JavaScript классы — это «синтаксический сахар». Под капотом нет настоящих классов как в Java или C#:
          <ul>
            <li><code>class Cat {}</code> ➔ <code>typeof Cat === 'function'</code>!</li>
            <li>Методы класса <code>meow() {}</code> записываются прямо в прототип: <code>Cat.prototype.meow</code>.</li>
            <li>Единственное жесткое отличие: класс нельзя вызвать без оператора <code>new</code> (вылетит TypeError).</li>
          </ul>
        `,
        fact: "До появления ES6 в 2015 году программисты создавали псевдоклассы вручную через функции-конструкторы: `function User(name) { this.name = name; } User.prototype.say = function() {...}`.",
        interactiveType: "class_sugar_inspector",
        taskText: "Что вернёт оператор `typeof` для любого объявленного класса `class Hero {}`?",
        options: ["'class'", "'object'", "'function'", "'undefined'"],
        correctIndex: 2
      },
      // Level 2 (No-Code)
      {
        id: "9-2",
        num: 2,
        type: "nocode",
        title: "Без super() нет this: железное правило наследования 🔗",
        explanation: `
          Когда класс наследует другой класс: <code>class Mage extends Hero</code>:
          Внутри дочернего конструктора <b>this не существует</b> до тех пор, пока ты не вызовешь <code>super()</code>!
          <br><br>
          Попытка обратиться к <code>this.mana = 100</code> ДО вызова <code>super(...)</code> приведёт к фатальной ошибке:
          💥 <code>ReferenceError: Must call super constructor in derived class before accessing 'this'</code>!
        `,
        fact: "Слово `super` выполняет конструктор класса-предка, который выделяет память под объект и инициализирует `this`.",
        interactiveType: "super_chain_builder",
        taskText: "Какое ключевое слово обязано быть вызвано ПЕРВЫМ в конструкторе дочернего класса перед `this`?",
        options: ["this.parent()", "super()", "extends()", "constructor()"],
        correctIndex: 1
      },
      // Level 3 (No-Code)
      {
        id: "9-3",
        num: 3,
        type: "nocode",
        title: "Настоящая броня: Приватные поля с решёткой # 🛡️",
        explanation: `
          Раньше приватные поля обозначали простым нижним подчёркиванием <code>_balance</code> (это была просто договорённость, любой мог поменять свойство снаружи).
          <br><br>
          Теперь в JS есть <b>настоящие приватные поля</b>, начинающиеся с решётки: <code>#balance = 0</code>.
          Движок V8 запрещает доступ к ним снаружи на уровне синтаксиса:
          <code>account.#balance</code> снаружи класса вызовет <code>SyntaxError</code>!
        `,
        fact: "Решётка '#' была выбрана комитетом TC39 потому, что ключевые слова `private` или `secret` сломали бы обратную совместимость с библиотеками, где свойства уже назывались `user.private`.",
        interactiveType: "private_field_vault",
        taskText: "Как объявить настоящее приватное поле класса в современном стандарте JavaScript?",
        options: ["private balance = 0;", "_balance = 0;", "#balance = 0;", "$balance = 0;"],
        correctIndex: 2
      },
      // Level 4 (Code with DOM)
      {
        id: "9-4",
        num: 4,
        type: "code",
        title: "Компонент кнопки на классах 🔘",
        legend: "Создаём переиспользуемый UI-компонент кнопки с помощью класса.",
        domHtml: `<div id="component-mount"></div>`,
        instruction: "Создайте класс <code>UiButton</code>. Конструктор принимает <code>(text, color)</code>. Класс должен иметь метод <code>render(containerId)</code>, который создаёт кнопку <code><button></code>, красит её фон в переданный <code>color</code>, задаёт текст <code>text</code> и добавляет внутрь контейнера по id.",
        starterCode: `class UiButton {
  constructor(text, color) {
    this.text = text;
    this.color = color;
  }

  render(containerId) {
    // Создай кнопку и прикрепи в указанный контейнер:
    
  }
}`,
        hint: "`const btn = document.createElement('button'); btn.textContent = this.text; btn.style.backgroundColor = this.color; document.getElementById(containerId).appendChild(btn);`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="component-mount"></div>`;
          const fn = new Function("document", `${code}; return UiButton;`)(document);
          const btnComp = new fn("Купить билет", "crimson");
          btnComp.render("component-mount");
          const btn = dom.querySelector("#component-mount button");
          if (!btn) throw new Error("Кнопка не была создана в #component-mount!");
          if (btn.textContent !== "Купить билет" || btn.style.backgroundColor !== "crimson") {
            throw new Error("Текст или цвет кнопки не совпадают с переданными в класс!");
          }
          return "ООП-компонент кнопки смонтирован в DOM! 🔘🚀";
        }
      },
      // Level 5 (Code with DOM)
      {
        id: "9-5",
        num: 5,
        type: "code",
        title: "Класс счётчика с обновлением DOM ⏱️",
        legend: "Класс счётчика хранит состояние внутри себя и обновляет привязанный DOM-элемент.",
        domHtml: `<div id="counter-widget"><span id="cnt-num">0</span></div>`,
        instruction: "Создайте класс <code>Counter</code>. Конструктор принимает <code>elementId</code> и сохраняет элемент в <code>this.el</code>, а значение в <code>this.count = 0</code>. Добавьте метод <code>increment()</code>, который увеличивает <code>this.count++</code> и записывает новое число в <code>this.el.textContent</code>.",
        starterCode: `class Counter {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.count = 0;
  }

  increment() {
    // Увеличь счетчик и обнови текст this.el:
    
  }
}`,
        hint: "`this.count++; this.el.textContent = this.count;`",
        test: (code, dom) => {
          dom.innerHTML = `<span id="cnt-num">0</span>`;
          const fn = new Function("document", `${code}; return Counter;`)(document);
          const c = new fn("cnt-num");
          c.increment();
          c.increment();
          const el = dom.querySelector("#cnt-num");
          if (el.textContent !== "2" || c.count !== 2) throw new Error("Счётчик должен был стать 2 после двух вызовов .increment()!");
          return "Класс-счётчик инкапсулировал состояние и обновил DOM! ⏱️✨";
        }
      },
      // Level 6 (Code with DOM)
      {
        id: "9-6",
        num: 6,
        type: "code",
        title: "Герой мини-игры (Наследование & DOM) 🧙‍♂️🛡️",
        legend: "Финальный босс тренажёра! Создайте иерархию классов Hero -> Warrior с обновлением полоски здоровья в DOM.",
        domHtml: `<div id="hero-hp-bar" style="width:100%; height:12px; background:red;"></div><div id="hero-status">100 HP</div>`,
        instruction: "Создайте базовый класс <code>Hero(name, hp)</code> с методом <code>takeDamage(dmg)</code> (уменьшает <code>this.hp -= dmg</code>). Затем создайте <code>Warrior extends Hero</code> с конструктором <code>(name, hp, shield)</code>, вызывающим <code>super(name, hp)</code>. Метод <code>Warrior.prototype.updateDom()</code> должен обновлять <code>#hero-status</code> (<code>this.hp + ' HP'</code>).",
        starterCode: `class Hero {
  constructor(name, hp) {
    this.name = name;
    this.hp = hp;
  }
  takeDamage(dmg) {
    this.hp = Math.max(0, this.hp - dmg);
  }
}

class Warrior extends Hero {
  constructor(name, hp, shield) {
    // Вызови super(name, hp) и сохрани shield:
    
  }

  updateDom() {
    // Запиши this.hp + ' HP' в #hero-status:
    
  }
}`,
        hint: "В конструкторе Warrior: `super(name, hp); this.shield = shield;`. В методе: `document.getElementById('hero-status').textContent = this.hp + ' HP';`",
        test: (code, dom) => {
          dom.innerHTML = `<div id="hero-status">100 HP</div>`;
          const fn = new Function("document", `${code}; return { Hero, Warrior };`)(document);
          const w = new fn.Warrior("Конан", 100, 30);
          w.takeDamage(40); // унаследованный метод
          w.updateDom();   // собственный метод
          const el = dom.querySelector("#hero-status");
          if (el.textContent.trim() !== "60 HP") throw new Error("После 40 урона в DOM должно быть '60 HP', а получено: " + el.textContent);
          if (w.shield !== 30) throw new Error("Свойство shield не сохранено в this!");
          return "🎉 ПОБЕДА! Все 9 эпизодов и 54 уровня тренажёра успешно завершены! Ты абсолютный грандмастер JavaScript и DOM! 👑🏆✨";
        }
      }
    ]
  }
];
