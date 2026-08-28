/* =========================================================
   WORD HUNT
   CLASSIC WORD SEARCH
   script.js
   ========================================================= */


/* =========================================================
   1. GAME DATA
   ========================================================= */

const LEVELS = [

    {
        category: "Animals",
        description: "Find the hidden animals.",
        difficulty: "Easy",
        size: 8,
        words: [
            "CAT",
            "DOG",
            "LION",
            "BEAR",
            "FISH"
        ]
    },

    {
        category: "Nature",
        description: "Explore the natural world.",
        difficulty: "Easy",
        size: 8,
        words: [
            "TREE",
            "RIVER",
            "CLOUD",
            "RAIN",
            "LEAF"
        ]
    },

    {
        category: "Food",
        description: "Find something delicious.",
        difficulty: "Easy",
        size: 8,
        words: [
            "APPLE",
            "PIZZA",
            "BREAD",
            "CAKE",
            "RICE"
        ]
    },

    {
        category: "Space",
        description: "Search the universe.",
        difficulty: "Easy",
        size: 9,
        words: [
            "MOON",
            "STAR",
            "MARS",
            "COMET",
            "EARTH",
            "SUN"
        ]
    },

    {
        category: "Ocean",
        description: "Dive beneath the waves.",
        difficulty: "Easy",
        size: 9,
        words: [
            "WHALE",
            "SHARK",
            "CORAL",
            "WAVE",
            "SHELL",
            "FISH"
        ]
    },

    {
        category: "Animals",
        description: "The animals get trickier.",
        difficulty: "Medium",
        size: 10,
        words: [
            "TIGER",
            "HORSE",
            "ZEBRA",
            "MONKEY",
            "RABBIT",
            "MOUSE",
            "PANDA"
        ]
    },

    {
        category: "Travel",
        description: "Pack your bags and search.",
        difficulty: "Medium",
        size: 10,
        words: [
            "TRAIN",
            "PLANE",
            "HOTEL",
            "BEACH",
            "TRAVEL",
            "TICKET",
            "MAP"
        ]
    },

    {
        category: "Weather",
        description: "What is hiding in the forecast?",
        difficulty: "Medium",
        size: 10,
        words: [
            "STORM",
            "SUNNY",
            "WIND",
            "RAIN",
            "SNOW",
            "CLOUD",
            "THUNDER"
        ]
    },

    {
        category: "Garden",
        description: "Search among the plants.",
        difficulty: "Medium",
        size: 10,
        words: [
            "FLOWER",
            "GARDEN",
            "ROSE",
            "GRASS",
            "ROOT",
            "SEED",
            "PLANT"
        ]
    },

    {
        category: "Science",
        description: "Put your brain to work.",
        difficulty: "Medium",
        size: 10,
        words: [
            "ATOM",
            "ENERGY",
            "CELL",
            "FORCE",
            "LIGHT",
            "SPACE",
            "MATTER"
        ]
    },

    {
        category: "Animals",
        description: "A tougher animal hunt.",
        difficulty: "Hard",
        size: 12,
        words: [
            "ELEPHANT",
            "GIRAFFE",
            "CHEETAH",
            "GORILLA",
            "DOLPHIN",
            "PENGUIN",
            "KANGAROO",
            "LEOPARD"
        ]
    },

    {
        category: "Geography",
        description: "Explore the world from your screen.",
        difficulty: "Hard",
        size: 12,
        words: [
            "AFRICA",
            "EUROPE",
            "ASIA",
            "AMERICA",
            "ISLAND",
            "DESERT",
            "MOUNTAIN",
            "VALLEY"
        ]
    },

    {
        category: "Space",
        description: "The galaxy hides its secrets.",
        difficulty: "Hard",
        size: 12,
        words: [
            "PLANET",
            "GALAXY",
            "NEBULA",
            "ROCKET",
            "ASTEROID",
            "ORBIT",
            "SATURN",
            "JUPITER"
        ]
    },

    {
        category: "Food",
        description: "A feast of hidden words.",
        difficulty: "Hard",
        size: 12,
        words: [
            "CHOCOLATE",
            "SANDWICH",
            "NOODLES",
            "CHEESE",
            "BANANA",
            "ORANGE",
            "COOKIE",
            "DINNER"
        ]
    },

    {
        category: "Adventure",
        description: "Can you find them all?",
        difficulty: "Hard",
        size: 12,
        words: [
            "ADVENTURE",
            "JOURNEY",
            "FOREST",
            "TREASURE",
            "COMPASS",
            "CAMPING",
            "EXPLORER",
            "ISLAND"
        ]
    },

    {
        category: "Technology",
        description: "Enter the digital world.",
        difficulty: "Expert",
        size: 13,
        words: [
            "COMPUTER",
            "KEYBOARD",
            "INTERNET",
            "SOFTWARE",
            "SCREEN",
            "CODING",
            "NETWORK",
            "ROBOT",
            "DIGITAL"
        ]
    },

    {
        category: "Nature",
        description: "The forest is full of secrets.",
        difficulty: "Expert",
        size: 13,
        words: [
            "MOUNTAIN",
            "FOREST",
            "WATERFALL",
            "THUNDER",
            "SUNLIGHT",
            "WILDLIFE",
            "MEADOW",
            "RIVER",
            "BLOSSOM"
        ]
    },

    {
        category: "History",
        description: "Search through the past.",
        difficulty: "Expert",
        size: 13,
        words: [
            "CASTLE",
            "KINGDOM",
            "EMPIRE",
            "ANCIENT",
            "WARRIOR",
            "QUEEN",
            "KNIGHT",
            "TEMPLE",
            "CROWN"
        ]
    },

    {
        category: "Ocean",
        description: "The deep sea gets difficult.",
        difficulty: "Expert",
        size: 13,
        words: [
            "OCTOPUS",
            "JELLYFISH",
            "SEAHORSE",
            "DOLPHIN",
            "WHALE",
            "CORAL",
            "SUBMARINE",
            "OCEAN",
            "TURTLE"
        ]
    },

    {
        category: "Words",
        description: "A serious test of observation.",
        difficulty: "Expert",
        size: 13,
        words: [
            "PUZZLE",
            "SEARCH",
            "LETTER",
            "HIDDEN",
            "SECRET",
            "CHALLENGE",
            "BRAIN",
            "FOCUS",
            "SOLVE"
        ]
    },

    {
        category: "Animals",
        description: "Only sharp eyes will win.",
        difficulty: "Master",
        size: 15,
        words: [
            "CROCODILE",
            "RHINOCEROS",
            "HIPPOPOTAMUS",
            "CHIMPANZEE",
            "BUTTERFLY",
            "FLAMINGO",
            "ELEPHANT",
            "GIRAFFE",
            "PENGUIN",
            "CHEETAH"
        ]
    },

    {
        category: "World",
        description: "Travel the world through letters.",
        difficulty: "Master",
        size: 15,
        words: [
            "AFRICA",
            "EUROPE",
            "AUSTRALIA",
            "AMERICA",
            "CANADA",
            "BRAZIL",
            "EGYPT",
            "JAPAN",
            "INDIA",
            "KENYA"
        ]
    },

    {
        category: "Science",
        description: "A laboratory of letters.",
        difficulty: "Master",
        size: 15,
        words: [
            "MOLECULE",
            "ELECTRON",
            "PROTON",
            "GRAVITY",
            "MAGNETIC",
            "CHEMISTRY",
            "BIOLOGY",
            "PHYSICS",
            "ENERGY",
            "ATOM"
        ]
    },

    {
        category: "Adventure",
        description: "The ultimate expedition.",
        difficulty: "Master",
        size: 15,
        words: [
            "EXPLORER",
            "MOUNTAIN",
            "TREASURE",
            "COMPASS",
            "JOURNEY",
            "ADVENTURE",
            "WILDERNESS",
            "DISCOVERY",
            "CAMPFIRE",
            "EXPEDITION"
        ]
    },

    {
        category: "Space",
        description: "Beyond the stars.",
        difficulty: "Master",
        size: 15,
        words: [
            "ASTRONAUT",
            "SPACECRAFT",
            "SUPERNOVA",
            "GALAXY",
            "UNIVERSE",
            "ASTEROID",
            "SATELLITE",
            "TELESCOPE",
            "NEBULA",
            "METEOR"
        ]
    },

    {
        category: "Nature",
        description: "Nature's hardest puzzle.",
        difficulty: "Master",
        size: 15,
        words: [
            "WATERFALL",
            "RAINFOREST",
            "MOUNTAINEER",
            "WILDERNESS",
            "ECOSYSTEM",
            "SUNFLOWER",
            "BUTTERFLY",
            "EVERGREEN",
            "RIVERBANK",
            "LANDSCAPE"
        ]
    },

    {
        category: "Technology",
        description: "Welcome to the future.",
        difficulty: "Master",
        size: 15,
        words: [
            "ARTIFICIAL",
            "INTELLIGENCE",
            "ALGORITHM",
            "PROGRAMMING",
            "DATABASE",
            "PROCESSOR",
            "SMARTPHONE",
            "CYBERSPACE",
            "SOFTWARE",
            "ROBOTICS"
        ]
    },

    {
        category: "Food",
        description: "The ultimate food hunt.",
        difficulty: "Master",
        size: 15,
        words: [
            "STRAWBERRY",
            "WATERMELON",
            "PINEAPPLE",
            "CHOCOLATE",
            "SPAGHETTI",
            "HAMBURGER",
            "PANCAKES",
            "AVOCADO",
            "BLUEBERRY",
            "CUPCAKE"
        ]
    },

    {
        category: "Mixed",
        description: "Everything is fair game.",
        difficulty: "Master",
        size: 16,
        words: [
            "ELEPHANT",
            "ROCKET",
            "CHOCOLATE",
            "MOUNTAIN",
            "COMPUTER",
            "OCEAN",
            "TREASURE",
            "BUTTERFLY",
            "ADVENTURE",
            "GALAXY",
            "CASTLE",
            "JOURNEY"
        ]
    },

    {
        category: "Ultimate",
        description: "The final challenge.",
        difficulty: "Legend",
        size: 17,
        words: [
            "EXPLORATION",
            "CHALLENGE",
            "ADVENTURE",
            "DISCOVERY",
            "WILDERNESS",
            "ASTRONAUT",
            "BUTTERFLY",
            "ELEPHANT",
            "TECHNOLOGY",
            "CHOCOLATE",
            "MOUNTAINEER",
            "SUPERNOVA"
        ]
    }

];


/* =========================================================
   2. DIRECTIONS
   ========================================================= */

const DIRECTIONS = [

    [-1, -1],
    [-1, 0],
    [-1, 1],

    [0, -1],
    [0, 1],

    [1, -1],
    [1, 0],
    [1, 1]

];


/* =========================================================
   3. DOM REFERENCES
   ========================================================= */

const gridElement =
    document.getElementById("wordGrid");

const wordListElement =
    document.getElementById("wordList");

const levelNumberElement =
    document.getElementById("levelNumber");

const currentLevelElement =
    document.getElementById("currentLevel");

const levelsCompletedElement =
    document.getElementById("levelsCompleted");

const levelCountElement =
    document.getElementById("levelCount");

const levelMapElement =
    document.getElementById("levelMap");

const categoryTitleElement =
    document.getElementById("categoryTitle");

const categoryDescriptionElement =
    document.getElementById("categoryDescription");

const difficultyTextElement =
    document.getElementById("difficultyText");

const difficultyDotElement =
    document.getElementById("difficultyDot");

const timerElement =
    document.getElementById("timer");

const streakElement =
    document.getElementById("streak");

const wordsCounterElement =
    document.getElementById("wordsCounter");

const wordsProgressFillElement =
    document.getElementById("wordsProgressFill");

const levelProgressFillElement =
    document.getElementById("levelProgressFill");

const levelProgressBarElement =
    document.getElementById("levelProgressBar");

const gameTipElement =
    document.getElementById("gameTip");

const themeButton =
    document.getElementById("themeButton");

const helpButton =
    document.getElementById("helpButton");

const closeHelpButton =
    document.getElementById("closeHelpButton");

const gotItButton =
    document.getElementById("gotItButton");

const hintButton =
    document.getElementById("hintButton");

const shuffleButton =
    document.getElementById("shuffleButton");

const pauseButton =
    document.getElementById("pauseButton");

const restartButton =
    document.getElementById("restartButton");

const resumeButton =
    document.getElementById("resumeButton");

const pauseModal =
    document.getElementById("pauseModal");

const helpModal =
    document.getElementById("helpModal");

const completeModal =
    document.getElementById("completeModal");

const finalModal =
    document.getElementById("finalModal");

const retryLevelButton =
    document.getElementById("retryLevelButton");

const nextLevelButton =
    document.getElementById("nextLevelButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const completeTimeElement =
    document.getElementById("completeTime");

const completeWordsElement =
    document.getElementById("completeWords");

const completeScoreElement =
    document.getElementById("completeScore");

const finalLevelsElement =
    document.getElementById("finalLevels");

const finalWordsElement =
    document.getElementById("finalWords");

const finalScoreElement =
    document.getElementById("finalScore");

const toastContainer =
    document.getElementById("toastContainer");

const virtualKeyboard =
    document.getElementById("virtualKeyboard");


/* =========================================================
   4. GAME STATE
   ========================================================= */

let currentLevelIndex = 0;

let grid = [];

let placedWords = {};

let foundWords = new Set();

let selection = [];

let isSelecting = false;

let startCell = null;

let currentCell = null;

let timerSeconds = 0;

let timerInterval = null;

let gamePaused = false;

let gameStarted = false;

let score = 0;

let streak = 0;

let totalWordsFound = 0;

let hintsUsed = 0;

let completedLevels = loadCompletedLevels();

let bestTimes = loadBestTimes();


/* =========================================================
   5. STORAGE
   ========================================================= */

function loadCompletedLevels() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "wordHuntCompletedLevels"
            )
        ) || [];

    } catch {

        return [];

    }

}


function loadBestTimes() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "wordHuntBestTimes"
            )
        ) || {};

    } catch {

        return {};

    }

}


function saveProgress() {

    localStorage.setItem(
        "wordHuntCompletedLevels",
        JSON.stringify(completedLevels)
    );

    localStorage.setItem(
        "wordHuntBestTimes",
        JSON.stringify(bestTimes)
    );

}


/* =========================================================
   6. UTILITY FUNCTIONS
   ========================================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function randomLetter() {

    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return randomItem(
        letters.split("")
    );

}


function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   7. CREATE EMPTY GRID
   ========================================================= */

function createEmptyGrid(size) {

    return Array.from(
        { length: size },
        () =>
            Array.from(
                { length: size },
                () => null
            )
    );

}


/* =========================================================
   8. CHECK WORD PLACEMENT
   ========================================================= */

function canPlaceWord(
    board,
    word,
    row,
    col,
    direction
) {

    const size = board.length;

    const [dr, dc] = direction;

    for (
        let i = 0;
        i < word.length;
        i++
    ) {

        const r =
            row + dr * i;

        const c =
            col + dc * i;


        if (
            r < 0 ||
            r >= size ||
            c < 0 ||
            c >= size
        ) {

            return false;

        }


        const existing =
            board[r][c];


        if (
            existing !== null &&
            existing !== word[i]
        ) {

            return false;

        }

    }

    return true;

}


/* =========================================================
   9. PLACE WORD
   ========================================================= */

function placeWord(
    board,
    word,
    row,
    col,
    direction
) {

    const [dr, dc] = direction;

    const cells = [];

    for (
        let i = 0;
        i < word.length;
        i++
    ) {

        const r =
            row + dr * i;

        const c =
            col + dc * i;

        board[r][c] = word[i];

        cells.push({
            row: r,
            col: c
        });

    }

    return cells;

}


/* =========================================================
   10. GENERATE PUZZLE
   ========================================================= */

function generatePuzzle(level) {

    const size = level.size;

    const board =
        createEmptyGrid(size);

    const words =
        [...level.words]
            .map(word => word.toUpperCase())
            .sort(
                (a, b) =>
                    b.length - a.length
            );

    const placements = {};

    for (const word of words) {

        let placed = false;

        /*
         * More attempts are allowed for
         * larger/harder boards.
         */

        for (
            let attempt = 0;
            attempt < 1200;
            attempt++
        ) {

            const direction =
                randomItem(DIRECTIONS);

            const row =
                Math.floor(
                    Math.random() * size
                );

            const col =
                Math.floor(
                    Math.random() * size
                );


            if (
                canPlaceWord(
                    board,
                    word,
                    row,
                    col,
                    direction
                )
            ) {

                const cells =
                    placeWord(
                        board,
                        word,
                        row,
                        col,
                        direction
                    );

                placements[word] = {
                    word,
                    cells,
                    direction
                };

                placed = true;

                break;

            }

        }


        /*
         * If a very difficult word cannot
         * be placed, try again with a fresh
         * board rather than producing a
         * broken puzzle.
         */

        if (!placed) {

            return generatePuzzle(level);

        }

    }


    /*
     * Fill remaining spaces with
     * random letters.
     */

    for (let r = 0; r < size; r++) {

        for (let c = 0; c < size; c++) {

            if (board[r][c] === null) {

                board[r][c] =
                    randomLetter();

            }

        }

    }


    return {
        board,
        placements
    };

}


/* =========================================================
   11. RENDER GRID
   ========================================================= */

function renderGrid() {

    const size = grid.length;

    gridElement.innerHTML = "";

    gridElement.style.gridTemplateColumns =
        `repeat(${size}, 1fr)`;


    grid.forEach(
        (row, rowIndex) => {

            row.forEach(
                (letter, colIndex) => {

                    const cell =
                        document.createElement("button");

                    cell.type = "button";

                    cell.className =
                        "grid-letter";

                    cell.textContent =
                        letter;

                    cell.dataset.row =
                        rowIndex;

                    cell.dataset.col =
                        colIndex;

                    cell.setAttribute(
                        "role",
                        "gridcell"
                    );

                    cell.setAttribute(
                        "aria-label",
                        `Row ${rowIndex + 1}, Column ${colIndex + 1}, ${letter}`
                    );

                    gridElement.appendChild(cell);

                }
            );

        }
    );

}


/* =========================================================
   12. RENDER WORD LIST
   ========================================================= */

function renderWordList(words) {

    wordListElement.innerHTML = "";

    words.forEach(word => {

        const item =
            document.createElement("div");

        item.className =
            "word-item";

        item.dataset.word =
            word;

        if (foundWords.has(word)) {

            item.classList.add("found");

        }


        const check =
            document.createElement("span");

        check.className =
            "word-check";

        check.textContent = "✓";


        const text =
            document.createElement("span");

        text.className =
            "word-text";

        text.textContent =
            word;


        item.appendChild(check);

        item.appendChild(text);

        wordListElement.appendChild(item);

    });


    updateWordProgress();

}


/* =========================================================
   13. RENDER LEVEL MAP
   ========================================================= */

function renderLevelMap() {

    levelMapElement.innerHTML = "";

    LEVELS.forEach(
        (level, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "level-button";

            button.dataset.level =
                index;


            const unlocked =
                index === 0 ||
                completedLevels.includes(
                    index - 1
                );

            const completed =
                completedLevels.includes(index);


            if (!unlocked) {

                button.classList.add("locked");

                button.disabled = true;

            }


            if (completed) {

                button.classList.add(
                    "completed"
                );

            }


            if (
                index === currentLevelIndex
            ) {

                button.classList.add(
                    "current"
                );

            }


            button.textContent =
                index + 1;


            button.addEventListener(
                "click",
                () => {

                    if (unlocked) {

                        loadLevel(index);

                    }

                }
            );


            levelMapElement.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   14. UPDATE UI
   ========================================================= */

function updateLevelUI() {

    const level =
        LEVELS[currentLevelIndex];


    const number =
        currentLevelIndex + 1;


    levelNumberElement.textContent =
        number;

    currentLevelElement.textContent =
        number;

    categoryTitleElement.textContent =
        level.category;

    categoryDescriptionElement.textContent =
        level.description;

    difficultyTextElement.textContent =
        level.difficulty;

    levelCountElement.textContent =
        `${number} / ${LEVELS.length}`;


    const progress =
        (
            currentLevelIndex /
            (LEVELS.length - 1)
        ) * 100;


    levelProgressFillElement.style.width =
        `${progress}%`;

    levelProgressBarElement.setAttribute(
        "aria-valuenow",
        Math.round(progress)
    );


    levelsCompletedElement.textContent =
        completedLevels.length;


    const colors = {

        Easy: "var(--green)",

        Medium: "var(--gold)",

        Hard: "#d47a3c",

        Expert: "#a15db7",

        Master: "#c55b72",

        Legend: "#8b5fc7"

    };


    difficultyDotElement.style.background =
        colors[level.difficulty] ||
        "var(--primary)";


    renderLevelMap();

}


/* =========================================================
   15. WORD PROGRESS
   ========================================================= */

function updateWordProgress() {

    const total =
        Object.keys(placedWords).length;

    const found =
        foundWords.size;


    wordsCounterElement.textContent =
        `${found} / ${total}`;


    const percentage =
        total === 0
            ? 0
            : (found / total) * 100;


    wordsProgressFillElement.style.width =
        `${percentage}%`;

}


/* =========================================================
   16. LOAD LEVEL
   ========================================================= */

function loadLevel(index) {

    if (
        index < 0 ||
        index >= LEVELS.length
    ) {

        return;

    }


    const unlocked =
        index === 0 ||
        completedLevels.includes(
            index - 1
        );


    if (!unlocked) {

        showToast(
            "Complete the previous level first.",
            "warning"
        );

        return;

    }


    stopTimer();


    currentLevelIndex =
        index;

    foundWords =
        new Set();

    selection = [];

    startCell = null;

    currentCell = null;

    isSelecting = false;

    gamePaused = false;

    score = 0;

    hintsUsed = 0;

    timerSeconds = 0;


    const puzzle =
        generatePuzzle(
            LEVELS[index]
        );


    grid =
        puzzle.board;

    placedWords =
        puzzle.placements;


    updateLevelUI();

    renderGrid();

    renderWordList(
        LEVELS[index].words
            .map(word => word.toUpperCase())
    );

    clearSelection();

    updateTimerUI();

    startTimer();

    gameStarted = true;

}


/* =========================================================
   17. TIMER
   ========================================================= */

function startTimer() {

    stopTimer();

    if (gamePaused) {

        return;

    }


    timerInterval =
        setInterval(
            () => {

                if (!gamePaused) {

                    timerSeconds++;

                    updateTimerUI();

                }

            },
            1000
        );

}


function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}


function updateTimerUI() {

    timerElement.textContent =
        formatTime(timerSeconds);

}


/* =========================================================
   18. CELL LOOKUP
   ========================================================= */

function getCellElement(row, col) {

    return gridElement.querySelector(
        `.grid-letter[data-row="${row}"][data-col="${col}"]`
    );

}


/* =========================================================
   19. SELECTION
   ========================================================= */

function getLineCells(
    start,
    end
) {

    if (!start || !end) {

        return [];

    }


    const rowDiff =
        end.row - start.row;

    const colDiff =
        end.col - start.col;


    /*
     * Selection must be straight:
     * horizontal, vertical or diagonal.
     */

    const rowDirection =
        Math.sign(rowDiff);

    const colDirection =
        Math.sign(colDiff);


    if (
        rowDiff !== 0 &&
        colDiff !== 0 &&
        Math.abs(rowDiff) !==
            Math.abs(colDiff)
    ) {

        return [];

    }


    const length =
        Math.max(
            Math.abs(rowDiff),
            Math.abs(colDiff)
        ) + 1;


    const cells = [];


    for (
        let i = 0;
        i < length;
        i++
    ) {

        cells.push({

            row:
                start.row +
                rowDirection * i,

            col:
                start.col +
                colDirection * i

        });

    }


    return cells;

}


function clearSelection() {

    document
        .querySelectorAll(
            ".grid-letter.selecting"
        )
        .forEach(
            cell =>
                cell.classList.remove(
                    "selecting"
                )
        );

    selection = [];

}


function displaySelection(cells) {

    document
        .querySelectorAll(
            ".grid-letter.selecting"
        )
        .forEach(
            cell =>
                cell.classList.remove(
                    "selecting"
                )
        );


    cells.forEach(
        cellData => {

            const cell =
                getCellElement(
                    cellData.row,
                    cellData.col
                );

            if (cell) {

                cell.classList.add(
                    "selecting"
                );

            }

        }
    );


    selection = cells;

}


/* =========================================================
   20. GET SELECTED WORD
   ========================================================= */

function getSelectedWord(cells) {

    return cells
        .map(
            ({ row, col }) =>
                grid[row][col]
        )
        .join("");

}


/* =========================================================
   21. CHECK SELECTION
   ========================================================= */

function checkSelection() {

    if (selection.length < 2) {

        clearSelection();

        return;

    }


    const selected =
        getSelectedWord(selection);


    const reversed =
        selected
            .split("")
            .reverse()
            .join("");


    let matchedWord = null;


    for (const word of Object.keys(placedWords)) {

        if (
            !foundWords.has(word) &&
            (
                word === selected ||
                word === reversed
            )
        ) {

            matchedWord = word;

            break;

        }

    }


    if (matchedWord) {

        markWordFound(
            matchedWord
        );

    } else {

        streak = 0;

        updateStreak();

        showToast(
            "Not a hidden word.",
            "error"
        );

    }


    clearSelection();

}


/* =========================================================
   22. MARK WORD FOUND
   ========================================================= */

function markWordFound(word) {

    if (foundWords.has(word)) {

        return;

    }


    foundWords.add(word);

    totalWordsFound++;

    streak++;

    const basePoints =
        word.length * 10;

    const streakBonus =
        Math.min(
            streak * 5,
            50
        );

    const speedBonus =
        Math.max(
            0,
            100 -
            timerSeconds
        );


    score +=
        basePoints +
        streakBonus +
        Math.floor(
            speedBonus / 5
        );


    const placement =
        placedWords[word];


    if (placement) {

        placement.cells.forEach(
            ({ row, col }) => {

                const cell =
                    getCellElement(
                        row,
                        col
                    );

                if (cell) {

                    cell.classList.add(
                        "found"
                    );

                }

            }
        );

    }


    const item =
        wordListElement.querySelector(
            `[data-word="${word}"]`
        );


    if (item) {

        item.classList.add("found");

    }


    updateWordProgress();

    updateStreak();


    showToast(
        `${word} found! +${basePoints} points`,
        "success"
    );


    if (
        foundWords.size ===
        Object.keys(placedWords).length
    ) {

        finishLevel();

    }

}


/* =========================================================
   23. STREAK
   ========================================================= */

function updateStreak() {

    streakElement.textContent =
        streak;

}


/* =========================================================
   24. MOUSE / TOUCH INPUT
   ========================================================= */

function getCellFromPoint(
    clientX,
    clientY
) {

    const element =
        document.elementFromPoint(
            clientX,
            clientY
        );


    if (
        element &&
        element.classList.contains(
            "grid-letter"
        )
    ) {

        return {

            row:
                Number(
                    element.dataset.row
                ),

            col:
                Number(
                    element.dataset.col
                )

        };

    }


    return null;

}


function beginSelection(cell) {

    if (
        gamePaused ||
        !gameStarted
    ) {

        return;

    }


    isSelecting = true;

    startCell = cell;

    currentCell = cell;

    displaySelection(
        [cell]
    );

}


function updateSelection(cell) {

    if (
        !isSelecting ||
        !startCell ||
        !cell
    ) {

        return;

    }


    currentCell = cell;


    const cells =
        getLineCells(
            startCell,
            cell
        );


    if (cells.length) {

        displaySelection(cells);

    }

}


function endSelection() {

    if (!isSelecting) {

        return;

    }


    isSelecting = false;

    checkSelection();

    startCell = null;

    currentCell = null;

}


/* =========================================================
   25. MOUSE EVENTS
   ========================================================= */

gridElement.addEventListener(
    "mousedown",
    event => {

        const cell =
            event.target.closest(
                ".grid-letter"
            );


        if (!cell) {

            return;

        }


        event.preventDefault();


        beginSelection({

            row:
                Number(
                    cell.dataset.row
                ),

            col:
                Number(
                    cell.dataset.col
                )

        });

    }
);


document.addEventListener(
    "mousemove",
    event => {

        if (!isSelecting) {

            return;

        }


        const cell =
            getCellFromPoint(
                event.clientX,
                event.clientY
            );


        updateSelection(cell);

    }
);


document.addEventListener(
    "mouseup",
    () => {

        endSelection();

    }
);


/* =========================================================
   26. TOUCH EVENTS
   ========================================================= */

gridElement.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.touches[0];

        const cell =
            getCellFromPoint(
                touch.clientX,
                touch.clientY
            );


        if (!cell) {

            return;

        }


        event.preventDefault();

        beginSelection(cell);

    },
    {
        passive: false
    }
);


document.addEventListener(
    "touchmove",
    event => {

        if (!isSelecting) {

            return;

        }


        const touch =
            event.touches[0];


        if (!touch) {

            return;

        }


        event.preventDefault();


        const cell =
            getCellFromPoint(
                touch.clientX,
                touch.clientY
            );


        updateSelection(cell);

    },
    {
        passive: false
    }
);


document.addEventListener(
    "touchend",
    event => {

        if (isSelecting) {

            event.preventDefault();

        }


        endSelection();

    },
    {
        passive: false
    }
);


/* =========================================================
   27. HINT
   ========================================================= */

function useHint() {

    if (gamePaused) {

        return;

    }


    const remaining =
        Object.keys(placedWords)
            .filter(
                word =>
                    !foundWords.has(word)
            );


    if (!remaining.length) {

        return;

    }


    const word =
        randomItem(remaining);


    const placement =
        placedWords[word];


    if (!placement) {

        return;

    }


    hintsUsed++;

    const cellData =
        randomItem(
            placement.cells
        );


    const cell =
        getCellElement(
            cellData.row,
            cellData.col
        );


    if (!cell) {

        return;

    }


    cell.classList.add("hint");


    showToast(
        `Look around the highlighted letter for "${word}".`,
        "warning"
    );


    setTimeout(
        () => {

            cell.classList.remove(
                "hint"
            );

        },
        2500
    );


    /*
     * A hint costs points.
     */

    score =
        Math.max(
            0,
            score - 25
        );

}


/* =========================================================
   28. SHUFFLE
   ========================================================= */

function shufflePuzzle() {

    if (gamePaused) {

        return;

    }


    /*
     * Generate a fresh puzzle while
     * keeping the same level.
     */

    const puzzle =
        generatePuzzle(
            LEVELS[currentLevelIndex]
        );


    grid =
        puzzle.board;

    placedWords =
        puzzle.placements;

    foundWords =
        new Set();

    score =
        Math.max(
            0,
            score - 10
        );


    renderGrid();

    renderWordList(
        LEVELS[currentLevelIndex].words
            .map(word => word.toUpperCase())
    );

    showToast(
        "New puzzle generated.",
        "success"
    );

}


/* =========================================================
   29. RESTART
   ========================================================= */

function restartLevel() {

    loadLevel(
        currentLevelIndex
    );

}


/* =========================================================
   30. PAUSE
   ========================================================= */

function pauseGame() {

    if (!gameStarted) {

        return;

    }


    gamePaused = true;

    pauseModal.classList.remove(
        "hidden"
    );

    pauseButton.innerHTML =
        `<span aria-hidden="true">▶</span> Resume`;

}


function resumeGame() {

    gamePaused = false;

    pauseModal.classList.add(
        "hidden"
    );

    pauseButton.innerHTML =
        `<span aria-hidden="true">❚❚</span> Pause`;

}


/* =========================================================
   31. FINISH LEVEL
   ========================================================= */

function finishLevel() {

    stopTimer();

    gameStarted = false;


    if (
        !completedLevels.includes(
            currentLevelIndex
        )
    ) {

        completedLevels.push(
            currentLevelIndex
        );

        completedLevels.sort(
            (a, b) => a - b
        );

    }


    const oldBest =
        bestTimes[currentLevelIndex];


    if (
        oldBest === undefined ||
        timerSeconds < oldBest
    ) {

        bestTimes[currentLevelIndex] =
            timerSeconds;

    }


    saveProgress();


    completeTimeElement.textContent =
        formatTime(timerSeconds);

    completeWordsElement.textContent =
        foundWords.size;

    completeScoreElement.textContent =
        score;


    renderLevelMap();

    levelsCompletedElement.textContent =
        completedLevels.length;


    const isLastLevel =
        currentLevelIndex ===
        LEVELS.length - 1;


    if (isLastLevel) {

        nextLevelButton.textContent =
            "Finish Adventure";

    } else {

        nextLevelButton.textContent =
            "Next Level →";

    }


    completeModal.classList.remove(
        "hidden"
    );

}


/* =========================================================
   32. NEXT LEVEL
   ========================================================= */

function goToNextLevel() {

    completeModal.classList.add(
        "hidden"
    );


    if (
        currentLevelIndex >=
        LEVELS.length - 1
    ) {

        showFinalScreen();

        return;

    }


    loadLevel(
        currentLevelIndex + 1
    );

}


/* =========================================================
   33. FINAL SCREEN
   ========================================================= */

function showFinalScreen() {

    finalLevelsElement.textContent =
        completedLevels.length;

    finalWordsElement.textContent =
        totalWordsFound;

    finalScoreElement.textContent =
        score;


    finalModal.classList.remove(
        "hidden"
    );

}


/* =========================================================
   34. RESET ADVENTURE
   ========================================================= */

function playAgain() {

    finalModal.classList.add(
        "hidden"
    );

    completedLevels = [];

    bestTimes = {};

    totalWordsFound = 0;

    saveProgress();

    loadLevel(0);

}


/* =========================================================
   35. THEME
   ========================================================= */

function loadTheme() {

    const saved =
        localStorage.getItem(
            "wordHuntTheme"
        );


    if (saved === "dark") {

        document.body.classList.add(
            "dark"
        );

    }

}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "wordHuntTheme",
        dark
            ? "dark"
            : "light"
    );

}


/* =========================================================
   36. MODALS
   ========================================================= */

function openHelp() {

    helpModal.classList.remove(
        "hidden"
    );

}


function closeHelp() {

    helpModal.classList.add(
        "hidden"
    );

}


function closeModalOnBackground(
    event
) {

    if (
        event.target ===
        event.currentTarget
    ) {

        event.currentTarget.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   37. TOAST
   ========================================================= */

function showToast(
    message,
    type = ""
) {

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;


    toastContainer.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateY(8px)";


            setTimeout(
                () => toast.remove(),
                250
            );

        },
        2200
    );

}


/* =========================================================
   38. VIRTUAL KEYBOARD
   ========================================================= */

virtualKeyboard.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {

            return;

        }


        const key =
            button.dataset.key;


        if (key === "BACKSPACE") {

            clearSelection();

            return;

        }


        /*
         * Keyboard letters are mainly
         * visual feedback in this version.
         */

        button.animate(
            [
                {
                    transform:
                        "scale(0.92)"
                },
                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 130
            }
        );

    }
);


/* =========================================================
   39. KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeHelp();

            pauseModal.classList.add(
                "hidden"
            );

            completeModal.classList.add(
                "hidden"
            );

            finalModal.classList.add(
                "hidden"
            );

        }


        if (
            event.key === " " &&
            gameStarted
        ) {

            event.preventDefault();

            if (gamePaused) {

                resumeGame();

            } else {

                pauseGame();

            }

        }

    }
);


/* =========================================================
   40. BUTTON EVENTS
   ========================================================= */

themeButton.addEventListener(
    "click",
    toggleTheme
);


helpButton.addEventListener(
    "click",
    openHelp
);


closeHelpButton.addEventListener(
    "click",
    closeHelp
);


gotItButton.addEventListener(
    "click",
    closeHelp
);


hintButton.addEventListener(
    "click",
    useHint
);


shuffleButton.addEventListener(
    "click",
    shufflePuzzle
);


restartButton.addEventListener(
    "click",
    restartLevel
);


pauseButton.addEventListener(
    "click",
    () => {

        if (gamePaused) {

            resumeGame();

        } else {

            pauseGame();

        }

    }
);


resumeButton.addEventListener(
    "click",
    resumeGame
);


retryLevelButton.addEventListener(
    "click",
    () => {

        completeModal.classList.add(
            "hidden"
        );

        loadLevel(
            currentLevelIndex
        );

    }
);


nextLevelButton.addEventListener(
    "click",
    goToNextLevel
);


playAgainButton.addEventListener(
    "click",
    playAgain
);


pauseModal.addEventListener(
    "click",
    closeModalOnBackground
);


helpModal.addEventListener(
    "click",
    closeModalOnBackground
);


/* =========================================================
   41. SETTINGS / ABOUT
   ========================================================= */

const settingsButton =
    document.getElementById(
        "settingsButton"
    );

const aboutButton =
    document.getElementById(
        "aboutButton"
    );


settingsButton.addEventListener(
    "click",
    () => {

        showToast(
            "Use the ◐ button to switch themes.",
            "success"
        );

    }
);


aboutButton.addEventListener(
    "click",
    () => {

        showToast(
            "Word Hunt — a classic hidden word adventure.",
            "success"
        );

    }
);


/* =========================================================
   42. INITIALIZE
   ========================================================= */

function initializeGame() {

    loadTheme();

    updateLevelUI();

    loadLevel(0);

    /*
     * Show instructions on first visit.
     */

    const hasSeenHelp =
        localStorage.getItem(
            "wordHuntHasSeenHelp"
        );


    if (!hasSeenHelp) {

        setTimeout(
            () => {

                openHelp();

                localStorage.setItem(
                    "wordHuntHasSeenHelp",
                    "true"
                );

            },
            400
        );

    }

}


initializeGame();

