/*
=========================================================
WHO IS LYING?
Detective deduction game
=========================================================
*/


/* =====================================================
   DOM
===================================================== */

const startScreen =
    document.getElementById("startScreen");

const game =
    document.getElementById("game");

const resultScreen =
    document.getElementById("resultScreen");

const startButton =
    document.getElementById("startButton");

const nextButton =
    document.getElementById("nextButton");

const caseNumber =
    document.getElementById("caseNumber");

const timerElement =
    document.getElementById("timer");

const caseTitle =
    document.getElementById("caseTitle");

const caseDescription =
    document.getElementById("caseDescription");

const sceneIcon =
    document.getElementById("sceneIcon");

const sceneTitle =
    document.getElementById("sceneTitle");

const sceneDescription =
    document.getElementById("sceneDescription");

const suspectContainer =
    document.getElementById("suspectContainer");

const clueContainer =
    document.getElementById("clueContainer");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const scoreElement =
    document.getElementById("score");


/* =====================================================
   GAME STATE
===================================================== */

let currentCase = 0;

let score = 0;

let timeLeft = 60;

let timer = null;

let selectedSuspect = null;

let gameActive = false;


/* =====================================================
   CASES
===================================================== */

const cases = [

    {
        title:
            "The Missing Diamond",

        description:
            "A priceless diamond disappeared from Blackwood Mansion during dinner.",

        sceneIcon:
            "💎",

        sceneTitle:
            "Blackwood Mansion",

        sceneDescription:
            "The diamond vanished between 8:00 PM and 8:30 PM.",

        suspects: [

            {
                name: "Arthur",

                role: "THE BUTLER",

                avatar: "🧔",

                statement:
                    "I was preparing dinner in the kitchen the entire time.",

                guilty: false
            },

            {
                name: "Clara",

                role: "THE ACTRESS",

                avatar: "👩",

                statement:
                    "I was upstairs in my room. I never came downstairs.",

                guilty: true
            },

            {
                name: "Marcus",

                role: "THE GUARD",

                avatar: "🧑‍✈️",

                statement:
                    "I was watching the front entrance all evening.",

                guilty: false
            }

        ],

        clues: [

            "The kitchen clock shows 8:15 PM.",

            "A muddy footprint was found near the upstairs staircase.",

            "The front door camera shows nobody entering the mansion.",

            "Clara's shoes have fresh mud on them."
        ]
    },


    {
        title:
            "The Broken Vase",

        description:
            "An ancient vase was smashed in the museum after closing time.",

        sceneIcon:
            "🏺",

        sceneTitle:
            "Royal Museum",

        sceneDescription:
            "The security alarm activated at exactly 10:17 PM.",

        suspects: [

            {
                name: "David",

                role: "THE SECURITY GUARD",

                avatar: "👮",

                statement:
                    "I was sitting at the security desk when the alarm went off.",

                guilty: false
            },

            {
                name: "Emma",

                role: "THE CURATOR",

                avatar: "👩‍💼",

                statement:
                    "I left the museum at 9:30 PM.",

                guilty: true
            },

            {
                name: "Victor",

                role: "THE JANITOR",

                avatar: "🧹",

                statement:
                    "I was cleaning the west hallway all evening.",

                guilty: false
            }

        ],

        clues: [

            "The west hallway camera stopped recording at 10:10 PM.",

            "A museum access card was used at 10:15 PM.",

            "The curator's card was found beside the broken vase.",

            "The front door was locked from the inside."
        ]
    },


    {
        title:
            "The Stolen Painting",

        description:
            "A famous painting disappeared from a locked gallery.",

        sceneIcon:
            "🖼️",

        sceneTitle:
            "The Grand Gallery",

        sceneDescription:
            "Only three people were inside the building.",

        suspects: [

            {
                name: "Helen",

                role: "THE ARTIST",

                avatar: "🎨",

                statement:
                    "I was painting in Studio B and never entered the gallery.",

                guilty: false
            },

            {
                name: "James",

                role: "THE COLLECTOR",

                avatar: "🕴️",

                statement:
                    "I was admiring paintings in the east wing.",

                guilty: true
            },

            {
                name: "Robert",

                role: "THE SECURITY OFFICER",

                avatar: "👮",

                statement:
                    "I remained in the control room watching the cameras.",

                guilty: false
            }

        ],

        clues: [

            "The east-wing camera recorded nobody after 9:00 PM.",

            "Paint was found on the gallery door handle.",

            "The collector was wearing gloves.",

            "A hidden passage connects Studio B to the gallery."
        ]
    },


    {
        title:
            "The Poisoned Tea",

        description:
            "A wealthy businessman collapsed after drinking his evening tea.",

        sceneIcon:
            "☕",

        sceneTitle:
            "Ravenwood Estate",

        sceneDescription:
            "The tea was served at 7:45 PM.",

        suspects: [

            {
                name: "Sophia",

                role: "THE HOUSEKEEPER",

                avatar: "👩",

                statement:
                    "I prepared the tea but left immediately afterward.",

                guilty: false
            },

            {
                name: "Daniel",

                role: "THE BROTHER",

                avatar: "👨",

                statement:
                    "I was outside making a phone call.",

                guilty: true
            },

            {
                name: "Edward",

                role: "THE DRIVER",

                avatar: "🚗",

                statement:
                    "I was waiting in the garage.",

                guilty: false
            }

        ],

        clues: [

            "The poison was added after the tea was prepared.",

            "The victim's phone records show no outgoing call.",

            "A poison bottle was found near the garden door.",

            "Daniel's shoes had fresh garden soil."
        ]
    },


    {
        title:
            "The Vanishing Necklace",

        description:
            "A priceless necklace disappeared during a charity party.",

        sceneIcon:
            "📿",

        sceneTitle:
            "The Grand Ballroom",

        sceneDescription:
            "The necklace vanished during a five-minute blackout.",

        suspects: [

            {
                name: "Olivia",

                role: "THE HOST",

                avatar: "👩",

                statement:
                    "I remained beside the guests throughout the blackout.",

                guilty: false
            },

            {
                name: "Thomas",

                role: "THE MAGICIAN",

                avatar: "🎩",

                statement:
                    "I was performing on stage when the lights went out.",

                guilty: false
            },

            {
                name: "Henry",

                role: "THE GUEST",

                avatar: "🧑",

                statement:
                    "I went outside because the room became too dark.",

                guilty: true
            }

        ],

        clues: [

            "The exit door alarm was never activated.",

            "A black glove was found behind the display case.",

            "The guest's jacket was found inside the ballroom.",

            "The stage lights remained powered during the blackout."
        ]
    }

];


/* =====================================================
   START GAME
===================================================== */

startButton.addEventListener(
    "click",
    () => {

        startScreen.classList.add(
            "hidden"
        );

        game.classList.remove(
            "hidden"
        );

        currentCase = 0;

        score = 0;

        loadCase();
    }
);


/* =====================================================
   LOAD CASE
===================================================== */

function loadCase() {

    const data =
        cases[currentCase];

    selectedSuspect = null;

    gameActive = true;

    /*
    Timer gets slightly shorter
    on harder cases.
    */

    timeLeft =
        Math.max(
            35,
            60 -
            currentCase * 5
        );


    /*
    Header
    */

    caseNumber.textContent =
        String(
            currentCase + 1
        ).padStart(2, "0");


    timerElement.textContent =
        timeLeft;

    timerElement.classList.remove(
        "danger"
    );


    /*
    Case information
    */

    caseTitle.textContent =
        data.title;

    caseDescription.textContent =
        data.description;


    sceneIcon.textContent =
        data.sceneIcon;

    sceneTitle.textContent =
        data.sceneTitle;

    sceneDescription.textContent =
        data.sceneDescription;


    /*
    Suspects
    */

    suspectContainer.innerHTML = "";


    data.suspects.forEach(
        (suspect, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "suspect";


            card.innerHTML = `

                <div class="suspect-avatar">
                    ${suspect.avatar}
                </div>

                <h4>
                    ${suspect.name}
                </h4>

                <span class="role">
                    ${suspect.role}
                </span>

                <div class="statement">
                    "${suspect.statement}"
                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    selectSuspect(
                        index,
                        card
                    );
                }
            );


            suspectContainer.appendChild(
                card
            );
        }
    );


    /*
    Clues
    */

    clueContainer.innerHTML = "";


    data.clues.forEach(
        (clue, index) => {

            const clueElement =
                document.createElement(
                    "div"
                );

            clueElement.className =
                "clue";


            clueElement.innerHTML = `

                <strong>
                    ${index + 1}.
                </strong>

                ${clue}

            `;


            clueContainer.appendChild(
                clueElement
            );
        }
    );


    startTimer();
}


/* =====================================================
   SELECT SUSPECT
===================================================== */

function selectSuspect(
    index,
    card
) {

    if (!gameActive) return;


    /*
    Prevent accidental double-clicks.
    */

    if (selectedSuspect !== null) {
        return;
    }


    selectedSuspect =
        index;


    card.classList.add(
        "selected"
    );


    /*
    Short delay makes the
    choice feel deliberate.
    */

    setTimeout(
        evaluateAnswer,
        350
    );
}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    clearInterval(timer);


    timer =
        setInterval(
            () => {

                if (!gameActive) {
                    return;
                }


                timeLeft--;


                timerElement.textContent =
                    timeLeft;


                if (timeLeft <= 10) {

                    timerElement.classList.add(
                        "danger"
                    );
                }


                if (timeLeft <= 0) {

                    clearInterval(timer);

                    timeExpired();
                }

            },
            1000
        );
}


/* =====================================================
   TIME EXPIRED
===================================================== */

function timeExpired() {

    gameActive = false;

    const data =
        cases[currentCase];

    const guilty =
        data.suspects.find(
            suspect =>
                suspect.guilty
        );


    showResult(
        false,
        "TIME RAN OUT",
        `
        The case went cold.

        <br><br>

        The liar was
        <strong>${guilty.name}</strong>.
        `
    );
}


/* =====================================================
   EVALUATE
===================================================== */

function evaluateAnswer() {

    clearInterval(timer);

    gameActive = false;

    const data =
        cases[currentCase];

    const chosen =
        data.suspects[
            selectedSuspect
        ];

    const guilty =
        data.suspects.find(
            suspect =>
                suspect.guilty
        );


    if (chosen.guilty) {

        /*
        Base points
        */

        let points = 100;


        /*
        Time bonus
        */

        points +=
            timeLeft * 2;


        /*
        Harder cases
        */

        points +=
            currentCase * 50;


        score += points;


        showResult(
            true,

            "CASE SOLVED",

            `
            Excellent detective work.

            <br><br>

            <strong>
                ${chosen.name}
            </strong>
            was lying.

            <br><br>

            You earned
            <strong>${points}</strong>
            points.
            `
        );

    } else {

        showResult(
            false,

            "WRONG SUSPECT",

            `
            ${chosen.name}
            was telling the truth.

            <br><br>

            The real liar was
            <strong>${guilty.name}</strong>.
            `
        );
    }
}

const swipeHint = document.querySelector(".swipe-hint");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        swipeHint.style.opacity = "0";
        swipeHint.style.pointerEvents = "none";
    }
});

/* =====================================================
   SHOW RESULT
===================================================== */

function showResult(
    correct,
    title,
    text
) {

    resultScreen.classList.remove(
        "hidden"
    );

    resultIcon.textContent =
        correct
            ? "🕵️"
            : "❌";


    resultTitle.textContent =
        title;


    resultText.innerHTML =
        text;


    scoreElement.textContent =
        score;


    /*
    Last case
    */

    if (
        currentCase >=
        cases.length - 1
    ) {

        nextButton.textContent =
            "FINISH CASES";

    } else {

        nextButton.textContent =
            "NEXT CASE";
    }
}


/* =====================================================
   NEXT CASE
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        resultScreen.classList.add(
            "hidden"
        );


        /*
        Finished all cases
        */

        if (
            currentCase >=
            cases.length - 1
        ) {

            showFinalScore();

            return;
        }


        currentCase++;

        loadCase();
    }
);


/* =====================================================
   FINAL SCORE
===================================================== */

function showFinalScore() {

    game.classList.add(
        "hidden"
    );

    resultScreen.classList.remove(
        "hidden"
    );


    resultIcon.textContent =
        "🏆";


    resultTitle.textContent =
        "CASES COMPLETE";


    let rating;


    if (score >= 900) {

        rating =
            "MASTER DETECTIVE";

    } else if (score >= 650) {

        rating =
            "EXCELLENT DETECTIVE";

    } else if (score >= 400) {

        rating =
            "GOOD DETECTIVE";

    } else {

        rating =
            "ROOKIE DETECTIVE";
    }


    resultText.innerHTML = `

        You completed all
        ${cases.length}
        cases.

        <br><br>

        Detective rating:

        <strong>
            ${rating}
        </strong>

    `;


    scoreElement.textContent =
        score;


    nextButton.textContent =
        "PLAY AGAIN";


    /*
    Change button behavior
    */

    nextButton.onclick =
        restartGame;
}


/* =====================================================
   RESTART
===================================================== */

function restartGame() {

    resultScreen.classList.add(
        "hidden"
    );

    game.classList.remove(
        "hidden"
    );


    currentCase = 0;

    score = 0;


    /*
    Restore normal button.
    */

    nextButton.onclick =
        null;


    loadCase();
}
