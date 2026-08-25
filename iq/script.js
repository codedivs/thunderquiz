const questions = [
    {
        question: "What number comes next? 2, 4, 6, 8, ?",
        answers: ["9", "10", "11", "12"],
        correct: 1
    },

    {
        question: "What number comes next? 3, 6, 12, 24, ?",
        answers: ["36", "42", "48", "54"],
        correct: 2
    },

    {
        question: "What number comes next? 1, 4, 9, 16, ?",
        answers: ["20", "24", "25", "27"],
        correct: 2
    },

    {
        question: "Which number does not belong? 3, 5, 7, 10, 11",
        answers: ["5", "7", "10", "11"],
        correct: 2
    },

    {
        question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?",
        answers: [
            "Yes",
            "No",
            "Only sometimes",
            "There is not enough information"
        ],
        correct: 0
    },

    {
        question: "What number comes next? 5, 10, 20, 40, ?",
        answers: ["60", "70", "80", "100"],
        correct: 2
    },

    {
        question: "A clock shows 3:00. What is the angle between the hour and minute hands?",
        answers: ["45°", "60°", "90°", "120°"],
        correct: 2
    },

    {
        question: "What number comes next? 21, 18, 15, 12, ?",
        answers: ["10", "9", "8", "6"],
        correct: 1
    },

    {
        question: "If you rearrange the letters CIFAIPC, you get the name of a:",
        answers: [
            "City",
            "Country",
            "Ocean",
            "Animal"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const questionNumberElement = document.getElementById("question-number");
const progressFill = document.getElementById("progress-fill");

const quizElement = document.getElementById("quiz");
const resultElement = document.getElementById("result");

const scoreElement = document.getElementById("score");
const resultMessage = document.getElementById("result-message");

const restartButton = document.getElementById("restart-button");


function showQuestion() {

    const question = questions[currentQuestion];

    questionElement.textContent = question.question;

    questionNumberElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressFill.style.width = `${progress}%`;

    answersElement.innerHTML = "";

    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.className = "answer";
        button.textContent = answer;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        answersElement.appendChild(button);
    });
}


function selectAnswer(selectedIndex) {

    const question = questions[currentQuestion];

    if (selectedIndex === question.correct) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {

    quizElement.classList.add("hidden");
    resultElement.classList.remove("hidden");

    // Convert the 0–9 score into an estimated IQ.
    const estimatedIQ = Math.round(70 + (score / 9) * 60);

    scoreElement.textContent = estimatedIQ;

    resultMessage.textContent =
        "congratulations!";
}

function restartGame() {

    currentQuestion = 0;
    score = 0;

    resultElement.classList.add("hidden");
    quizElement.classList.remove("hidden");

    showQuestion();
}


restartButton.addEventListener("click", restartGame);


showQuestion();
