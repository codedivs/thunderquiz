const questions = [
    {
        pattern: ["2", "4", "6", "8", "?"],
        answers: ["9", "10", "11", "12"],
        correct: 1
    },

    {
        pattern: ["3", "6", "12", "24", "?"],
        answers: ["36", "42", "48", "52"],
        correct: 2
    },

    {
        pattern: ["1", "4", "9", "16", "?"],
        answers: ["20", "24", "25", "27"],
        correct: 2
    },

    {
        pattern: ["A", "C", "E", "G", "?"],
        answers: ["H", "I", "J", "K"],
        correct: 1
    },

    {
        pattern: ["5", "10", "20", "40", "?"],
        answers: ["60", "70", "80", "90"],
        correct: 2
    },

    {
        pattern: ["100", "90", "80", "70", "?"],
        answers: ["50", "55", "60", "65"],
        correct: 2
    },

    {
        pattern: ["2", "6", "12", "20", "?"],
        answers: ["24", "28", "30", "32"],
        correct: 2
    },

    {
        pattern: ["1", "2", "6", "24", "?"],
        answers: ["60", "100", "120", "144"],
        correct: 2
    },

    {
        pattern: ["81", "27", "9", "3", "?"],
        answers: ["0", "1", "2", "6"],
        correct: 1
    },

    {
        pattern: ["7", "14", "28", "56", "?"],
        answers: ["84", "98", "112", "120"],
        correct: 2
    }
];


let currentQuestion = 0;
let score = 0;
let timeLeft = 15;
let timer;


const patternElement =
    document.getElementById("pattern");

const answersElement =
    document.getElementById("answers");

const questionNumberElement =
    document.getElementById("question-number");

const progressFill =
    document.getElementById("progress-fill");

const timerElement =
    document.getElementById("timer");

const gamePanel =
    document.querySelector(".game-panel");

const resultElement =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const resultMessage =
    document.getElementById("result-message");

const restartButton =
    document.getElementById("restart-button");


function showQuestion() {

    clearInterval(timer);

    timeLeft = 15;

    timerElement.textContent = timeLeft;

    const question =
        questions[currentQuestion];


    questionNumberElement.textContent =
        `Challenge ${currentQuestion + 1} / ${questions.length}`;


    progressFill.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;


    patternElement.innerHTML = "";


    question.pattern.forEach((item) => {

        const element =
            document.createElement("div");

        element.className = "pattern-item";

        if (item === "?") {
            element.classList.add("missing");
        }

        element.textContent = item;

        patternElement.appendChild(element);
    });


    answersElement.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "answer";

        button.textContent = answer;

        button.addEventListener(
            "click",
            () => selectAnswer(index)
        );

        answersElement.appendChild(button);
    });


    startTimer();
}


function startTimer() {

    timer = setInterval(() => {

        timeLeft--;

        timerElement.textContent =
            timeLeft;


        if (timeLeft <= 0) {

            clearInterval(timer);

            nextQuestion();
        }

    }, 1000);
}


function selectAnswer(index) {

    clearInterval(timer);

    if (
        index ===
        questions[currentQuestion].correct
    ) {
        score++;
    }

    nextQuestion();
}


function nextQuestion() {

    currentQuestion++;

    if (
        currentQuestion <
        questions.length
    ) {

        showQuestion();

    } else {

        showResult();
    }
}


function showResult() {

    clearInterval(timer);

    gamePanel.classList.add("hidden");

    resultElement.classList.remove("hidden");

    scoreElement.textContent =
        score;


    if (score >= 9) {

        resultMessage.textContent =
            "Outstanding. Your pattern recognition is exceptional.";

    } else if (score >= 7) {

        resultMessage.textContent =
            "Excellent work. Your brain spots patterns quickly.";

    } else if (score >= 5) {

        resultMessage.textContent =
            "Nice work. You have a solid pattern instinct.";

    } else if (score >= 3) {

        resultMessage.textContent =
            "Good attempt. Keep training your brain.";

    } else {

        resultMessage.textContent =
            "The patterns won this round. Try again.";
    }
}


function restartGame() {

    currentQuestion = 0;

    score = 0;

    resultElement.classList.add("hidden");

    gamePanel.classList.remove("hidden");

    showQuestion();
}


restartButton.addEventListener(
    "click",
    restartGame
);


showQuestion();
