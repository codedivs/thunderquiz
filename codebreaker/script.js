/* ==========================================
   CODE BREAKER — 13 LEVEL EDITION
========================================== */


/* ==========================================
   GAME LEVELS
========================================== */

const levels = [

    {
        digits: 3,
        attempts: 10,
        difficulty: "VERY EASY",
        title: "FIRST CODE",
        description:
            "A simple three-digit code to begin your journey."
    },

    {
        digits: 3,
        attempts: 9,
        difficulty: "EASY",
        title: "THE SECOND LOCK",
        description:
            "Fewer attempts. Use the feedback carefully."
    },

    {
        digits: 4,
        attempts: 10,
        difficulty: "EASY",
        title: "EXPANDING CODE",
        description:
            "The combination grows to four digits."
    },

    {
        digits: 4,
        attempts: 9,
        difficulty: "NORMAL",
        title: "LOGIC TEST",
        description:
            "Every guess should reveal useful information."
    },

    {
        digits: 4,
        attempts: 8,
        difficulty: "CHALLENGING",
        title: "TIGHTER LOCK",
        description:
            "Less room for mistakes. Think before guessing."
    },

    {
        digits: 5,
        attempts: 10,
        difficulty: "MEDIUM",
        title: "FIVE DIGITS",
        description:
            "The hidden combination becomes more complex."
    },

    {
        digits: 5,
        attempts: 9,
        difficulty: "HARD",
        title: "THE LOGIC VAULT",
        description:
            "Track every digit and every possible position."
    },

    {
        digits: 5,
        attempts: 8,
        difficulty: "EXPERT",
        title: "PATTERN BREAKER",
        description:
            "The code is longer and your attempts are limited."
    },

    {
        digits: 6,
        attempts: 10,
        difficulty: "HARD",
        title: "SIXTH SENSE",
        description:
            "Six digits. Careful elimination becomes essential."
    },

    {
        digits: 6,
        attempts: 9,
        difficulty: "EXPERT",
        title: "THE IRON CODE",
        description:
            "A serious test of memory and deduction."
    },

    {
        digits: 6,
        attempts: 8,
        difficulty: "EXTREME",
        title: "NO ROOM FOR ERROR",
        description:
            "Every attempt matters now."
    },

    {
        digits: 7,
        attempts: 9,
        difficulty: "MASTER",
        title: "THE SEVEN SEAL",
        description:
            "Seven digits stand between you and the final level."
    },

    {
        digits: 7,
        attempts: 8,
        difficulty: "CODE LEGEND",
        title: "THE FINAL COMBINATION",
        description:
            "The ultimate challenge. Crack the seven-digit code."
    }

];


/* ==========================================
   ELEMENTS
========================================== */

const levelDisplay =
    document.getElementById("levelDisplay");

const levelTitle =
    document.getElementById("levelTitle");

const levelDescription =
    document.getElementById("levelDescription");

const starsDisplay =
    document.getElementById("starsDisplay");

const levelProgressBar =
    document.getElementById("levelProgressBar");

const codeLength =
    document.getElementById("codeLength");

const attemptsElement =
    document.getElementById("attempts");

const difficultyElement =
    document.getElementById("difficulty");

const codeDisplay =
    document.getElementById("codeDisplay");

const instruction =
    document.getElementById("instruction");

const guessInput =
    document.getElementById("guessInput");

const guessBtn =
    document.getElementById("guessBtn");

const message =
    document.getElementById("message");

const history =
    document.getElementById("history");

const restartLevelBtn =
    document.getElementById("restartLevelBtn");

const levelMap =
    document.getElementById("levelMap");

const levelsUnlockedText =
    document.getElementById("levelsUnlockedText");

const resultScreen =
    document.getElementById("resultScreen");

const resultIcon =
    document.getElementById("resultIcon");

const resultLevel =
    document.getElementById("resultLevel");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const resultStars =
    document.getElementById("resultStars");

const secretCodeElement =
    document.getElementById("secretCode");

const nextLevelBtn =
    document.getElementById("nextLevelBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const finalScreen =
    document.getElementById("finalScreen");

const restartGameBtn =
    document.getElementById("restartGameBtn");


/* ==========================================
   GAME STATE
========================================== */

let currentLevel = 1;

let secretCode = "";

let attempts = 0;

let gameOver = false;


/*
   Saved progress format:

   {
       unlocked: 1,
       stars: {
           1: 3,
           2: 2
       }
   }
*/

let progress = {
    unlocked: 1,
    stars: {}
};


/* ==========================================
   LOCAL STORAGE
========================================== */

const SAVE_KEY =
    "codeBreakerProgressV2";


function loadProgress() {

    const saved =
        localStorage.getItem(SAVE_KEY);


    if (!saved) return;


    try {

        const parsed =
            JSON.parse(saved);


        progress.unlocked =
            Math.min(
                Math.max(
                    1,
                    parsed.unlocked || 1
                ),
                levels.length
            );


        progress.stars =
            parsed.stars || {};

    }

    catch (error) {

        console.log(
            "Progress could not be loaded."
        );

    }

}


function saveProgress() {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(progress)
    );

}


/* ==========================================
   GENERATE SECRET CODE
========================================== */

function generateCode(length) {

    const digits = [
        "0", "1", "2", "3", "4",
        "5", "6", "7", "8", "9"
    ];


    /*
       Shuffle digits
    */

    for (
        let i = digits.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            digits[i],
            digits[randomIndex]
        ] =
        [
            digits[randomIndex],
            digits[i]
        ];

    }


    /*
       Do not allow zero
       as first digit
    */

    if (digits[0] === "0") {

        const nonZeroIndex =
            digits.findIndex(
                digit =>
                    digit !== "0"
            );


        [
            digits[0],
            digits[nonZeroIndex]
        ] =
        [
            digits[nonZeroIndex],
            digits[0]
        ];

    }


    return digits
        .slice(0, length)
        .join("");

}


/* ==========================================
   START LEVEL
========================================== */

function startLevel(levelNumber) {

    if (
        levelNumber < 1 ||
        levelNumber > progress.unlocked
    ) {

        return;

    }


    currentLevel =
        levelNumber;


    const level =
        levels[currentLevel - 1];


    secretCode =
        generateCode(level.digits);


    attempts = 0;

    gameOver = false;


    /*
       Enable controls
    */

    guessInput.disabled =
        false;

    guessBtn.disabled =
        false;


    guessInput.value = "";

    guessInput.maxLength =
        level.digits;


    /*
       Header information
    */

    levelDisplay.textContent =
        `${currentLevel} / ${levels.length}`;


    levelTitle.textContent =
        `LEVEL ${currentLevel} — ${level.title}`;


    levelDescription.textContent =
        level.description;


    codeLength.textContent =
        `${level.digits} DIGITS`;


    difficultyElement.textContent =
        level.difficulty;


    instruction.textContent =
        `Enter ${level.digits} different digits and break the combination.`;


    /*
       Progress bar
    */

    const percentage =
        (currentLevel / levels.length)
        * 100;


    levelProgressBar.style.width =
        `${percentage}%`;


    /*
       Previous stars
    */

    const previousStars =
        progress.stars[currentLevel] || 0;


    starsDisplay.textContent =
        createStars(previousStars);


    /*
       Reset history
    */

    history.innerHTML = `
        <div class="empty-history">
            No guesses yet.
        </div>
    `;


    /*
       Reset message
    */

    message.textContent =
        "The code is waiting...";


    /*
       Hide result screens
    */

    resultScreen.classList.add(
        "hidden"
    );


    finalScreen.classList.add(
        "hidden"
    );


    /*
       Create slots
    */

    createCodeSlots(
        level.digits
    );


    updateAttempts();

    renderLevelMap();

    guessInput.focus();


    /*
       TESTING ONLY:

       console.log(
           "Secret:",
           secretCode
       );
    */

}


/* ==========================================
   CREATE CODE SLOTS
========================================== */

function createCodeSlots(length) {

    codeDisplay.innerHTML = "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        const slot =
            document.createElement("div");


        slot.className =
            "code-slot";


        slot.textContent =
            "?";


        codeDisplay.appendChild(
            slot
        );

    }

}


/* ==========================================
   UPDATE ATTEMPTS
========================================== */

function updateAttempts() {

    const level =
        levels[currentLevel - 1];


    attemptsElement.textContent =
        `${attempts} / ${level.attempts}`;

}


/* ==========================================
   VALIDATE GUESS
========================================== */

function validateGuess(guess) {

    const level =
        levels[currentLevel - 1];


    if (
        guess.length !==
        level.digits
    ) {

        return {
            valid: false,

            message:
                `Enter exactly ${level.digits} digits.`
        };

    }


    if (
        !/^\d+$/.test(guess)
    ) {

        return {
            valid: false,

            message:
                "Numbers only."
        };

    }


    const uniqueDigits =
        new Set(guess);


    if (
        uniqueDigits.size !==
        level.digits
    ) {

        return {
            valid: false,

            message:
                "Every digit must be different."
        };

    }


    return {
        valid: true
    };

}


/* ==========================================
   ANALYZE GUESS
========================================== */

function analyzeGuess(guess) {

    const feedback = [];


    for (
        let i = 0;
        i < guess.length;
        i++
    ) {

        /*
           Correct digit
           Correct position
        */

        if (
            guess[i] ===
            secretCode[i]
        ) {

            feedback.push(
                "correct"
            );

        }


        /*
           Correct digit
           Wrong position
        */

        else if (
            secretCode.includes(
                guess[i]
            )
        ) {

            feedback.push(
                "partial"
            );

        }


        /*
           Digit does not exist
        */

        else {

            feedback.push(
                "wrong"
            );

        }

    }


    return feedback;

}


/* ==========================================
   CHECK GUESS
========================================== */

function checkGuess() {

    if (gameOver) return;


    const guess =
        guessInput.value.trim();


    const validation =
        validateGuess(guess);


    if (!validation.valid) {

        message.textContent =
            `⚠️ ${validation.message}`;

        return;

    }


    attempts++;


    const feedback =
        analyzeGuess(guess);


    addHistory(
        guess,
        feedback
    );


    updateCodeDisplay(
        guess,
        feedback
    );


    updateAttempts();


    /*
       PLAYER WINS
    */

    if (
        guess === secretCode
    ) {

        gameOver = true;


        message.textContent =
            "🎉 CODE CRACKED!";


        setTimeout(
            () => {

                completeLevel();

            },
            500
        );


        return;

    }


    /*
       PLAYER LOSES
    */

    const level =
        levels[currentLevel - 1];


    if (
        attempts >=
        level.attempts
    ) {

        gameOver = true;


        message.textContent =
            "🔒 No attempts remaining.";


        setTimeout(
            () => {

                showLoss();

            },
            500
        );


        return;

    }


    /*
       Continue playing
    */

    const correctCount =
        feedback.filter(
            item =>
                item === "correct"
        ).length;


    const partialCount =
        feedback.filter(
            item =>
                item === "partial"
        ).length;


    message.textContent =
        `🧠 ${correctCount} exact • ${partialCount} misplaced`;


    guessInput.value = "";

    guessInput.focus();

}


/* ==========================================
   HISTORY
========================================== */

function addHistory(
    guess,
    feedback
) {

    const emptyHistory =
        history.querySelector(
            ".empty-history"
        );


    if (emptyHistory) {

        emptyHistory.remove();

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "history-row";


    /*
       Guess
    */

    const guessNumber =
        document.createElement(
            "div"
        );


    guessNumber.className =
        "guess-number";


    guessNumber.textContent =
        guess;


    /*
       Feedback dots
    */

    const feedbackContainer =
        document.createElement(
            "div"
        );


    feedbackContainer.className =
        "feedback";


    feedback.forEach(
        result => {

            const dot =
                document.createElement(
                    "div"
                );


            dot.className =
                `feedback-dot ${result}`;


            feedbackContainer.appendChild(
                dot
            );

        }
    );


    row.appendChild(
        guessNumber
    );


    row.appendChild(
        feedbackContainer
    );


    history.prepend(row);

}


/* ==========================================
   UPDATE CODE DISPLAY
========================================== */

function updateCodeDisplay(
    guess,
    feedback
) {

    const slots =
        document.querySelectorAll(
            ".code-slot"
        );


    slots.forEach(
        (slot, index) => {

            slot.textContent =
                guess[index];


            if (
                feedback[index] ===
                "correct"
            ) {

                slot.style.borderColor =
                    "#55d98a";


                slot.style.boxShadow =
                    "0 0 15px rgba(85,217,138,0.25)";

            }

            else if (
                feedback[index] ===
                "partial"
            ) {

                slot.style.borderColor =
                    "#f4c95d";


                slot.style.boxShadow =
                    "0 0 15px rgba(244,201,93,0.2)";

            }

            else {

                slot.style.borderColor =
                    "#5b6876";


                slot.style.boxShadow =
                    "none";

            }

        }
    );

}


/* ==========================================
   STAR CALCULATION
========================================== */

function calculateStars() {

    const level =
        levels[currentLevel - 1];


    const usedPercentage =
        attempts /
        level.attempts;


    /*
       Excellent
    */

    if (
        usedPercentage <= 0.4
    ) {

        return 3;

    }


    /*
       Good
    */

    if (
        usedPercentage <= 0.7
    ) {

        return 2;

    }


    /*
       Completed
    */

    return 1;

}


/* ==========================================
   STAR DISPLAY
========================================== */

function createStars(count) {

    let stars = "";


    for (
        let i = 1;
        i <= 3;
        i++
    ) {

        stars +=
            i <= count
                ? "★"
                : "☆";

    }


    return stars;

}


/* ==========================================
   COMPLETE LEVEL
========================================== */

function completeLevel() {

    const earnedStars =
        calculateStars();


    /*
       Keep best score
    */

    const previousStars =
        progress.stars[currentLevel] || 0;


    if (
        earnedStars >
        previousStars
    ) {

        progress.stars[currentLevel] =
            earnedStars;

    }


    /*
       Unlock next level
    */

    if (
        currentLevel <
        levels.length
    ) {

        progress.unlocked =
            Math.max(
                progress.unlocked,
                currentLevel + 1
            );

    }


    saveProgress();


    renderLevelMap();


    resultIcon.textContent =
        "🎉";


    resultLevel.textContent =
        `LEVEL ${currentLevel} COMPLETE`;


    resultTitle.textContent =
        currentLevel === levels.length
            ? "FINAL CODE CRACKED!"
            : "CODE CRACKED!";


    resultText.textContent =
        `You solved the combination in ${attempts} attempt${attempts === 1 ? "" : "s"}.`;


    resultStars.textContent =
        createStars(earnedStars);


    secretCodeElement.textContent =
        secretCode;


    /*
       Final level
    */

    if (
        currentLevel ===
        levels.length
    ) {

        nextLevelBtn.style.display =
            "none";

    }

    else {

        nextLevelBtn.style.display =
            "inline-block";

    }


    resultScreen.classList.remove(
        "hidden"
    );

}


/* ==========================================
   SHOW LOSS
========================================== */

function showLoss() {

    resultIcon.textContent =
        "🔒";


    resultLevel.textContent =
        `LEVEL ${currentLevel}`;


    resultTitle.textContent =
        "CODE LOCKED";


    resultText.textContent =
        "You ran out of attempts. Study the answer and try again.";


    resultStars.textContent =
        "";


    secretCodeElement.textContent =
        secretCode;


    nextLevelBtn.style.display =
        "none";


    resultScreen.classList.remove(
        "hidden"
    );

}


/* ==========================================
   LEVEL MAP
========================================== */

function renderLevelMap() {

    levelMap.innerHTML = "";


    levels.forEach(
        (level, index) => {

            const levelNumber =
                index + 1;


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "level-button";


            const stars =
                progress.stars[levelNumber] || 0;


            /*
               Locked level
            */

            if (
                levelNumber >
                progress.unlocked
            ) {

                button.classList.add(
                    "locked"
                );


                button.disabled =
                    true;

            }

            else {

                button.classList.add(
                    "unlocked"
                );


                button.addEventListener(
                    "click",
                    () => {

                        startLevel(
                            levelNumber
                        );

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }
                );

            }


            /*
               Current level
            */

            if (
                levelNumber ===
                currentLevel
            ) {

                button.classList.add(
                    "current"
                );

            }


            /*
               Completed
            */

            if (
                stars > 0
            ) {

                button.classList.add(
                    "completed"
                );

            }


            button.innerHTML = `

                ${levelNumber > progress.unlocked
                    ? '<span class="lock-icon">🔒</span>'
                    : ""}

                <span class="level-number">
                    ${levelNumber}
                </span>

                <span class="level-label">
                    ${level.digits} DIGITS
                </span>

                <span class="level-stars">
                    ${stars > 0
                        ? createStars(stars)
                        : ""}
                </span>

            `;


            levelMap.appendChild(
                button
            );

        }
    );


    /*
       Unlock text
    */

    if (
        progress.unlocked >=
        levels.length
    ) {

        levelsUnlockedText.textContent =
            "ALL LEVELS UNLOCKED 👑";

    }

    else {

        levelsUnlockedText.textContent =
            `LEVELS 1–${progress.unlocked} UNLOCKED`;

    }

}


/* ==========================================
   NEXT LEVEL
========================================== */

function goToNextLevel() {

    if (
        currentLevel >=
        levels.length
    ) {

        resultScreen.classList.add(
            "hidden"
        );


        finalScreen.classList.remove(
            "hidden"
        );


        return;

    }


    startLevel(
        currentLevel + 1
    );

}


/* ==========================================
   PLAY AGAIN
========================================== */

function retryLevel() {

    startLevel(
        currentLevel
    );

}


/* ==========================================
   RESTART ENTIRE GAME
========================================== */

function restartEntireGame() {

    currentLevel = 1;

    finalScreen.classList.add(
        "hidden"
    );

    startLevel(1);

}


/* ==========================================
   INPUT CONTROL
========================================== */

guessInput.addEventListener(
    "input",
    () => {

        const level =
            levels[currentLevel - 1];


        guessInput.value =
            guessInput.value
                .replace(/\D/g, "")
                .slice(
                    0,
                    level.digits
                );

    }
);


/* ==========================================
   ENTER KEY
========================================== */

guessInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            checkGuess();

        }

    }
);


/* ==========================================
   BUTTON EVENTS
========================================== */

guessBtn.addEventListener(
    "click",
    checkGuess
);


restartLevelBtn.addEventListener(
    "click",
    retryLevel
);


nextLevelBtn.addEventListener(
    "click",
    goToNextLevel
);


playAgainBtn.addEventListener(
    "click",
    retryLevel
);


restartGameBtn.addEventListener(
    "click",
    restartEntireGame
);


/* ==========================================
   START GAME
========================================== */

loadProgress();

startLevel(1);

