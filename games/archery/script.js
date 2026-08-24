const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const arrowsElement = document.getElementById("arrows");
const messageElement = document.getElementById("message");
const powerFill = document.getElementById("powerFill");

const instructions = document.getElementById("instructions");
const gameOver = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

let W = 0;
let H = 0;

let gameRunning = false;

let score = 0;
let arrows = 10;


/* =========================================================
   SAMURAI
========================================================= */

const samurai = {
    x: 0,
    y: 0,

    // The samurai always faces toward the target.
    // We use a fixed shooting direction, but the arrow
    // is aimed naturally toward the target.
    shootingAngle: 0
};


/* =========================================================
   TARGET
========================================================= */

const target = {
    x: 0,
    y: 0,

    radius: 68,

    speed: 2.3,
    direction: 1
};


/* =========================================================
   MOUSE DRAWING
========================================================= */

const mouse = {

    down: false,

    startX: 0,
    startY: 0,

    x: 0,
    y: 0
};


/* =========================================================
   BOW
========================================================= */

const bow = {

    power: 0,

    maxPower: 100,

    angle: 0
};


/* =========================================================
   ARROW
========================================================= */

const arrow = {

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,

    flying: false,

    trail: []
};


/* =========================================================
   PARTICLES
========================================================= */

let particles = [];


/* =========================================================
   MESSAGE
========================================================= */

const hitMessage = {

    text: "",
    timer: 0,
    color: "#ffffff"
};


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;

    /*
    Samurai stays in the lower-left.
    */

    samurai.x = W * 0.16;
    samurai.y = H * 0.76;

    /*
    Target stays toward the right.
    */

    target.x = W * 0.78;

    if (!gameRunning) {
        target.y = H * 0.42;
    }
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


/* =========================================================
   GET AIM ANGLE
========================================================= */

function getAimAngle() {

    /*
    The arrow always points from the samurai
    toward the target.

    This prevents the arrow from accidentally
    pointing southwest or toward the bottom.
    */

    return Math.atan2(
        target.y - samurai.y,
        target.x - samurai.x
    );
}


/* =========================================================
   MOUSE DOWN
========================================================= */

window.addEventListener(
    "mousedown",
    (event) => {

        if (!gameRunning) return;
        if (arrow.flying) return;

        mouse.down = true;

        mouse.startX = event.clientX;
        mouse.startY = event.clientY;

        mouse.x = event.clientX;
        mouse.y = event.clientY;

        messageElement.textContent =
            "PULL DOWN TO DRAW";
    }
);


/* =========================================================
   MOUSE MOVE
========================================================= */

window.addEventListener(
    "mousemove",
    (event) => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

        if (
            !mouse.down ||
            !gameRunning ||
            arrow.flying
        ) {
            return;
        }

        /*
        Only vertical movement matters.

        Dragging downward = more power.
        */

        const distance =
            mouse.y - mouse.startY;

        const maxPull = 180;

        const pull =
            Math.max(
                0,
                Math.min(
                    maxPull,
                    distance
                )
            );

        bow.power =
            (pull / maxPull) * 100;

        powerFill.style.width =
            bow.power + "%";

        if (bow.power > 5) {

            messageElement.textContent =
                "KEEP PULLING • PRESS SPACE TO SHOOT";
        }
    }
);


/* =========================================================
   MOUSE UP
========================================================= */

window.addEventListener(
    "mouseup",
    () => {

        mouse.down = false;

        if (!gameRunning) return;

        if (!arrow.flying) {

            messageElement.textContent =
                "PULL DOWN • PRESS SPACE";
        }
    }
);


/* =========================================================
   SPACE TO SHOOT
========================================================= */

window.addEventListener(
    "keydown",
    (event) => {

        if (event.code !== "Space") return;

        event.preventDefault();

        if (!gameRunning) return;

        if (arrow.flying) return;

        shootArrow();
    }
);


/* =========================================================
   SHOOT
========================================================= */

function shootArrow() {

    if (bow.power < 8) {

        showMessage(
            "PULL DOWN FIRST!",
            1000,
            "#ffcc55"
        );

        return;
    }

    if (arrows <= 0) {

        endGame();

        return;
    }

    arrows--;

    arrowsElement.textContent =
        arrows;


    /*
    Calculate the angle at the exact moment
    of shooting.
    */

    bow.angle =
        getAimAngle();


    /*
    The arrow starts at the bow's nocking point.
    */

    const nock =
        getNockPoint();

    arrow.x = nock.x;
    arrow.y = nock.y;


    /*
    Aim directly at target.
    */

    const dx =
        Math.cos(bow.angle);

    const dy =
        Math.sin(bow.angle);


    /*
    Power controls speed.
    */

    const power =
        bow.power / 100;

    const minSpeed = 10;
    const maxSpeed = 31;

    const speed =
        minSpeed +
        power *
        (maxSpeed - minSpeed);


    arrow.vx =
        dx * speed;

    arrow.vy =
        dy * speed;

    arrow.flying = true;

    arrow.trail = [];


    /*
    Reset bow.
    */

    bow.power = 0;

    powerFill.style.width = "0%";

    mouse.down = false;

    messageElement.textContent =
        "SHOOT!";
}


/* =========================================================
   NOCK POINT
========================================================= */

function getNockPoint() {

    /*
    Pull the arrow backward along its aiming direction.

    This is the important part:

    The arrow never points along one end
    of the bow.

    It is always aligned with the target.
    */

    const angle =
        getAimAngle();

    const pull =
        (bow.power / 100) * 60;

    return {

        x:
            samurai.x -
            Math.cos(angle) * pull,

        y:
            samurai.y -
            Math.sin(angle) * pull
    };
}


/* =========================================================
   UPDATE
========================================================= */

function update() {

    if (!gameRunning) return;


    /*
    TARGET MOVEMENT
    */

    target.y +=
        target.speed *
        target.direction;

    const top =
        H * 0.20;

    const bottom =
        H * 0.67;

    if (target.y <= top) {

        target.y = top;

        target.direction = 1;
    }

    if (target.y >= bottom) {

        target.y = bottom;

        target.direction = -1;
    }


    /*
    ARROW PHYSICS
    */

    if (arrow.flying) {

        arrow.trail.push({

            x: arrow.x,

            y: arrow.y
        });

        if (arrow.trail.length > 14) {

            arrow.trail.shift();
        }


        /*
        Small amount of gravity.
        */

        arrow.vy += 0.12;


        arrow.x += arrow.vx;
        arrow.y += arrow.vy;


        /*
        TARGET COLLISION
        */

        const dx =
            arrow.x - target.x;

        const dy =
            arrow.y - target.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            target.radius
        ) {

            hitTarget(distance);

            arrow.flying = false;
        }


        /*
        Missed screen.
        */

        if (
            arrow.x < -200 ||
            arrow.x > W + 200 ||
            arrow.y < -200 ||
            arrow.y > H + 200
        ) {

            arrow.flying = false;

            showMessage(
                "MISS!",
                900,
                "#ff7777"
            );

            if (arrows <= 0) {

                setTimeout(
                    endGame,
                    700
                );
            }
        }
    }


    /*
    PARTICLES
    */

    particles.forEach(
        particle => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            particle.vy +=
                0.08;

            particle.life -=
                0.025;
        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );


    if (hitMessage.timer > 0) {

        hitMessage.timer -= 16;
    }
}


/* =========================================================
   HIT TARGET
========================================================= */

function hitTarget(distance) {

    let points = 10;


    if (distance < 18) {

        points = 100;

        showMessage(
            "BULLSEYE! +100",
            1500,
            "#ffe052"
        );

    } else if (distance < 34) {

        points = 50;

        showMessage(
            "GREAT SHOT! +50",
            1300,
            "#70e887"
        );

    } else if (distance < 52) {

        points = 25;

        showMessage(
            "NICE HIT! +25",
            1100,
            "#70caff"
        );

    } else {

        points = 10;

        showMessage(
            "HIT! +10",
            1000,
            "#ffffff"
        );
    }


    score += points;

    scoreElement.textContent =
        score;


    createHitParticles(
        arrow.x,
        arrow.y
    );


    /*
    Move target to a new vertical position.
    */

    target.y =
        H * (
            0.25 +
            Math.random() * 0.38
        );


    /*
    Make target slightly faster.
    */

    target.speed += 0.1;
}


/* =========================================================
   PARTICLES
========================================================= */

function createHitParticles(x, y) {

    for (let i = 0; i < 35; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            2 +
            Math.random() * 6;

        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 1,

            color:
                Math.random() > 0.5
                    ? "#ffd84f"
                    : "#ffffff"
        });
    }
}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    text,
    duration,
    color
) {

    hitMessage.text =
        text;

    hitMessage.timer =
        duration;

    hitMessage.color =
        color;

    messageElement.textContent =
        text;
}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#152c35"
    );

    gradient.addColorStop(
        0.55,
        "#315b48"
    );

    gradient.addColorStop(
        1,
        "#102116"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
    Moon
    */

    ctx.beginPath();

    ctx.arc(
        W * 0.78,
        H * 0.14,
        42,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,235,170,0.9)";

    ctx.fill();


    /*
    Mountains
    */

    ctx.fillStyle =
        "rgba(10,25,18,0.48)";

    ctx.beginPath();

    ctx.moveTo(
        0,
        H * 0.65
    );

    ctx.lineTo(
        W * 0.20,
        H * 0.42
    );

    ctx.lineTo(
        W * 0.40,
        H * 0.64
    );

    ctx.lineTo(
        W * 0.58,
        H * 0.39
    );

    ctx.lineTo(
        W * 0.80,
        H * 0.65
    );

    ctx.lineTo(
        W,
        H * 0.44
    );

    ctx.lineTo(
        W,
        H
    );

    ctx.lineTo(
        0,
        H
    );

    ctx.closePath();

    ctx.fill();


    /*
    Ground
    */

    ctx.fillStyle =
        "#19321f";

    ctx.fillRect(
        0,
        H * 0.70,
        W,
        H * 0.30
    );
}


/* =========================================================
   TARGET
========================================================= */

function drawTarget() {

    const x =
        target.x;

    const y =
        target.y;

    const r =
        target.radius;


    /*
    Target pole
    */

    ctx.strokeStyle =
        "#4a3020";

    ctx.lineWidth = 12;

    ctx.beginPath();

    ctx.moveTo(
        x,
        y + r
    );

    ctx.lineTo(
        x,
        H * 0.80
    );

    ctx.stroke();


    /*
    Outer circle
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#eee9d8";

    ctx.fill();

    ctx.strokeStyle =
        "#33251c";

    ctx.lineWidth = 5;

    ctx.stroke();


    /*
    Red
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r * 0.76,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#d84a3e";

    ctx.fill();


    /*
    White
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r * 0.53,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#f1ead9";

    ctx.fill();


    /*
    Inner red
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r * 0.31,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#d84a3e";

    ctx.fill();


    /*
    Bullseye
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r * 0.13,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#f8c63c";

    ctx.fill();
}


/* =========================================================
   SAMURAI
========================================================= */

function drawSamurai() {

    const x =
        samurai.x;

    const y =
        samurai.y;


    /*
    -----------------------------------------------------
    LEGS
    -----------------------------------------------------
    */

    ctx.strokeStyle =
        "#111820";

    ctx.lineWidth = 15;

    ctx.lineCap = "round";

    /*
    Back leg
    */

    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        y + 60
    );

    ctx.lineTo(
        x - 28,
        y + 120
    );

    ctx.stroke();


    /*
    Front leg
    */

    ctx.beginPath();

    ctx.moveTo(
        x + 12,
        y + 60
    );

    ctx.lineTo(
        x + 32,
        y + 120
    );

    ctx.stroke();


    /*
    Feet
    */

    ctx.lineWidth = 10;

    ctx.beginPath();

    ctx.moveTo(
        x - 28,
        y + 120
    );

    ctx.lineTo(
        x - 45,
        y + 122
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        x + 32,
        y + 120
    );

    ctx.lineTo(
        x + 48,
        y + 122
    );

    ctx.stroke();


    /*
    -----------------------------------------------------
    BODY ARMOR
    -----------------------------------------------------
    */

    ctx.fillStyle =
        "#17222b";

    ctx.beginPath();

    ctx.roundRect(
        x - 35,
        y - 15,
        70,
        85,
        14
    );

    ctx.fill();


    /*
    Armor plates
    */

    ctx.strokeStyle =
        "#6f4d31";

    ctx.lineWidth = 3;

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x - 30,
            y + i * 17
        );

        ctx.lineTo(
            x + 30,
            y + i * 17
        );

        ctx.stroke();
    }


    /*
    Shoulder armor
    */

    ctx.fillStyle =
        "#263541";

    ctx.beginPath();

    ctx.arc(
        x - 38,
        y - 4,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 38,
        y - 4,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    -----------------------------------------------------
    HEAD
    -----------------------------------------------------
    */

    ctx.fillStyle =
        "#b8754e";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 48,
        27,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Hair
    */

    ctx.fillStyle =
        "#11151a";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 55,
        28,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Samurai helmet
    */

    ctx.fillStyle =
        "#202b34";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 57,
        34,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /*
    Helmet crest
    */

    ctx.fillStyle =
        "#c49a3c";

    ctx.beginPath();

    ctx.moveTo(
        x,
        y - 95
    );

    ctx.lineTo(
        x - 9,
        y - 65
    );

    ctx.lineTo(
        x + 9,
        y - 65
    );

    ctx.closePath();

    ctx.fill();


    /*
    -----------------------------------------------------
    BACK ARM
    -----------------------------------------------------
    */

    ctx.strokeStyle =
        "#263541";

    ctx.lineWidth = 15;

    ctx.beginPath();

    ctx.moveTo(
        x + 28,
        y
    );

    ctx.lineTo(
        x + 65,
        y - 25
    );

    ctx.stroke();


    /*
    -----------------------------------------------------
    BOW
    -----------------------------------------------------
    */

    drawBow();


    /*
    -----------------------------------------------------
    FRONT ARM
    -----------------------------------------------------
    */

    ctx.strokeStyle =
        "#263541";

    ctx.lineWidth = 14;

    ctx.beginPath();

    ctx.moveTo(
        x + 30,
        y + 5
    );

    ctx.lineTo(
        x + 62,
        y - 5
    );

    ctx.stroke();
}


/* =========================================================
   BOW
========================================================= */

function drawBow() {

    /*
    The bow points from the samurai toward
    the target.

    This gives us a natural horizontal/right-facing
    archer pose instead of the previous southwest angle.
    */

    const angle =
        getAimAngle();

    bow.angle =
        angle;


    const x =
        samurai.x + 35;

    const y =
        samurai.y - 20;


    const length = 125;

    const curve = 42;


    const dx =
        Math.cos(angle);

    const dy =
        Math.sin(angle);


    const px =
        -Math.sin(angle);

    const py =
        Math.cos(angle);


    const topX =
        x + dx * length / 2;

    const topY =
        y + dy * length / 2;


    const bottomX =
        x - dx * length / 2;

    const bottomY =
        y - dy * length / 2;


    /*
    Bow wood
    */

    ctx.strokeStyle =
        "#89572c";

    ctx.lineWidth = 10;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        topX,
        topY
    );

    ctx.quadraticCurveTo(
        x + px * curve,
        y + py * curve,

        bottomX,
        bottomY
    );

    ctx.stroke();


    /*
    Bow highlight
    */

    ctx.strokeStyle =
        "#d49a54";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        topX,
        topY
    );

    ctx.quadraticCurveTo(
        x + px * curve,
        y + py * curve,

        bottomX,
        bottomY
    );

    ctx.stroke();


    /*
    STRING + NOCK
    */

    const nock =
        getNockPoint();


    ctx.strokeStyle =
        "#eee9dc";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        topX,
        topY
    );

    ctx.lineTo(
        nock.x,
        nock.y
    );

    ctx.lineTo(
        bottomX,
        bottomY
    );

    ctx.stroke();


    /*
    Arrow waiting to be fired.
    */

    if (!arrow.flying) {

        drawArrow(
            nock.x,
            nock.y,
            angle
        );
    }
}


/* =========================================================
   ARROW NOCK
========================================================= */

function getNockPoint() {

    const angle =
        getAimAngle();


    /*
    Arrow moves backward when drawn.

    The arrow remains perfectly aligned
    with the target.
    */

    const pull =
        (bow.power / 100) * 55;


    return {

        x:
            samurai.x +
            35 -
            Math.cos(angle) *
            pull,

        y:
            samurai.y -
            20 -
            Math.sin(angle) *
            pull
    };
}


/* =========================================================
   ARROW
========================================================= */

function drawArrow(
    x,
    y,
    angle
) {

    const length =
        105;


    const endX =
        x +
        Math.cos(angle) *
        length;


    const endY =
        y +
        Math.sin(angle) *
        length;


    /*
    Shaft
    */

    ctx.strokeStyle =
        "#e8ddbc";

    ctx.lineWidth = 4;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        x,
        y
    );

    ctx.lineTo(
        endX,
        endY
    );

    ctx.stroke();


    /*
    Arrowhead
    */

    const head =
        14;


    const left =
        angle +
        Math.PI * 0.82;


    const right =
        angle -
        Math.PI * 0.82;


    ctx.fillStyle =
        "#d8d8d0";


    ctx.beginPath();

    ctx.moveTo(
        endX,
        endY
    );

    ctx.lineTo(
        endX +
        Math.cos(left) *
        head,

        endY +
        Math.sin(left) *
        head
    );

    ctx.lineTo(
        endX +
        Math.cos(right) *
        head,

        endY +
        Math.sin(right) *
        head
    );

    ctx.closePath();

    ctx.fill();


    /*
    Feathers
    */

    ctx.fillStyle =
        "#b94e42";


    const featherX =
        x +
        Math.cos(angle) *
        20;


    const featherY =
        y +
        Math.sin(angle) *
        20;


    ctx.beginPath();

    ctx.moveTo(
        featherX,
        featherY
    );

    ctx.lineTo(
        featherX -
        Math.cos(angle) * 20 +
        Math.cos(
            angle +
            Math.PI / 2
        ) * 7,

        featherY -
        Math.sin(angle) * 20 +
        Math.sin(
            angle +
            Math.PI / 2
        ) * 7
    );

    ctx.lineTo(
        featherX -
        Math.cos(angle) * 20 -
        Math.cos(
            angle +
            Math.PI / 2
        ) * 7,

        featherY -
        Math.sin(angle) * 20 -
        Math.sin(
            angle +
            Math.PI / 2
        ) * 7
    );

    ctx.closePath();

    ctx.fill();
}


/* =========================================================
   FLYING ARROW
========================================================= */

function drawFlyingArrow() {

    if (!arrow.flying) return;


    /*
    Trail
    */

    arrow.trail.forEach(
        (point, index) => {

            const alpha =
                index /
                arrow.trail.length;


            ctx.fillStyle =
                `rgba(255,215,100,${alpha * 0.35})`;


            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                2 + alpha * 2,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    );


    /*
    Arrow rotates naturally according
    to its actual flight direction.
    */

    const angle =
        Math.atan2(
            arrow.vy,
            arrow.vx
        );


    drawArrow(
        arrow.x,
        arrow.y,
        angle
    );
}


/* =========================================================
   PARTICLES
========================================================= */

function drawParticles() {

    particles.forEach(
        particle => {

            ctx.globalAlpha =
                particle.life;

            ctx.fillStyle =
                particle.color;


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.globalAlpha = 1;
        }
    );
}


/* =========================================================
   HIT MESSAGE
========================================================= */

function drawHitMessage() {

    if (
        hitMessage.timer <= 0
    ) {
        return;
    }


    const alpha =
        Math.min(
            1,
            hitMessage.timer / 300
        );


    ctx.globalAlpha =
        alpha;


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 36px Arial";


    ctx.fillStyle =
        hitMessage.color;


    ctx.shadowColor =
        "rgba(0,0,0,0.7)";


    ctx.shadowBlur = 10;


    ctx.fillText(
        hitMessage.text,
        W / 2,
        H * 0.20
    );


    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
}


/* =========================================================
   RENDER
========================================================= */

function render() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    drawBackground();

    drawTarget();

    drawSamurai();

    drawFlyingArrow();

    drawParticles();

    drawHitMessage();
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    score = 0;
    arrows = 10;

    scoreElement.textContent =
        score;

    arrowsElement.textContent =
        arrows;


    bow.power = 0;

    arrow.flying = false;
    arrow.trail = [];


    target.speed = 2.3;
    target.direction = 1;

    target.x =
        W * 0.78;

    target.y =
        H * 0.42;


    particles = [];


    powerFill.style.width =
        "0%";


    messageElement.textContent =
        "PULL DOWN TO DRAW • SPACE TO SHOOT";


    gameRunning = true;
}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    if (!gameRunning) return;

    gameRunning = false;

    finalScore.textContent =
        score;

    gameOver.classList.remove(
        "hidden"
    );
}


/* =========================================================
   BUTTONS
========================================================= */

startButton.addEventListener(
    "click",
    () => {

        instructions.classList.add(
            "hidden"
        );

        startGame();
    }
);


restartButton.addEventListener(
    "click",
    () => {

        gameOver.classList.add(
            "hidden"
        );

        startGame();
    }
);


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop() {

    update();

    render();

    requestAnimationFrame(
        gameLoop
    );
}


gameLoop();
