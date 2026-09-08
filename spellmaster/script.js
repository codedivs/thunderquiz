/* =========================================================
   SPELL MASTER
   Quiz Game Engine
   ========================================================= */


/* =========================================================
   WORD DATABASE
   ========================================================= */

const levels = [

    {
        name: "Level 1 · Beginner",
        words: [
            {
                options: ["Cat", "Kat", "Catt", "Katt"],
                correct: "Cat",
                hint: "Think of the common three-letter animal."
            },
            {
                options: ["Fish", "Fisch", "Fesh", "Fissh"],
                correct: "Fish",
                hint: "This word names an animal that lives in water."
            },
            {
                options: ["Book", "Bok", "Boock", "Buuk"],
                correct: "Book",
                hint: "You read this."
            },
            {
                options: ["Tree", "Trea", "Tri", "Tre"],
                correct: "Tree",
                hint: "This has leaves and branches."
            },
            {
                options: ["House", "Hous", "Howse", "Houze"],
                correct: "House",
                hint: "A place where people live."
            },
            {
                options: ["Water", "Watter", "Wotar", "Waater"],
                correct: "Water",
                hint: "You drink it."
            },
            {
                options: ["Apple", "Aple", "Appel", "Appl"],
                correct: "Apple",
                hint: "A common fruit."
            },
            {
                options: ["Green", "Grean", "Grenn", "Greene"],
                correct: "Green",
                hint: "A color often associated with grass."
            },
            {
                options: ["Happy", "Hapy", "Happey", "Happi"],
                correct: "Happy",
                hint: "The opposite of sad."
            },
            {
                options: ["School", "Skool", "Scholl", "Scool"],
                correct: "School",
                hint: "Students go here to learn."
            }
        ]
    },

    {
        name: "Level 2 · Easy",
        words: [
            {
                options: ["Morning", "Mornning", "Mourning", "Mornin"],
                correct: "Morning",
                hint: "The part of the day after night."
            },
            {
                options: ["Friend", "Freind", "Frend", "Friand"],
                correct: "Friend",
                hint: "Someone you like and trust."
            },
            {
                options: ["Family", "Famely", "Familiy", "Famly"],
                correct: "Family",
                hint: "Parents, children and relatives."
            },
            {
                options: ["Garden", "Gardan", "Gardden", "Gorden"],
                correct: "Garden",
                hint: "A place where plants and flowers grow."
            },
            {
                options: ["Window", "Windoe", "Windo", "Winddow"],
                correct: "Window",
                hint: "You can look through one."
            },
            {
                options: ["People", "Peaple", "Peopel", "Peopple"],
                correct: "People",
                hint: "More than one person."
            },
            {
                options: ["Animal", "Anemal", "Animel", "Annimal"],
                correct: "Animal",
                hint: "A living creature that is not a plant."
            },
            {
                options: ["Orange", "Oringe", "Orangge", "Oranj"],
                correct: "Orange",
                hint: "A fruit and a color."
            },
            {
                options: ["Winter", "Wintar", "Winnter", "Wintur"],
                correct: "Winter",
                hint: "The coldest season in many places."
            },
            {
                options: ["Picture", "Pictuer", "Pikcture", "Pictur"],
                correct: "Picture",
                hint: "You might hang one on a wall."
            }
        ]
    },

    {
        name: "Level 3 · Intermediate",
        words: [
            {
                options: ["Because", "Becouse", "Becaus", "Beacause"],
                correct: "Because",
                hint: "This word often explains a reason."
            },
            {
                options: ["Believe", "Beleive", "Belive", "Believ"],
                correct: "Believe",
                hint: "Remember: the middle contains 'lie'."
            },
            {
                options: ["Receive", "Recieve", "Receve", "Receeve"],
                correct: "Receive",
                hint: "Think about the 'i before e' rule and its exceptions."
            },
            {
                options: ["Different", "Diffrent", "Diferent", "Differant"],
                correct: "Different",
                hint: "There are two 'f's."
            },
            {
                options: ["Important", "Importent", "Importannt", "Imporant"],
                correct: "Important",
                hint: "Something that matters a lot."
            },
            {
                options: ["Tomorrow", "Tommorow", "Tomorow", "Tommorrow"],
                correct: "Tomorrow",
                hint: "The day after today."
            },
            {
                options: ["Beautiful", "Beutiful", "Beautifull", "Beutifull"],
                correct: "Beautiful",
                hint: "It contains the word 'beauty' at its beginning."
            },
            {
                options: ["Favorite", "Favourite", "Favorit", "Favrite"],
                correct: "Favorite",
                hint: "This is the American spelling."
            },
            {
                options: ["Business", "Buisness", "Busines", "Bussiness"],
                correct: "Business",
                hint: "Be careful with the middle vowels."
            },
            {
                options: ["Knowledge", "Knowlege", "Knowladge", "Knowlidge"],
                correct: "Knowledge",
                hint: "It begins with 'know'."
            }
        ]
    },

    {
        name: "Level 4 · Advanced",
        words: [
            {
                options: ["Necessary", "Neccessary", "Necesary", "Nessessary"],
                correct: "Necessary",
                hint: "Think carefully about the number of c's and s's."
            },
            {
                options: ["Separate", "Seperate", "Sepparate", "Seperrate"],
                correct: "Separate",
                hint: "There is an 'a' in the middle."
            },
            {
                options: ["Definitely", "Definately", "Definitly", "Definetely"],
                correct: "Definitely",
                hint: "The base word is 'definite'."
            },
            {
                options: ["Environment", "Enviroment", "Environmant", "Enviornment"],
                correct: "Environment",
                hint: "It contains 'iron' after the first two letters."
            },
            {
                options: ["Government", "Goverment", "Goverenment", "Govornment"],
                correct: "Government",
                hint: "The word comes from 'govern'."
            },
            {
                options: ["Restaurant", "Restaraunt", "Resturant", "Restuarant"],
                correct: "Restaurant",
                hint: "A place where you eat."
            },
            {
                options: ["Experience", "Experiance", "Experiense", "Expirience"],
                correct: "Experience",
                hint: "It begins with 'exper'."
            },
            {
                options: ["Successful", "Succesful", "Successfull", "Sucessful"],
                correct: "Successful",
                hint: "Think about the double c."
            },
            {
                options: ["Opportunity", "Oppertunity", "Oportunity", "Opportinity"],
                correct: "Opportunity",
                hint: "It contains double p."
            },
            {
                options: ["Immediately", "Immediatly", "Imediately", "Immediateley"],
                correct: "Immediately",
                hint: "Start with 'immediate' and add the ending."
            }
        ]
    },

    {
        name: "Level 5 · Expert",
        words: [
            {
                options: ["Accommodate", "Accomodate", "Acommodate", "Accomadate"],
                correct: "Accommodate",
                hint: "Remember: double c and double m."
            },
            {
                options: ["Embarrass", "Embarass", "Embarrass", "Embaras"],
                correct: "Embarrass",
                hint: "It has double r and double s."
            },
            {
                options: ["Maintenance", "Maintainance", "Maintenence", "Maintanance"],
                correct: "Maintenance",
                hint: "It comes from 'maintain', but the spelling changes."
            },
            {
                options: ["Privilege", "Priviledge", "Privelege", "Privlege"],
                correct: "Privilege",
                hint: "There is no 'd' in this word."
            },
            {
                options: ["Pronunciation", "Pronounciation", "Pronunciaton", "Pronuncation"],
                correct: "Pronunciation",
                hint: "The spelling differs from 'pronounce'."
            },
            {
                options: ["Conscience", "Consciense", "Conscince", "Consience"],
                correct: "Conscience",
                hint: "This relates to your sense of right and wrong."
            },
            {
                options: ["Miscellaneous", "Miscelaneous", "Miscellanous", "Mischellaneous"],
                correct: "Miscellaneous",
                hint: "A famously difficult word containing 'misc'."
            },
            {
                options: ["Entrepreneur", "Enterpreneur", "Entreprenuer", "Entrepenur"],
                correct: "Entrepreneur",
                hint: "A person who starts a business."
            },
            {
                options: ["Questionnaire", "Questionaire", "Questionnair", "Questonnaire"],
                correct: "Questionnaire",
                hint: "It has double n near the end."
            },
            {
                options: ["Exaggerate", "Exagerate", "Exaggerate", "Exaggerrate"],
                correct: "Exaggerate",
                hint: "It begins with exag- and contains double g."
            }
        ]
    },

    {
        name: "Level 6 · Master",
        words: [
            {
                options: ["Conscientious", "Consciencious", "Conscientous", "Consientious"],
                correct: "Conscientious",
                hint: "It contains 'science' within its spelling."
            },
            {
                options: ["Dilemma", "Dilemna", "Dilemmah", "Dilema"],
                correct: "Dilemma",
                hint: "A difficult choice or problem."
            },
            {
                options: ["Occasionally", "Occassionally", "Ocasionally", "Occasionaly"],
                correct: "Occasionally",
                hint: "Think about the spelling of 'occasion'."
            },
            {
                options: ["Millennium", "Millenium", "Milennium", "Millenniun"],
                correct: "Millennium",
                hint: "A period of one thousand years."
            },
            {
                options: ["Perseverance", "Perseverence", "Perserverance", "Perseveranse"],
                correct: "Perseverance",
                hint: "Keep the 'ver' before 'ance'."
            },
            {
                options: ["Irresistible", "Irresistable", "Iresistible", "Irresisitible"],
                correct: "Irresistible",
                hint: "The ending is '-ible'."
            },
            {
                options: ["Exhilarating", "Exhilerating", "Exhilariting", "Exhillerating"],
                correct: "Exhilarating",
                hint: "It begins with 'exhil'."
            },
            {
                options: ["Hierarchy", "Heirarchy", "Hierachy", "Hierarchy"],
                correct: "Hierarchy",
                hint: "Think 'hier' before 'archy'."
            },
            {
                options: ["Supersede", "Supercede", "Superscede", "Superseed"],
                correct: "Supersede",
                hint: "The ending is 'sede', not 'cede'."
            },
            {
                options: ["Liaison", "Liason", "Liaisson", "Liasion"],
                correct: "Liaison",
                hint: "A French-derived word."
            }
        ]
    },

    {
        name: "Level 7 · Grand Master",
        words: [
            {
                options: ["Acquaintance", "Acquaintence", "Aquantance", "Acquantence"],
                correct: "Acquaintance",
                hint: "It starts with 'acquaint'."
            },
            {
                options: ["Bureaucracy", "Bureacracy", "Bureaucrasy", "Bureaucracey"],
                correct: "Bureaucracy",
                hint: "It starts with 'bureau'."
            },
            {
                options: ["Camouflage", "Camoflage", "Camoflauge", "Camouflauge"],
                correct: "Camouflage",
                hint: "The middle contains 'mouf'."
            },
            {
                options: ["Indispensable", "Indispensible", "Indispensable", "Indispensabel"],
                correct: "Indispensable",
                hint: "The ending is '-able'."
            },
            {
                options: ["Inconvenience", "Inconvienience", "Inconveniance", "Inconveniense"],
                correct: "Inconvenience",
                hint: "Think about the spelling of 'convenience'."
            },
            {
                options: ["Mischievous", "Mischievious", "Mischevious", "Mischivous"],
                correct: "Mischievous",
                hint: "Traditionally spelled without an extra i after the v."
            },
            {
                options: ["Questionable", "Questionible", "Questionalbe", "Questionabel"],
                correct: "Questionable",
                hint: "The ending is '-able'."
            },
            {
                options: ["Reconciliation", "Reconcilation", "Reconcilliation", "Reconsiliation"],
                correct: "Reconciliation",
                hint: "It comes from 'reconcile'."
            },
            {
                options: ["Surveillance", "Surveillence", "Surveilance", "Survaillance"],
                correct: "Surveillance",
                hint: "It contains 'veill'."
            },
            {
                options: ["Unnecessary", "Unneccessary", "Unnecessery", "Unnecesary"],
                correct: "Unnecessary",
                hint: "Combine 'un' with the spelling of necessary."
            }
        ]
    },

    {
        name: "Level 8 · Spelling Legend",
        words: [
            {
                options: ["Entrepreneurial", "Enterpreneurial", "Entreprenuerial", "Entrepreneural"],
                correct: "Entrepreneurial",
                hint: "Start with the correct spelling of entrepreneur."
            },
            {
                options: ["Incomprehensible", "Incomprehensable", "Incomprehensibel", "Incomprehenssible"],
                correct: "Incomprehensible",
                hint: "The ending is '-ible'."
            },
            {
                options: ["Electromagnetism", "Electromagnatism", "Electromagnetisim", "Electromagnitism"],
                correct: "Electromagnetism",
                hint: "Combine electro + magnet + ism."
            },
            {
                options: ["Photosynthesis", "Photosinthesis", "Photocynthesis", "Photosynthasis"],
                correct: "Photosynthesis",
                hint: "Plants use this process to make food."
            },
            {
                options: ["Circumference", "Circumferance", "Circumfrence", "Circumferense"],
                correct: "Circumference",
                hint: "The distance around a circle."
            },
            {
                options: ["Pharmaceutical", "Farmaceutical", "Pharmaceuticall", "Pharmaceautical"],
                correct: "Pharmaceutical",
                hint: "It begins with 'pharma'."
            },
            {
                options: ["Extraordinary", "Extraordenary", "Extraordinery", "Extrodinary"],
                correct: "Extraordinary",
                hint: "Extra + ordinary."
            },
            {
                options: ["Characteristic", "Caracteristic", "Charactaristic", "Characterisitic"],
                correct: "Characteristic",
                hint: "It starts with 'character'."
            },
            {
                options: ["Unconstitutional", "Unconstitutianal", "Unconstutional", "Unconstitutional"],
                correct: "Unconstitutional",
                hint: "The word contains 'constitutional'."
            },
            {
                options: ["Responsibility", "Responsability", "Responsibilty", "Responcibility"],
                correct: "Responsibility",
                hint: "It comes from 'responsible'."
            }
        ]
    }
];


/* =========================================================
   GAME STATE
   ========================================================= */

let currentLevel = 0;
let currentQuestion = 0;

let score = 0;
let streak = 0;
let bestStreak = 0;

let lives = 3;

let correctAnswers = 0;
let totalAnswered = 0;

let hintUsed = false;
let answered = false;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const scoreElement = document.getElementById("score");
const streakElement = document.getElementById("streak");
const livesElement = document.getElementById("lives");

const levelNameElement = document.getElementById("levelName");
const questionCounterElement = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");

const optionsContainer = document.getElementById("options");

const feedback = document.getElementById("feedback");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackText = document.getElementById("feedbackText");

const hintButton = document.getElementById("hintButton");
const hintText = document.getElementById("hintText");

const nextButton = document.getElementById("nextButton");

const levelComplete = document.getElementById("levelComplete");
const finalScore = document.getElementById("finalScore");
const accuracy = document.getElementById("accuracy");
const bestStreakElement = document.getElementById("bestStreak");

const nextLevelButton = document.getElementById("nextLevelButton");

const gameOver = document.getElementById("gameOver");
const gameOverScore = document.getElementById("gameOverScore");
const restartButton = document.getElementById("restartButton");


/* =========================================================
   START GAME
   ========================================================= */

function startGame() {

    currentLevel = 0;
    currentQuestion = 0;

    score = 0;
    streak = 0;
    bestStreak = 0;

    lives = 3;

    correctAnswers = 0;
    totalAnswered = 0;

    levelComplete.classList.add("hidden");
    gameOver.classList.add("hidden");

    updateScore();
    updateLives();

    loadQuestion();
}


/* =========================================================
   LOAD QUESTION
   ========================================================= */

function loadQuestion() {

    answered = false;
    hintUsed = false;

    feedback.classList.add("hidden");
    nextButton.classList.add("hidden");

    hintText.classList.add("hidden");
    hintText.textContent = "";

    hintButton.disabled = false;
    hintButton.style.opacity = "1";

    const level = levels[currentLevel];
    const question = level.words[currentQuestion];

    levelNameElement.textContent = level.name;

    questionCounterElement.textContent =
        `Question ${currentQuestion + 1} / ${level.words.length}`;

    const progress =
        ((currentQuestion) / level.words.length) * 100;

    progressBar.style.width = `${Math.max(progress, 8)}%`;

    renderOptions(question);

    updateQuestionNumber();
}


/* =========================================================
   RENDER ANSWERS
   ========================================================= */

function renderOptions(question) {

    optionsContainer.innerHTML = "";

    /*
       Shuffle the four choices so the correct answer
       doesn't always appear in the same position.
    */

    const shuffledOptions = [...question.options]
        .sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((word, index) => {

        const button = document.createElement("button");

        button.className = "answer-option";
        button.dataset.answer = word;

        const letter = String.fromCharCode(65 + index);

        button.innerHTML = `
            <span class="option-letter">${letter}</span>
            <span class="option-word">${word}</span>
        `;

        button.addEventListener("click", () => {
            checkAnswer(word, button);
        });

        optionsContainer.appendChild(button);
    });
}


/* =========================================================
   CHECK ANSWER
   ========================================================= */

function checkAnswer(selectedWord, selectedButton) {

    if (answered) return;

    answered = true;
    totalAnswered++;

    const question = levels[currentLevel].words[currentQuestion];

    const allButtons =
        document.querySelectorAll(".answer-option");

    allButtons.forEach(button => {
        button.classList.add("disabled");
    });

    if (selectedWord === question.correct) {

        handleCorrect(selectedButton, question);

    } else {

        handleWrong(selectedButton, question);

    }
}


/* =========================================================
   CORRECT ANSWER
   ========================================================= */

function handleCorrect(button, question) {

    correctAnswers++;

    streak++;

    if (streak > bestStreak) {
        bestStreak = streak;
    }

    /*
       Base points = 100

       Streak bonus increases with consecutive answers.
    */

    let points = 100;

    if (streak >= 3) {
        points += 25;
    }

    if (streak >= 5) {
        points += 50;
    }

    /*
       Hint penalty
    */

    if (hintUsed) {
        points -= 30;
    }

    points = Math.max(points, 10);

    score += points;

    button.classList.add("correct");

    feedback.classList.remove("hidden");

    feedbackIcon.textContent = "✓";
    feedbackTitle.textContent = "Correct!";

    if (streak >= 3) {

        feedbackText.textContent =
            `Excellent! ${points} points · ${streak} answer streak`;

    } else {

        feedbackText.textContent =
            `Perfect spelling! +${points} points`;

    }

    updateScore();

    nextButton.classList.remove("hidden");

    /*
       Stop hint from being used after answering.
    */

    hintButton.disabled = true;
    hintButton.style.opacity = ".4";
}


/* =========================================================
   WRONG ANSWER
   ========================================================= */

function handleWrong(button, question) {

    lives--;

    streak = 0;

    button.classList.add("wrong");

    /*
       Find and highlight the correct answer.
    */

    document
        .querySelectorAll(".answer-option")
        .forEach(option => {

            if (option.dataset.answer === question.correct) {
                option.classList.add("correct");
            }

        });

    feedback.classList.remove("hidden");

    feedbackIcon.textContent = "!";
    feedbackTitle.textContent = "Not quite";

    feedbackText.textContent =
        `The correct spelling is ${question.correct}.`;

    updateLives();
    updateScore();

    hintButton.disabled = true;
    hintButton.style.opacity = ".4";

    /*
       If the player still has lives,
       allow them to continue.
    */

    if (lives > 0) {

        nextButton.classList.remove("hidden");

    } else {

        setTimeout(() => {
            showGameOver();
        }, 900);

    }
}


/* =========================================================
   NEXT QUESTION
   ========================================================= */

nextButton.addEventListener("click", () => {

    currentQuestion++;

    if (
        currentQuestion >=
        levels[currentLevel].words.length
    ) {

        showLevelComplete();

    } else {

        loadQuestion();

    }

});


/* =========================================================
   HINT
   ========================================================= */

hintButton.addEventListener("click", () => {

    if (hintUsed || answered) return;

    const question =
        levels[currentLevel].words[currentQuestion];

    hintUsed = true;

    hintText.textContent =
        `Hint: ${question.hint}`;

    hintText.classList.remove("hidden");

    /*
       Small visual penalty.
    */

    hintButton.disabled = true;
    hintButton.style.opacity = ".45";

});


/* =========================================================
   LEVEL COMPLETE
   ========================================================= */

function showLevelComplete() {

    finalScore.textContent = score;

    const currentAccuracy =
        totalAnswered === 0
            ? 0
            : Math.round(
                (correctAnswers / totalAnswered) * 100
            );

    accuracy.textContent =
        `${currentAccuracy}%`;

    bestStreakElement.textContent =
        bestStreak;

    levelComplete.classList.remove("hidden");

    /*
       Change button text on final level.
    */

    if (currentLevel >= levels.length - 1) {

        nextLevelButton.textContent =
            "Spelling Legend Complete!";

    } else {

        nextLevelButton.textContent =
            "Continue to Next Level →";

    }

}


/* =========================================================
   NEXT LEVEL
   ========================================================= */

nextLevelButton.addEventListener("click", () => {

    if (currentLevel >= levels.length - 1) {

        /*
           Finished every level.
        */

        levelComplete.classList.add("hidden");

        showGameOver(true);

        return;
    }

    currentLevel++;
    currentQuestion = 0;

    levelComplete.classList.add("hidden");

    loadQuestion();

});


/* =========================================================
   GAME OVER
   ========================================================= */

function showGameOver(completedAllLevels = false) {

    gameOverScore.textContent = score;

    const title =
        gameOver.querySelector("h2");

    const message =
        gameOver.querySelector("p");

    const button =
        gameOver.querySelector(".restart-button");

    if (completedAllLevels) {

        title.textContent =
            "Spelling Legend!";

        message.textContent =
            "You conquered every level. Your spelling is exceptional.";

        button.textContent =
            "Play Again";

    } else {

        title.textContent =
            "Game Over";

        message.textContent =
            "You ran out of lives. Give it another shot.";

        button.textContent =
            "Try Again";

    }

    gameOver.classList.remove("hidden");
}


/* =========================================================
   RESTART
   ========================================================= */

restartButton.addEventListener("click", () => {

    startGame();

});


/* =========================================================
   SCORE DISPLAY
   ========================================================= */

function updateScore() {

    scoreElement.textContent =
        score.toLocaleString();

    streakElement.textContent =
        streak;

}


/* =========================================================
   LIVES DISPLAY
   ========================================================= */

function updateLives() {

    const hearts =
        livesElement.querySelectorAll("span");

    hearts.forEach((heart, index) => {

        if (index < lives) {

            heart.classList.remove("dead");

        } else {

            heart.classList.add("dead");

        }

    });

}


/* =========================================================
   QUESTION NUMBER DECORATION
   ========================================================= */

function updateQuestionNumber() {

    const number =
        String(currentQuestion + 1)
            .padStart(2, "0");

    const questionSection =
        document.querySelector(".question-section");

    questionSection.style.setProperty(
        "--question-number",
        `"${number}"`
    );

}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

document.addEventListener("keydown", event => {

    if (answered) {

        /*
           Enter = next question
        */

        if (
            event.key === "Enter" &&
            !nextButton.classList.contains("hidden")
        ) {

            nextButton.click();

        }

        return;
    }

    /*
       A / B / C / D selects an answer.
    */

    const key =
        event.key.toUpperCase();

    if (!["A", "B", "C", "D"].includes(key)) {
        return;
    }

    const buttons =
        document.querySelectorAll(".answer-option");

    const index =
        key.charCodeAt(0) - 65;

    if (buttons[index]) {
        buttons[index].click();
    }

});


/* =========================================================
   PREVENT ACCIDENTAL FORM SUBMISSION
   ========================================================= */

document.addEventListener("submit", event => {
    event.preventDefault();
});


/* =========================================================
   START
   ========================================================= */

startGame();
