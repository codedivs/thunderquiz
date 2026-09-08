/* ==========================================
   NEON BLASTER - GAME ENGINE
   Desktop + Clean Mobile Touch Controls
========================================== */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const levelElement = document.getElementById("level");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const finalScoreElement = document.getElementById("finalScore");


/* ==========================================
   CANVAS SIZE
========================================== */

canvas.width = 900;
canvas.height = 560;


/* ==========================================
   GAME VARIABLES
========================================== */

let gameRunning = false;

let score = 0;
let lives = 3;
let level = 1;

let animationId;

let keys = {};

let bullets = [];
let enemies = [];
let particles = [];
let stars = [];

let enemySpawnTimer = 0;
let lastTime = 0;

let shootCooldown = 0;


/* ==========================================
   MOBILE TOUCH VARIABLES
========================================== */

let touchActive = false;
let touchX = 0;


/* ==========================================
   PLAYER
========================================== */

const player = {

    x: canvas.width / 2,
    y: canvas.height - 80,

    width: 55,
    height: 65,

    speed: 420,

    color: "#00f7ff"

};


/* ==========================================
   CREATE STAR BACKGROUND
========================================== */

function createStars() {

    stars = [];

    for (let i = 0; i < 120; i++) {

        stars.push({

            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,

            size: Math.random() * 2 + 0.5,

            speed: Math.random() * 40 + 20

        });

    }

}


/* ==========================================
   DRAW STARS
========================================== */

function updateStars(deltaTime) {

    stars.forEach(star => {

        star.y += star.speed * deltaTime;

        if (star.y > canvas.height) {

            star.y = -5;
            star.x = Math.random() * canvas.width;

        }

    });

}


function drawStars() {

    stars.forEach(star => {

        ctx.fillStyle = "white";

        ctx.globalAlpha = 0.5 + Math.random() * 0.5;

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

    });

    ctx.globalAlpha = 1;

}


/* ==========================================
   DRAW PLAYER SPACESHIP
========================================== */

function drawPlayer() {

    ctx.save();

    ctx.translate(player.x, player.y);


    /* Engine glow */

    const glow = ctx.createRadialGradient(
        0,
        25,
        0,
        0,
        25,
        45
    );

    glow.addColorStop(0, "#00f7ff");
    glow.addColorStop(1, "transparent");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        0,
        25,
        40,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Ship body */

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#00f7ff";

    ctx.fillStyle = "#00d9ff";

    ctx.beginPath();

    ctx.moveTo(0, -35);

    ctx.lineTo(28, 28);

    ctx.lineTo(0, 15);

    ctx.lineTo(-28, 28);

    ctx.closePath();

    ctx.fill();


    /* Cockpit */

    ctx.shadowBlur = 10;

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        0,
        -5,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Wings */

    ctx.fillStyle = "#ff3bd4";

    ctx.beginPath();

    ctx.moveTo(-15, 15);
    ctx.lineTo(-42, 35);
    ctx.lineTo(-18, 35);

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(15, 15);
    ctx.lineTo(42, 35);
    ctx.lineTo(18, 35);

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* ==========================================
   PLAYER MOVEMENT
========================================== */

function updatePlayer(deltaTime) {

    /* Desktop keyboard */

    if (
        keys["ArrowLeft"] ||
        keys["a"] ||
        keys["A"]
    ) {

        player.x -= player.speed * deltaTime;

    }


    if (
        keys["ArrowRight"] ||
        keys["d"] ||
        keys["D"]
    ) {

        player.x += player.speed * deltaTime;

    }


    /* Mobile finger control */

    if (touchActive) {

        const difference = touchX - player.x;

        /*
           Smoothly follow finger.
           This prevents sudden jumping.
        */

        player.x += difference * 8 * deltaTime;

    }


    /* Keep player inside screen */

    if (player.x < 45) {

        player.x = 45;

    }

    if (player.x > canvas.width - 45) {

        player.x = canvas.width - 45;

    }

}


/* ==========================================
   SHOOT LASER
========================================== */

function shoot() {

    if (shootCooldown > 0) return;


    bullets.push({

        x: player.x,
        y: player.y - 35,

        width: 7,
        height: 24,

        speed: 700

    });


    shootCooldown = 0.25;

}


/* ==========================================
   UPDATE BULLETS
========================================== */

function updateBullets(deltaTime) {

    bullets.forEach(bullet => {

        bullet.y -= bullet.speed * deltaTime;

    });


    bullets = bullets.filter(
        bullet => bullet.y > -50
    );

}


/* ==========================================
   DRAW BULLETS
========================================== */

function drawBullets() {

    bullets.forEach(bullet => {

        ctx.save();

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ff99";

        ctx.fillStyle = "#00ff99";

        ctx.fillRect(

            bullet.x - bullet.width / 2,
            bullet.y,
            bullet.width,
            bullet.height

        );

        ctx.restore();

    });

}


/* ==========================================
   CREATE ENEMY
========================================== */

function spawnEnemy() {

    const size = 30 + Math.random() * 20;


    enemies.push({

        x:
            50 +
            Math.random() *
            (canvas.width - 100),

        y: -60,

        width: size,
        height: size,

        speed:
            80 +
            Math.random() * 70 +
            level * 15,

        rotation: 0,

        rotationSpeed:
            Math.random() * 2 - 1

    });

}


/* ==========================================
   UPDATE ENEMIES
========================================== */

function updateEnemies(deltaTime) {

    enemies.forEach(enemy => {

        enemy.y += enemy.speed * deltaTime;

        enemy.rotation +=
            enemy.rotationSpeed * deltaTime;

    });


    /* Enemy reaches bottom */

    for (let i = enemies.length - 1; i >= 0; i--) {

        if (enemies[i].y > canvas.height + 60) {

            enemies.splice(i, 1);

            loseLife();

        }

    }

}


/* ==========================================
   DRAW ENEMIES
========================================== */

function drawEnemies() {

    enemies.forEach(enemy => {

        ctx.save();

        ctx.translate(
            enemy.x,
            enemy.y
        );

        ctx.rotate(
            enemy.rotation
        );

        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff2d95";

        ctx.fillStyle = "#ff2d95";

        ctx.beginPath();

        ctx.moveTo(0, -enemy.height / 2);

        ctx.lineTo(
            enemy.width / 2,
            enemy.height / 2
        );

        ctx.lineTo(
            0,
            enemy.height / 3
        );

        ctx.lineTo(
            -enemy.width / 2,
            enemy.height / 2
        );

        ctx.closePath();

        ctx.fill();


        /* Enemy eye */

        ctx.shadowBlur = 10;

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    });

}


/* ==========================================
   COLLISION DETECTION
========================================== */

function checkCollisions() {

    /* Bullet vs Enemy */

    for (
        let bulletIndex = bullets.length - 1;
        bulletIndex >= 0;
        bulletIndex--
    ) {

        const bullet = bullets[bulletIndex];

        for (
            let enemyIndex = enemies.length - 1;
            enemyIndex >= 0;
            enemyIndex--
        ) {

            const enemy = enemies[enemyIndex];

            const distanceX =
                Math.abs(bullet.x - enemy.x);

            const distanceY =
                Math.abs(bullet.y - enemy.y);


            if (

                distanceX <
                enemy.width / 2 + 10

                &&

                distanceY <
                enemy.height / 2 + 20

            ) {

                createExplosion(
                    enemy.x,
                    enemy.y
                );

                enemies.splice(enemyIndex, 1);

                bullets.splice(bulletIndex, 1);

                score += 10;

                scoreElement.textContent = score;

                updateLevel();

                break;

            }

        }

    }


    /* Enemy vs Player */

    for (
        let index = enemies.length - 1;
        index >= 0;
        index--
    ) {

        const enemy = enemies[index];

        const distanceX =
            Math.abs(player.x - enemy.x);

        const distanceY =
            Math.abs(player.y - enemy.y);


        if (

            distanceX <
            enemy.width / 2 + 25

            &&

            distanceY <
            enemy.height / 2 + 30

        ) {

            createExplosion(
                enemy.x,
                enemy.y
            );

            enemies.splice(index, 1);

            loseLife();

        }

    }

}


/* ==========================================
   EXPLOSION PARTICLES
========================================== */

function createExplosion(x, y) {

    for (let i = 0; i < 25; i++) {

        particles.push({

            x: x,
            y: y,

            velocityX:
                (Math.random() - 0.5) * 350,

            velocityY:
                (Math.random() - 0.5) * 350,

            size:
                Math.random() * 6 + 2,

            life: 1,

            decay:
                Math.random() * 1.5 + 1

        });

    }

}


function updateParticles(deltaTime) {

    particles.forEach(particle => {

        particle.x +=
            particle.velocityX * deltaTime;

        particle.y +=
            particle.velocityY * deltaTime;

        particle.life -=
            particle.decay * deltaTime;

    });


    particles = particles.filter(
        particle => particle.life > 0
    );

}


function drawParticles() {

    particles.forEach(particle => {

        ctx.save();

        ctx.globalAlpha = particle.life;

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffcc00";

        ctx.fillStyle = "#ff8c00";

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    });

}


/* ==========================================
   LOSE LIFE
========================================== */

function loseLife() {

    if (!gameRunning) return;

    lives--;

    if (lives < 0) {

        lives = 0;

    }

    updateLives();


    if (lives <= 0) {

        endGame();

    }

}


/* ==========================================
   UPDATE LIVES DISPLAY
========================================== */

function updateLives() {

    let hearts = "";

    for (let i = 0; i < lives; i++) {

        hearts += "❤️ ";

    }

    livesElement.textContent =
        hearts || "💀";

}


/* ==========================================
   LEVEL SYSTEM
========================================== */

function updateLevel() {

    const newLevel =
        Math.floor(score / 100) + 1;


    if (newLevel > level) {

        level = newLevel;

        levelElement.textContent = level;

    }

}


/* ==========================================
   UPDATE GAME
========================================== */

function update(deltaTime) {

    updateStars(deltaTime);

    updatePlayer(deltaTime);

    updateBullets(deltaTime);

    updateEnemies(deltaTime);

    updateParticles(deltaTime);

    checkCollisions();


    /* Desktop shooting */

    if (keys[" "]) {

        shoot();

    }


    /*
       MOBILE AUTO SHOOT

       Mobile players only need to
       drag the ship left and right.
    */

    if (touchActive) {

        shoot();

    }


    /* Shoot cooldown */

    if (shootCooldown > 0) {

        shootCooldown -= deltaTime;

    }


    /* Enemy spawning */

    enemySpawnTimer += deltaTime;


    const spawnRate = Math.max(
        0.35,
        1.2 - level * 0.08
    );


    if (enemySpawnTimer > spawnRate) {

        spawnEnemy();

        enemySpawnTimer = 0;

    }

}


/* ==========================================
   DRAW GAME
========================================== */

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawStars();

    drawBullets();

    drawEnemies();

    drawParticles();

    drawPlayer();

}


/* ==========================================
   MAIN GAME LOOP
========================================== */

function gameLoop(timestamp) {

    if (!gameRunning) return;


    const deltaTime = Math.min(

        (timestamp - lastTime) / 1000,

        0.05

    );


    lastTime = timestamp;


    update(deltaTime);

    draw();


    animationId =
        requestAnimationFrame(gameLoop);

}


/* ==========================================
   START GAME
========================================== */

function startGame() {

    score = 0;

    lives = 3;

    level = 1;

    bullets = [];

    enemies = [];

    particles = [];

    enemySpawnTimer = 0;

    shootCooldown = 0;

    touchActive = false;


    player.x = canvas.width / 2;

    player.y = canvas.height - 80;


    scoreElement.textContent = score;

    levelElement.textContent = level;

    updateLives();

    createStars();


    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");


    gameRunning = true;

    lastTime = performance.now();


    requestAnimationFrame(gameLoop);

}


/* ==========================================
   END GAME
========================================== */

function endGame() {

    gameRunning = false;

    touchActive = false;

    cancelAnimationFrame(animationId);


    finalScoreElement.textContent = score;


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* ==========================================
   DESKTOP KEYBOARD CONTROLS
========================================== */

document.addEventListener(
    "keydown",
    event => {

        keys[event.key] = true;


        if (

            event.key === " " ||

            event.key === "ArrowLeft" ||

            event.key === "ArrowRight"

        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[event.key] = false;

    }
);


/* ==========================================
   MOBILE TOUCH CONTROLS
   Drag directly on the canvas
========================================== */

function getTouchCanvasX(clientX) {

    const rect =
        canvas.getBoundingClientRect();


    /*
       Convert phone screen position
       into the canvas coordinate system.
    */

    return (
        (clientX - rect.left) /
        rect.width
    ) * canvas.width;

}


/* Touch starts */

canvas.addEventListener(
    "touchstart",
    event => {

        if (!gameRunning) return;

        event.preventDefault();

        const touch =
            event.touches[0];


        touchX =
            getTouchCanvasX(
                touch.clientX
            );


        touchActive = true;

    },

    { passive: false }

);


/* Finger moves */

canvas.addEventListener(
    "touchmove",
    event => {

        if (!gameRunning) return;

        event.preventDefault();

        const touch =
            event.touches[0];


        touchX =
            getTouchCanvasX(
                touch.clientX
            );


        touchActive = true;

    },

    { passive: false }

);


/* Finger leaves screen */

canvas.addEventListener(
    "touchend",
    () => {

        touchActive = false;

    }
);


/* Touch cancelled */

canvas.addEventListener(
    "touchcancel",
    () => {

        touchActive = false;

    }
);


/* ==========================================
   BUTTON EVENTS
========================================== */

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    startGame
);


/* ==========================================
   INITIAL BACKGROUND
========================================== */

createStars();

draw();

