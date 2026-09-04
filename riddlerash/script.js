/* ==========================================
   RIDDLE RUSH - GAME SCRIPT
========================================== */


// Game settings
const RIDDLES_PER_GAME = 6;


// Game data
let allRiddles = [];
let selectedRiddles = [];

let currentRiddleIndex = 0;
let score = 0;

let answered = false;


/* ==========================================
   GET HTML ELEMENTS
========================================== */

const riddleText = document.getElementById("riddle-text");
const riddleNumber = document.getElementById("riddle-number");
const scoreDisplay = document.getElementById("score");

const progressBar = document.getElementById("progress-bar");

const answerInput = document.getElementById("answer-input");

const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const message = document.getElementById("message");

const celebration = document.getElementById("celebration");

const riddleCard = document.querySelector(".riddle-card");


/* ==========================================
   LOAD RIDDLES FROM JSON FILE
========================================== */

fetch("riddles.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Could not load riddles.json");
        }

        return response.json();
    })

    .then(data => {

        allRiddles = data;

        startGame();

    })

    .catch(error => {

        console.error(error);

        riddleText.textContent =
            "⚠️ Unable to load riddles. Please check that riddles.json is in the same folder.";

    });


/* ==========================================
   START A NEW GAME
========================================== */

function startGame() {

    // Reset game values
    currentRiddleIndex = 0;
    score = 0;

    answered = false;


    // Shuffle all riddles
    const shuffled = [...allRiddles].sort(
        () => Math.random() - 0.5
    );


    // Select 6 unique riddles
    selectedRiddles = shuffled.slice(
        0,
        Math.min(RIDDLES_PER_GAME, shuffled.length)
    );


    // Reset interface
    scoreDisplay.textContent = score;

    restartBtn.classList.add("hidden");

    nextBtn.classList.add("hidden");

    message.textContent = "";

    message.className = "";

    answerInput.style.display = "block";

    submitBtn.style.display = "block";


    // Load first riddle
    loadRiddle();

}


/* ==========================================
   LOAD CURRENT RIDDLE
========================================== */

function loadRiddle() {

    answered = false;


    const currentRiddle =
        selectedRiddles[currentRiddleIndex];


    // Show riddle
    riddleText.textContent =
        currentRiddle.riddle;


    // Update riddle number
    riddleNumber.textContent =
        `${currentRiddleIndex + 1} / ${selectedRiddles.length}`;


    // Update progress
    const progress =
        (currentRiddleIndex /
            selectedRiddles.length) * 100;

    progressBar.style.width =
        `${progress}%`;


    // Clear answer
    answerInput.value = "";

    answerInput.disabled = false;

    answerInput.focus();


    // Clear message
    message.textContent = "";

    message.className = "";


    // Show submit button
    submitBtn.disabled = false;

    submitBtn.style.display = "block";


    // Hide next button
    nextBtn.classList.add("hidden");


    // Remove old animations
    riddleCard.classList.remove(
        "success-pop",
        "shake"
    );

}


/* ==========================================
   NORMALIZE ANSWERS
========================================== */

function normalizeAnswer(answer) {

    return answer

        // Convert to lowercase
        .toLowerCase()

        // Remove spaces at beginning/end
        .trim()

        // Remove punctuation
        .replace(/[.,!?;:]/g, "")

        // Remove extra spaces
        .replace(/\s+/g, " ")

        // Remove "a", "an", or "the" from beginning
        .replace(/^(a|an|the)\s+/i, "")

        .trim();

}


/* ==========================================
   CHECK ANSWER
========================================== */

function checkAnswer() {

    // Prevent multiple submissions
    if (answered) return;


    const playerAnswer =
        normalizeAnswer(answerInput.value);


    // Prevent empty answers
    if (playerAnswer === "") {

        message.textContent =
            "⌨️ Type an answer first!";

        message.className =
            "wrong-message";

        answerInput.focus();

        return;

    }


    const currentRiddle =
        selectedRiddles[currentRiddleIndex];


    // Normalize every accepted answer
    const acceptedAnswers =
        currentRiddle.answers.map(answer =>
            normalizeAnswer(answer)
        );


    // Check if answer is correct
    const isCorrect =
        acceptedAnswers.includes(playerAnswer);


    answered = true;


    // Disable input
    answerInput.disabled = true;

    submitBtn.disabled = true;


    /* ======================================
       CORRECT ANSWER
    ====================================== */

    if (isCorrect) {

        score++;

        scoreDisplay.textContent =
            score;


        const happyMessages = [

            "🎉 Brilliant! You cracked it!",

            "🌟 Excellent thinking!",

            "😄 Correct! Your brain is on fire!",

            "🏆 Amazing! You solved it!",

            "✨ Genius move!",

            "🧠 Fantastic answer!",

            "💰 Correct! You're getting richer in riddles!"

        ];


        message.textContent =
            happyMessages[
                Math.floor(
                    Math.random() *
                    happyMessages.length
                )
            ];


        message.className =
            "correct-message";


        // Celebration effects
        createCelebration();


        // Pop animation
        riddleCard.classList.add(
            "success-pop"
        );


        // Show next button
        showNextButton();

    }


    /* ======================================
       WRONG ANSWER
    ====================================== */

    else {

        message.textContent =
            "❌ Not quite! Try again.";

        message.className =
            "wrong-message";


        // Shake animation
        riddleCard.classList.add(
            "shake"
        );


        /*
           Allow another attempt
        */

        answered = false;

        answerInput.disabled = false;

        submitBtn.disabled = false;

        answerInput.focus();

    }

}


/* ==========================================
   SHOW NEXT BUTTON
========================================== */

function showNextButton() {

    // If there are more riddles
    if (
        currentRiddleIndex <
        selectedRiddles.length - 1
    ) {

        nextBtn.textContent =
            "Next Riddle →";

        nextBtn.classList.remove(
            "hidden"
        );

    }


    // Last riddle
    else {

        nextBtn.textContent =
            "See Results 🏆";

        nextBtn.classList.remove(
            "hidden"
        );

    }

}


/* ==========================================
   NEXT RIDDLE
========================================== */

function nextRiddle() {

    currentRiddleIndex++;


    // More riddles available
    if (
        currentRiddleIndex <
        selectedRiddles.length
    ) {

        loadRiddle();

    }


    // Game finished
    else {

        finishGame();

    }

}


/* ==========================================
   FINISH GAME
========================================== */

function finishGame() {

    // Full progress
    progressBar.style.width = "100%";


    // Hide game controls
    answerInput.style.display = "none";

    submitBtn.style.display = "none";

    nextBtn.classList.add(
        "hidden"
    );


    // Final score
    riddleNumber.textContent =
        "Game Complete!";


    let finalMessage = "";


    if (score === selectedRiddles.length) {

        finalMessage =
            `🏆 PERFECT SCORE! ${score}/${selectedRiddles.length}! You are a Riddle Master! 🎉`;

        createBigCelebration();

    }

    else if (
        score >=
        Math.ceil(selectedRiddles.length * 0.7)
    ) {

        finalMessage =
            `🌟 Great job! You scored ${score}/${selectedRiddles.length}!`;

        createBigCelebration();

    }

    else if (score >= 3) {

        finalMessage =
            `👏 Nice work! You solved ${score}/${selectedRiddles.length} riddles!`;

    }

    else {

        finalMessage =
            `😊 You solved ${score}/${selectedRiddles.length}. Keep playing — you'll get stronger!`;

    }


    riddleText.textContent =
        finalMessage;


    message.textContent =
        "🔄 Ready for another random challenge?";

    message.className =
        "correct-message";


    // Show restart button
    restartBtn.classList.remove(
        "hidden"
    );

}


/* ==========================================
   CELEBRATION
========================================== */

function createCelebration() {

    const items = [

        "🌸",
        "🌺",
        "🌼",
        "✨",
        "⭐",
        "🎉",
        "💰",
        "🪙",
        "🎊",
        "💎"

    ];


    // Create 20 celebration items
    for (let i = 0; i < 20; i++) {

        const item =
            document.createElement("div");


        item.classList.add(
            "celebration-item"
        );


        // Random emoji
        item.textContent =
            items[
                Math.floor(
                    Math.random() *
                    items.length
                )
            ];


        // Random horizontal position
        item.style.left =
            `${Math.random() * 100}%`;


        // Random animation speed
        item.style.animationDuration =
            `${2 + Math.random() * 2}s`;


        // Random size
        item.style.fontSize =
            `${1.2 + Math.random() * 1.8}rem`;


        celebration.appendChild(
            item
        );


        // Remove item after animation
        setTimeout(() => {

            item.remove();

        }, 4000);

    }

}


/* ==========================================
   BIG CELEBRATION
========================================== */

function createBigCelebration() {

    const rounds = 4;


    for (let i = 0; i < rounds; i++) {

        setTimeout(() => {

            createCelebration();

        }, i * 500);

    }

}


/* ==========================================
   EVENT LISTENERS
========================================== */


// Check answer button
submitBtn.addEventListener(
    "click",
    checkAnswer
);


// Next button
nextBtn.addEventListener(
    "click",
    nextRiddle
);


// Restart game
restartBtn.addEventListener(
    "click",
    startGame
);


// Press Enter to submit answer
answerInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            if (!answered) {

                checkAnswer();

            }

        }

    }
);

