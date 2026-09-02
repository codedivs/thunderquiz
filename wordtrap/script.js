/* =========================================================
   WORD TRAP
   15 PUZZLES / RANDOM ORDER / STATIC GAME
   ========================================================= */


/* =========================================================
   GAME STATE
   ========================================================= */

const state = {
    puzzles: [],
    current: 0,
    score: 0,
    streak: 0,
    traps: 0,
    answered: false
};


/* =========================================================
   ELEMENTS
   ========================================================= */

const startScreen =
    document.getElementById("startScreen");

const gameOver =
    document.getElementById("gameOver");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const roundNumber =
    document.getElementById("roundNumber");

const totalRounds =
    document.getElementById("totalRounds");

const puzzleType =
    document.getElementById("puzzleType");

const difficulty =
    document.getElementById("difficulty");

const puzzleTitle =
    document.getElementById("puzzleTitle");

const question =
    document.getElementById("question");

const puzzleContent =
    document.getElementById("puzzleContent");

const answers =
    document.getElementById("answers");

const answerButtons =
    document.querySelectorAll(".answer");

const result =
    document.getElementById("result");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const nextButton =
    document.getElementById("nextButton");

const scoreDisplay =
    document.getElementById("score");

const streakDisplay =
    document.getElementById("streak");

const trapsDisplay =
    document.getElementById("traps");

const finalScore =
    document.getElementById("finalScore");

const finalMessage =
    document.getElementById("finalMessage");


/* =========================================================
   15 PUZZLES
   ========================================================= */

const puzzles = [

    /* -----------------------------------------------------
       1. ODD ONE OUT
       ----------------------------------------------------- */

    {
        type: "ODD ONE OUT",
        title: "The Outsider",
        difficulty: "EASY",

        question:
            "Which word does not belong?",

        content:
            "APPLE &nbsp;&nbsp; PEAR &nbsp;&nbsp; BANANA &nbsp;&nbsp; CARROT",

        options: [
            "APPLE",
            "PEAR",
            "BANANA",
            "CARROT"
        ],

        answer: 3,

        explanation:
            "CARROT is the trap. The other three are normally classified as fruits."
    },


    /* -----------------------------------------------------
       2. HIDDEN WORD
       ----------------------------------------------------- */

    {
        type: "HIDDEN WORD",
        title: "Look Again",
        difficulty: "EASY",

        question:
            "A word is hiding across the spaces. Which word can you find?",

        content:
            "I saw the <b>CAT</b> yesterday.",

        options: [
            "DOG",
            "CAT",
            "COW",
            "FOX"
        ],

        answer: 1,

        explanation:
            "CAT is hiding in plain sight. The trick was making you search for something more complicated."
    },


    /* -----------------------------------------------------
       3. MISSING LETTER
       ----------------------------------------------------- */

    {
        type: "MISSING LETTER",
        title: "One Letter Missing",
        difficulty: "EASY",

        question:
            "Which word can be made by filling the blank?",

        content:
            "C _ T",

        options: [
            "CAT",
            "DOG",
            "FISH",
            "BIRD"
        ],

        answer: 0,

        explanation:
            "Adding A creates CAT."
    },


    /* -----------------------------------------------------
       4. DOUBLE MEANING
       ----------------------------------------------------- */

    {
        type: "DOUBLE MEANING",
        title: "The Duck",
        difficulty: "MEDIUM",

        question:
            "In the sentence below, what could 'duck' mean?",

        content:
            "\"I saw her duck.\"",

        options: [
            "Only a bird",
            "Only an action",
            "A bird OR an action",
            "A type of food"
        ],

        answer: 2,

        explanation:
            "The sentence is ambiguous. 'Duck' can be a bird or the action of lowering your head."
    },


    /* -----------------------------------------------------
       5. WORD TRANSFORMATION
       ----------------------------------------------------- */

    {
        type: "WORD TRANSFORMATION",
        title: "One Letter Only",
        difficulty: "MEDIUM",

        question:
            "Change ONE letter to turn this word into something valuable.",

        content:
            "COLD",

        options: [
            "GOLD",
            "WARM",
            "HEAT",
            "COIN"
        ],

        answer: 0,

        explanation:
            "Change C to G: COLD becomes GOLD."
    },


    /* -----------------------------------------------------
       6. REARRANGE
       ----------------------------------------------------- */

    {
        type: "REARRANGE",
        title: "Mixed Letters",
        difficulty: "MEDIUM",

        question:
            "Rearrange these letters to make a common English word.",

        content:
            "L &nbsp; I &nbsp; S &nbsp; T &nbsp; E",

        options: [
            "STEEL",
            "SILENT",
            "LISTEN",
            "TILES"
        ],

        answer: 2,

        explanation:
            "LISTEN uses exactly the five letters shown."
    },


    /* -----------------------------------------------------
       7. WORD INSIDE WORD
       ----------------------------------------------------- */

    {
        type: "WORD INSIDE WORD",
        title: "Hidden Inside",
        difficulty: "MEDIUM",

        question:
            "Which small word is hidden inside this word?",

        content:
            "T E A C H E R",

        options: [
            "EAR",
            "TEA",
            "CHE",
            "All of these"
        ],

        answer: 3,

        explanation:
            "TEA, EAR and CHE can all be found as consecutive letters or meaningful fragments within the displayed word. The trap is assuming there is only one."
    },


    /* -----------------------------------------------------
       8. AMBIGUOUS SENTENCE
       ----------------------------------------------------- */

    {
        type: "AMBIGUOUS SENTENCE",
        title: "Who Has Them?",
        difficulty: "HARD",

        question:
            "Who could have the binoculars?",

        content:
            "THE BOY SAW THE GIRL WITH THE BINOCULARS.",

        options: [
            "Only the boy",
            "Only the girl",
            "Either the boy or the girl",
            "Nobody"
        ],

        answer: 2,

        explanation:
            "The sentence is grammatically ambiguous. The binoculars could belong to the boy or the girl."
    },


    /* -----------------------------------------------------
       9. ONE LETTER TRAP
       ----------------------------------------------------- */

    {
        type: "ONE LETTER TRAP",
        title: "Tiny Change",
        difficulty: "HARD",

        question:
            "Change ONE letter in this word to create something you can read.",

        content:
            "BOOK",

        options: [
            "LOOK",
            "FOOD",
            "PAGE",
            "PAPER"
        ],

        answer: 0,

        explanation:
            "BOOK → LOOK. Only one letter changes."
    },


    /* -----------------------------------------------------
       10. WORD SEQUENCE
       ----------------------------------------------------- */

    {
        type: "WORD SEQUENCE",
        title: "What's Next?",
        difficulty: "HARD",

        question:
            "What comes next?",

        content:
            "MONDAY → WEDNESDAY → FRIDAY → ?",

        options: [
            "SATURDAY",
            "SUNDAY",
            "MONDAY",
            "TUESDAY"
        ],

        answer: 1,

        explanation:
            "The sequence skips one day each time: Monday, Wednesday, Friday, Sunday."
    },


    /* -----------------------------------------------------
       11. FORBIDDEN WORD
       ----------------------------------------------------- */

    {
        type: "FORBIDDEN WORD",
        title: "Don't Say It",
        difficulty: "HARD",

        question:
            "Which answer describes the clue WITHOUT using the obvious word?",

        content:
            "CLUE: Something you use to tell the time.",

        options: [
            "CLOCK",
            "WATCH",
            "A device worn on your wrist",
            "TIME"
        ],

        answer: 2,

        explanation:
            "The obvious answers are CLOCK and WATCH. The third option describes a watch without naming it."
    },


    /* -----------------------------------------------------
       12. CONTEXT CLUE
       ----------------------------------------------------- */

    {
        type: "CONTEXT CLUE",
        title: "What Does It Mean?",
        difficulty: "HARD",

        question:
            "What does 'reluctant' most likely mean?",

        content:
            "She was reluctant to enter the dark room.",

        options: [
            "Excited",
            "Unwilling or hesitant",
            "Already inside",
            "Completely unaware"
        ],

        answer: 1,

        explanation:
            "The context tells us she does not really want to enter."
    },


    /* -----------------------------------------------------
       13. SENTENCE LOGIC
       ----------------------------------------------------- */

    {
        type: "SENTENCE LOGIC",
        title: "Must Be True",
        difficulty: "VERY HARD",

        question:
            "If ALL roses are flowers, which statement must be true?",

        content:
            "ALL ROSES → FLOWERS",

        options: [
            "All flowers are roses",
            "Some flowers are roses",
            "Every rose is a flower",
            "No flowers are roses"
        ],

        answer: 2,

        explanation:
            "The original statement directly tells us that every rose belongs to the group of flowers."
    },


    /* -----------------------------------------------------
       14. WORD RIDDLE
       ----------------------------------------------------- */

    {
        type: "WORD RIDDLE",
        title: "Three Clues",
        difficulty: "VERY HARD",

        question:
            "What word fits all three clues?",

        content:
            "I have a face.<br>I have hands.<br>I cannot clap.",

        options: [
            "CLOCK",
            "PERSON",
            "STATUE",
            "GLOVE"
        ],

        answer: 0,

        explanation:
            "A clock has a face and hands, but its hands cannot clap."
    },


    /* -----------------------------------------------------
       15. MASTER TRAP
       ----------------------------------------------------- */

    {
        type: "MASTER TRAP",
        title: "Don't Rush",
        difficulty: "MASTER",

        question:
            "What should you trust FIRST when solving a Word Trap puzzle?",

        content:
            "READ → THINK → QUESTION → ANSWER",

        options: [
            "The first answer you see",
            "The obvious meaning",
            "The exact wording",
            "Your first guess"
        ],

        answer: 2,

        explanation:
            "Word Trap is about reading carefully. The exact wording of the question is often where the real puzzle is hiding."
    }

];


/* =========================================================
   SHUFFLE
   Fisher-Yates shuffle
   ========================================================= */

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];
    }

    return copy;
}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    state.puzzles =
        shuffle(puzzles);

    state.current = 0;
    state.score = 0;
    state.streak = 0;
    state.traps = 0;
    state.answered = false;

    totalRounds.textContent =
        state.puzzles.length;

    startScreen.classList.remove("active");

    gameOver.classList.remove("active");

    updateScore();

    loadPuzzle();

}


/* =========================================================
   LOAD PUZZLE
   ========================================================= */

function loadPuzzle() {

    const puzzle =
        state.puzzles[state.current];

    if (!puzzle) {

        finishGame();

        return;
    }

    state.answered = false;

    result.hidden = true;

    puzzleType.textContent =
        puzzle.type;

    difficulty.textContent =
        puzzle.difficulty;

    puzzleTitle.textContent =
        puzzle.title;

    question.textContent =
        puzzle.question;

    puzzleContent.innerHTML =
        puzzle.content;

    roundNumber.textContent =
        state.current + 1;


    /*
       Put answers into buttons.
    */

    puzzle.options.forEach(
        (option, index) => {

            const button =
                answerButtons[index];

            button.textContent =
                option;

            button.disabled = false;

            button.classList.remove(
                "correct",
                "wrong"
            );

        }
    );


    /*
       If fewer than four answers
       are supplied, hide extras.
    */

    answerButtons.forEach(
        (button, index) => {

            if (
                index >= puzzle.options.length
            ) {

                button.style.display =
                    "none";

            } else {

                button.style.display =
                    "block";

            }

        }
    );


    /*
       Update next button text.
    */

    if (
        state.current ===
        state.puzzles.length - 1
    ) {

        nextButton.textContent =
            "See My Result →";

    } else {

        nextButton.textContent =
            "Next Trap →";

    }

}


/* =========================================================
   ANSWER
   ========================================================= */

function chooseAnswer(index) {

    if (state.answered) {
        return;
    }

    state.answered = true;

    const puzzle =
        state.puzzles[state.current];

    const correct =
        index === puzzle.answer;


    /*
       Stop further clicks.
    */

    answerButtons.forEach(
        button => {
            button.disabled = true;
        }
    );


    /*
       Mark selected answer.
    */

    answerButtons[index].classList.add(
        correct
            ? "correct"
            : "wrong"
    );


    /*
       Also reveal the correct answer.
    */

    answerButtons[
        puzzle.answer
    ].classList.add("correct");


    if (correct) {

        handleCorrect(puzzle);

    } else {

        handleWrong(puzzle);

    }

}


/* =========================================================
   CORRECT
   ========================================================= */

function handleCorrect(puzzle) {

    state.streak++;

    /*
       Base points.
    */

    let points = 100;


    /*
       Streak bonus.
    */

    if (state.streak >= 3) {
        points += 50;
    }

    if (state.streak >= 5) {
        points += 100;
    }


    /*
       Difficulty bonus.
    */

    if (
        puzzle.difficulty === "MEDIUM"
    ) {
        points += 25;
    }

    if (
        puzzle.difficulty === "HARD"
    ) {
        points += 50;
    }

    if (
        puzzle.difficulty === "VERY HARD"
    ) {
        points += 75;
    }

    if (
        puzzle.difficulty === "MASTER"
    ) {
        points += 150;
    }


    state.score += points;


    resultIcon.textContent =
        "✓";

    resultTitle.textContent =
        "Correct!";

    resultText.textContent =
        `${puzzle.explanation} +${points} points.`;

    result.hidden = false;

    updateScore();

}


/* =========================================================
   WRONG
   ========================================================= */

function handleWrong(puzzle) {

    state.streak = 0;

    state.traps++;

    resultIcon.textContent =
        "×";

    resultTitle.textContent =
        "You Fell Into The Trap";

    resultText.textContent =
        puzzle.explanation;

    result.hidden = false;

    updateScore();

}


/* =========================================================
   NEXT
   ========================================================= */

function nextPuzzle() {

    if (!state.answered) {
        return;
    }

    state.current++;

    loadPuzzle();

}


/* =========================================================
   SCORE
   ========================================================= */

function updateScore() {

    scoreDisplay.textContent =
        state.score;

    streakDisplay.textContent =
        state.streak;

    trapsDisplay.textContent =
        state.traps;

}


/* =========================================================
   FINISH
   ========================================================= */

function finishGame() {

    finalScore.textContent =
        state.score;


    let message;


    if (state.score >= 2000) {

        message =
            "Brilliant. You didn't just solve the puzzles — you saw the traps.";

    } else if (state.score >= 1300) {

        message =
            "Excellent thinking. You escaped most of the traps.";

    } else if (state.score >= 700) {

        message =
            "Good work. But Word Trap caught you a few times.";

    } else {

        message =
            "The traps got you. The good news? You now know what to watch for.";

    }


    finalMessage.textContent =
        message;

    gameOver.classList.add("active");

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


nextButton.addEventListener(
    "click",
    nextPuzzle
);


answerButtons.forEach(
    (button, index) => {

        button.addEventListener(
            "click",
            () => {

                chooseAnswer(index);

            }
        );

    }
);


/* =========================================================
   INITIAL STATE
   ========================================================= */

totalRounds.textContent =
    puzzles.length;

roundNumber.textContent =
    "1";

updateScore();

