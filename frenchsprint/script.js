"use strict";

/* =========================================
   FRENCH SPRINT
========================================= */

let gameData = null;
let levels = [];
let currentLevel = 0;
let currentQuestion = 0;

let score = 0;
let streak = 0;
let hearts = 3;

let questions = [];
let answered = false;
let speechAvailable = false;


/* =========================================
   DOM
========================================= */

const levelNumber =
    document.getElementById("levelNumber");

const scoreElement =
    document.getElementById("score");

const streakElement =
    document.getElementById("streak");

const heartsElement =
    document.getElementById("hearts");

const questionCounter =
    document.getElementById("questionCounter");

const progressBar =
    document.getElementById("progressBar");

const categoryElement =
    document.getElementById("category");

const questionTypeElement =
    document.getElementById("questionType");

const questionElement =
    document.getElementById("question");

const answersContainer =
    document.getElementById("answers");

const feedbackElement =
    document.getElementById("feedback");

const gameMessage =
    document.getElementById("gameMessage");

const speakButton =
    document.getElementById("speakBtn");

const levelComplete =
    document.getElementById("levelComplete");

const completeTitle =
    document.getElementById("completeTitle");

const completeText =
    document.getElementById("completeText");

const completeScore =
    document.getElementById("completeScore");

const nextLevelButton =
    document.getElementById("nextLevelBtn");


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    init
);


async function init() {

    /*
       Check browser speech support.
    */

    speechAvailable =
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window;


    if (!speechAvailable && speakButton) {

        speakButton.style.display =
            "none";
    }


    /*
       Load the JSON vocabulary.
    */

    try {

        const response =
            await fetch(
                "french.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not load french.json"
            );
        }


        gameData =
            await response.json();


        levels =
            Array.isArray(gameData)
                ? gameData
                : gameData.levels;


        if (
            !Array.isArray(levels) ||
            levels.length === 0
        ) {

            throw new Error(
                "No French levels found."
            );
        }


        loadLevel(
            getSavedLevel()
        );

    } catch (error) {

        console.error(
            error
        );

        setMessage(
            "Could not load the French lessons.",
            "error"
        );
    }


    /*
       Events
    */

    if (speakButton) {

        speakButton.addEventListener(
            "click",
            speakFrench
        );
    }


    if (nextLevelButton) {

        nextLevelButton.addEventListener(
            "click",
            nextLevel
        );
    }


    /*
       Prevent accidental browser context
       actions on the game area.
    */

    const game =
        document.getElementById("game");


    if (game) {

        game.addEventListener(
            "contextmenu",
            event => {

                event.preventDefault();
            }
        );
    }
}


/* =========================================
   LOAD LEVEL
========================================= */

function loadLevel(index) {

    if (
        index < 0 ||
        index >= levels.length
    ) {

        index = 0;
    }


    currentLevel =
        index;


    answered =
        false;

    hearts =
        3;

    streak =
        0;


    const level =
        levels[currentLevel];


    /*
       Accept either:

       {
          "questions": [...]
       }

       or simply an array.
    */

    if (
        Array.isArray(level.questions)
    ) {

        questions =
            shuffle(
                [...level.questions]
            );

    } else if (
        Array.isArray(level)
    ) {

        questions =
            shuffle(
                [...level]
            );

    } else {

        questions = [];
    }


    /*
       Keep each level manageable.
    */

    if (
        level.questionCount &&
        questions.length >
        Number(level.questionCount)
    ) {

        questions =
            questions.slice(
                0,
                Number(level.questionCount)
            );
    }


    /*
       Reset question.
    */

    currentQuestion =
        0;


    /*
       Hide completion screen.
    */

    if (levelComplete) {

        levelComplete.classList.add(
            "hidden"
        );
    }


    renderQuestion();

    updateInterface();
}


/* =========================================
   RENDER QUESTION
========================================= */

function renderQuestion() {

    if (
        currentQuestion >=
        questions.length
    ) {

        finishLevel();

        return;
    }


    answered =
        false;


    const item =
        questions[currentQuestion];


    if (!item) {

        finishLevel();

        return;
    }


    /*
       Clear feedback.
    */

    feedbackElement.textContent =
        "";

    feedbackElement.className =
        "feedback";


    /*
       Category
    */

    categoryElement.textContent =
        item.category ||
        "VOCABULARY";


    /*
       Question type
    */

    questionTypeElement.textContent =
        getQuestionType(item);


    /*
       French question.

       textContent is deliberately used
       instead of innerHTML.
    */

    questionElement.textContent =
        item.question ||
        item.french ||
        "";


    questionElement.setAttribute(
        "lang",
        "fr"
    );

    questionElement.setAttribute(
        "translate",
        "no"
    );


    /*
       Speak button only makes sense when
       there is French text to pronounce.
    */

    if (speakButton) {

        speakButton.style.display =
            speechAvailable &&
            getFrenchText(item)
                ? "inline-flex"
                : "none";
    }


    /*
       Build answer buttons.
    */

    answersContainer.innerHTML =
        "";


    const answerList =
        getAnswers(item);


    answerList.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "answer-button";


            button.dataset.answer =
                String(index);


            /*
               textContent prevents browser
               parsing and keeps the game
               content controlled by JS.
            */

            button.textContent =
                answer;


            button.setAttribute(
                "translate",
                "no"
            );


            button.addEventListener(
                "click",
                () => {

                    answerQuestion(
                        index,
                        item
                    );
                }
            );


            answersContainer.appendChild(
                button
            );
        }
    );


    updateQuestionProgress();
}


/* =========================================
   QUESTION TYPE
========================================= */

function getQuestionType(item) {

    if (
        item.type === "reverse"
    ) {

        return "Choose the French word";
    }


    if (
        item.type === "sentence"
    ) {

        return "Complete the sentence";
    }


    if (
        item.type === "phrase"
    ) {

        return "What does this mean?";
    }


    return "What does this mean?";
}


/* =========================================
   GET ANSWERS
========================================= */

function getAnswers(item) {

    if (
        Array.isArray(item.answers)
    ) {

        return item.answers;
    }


    if (
        Array.isArray(item.options)
    ) {

        return item.options;
    }


    return [];
}


/* =========================================
   GET CORRECT ANSWER
========================================= */

function getCorrectAnswer(item) {

    /*
       Support:

       correct: 0

       correctAnswer: 0

       answer: 0
    */

    if (
        Number.isInteger(
            Number(item.correct)
        )
    ) {

        return Number(item.correct);
    }


    if (
        Number.isInteger(
            Number(item.correctAnswer)
        )
    ) {

        return Number(item.correctAnswer);
    }


    if (
        Number.isInteger(
            Number(item.answer)
        )
    ) {

        return Number(item.answer);
    }


    return -1;
}


/* =========================================
   ANSWER
========================================= */

function answerQuestion(
    selectedIndex,
    item
) {

    if (answered) {
        return;
    }


    const correctIndex =
        getCorrectAnswer(item);


    const buttons =
        answersContainer.querySelectorAll(
            ".answer-button"
        );


    if (
        selectedIndex ===
        correctIndex
    ) {

        answered =
            true;


        buttons.forEach(
            button => {

                button.disabled =
                    true;
            }
        );


        buttons[
            selectedIndex
        ].classList.add(
            "correct"
        );


        /*
           Streak
        */

        streak++;


        /*
           Bigger reward for longer streak.
        */

        const streakBonus =
            Math.min(
                streak * 5,
                50
            );


        const points =
            10 +
            streakBonus;


        score +=
            points;


        feedbackElement.textContent =
            getCorrectMessage(
                streak
            );


        feedbackElement.className =
            "feedback correct";


        setMessage(
            `+${points} points`,
            "success"
        );


        /*
           Move to the next question.
        */

        setTimeout(
            () => {

                currentQuestion++;

                renderQuestion();

                updateInterface();

            },
            750
        );

    } else {

        /*
           Wrong answer.
        */

        buttons[
            selectedIndex
        ].classList.add(
            "wrong"
        );


        hearts--;


        streak =
            0;


        feedbackElement.textContent =
            getWrongMessage();


        feedbackElement.className =
            "feedback wrong";


        updateInterface();


        /*
           Show the correct answer only
           after the player has made the
           mistake.
        */

        if (
            correctIndex >= 0 &&
            buttons[correctIndex]
        ) {

            buttons[
                correctIndex
            ].classList.add(
                "correct"
            );
        }


        /*
           Player still has hearts.
        */

        if (
            hearts > 0
        ) {

            setMessage(
                "Try again!",
                "warning"
            );


            /*
               Allow another attempt after
               a short pause.
            */

            setTimeout(
                () => {

                    buttons[
                        selectedIndex
                    ].classList.remove(
                        "wrong"
                    );

                    if (
                        buttons[correctIndex]
                    ) {

                        buttons[
                            correctIndex
                        ].classList.remove(
                            "correct"
                        );
                    }

                    feedbackElement.textContent =
                        "";

                    feedbackElement.className =
                        "feedback";

                },
                900
            );


        } else {

            /*
               Out of hearts.
            */

            buttons.forEach(
                button => {

                    button.disabled =
                        true;
                }
            );


            setMessage(
                "Out of hearts. Restarting the level…",
                "error"
            );


            setTimeout(
                () => {

                    loadLevel(
                        currentLevel
                    );

                },
                1200
            );
        }
    }


    updateInterface();
}


/* =========================================
   CORRECT MESSAGES
========================================= */

function getCorrectMessage(streak) {

    if (streak >= 5) {

        return "🔥 Amazing streak!";
    }


    if (streak >= 3) {

        return "⭐ Très bien!";
    }


    const messages = [
        "Correct! ✓",
        "Excellent! ✓",
        "Bien joué! ✓",
        "Bravo! ✓"
    ];


    return messages[
        Math.floor(
            Math.random() *
            messages.length
        )
    ];
}


/* =========================================
   WRONG MESSAGES
========================================= */

function getWrongMessage() {

    const messages = [
        "Not quite.",
        "Try again.",
        "Almost!",
        "Think carefully."
    ];


    return messages[
        Math.floor(
            Math.random() *
            messages.length
        )
    ];
}


/* =========================================
   FRENCH SPEECH
========================================= */

function getFrenchText(item) {

    return (
        item.french ||
        item.question ||
        ""
    );
}


function speakFrench() {

    if (
        !speechAvailable ||
        currentQuestion >= questions.length
    ) {

        return;
    }


    const item =
        questions[currentQuestion];


    const text =
        getFrenchText(item);


    if (!text) {
        return;
    }


    window.speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    utterance.lang =
        "fr-FR";


    utterance.rate =
        0.82;


    utterance.pitch =
        1;


    window.speechSynthesis.speak(
        utterance
    );
}


/* =========================================
   LEVEL COMPLETE
========================================= */

function finishLevel() {

    const level =
        levels[currentLevel];


    const total =
        questions.length;


    if (total === 0) {
        return;
    }


    const percentage =
        Math.round(
            (score /
                Math.max(score, total * 10)) *
            100
        );


    if (completeTitle) {

        completeTitle.textContent =
            "Level complete! 🎉";
    }


    if (completeText) {

        completeText.textContent =
            `You completed ${total} questions.`;
    }


    if (completeScore) {

        completeScore.textContent =
            `${score} points`;
    }


    if (levelComplete) {

        levelComplete.classList.remove(
            "hidden"
        );
    }


    saveCompletedLevel(
        currentLevel
    );
}


/* =========================================
   NEXT LEVEL
========================================= */

function nextLevel() {

    let next =
        currentLevel + 1;


    if (
        next >= levels.length
    ) {

        next = 0;


        setMessage(
            "🇫🇷 You completed all levels! Starting again.",
            "success"
        );
    }


    saveLevel(
        next
    );


    loadLevel(
        next
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   INTERFACE
========================================= */

function updateInterface() {

    if (!levels.length) {
        return;
    }


    if (levelNumber) {

        levelNumber.textContent =
            currentLevel + 1;
    }


    if (scoreElement) {

        scoreElement.textContent =
            score;
    }


    if (streakElement) {

        streakElement.textContent =
            `${streak} 🔥`;
    }


    if (heartsElement) {

        heartsElement.textContent =
            getHeartDisplay();
    }


    updateQuestionProgress();
}


/* =========================================
   QUESTION PROGRESS
========================================= */

function updateQuestionProgress() {

    const total =
        questions.length;


    if (questionCounter) {

        questionCounter.textContent =
            `Question ${
                Math.min(
                    currentQuestion + 1,
                    total
                )
            } / ${total}`;
    }


    if (progressBar) {

        const percentage =
            total > 0
                ? (
                    currentQuestion /
                    total
                ) * 100
                : 0;


        progressBar.style.width =
            `${percentage}%`;
    }
}


/* =========================================
   HEART DISPLAY
========================================= */

function getHeartDisplay() {

    return (
        "❤️ ".repeat(hearts) +
        "🖤 ".repeat(3 - hearts)
    ).trim();
}


/* =========================================
   MESSAGE
========================================= */

function setMessage(
    text,
    type = ""
) {

    if (!gameMessage) {
        return;
    }


    gameMessage.textContent =
        text;


    gameMessage.className =
        "game-message";


    if (type) {

        gameMessage.classList.add(
            type
        );
    }
}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }


    return array;
}


/* =========================================
   STORAGE
========================================= */

function getSavedLevel() {

    const saved =
        Number(
            localStorage.getItem(
                "frenchSprintLevel"
            )
        );


    if (
        Number.isInteger(saved) &&
        saved >= 0 &&
        saved < levels.length
    ) {

        return saved;
    }


    return 0;
}


function saveLevel(level) {

    localStorage.setItem(
        "frenchSprintLevel",
        String(level)
    );
}


function saveCompletedLevel(level) {

    localStorage.setItem(
        `frenchSprintCompleted_${level}`,
        "true"
    );
}


/* =========================================
   TRANSLATION / COPYING RESISTANCE
========================================= */

/*
   These measures don't make browser
   translation impossible, but they prevent
   the game itself from providing an easy
   translation path.
*/


document.addEventListener(
    "copy",
    event => {

        const game =
            document.getElementById("game");


        if (
            game &&
            game.contains(
                document.activeElement
            )
        ) {

            event.preventDefault();
        }
    }
);


document.addEventListener(
    "dragstart",
    event => {

        if (
            event.target.closest(
                "#game"
            )
        ) {

            event.preventDefault();
        }
    }
);


/*
   Prevent selecting game text by mouse.
*/

document.addEventListener(
    "selectstart",
    event => {

        if (
            event.target.closest(
                "#game"
            )
        ) {

            event.preventDefault();
        }
    }
);


/* =========================================
   RESIZE
========================================= */

window.addEventListener(
    "resize",
    () => {

        /*
           Keep the layout responsive.
           No game state needs changing.
        */

        updateInterface();
    }
);
