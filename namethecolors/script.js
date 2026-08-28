/**
 * Color Name Challenge
 * Free educational color identification game — 20 progressive levels
 * Improves color recognition and knowledge of common / CSS named colors
 */

(function () {
  "use strict";

  // ===== Data =====
  const COLORS = [
    // Levels 1–5: Primary & basic
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#008000" },
    { name: "Yellow", hex: "#FFFF00" },
    { name: "Orange", hex: "#FFA500" },
    // Levels 6–10: Common secondary
    { name: "Purple", hex: "#800080" },
    { name: "Pink", hex: "#FFC0CB" },
    { name: "Brown", hex: "#A52A2A" },
    { name: "Cyan", hex: "#00FFFF" },
    { name: "Magenta", hex: "#FF00FF" },
    // Levels 11–15: Intermediate
    { name: "Lime", hex: "#00FF00" },
    { name: "Teal", hex: "#008080" },
    { name: "Navy", hex: "#000080" },
    { name: "Maroon", hex: "#800000" },
    { name: "Olive", hex: "#808000" },
    // Levels 16–20: Advanced / less common
    { name: "Coral", hex: "#FF7F50" },
    { name: "Turquoise", hex: "#40E0D0" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Crimson", hex: "#DC143C" },
    { name: "Indigo", hex: "#4B0082" }
  ];

  const DISTRACTOR_POOL = [
    "Alice Blue", "Antique White", "Aqua", "Aquamarine", "Azure",
    "Beige", "Bisque", "Black", "Blanched Almond", "Blue Violet",
    "Burlywood", "Cadet Blue", "Chartreuse", "Chocolate", "Cornflower Blue",
    "Cornsilk", "Dark Blue", "Dark Cyan", "Dark Goldenrod", "Dark Gray",
    "Dark Green", "Dark Khaki", "Dark Magenta", "Dark Olive Green", "Dark Orange",
    "Dark Orchid", "Dark Red", "Dark Salmon", "Dark Sea Green", "Dark Slate Blue",
    "Dark Turquoise", "Dark Violet", "Deep Pink", "Deep Sky Blue", "Dim Gray",
    "Dodger Blue", "Firebrick", "Floral White", "Forest Green", "Fuchsia",
    "Gainsboro", "Ghost White", "Goldenrod", "Gray", "Green Yellow",
    "Honeydew", "Hot Pink", "Indian Red", "Ivory", "Khaki",
    "Lavender", "Lavender Blush", "Lawn Green", "Lemon Chiffon", "Light Blue",
    "Light Coral", "Light Cyan", "Light Goldenrod Yellow", "Light Gray", "Light Green",
    "Light Pink", "Light Salmon", "Light Sea Green", "Light Sky Blue", "Light Slate Gray",
    "Light Steel Blue", "Light Yellow", "Lime Green", "Linen", "Medium Aquamarine",
    "Medium Blue", "Medium Orchid", "Medium Purple", "Medium Sea Green", "Medium Slate Blue",
    "Medium Spring Green", "Medium Turquoise", "Medium Violet Red", "Midnight Blue", "Mint Cream",
    "Misty Rose", "Moccasin", "Navajo White", "Old Lace", "Olive Drab",
    "Orange Red", "Orchid", "Pale Goldenrod", "Pale Green", "Pale Turquoise",
    "Pale Violet Red", "Papaya Whip", "Peach Puff", "Peru", "Plum",
    "Powder Blue", "Rebecca Purple", "Rosy Brown", "Royal Blue", "Saddle Brown",
    "Salmon", "Sandy Brown", "Sea Green", "Seashell", "Sienna",
    "Silver", "Sky Blue", "Slate Blue", "Slate Gray", "Snow",
    "Spring Green", "Steel Blue", "Tan", "Thistle", "Tomato",
    "Violet", "Wheat", "White", "White Smoke", "Yellow Green"
  ];

  // ===== State =====
  let currentLevel = 0;
  let score = 0;
  let lives = 3;
  let highScore = 0;
  let isAnswering = false;
  let currentOptions = [];

  // ===== DOM =====
  const startScreen = document.getElementById("start-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const homeBtn = document.getElementById("home-btn");
  const levelNum = document.getElementById("level-num");
  const scoreEl = document.getElementById("score");
  const livesEl = document.getElementById("lives");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector(".progress-bar");
  const colorSwatch = document.getElementById("color-swatch");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const highScoreDisplay = document.getElementById("high-score-display");
  const finalScoreEl = document.getElementById("final-score");
  const levelsClearedEl = document.getElementById("levels-cleared");
  const endHighScoreEl = document.getElementById("end-high-score");
  const endTitle = document.getElementById("end-title");
  const endMessage = document.getElementById("end-message");

  // ===== Init =====
  function loadHighScore() {
    try {
      highScore = parseInt(localStorage.getItem("colorNameHighScore") || "0", 10) || 0;
    } catch (e) {
      highScore = 0;
    }
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
  }

  function saveHighScore() {
    if (score > highScore) {
      highScore = score;
      try {
        localStorage.setItem("colorNameHighScore", String(highScore));
      } catch (e) { /* private mode */ }
    }
  }

  loadHighScore();

  // Event listeners
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  homeBtn.addEventListener("click", goHome);

  // Keyboard support for options (keys 1-4)
  document.addEventListener("keydown", function (e) {
    if (!gameScreen.classList.contains("active") || isAnswering) return;
    const key = e.key;
    if (key >= "1" && key <= "4") {
      const index = parseInt(key, 10) - 1;
      const buttons = optionsEl.querySelectorAll(".option-btn");
      if (buttons[index] && !buttons[index].disabled) {
        buttons[index].click();
      }
    }
  });

  // ===== Core functions =====
  function showScreen(name) {
    startScreen.classList.remove("active");
    gameScreen.classList.remove("active");
    endScreen.classList.remove("active");

    if (name === "start") {
      startScreen.classList.add("active");
      document.title = "Color Name Challenge — Free Online Color Identification Game (20 Levels)";
    } else if (name === "game") {
      gameScreen.classList.add("active");
      document.title = `Level ${currentLevel + 1}/20 — Color Name Challenge`;
    } else if (name === "end") {
      endScreen.classList.add("active");
      document.title = "Game Over — Color Name Challenge";
    }
  }

  function startGame() {
    currentLevel = 0;
    score = 0;
    lives = 3;
    isAnswering = false;
    updateHUD();
    showScreen("game");
    loadLevel();
  }

  function goHome() {
    showScreen("start");
    loadHighScore();
  }

  function updateHUD() {
    levelNum.textContent = currentLevel + 1;
    scoreEl.textContent = score;
    livesEl.textContent = lives;

    const pct = (currentLevel / 20) * 100;
    progressFill.style.width = Math.max(5, pct) + "%";
    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", currentLevel);
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  function getDistractors(correctName, count) {
    count = count || 3;
    const lowerCorrect = correctName.toLowerCase();
    let pool = DISTRACTOR_POOL.filter(function (n) {
      return n.toLowerCase() !== lowerCorrect;
    });

    // Higher levels: prefer related names (shared words)
    if (currentLevel >= 10) {
      const words = lowerCorrect.split(/\s+/).filter(function (w) {
        return w.length > 2;
      });
      const related = pool.filter(function (n) {
        const nw = n.toLowerCase();
        return words.some(function (w) {
          return nw.indexOf(w) !== -1;
        });
      });
      if (related.length >= count) {
        pool = related;
      }
    }

    return shuffle(pool).slice(0, count);
  }

  function loadLevel() {
    if (currentLevel >= 20) {
      endGame(true);
      return;
    }

    isAnswering = false;
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    const color = COLORS[currentLevel];
    colorSwatch.style.backgroundColor = color.hex;
    colorSwatch.setAttribute("aria-label", "Color swatch to identify — current level " + (currentLevel + 1));

    // Trigger pulse animation
    colorSwatch.classList.remove("pulse");
    void colorSwatch.offsetWidth;
    colorSwatch.classList.add("pulse");

    const distractors = getDistractors(color.name, 3);
    currentOptions = shuffle([color.name].concat(distractors));

    optionsEl.innerHTML = "";
    currentOptions.forEach(function (name, index) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = name;
      btn.setAttribute("aria-label", "Option " + (index + 1) + ": " + name);
      btn.dataset.index = index;
      btn.addEventListener("click", function () {
        handleAnswer(name, color.name, btn);
      });
      optionsEl.appendChild(btn);
    });

    updateHUD();
  }

  function handleAnswer(selected, correct, btn) {
    if (isAnswering) return;
    isAnswering = true;

    const allBtns = optionsEl.querySelectorAll(".option-btn");
    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].disabled = true;
    }

    if (selected === correct) {
      btn.classList.add("correct");
      feedbackEl.textContent = "Correct! ✓";
      feedbackEl.className = "feedback success";

      // Points: base 10 + small progressive bonus
      const points = 10 + Math.floor(currentLevel / 2);
      score += points;

      setTimeout(function () {
        currentLevel += 1;
        if (currentLevel >= 20) {
          endGame(true);
        } else {
          loadLevel();
        }
      }, 850);
    } else {
      btn.classList.add("wrong");
      for (let i = 0; i < allBtns.length; i++) {
        if (allBtns[i].textContent === correct) {
          allBtns[i].classList.add("correct");
        }
      }
      feedbackEl.textContent = "Wrong! It was " + correct;
      feedbackEl.className = "feedback error";
      lives -= 1;
      updateHUD();

      setTimeout(function () {
        if (lives <= 0) {
          endGame(false);
        } else {
          loadLevel(); // Retry same level
        }
      }, 1300);
    }
  }

  function endGame(won) {
    saveHighScore();
    showScreen("end");

    finalScoreEl.textContent = score;
    levelsClearedEl.textContent = currentLevel;
    endHighScoreEl.textContent = highScore;

    if (won) {
      endTitle.textContent = "🎉 You Completed All 20 Levels!";
      endMessage.textContent = "Outstanding! You have excellent color recognition skills.";
    } else {
      endTitle.textContent = "Game Over";
      endMessage.textContent = lives <= 0
        ? "You ran out of lives. Practice more to improve your score!"
        : "Keep practicing to master color names!";
    }
  }
})();
