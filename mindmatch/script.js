/* =========================================================
   MIND MATCH
   Find the Odd One
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const screens = {
  start: $("#startScreen"),
  game: $("#gameScreen"),
  result: $("#resultScreen")
};

const board = $("#gameBoard");

const playBtn = $("#playBtn");
const againBtn = $("#againBtn");
const homeBtn = $("#homeBtn");
const quitBtn = $("#quitBtn");

const scoreDisplay = $("#scoreDisplay");
const comboDisplay = $("#comboDisplay");
const roundDisplay = $("#roundDisplay");
const timerBar = $("#timerBar");
const timerDisplay = $("#timerDisplay");
const livesDisplay = $("#livesDisplay");
const difficultyDots = $("#difficultyDots");

const bestScore = $("#bestScore");
const streakDisplay = $("#streakDisplay");
const levelDisplay = $("#levelDisplay");
const startLevel = $("#startLevel");

const finalScore = $("#finalScore");
const finalRounds = $("#finalRounds");
const finalCombo = $("#finalCombo");
const finalXp = $("#finalXp");
const resultLevel = $("#resultLevel");
const resultXpCurrent = $("#xpCurrent");
const resultXpRequired = $("#xpRequired");
const xpBar = $("#xpBar");
const newRecord = $("#newRecord");

const soundBtn = $("#soundBtn");
const levelButton = $("#levelButton");
const levelModal = $("#levelModal");
const closeLevel = $("#closeLevel");
const modalLevel = $("#modalLevel");
const modalXp = $("#modalXp");
const modalXpBar = $("#modalXpBar");

const toast = $("#toast");
const toastIcon = $("#toastIcon");
const toastTitle = $("#toastTitle");
const toastText = $("#toastText");

const dailyLabel = $("#dailyLabel");

/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY = "mindmatch_save_v1";

const defaultSave = {
  best: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastPlayed: null,
  sound: true,
  games: 0
};

let save = loadSave();

function loadSave() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!stored) {
      return { ...defaultSave };
    }

    return {
      ...defaultSave,
      ...stored
    };
  } catch {
    return { ...defaultSave };
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

/* =========================================================
   GAME STATE
   ========================================================= */

let game = null;

let timer = null;
let timerStart = 0;
let timerDuration = 0;

let audioContext = null;

/* =========================================================
   GAME CONFIG
   ========================================================= */

const SHAPES = [
  "●",
  "◆",
  "▲",
  "■",
  "★",
  "✦",
  "✚",
  "⬟"
];

const COLORS = [
  "#a78bfa",
  "#60a5fa",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#f472b6",
  "#c084fc"
];

const THEMES = [
  {
    name: "shape",
    title: "Find the odd one",
    text: "One shape is slightly different."
  },
  {
    name: "color",
    title: "Spot the different color",
    text: "One tile has a different shade."
  },
  {
    name: "rotation",
    title: "Find the rotated one",
    text: "One symbol is facing a different way."
  },
  {
    name: "size",
    title: "Find the different size",
    text: "One symbol breaks the pattern."
  }
];

/* =========================================================
   HELPERS
   ========================================================= */

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function showScreen(screen) {
  Object.values(screens).forEach((element) => {
    element.classList.remove("active");
  });

  screen.classList.add("active");
}

function todayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function formatNumber(number) {
  return Math.floor(number).toLocaleString();
}

/* =========================================================
   LEVEL SYSTEM
   ========================================================= */

function xpRequired(level = save.level) {
  return Math.round(100 + (level - 1) * 65);
}

function updateLevel() {
  let required = xpRequired();

  while (save.xp >= required) {
    save.xp -= required;
    save.level++;

    showToast(
      "🌟",
      "LEVEL UP!",
      `You've reached level ${save.level}.`
    );

    required = xpRequired();
  }

  persist();
  updateUI();
}

function addXP(amount) {
  save.xp += amount;
  updateLevel();
}

function xpPercentage() {
  return (save.xp / xpRequired()) * 100;
}

/* =========================================================
   STREAK
   ========================================================= */

function updateStreak() {
  const today = todayKey();

  if (save.lastPlayed === today) {
    return;
  }

  if (!save.lastPlayed) {
    save.streak = 1;
  } else {
    const previous = new Date(save.lastPlayed + "T00:00:00");
    const current = new Date(today + "T00:00:00");

    const difference =
      Math.round((current - previous) / 86400000);

    if (difference === 1) {
      save.streak++;
    } else if (difference > 1) {
      save.streak = 1;
    }
  }

  save.lastPlayed = today;
  persist();
}

/* =========================================================
   UI
   ========================================================= */

function updateUI() {
  bestScore.textContent = formatNumber(save.best);
  streakDisplay.textContent = save.streak;
  levelDisplay.textContent = save.level;
  startLevel.textContent = save.level;

  modalLevel.textContent = save.level;
  modalXp.textContent = `${save.xp} / ${xpRequired()}`;

  modalXpBar.style.width =
    `${clamp(xpPercentage(), 0, 100)}%`;

  dailyLabel.textContent =
    localStorage.getItem("mindmatch_daily_" + todayKey())
      ? "DONE"
      : "READY";

  soundBtn.textContent = save.sound ? "🔊" : "🔇";
}

/* =========================================================
   AUDIO
   ========================================================= */

function ensureAudio() {
  if (!save.sound) return;

  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function beep(frequency, duration, type = "sine", volume = 0.04) {
  if (!save.sound) return;

  ensureAudio();

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(volume, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function correctSound() {
  beep(620, .08, "sine", .045);

  setTimeout(() => {
    beep(850, .13, "sine", .035);
  }, 55);
}

function wrongSound() {
  beep(160, .15, "sawtooth", .025);
}

function levelSound() {
  beep(500, .08);
  setTimeout(() => beep(700, .08), 80);
  setTimeout(() => beep(1000, .15), 160);
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(icon, title, text) {
  toastIcon.textContent = icon;
  toastTitle.textContent = title;
  toastText.textContent = text;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

/* =========================================================
   PARTICLES
   ========================================================= */

function burstParticles(count = 18) {
  const container = $("#particles");

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");

    particle.className = "particle";

    const colors = [
      "#a78bfa",
      "#ec4899",
      "#38bdf8",
      "#fbbf24",
      "#34d399"
    ];

    particle.style.background = pick(colors);

    particle.style.left = "50%";
    particle.style.top = "48%";

    particle.style.setProperty(
      "--x",
      `${random(-250, 250)}`
    );

    particle.style.setProperty(
      "--y",
      `${random(-250, 250)}`
    );

    container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 750);
  }
}

/* =========================================================
   DIFFICULTY
   ========================================================= */

function getDifficulty() {
  const round = game.round;

  if (round < 4) return 1;
  if (round < 8) return 2;
  if (round < 13) return 3;
  if (round < 19) return 4;

  return 5;
}

function getGridSize() {
  const difficulty = getDifficulty();

  if (difficulty === 1) return 3;
  if (difficulty === 2) return 4;
  if (difficulty === 3) return 5;
  if (difficulty === 4) return 6;

  return 7;
}

function getTimeLimit() {
  const difficulty = getDifficulty();

  const base = {
    1: 8.5,
    2: 7.5,
    3: 6.6,
    4: 5.8,
    5: 5.2
  };

  return Math.max(
    3.8,
    base[difficulty] - Math.min(game.round * .035, 1.1)
  );
}

function updateDifficultyUI() {
  const difficulty = getDifficulty();

  [...difficultyDots.children].forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index < difficulty
    );
  });
}

/* =========================================================
   ROUND CREATION
   ========================================================= */

function createRound() {
  clearInterval(timer);

  board.innerHTML = "";

  const grid = getGridSize();
  const total = grid * grid;

  board.style.gridTemplateColumns =
    `repeat(${grid}, 1fr)`;

  const theme = pick(THEMES);

  let oddIndex = random(0, total - 1);

  game.oddIndex = oddIndex;
  game.theme = theme.name;

  $("#instructionTitle").textContent = theme.title;
  $("#instructionText").textContent = theme.text;

  const baseShape = pick(SHAPES);

  let baseColor = pick(COLORS);
  let oddColor = pick(COLORS);

  while (oddColor === baseColor) {
    oddColor = pick(COLORS);
  }

  const rotation = random(25, 45);
  const oddRotation = rotation + random(55, 110);

  const baseSize = random(58, 72);
  const oddSize = baseSize + random(12, 22);

  for (let i = 0; i < total; i++) {
    const tile = document.createElement("button");

    tile.className = "tile";
    tile.dataset.index = i;

    const symbol = document.createElement("span");
    symbol.className = "tile-symbol";
    symbol.textContent = baseShape;

    if (theme.name === "shape") {
      symbol.textContent =
        i === oddIndex
          ? getDifferentShape(baseShape)
          : baseShape;
    }

    if (theme.name === "color") {
      symbol.style.color =
        i === oddIndex
          ? oddColor
          : baseColor;
    } else {
      symbol.style.color = baseColor;
    }

    if (theme.name === "rotation") {
      symbol.style.transform =
        `rotate(${i === oddIndex ? oddRotation : rotation}deg)`;
    }

    if (theme.name === "size") {
      symbol.style.fontSize =
        `${i === oddIndex ? oddSize : baseSize}%`;
    }

    const bgColor = hexToRgba(baseColor,0.12);

    tile.style.background = bgColor;

    tile.appendChild(symbol);

    tile.addEventListener(
      "click",
      () => handleTileClick(i, tile)
    );

    board.appendChild(tile);
  }

  roundDisplay.textContent = game.round;

  scoreDisplay.textContent =
    formatNumber(game.score);

  comboDisplay.textContent =
    game.combo;

  updateDifficultyUI();

  startTimer();
}

function getDifferentShape(base) {
  let different = pick(SHAPES);

  while (different === base) {
    different = pick(SHAPES);
  }

  return different;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");

  const bigint = parseInt(clean, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {
  timerDuration = getTimeLimit();
  timerStart = performance.now();

  timerBar.style.width = "100%";
  timerDisplay.textContent =
    timerDuration.toFixed(1);

  timer = setInterval(() => {
    const elapsed =
      (performance.now() - timerStart) / 1000;

    const remaining =
      Math.max(0, timerDuration - elapsed);

    const percentage =
      (remaining / timerDuration) * 100;

    timerBar.style.width =
      `${percentage}%`;

    timerDisplay.textContent =
      remaining.toFixed(1);

    if (remaining <= 2) {
      timerBar.style.background =
        "linear-gradient(90deg, #fb7185, #f97316)";
    } else {
      timerBar.style.background =
        "linear-gradient(90deg, #a78bfa, #ec4899)";
    }

    if (remaining <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 40);
}

function stopTimer() {
  clearInterval(timer);
}

/* =========================================================
   TILE CLICK
   ========================================================= */

function handleTileClick(index, tile) {
  if (!game.active) return;

  if (index === game.oddIndex) {
    handleCorrect(tile);
  } else {
    handleWrong(tile);
  }
}

function handleCorrect(tile) {
  if (!game.active) return;

  stopTimer();

  tile.classList.add("correct");

  const elapsed =
    (performance.now() - timerStart) / 1000;

  const remaining =
    Math.max(0, timerDuration - elapsed);

  const speedBonus =
    Math.round(remaining * 45);

  const difficultyBonus =
    getDifficulty() * 35;

  const comboMultiplier =
    1 + Math.min(game.combo, 12) * .12;

  const points = Math.round(
    (100 + speedBonus + difficultyBonus) *
    comboMultiplier
  );

  game.score += points;
  game.combo++;
  game.bestCombo = Math.max(
    game.bestCombo,
    game.combo
  );

  correctSound();
  burstParticles(game.combo > 4 ? 25 : 15);

  if (game.combo === 3) {
    showToast(
      "🔥",
      "COMBO STARTED",
      "Keep your eyes locked in."
    );
  }

  if (game.combo === 5) {
    showToast(
      "⚡",
      "ON FIRE!",
      "Your focus is seriously sharp."
    );
  }

  if (game.combo === 10) {
    showToast(
      "🧠",
      "BRAIN MODE",
      "You're seeing patterns fast."
    );
  }

  scoreDisplay.textContent =
    formatNumber(game.score);

  comboDisplay.textContent =
    game.combo;

  game.round++;

  setTimeout(() => {
    if (game.active) {
      createRound();
    }
  }, 260);
}

function handleWrong(tile) {
  if (!game.active) return;

  tile.classList.remove("wrong");

  // Force animation restart
  void tile.offsetWidth;

  tile.classList.add("wrong");

  wrongSound();

  game.lives--;
  game.combo = 0;

  updateLives();

  comboDisplay.textContent = "0";

  if (game.lives <= 0) {
    setTimeout(() => endGame("lives"), 280);
  } else {
    showToast(
      "👀",
      "Not that one",
      `${game.lives} ${game.lives === 1 ? "life" : "lives"} left.`
    );
  }
}

function handleTimeout() {
  if (!game.active) return;

  game.lives--;
  game.combo = 0;

  wrongSound();
  updateLives();

  comboDisplay.textContent = "0";

  if (game.lives <= 0) {
    endGame("timeout");
  } else {
    showToast(
      "⏱️",
      "Too slow!",
      "The clock got you. Stay sharp."
    );

    setTimeout(() => {
      if (game.active) createRound();
    }, 500);
  }
}

/* =========================================================
   LIVES
   ========================================================= */

function updateLives() {
  const hearts = [...livesDisplay.children];

  hearts.forEach((heart, index) => {
    heart.classList.toggle(
      "empty",
      index >= game.lives
    );
  });
}

/* =========================================================
   START GAME
   ========================================================= */

function startGame() {
  ensureAudio();

  updateStreak();

  game = {
    active: true,
    score: 0,
    round: 1,
    combo: 0,
    bestCombo: 0,
    lives: 3,
    oddIndex: null,
    theme: null
  };

  showScreen(screens.game);

  scoreDisplay.textContent = "0";
  comboDisplay.textContent = "0";

  updateLives();

  createRound();
}

/* =========================================================
   END GAME
   ========================================================= */

function endGame(reason = "lives") {
  if (!game || !game.active) return;

  game.active = false;

  stopTimer();

  const oldBest = save.best;

  const score = game.score;

  const isNewBest = score > oldBest;

  if (isNewBest) {
    save.best = score;
    newRecord.classList.add("show");
  } else {
    newRecord.classList.remove("show");
  }

  save.games++;

  const earnedXp = Math.max(
    15,
    Math.round(
      game.round * 4 +
      game.bestCombo * 3 +
      score / 700
    )
  );

  addXP(earnedXp);

  persist();

  finalScore.textContent =
    formatNumber(score);

  finalRounds.textContent =
    Math.max(0, game.round - 1);

  finalCombo.textContent =
    game.bestCombo;

  finalXp.textContent =
    `+${earnedXp}`;

  resultLevel.textContent =
    save.level;

  resultXpCurrent.textContent =
    save.xp;

  resultXpRequired.textContent =
    xpRequired();

  xpBar.style.width =
    `${clamp(xpPercentage(), 0, 100)}%`;

  if (isNewBest) {
    $("#resultBadge").textContent =
      "NEW PERSONAL BEST";

    $("#resultIcon").textContent =
      "🏆";

    $("#resultTitle").textContent =
      "You did it.";

    $("#resultMessage").textContent =
      "That was your sharpest run yet.";

    burstParticles(35);
  } else if (reason === "timeout") {
    $("#resultBadge").textContent =
      "TIME'S UP";

    $("#resultIcon").textContent =
      "⏱️";

    $("#resultTitle").textContent =
      "So close.";

    $("#resultMessage").textContent =
      "Your next run could beat this one.";
  } else {
    $("#resultBadge").textContent =
      "RUN COMPLETE";

    $("#resultIcon").textContent =
      game.score > 3000 ? "🔥" : "🧠";

    $("#resultTitle").textContent =
      game.score > 3000 ? "Brilliant." : "Good run.";

    $("#resultMessage").textContent =
      "Your brain is getting warmed up.";
  }

  showScreen(screens.result);

  updateUI();
}

/* =========================================================
   DAILY CHALLENGE
   ========================================================= */

function isDailyComplete() {
  return Boolean(
    localStorage.getItem(
      "mindmatch_daily_" + todayKey()
    )
  );
}

/*
 * The daily challenge uses a deterministic seed based
 * on today's date. This makes the daily puzzle concept
 * easy to expand later into a global leaderboard.
 */
function startDailyChallenge() {
  if (isDailyComplete()) {
    showToast(
      "🌸",
      "Already complete",
      "Come back tomorrow for a new challenge."
    );

    return;
  }

  startGame();

  game.daily = true;

  showToast(
    "🌟",
    "DAILY CHALLENGE",
    "Today's run counts toward your streak."
  );
}

/* =========================================================
   HOME
   ========================================================= */

function goHome() {
  stopTimer();

  if (game) {
    game.active = false;
  }

  showScreen(screens.start);

  updateUI();
}

/* =========================================================
   LEVEL MODAL
   ========================================================= */

function openLevelModal() {
  modalLevel.textContent = save.level;
  modalXp.textContent =
    `${save.xp} / ${xpRequired()}`;

  modalXpBar.style.width =
    `${clamp(xpPercentage(), 0, 100)}%`;

  levelModal.classList.add("show");
}

function closeLevelModal() {
  levelModal.classList.remove("show");
}

/* =========================================================
   SOUND TOGGLE
   ========================================================= */

function toggleSound() {
  save.sound = !save.sound;

  persist();
  updateUI();

  if (save.sound) {
    ensureAudio();
    beep(700, .08);
  }
}

/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (levelModal.classList.contains("show")) {
      closeLevelModal();
      return;
    }

    if (
      screens.game.classList.contains("active") &&
      game?.active
    ) {
      goHome();
    }
  }

  if (
    event.code === "Space" &&
    screens.start.classList.contains("active")
  ) {
    event.preventDefault();
    startGame();
  }
});

/* =========================================================
   EVENTS
   ========================================================= */

playBtn.addEventListener("click", startGame);

againBtn.addEventListener("click", startGame);

homeBtn.addEventListener("click", goHome);

quitBtn.addEventListener("click", () => {
  if (game?.active) {
    const shouldQuit =
      confirm("Leave this run? Your current score will be lost.");

    if (!shouldQuit) return;
  }

  goHome();
});

soundBtn.addEventListener("click", toggleSound);

levelButton.addEventListener(
  "click",
  openLevelModal
);

closeLevel.addEventListener(
  "click",
  closeLevelModal
);

$(".modal-backdrop").addEventListener(
  "click",
  closeLevelModal
);

/* =========================================================
   INITIALIZATION
   ========================================================= */

updateUI();

/* Prevent accidental zooming during rapid mobile play */
document.addEventListener(
  "gesturestart",
  (event) => event.preventDefault()
);

/* =========================================================
   OPTIONAL DAILY BUTTON BEHAVIOR
   Clicking the daily pill starts today's challenge.
   ========================================================= */

$(".daily-pill").style.cursor = "pointer";

$(".daily-pill").addEventListener(
  "click",
  startDailyChallenge
);
