const questions = {
  science: [
    {
      q: "Which planet has the largest volcano in our solar system?",
      a: ["Earth", "Mars", "Venus", "Jupiter"],
      c: 1
    },
    {
      q: "What is the chemical symbol for gold?",
      a: ["Ag", "Go", "Au", "Gd"],
      c: 2
    },
    {
      q: "What force keeps planets in orbit around the Sun?",
      a: ["Magnetism", "Gravity", "Friction", "Electricity"],
      c: 1
    },
    {
      q: "Which organ pumps blood around the human body?",
      a: ["Liver", "Brain", "Heart", "Lung"],
      c: 2
    }
  ],

  technology: [
    {
      q: "What does CPU stand for?",
      a: [
        "Central Processing Unit",
        "Computer Power Utility",
        "Central Program User",
        "Core Processing Utility"
      ],
      c: 0
    },
    {
      q: "Which language is primarily used to structure web pages?",
      a: ["Python", "HTML", "SQL", "C++"],
      c: 1
    },
    {
      q: "What does AI stand for?",
      a: [
        "Automated Internet",
        "Advanced Interface",
        "Artificial Intelligence",
        "Algorithmic Information"
      ],
      c: 2
    },
    {
      q: "Which device is commonly used to store data permanently?",
      a: ["RAM", "SSD", "CPU", "GPU"],
      c: 1
    }
  ],

  history: [
    {
      q: "Which ancient civilization built the pyramids at Giza?",
      a: ["Romans", "Greeks", "Egyptians", "Persians"],
      c: 2
    },
    {
      q: "Who was the first person to walk on the Moon?",
      a: [
        "Buzz Aldrin",
        "Neil Armstrong",
        "Yuri Gagarin",
        "Michael Collins"
      ],
      c: 1
    },
    {
      q: "The Great Wall is located in which country?",
      a: ["Japan", "India", "China", "Mongolia"],
      c: 2
    },
    {
      q: "Which famous ship sank in 1912?",
      a: ["Titanic", "Mayflower", "Victory", "Endeavour"],
      c: 0
    }
  ],

  geography: [
    {
      q: "What is the largest ocean on Earth?",
      a: ["Atlantic", "Indian", "Arctic", "Pacific"],
      c: 3
    },
    {
      q: "Which country is famous for the Eiffel Tower?",
      a: ["Italy", "France", "Spain", "Germany"],
      c: 1
    },
    {
      q: "What is the capital city of Kenya?",
      a: ["Mombasa", "Nairobi", "Kisumu", "Nakuru"],
      c: 1
    },
    {
      q: "Which is the largest continent?",
      a: ["Africa", "Europe", "Asia", "North America"],
      c: 2
    }
  ],

  sports: [
    {
      q: "How many players are on the field for one soccer team?",
      a: ["9", "10", "11", "12"],
      c: 2
    },
    {
      q: "Which sport uses a shuttlecock?",
      a: ["Tennis", "Badminton", "Cricket", "Hockey"],
      c: 1
    },
    {
      q: "How many rings are on the Olympic symbol?",
      a: ["4", "5", "6", "7"],
      c: 1
    },
    {
      q: "In basketball, how many points is a free throw worth?",
      a: ["1", "2", "3", "4"],
      c: 0
    }
  ]
};

const bossQuestion = {
  q: "Which country has the largest land area in the world?",
  a: ["Canada", "China", "Russia", "United States"],
  c: 2
};

const mixedQuestions = Object.values(questions).flat();

let gameQuestions = [];
let currentQuestion = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let correct = 0;
let lives = 3;
let timeLeft = 15;
let timer = null;
let bossTimer = null;
let selectedCategory = "mixed";
let doublePoints = false;
let frozen = false;
let player = "Champion";

const $ = id => document.getElementById(id);

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });

  $(id).classList.add("active");
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category")
      .forEach(b => b.classList.remove("selected"));

    button.classList.add("selected");
    selectedCategory = button.dataset.category;
  });
});

$("startBtn").addEventListener("click", startGame);

function startGame() {
  player = $("playerName").value.trim() || "Champion";

  let pool =
    selectedCategory === "mixed"
      ? mixedQuestions
      : questions[selectedCategory];

  gameQuestions = shuffle(pool).slice(0, 8);

  currentQuestion = 0;
  score = 0;
  streak = 0;
  bestStreak = 0;
  correct = 0;
  lives = 3;
  doublePoints = false;
  frozen = false;

  updateStats();
  showScreen("gameScreen");
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);

  if (currentQuestion >= gameQuestions.length) {
    startBoss();
    return;
  }

  const data = gameQuestions[currentQuestion];

  $("questionNumber").textContent =
    String(currentQuestion + 1).padStart(2, "0");

  $("roundText").textContent =
    `QUESTION ${currentQuestion + 1} / ${gameQuestions.length}`;

  $("categoryText").textContent =
    selectedCategory.toUpperCase();

  $("question").textContent = data.q;

  $("progress").style.width =
    `${(currentQuestion / gameQuestions.length) * 100}%`;

  const answers = $("answers");
  answers.innerHTML = "";

  data.a.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () =>
      answerQuestion(index, button)
    );

    answers.appendChild(button);
  });

  startTimer();
}

function startTimer() {
  timeLeft = 15;
  updateTimer();

  timer = setInterval(() => {
    if (frozen) return;

    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timeOut();
    }
  }, 1000);
}

function updateTimer() {
  $("timer").textContent = timeLeft;

  $("timer").parentElement.classList.toggle(
    "danger",
    timeLeft <= 5
  );
}

function answerQuestion(index, clickedButton) {
  clearInterval(timer);

  const data = gameQuestions[currentQuestion];
  const buttons = document.querySelectorAll("#answers .answer");

  buttons.forEach(b => b.disabled = true);

  if (index === data.c) {
    clickedButton.classList.add("correct");

    correct++;
    streak++;

    bestStreak = Math.max(bestStreak, streak);

    let points = 100 + timeLeft * 10;

    if (streak >= 3) points *= 2;
    if (streak >= 5) points *= 3;

    if (doublePoints) {
      points *= 2;
      doublePoints = false;
      $("doubleBtn").disabled = true;
    }

    score += points;

    showToast(`🔥 +${points} POINTS!`);

  } else {
    clickedButton.classList.add("wrong");
    buttons[data.c].classList.add("correct");

    lives--;
    streak = 0;

    showToast("❌ Wrong answer!");

    if (lives <= 0) {
      setTimeout(endGame, 900);
      return;
    }
  }

  updateStats();

  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 900);
}

function timeOut() {
  const data = gameQuestions[currentQuestion];
  const buttons = document.querySelectorAll("#answers .answer");

  buttons.forEach(b => b.disabled = true);

  if (buttons[data.c]) {
    buttons[data.c].classList.add("correct");
  }

  lives--;
  streak = 0;

  showToast("⏰ TIME'S UP!");

  updateStats();

  if (lives <= 0) {
    setTimeout(endGame, 900);
    return;
  }

  setTimeout(() => {
    currentQuestion++;
    loadQuestion();
  }, 900);
}

function updateStats() {
  $("score").textContent = score;
  $("streak").textContent = `${streak} 🔥`;
  $("lives").textContent = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
}

$("fiftyBtn").addEventListener("click", () => {
  const data = gameQuestions[currentQuestion];
  const buttons = [...document.querySelectorAll("#answers .answer")];

  const wrong = buttons
    .map((_, i) => i)
    .filter(i => i !== data.c);

  shuffle(wrong).slice(0, 2).forEach(i => {
    buttons[i].classList.add("removed");
  });

  $("fiftyBtn").disabled = true;
  showToast("🃏 Two wrong answers removed!");
});

$("freezeBtn").addEventListener("click", () => {
  frozen = true;
  $("freezeBtn").disabled = true;

  showToast("❄️ TIME FROZEN!");

  setTimeout(() => {
    frozen = false;
    showToast("▶️ TIME RESUMED!");
  }, 4000);
});

$("doubleBtn").addEventListener("click", () => {
  doublePoints = true;
  $("doubleBtn").disabled = true;

  showToast("💎 NEXT CORRECT ANSWER = 2×!");
});

function startBoss() {
  clearInterval(timer);

  showScreen("bossScreen");

  $("bossQuestion").textContent = bossQuestion.q;

  const container = $("bossAnswers");
  container.innerHTML = "";

  bossQuestion.a.forEach((answer, index) => {
    const button = document.createElement("button");

    button.className = "answer";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () =>
      answerBoss(index, button)
    );

    container.appendChild(button);
  });

  let seconds = 20;
  $("bossTimer").textContent = seconds;

  bossTimer = setInterval(() => {
    seconds--;
    $("bossTimer").textContent = seconds;

    if (seconds <= 0) {
      clearInterval(bossTimer);
      showToast("👹 The Boss wins!");

      setTimeout(endGame, 900);
    }
  }, 1000);
}

function answerBoss(index, clickedButton) {
  clearInterval(bossTimer);

  const buttons = document.querySelectorAll("#bossAnswers .answer");
  buttons.forEach(b => b.disabled = true);

  if (index === bossQuestion.c) {
    clickedButton.classList.add("correct");

    const bonus = 1000;
    score += bonus;

    showToast(`👑 BOSS DEFEATED! +${bonus}`);
  } else {
    clickedButton.classList.add("wrong");
    buttons[bossQuestion.c].classList.add("correct");

    showToast("👹 The Boss survives!");
  }

  setTimeout(endGame, 1300);
}

function endGame() {
  clearInterval(timer);
  clearInterval(bossTimer);

  const accuracy =
    gameQuestions.length === 0
      ? 0
      : Math.round((correct / gameQuestions.length) * 100);

  let title;
  let emoji;
  let message;

  if (score >= 1800) {
    title = "ULTIMATE BRAIN";
    emoji = "👑";
    message = `Incredible, ${player}! Your brain is operating at legendary level.`;
  } else if (score >= 1000) {
    title = "GENIUS";
    emoji = "🧠";
    message = `Outstanding performance, ${player}!`;
  } else if (score >= 600) {
    title = "QUIZ MASTER";
    emoji = "🏆";
    message = `Excellent battle, ${player}!`;
  } else {
    title = "BRAIN ROOKIE";
    emoji = "🚀";
    message = `Good start, ${player}! Train your brain and try again.`;
  }

  $("resultEmoji").textContent = emoji;
  $("resultTitle").textContent = title;
  $("finalScore").textContent = score;
  $("accuracy").textContent = `${accuracy}%`;
  $("bestStreak").textContent = bestStreak;
  $("correctAnswers").textContent = correct;
  $("resultMessage").textContent = message;

  const oldBest =
    Number(localStorage.getItem("brainstormBest") || 0);

  if (score > oldBest) {
    localStorage.setItem("brainstormBest", score);
    $("bestScore").textContent = score;
    showToast("🏆 NEW HIGH SCORE!");
  }

  showScreen("resultScreen");
}

$("restartBtn").addEventListener("click", startGame);

$("homeBtn").addEventListener("click", () => {
  const best =
    Number(localStorage.getItem("brainstormBest") || 0);

  $("bestScore").textContent = best;

  showScreen("startScreen");
});

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

$("bestScore").textContent =
  Number(localStorage.getItem("brainstormBest") || 0);
