/* =========================================================
   SEQUENCE
   Crack the Pattern
   ========================================================= */

const $ = (selector) =>
    document.querySelector(selector);


/* =========================================================
   ELEMENTS
   ========================================================= */

const homeScreen = $("#homeScreen");
const gameScreen = $("#gameScreen");
const resultScreen = $("#resultScreen");

const playButton = $("#playButton");
const againButton = $("#againButton");
const homeButton = $("#homeButton");
const quitButton = $("#quitButton");

const pattern = $("#pattern");
const answers = $("#answers");

const scoreElement = $("#score");
const comboElement = $("#combo");
const roundElement = $("#round");

const timerElement = $("#timer");
const timerBar = $("#timerBar");

const livesElement = $("#lives");

const difficultyBars =
    document.querySelectorAll(
        ".difficulty-bars i"
    );

const bestScoreElement =
    $("#bestScore");

const streakElement =
    $("#streak");

const homeLevelElement =
    $("#homeLevel");

const levelDisplay =
    $("#levelDisplay");

const soundButton =
    $("#soundBtn");

const levelButton =
    $("#levelBtn");

const levelModal =
    $("#levelModal");

const closeModal =
    $("#closeModal");

const dailyBadge =
    $("#dailyBadge");

const dailyStatus =
    $("#dailyStatus");

const toast =
    $("#toast");

const toastIcon =
    $("#toastIcon");

const toastTitle =
    $("#toastTitle");

const toastMessage =
    $("#toastMessage");

const particles =
    $("#particles");


/* =========================================================
   RESULT ELEMENTS
   ========================================================= */

const finalScore =
    $("#finalScore");

const finalRounds =
    $("#finalRounds");

const finalCombo =
    $("#finalCombo");

const earnedXp =
    $("#earnedXp");

const newBest =
    $("#newBest");

const resultLabel =
    $("#resultLabel");

const resultIcon =
    $("#resultIcon");

const resultTitle =
    $("#resultTitle");

const resultText =
    $("#resultText");

const resultLevel =
    $("#resultLevel");

const currentXp =
    $("#currentXp");

const requiredXp =
    $("#requiredXp");

const xpBar =
    $("#xpBar");


/* =========================================================
   STORAGE
   ========================================================= */

const STORAGE_KEY =
    "sequence_game_v1";

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

        const data =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            );

        return {
            ...defaultSave,
            ...(data || {})
        };

    } catch {

        return {
            ...defaultSave
        };
    }
}

function saveGame() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(save)
    );
}


/* =========================================================
   GAME STATE
   ========================================================= */

let game = null;

let timerInterval = null;

let timerStart = 0;

let timerDuration = 0;

let audio = null;


/* =========================================================
   DATA
   ========================================================= */

const shapes = [
    "●",
    "◆",
    "▲",
    "■",
    "★",
    "✦",
    "⬟",
    "⬢",
    "✚"
];

const colors = [
    "#a78bfa",
    "#60a5fa",
    "#38bdf8",
    "#34d399",
    "#fbbf24",
    "#fb7185",
    "#f472b6",
    "#c084fc"
];


/* =========================================================
   UTILITIES
   ========================================================= */

function random(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}

function choose(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];
}

function shuffle(array) {

    const result =
        [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];
    }

    return result;
}

function showScreen(screen) {

    [
        homeScreen,
        gameScreen,
        resultScreen
    ].forEach(
        s => s.classList.remove("active")
    );

    screen.classList.add("active");
}

function today() {

    const date = new Date();

    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    ].join("-");
}


/* =========================================================
   LEVEL SYSTEM
   ========================================================= */

function requiredForLevel(level = save.level) {

    return Math.round(
        100 +
        (level - 1) * 70
    );
}

function addXP(amount) {

    save.xp += amount;

    while (
        save.xp >=
        requiredForLevel()
    ) {

        save.xp -=
            requiredForLevel();

        save.level++;

        levelUpSound();

        showToast(
            "🌟",
            "LEVEL UP!",
            `You reached level ${save.level}.`
        );
    }

    saveGame();

    updateUI();
}


/* =========================================================
   STREAK
   ========================================================= */

function updateStreak() {

    const current =
        today();

    if (
        save.lastPlayed ===
        current
    ) {
        return;
    }

    if (!save.lastPlayed) {

        save.streak = 1;

    } else {

        const previous =
            new Date(
                save.lastPlayed
            );

        const now =
            new Date(
                current
            );

        const days =
            Math.round(
                (
                    now -
                    previous
                ) / 86400000
            );

        if (days === 1) {

            save.streak++;

        } else if (days > 1) {

            save.streak = 1;
        }
    }

    save.lastPlayed =
        current;

    saveGame();
}


/* =========================================================
   UI
   ========================================================= */

function updateUI() {

    bestScoreElement.textContent =
        save.best.toLocaleString();

    streakElement.textContent =
        save.streak;

    homeLevelElement.textContent =
        save.level;

    levelDisplay.textContent =
        save.level;

    soundButton.textContent =
        save.sound
            ? "🔊"
            : "🔇";

    const dailyKey =
        "sequence_daily_" +
        today();

    dailyStatus.textContent =
        localStorage.getItem(
            dailyKey
        )
            ? "DONE"
            : "READY";
}


/* =========================================================
   AUDIO
   ========================================================= */

function initializeAudio() {

    if (!save.sound)
        return;

    if (!audio) {

        audio =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    if (
        audio.state ===
        "suspended"
    ) {

        audio.resume();
    }
}

function beep(
    frequency,
    duration,
    type = "sine",
    volume = .035
) {

    if (!save.sound)
        return;

    initializeAudio();

    if (!audio)
        return;

    const oscillator =
        audio.createOscillator();

    const gain =
        audio.createGain();

    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        volume,
        audio.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        .001,
        audio.currentTime +
        duration
    );

    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );

    oscillator.start();

    oscillator.stop(
        audio.currentTime +
        duration
    );
}

function correctSound() {

    beep(
        600,
        .08
    );

    setTimeout(
        () => beep(
            820,
            .12
        ),
        60
    );
}

function wrongSound() {

    beep(
        160,
        .15,
        "sawtooth",
        .025
    );
}

function levelUpSound() {

    beep(500,.08);

    setTimeout(
        () => beep(700,.08),
        90
    );

    setTimeout(
        () => beep(1000,.15),
        180
    );
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(
    icon,
    title,
    message
) {

    toastIcon.textContent =
        icon;

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            2300
        );
}


/* =========================================================
   PARTICLES
   ========================================================= */

function particlesBurst(
    count = 20
) {

    const particleColors = [
        "#a78bfa",
        "#ec4899",
        "#38bdf8",
        "#34d399",
        "#fbbf24"
    ];

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );

        particle.className =
            "particle";

        particle.style.background =
            choose(
                particleColors
            );

        particle.style.left =
            "50%";

        particle.style.top =
            "50%";

        particle.style.setProperty(
            "--x",
            random(-260,260)
        );

        particle.style.setProperty(
            "--y",
            random(-260,260)
        );

        particles.appendChild(
            particle
        );

        setTimeout(
            () => particle.remove(),
            800
        );
    }
}


/* =========================================================
   DIFFICULTY
   ========================================================= */

function difficulty() {

    if (game.round < 4)
        return 1;

    if (game.round < 8)
        return 2;

    if (game.round < 13)
        return 3;

    if (game.round < 19)
        return 4;

    return 5;
}

function updateDifficulty() {

    const level =
        difficulty();

    difficultyBars.forEach(
        (bar, index) => {

            bar.classList.toggle(
                "active",
                index < level
            );
        }
    );
}

function timeLimit() {

    const level =
        difficulty();

    const times = {

        1: 12,

        2: 10,

        3: 8.5,

        4: 7,

        5: 5.8
    };

    return Math.max(
        4.3,
        times[level] -
        Math.min(
            game.round * .04,
            1.2
        )
    );
}


/* =========================================================
   PATTERN GENERATORS
   ========================================================= */

function generatePattern() {

    const level =
        difficulty();

    const generator =
        choose(
            getGenerators(level)
        );

    return generator();
}

function getGenerators(level) {

    const generators = [

        generateNumbers,

        generateAddition,

        generateShapes,

        generateColors,

        generateAlternating,

        generateSquares

    ];

    if (level >= 3) {

        generators.push(
            generateGrowingNumbers
        );

        generators.push(
            generateRotatingShapes
        );
    }

    if (level >= 4) {

        generators.push(
            generateFibonacci
        );

        generators.push(
            generateDoublePattern
        );
    }

    if (level >= 5) {

        generators.push(
            generateMultiplication
        );
    }

    return generators;
}


/* ---------------------------------------------------------
   NUMBER +2
   --------------------------------------------------------- */

function generateNumbers() {

    const start =
        random(1, 20);

    const step =
        random(2, 6);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            start +
            i * step
        );
    }

    return makeNumericQuestion(
        values,
        values[4] + step,
        "numbers"
    );
}


/* ---------------------------------------------------------
   ADDITION
   --------------------------------------------------------- */

function generateAddition() {

    const start =
        random(2, 12);

    const step =
        random(2, 5);

    const values = [];

    let current =
        start;

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        current +=
            step + i;

        values.push(
            current
        );
    }

    return makeNumericQuestion(
        values,
        current + step + 5,
        "numbers"
    );
}


/* ---------------------------------------------------------
   GROWING NUMBERS
   --------------------------------------------------------- */

function generateGrowingNumbers() {

    const start =
        random(2, 8);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            start +
            i * i
        );
    }

    const next =
        start + 25;

    return makeNumericQuestion(
        values,
        next,
        "numbers"
    );
}


/* ---------------------------------------------------------
   MULTIPLICATION
   --------------------------------------------------------- */

function generateMultiplication() {

    const start =
        random(1, 3);

    const multiplier =
        random(2, 3);

    const values = [];

    let current =
        start;

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            current
        );

        current *=
            multiplier;
    }

    return makeNumericQuestion(
        values,
        current,
        "numbers"
    );
}


/* ---------------------------------------------------------
   FIBONACCI
   --------------------------------------------------------- */

function generateFibonacci() {

    let a =
        random(1, 5);

    let b =
        random(2, 7);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(a);

        const next =
            a + b;

        a = b;
        b = next;
    }

    return makeNumericQuestion(
        values,
        a,
        "numbers"
    );
}


/* ---------------------------------------------------------
   SHAPES
   --------------------------------------------------------- */

function generateShapes() {

    const shape =
        choose(shapes);

    const step =
        random(1, shapes.length - 1);

    const start =
        random(0, shapes.length - 1);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            shapes[
                (start +
                i * step) %
                shapes.length
            ]
        );
    }

    const next =
        shapes[
            (start +
            5 * step) %
            shapes.length
        ];

    return makeSymbolQuestion(
        values,
        next
    );
}


/* ---------------------------------------------------------
   ROTATING SHAPES
   --------------------------------------------------------- */

function generateRotatingShapes() {

    const shape =
        choose([
            "▲",
            "◆",
            "■",
            "★"
        ]);

    const values = [];

    const rotations = [
        "0deg",
        "45deg",
        "90deg",
        "135deg",
        "180deg"
    ];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push({
            value: shape,
            rotation:
                rotations[i]
        });
    }

    return {
        type: "rotation",
        sequence: values,
        answer: {
            value: shape,
            rotation: "225deg"
        }
    };
}


/* ---------------------------------------------------------
   COLORS
   --------------------------------------------------------- */

function generateColors() {

    const start =
        random(
            0,
            colors.length - 1
        );

    const step =
        random(1, 3);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            colors[
                (start +
                i * step) %
                colors.length
            ]
        );
    }

    const answer =
        colors[
            (start +
            5 * step) %
            colors.length
        ];

    return {
        type: "colors",
        sequence: values,
        answer
    };
}


/* ---------------------------------------------------------
   ALTERNATING
   --------------------------------------------------------- */

function generateAlternating() {

    const a =
        choose(shapes);

    let b =
        choose(shapes);

    while (b === a) {
        b = choose(shapes);
    }

    const values = [
        a,
        b,
        a,
        b,
        a
    ];

    return makeSymbolQuestion(
        values,
        b
    );
}


/* ---------------------------------------------------------
   SQUARES
   --------------------------------------------------------- */

function generateSquares() {

    const start =
        random(1, 4);

    const values = [];

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        values.push(
            Math.pow(
                start + i,
                2
            )
        );
    }

    const answer =
        Math.pow(
            start + 5,
            2
        );

    return makeNumericQuestion(
        values,
        answer,
        "numbers"
    );
}


/* ---------------------------------------------------------
   DOUBLE PATTERN
   --------------------------------------------------------- */

function generateDoublePattern() {

    const a =
        random(2, 8);

    const b =
        random(10, 20);

    const values = [
        a,
        b,
        a + 2,
        b + 2,
        a + 4
    ];

    const answer =
        b + 4;

    return makeNumericQuestion(
        values,
        answer,
        "numbers"
    );
}


/* =========================================================
   QUESTION HELPERS
   ========================================================= */

function makeNumericQuestion(
    values,
    answer,
    type
) {

    return {
        type,
        sequence: values,
        answer
    };
}

function makeSymbolQuestion(
    values,
    answer
) {

    return {
        type: "symbols",
        sequence: values,
        answer
    };
}


/* =========================================================
   ROUND CREATION
   ========================================================= */

function createRound() {

    stopTimer();

    pattern.innerHTML = "";

    answers.innerHTML = "";

    const question =
        generatePattern();

    game.question =
        question;

    renderPattern(
        question
    );

    createAnswers(
        question
    );

    roundElement.textContent =
        game.round;

    scoreElement.textContent =
        game.score.toLocaleString();

    comboElement.textContent =
        game.combo;

    updateDifficulty();

    startTimer();
}


/* =========================================================
   RENDER PATTERN
   ========================================================= */

function renderPattern(question) {

    question.sequence
        .forEach(
            (value, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "sequence-item";

                item.style.animationDelay =
                    `${index * .055}s`;

                if (
                    typeof value ===
                    "object"
                ) {

                    item.textContent =
                        value.value;

                    item.style.transform =
                        `rotate(${value.rotation})`;

                } else if (
                    question.type ===
                    "colors"
                ) {

                    item.innerHTML =
                        "●";

                    item.style.color =
                        value;

                    item.style.textShadow =
                        `0 0 20px ${value}`;

                } else {

                    item.textContent =
                        value;
                }

                pattern.appendChild(
                    item
                );
            }
        );


    const missing =
        document.createElement(
            "div"
        );

    missing.className =
        "sequence-item missing";

    missing.textContent =
        "?";

    pattern.appendChild(
        missing
    );
}


/* =========================================================
   ANSWERS
   ========================================================= */

function createAnswers(question) {

    const correct =
        question.answer;

    let options = [];

    if (
        question.type ===
        "numbers"
    ) {

        options = [
            correct,
            correct + random(1, 5),
            correct - random(1, 5),
            correct + random(6, 12)
        ];

        if (
            correct -
            random(1, 5) <= 0
        ) {

            options[2] =
                correct + 2;
        }

    } else if (
        question.type ===
        "colors"
    ) {

        options = [
            correct,
            ...shuffle(
                colors.filter(
                    c => c !== correct
                )
            ).slice(0, 3)
        ];

    } else {

        if (
            typeof correct ===
            "object"
        ) {

            const rotations = [
                "0deg",
                "45deg",
                "90deg",
                "135deg",
                "180deg",
                "225deg",
                "270deg"
            ];

            options = [
                correct,
                ...shuffle(
                    rotations
                )
                .filter(
                    r =>
                        r !==
                        correct.rotation
                )
                .slice(0, 3)
                .map(
                    r => ({
                        value:
                            correct.value,
                        rotation: r
                    })
                )
            ];

        } else {

            options = [
                correct,
                ...shuffle(
                    shapes
                )
                .filter(
                    s =>
                        s !==
                        correct
                )
                .slice(0, 3)
            ];
        }
    }

    options =
        shuffle(options);

    options.forEach(
        option => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "answer";

            if (
                question.type ===
                "colors"
            ) {

                button.textContent =
                    "●";

                button.style.color =
                    option;

                button.style.textShadow =
                    `0 0 15px ${option}`;

            } else if (
                typeof option ===
                "object"
            ) {

                button.textContent =
                    option.value;

                button.style.transform =
                    `rotate(${option.rotation})`;

            } else {

                button.textContent =
                    option;
            }

            button.addEventListener(
                "click",
                () =>
                    answerQuestion(
                        option,
                        button
                    )
            );

            answers.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   ANSWER CHECKING
   ========================================================= */

function answersEqual(
    a,
    b
) {

    if (
        typeof a ===
        "object"
    ) {

        return (
            a.value ===
            b.value &&
            a.rotation ===
            b.rotation
        );
    }

    return a === b;
}

function answerQuestion(
    answer,
    button
) {

    if (
        !game.active
    )
        return;

    const correct =
        answersEqual(
            answer,
            game.question.answer
        );

    if (correct) {

        handleCorrect(
            button
        );

    } else {

        handleWrong(
            button
        );
    }
}


/* =========================================================
   CORRECT
   ========================================================= */

function handleCorrect(
    button
) {

    stopTimer();

    button.classList.add(
        "correct"
    );

    const elapsed =
        (
            performance.now() -
            timerStart
        ) / 1000;

    const remaining =
        Math.max(
            0,
            timerDuration -
            elapsed
        );

    const speedBonus =
        Math.round(
            remaining * 35
        );

    const difficultyBonus =
        difficulty() * 45;

    const multiplier =
        1 +
        Math.min(
            game.combo,
            10
        ) * .13;

    const points =
        Math.round(
            (
                100 +
                speedBonus +
                difficultyBonus
            ) * multiplier
        );

    game.score +=
        points;

    game.combo++;

    game.bestCombo =
        Math.max(
            game.bestCombo,
            game.combo
        );

    correctSound();

    particlesBurst(
        game.combo >= 5
            ? 28
            : 15
    );

    if (
        game.combo === 3
    ) {

        showToast(
            "🔥",
            "COMBO!",
            "You're seeing the pattern."
        );
    }

    if (
        game.combo === 5
    ) {

        showToast(
            "⚡",
            "SHARP!",
            "Your pattern recognition is flying."
        );
    }

    if (
        game.combo === 10
    ) {

        showToast(
            "🧠",
            "GENIUS MODE",
            "That is seriously impressive."
        );
    }

    scoreElement.textContent =
        game.score.toLocaleString();

    comboElement.textContent =
        game.combo;

    game.round++;

    setTimeout(
        () => {

            if (
                game.active
            ) {

                createRound();
            }

        },
        300
    );
}


/* =========================================================
   WRONG
   ========================================================= */

function handleWrong(
    button
) {

    button.classList.remove(
        "wrong"
    );

    void button.offsetWidth;

    button.classList.add(
        "wrong"
    );

    wrongSound();

    game.lives--;

    game.combo = 0;

    comboElement.textContent =
        "0";

    updateLives();

    if (
        game.lives <= 0
    ) {

        setTimeout(
            () =>
                endGame(
                    "lives"
                ),
            350
        );

        return;
    }

    showToast(
        "🤔",
        "Not quite.",
        "Look for the rule again."
    );
}


/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {

    timerDuration =
        timeLimit();

    timerStart =
        performance.now();

    timerBar.style.width =
        "100%";

    timerElement.textContent =
        timerDuration.toFixed(1);

    timerInterval =
        setInterval(
            updateTimer,
            40
        );
}

function updateTimer() {

    const elapsed =
        (
            performance.now() -
            timerStart
        ) / 1000;

    const remaining =
        Math.max(
            0,
            timerDuration -
            elapsed
        );

    const percentage =
        (
            remaining /
            timerDuration
        ) * 100;

    timerBar.style.width =
        `${percentage}%`;

    timerElement.textContent =
        remaining.toFixed(1);

    if (
        remaining <= 2
    ) {

        timerBar.style.background =
            "linear-gradient(90deg,#fb7185,#f97316)";

    } else {

        timerBar.style.background =
            "linear-gradient(90deg,#a78bfa,#ec4899)";
    }

    if (
        remaining <= 0
    ) {

        stopTimer();

        handleTimeout();
    }
}

function stopTimer() {

    clearInterval(
        timerInterval
    );
}


/* =========================================================
   TIMEOUT
   ========================================================= */

function handleTimeout() {

    if (
        !game.active
    )
        return;

    game.lives--;

    game.combo = 0;

    comboElement.textContent =
        "0";

    wrongSound();

    updateLives();

    if (
        game.lives <= 0
    ) {

        endGame(
            "timeout"
        );

        return;
    }

    showToast(
        "⏱️",
        "Too slow!",
        "The next pattern is waiting."
    );

    setTimeout(
        () => {

            if (
                game.active
            ) {

                game.round++;

                createRound();
            }

        },
        500
    );
}


/* =========================================================
   LIVES
   ========================================================= */

function updateLives() {

    [
        ...livesElement.children
    ].forEach(
        (heart, index) => {

            heart.classList.toggle(
                "empty",
                index >=
                game.lives
            );
        }
    );
}


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    initializeAudio();

    updateStreak();

    game = {

        active: true,

        score: 0,

        combo: 0,

        bestCombo: 0,

        round: 1,

        lives: 3,

        question: null,

        daily: false
    };

    showScreen(
        gameScreen
    );

    createRound();
}


/* =========================================================
   END GAME
   ========================================================= */

function endGame(
    reason
) {

    if (
        !game ||
        !game.active
    )
        return;

    game.active = false;

    stopTimer();

    const score =
        game.score;

    const previousBest =
        save.best;

    const isNewBest =
        score >
        previousBest;

    if (isNewBest) {

        save.best =
            score;

        newBest.classList.add(
            "show"
        );

    } else {

        newBest.classList.remove(
            "show"
        );
    }

    const rounds =
        Math.max(
            0,
            game.round - 1
        );

    const xp =
        Math.max(
            15,
            Math.round(
                rounds * 4 +
                game.bestCombo * 3 +
                score / 800
            )
        );

    save.games++;

    if (
        game.daily
    ) {

        localStorage.setItem(
            "sequence_daily_" +
            today(),
            "complete"
        );
    }

    addXP(xp);

    finalScore.textContent =
        score.toLocaleString();

    finalRounds.textContent =
        rounds;

    finalCombo.textContent =
        game.bestCombo;

    earnedXp.textContent =
        "+" + xp;

    resultLevel.textContent =
        save.level;

    currentXp.textContent =
        save.xp;

    requiredXp.textContent =
        requiredForLevel();

    xpBar.style.width =
        Math.min(
            100,
            (
                save.xp /
                requiredForLevel()
            ) * 100
        ) + "%";


    if (isNewBest) {

        resultLabel.textContent =
            "NEW PERSONAL BEST";

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "Pattern master.";

        resultText.textContent =
            "That was your sharpest run yet.";

        particlesBurst(35);

    } else if (
        reason ===
        "timeout"
    ) {

        resultLabel.textContent =
            "TIME'S UP";

        resultIcon.textContent =
            "⏱️";

        resultTitle.textContent =
            "Almost there.";

        resultText.textContent =
            "The next run could be your best.";

    } else {

        resultLabel.textContent =
            "RUN COMPLETE";

        resultIcon.textContent =
            game.score >=
            3000
                ? "🔥"
                : "🧠";

        resultTitle.textContent =
            game.score >=
            3000
                ? "Brilliant thinking."
                : "Good thinking.";

        resultText.textContent =
            "Your brain is getting sharper.";
    }

    saveGame();

    updateUI();

    showScreen(
        resultScreen
    );
}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

    stopTimer();

    if (game) {

        game.active =
            false;
    }

    showScreen(
        homeScreen
    );

    updateUI();
}


/* =========================================================
   DAILY
   ========================================================= */

function startDaily() {

    const key =
        "sequence_daily_" +
        today();

    if (
        localStorage.getItem(
            key
        )
    ) {

        showToast(
            "🌸",
            "Already completed",
            "Your next daily pattern arrives tomorrow."
        );

        return;
    }

    startGame();

    game.daily =
        true;

    showToast(
        "🌟",
        "DAILY CHALLENGE",
        "This run counts toward today's challenge."
    );
}


/* =========================================================
   LEVEL MODAL
   ========================================================= */

function openLevel() {

    const current =
        requiredForLevel();

    $("#modalLevel").textContent =
        save.level;

    $("#modalXp").textContent =
        `${save.xp} / ${current}`;

    $("#modalXpBar").style.width =
        Math.min(
            100,
            (
                save.xp /
                current
            ) * 100
        ) + "%";

    levelModal.classList.add(
        "show"
    );
}

function closeLevel() {

    levelModal.classList.remove(
        "show"
    );
}


/* =========================================================
   SOUND TOGGLE
   ========================================================= */

function toggleSound() {

    save.sound =
        !save.sound;

    saveGame();

    updateUI();

    if (
        save.sound
    ) {

        initializeAudio();

        beep(
            700,
            .08
        );
    }
}


/* =========================================================
   EVENTS
   ========================================================= */

playButton.addEventListener(
    "click",
    startGame
);

againButton.addEventListener(
    "click",
    startGame
);

homeButton.addEventListener(
    "click",
    goHome
);

quitButton.addEventListener(
    "click",
    () => {

        if (
            game?.active
        ) {

            const leave =
                confirm(
                    "Leave this game?"
                );

            if (!leave)
                return;
        }

        goHome();
    }
);

soundButton.addEventListener(
    "click",
    toggleSound
);

levelButton.addEventListener(
    "click",
    openLevel
);

closeModal.addEventListener(
    "click",
    closeLevel
);

document
    .querySelector(".modal-background")
    .addEventListener(
        "click",
        closeLevel
    );

dailyBadge.addEventListener(
    "click",
    startDaily
);


/* =========================================================
   KEYBOARD
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                levelModal.classList.contains(
                    "show"
                )
            ) {

                closeLevel();

            } else if (
                game?.active
            ) {

                goHome();
            }
        }

        if (
            event.code ===
            "Space" &&
            homeScreen.classList.contains(
                "active"
            )
        ) {

            event.preventDefault();

            startGame();
        }
    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

updateUI();
