/* =========================================================
   CROSSWORD — GAME ENGINE
   ========================================================= */

/*
    This version uses a hand-designed puzzle.

    Later, we can replace the puzzle data with:
    - random puzzle generation
    - a word database
    - daily puzzles
    - difficulty levels
    - JSON puzzle files
*/


/* =========================================================
   1. PUZZLE DATA
   ========================================================= */

const PUZZLE = {

    title: "The Daily Crossword",

    difficulty: "Medium",

    rows: 11,

    cols: 11,

    /*
        # = black square
        . = empty square
    */

    layout: [
        "###...#####",
        "###.#######",
        "#.........#",
        "####.######",
        "....#....##",
        "....#....##",
        "....#....##",
        "####.######",
        "#.........#",
        "####.######",
        "###.......#"
    ],

    entries: [

        {
            number: 1,
            row: 0,
            col: 3,
            direction: "across",
            answer: "SUN",
            clue: "Star at the center of our solar system"
        },

        {
            number: 2,
            row: 0,
            col: 3,
            direction: "down",
            answer: "S",
            clue: "The nineteenth letter"
        },

        {
            number: 3,
            row: 2,
            col: 1,
            direction: "across",
            answer: "PUZZLE",
            clue: "A problem designed to test your ingenuity"
        },

        {
            number: 4,
            row: 2,
            col: 1,
            direction: "down",
            answer: "P",
            clue: "Sixteenth letter of the alphabet"
        },

        {
            number: 5,
            row: 2,
            col: 2,
            direction: "down",
            answer: "U",
            clue: "The first vowel after O"
        },

        {
            number: 6,
            row: 2,
            col: 3,
            direction: "down",
            answer: "Z",
            clue: "The final letter of the alphabet"
        },

        {
            number: 7,
            row: 2,
            col: 4,
            direction: "down",
            answer: "Z",
            clue: "A rare letter in English"
        },

        {
            number: 8,
            row: 2,
            col: 5,
            direction: "down",
            answer: "L",
            clue: "Roman numeral for fifty"
        },

        {
            number: 9,
            row: 2,
            col: 6,
            direction: "down",
            answer: "E",
            clue: "The most common letter in English"
        },

        {
            number: 10,
            row: 2,
            col: 7,
            direction: "down",
            answer: "S",
            clue: "Plural-ending letter"
        },

        {
            number: 11,
            row: 2,
            col: 8,
            direction: "down",
            answer: "S",
            clue: "Often found at the end of plural words"
        },

        {
            number: 12,
            row: 4,
            col: 0,
            direction: "across",
            answer: "WORD",
            clue: "A unit of language"
        },

        {
            number: 13,
            row: 4,
            col: 5,
            direction: "across",
            answer: "GAME",
            clue: "Something played for fun"
        },

        {
            number: 14,
            row: 4,
            col: 0,
            direction: "down",
            answer: "W",
            clue: "The twenty-third letter"
        },

        {
            number: 15,
            row: 5,
            col: 0,
            direction: "down",
            answer: "O",
            clue: "A round vowel"
        },

        {
            number: 16,
            row: 6,
            col: 0,
            direction: "down",
            answer: "R",
            clue: "An alphabet letter"
        },

        {
            number: 17,
            row: 7,
            col: 4,
            direction: "down",
            answer: "D",
            clue: "The fourth letter"
        },

        {
            number: 18,
            row: 8,
            col: 1,
            direction: "across",
            answer: "CROSSWORD",
            clue: "A puzzle of intersecting words"
        },

        {
            number: 19,
            row: 8,
            col: 1,
            direction: "down",
            answer: "C",
            clue: "The third letter"
        },

        {
            number: 20,
            row: 8,
            col: 2,
            direction: "down",
            answer: "R",
            clue: "A consonant"
        },

        {
            number: 21,
            row: 8,
            col: 3,
            direction: "down",
            answer: "O",
            clue: "A vowel shaped like a circle"
        },

        {
            number: 22,
            row: 8,
            col: 4,
            direction: "down",
            answer: "S",
            clue: "The nineteenth letter"
        },

        {
            number: 23,
            row: 8,
            col: 5,
            direction: "down",
            answer: "S",
            clue: "A letter used to make plurals"
        },

        {
            number: 24,
            row: 8,
            col: 6,
            direction: "down",
            answer: "W",
            clue: "The twenty-third letter"
        },

        {
            number: 25,
            row: 8,
            col: 7,
            direction: "down",
            answer: "O",
            clue: "A common vowel"
        },

        {
            number: 26,
            row: 8,
            col: 8,
            direction: "down",
            answer: "R",
            clue: "A consonant in the word 'crossword'"
        },

        {
            number: 27,
            row: 8,
            col: 9,
            direction: "down",
            answer: "D",
            clue: "The fourth letter"
        },

        {
            number: 28,
            row: 10,
            col: 3,
            direction: "across",
            answer: "WORDS",
            clue: "Units of language"
        }
    ]
};


/* =========================================================
   2. GAME STATE
   ========================================================= */

const state = {

    grid: [],

    /*
        User-entered letters.

        Example:

        answers[row][col] = "A"
    */

    answers: [],

    selectedRow: null,

    selectedCol: null,

    direction: "across",

    activeEntry: null,

    started: false,

    completed: false,

    elapsedSeconds: 0,

    hintsUsed: 0,

    timerInterval: null,

    saveKey: "crossword-daily-progress-v1"
};


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

const board = document.getElementById("crosswordBoard");

const timerElement = document.getElementById("timer");

const progressText = document.getElementById("progressText");

const progressFill = document.getElementById("progressFill");

const progressBar = document.getElementById("progressBar");

const acrossClues = document.getElementById("acrossClues");

const downClues = document.getElementById("downClues");

const acrossSection = document.getElementById("acrossSection");

const downSection = document.getElementById("downSection");

const acrossTab = document.getElementById("acrossTab");

const downTab = document.getElementById("downTab");

const activeDirection = document.getElementById("activeDirection");

const activeClueNumber = document.getElementById("activeClueNumber");

const activeClueText = document.getElementById("activeClueText");

const acrossCount = document.getElementById("acrossCount");

const downCount = document.getElementById("downCount");

const toastContainer = document.getElementById("toastContainer");

const helpModal = document.getElementById("helpModal");

const completionModal =
    document.getElementById("completionModal");

const finalTime =
    document.getElementById("finalTime");

const finalHints =
    document.getElementById("finalHints");

const finalScore =
    document.getElementById("finalScore");


/* =========================================================
   4. INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", init);

function init() {

    buildGrid();

    buildBoard();

    buildClues();

    setupControls();

    setupKeyboard();

    setupVirtualKeyboard();

    loadProgress();

    updateProgress();

    updateSelection();

    updateTimerDisplay();

    updateTheme();

}


/* =========================================================
   5. BUILD INTERNAL GRID
   ========================================================= */

function buildGrid() {

    state.grid = PUZZLE.layout.map(row => row.split(""));

    state.answers = state.grid.map(row =>
        row.map(cell => cell === "#" ? null : "")
    );

}


/* =========================================================
   6. BUILD BOARD
   ========================================================= */

function buildBoard() {

    board.innerHTML = "";

    board.style.gridTemplateColumns =
        `repeat(${PUZZLE.cols}, var(--cell-size))`;

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            const cell = document.createElement("button");

            cell.type = "button";

            cell.className = "cell";

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.setAttribute("role", "gridcell");

            if (state.grid[row][col] === "#") {

                cell.classList.add("blocked");

                cell.disabled = true;

            } else {

                const number =
                    getCellNumber(row, col);

                if (number !== null) {

                    const numberElement =
                        document.createElement("span");

                    numberElement.className =
                        "cell-number";

                    numberElement.textContent =
                        number;

                    cell.appendChild(numberElement);

                }

                const letter =
                    document.createElement("span");

                letter.className = "cell-letter";

                cell.appendChild(letter);

                cell.addEventListener(
                    "click",
                    () => selectCell(row, col)
                );

            }

            board.appendChild(cell);
        }
    }

    refreshBoard();
}


/* =========================================================
   7. CELL NUMBERING
   ========================================================= */

function getCellNumber(row, col) {

    const entries = PUZZLE.entries.filter(entry =>
        entry.row === row &&
        entry.col === col
    );

    if (!entries.length) {
        return null;
    }

    return Math.min(
        ...entries.map(entry => entry.number)
    );
}


/* =========================================================
   8. GET CELL ELEMENT
   ========================================================= */

function getCell(row, col) {

    return board.querySelector(
        `.cell[data-row="${row}"][data-col="${col}"]`
    );

}


/* =========================================================
   9. REFRESH BOARD
   ========================================================= */

function refreshBoard() {

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            if (state.grid[row][col] === "#") {
                continue;
            }

            const cell = getCell(row, col);

            if (!cell) {
                continue;
            }

            const letterElement =
                cell.querySelector(".cell-letter");

            letterElement.textContent =
                state.answers[row][col] || "";

            cell.classList.remove(
                "correct",
                "incorrect",
                "hint"
            );

            if (
                state.answers[row][col] &&
                isHintCell(row, col)
            ) {
                cell.classList.add("hint");
            }
        }
    }

    updateSelection();

}


/* =========================================================
   10. CELL SELECTION
   ========================================================= */

function selectCell(row, col) {

    if (state.grid[row][col] === "#") {
        return;
    }

    if (
        state.selectedRow === row &&
        state.selectedCol === col
    ) {

        toggleDirection();

        return;
    }

    state.selectedRow = row;

    state.selectedCol = col;

    updateSelection();

    startTimer();

}


/* =========================================================
   11. SELECT ENTRY
   ========================================================= */

function selectEntry(entry) {

    state.activeEntry = entry;

    state.selectedRow = entry.row;

    state.selectedCol = entry.col;

    state.direction = entry.direction;

    updateSelection();

}


/* =========================================================
   12. GET ACTIVE ENTRY
   ========================================================= */

function getActiveEntry() {

    if (
        state.selectedRow === null ||
        state.selectedCol === null
    ) {
        return null;
    }

    let matches = PUZZLE.entries.filter(entry =>
        cellBelongsToEntry(
            state.selectedRow,
            state.selectedCol,
            entry
        )
    );

    if (!matches.length) {
        return null;
    }

    let preferred =
        matches.find(
            entry => entry.direction === state.direction
        );

    if (!preferred) {
        preferred = matches[0];
    }

    return preferred;
}


/* =========================================================
   13. CELL BELONGS TO ENTRY
   ========================================================= */

function cellBelongsToEntry(row, col, entry) {

    for (let i = 0; i < entry.answer.length; i++) {

        const r =
            entry.row +
            (entry.direction === "down" ? i : 0);

        const c =
            entry.col +
            (entry.direction === "across" ? i : 0);

        if (r === row && c === col) {
            return true;
        }
    }

    return false;
}


/* =========================================================
   14. UPDATE SELECTION
   ========================================================= */

function updateSelection() {

    document
        .querySelectorAll(".cell")
        .forEach(cell => {

            cell.classList.remove(
                "selected",
                "word-selected"
            );

        });

    const entry = getActiveEntry();

    if (!entry) {
        return;
    }

    state.activeEntry = entry;

    for (let i = 0; i < entry.answer.length; i++) {

        const row =
            entry.row +
            (entry.direction === "down" ? i : 0);

        const col =
            entry.col +
            (entry.direction === "across" ? i : 0);

        const cell = getCell(row, col);

        if (cell) {
            cell.classList.add("word-selected");
        }
    }

    const selected =
        getCell(
            state.selectedRow,
            state.selectedCol
        );

    if (selected) {
        selected.classList.add("selected");
    }

    updateActiveClue(entry);

}


/* =========================================================
   15. UPDATE ACTIVE CLUE
   ========================================================= */

function updateActiveClue(entry) {

    if (!entry) {

        activeDirection.textContent = "ACROSS";

        activeClueNumber.textContent = "—";

        activeClueText.textContent =
            "Select a square to begin.";

        return;
    }

    activeDirection.textContent =
        entry.direction.toUpperCase();

    activeClueNumber.textContent =
        entry.number;

    activeClueText.textContent =
        entry.clue;

}


/* =========================================================
   16. TOGGLE DIRECTION
   ========================================================= */

function toggleDirection() {

    state.direction =
        state.direction === "across"
            ? "down"
            : "across";

    const entry = getActiveEntry();

    if (entry) {

        state.selectedRow = entry.row;

        state.selectedCol = entry.col;

    }

    updateSelection();

}


/* =========================================================
   17. MOVE THROUGH ENTRY
   ========================================================= */

function moveInDirection(step = 1) {

    const entry = getActiveEntry();

    if (!entry) {
        return;
    }

    const currentIndex =
        getIndexInEntry(
            state.selectedRow,
            state.selectedCol,
            entry
        );

    let nextIndex =
        currentIndex + step;

    if (
        nextIndex < 0 ||
        nextIndex >= entry.answer.length
    ) {
        return;
    }

    state.selectedRow =
        entry.row +
        (
            entry.direction === "down"
                ? nextIndex
                : 0
        );

    state.selectedCol =
        entry.col +
        (
            entry.direction === "across"
                ? nextIndex
                : 0
        );

    updateSelection();

}


/* =========================================================
   18. GET INDEX IN ENTRY
   ========================================================= */

function getIndexInEntry(row, col, entry) {

    if (entry.direction === "across") {

        return col - entry.col;

    }

    return row - entry.row;

}


/* =========================================================
   19. ENTER LETTER
   ========================================================= */

function enterLetter(letter) {

    if (
        state.selectedRow === null ||
        state.selectedCol === null
    ) {
        return;
    }

    if (state.grid[state.selectedRow][state.selectedCol] === "#") {
        return;
    }

    letter = letter.toUpperCase();

    if (!/^[A-Z]$/.test(letter)) {
        return;
    }

    startTimer();

    state.answers[state.selectedRow][state.selectedCol] =
        letter;

    clearCellState(
        state.selectedRow,
        state.selectedCol
    );

    refreshBoard();

    updateProgress();

    saveProgress();

    /*
        Automatically advance after entering
        a letter.
    */

    moveInDirection(1);

    checkForCompletion();

}


/* =========================================================
   20. DELETE LETTER
   ========================================================= */

function deleteLetter() {

    if (
        state.selectedRow === null ||
        state.selectedCol === null
    ) {
        return;
    }

    const row = state.selectedRow;
    const col = state.selectedCol;

    if (state.answers[row][col]) {

        state.answers[row][col] = "";

        clearCellState(row, col);

        refreshBoard();

        updateProgress();

        saveProgress();

        return;
    }

    moveInDirection(-1);

    if (
        state.selectedRow !== null &&
        state.selectedCol !== null
    ) {

        state.answers[
            state.selectedRow
        ][
            state.selectedCol
        ] = "";

        refreshBoard();

        updateProgress();

        saveProgress();
    }

}


/* =========================================================
   21. KEYBOARD INPUT
   ========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            /*
                Don't hijack typing while a modal is open.
            */

            if (
                !helpModal.classList.contains("hidden") ||
                !completionModal.classList.contains("hidden")
            ) {
                return;
            }

            const key = event.key.toUpperCase();

            if (/^[A-Z]$/.test(key)) {

                event.preventDefault();

                enterLetter(key);

                return;
            }

            if (
                event.key === "Backspace" ||
                event.key === "Delete"
            ) {

                event.preventDefault();

                deleteLetter();

                return;
            }

            if (event.key === " ") {

                event.preventDefault();

                toggleDirection();

                return;
            }

            if (event.key === "ArrowRight") {

                event.preventDefault();

                state.direction = "across";

                moveInDirection(1);

                return;
            }

            if (event.key === "ArrowLeft") {

                event.preventDefault();

                state.direction = "across";

                moveInDirection(-1);

                return;
            }

            if (event.key === "ArrowDown") {

                event.preventDefault();

                state.direction = "down";

                moveInDirection(1);

                return;
            }

            if (event.key === "ArrowUp") {

                event.preventDefault();

                state.direction = "down";

                moveInDirection(-1);

                return;
            }
        }
    );

}


/* =========================================================
   22. VIRTUAL KEYBOARD
   ========================================================= */

function setupVirtualKeyboard() {

    const keys =
        document.querySelectorAll(
            "#virtualKeyboard button"
        );

    keys.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const key =
                    button.dataset.key;

                if (key === "BACKSPACE") {

                    deleteLetter();

                    return;
                }

                enterLetter(key);

            }
        );

    });

}


/* =========================================================
   23. BUILD CLUES
   ========================================================= */

function buildClues() {

    acrossClues.innerHTML = "";

    downClues.innerHTML = "";

    const across =
        PUZZLE.entries.filter(
            entry => entry.direction === "across"
        );

    const down =
        PUZZLE.entries.filter(
            entry => entry.direction === "down"
        );

    acrossCount.textContent = across.length;

    downCount.textContent = down.length;

    across.forEach(entry =>
        createClueElement(entry, acrossClues)
    );

    down.forEach(entry =>
        createClueElement(entry, downClues)
    );

}


/* =========================================================
   24. CREATE CLUE ELEMENT
   ========================================================= */

function createClueElement(entry, container) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className = "clue";

    button.dataset.number = entry.number;

    button.dataset.direction =
        entry.direction;

    const number =
        document.createElement("span");

    number.className = "clue-number";

    number.textContent = entry.number;

    const text =
        document.createElement("span");

    text.className = "clue-text";

    text.textContent = entry.clue;

    button.appendChild(number);

    button.appendChild(text);

    button.addEventListener(
        "click",
        () => {

            selectEntry(entry);

            startTimer();

        }
    );

    container.appendChild(button);

}


/* =========================================================
   25. UPDATE CLUE HIGHLIGHTS
   ========================================================= */

function updateClueHighlights() {

    document
        .querySelectorAll(".clue")
        .forEach(clue => {

            clue.classList.remove("active");

            const number =
                Number(clue.dataset.number);

            const direction =
                clue.dataset.direction;

            if (
                state.activeEntry &&
                number === state.activeEntry.number &&
                direction === state.activeEntry.direction
            ) {

                clue.classList.add("active");

            }

            const entry =
                PUZZLE.entries.find(
                    item =>
                        item.number === number &&
                        item.direction === direction
                );

            if (entry && isEntrySolved(entry)) {

                clue.classList.add("solved");

            }

        });

}


/* =========================================================
   26. UPDATE ACTIVE TAB
   ========================================================= */

function updateClueTab() {

    const across =
        state.direction === "across";

    acrossTab.classList.toggle(
        "active",
        across
    );

    downTab.classList.toggle(
        "active",
        !across
    );

    acrossSection.classList.toggle(
        "hidden",
        !across
    );

    downSection.classList.toggle(
        "hidden",
        across
    );

}


/* =========================================================
   27. TAB CONTROLS
   ========================================================= */

acrossTab.addEventListener(
    "click",
    () => {

        state.direction = "across";

        if (state.selectedRow !== null) {
            const entry = getActiveEntry();

            if (entry) {
                selectEntry(entry);
            }
        }

        updateSelection();

    }
);

downTab.addEventListener(
    "click",
    () => {

        state.direction = "down";

        if (state.selectedRow !== null) {
            const entry = getActiveEntry();

            if (entry) {
                selectEntry(entry);
            }
        }

        updateSelection();

    }
);


/* =========================================================
   28. PROGRESS
   ========================================================= */

function updateProgress() {

    let total = 0;

    let filled = 0;

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            if (state.grid[row][col] !== "#") {

                total++;

                if (state.answers[row][col]) {
                    filled++;
                }
            }
        }
    }

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (filled / total) * 100
            );

    progressText.textContent =
        `${percentage}%`;

    progressFill.style.width =
        `${percentage}%`;

    progressBar.setAttribute(
        "aria-valuenow",
        percentage
    );

    updateClueHighlights();

}


/* =========================================================
   29. ENTRY SOLVED
   ========================================================= */

function isEntrySolved(entry) {

    for (
        let i = 0;
        i < entry.answer.length;
        i++
    ) {

        const row =
            entry.row +
            (
                entry.direction === "down"
                    ? i
                    : 0
            );

        const col =
            entry.col +
            (
                entry.direction === "across"
                    ? i
                    : 0
            );

        if (
            state.answers[row][col] !==
            entry.answer[i]
        ) {
            return false;
        }
    }

    return true;
}


/* =========================================================
   30. COMPLETION CHECK
   ========================================================= */

function checkForCompletion() {

    if (state.completed) {
        return;
    }

    for (const entry of PUZZLE.entries) {

        if (!isEntrySolved(entry)) {
            return;
        }
    }

    completePuzzle();

}


/* =========================================================
   31. COMPLETE PUZZLE
   ========================================================= */

function completePuzzle() {

    state.completed = true;

    stopTimer();

    const score =
        Math.max(
            0,
            100 -
            state.hintsUsed * 5
        );

    finalTime.textContent =
        formatTime(state.elapsedSeconds);

    finalHints.textContent =
        state.hintsUsed;

    finalScore.textContent =
        score;

    saveProgress();

    /*
        Add a small celebration.
    */

    celebrate();

    setTimeout(() => {

        completionModal.classList.remove(
            "hidden"
        );

    }, 500);

}


/* =========================================================
   32. CHECK ANSWERS
   ========================================================= */

function checkAnswers() {

    let incorrect = 0;

    let correct = 0;

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            if (state.grid[row][col] === "#") {
                continue;
            }

            const answer =
                state.answers[row][col];

            if (!answer) {
                continue;
            }

            const correctLetter =
                getCorrectLetter(row, col);

            const cell =
                getCell(row, col);

            cell.classList.remove(
                "correct",
                "incorrect"
            );

            if (answer === correctLetter) {

                cell.classList.add("correct");

                correct++;

            } else {

                cell.classList.add("incorrect");

                incorrect++;

            }
        }
    }

    if (incorrect === 0 && correct > 0) {

        showToast(
            "Everything you've entered is correct!",
            "success"
        );

    } else if (incorrect > 0) {

        showToast(
            `${incorrect} ${incorrect === 1 ? "letter is" : "letters are"} incorrect.`,
            "error"
        );

    } else {

        showToast(
            "Enter some letters first.",
            "warning"
        );

    }

}


/* =========================================================
   33. GET CORRECT LETTER
   ========================================================= */

function getCorrectLetter(row, col) {

    for (const entry of PUZZLE.entries) {

        if (
            cellBelongsToEntry(
                row,
                col,
                entry
            )
        ) {

            const index =
                getIndexInEntry(
                    row,
                    col,
                    entry
                );

            return entry.answer[index];

        }
    }

    return "";
}


/* =========================================================
   34. HINT
   ========================================================= */

function useHint() {

    if (
        state.selectedRow === null ||
        state.selectedCol === null
    ) {

        showToast(
            "Select a square first.",
            "warning"
        );

        return;
    }

    const row = state.selectedRow;

    const col = state.selectedCol;

    const correct =
        getCorrectLetter(row, col);

    if (!correct) {
        return;
    }

    if (
        state.answers[row][col] === correct
    ) {

        showToast(
            "That letter is already correct.",
            "success"
        );

        return;
    }

    state.answers[row][col] = correct;

    state.hintsUsed++;

    const cell = getCell(row, col);

    cell.classList.add("hint");

    refreshBoard();

    updateProgress();

    saveProgress();

    showToast(
        `Hint used — the letter is ${correct}.`,
        "success"
    );

    checkForCompletion();

}


/* =========================================================
   35. CLEAR PUZZLE
   ========================================================= */

function clearPuzzle() {

    const confirmed =
        window.confirm(
            "Clear every letter from the puzzle?"
        );

    if (!confirmed) {
        return;
    }

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            if (state.grid[row][col] !== "#") {

                state.answers[row][col] = "";

            }
        }
    }

    state.hintsUsed = 0;

    state.completed = false;

    refreshBoard();

    updateProgress();

    saveProgress();

    showToast(
        "Puzzle cleared.",
        "success"
    );

}


/* =========================================================
   36. RESTART
   ========================================================= */

function restartPuzzle() {

    const confirmed =
        window.confirm(
            "Restart the puzzle from the beginning?"
        );

    if (!confirmed) {
        return;
    }

    clearSavedProgress();

    state.elapsedSeconds = 0;

    state.hintsUsed = 0;

    state.completed = false;

    state.started = false;

    stopTimer();

    buildGrid();

    refreshBoard();

    updateProgress();

    updateTimerDisplay();

    showToast(
        "Fresh start!",
        "success"
    );

}


/* =========================================================
   37. TIMER
   ========================================================= */

function startTimer() {

    if (state.completed) {
        return;
    }

    if (state.started) {
        return;
    }

    state.started = true;

    state.timerInterval =
        setInterval(() => {

            state.elapsedSeconds++;

            updateTimerDisplay();

            /*
                Save every 10 seconds.
            */

            if (
                state.elapsedSeconds % 10 === 0
            ) {
                saveProgress();
            }

        }, 1000);

}


function stopTimer() {

    if (state.timerInterval) {

        clearInterval(
            state.timerInterval
        );

        state.timerInterval = null;

    }

}


function updateTimerDisplay() {

    timerElement.textContent =
        formatTime(
            state.elapsedSeconds
        );

}


function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );

}


/* =========================================================
   38. SAVE PROGRESS
   ========================================================= */

function saveProgress() {

    const data = {

        answers: state.answers,

        elapsedSeconds:
            state.elapsedSeconds,

        hintsUsed:
            state.hintsUsed,

        completed:
            state.completed

    };

    try {

        localStorage.setItem(
            state.saveKey,
            JSON.stringify(data)
        );

    } catch (error) {

        console.warn(
            "Unable to save progress.",
            error
        );

    }

}


/* =========================================================
   39. LOAD PROGRESS
   ========================================================= */

function loadProgress() {

    try {

        const saved =
            localStorage.getItem(
                state.saveKey
            );

        if (!saved) {
            return;
        }

        const data =
            JSON.parse(saved);

        if (
            Array.isArray(data.answers)
        ) {

            state.answers =
                data.answers;

        }

        state.elapsedSeconds =
            Number(
                data.elapsedSeconds || 0
            );

        state.hintsUsed =
            Number(
                data.hintsUsed || 0
            );

        state.completed =
            Boolean(data.completed);

        if (!state.completed) {

            /*
                Start the timer if the player
                already has progress.
            */

            const hasProgress =
                state.answers.some(
                    row =>
                        row.some(
                            cell => Boolean(cell)
                        )
                );

            if (hasProgress) {
                startTimer();
            }

        }

        refreshBoard();

    } catch (error) {

        console.warn(
            "Unable to load saved progress.",
            error
        );

    }

}


/* =========================================================
   40. CLEAR SAVED PROGRESS
   ========================================================= */

function clearSavedProgress() {

    try {

        localStorage.removeItem(
            state.saveKey
        );

    } catch (error) {

        console.warn(
            "Unable to clear saved progress.",
            error
        );

    }

}


/* =========================================================
   41. HINT CELL TRACKING
   ========================================================= */

const hintCells = new Set();


function isHintCell(row, col) {

    return hintCells.has(
        `${row}:${col}`
    );

}


/* =========================================================
   42. CLEAR CELL STATE
   ========================================================= */

function clearCellState(row, col) {

    const cell =
        getCell(row, col);

    if (!cell) {
        return;
    }

    cell.classList.remove(
        "correct",
        "incorrect"
    );

}


/* =========================================================
   43. TOAST
   ========================================================= */

function showToast(message, type = "") {

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`.trim();

    toast.textContent =
        message;

    toastContainer.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3200);

}


/* =========================================================
   44. CELEBRATION
   ========================================================= */

function celebrate() {

    const colors = [
        "#6658e8",
        "#21a879",
        "#e69a28",
        "#e45454",
        "#8a7dff"
    ];

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("div");

        particle.style.position =
            "fixed";

        particle.style.zIndex =
            "3000";

        particle.style.width =
            "7px";

        particle.style.height =
            "7px";

        particle.style.borderRadius =
            "2px";

        particle.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        particle.style.left =
            `${50 + (Math.random() - 0.5) * 30}%`;

        particle.style.top =
            `${35 + Math.random() * 10}%`;

        particle.style.pointerEvents =
            "none";

        document.body.appendChild(
            particle
        );

        const x =
            (Math.random() - 0.5) *
            600;

        const y =
            300 +
            Math.random() * 300;

        const rotation =
            Math.random() * 720;

        particle.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    900 +
                    Math.random() * 700,

                easing:
                    "cubic-bezier(.2,.8,.3,1)"
            }
        ).onfinish = () =>
            particle.remove();

    }

}


/* =========================================================
   45. MODALS
   ========================================================= */

function openModal(modal) {

    modal.classList.remove("hidden");

}


function closeModal(modal) {

    modal.classList.add("hidden");

}


/* =========================================================
   46. BUTTON CONTROLS
   ========================================================= */

function setupControls() {

    document
        .getElementById("checkButton")
        .addEventListener(
            "click",
            checkAnswers
        );

    document
        .getElementById("hintButton")
        .addEventListener(
            "click",
            useHint
        );

    document
        .getElementById("clearButton")
        .addEventListener(
            "click",
            clearPuzzle
        );

    document
        .getElementById("restartButton")
        .addEventListener(
            "click",
            restartPuzzle
        );


    /*
        Help
    */

    document
        .getElementById("helpButton")
        .addEventListener(
            "click",
            () => openModal(helpModal)
        );

    document
        .getElementById("closeHelpButton")
        .addEventListener(
            "click",
            () => closeModal(helpModal)
        );

    document
        .getElementById("gotItButton")
        .addEventListener(
            "click",
            () => closeModal(helpModal)
        );


    /*
        Completion
    */

    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => closeModal(completionModal)
        );


    /*
        Theme
    */

    document
        .getElementById("themeButton")
        .addEventListener(
            "click",
            toggleTheme
        );


    /*
        About
    */

    document
        .getElementById("aboutButton")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "A handcrafted daily crossword.",
                    "success"
                );

            }
        );


    /*
        Settings
    */

    document
        .getElementById("settingsButton")
        .addEventListener(
            "click",
            () => {

                showToast(
                    "More settings coming soon.",
                    "warning"
                );

            }
        );


    /*
        Close modals by clicking outside.
    */

    document.addEventListener(
        "click",
        event => {

            if (
                event.target === helpModal
            ) {
                closeModal(helpModal);
            }

            if (
                event.target === completionModal
            ) {
                closeModal(completionModal);
            }

        }
    );


    /*
        Escape closes modals.
    */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeModal(helpModal);

            closeModal(completionModal);

        }
    );

}


/* =========================================================
   47. THEME
   ========================================================= */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "crossword-theme",
        dark ? "dark" : "light"
    );

}


function updateTheme() {

    const saved =
        localStorage.getItem(
            "crossword-theme"
        );

    if (saved === "dark") {

        document.body.classList.add("dark");

    }

}


/* =========================================================
   48. PATCH SELECTION UI
   ========================================================= */

/*
    updateSelection() also updates the clue tabs.
*/

const originalUpdateSelection =
    updateSelection;

updateSelection = function () {

    originalUpdateSelection();

    updateClueHighlights();

    updateClueTab();

};


/* =========================================================
   49. INITIAL SELECT
   ========================================================= */

/*
    Pick the first playable cell so the player
    can immediately start typing.
*/

function selectFirstCell() {

    for (let row = 0; row < PUZZLE.rows; row++) {

        for (let col = 0; col < PUZZLE.cols; col++) {

            if (
                state.grid[row][col] !== "#"
            ) {

                state.selectedRow = row;

                state.selectedCol = col;

                state.direction = "across";

                updateSelection();

                return;

            }

        }

    }

}


/*
    Start with a useful selection after
    the page has loaded.
*/

setTimeout(
    selectFirstCell,
    50
);

