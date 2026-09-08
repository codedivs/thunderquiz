/* =========================================================
   WORD LOCK
   Complete fixed game engine
   Compatible with the supplied Word Lock index.html
   ========================================================= */

const state = {
    levels: [],

    levelIndex: 0,
    puzzleIndex: 0,

    answer: "",
    clue: "",

    /*
       input contains one character for every answer position.
       Empty string = player has not filled that position.
    */
    input: [],

    /*
       Positions revealed by hints.
       These cannot be removed by Backspace.
    */
    hintedPositions: new Set(),

    attempts: 0,
    maxAttempts: 6,

    score: 0,
    streak: 0,
    hints: 3,

    locked: false
};


/* =========================================================
   DOM
   ========================================================= */

const el = {};

document.addEventListener(
    "DOMContentLoaded",
    init
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function init() {

    cacheElements();

    bindEvents();

    loadGame();
}


/* =========================================================
   CACHE ELEMENTS
   ========================================================= */

function cacheElements() {

    el.level =
        document.getElementById("level");

    el.score =
        document.getElementById("score");

    el.streak =
        document.getElementById("streak");

    el.attemptText =
        document.getElementById("attemptText");

    el.hintCount =
        document.getElementById("hintCount");

    el.progressBar =
        document.getElementById("progressBar");

    el.lockStatus =
        document.getElementById("lockStatus");

    el.clue =
        document.getElementById("clue");

    el.wordLength =
        document.getElementById("wordLength");

    el.wordGrid =
        document.getElementById("wordGrid");

    el.keyboard =
        document.getElementById("keyboard");

    el.backspace =
        document.getElementById("backspace");

    el.hintButton =
        document.getElementById("hintButton");

    el.submitButton =
        document.getElementById("submitButton");

    el.message =
        document.getElementById("message");

    el.completeScreen =
        document.getElementById("completeScreen");

    el.completeMessage =
        document.getElementById("completeMessage");

    el.levelScore =
        document.getElementById("levelScore");

    el.nextButton =
        document.getElementById("nextButton");
}


/* =========================================================
   EVENTS
   ========================================================= */

function bindEvents() {

    el.backspace?.addEventListener(
        "click",
        removeLetter
    );

    el.hintButton?.addEventListener(
        "click",
        useHint
    );

    el.submitButton?.addEventListener(
        "click",
        submitWord
    );

    el.nextButton?.addEventListener(
        "click",
        nextPuzzle
    );

    document.addEventListener(
        "keydown",
        handleKeyboard
    );
}


/* =========================================================
   LOAD GAME DATA
   ========================================================= */

async function loadGame() {

    try {

        const response =
            await fetch(
                "wordlock.json",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Could not load wordlock.json"
            );
        }

        const data =
            await response.json();

        if (
            !data ||
            !Array.isArray(data.levels)
        ) {
            throw new Error(
                "wordlock.json does not contain a valid levels array."
            );
        }

        state.levels =
            data.levels
                .map(level => {

                    const questions =
                        Array.isArray(
                            level.questions
                        )
                            ? level.questions.filter(
                                puzzle =>
                                    puzzle &&
                                    typeof puzzle.clue ===
                                        "string" &&
                                    typeof puzzle.answer ===
                                        "string" &&
                                    normalize(
                                        puzzle.answer
                                    ).length > 0
                            )
                            : [];

                    return {
                        ...level,
                        questions
                    };
                })
                .filter(
                    level =>
                        level.questions.length > 0
                );

        if (!state.levels.length) {

            throw new Error(
                "No playable Word Lock levels were found."
            );
        }

        state.hints =
            Number.isInteger(
                data.game?.startingHints
            )
                ? data.game.startingHints
                : 3;

        updateStats();

        loadLevel();

    } catch (error) {

        console.error(
            "Word Lock error:",
            error
        );

        showMessage(
            "Unable to load Word Lock data.",
            "error"
        );
    }
}


/* =========================================================
   NORMALIZE ANSWER
   ========================================================= */

function normalize(value) {

    return String(value)
        .toUpperCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^A-Z]/g,
            ""
        );
}


/* =========================================================
   LOAD LEVEL
   ========================================================= */

function loadLevel() {

    if (
        state.levelIndex >=
        state.levels.length
    ) {

        finishGame();

        return;
    }

    state.puzzleIndex = 0;

    loadPuzzle();
}


/* =========================================================
   LOAD PUZZLE
   ========================================================= */

function loadPuzzle() {

    const level =
        state.levels[
            state.levelIndex
        ];

    if (
        !level ||
        !level.questions.length
    ) {

        state.levelIndex++;

        loadLevel();

        return;
    }

    if (
        state.puzzleIndex >=
        level.questions.length
    ) {

        state.levelIndex++;

        loadLevel();

        return;
    }

    const puzzle =
        level.questions[
            state.puzzleIndex
        ];

    state.answer =
        normalize(
            puzzle.answer
        );

    state.clue =
        puzzle.clue;

    /*
       Create an empty slot for every
       letter of the answer.
    */

    state.input =
        Array(
            state.answer.length
        ).fill("");

    state.hintedPositions =
        new Set();

    state.locked = false;

    state.maxAttempts =
        Number.isInteger(level.attempts) &&
        level.attempts > 0
            ? level.attempts
            : 6;

    state.attempts =
        state.maxAttempts;

    hideCompleteScreen();

    renderPuzzle();

    renderKeyboard();

    updateStats();

    clearMessage();
}


/* =========================================================
   RENDER PUZZLE
   ========================================================= */

function renderPuzzle() {

    el.level.textContent =
        state.levelIndex + 1;

    el.clue.textContent =
        state.clue;

    el.wordLength.textContent =
        `${state.answer.length} LETTER${
            state.answer.length === 1
                ? ""
                : "S"
        }`;

    el.lockStatus.textContent =
        "LOCKED";

    el.lockStatus.classList.remove(
        "open",
        "unlocked"
    );

    renderWordGrid();

    updateProgress();
}


/* =========================================================
   RENDER ANSWER SLOTS
   ========================================================= */

function renderWordGrid() {

    el.wordGrid.innerHTML = "";

    const fragment =
        document.createDocumentFragment();

    for (
        let i = 0;
        i < state.answer.length;
        i++
    ) {

        const slot =
            document.createElement("div");

        slot.className =
            "word-slot";

        /*
           Show the player's letter or
           the hinted letter.
        */

        if (state.input[i]) {

            slot.textContent =
                state.input[i];

            slot.classList.add(
                "filled"
            );
        }

        /*
           Give hinted positions a
           different visual class.
        */

        if (
            state.hintedPositions.has(i)
        ) {

            slot.classList.add(
                "hinted"
            );
        }

        fragment.appendChild(
            slot
        );
    }

    el.wordGrid.appendChild(
        fragment
    );
}


/* =========================================================
   ALPHABET KEYBOARD
   ========================================================= */

function renderKeyboard() {

    el.keyboard.innerHTML = "";

    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const fragment =
        document.createDocumentFragment();

    for (const letter of letters) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "key";

        button.textContent =
            letter;

        button.dataset.key =
            letter;

        button.addEventListener(
            "click",
            () => addLetter(letter)
        );

        fragment.appendChild(
            button
        );
    }

    el.keyboard.appendChild(
        fragment
    );

    updateKeyboard();
}


/* =========================================================
   ADD LETTER
   ========================================================= */

function addLetter(letter) {

    if (state.locked) return;

    if (
        !/^[A-Z]$/.test(letter)
    ) {
        return;
    }

    /*
       Find the first empty position
       that has NOT been revealed by
       a hint.
    */

    const position =
        findNextAvailablePosition();

    if (position === -1) {

        showMessage(
            "All available spaces are filled.",
            "warning"
        );

        return;
    }

    state.input[position] =
        letter;

    renderWordGrid();

    updateKeyboard();

    clearMessage();
}


/* =========================================================
   FIND NEXT AVAILABLE POSITION
   ========================================================= */

function findNextAvailablePosition() {

    for (
        let i = 0;
        i < state.answer.length;
        i++
    ) {

        if (
            state.input[i] === "" &&
            !state.hintedPositions.has(i)
        ) {

            return i;
        }
    }

    return -1;
}


/* =========================================================
   BACKSPACE
   ========================================================= */

function removeLetter() {

    if (state.locked) return;

    /*
       Find the last player-entered
       letter.

       Hinted letters are skipped.
    */

    for (
        let i = state.answer.length - 1;
        i >= 0;
        i--
    ) {

        if (
            state.input[i] !== "" &&
            !state.hintedPositions.has(i)
        ) {

            state.input[i] = "";

            renderWordGrid();

            updateKeyboard();

            return;
        }
    }

    showMessage(
        "There are no letters to remove.",
        "warning"
    );
}


/* =========================================================
   PHYSICAL KEYBOARD
   ========================================================= */

function handleKeyboard(event) {

    if (state.locked) return;

    const key =
        event.key.toUpperCase();

    if (
        /^[A-Z]$/.test(key)
    ) {

        addLetter(key);

        return;
    }

    if (
        event.key === "Backspace"
    ) {

        removeLetter();

        return;
    }

    if (
        event.key === "Enter"
    ) {

        submitWord();
    }
}


/* =========================================================
   UPDATE ALPHABET KEYBOARD
   ========================================================= */

function updateKeyboard() {

    const buttons =
        el.keyboard.querySelectorAll(
            ".key"
        );

    buttons.forEach(button => {

        const letter =
            button.dataset.key;

        button.classList.remove(
            "selected",
            "hinted"
        );

        /*
           IMPORTANT:
           Do NOT disable a letter simply
           because it has already been used.

           A word can contain repeated letters.

           Example:
           LETTER

           The player needs to click
           E twice.
        */

        let playerUsed = false;
        let hintedUsed = false;

        for (
            let i = 0;
            i < state.input.length;
            i++
        ) {

            if (
                state.input[i] ===
                letter
            ) {

                if (
                    state.hintedPositions.has(i)
                ) {

                    hintedUsed = true;

                } else {

                    playerUsed = true;
                }
            }
        }

        if (hintedUsed) {

            button.classList.add(
                "hinted"
            );
        }

        if (playerUsed) {

            button.classList.add(
                "selected"
            );
        }

        /*
           Never disable alphabet buttons.
        */

        button.disabled =
            state.locked;
    });
}


/* =========================================================
   SUBMIT WORD
   ========================================================= */

function submitWord() {

    if (state.locked) return;

    /*
       Make sure every position has
       a letter.
    */

    const incomplete =
        state.input.some(
            letter => !letter
        );

    if (incomplete) {

        showMessage(
            "Fill every letter space first.",
            "warning"
        );

        return;
    }

    const guess =
        state.input.join("");

    state.attempts--;

    updateStats();

    if (
        guess ===
        state.answer
    ) {

        unlockWord();

    } else {

        wrongWord();
    }
}


/* =========================================================
   CORRECT
   ========================================================= */

function unlockWord() {

    state.locked = true;

    state.streak++;

    /*
       Base score + remaining attempts
       + streak bonus.
    */

    const earned =
        100 +
        (state.attempts * 10) +
        (state.streak * 10);

    state.score += earned;

    el.lockStatus.textContent =
        "UNLOCKED 🔓";

    el.lockStatus.classList.add(
        "open",
        "unlocked"
    );

    showMessage(
        "🔓 LOCK OPEN! Excellent work!",
        "success"
    );

    el.levelScore.textContent =
        `+${earned}`;

    el.completeMessage.textContent =
        `You cracked the word in ${
            state.maxAttempts -
            state.attempts
        } attempt${
            state.maxAttempts -
            state.attempts === 1
                ? ""
                : "s"
        }!`;

    el.completeScreen
        .classList
        .remove("hidden");

    el.completeScreen
        .classList
        .add("show");

    updateKeyboard();

    updateStats();
}


/* =========================================================
   WRONG ANSWER
   ========================================================= */

function wrongWord() {

    /*
       If no attempts remain,
       close the lock.
    */

    if (
        state.attempts <= 0
    ) {

        state.locked = true;

        state.streak = 0;

        /*
           Reveal the answer.
        */

        state.input =
            state.answer.split("");

        renderWordGrid();

        updateKeyboard();

        el.lockStatus.textContent =
            "LOCK CLOSED 🔒";

        showMessage(
            `The answer was ${formatAnswer(
                state.answer
            )}.`,
            "error"
        );

        el.completeMessage.textContent =
            `The word was ${formatAnswer(
                state.answer
            )}.`;

        el.levelScore.textContent =
            "+0";

        el.completeScreen
            .classList
            .remove("hidden");

        el.completeScreen
            .classList
            .add("show");

        updateStats();

        return;
    }

    /*
       Clear ONLY player-entered
       letters.

       Hinted letters remain.
    */

    for (
        let i = 0;
        i < state.input.length;
        i++
    ) {

        if (
            !state.hintedPositions.has(i)
        ) {

            state.input[i] = "";
        }
    }

    renderWordGrid();

    updateKeyboard();

    showMessage(
        `❌ Wrong word. ${
            state.attempts
        } attempt${
            state.attempts === 1
                ? ""
                : "s"
        } remaining.`,
        "error"
    );

    updateStats();
}


/* =========================================================
   HINT
   ========================================================= */

function useHint() {

    if (state.locked) return;

    if (state.hints <= 0) {

        showMessage(
            "No hints remaining.",
            "warning"
        );

        return;
    }

    /*
       Find positions that are not
       already correctly revealed.
    */

    const available = [];

    for (
        let i = 0;
        i < state.answer.length;
        i++
    ) {

        if (
            !state.hintedPositions.has(i)
        ) {

            /*
               Only consider positions
               that are not already correct.
            */

            if (
                state.input[i] !==
                state.answer[i]
            ) {

                available.push(i);
            }
        }
    }

    if (!available.length) {

        showMessage(
            "The word is already complete!",
            "success"
        );

        return;
    }

    /*
       Select a random unrevealed
       position.
    */

    const position =
        available[
            Math.floor(
                Math.random() *
                available.length
            )
        ];

    /*
       Reveal the correct letter.
    */

    state.input[position] =
        state.answer[position];

    state.hintedPositions.add(
        position
    );

    state.hints--;

    renderWordGrid();

    /*
       CRITICAL:
       Recalculate the keyboard,
       but DO NOT disable letters.

       This means if the hint reveals E,
       the player can still click E again
       for another position.
    */

    updateKeyboard();

    updateStats();

    showMessage(
        `💡 Letter ${position + 1} revealed.`,
        "hint"
    );

    /*
       If the hint happened to complete
       the word, finish automatically.
    */

    if (
        isComplete()
    ) {

        unlockWord();
    }
}


/* =========================================================
   CHECK COMPLETION
   ========================================================= */

function isComplete() {

    for (
        let i = 0;
        i < state.answer.length;
        i++
    ) {

        if (
            state.input[i] !==
            state.answer[i]
        ) {

            return false;
        }
    }

    return true;
}


/* =========================================================
   NEXT PUZZLE
   ========================================================= */

function nextPuzzle() {

    if (!state.locked) {
        return;
    }

    const level =
        state.levels[
            state.levelIndex
        ];

    state.puzzleIndex++;

    /*
       More puzzles in current level.
    */

    if (
        state.puzzleIndex <
        level.questions.length
    ) {

        loadPuzzle();

        return;
    }

    /*
       Move to next level.
    */

    state.levelIndex++;

    if (
        state.levelIndex >=
        state.levels.length
    ) {

        finishGame();

        return;
    }

    loadLevel();
}


/* =========================================================
   FINISH GAME
   ========================================================= */

function finishGame() {

    state.locked = true;

    el.clue.textContent =
        "🏆 ALL LOCKS CRACKED!";

    el.wordLength.textContent =
        `${state.levels.length} LEVELS COMPLETE`;

    el.wordGrid.innerHTML = `
        <div class="game-finished">
            WORD LOCK MASTER
        </div>
    `;

    el.keyboard.innerHTML = "";

    el.lockStatus.textContent =
        "MASTER UNLOCKED 🔓";

    el.lockStatus.classList.add(
        "open"
    );

    el.completeScreen
        .classList
        .add("hidden");

    showMessage(
        `🏆 Incredible! Final score: ${state.score}`,
        "success"
    );

    el.level.textContent =
        state.levels.length;

    el.progressBar.style.width =
        "100%";
}


/* =========================================================
   STATS
   ========================================================= */

function updateStats() {

    if (el.score) {

        el.score.textContent =
            state.score;
    }

    if (el.streak) {

        el.streak.textContent =
            `${state.streak} 🔥`;
    }

    if (el.attemptText) {

        el.attemptText.textContent =
            `Attempts: ${
                state.attempts
            } / ${
                state.maxAttempts
            }`;
    }

    if (el.hintCount) {

        el.hintCount.textContent =
            `💡 ${state.hints}`;
    }
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    if (!el.progressBar) {
        return;
    }

    const total =
        state.levels.length;

    if (!total) return;

    const percentage =
        (
            state.levelIndex /
            total
        ) * 100;

    el.progressBar.style.width =
        `${Math.min(
            100,
            percentage
        )}%`;
}


/* =========================================================
   MESSAGES
   ========================================================= */

function showMessage(
    text,
    type = ""
) {

    if (!el.message) {
        return;
    }

    el.message.textContent =
        text;

    el.message.className =
        `message ${type}`;
}


function clearMessage() {

    if (!el.message) {
        return;
    }

    el.message.textContent =
        "";

    el.message.className =
        "message";
}


/* =========================================================
   COMPLETE SCREEN
   ========================================================= */

function hideCompleteScreen() {

    el.completeScreen
        .classList
        .add("hidden");

    el.completeScreen
        .classList
        .remove("show");
}


/* =========================================================
   FORMAT ANSWER
   ========================================================= */

function formatAnswer(answer) {

    return String(answer)
        .toLowerCase()
        .replace(
            /\b[a-z]/g,
            letter =>
                letter.toUpperCase()
        );
}
