/* =========================================================
   WORD SAFE
   Definition + Missing Letter Word Game

   words.json format:

   {
       "words": [
           {
               "word": "TURN",
               "definition": "To change direction or move around."
           }
       ]
   }

   GAMEPLAY:
   Definition → incomplete word → choose letters
   → word completed → automatically next word

   Progress is saved in localStorage.
========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const WORDS_FILE = "words.json";

const STORAGE = {
    level: "wordsafe_level",
    coins: "wordsafe_coins",
    streak: "wordsafe_streak",
    bestStreak: "wordsafe_best_streak",
    hints: "wordsafe_hints",
    sound: "wordsafe_sound"
};

const MAX_LIVES = 3;


/* =========================================================
   DOM
========================================================= */

const el = {

    level:
        document.getElementById("levelNumber"),

    coins:
        document.getElementById("coinCount"),

    streak:
        document.getElementById("streakCount"),

    lives:
        document.getElementById("lives"),

    vaultTrack:
        document.getElementById("vaultTrack"),

    progressText:
        document.getElementById("progressText"),

    progressFill:
        document.getElementById("progressFill"),

    currentVault:
        document.getElementById("currentVault"),

    difficulty:
        document.getElementById("difficultyText"),

    timerProgress:
        document.getElementById("timerProgress"),

    timer:
        document.getElementById("timerValue"),

    word:
        document.getElementById("wordDisplay"),

    lockMessage:
        document.getElementById("lockMessage"),

    question:
        document.getElementById("questionText"),

    questionNumber:
        document.getElementById("questionNumber"),

    letters:
        document.getElementById("letterOptions"),

    hint:
        document.getElementById("hintButton"),

    skip:
        document.getElementById("skipButton"),

    stars:
        document.getElementById("starDisplay"),

    feedback:
        document.getElementById("feedback"),

    completeModal:
        document.getElementById("completeModal"),

    gameOverModal:
        document.getElementById("gameOverModal"),

    masterModal:
        document.getElementById("masterModal"),

    failedLevel:
        document.getElementById("failedLevel"),

    finalStreak:
        document.getElementById("finalStreak"),

    masterScore:
        document.getElementById("masterScore"),

    retry:
        document.getElementById("retryButton"),

    /*
       Your HTML currently uses
       nextLevelButton.
    */

    continue:
        document.getElementById("nextLevelButton"),

    playAgain:
        document.getElementById("playAgainButton"),

    sound:
        document.getElementById("soundToggle"),

    saveIndicator:
        document.getElementById("saveIndicator"),

    completedLevel:
        document.getElementById("completedLevel"),

    levelScore:
        document.getElementById("levelScore"),

    earnedStars:
        document.getElementById("earnedStars"),

    rewardCoins:
        document.getElementById("rewardCoins"),

    completionMessage:
        document.getElementById("completionMessage"),

    hintCost:
        document.getElementById("hintCost")
};


/* =========================================================
   GAME STATE
========================================================= */

const game = {

    /*
       Full word objects:

       {
           word: "TURN",
           definition: "..."
       }
    */

    words: [],

    /*
       Shuffled unused words.
    */

    pool: [],

    level:
        loadNumber(
            STORAGE.level,
            1
        ),

    coins:
        loadNumber(
            STORAGE.coins,
            0
        ),

    streak:
        loadNumber(
            STORAGE.streak,
            0
        ),

    bestStreak:
        loadNumber(
            STORAGE.bestStreak,
            0
        ),

    hints:
        loadNumber(
            STORAGE.hints,
            3
        ),

    lives: MAX_LIVES,

    /*
       Current word.
    */

    word: "",

    /*
       Current definition.
    */

    definition: "",

    /*
       Array of hidden character positions.

       Example:

       TURN

       [1]

       means:

       T _ R N
    */

    hidden: [],

    /*
       Filled answers.

       Example:

       {
           1: "U"
       }
    */

    answers: {},

    /*
       Position currently being answered.
    */

    currentTarget: null,

    /*
       Timer.
    */

    time: 0,

    maxTime: 0,

    timer: null,

    /*
       Prevent double clicks and
       progression bugs.
    */

    locked: false,

    /*
       Sound.
    */

    soundEnabled:
        localStorage.getItem(
            STORAGE.sound
        ) !== "off"
};


/* =========================================================
   STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    boot
);


async function boot() {

    bindEvents();

    updateHUD();

    try {

        const response =
            await fetch(
                WORDS_FILE,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Could not load ${WORDS_FILE}`
            );
        }

        const data =
            await response.json();

        game.words =
            extractWords(data);

        if (!game.words.length) {

            throw new Error(
                "The word bank is empty."
            );
        }

        refillPool();

        renderVaultTrack();

        startLevel();

    } catch (error) {

        console.error(
            "WORD SAFE ERROR:",
            error
        );

        showFatalError(
            "WORD SAFE could not load the word bank."
        );
    }
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {

    el.hint?.addEventListener(
        "click",
        useHint
    );

    el.skip?.addEventListener(
        "click",
        skipWord
    );

    el.retry?.addEventListener(
        "click",
        retryLevel
    );

    el.continue?.addEventListener(
        "click",
        nextLevel
    );

    el.playAgain?.addEventListener(
        "click",
        restartGame
    );

    el.sound?.addEventListener(
        "click",
        toggleSound
    );
}


/* =========================================================
   WORD DATA
========================================================= */

function extractWords(data) {

    let result = [];


    /*
       FORMAT 1

       {
           "words": [
               {
                   "word": "TURN",
                   "definition": "..."
               }
           ]
       }
    */

    if (
        data &&
        Array.isArray(data.words)
    ) {

        result =
            data.words;
    }


    /*
       FORMAT 2

       {
           "words": {
               "3": [...],
               "4": [...],
               "5": [...]
           }
       }
    */

    else if (
        data &&
        data.words &&
        typeof data.words === "object"
    ) {

        Object.values(
            data.words
        ).forEach(group => {

            if (
                Array.isArray(group)
            ) {

                result.push(
                    ...group
                );
            }

        });
    }


    /*
       Normalize every entry.
    */

    result =
        result
            .map(item => {

                /*
                   New object format.
                */

                if (
                    item &&
                    typeof item === "object"
                ) {

                    const word =
                        String(
                            item.word || ""
                        )
                            .trim()
                            .toUpperCase()
                            .replace(
                                /[^A-Z]/g,
                                ""
                            );

                    const definition =
                        String(
                            item.definition || ""
                        )
                            .trim();

                    return {
                        word,
                        definition
                    };
                }


                /*
                   Backwards compatibility
                   with old simple word lists.
                */

                const word =
                    String(
                        item || ""
                    )
                        .trim()
                        .toUpperCase()
                        .replace(
                            /[^A-Z]/g,
                            ""
                        );

                return {
                    word,
                    definition:
                        "Complete the missing letters to reveal the word."
                };

            })
            .filter(item =>

                item.word.length >= 3 &&

                item.definition.length > 0

            );


    /*
       Remove duplicate words.

       This prevents the same word appearing
       twice in a cycle.
    */

    const seen =
        new Set();

    return result.filter(item => {

        if (
            seen.has(item.word)
        ) {

            return false;
        }

        seen.add(item.word);

        return true;
    });
}


/* =========================================================
   WORD POOL
========================================================= */

function refillPool() {

    game.pool =
        shuffle([
            ...game.words
        ]);
}


function chooseWord() {

    /*
       Refill when all words have been used.
    */

    if (!game.pool.length) {

        refillPool();
    }


    const difficulty =
        getDifficulty();


    /*
       Prefer words suitable for
       the current level.
    */

    let candidates =
        game.pool.filter(item =>

            item.word.length >=
                difficulty.minLength &&

            item.word.length <=
                difficulty.maxLength

        );


    /*
       If the exact range has been
       exhausted, use the closest words.
    */

    if (!candidates.length) {

        candidates =
            [...game.pool]
                .sort(
                    (a, b) => {

                        const distanceA =
                            Math.abs(
                                a.word.length -
                                difficulty.preferredLength
                            );

                        const distanceB =
                            Math.abs(
                                b.word.length -
                                difficulty.preferredLength
                            );

                        return (
                            distanceA -
                            distanceB
                        );
                    }
                )
                .slice(
                    0,
                    Math.min(
                        30,
                        game.pool.length
                    )
                );
    }


    if (!candidates.length) {

        return null;
    }


    /*
       RANDOM WORD

       This is deliberately random so
       questions do not appear in a fixed order.
    */

    const selected =
        candidates[
            Math.floor(
                Math.random() *
                candidates.length
            )
        ];


    /*
       Remove the selected word from
       the current pool.

       This prevents immediate repeats.
    */

    const index =
        game.pool.indexOf(
            selected
        );

    if (index >= 0) {

        game.pool.splice(
            index,
            1
        );
    }


    return selected;
}


/* =========================================================
   DIFFICULTY
========================================================= */

function getDifficulty() {

    const level =
        game.level;


    /*
       LEVELS 1–10
    */

    if (level <= 10) {

        return {

            name: "ROOKIE",

            minLength: 3,

            maxLength: 4,

            preferredLength: 3,

            hiddenMin: 1,

            hiddenMax: 1,

            time: 20
        };
    }


    /*
       LEVELS 11–20
    */

    if (level <= 20) {

        return {

            name: "EASY",

            minLength: 3,

            maxLength: 5,

            preferredLength: 4,

            hiddenMin: 1,

            hiddenMax: 2,

            time: 19
        };
    }


    /*
       LEVELS 21–30
    */

    if (level <= 30) {

        return {

            name: "RISING",

            minLength: 4,

            maxLength: 5,

            preferredLength: 5,

            hiddenMin: 2,

            hiddenMax: 2,

            time: 18
        };
    }


    /*
       LEVELS 31–40
    */

    if (level <= 40) {

        return {

            name: "INTERMEDIATE",

            minLength: 4,

            maxLength: 6,

            preferredLength: 5,

            hiddenMin: 2,

            hiddenMax: 3,

            time: 17
        };
    }


    /*
       LEVELS 41–50
    */

    if (level <= 50) {

        return {

            name: "ADVANCED",

            minLength: 5,

            maxLength: 6,

            preferredLength: 6,

            hiddenMin: 3,

            hiddenMax: 3,

            time: 16
        };
    }


    /*
       LEVELS 51–65
    */

    if (level <= 65) {

        return {

            name: "EXPERT",

            minLength: 5,

            maxLength: 7,

            preferredLength: 6,

            hiddenMin: 3,

            hiddenMax: 4,

            time: 15
        };
    }


    /*
       LEVELS 66–80
    */

    if (level <= 80) {

        return {

            name: "MASTER",

            minLength: 6,

            maxLength: 7,

            preferredLength: 7,

            hiddenMin: 4,

            hiddenMax: 4,

            time: 14
        };
    }


    /*
       LEVELS 81–100
    */

    if (level <= 100) {

        return {

            name: "GRAND MASTER",

            minLength: 6,

            maxLength: 8,

            preferredLength: 7,

            hiddenMin: 4,

            hiddenMax: 5,

            time: 13
        };
    }


    /*
       LEVEL 100+

       Difficulty continues increasing.
    */

    const extra =
        Math.floor(
            (level - 100) / 20
        );

    return {

        name: "LEGEND",

        minLength: 7,

        maxLength: 10,

        preferredLength: 8,

        hiddenMin:
            Math.min(
                7,
                4 + extra
            ),

        hiddenMax:
            Math.min(
                8,
                5 + extra
            ),

        time:
            Math.max(
                8,
                13 -
                Math.floor(
                    (level - 100) / 15
                )
            )
    };
}


/* =========================================================
   LEVEL START
========================================================= */

function startLevel() {

    stopTimer();

    game.locked = false;

    game.answers = {};

    game.currentTarget = null;


    /*
       Select a completely new word.
    */

    const selected =
        chooseWord();


    if (!selected) {

        showFatalError(
            "There are no suitable words available."
        );

        return;
    }


    /*
       Store both word and definition.
    */

    game.word =
        selected.word;

    game.definition =
        selected.definition;


    const difficulty =
        getDifficulty();


    /*
       Never hide every letter.

       At least one letter must remain
       visible so the player has something
       to work from.
    */

    const maximumHidden =
        Math.max(
            1,
            game.word.length - 1
        );


    const hiddenCount =
        randomInt(
            difficulty.hiddenMin,
            Math.min(
                difficulty.hiddenMax,
                maximumHidden
            )
        );


    game.hidden =
        chooseHidden(
            game.word.length,
            hiddenCount
        );


    game.maxTime =
        difficulty.time;

    game.time =
        difficulty.time;


    /*
       Update everything BEFORE
       starting the timer.
    */

    updateHUD();

    renderLevelInfo();

    renderWord();

    renderLetters();

    renderMessage();

    updateStars();

    startTimer();

    pulseGameStart();
}


/* =========================================================
   WORD DISPLAY
========================================================= */

function renderWord() {

    if (!el.word) return;

    el.word.innerHTML = "";


    [...game.word]
        .forEach(
            (letter, index) => {

                const slot =
                    document.createElement(
                        "div"
                    );

                slot.className =
                    "word-slot";


                /*
                   HIDDEN LETTER
                */

                if (
                    game.hidden.includes(
                        index
                    )
                ) {

                    const hasAnswer =
                        Object.prototype.hasOwnProperty.call(
                            game.answers,
                            index
                        );


                    if (hasAnswer) {

                        slot.classList.add(
                            "word-slot-filled"
                        );

                        slot.textContent =
                            game.answers[index];

                    } else {

                        slot.classList.add(
                            "word-slot-hidden"
                        );

                        /*
                           Use a visual dash rather
                           than leaving the position
                           looking empty.
                        */

                        slot.textContent =
                            "•";
                    }

                }


                /*
                   VISIBLE LETTER
                */

                else {

                    slot.classList.add(
                        "word-slot-visible"
                    );

                    slot.textContent =
                        letter;
                }


                slot.dataset.index =
                    index;


                el.word.appendChild(
                    slot
                );
            }
        );
}


/* =========================================================
   LETTER OPTIONS
========================================================= */

function renderLetters() {

    if (!el.letters) return;

    el.letters.innerHTML = "";


    /*
       Find all hidden positions that
       haven't been answered yet.
    */

    const remaining =
        game.hidden.filter(
            index =>
                !Object.prototype.hasOwnProperty.call(
                    game.answers,
                    index
                )
        );


    /*
       IMPORTANT:

       If no letters remain, do NOT create
       another question.

       The word is already complete.
    */

    if (!remaining.length) {

        game.currentTarget = null;

        return;
    }


    /*
       The next position to solve.
    */

    const targetIndex =
        remaining[0];

    game.currentTarget =
        targetIndex;


    const correct =
        game.word[
            targetIndex
        ];


    /*
       Letters already required by other
       hidden positions.
    */

    const reservedLetters =
        game.hidden
            .filter(
                index =>
                    index !== targetIndex
            )
            .map(
                index =>
                    game.word[index]
            );


    const alphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    /*
       Generate wrong choices.
    */

    let wrong =
        [...alphabet].filter(
            letter =>

                letter !== correct &&

                !reservedLetters.includes(
                    letter
                )
        );


    wrong =
        shuffle(
            wrong
        );


    /*
       Number of options increases slightly
       as the game gets harder.
    */

    let buttonCount;

    if (
        game.level <= 10
    ) {

        buttonCount = 6;

    } else if (
        game.level <= 40
    ) {

        buttonCount = 7;

    } else {

        buttonCount = 8;
    }


    const choices =
        shuffle([
            correct,
            ...wrong.slice(
                0,
                buttonCount - 1
            )
        ]);


    choices.forEach(
        letter => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "letter-choice";

            button.textContent =
                letter;

            button.dataset.letter =
                letter;


            button.addEventListener(
                "click",
                () =>
                    chooseLetter(
                        letter,
                        button
                    )
            );


            el.letters.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   CHOOSE LETTER
========================================================= */

function chooseLetter(
    letter,
    button
) {

    /*
       Prevent clicks after completion.
    */

    if (
        game.locked
    ) {
        return;
    }


    const index =
        game.currentTarget;


    if (
        index === null ||
        index === undefined
    ) {

        return;
    }


    const correct =
        game.word[index];


    /*
       CORRECT
    */

    if (
        letter === correct
    ) {

        button.classList.add(
            "correct"
        );

        button.disabled = true;


        /*
           Store answer.
        */

        game.answers[index] =
            letter;


        /*
           Prevent the same button event
           from selecting another target.
        */

        game.currentTarget = null;


        game.streak++;


        if (
            game.streak >
            game.bestStreak
        ) {

            game.bestStreak =
                game.streak;
        }


        playSound(
            "correct"
        );


        /*
           Immediately reveal the letter.
        */

        renderWord();


        /*
           Check what remains.
        */

        const remaining =
            game.hidden.filter(
                hiddenIndex =>
                    !Object.prototype.hasOwnProperty.call(
                        game.answers,
                        hiddenIndex
                    )
            );


        /*
           MORE LETTERS

           Automatically create the next
           letter choices.
        */

        if (
            remaining.length
        ) {

            renderLetters();

            updateStars();

            updateHUD();

            saveProgress();

            return;
        }


        /*
           NO LETTERS LEFT

           The word is solved.
        */

        completeWord();

    }


    /*
       WRONG
    */

    else {

        button.classList.add(
            "wrong"
        );

        button.disabled = true;


        game.streak = 0;


        playSound(
            "wrong"
        );


        showFeedback(
            "WRONG LETTER",
            "bad"
        );


        /*
           Wrong answers cost time.
        */

        game.time =
            Math.max(
                2,
                game.time - 2
            );


        updateTimer();

        updateStars();

        updateHUD();


        setTimeout(
            () => {

                button.classList.remove(
                    "wrong"
                );

            },
            500
        );
    }
}


/* =========================================================
   COMPLETE WORD
========================================================= */

function completeWord() {

    /*
       HARD LOCK.

       This prevents:
       - double clicks
       - extra answers
       - accidental second completion
       - questions continuing after completion
    */

    if (
        game.locked
    ) {
        return;
    }


    game.locked = true;

    game.currentTarget = null;


    stopTimer();


    /*
       Streak.
    */

    if (
        game.streak < 1
    ) {

        game.streak = 1;
    }


    if (
        game.streak >
        game.bestStreak
    ) {

        game.bestStreak =
            game.streak;
    }


    /*
       Scoring.
    */

    const speedBonus =
        Math.max(
            0,
            Math.floor(
                game.time / 2
            )
        );


    const streakBonus =
        Math.min(
            30,
            game.streak * 2
        );


    const perfectBonus =
        game.time >=
        game.maxTime * 0.65
            ? 10
            : 0;


    const reward =
        10 +
        speedBonus +
        streakBonus +
        perfectBonus;


    /*
       Coins.
    */

    const earnedCoins =
        Math.max(
            1,
            Math.floor(
                reward / 8
            )
        );


    game.coins +=
        earnedCoins;


    showFeedback(
        `WORD SECURED +${reward}`,
        "good"
    );


    playSound(
        "complete"
    );


    updateStars();

    updateHUD();

    saveProgress();


    /*
       Show completed word visually.
    */

    celebrateWord();


    /*
       Automatically advance.

       No button is required.

       The player sees the completed word
       briefly before the next one.
    */

    setTimeout(
        nextLevel,
        850
    );
}


/* =========================================================
   NEXT LEVEL
========================================================= */

function nextLevel() {

    /*
       Only advance after a completed word.
    */

    if (
        !game.locked
    ) {

        return;
    }


    const completed =
        game.level;


    game.level++;


    /*
       Save immediately.
    */

    saveProgress();


    /*
       Master completion.
    */

    if (
        game.level > 100
    ) {

        showMasterModal();

        return;
    }


    /*
       Every level is its own word challenge.

       Every 10 levels changes the vault.
    */

    renderVaultTrack();


    game.locked = false;


    startLevel();
}


/* =========================================================
   HINT
========================================================= */

function useHint() {

    if (
        game.locked
    ) {

        return;
    }


    if (
        game.hints <= 0
    ) {

        showFeedback(
            "NO HINTS LEFT",
            "bad"
        );

        return;
    }


    const remaining =
        game.hidden.filter(
            index =>
                !Object.prototype.hasOwnProperty.call(
                    game.answers,
                    index
                )
        );


    if (
        !remaining.length
    ) {

        return;
    }


    /*
       Reveal the next letter.
    */

    const index =
        remaining[0];


    const letter =
        game.word[index];


    game.answers[index] =
        letter;


    game.hints--;


    game.currentTarget = null;


    /*
       Re-render everything.

       This is important because after a
       hint the remaining keyboard must target
       the NEXT missing position.
    */

    renderWord();

    renderLetters();

    updateStars();

    updateHUD();

    saveProgress();


    showFeedback(
        `LETTER REVEALED: ${letter}`,
        "hint"
    );


    playSound(
        "hint"
    );


    /*
       If that hint completed the word,
       finish immediately.
    */

    const stillMissing =
        game.hidden.some(
            hiddenIndex =>
                !Object.prototype.hasOwnProperty.call(
                    game.answers,
                    hiddenIndex
                )
        );


    if (
        !stillMissing
    ) {

        completeWord();
    }
}


/* =========================================================
   SKIP
========================================================= */

function skipWord() {

    if (
        game.locked
    ) {

        return;
    }


    game.locked = true;

    game.currentTarget = null;


    stopTimer();


    game.streak = 0;


    showFeedback(
        `WORD WAS ${game.word}`,
        "bad"
    );


    playSound(
        "skip"
    );


    updateHUD();


    /*
       Give the player a short moment
       to see the answer.
    */

    setTimeout(
        () => {

            game.locked = false;

            startLevel();

        },
        850
    );
}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    stopTimer();

    updateTimer();


    game.timer =
        setInterval(
            () => {

                if (
                    game.locked
                ) {

                    return;
                }


                game.time--;


                updateTimer();

                updateStars();


                if (
                    game.time <= 0
                ) {

                    timeExpired();
                }

            },
            1000
        );
}


function stopTimer() {

    if (
        game.timer
    ) {

        clearInterval(
            game.timer
        );

        game.timer = null;
    }
}


function updateTimer() {

    if (
        el.timer
    ) {

        el.timer.textContent =
            Math.max(
                0,
                game.time
            );
    }


    if (
        el.timerProgress
    ) {

        const percentage =
            game.maxTime
                ? (
                    game.time /
                    game.maxTime
                ) * 100
                : 0;


        /*
           Works with either width-based
           or stroke-based CSS.
        */

        el.timerProgress.style.width =
            `${percentage}%`;


        el.timerProgress.style.strokeDashoffset =
            `${276.46 * (1 - percentage / 100)}`;
    }
}


/* =========================================================
   TIME EXPIRED
========================================================= */

function timeExpired() {

    if (
        game.locked
    ) {

        return;
    }


    stopTimer();

    game.locked = true;

    game.currentTarget = null;

    game.streak = 0;


    showFeedback(
        `TIME'S UP — ${game.word}`,
        "bad"
    );


    playSound(
        "timeout"
    );


    updateHUD();


    setTimeout(
        () => {

            game.locked = false;

            startLevel();

        },
        1100
    );
}


/* =========================================================
   LEVEL INFORMATION
========================================================= */

function renderLevelInfo() {

    const difficulty =
        getDifficulty();


    if (
        el.difficulty
    ) {

        el.difficulty.textContent =
            difficulty.name;
    }


    if (
        el.currentVault
    ) {

        const vault =
            Math.ceil(
                game.level / 10
            );


        el.currentVault.textContent =
            `VAULT ${String(vault).padStart(2, "0")}`;
    }


    if (
        el.questionNumber
    ) {

        el.questionNumber.textContent =
            `LEVEL ${String(game.level).padStart(2, "0")}`;
    }


    /*
       DEFINITION

       This is now the actual challenge.

       Example:

       "To change direction or move around
       so that you face another way."
    */

    if (
        el.question
    ) {

        el.question.textContent =
            game.definition ||
            "Complete the missing letters.";
    }


    updateProgress();
}


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

    const levelInsideVault =
        (
            (game.level - 1) %
            10
        ) + 1;


    const percentage =
        (
            levelInsideVault /
            10
        ) * 100;


    if (
        el.progressText
    ) {

        el.progressText.textContent =
            `LEVEL ${levelInsideVault} / 10`;
    }


    if (
        el.progressFill
    ) {

        el.progressFill.style.width =
            `${percentage}%`;
    }
}


/* =========================================================
   VAULT TRACK
========================================================= */

function renderVaultTrack() {

    if (
        !el.vaultTrack
    ) {

        return;
    }


    el.vaultTrack.innerHTML = "";


    const currentVault =
        Math.ceil(
            game.level / 10
        );


    for (
        let i = 1;
        i <= 10;
        i++
    ) {

        const node =
            document.createElement(
                "div"
            );


        node.className =
            "vault-node";


        if (
            i < currentVault
        ) {

            node.classList.add(
                "completed"
            );

            node.textContent =
                "✓";

        }

        else if (
            i === currentVault
        ) {

            node.classList.add(
                "current"
            );

            node.textContent =
                i;

        }

        else {

            node.classList.add(
                "locked"
            );

            node.textContent =
                "🔒";
        }


        el.vaultTrack.appendChild(
            node
        );
    }
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    if (
        el.level
    ) {

        el.level.textContent =
            String(
                game.level
            ).padStart(
                2,
                "0"
            );
    }


    if (
        el.coins
    ) {

        el.coins.textContent =
            game.coins;
    }


    if (
        el.streak
    ) {

        el.streak.textContent =
            game.streak;
    }


    /*
       Preserve the existing heart
       styling instead of replacing the
       whole element with text.
    */

    if (
        el.lives
    ) {

        const hearts =
            el.lives.querySelectorAll(
                ".life"
            );


        if (
            hearts.length
        ) {

            hearts.forEach(
                (heart, index) => {

                    heart.classList.toggle(
                        "active",
                        index < game.lives
                    );

                }
            );

        } else {

            el.lives.textContent =
                "♥".repeat(
                    Math.max(
                        0,
                        game.lives
                    )
                );
        }
    }


    /*
       Show hint count.
    */

    if (
        el.hint
    ) {

        el.hint.dataset.hints =
            game.hints;
    }


    if (
        el.hintCost
    ) {

        el.hintCost.textContent =
            `${game.hints} left`;
    }


    updateProgress();
}


/* =========================================================
   STARS
========================================================= */

function updateStars() {

    if (
        !el.stars
    ) {

        return;
    }


    const ratio =
        game.maxTime
            ? game.time /
              game.maxTime
            : 0;


    let stars = 1;


    if (
        ratio >= 0.45
    ) {

        stars = 2;
    }


    if (
        ratio >= 0.75
    ) {

        stars = 3;
    }


    el.stars.textContent =
        "★".repeat(
            stars
        ) +
        "☆".repeat(
            3 - stars
        );
}


/* =========================================================
   FEEDBACK
========================================================= */

function showFeedback(
    text,
    type = "good"
) {

    if (
        !el.feedback
    ) {

        return;
    }


    /*
       Your HTML contains child elements,
       but textContent is intentionally used
       so feedback always renders reliably.
    */

    el.feedback.textContent =
        text;


    el.feedback.className =
        `feedback ${type}`;


    el.feedback.classList.add(
        "visible"
    );


    setTimeout(
        () => {

            el.feedback.classList.remove(
                "visible"
            );

        },
        900
    );
}


/* =========================================================
   LOCK MESSAGE
========================================================= */

function renderMessage() {

    if (
        !el.lockMessage
    ) {

        return;
    }


    el.lockMessage.textContent =
        "READ THE DEFINITION";
}


/* =========================================================
   WORD CELEBRATION
========================================================= */

function celebrateWord() {

    if (
        !el.word
    ) {

        return;
    }


    el.word.classList.remove(
        "word-success"
    );


    void el.word.offsetWidth;


    el.word.classList.add(
        "word-success"
    );


    setTimeout(
        () => {

            el.word.classList.remove(
                "word-success"
            );

        },
        700
    );
}


function pulseGameStart() {

    if (
        !el.word
    ) {

        return;
    }


    el.word.classList.remove(
        "word-start"
    );


    void el.word.offsetWidth;


    el.word.classList.add(
        "word-start"
    );
}


/* =========================================================
   MODALS
========================================================= */

function showMasterModal() {

    stopTimer();

    game.locked = true;


    if (
        el.masterScore
    ) {

        el.masterScore.textContent =
            game.coins;
    }


    openModal(
        el.masterModal
    );
}


function retryLevel() {

    closeModal(
        el.gameOverModal
    );


    game.lives =
        MAX_LIVES;


    game.streak = 0;


    startLevel();
}


function restartGame() {

    closeModal(
        el.masterModal
    );


    game.level = 1;

    game.coins = 0;

    game.streak = 0;

    game.bestStreak = 0;

    game.hints = 3;

    game.lives =
        MAX_LIVES;


    refillPool();


    saveProgress();


    renderVaultTrack();


    startLevel();
}


function openModal(modal) {

    if (
        !modal
    ) {

        return;
    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeModal(modal) {

    if (
        !modal
    ) {

        return;
    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   SOUND
========================================================= */

function toggleSound() {

    game.soundEnabled =
        !game.soundEnabled;


    localStorage.setItem(
        STORAGE.sound,
        game.soundEnabled
            ? "on"
            : "off"
    );


    if (
        el.sound
    ) {

        el.sound.textContent =
            game.soundEnabled
                ? "🔊"
                : "🔇";
    }
}


function playSound(type) {

    if (
        !game.soundEnabled
    ) {

        return;
    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (
            !AudioContext
        ) {

            return;
        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        const frequencies = {

            correct: 660,

            complete: 880,

            wrong: 170,

            hint: 520,

            skip: 220,

            timeout: 130
        };


        oscillator.frequency.value =
            frequencies[type] ||
            440;


        oscillator.type =
            type === "wrong" ||
            type === "timeout"
                ? "sawtooth"
                : "sine";


        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.08,
            context.currentTime + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime + 0.12
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.13
        );

    } catch (error) {

        /*
           Sound is optional.
        */
    }
}


/* =========================================================
   SAVE
========================================================= */

function saveProgress() {

    localStorage.setItem(
        STORAGE.level,
        game.level
    );


    localStorage.setItem(
        STORAGE.coins,
        game.coins
    );


    localStorage.setItem(
        STORAGE.streak,
        game.streak
    );


    localStorage.setItem(
        STORAGE.bestStreak,
        game.bestStreak
    );


    localStorage.setItem(
        STORAGE.hints,
        game.hints
    );


    showSaved();
}


function showSaved() {

    if (
        !el.saveIndicator
    ) {

        return;
    }


    el.saveIndicator.classList.add(
        "visible"
    );


    setTimeout(
        () => {

            el.saveIndicator.classList.remove(
                "visible"
            );

        },
        1000
    );
}


/* =========================================================
   UTILITY — HIDDEN POSITIONS
========================================================= */

function chooseHidden(
    length,
    count
) {

    const indexes =
        [
            ...Array(length).keys()
        ];


    return shuffle(
        indexes
    )
        .slice(
            0,
            count
        )
        .sort(
            (a, b) =>
                a - b
        );
}


/* =========================================================
   UTILITY — RANDOM INTEGER
========================================================= */

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (
            max -
            min +
            1
        )
    ) + min;
}


/* =========================================================
   UTILITY — SHUFFLE
========================================================= */

function shuffle(array) {

    const copy =
        [...array];


    for (
        let i =
            copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


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
   LOCAL STORAGE NUMBER
========================================================= */

function loadNumber(
    key,
    fallback
) {

    const stored =
        localStorage.getItem(
            key
        );


    if (
        stored === null
    ) {

        return fallback;
    }


    const value =
        Number(
            stored
        );


    return Number.isFinite(
        value
    )
        ? value
        : fallback;
}


/* =========================================================
   FATAL ERROR
========================================================= */

function showFatalError(
    message
) {

    document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:grid;
            place-items:center;
            padding:30px;
            font-family:system-ui,sans-serif;
            text-align:center;
            background:#080a11;
            color:#fff;
        ">

            <div>

                <h1>
                    WORD SAFE
                </h1>

                <p>
                    ${message}
                </p>

                <p>
                    Make sure
                    <strong>words.json</strong>
                    is in the same folder as
                    <strong>index.html</strong>.
                </p>

            </div>

        </div>
    `;
}


/* =========================================================
   INITIAL SOUND ICON
========================================================= */

if (
    el.sound
) {

    el.sound.textContent =
        game.soundEnabled
            ? "🔊"
            : "🔇";
}
