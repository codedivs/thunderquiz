/* =========================================================
   THUNDERQUIZ CHESS
   Single-player chess
   Human = White
   Computer = Black

   Static browser-only chess engine.
========================================================= */

"use strict";

/* =========================================================
   DOM
========================================================= */

const boardElement = document.getElementById("chess-board");
const setupScreen = document.getElementById("setup-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-game");
const newGameButton = document.getElementById("new-game");
const undoButton = document.getElementById("undo-move");
const changeLevelButton = document.getElementById("change-level");

const playAgainButton = document.getElementById("play-again");
const resultLevelButton = document.getElementById("result-level-button");

const statusElement = document.getElementById("status");
const turnDisplay = document.getElementById("turn-display");
const moveCountElement = document.getElementById("move-count");
const levelDisplay = document.getElementById("level-display");
const computerLevel = document.getElementById("computer-level");

const gameMessage = document.getElementById("game-message");

const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const resultLevel = document.getElementById("result-level");
const resultMoves = document.getElementById("result-moves");

/* =========================================================
   CONSTANTS
========================================================= */

const WHITE = "w";
const BLACK = "b";

const PIECES = {
    wK: "♔",
    wQ: "♕",
    wR: "♖",
    wB: "♗",
    wN: "♘",
    wP: "♙",

    bK: "♚",
    bQ: "♛",
    bR: "♜",
    bB: "♝",
    bN: "♞",
    bP: "♟"
};

const PIECE_VALUES = {
    P: 100,
    N: 320,
    B: 330,
    R: 500,
    Q: 900,
    K: 20000
};

/*
 * Browser-safe difficulty levels.
 *
 * Beginner:
 *   Mostly simple moves.
 *
 * Intermediate:
 *   Shallow search.
 *
 * Advanced:
 *   Stronger search.
 *
 * Expert:
 *   Deeper search.
 *
 * Grandmaster:
 *   Deepest browser-safe search.
 */

const LEVELS = {
    beginner: {
        name: "BEGINNER",
        depth: 1,
        randomness: 0.50
    },

    intermediate: {
        name: "INTERMEDIATE",
        depth: 2,
        randomness: 0.16
    },

    advanced: {
        name: "ADVANCED",
        depth: 3,
        randomness: 0.03
    },

    expert: {
        name: "EXPERT",
        depth: 3,
        randomness: 0
    },

    grandmaster: {
        name: "GRANDMASTER",
        depth: 4,
        randomness: 0
    }
};

/* =========================================================
   INITIAL BOARD
========================================================= */

const INITIAL_BOARD = [
    "bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR",
    "bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP",

    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,

    "wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP",
    "wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"
];

/* =========================================================
   GAME STATE
========================================================= */

let board = [...INITIAL_BOARD];

let turn = WHITE;

let selectedSquare = null;

let legalMovesForSelected = [];

let moveHistory = [];

let stateHistory = [];

let positionHistory = [];

let currentLevel = "beginner";

let gameOver = false;

let computerThinking = false;

let lastMove = null;

let enPassantSquare = null;

let castlingRights = {
    wK: true,
    wQ: true,
    bK: true,
    bQ: true
};

/* =========================================================
   DIFFICULTY
========================================================= */

document.querySelectorAll(".difficulty-card").forEach(card => {
    card.addEventListener("click", () => {
        selectDifficulty(card.dataset.level);
    });
});

function selectDifficulty(level) {
    if (!LEVELS[level]) {
        level = "beginner";
    }

    currentLevel = level;

    document.querySelectorAll(".difficulty-card").forEach(card => {
        const selected = card.dataset.level === level;

        card.classList.toggle("selected", selected);
        card.setAttribute("aria-checked", selected ? "true" : "false");
    });
}

/* =========================================================
   BUTTONS
========================================================= */

startButton?.addEventListener("click", startGame);

newGameButton?.addEventListener("click", startGame);

playAgainButton?.addEventListener("click", startGame);

changeLevelButton?.addEventListener("click", showSetup);

resultLevelButton?.addEventListener("click", showSetup);

undoButton?.addEventListener("click", undoMove);

/* =========================================================
   START GAME
========================================================= */

function startGame() {
    board = [...INITIAL_BOARD];

    turn = WHITE;

    selectedSquare = null;

    legalMovesForSelected = [];

    moveHistory = [];

    stateHistory = [];

    positionHistory = [];

    gameOver = false;

    computerThinking = false;

    lastMove = null;

    enPassantSquare = null;

    castlingRights = {
        wK: true,
        wQ: true,
        bK: true,
        bQ: true
    };

    positionHistory.push(getPositionKey());

    setupScreen.hidden = true;
    resultScreen.hidden = true;
    gameScreen.hidden = false;

    const levelName = LEVELS[currentLevel].name;

    if (levelDisplay) {
        levelDisplay.textContent = levelName;
    }

    if (computerLevel) {
        computerLevel.textContent = levelName;
    }

    if (gameMessage) {
        gameMessage.textContent = "";
    }

    updateStatus();
    renderBoard();
}

/* =========================================================
   SETUP
========================================================= */

function showSetup() {
    gameScreen.hidden = true;
    resultScreen.hidden = true;
    setupScreen.hidden = false;
}

/* =========================================================
   BOARD RENDERING
========================================================= */

function renderBoard() {
    if (!boardElement) return;

    boardElement.innerHTML = "";

    for (let square = 0; square < 64; square++) {
        const row = Math.floor(square / 8);
        const col = square % 8;

        const tile = document.createElement("button");

        tile.type = "button";
        tile.className = "chess-square";

        tile.dataset.square = square;

        tile.setAttribute("role", "gridcell");

        tile.setAttribute(
            "aria-label",
            squareToName(square)
        );

        tile.classList.add(
            (row + col) % 2 === 0
                ? "light"
                : "dark"
        );

        /* Last move */

        if (
            lastMove &&
            (
                square === lastMove.from ||
                square === lastMove.to
            )
        ) {
            tile.classList.add("last-move");
        }

        /* Selected */

        if (selectedSquare === square) {
            tile.classList.add("selected");
        }

        /* Legal move */

        const legalMove = legalMovesForSelected.find(
            move => move.to === square
        );

        if (legalMove) {
            tile.classList.add("legal-move");

            if (board[square]) {
                tile.classList.add("capture-move");
            }
        }

        /* Check */

        if (
            board[square] &&
            board[square][1] === "K" &&
            isKingInCheck(
                board,
                board[square][0]
            )
        ) {
            tile.classList.add("in-check");
        }

        /* Piece */

        if (board[square]) {
            const piece = document.createElement("span");

            piece.className =
                board[square][0] === WHITE
                    ? "piece white-piece"
                    : "piece black-piece";

            piece.textContent = PIECES[board[square]];

            tile.appendChild(piece);
        }

        /* Rank */

        if (col === 0) {
            const rank = document.createElement("span");

            rank.className = "rank-label";
            rank.textContent = String(8 - row);

            tile.appendChild(rank);
        }

        /* File */

        if (row === 7) {
            const file = document.createElement("span");

            file.className = "file-label";
            file.textContent =
                String.fromCharCode(97 + col);

            tile.appendChild(file);
        }

        tile.addEventListener(
            "click",
            () => handleSquareClick(square)
        );

        boardElement.appendChild(tile);
    }
}

/* =========================================================
   PLAYER INPUT
========================================================= */

function handleSquareClick(square) {
    if (
        gameOver ||
        computerThinking ||
        turn !== WHITE
    ) {
        return;
    }

    const piece = board[square];

    /*
     * Move to selected destination.
     */

    if (selectedSquare !== null) {
        const move = legalMovesForSelected.find(
            candidate => candidate.to === square
        );

        if (move) {
            makePlayerMove(move);
            return;
        }
    }

    /*
     * Select another white piece.
     */

    if (
        piece &&
        piece[0] === WHITE
    ) {
        selectedSquare = square;

        legalMovesForSelected =
            generateLegalMoves(
                board,
                WHITE,
                square
            );

        renderBoard();

        return;
    }

    /*
     * Clear selection.
     */

    selectedSquare = null;
    legalMovesForSelected = [];

    renderBoard();
}

/* =========================================================
   PLAYER MOVE
========================================================= */

function makePlayerMove(move) {
    saveState();

    applyMove(board, move);

    lastMove = {
        from: move.from,
        to: move.to
    };

    moveHistory.push({
        ...move,
        player: WHITE
    });

    selectedSquare = null;
    legalMovesForSelected = [];

    turn = BLACK;

    positionHistory.push(getPositionKey());

    renderBoard();

    if (!updateGameState()) {
        computerThinking = true;
        updateStatus();

        /*
         * Give the browser a moment to render
         * the player's move before the AI starts.
         */

        setTimeout(makeComputerMove, 180);
    }
}

/* =========================================================
   COMPUTER MOVE
========================================================= */

function makeComputerMove() {
    if (
        gameOver ||
        turn !== BLACK
    ) {
        computerThinking = false;
        return;
    }

    const moves = generateAllLegalMoves(
        board,
        BLACK
    );

    if (!moves.length) {
        computerThinking = false;
        updateGameState();
        return;
    }

    const level = LEVELS[currentLevel];

    let chosenMove;

    if (
        level.randomness > 0 &&
        Math.random() < level.randomness
    ) {
        chosenMove = chooseSimpleComputerMove(moves);
    } else {
        chosenMove = findBestMove(
            board,
            level.depth
        );
    }

    if (!chosenMove) {
        chosenMove =
            moves[
                Math.floor(
                    Math.random() * moves.length
                )
            ];
    }

    saveState();

    applyMove(board, chosenMove);

    lastMove = {
        from: chosenMove.from,
        to: chosenMove.to
    };

    moveHistory.push({
        ...chosenMove,
        player: BLACK
    });

    positionHistory.push(getPositionKey());

    turn = WHITE;

    computerThinking = false;

    renderBoard();

    updateGameState();
}

/* =========================================================
   SIMPLE AI
========================================================= */

function chooseSimpleComputerMove(moves) {
    const captures = moves.filter(
        move =>
            move.captured ||
            move.enPassant
    );

    if (captures.length) {
        captures.sort(
            (a, b) =>
                captureScore(b) -
                captureScore(a)
        );

        return captures[
            Math.floor(
                Math.random() *
                Math.min(captures.length, 3)
            )
        ];
    }

    /*
     * Prefer central moves slightly.
     */

    const scored = moves.map(move => ({
        move,
        score: randomMoveScore(move)
    }));

    scored.sort(
        (a, b) => b.score - a.score
    );

    return scored[0].move;
}

function randomMoveScore(move) {
    let score = Math.random() * 30;

    if (move.captured) {
        score +=
            PIECE_VALUES[move.captured[1]] || 0;
    }

    const row = Math.floor(move.to / 8);
    const col = move.to % 8;

    if (
        row >= 2 &&
        row <= 5 &&
        col >= 2 &&
        col <= 5
    ) {
        score += 20;
    }

    return score;
}

function captureScore(move) {
    if (!move.captured) {
        return move.enPassant ? 100 : 0;
    }

    return (
        PIECE_VALUES[move.captured[1]] || 0
    );
}

/* =========================================================
   STATE HISTORY
========================================================= */

function saveState() {
    stateHistory.push({
        board: [...board],
        turn,
        castlingRights: {
            ...castlingRights
        },
        enPassantSquare,
        lastMove: lastMove
            ? { ...lastMove }
            : null,
        positionHistory: [
            ...positionHistory
        ]
    });
}

function undoMove() {
    if (
        gameOver ||
        computerThinking ||
        !stateHistory.length
    ) {
        return;
    }

    /*
     * If the computer has already moved,
     * undo the computer move first, then
     * the player's previous move.
     */

    let state = stateHistory.pop();

    if (
        turn === WHITE &&
        stateHistory.length
    ) {
        state = stateHistory.pop();
    }

    board = [...state.board];

    turn = state.turn;

    castlingRights = {
        ...state.castlingRights
    };

    enPassantSquare =
        state.enPassantSquare;

    lastMove = state.lastMove
        ? { ...state.lastMove }
        : null;

    positionHistory = [
        ...state.positionHistory
    ];

    /*
     * Remove corresponding move records.
     */

    if (moveHistory.length) {
        moveHistory.pop();
    }

    if (
        turn === WHITE &&
        moveHistory.length
    ) {
        moveHistory.pop();
    }

    gameOver = false;
    computerThinking = false;

    selectedSquare = null;
    legalMovesForSelected = [];

    if (gameMessage) {
        gameMessage.textContent = "";
    }

    renderBoard();
    updateStatus();
}

/* =========================================================
   APPLY MOVE
========================================================= */

function applyMove(position, move) {
    const piece = position[move.from];

    if (!piece) return;

    /*
     * En passant.
     */

    if (move.enPassant) {
        const direction =
            piece[0] === WHITE ? 8 : -8;

        const capturedSquare =
            move.to + direction;

        position[capturedSquare] = null;
    }

    /*
     * Move.
     */

    position[move.to] = piece;
    position[move.from] = null;

    /*
     * Promotion.
     */

    if (
        piece[1] === "P" &&
        (
            Math.floor(move.to / 8) === 0 ||
            Math.floor(move.to / 8) === 7
        )
    ) {
        position[move.to] =
            piece[0] +
            (move.promotion || "Q");
    }

    /*
     * Castling.
     */

    if (
        piece[1] === "K" &&
        Math.abs(move.to - move.from) === 2
    ) {
        /*
         * White king side.
         */

        if (move.to === 62) {
            position[61] = position[63];
            position[63] = null;
        }

        /*
         * White queen side.
         */

        if (move.to === 58) {
            position[59] = position[56];
            position[56] = null;
        }

        /*
         * Black king side.
         */

        if (move.to === 6) {
            position[5] = position[7];
            position[7] = null;
        }

        /*
         * Black queen side.
         */

        if (move.to === 2) {
            position[3] = position[0];
            position[0] = null;
        }
    }

    updateCastlingRights(piece, move);

    /*
     * En passant target.
     */

    enPassantSquare = null;

    if (
        piece[1] === "P" &&
        Math.abs(move.to - move.from) === 16
    ) {
        enPassantSquare =
            (move.from + move.to) / 2;
    }
}

/* =========================================================
   CASTLING RIGHTS
========================================================= */

function updateCastlingRights(piece, move) {
    if (piece === "wK") {
        castlingRights.wK = false;
        castlingRights.wQ = false;
    }

    if (piece === "bK") {
        castlingRights.bK = false;
        castlingRights.bQ = false;
    }

    if (piece === "wR") {
        if (move.from === 63) {
            castlingRights.wK = false;
        }

        if (move.from === 56) {
            castlingRights.wQ = false;
        }
    }

    if (piece === "bR") {
        if (move.from === 7) {
            castlingRights.bK = false;
        }

        if (move.from === 0) {
            castlingRights.bQ = false;
        }
    }

    if (move.captured === "wR") {
        if (move.to === 63) {
            castlingRights.wK = false;
        }

        if (move.to === 56) {
            castlingRights.wQ = false;
        }
    }

    if (move.captured === "bR") {
        if (move.to === 7) {
            castlingRights.bK = false;
        }

        if (move.to === 0) {
            castlingRights.bQ = false;
        }
    }
}

/* =========================================================
   LEGAL MOVES
========================================================= */

function generateLegalMoves(
    position,
    color,
    onlyFrom = null
) {
    const pseudoMoves =
        generatePseudoMoves(
            position,
            color,
            onlyFrom
        );

    const legal = [];

    for (const move of pseudoMoves) {
        const testBoard = [...position];

        const oldRights = {
            ...castlingRights
        };

        const oldEP =
            enPassantSquare;

        applyMove(
            testBoard,
            move
        );

        const kingSquare =
            findKing(
                testBoard,
                color
            );

        const attacked =
            kingSquare !== -1 &&
            isSquareAttacked(
                testBoard,
                kingSquare,
                opposite(color)
            );

        restoreEngineState(
            oldRights,
            oldEP
        );

        if (!attacked) {
            legal.push(move);
        }
    }

    return legal;
}

function generateAllLegalMoves(
    position,
    color
) {
    const moves = [];

    for (let square = 0; square < 64; square++) {
        if (
            position[square] &&
            position[square][0] === color
        ) {
            moves.push(
                ...generateLegalMoves(
                    position,
                    color,
                    square
                )
            );
        }
    }

    return moves;
}

function restoreEngineState(
    rights,
    ep
) {
    castlingRights.wK = rights.wK;
    castlingRights.wQ = rights.wQ;
    castlingRights.bK = rights.bK;
    castlingRights.bQ = rights.bQ;

    enPassantSquare = ep;
}

/* =========================================================
   PSEUDO MOVES
========================================================= */

function generatePseudoMoves(
    position,
    color,
    onlyFrom = null
) {
    const moves = [];

    const start =
        onlyFrom === null
            ? 0
            : onlyFrom;

    const end =
        onlyFrom === null
            ? 64
            : onlyFrom + 1;

    for (
        let square = start;
        square < end;
        square++
    ) {
        const piece = position[square];

        if (
            !piece ||
            piece[0] !== color
        ) {
            continue;
        }

        const type = piece[1];

        if (type === "P") {
            generatePawnMoves(
                position,
                square,
                color,
                moves
            );
        }

        else if (type === "N") {
            generateKnightMoves(
                position,
                square,
                color,
                moves
            );
        }

        else if (type === "B") {
            generateSlidingMoves(
                position,
                square,
                color,
                moves,
                [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1]
                ]
            );
        }

        else if (type === "R") {
            generateSlidingMoves(
                position,
                square,
                color,
                moves,
                [
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1]
                ]
            );
        }

        else if (type === "Q") {
            generateSlidingMoves(
                position,
                square,
                color,
                moves,
                [
                    [-1, -1],
                    [-1, 1],
                    [1, -1],
                    [1, 1],
                    [-1, 0],
                    [1, 0],
                    [0, -1],
                    [0, 1]
                ]
            );
        }

        else if (type === "K") {
            generateKingMoves(
                position,
                square,
                color,
                moves
            );
        }
    }

    return moves;
}

/* =========================================================
   PAWNS
========================================================= */

function generatePawnMoves(
    position,
    square,
    color,
    moves
) {
    const row = Math.floor(square / 8);
    const col = square % 8;

    const direction =
        color === WHITE ? -1 : 1;

    const startRow =
        color === WHITE ? 6 : 1;

    const promotionRow =
        color === WHITE ? 0 : 7;

    const oneRow =
        row + direction;

    if (
        oneRow >= 0 &&
        oneRow <= 7
    ) {
        const one =
            oneRow * 8 + col;

        if (!position[one]) {
            addPawnMove(
                moves,
                square,
                one,
                color,
                promotionRow
            );

            if (row === startRow) {
                const two =
                    (row + direction * 2) *
                    8 +
                    col;

                if (!position[two]) {
                    moves.push({
                        from: square,
                        to: two,
                        piece: position[square],
                        doublePawn: true
                    });
                }
            }
        }
    }

    for (const dc of [-1, 1]) {
        const captureCol = col + dc;

        if (
            captureCol < 0 ||
            captureCol > 7
        ) {
            continue;
        }

        const captureRow =
            row + direction;

        if (
            captureRow < 0 ||
            captureRow > 7
        ) {
            continue;
        }

        const target =
            captureRow * 8 +
            captureCol;

        const targetPiece =
            position[target];

        if (
            targetPiece &&
            targetPiece[0] !== color &&
            targetPiece[1] !== "K"
        ) {
            addPawnMove(
                moves,
                square,
                target,
                color,
                promotionRow,
                targetPiece
            );
        }

        if (
            target === enPassantSquare
        ) {
            moves.push({
                from: square,
                to: target,
                piece: position[square],
                enPassant: true
            });
        }
    }
}

function addPawnMove(
    moves,
    from,
    to,
    color,
    promotionRow,
    captured = null
) {
    const row = Math.floor(to / 8);

    if (row === promotionRow) {
        for (
            const promotion of
            ["Q", "R", "B", "N"]
        ) {
            moves.push({
                from,
                to,
                piece: color + "P",
                captured,
                promotion
            });
        }
    } else {
        moves.push({
            from,
            to,
            piece: color + "P",
            captured
        });
    }
}

/* =========================================================
   KNIGHTS
========================================================= */

function generateKnightMoves(
    position,
    square,
    color,
    moves
) {
    const row = Math.floor(square / 8);
    const col = square % 8;

    const offsets = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    for (const [dr, dc] of offsets) {
        const r = row + dr;
        const c = col + dc;

        if (
            r < 0 ||
            r > 7 ||
            c < 0 ||
            c > 7
        ) {
            continue;
        }

        const target = r * 8 + c;
        const targetPiece =
            position[target];

        if (
            !targetPiece ||
            (
                targetPiece[0] !== color &&
                targetPiece[1] !== "K"
            )
        ) {
            moves.push({
                from: square,
                to: target,
                piece: position[square],
                captured:
                    targetPiece || null
            });
        }
    }
}

/* =========================================================
   SLIDING PIECES
========================================================= */

function generateSlidingMoves(
    position,
    square,
    color,
    moves,
    directions
) {
    const row = Math.floor(square / 8);
    const col = square % 8;

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;

        while (
            r >= 0 &&
            r <= 7 &&
            c >= 0 &&
            c <= 7
        ) {
            const target = r * 8 + c;
            const targetPiece =
                position[target];

            if (!targetPiece) {
                moves.push({
                    from: square,
                    to: target,
                    piece: position[square]
                });
            } else {
                if (
                    targetPiece[0] !== color &&
                    targetPiece[1] !== "K"
                ) {
                    moves.push({
                        from: square,
                        to: target,
                        piece: position[square],
                        captured: targetPiece
                    });
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }
}

/* =========================================================
   KING
========================================================= */

function generateKingMoves(
    position,
    square,
    color,
    moves
) {
    const row = Math.floor(square / 8);
    const col = square % 8;

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (
                dr === 0 &&
                dc === 0
            ) {
                continue;
            }

            const r = row + dr;
            const c = col + dc;

            if (
                r < 0 ||
                r > 7 ||
                c < 0 ||
                c > 7
            ) {
                continue;
            }

            const target = r * 8 + c;
            const targetPiece =
                position[target];

            if (
                !targetPiece ||
                (
                    targetPiece[0] !== color &&
                    targetPiece[1] !== "K"
                )
            ) {
                moves.push({
                    from: square,
                    to: target,
                    piece: position[square],
                    captured:
                        targetPiece || null
                });
            }
        }
    }

    addCastlingMoves(
        position,
        square,
        color,
        moves
    );
}

/* =========================================================
   CASTLING
========================================================= */

function addCastlingMoves(
    position,
    square,
    color,
    moves
) {
    const enemy = opposite(color);

    if (
        isKingInCheck(
            position,
            color
        )
    ) {
        return;
    }

    if (
        color === WHITE &&
        square === 60
    ) {
        /*
         * King side.
         */

        if (
            castlingRights.wK &&
            position[61] === null &&
            position[62] === null &&
            position[63] === "wR" &&
            !isSquareAttacked(
                position,
                61,
                enemy
            ) &&
            !isSquareAttacked(
                position,
                62,
                enemy
            )
        ) {
            moves.push({
                from: 60,
                to: 62,
                piece: "wK",
                castle: "K"
            });
        }

        /*
         * Queen side.
         */

        if (
            castlingRights.wQ &&
            position[59] === null &&
            position[58] === null &&
            position[57] === null &&
            position[56] === "wR" &&
            !isSquareAttacked(
                position,
                59,
                enemy
            ) &&
            !isSquareAttacked(
                position,
                58,
                enemy
            )
        ) {
            moves.push({
                from: 60,
                to: 58,
                piece: "wK",
                castle: "Q"
            });
        }
    }

    if (
        color === BLACK &&
        square === 4
    ) {
        /*
         * King side.
         */

        if (
            castlingRights.bK &&
            position[5] === null &&
            position[6] === null &&
            position[7] === "bR" &&
            !isSquareAttacked(
                position,
                5,
                enemy
            ) &&
            !isSquareAttacked(
                position,
                6,
                enemy
            )
        ) {
            moves.push({
                from: 4,
                to: 6,
                piece: "bK",
                castle: "K"
            });
        }

        /*
         * Queen side.
         */

        if (
            castlingRights.bQ &&
            position[3] === null &&
            position[2] === null &&
            position[1] === null &&
            position[0] === "bR" &&
            !isSquareAttacked(
                position,
                3,
                enemy
            ) &&
            !isSquareAttacked(
                position,
                2,
                enemy
            )
        ) {
            moves.push({
                from: 4,
                to: 2,
                piece: "bK",
                castle: "Q"
            });
        }
    }
}

/* =========================================================
   ATTACK DETECTION
========================================================= */

function isSquareAttacked(
    position,
    square,
    byColor
) {
    const row = Math.floor(square / 8);
    const col = square % 8;

    /*
     * Pawns.
     */

    const pawnDirection =
        byColor === WHITE ? 1 : -1;

    const pawnRow =
        row + pawnDirection;

    if (
        pawnRow >= 0 &&
        pawnRow <= 7
    ) {
        for (const dc of [-1, 1]) {
            const pawnCol =
                col + dc;

            if (
                pawnCol < 0 ||
                pawnCol > 7
            ) {
                continue;
            }

            const index =
                pawnRow * 8 +
                pawnCol;

            if (
                position[index] ===
                byColor + "P"
            ) {
                return true;
            }
        }
    }

    /*
     * Knights.
     */

    const knightOffsets = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];

    for (const [dr, dc] of knightOffsets) {
        const r = row + dr;
        const c = col + dc;

        if (
            r < 0 ||
            r > 7 ||
            c < 0 ||
            c > 7
        ) {
            continue;
        }

        if (
            position[r * 8 + c] ===
            byColor + "N"
        ) {
            return true;
        }
    }

    /*
     * Rooks and queens.
     */

    const straight = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    for (const [dr, dc] of straight) {
        let r = row + dr;
        let c = col + dc;

        while (
            r >= 0 &&
            r <= 7 &&
            c >= 0 &&
            c <= 7
        ) {
            const piece =
                position[r * 8 + c];

            if (piece) {
                if (
                    piece[0] === byColor &&
                    (
                        piece[1] === "R" ||
                        piece[1] === "Q"
                    )
                ) {
                    return true;
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }

    /*
     * Bishops and queens.
     */

    const diagonals = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
    ];

    for (const [dr, dc] of diagonals) {
        let r = row + dr;
        let c = col + dc;

        while (
            r >= 0 &&
            r <= 7 &&
            c >= 0 &&
            c <= 7
        ) {
            const piece =
                position[r * 8 + c];

            if (piece) {
                if (
                    piece[0] === byColor &&
                    (
                        piece[1] === "B" ||
                        piece[1] === "Q"
                    )
                ) {
                    return true;
                }

                break;
            }

            r += dr;
            c += dc;
        }
    }

    /*
     * King.
     */

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (
                dr === 0 &&
                dc === 0
            ) {
                continue;
            }

            const r = row + dr;
            const c = col + dc;

            if (
                r < 0 ||
                r > 7 ||
                c < 0 ||
                c > 7
            ) {
                continue;
            }

            if (
                position[r * 8 + c] ===
                byColor + "K"
            ) {
                return true;
            }
        }
    }

    return false;
}

/* =========================================================
   KING / CHECK
========================================================= */

function findKing(
    position,
    color
) {
    return position.indexOf(
        color + "K"
    );
}

function isKingInCheck(
    position,
    color
) {
    const kingSquare =
        findKing(
            position,
            color
        );

    if (kingSquare === -1) {
        return true;
    }

    return isSquareAttacked(
        position,
        kingSquare,
        opposite(color)
    );
}

function opposite(color) {
    return color === WHITE
        ? BLACK
        : WHITE;
}

/* =========================================================
   GAME STATE
========================================================= */

function updateGameState() {
    const legalMoves =
        generateAllLegalMoves(
            board,
            turn
        );

    /*
     * Checkmate / stalemate.
     */

    if (!legalMoves.length) {
        gameOver = true;

        if (
            isKingInCheck(
                board,
                turn
            )
        ) {
            if (turn === WHITE) {
                showResult(
                    "CHECKMATE",
                    "The computer wins this round."
                );
            } else {
                showResult(
                    "YOU WIN",
                    "Checkmate. Excellent play."
                );
            }
        } else {
            showResult(
                "DRAW",
                "The game ended in a stalemate."
            );
        }

        return true;
    }

    /*
     * Fifty-move rule.
     */

    if (moveHistory.length >= 100) {
        gameOver = true;

        showResult(
            "DRAW",
            "The fifty-move rule has been reached."
        );

        return true;
    }

    /*
     * Threefold repetition.
     */

    if (isThreefoldRepetition()) {
        gameOver = true;

        showResult(
            "DRAW",
            "The same position occurred three times."
        );

        return true;
    }

    /*
     * Insufficient material.
     */

    if (isInsufficientMaterial()) {
        gameOver = true;

        showResult(
            "DRAW",
            "There is not enough material to checkmate."
        );

        return true;
    }

    updateStatus();

    return false;
}

/* =========================================================
   STATUS
========================================================= */

function updateStatus() {
    if (gameOver) {
        return;
    }

    const inCheck =
        isKingInCheck(
            board,
            turn
        );

    if (computerThinking) {
        statusElement.textContent =
            "COMPUTER THINKING";
    }

    else if (inCheck) {
        statusElement.textContent =
            turn === WHITE
                ? "CHECK — YOUR TURN"
                : "CHECK";
    }

    else {
        statusElement.textContent =
            turn === WHITE
                ? "YOUR TURN"
                : "COMPUTER TURN";
    }

    if (turnDisplay) {
        turnDisplay.textContent =
            turn === WHITE
                ? "WHITE"
                : "BLACK";

        turnDisplay.classList.toggle(
            "active",
            turn === WHITE
        );
    }

    if (moveCountElement) {
        moveCountElement.textContent =
            Math.ceil(
                moveHistory.length / 2
            );
    }

    if (levelDisplay) {
        levelDisplay.textContent =
            LEVELS[currentLevel].name;
    }

    if (computerLevel) {
        computerLevel.textContent =
            LEVELS[currentLevel].name;
    }
}

/* =========================================================
   RESULT
========================================================= */

function showResult(
    title,
    text
) {
    gameOver = true;
    computerThinking = false;

    if (resultTitle) {
        resultTitle.textContent = title;
    }

    if (resultText) {
        resultText.textContent = text;
    }

    if (resultLevel) {
        resultLevel.textContent =
            LEVELS[currentLevel].name;
    }

    if (resultMoves) {
        resultMoves.textContent =
            Math.ceil(
                moveHistory.length / 2
            );
    }

    gameScreen.hidden = true;
    resultScreen.hidden = false;
}

/* =========================================================
   MINIMAX
========================================================= */

function findBestMove(
    position,
    depth
) {
    const moves =
        generateAllLegalMoves(
            position,
            BLACK
        );

    if (!moves.length) {
        return null;
    }

    orderMoves(
        position,
        moves
    );

    let bestScore = -Infinity;
    let bestMoves = [];

    for (const move of moves) {
        const test = [...position];

        const oldRights = {
            ...castlingRights
        };

        const oldEP =
            enPassantSquare;

        applyMove(
            test,
            move
        );

        const score =
            minimax(
                test,
                depth - 1,
                -Infinity,
                Infinity,
                WHITE
            );

        restoreEngineState(
            oldRights,
            oldEP
        );

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        }

        else if (score === bestScore) {
            bestMoves.push(move);
        }
    }

    return bestMoves[
        Math.floor(
            Math.random() *
            bestMoves.length
        )
    ];
}

function minimax(
    position,
    depth,
    alpha,
    beta,
    side
) {
    const moves =
        generateAllLegalMoves(
            position,
            side
        );

    /*
     * Terminal position.
     */

    if (!moves.length) {
        if (
            isKingInCheck(
                position,
                side
            )
        ) {
            return side === BLACK
                ? -999999 - depth
                : 999999 + depth;
        }

        return 0;
    }

    /*
     * Leaf.
     */

    if (depth <= 0) {
        return evaluateBoard(
            position
        );
    }

    orderMoves(
        position,
        moves
    );

    if (side === BLACK) {
        let best = -Infinity;

        for (const move of moves) {
            const test = [...position];

            const oldRights = {
                ...castlingRights
            };

            const oldEP =
                enPassantSquare;

            applyMove(
                test,
                move
            );

            const score =
                minimax(
                    test,
                    depth - 1,
                    alpha,
                    beta,
                    WHITE
                );

            restoreEngineState(
                oldRights,
                oldEP
            );

            best = Math.max(
                best,
                score
            );

            alpha = Math.max(
                alpha,
                best
            );

            if (beta <= alpha) {
                break;
            }
        }

        return best;
    }

    let best = Infinity;

    for (const move of moves) {
        const test = [...position];

        const oldRights = {
            ...castlingRights
        };

        const oldEP =
            enPassantSquare;

        applyMove(
            test,
            move
        );

        const score =
            minimax(
                test,
                depth - 1,
                alpha,
                beta,
                BLACK
            );

        restoreEngineState(
            oldRights,
            oldEP
        );

        best = Math.min(
            best,
            score
        );

        beta = Math.min(
            beta,
            best
        );

        if (beta <= alpha) {
            break;
        }
    }

    return best;
}

/* =========================================================
   MOVE ORDERING
========================================================= */

function orderMoves(
    position,
    moves
) {
    moves.sort(
        (a, b) =>
            moveOrderingScore(
                position,
                b
            ) -
            moveOrderingScore(
                position,
                a
            )
    );
}

function moveOrderingScore(
    position,
    move
) {
    let score = 0;

    if (move.captured) {
        score +=
            10 *
            (
                PIECE_VALUES[
                    move.captured[1]
                ] || 0
            );

        score -=
            PIECE_VALUES[
                move.piece[1]
            ] || 0;
    }

    if (move.enPassant) {
        score += 900;
    }

    if (move.promotion) {
        score +=
            PIECE_VALUES[
                move.promotion
            ] || 0;
    }

    if (move.castle) {
        score += 50;
    }

    const row = Math.floor(
        move.to / 8
    );

    const col = move.to % 8;

    if (
        row >= 2 &&
        row <= 5 &&
        col >= 2 &&
        col <= 5
    ) {
        score += 10;
    }

    return score;
}

/* =========================================================
   EVALUATION
========================================================= */

function evaluateBoard(position) {
    let score = 0;

    for (
        let square = 0;
        square < 64;
        square++
    ) {
        const piece =
            position[square];

        if (!piece) {
            continue;
        }

        const color = piece[0];
        const type = piece[1];

        let value =
            PIECE_VALUES[type];

        value += positionalBonus(
            type,
            square,
            color
        );

        if (color === BLACK) {
            score += value;
        } else {
            score -= value;
        }
    }

    /*
     * Mobility.
     */

    const blackMoves =
        generateAllLegalMoves(
            position,
            BLACK
        ).length;

    const whiteMoves =
        generateAllLegalMoves(
            position,
            WHITE
        ).length;

    score +=
        (blackMoves - whiteMoves) * 3;

    /*
     * Check bonuses.
     */

    if (
        isKingInCheck(
            position,
            WHITE
        )
    ) {
        score += 35;
    }

    if (
        isKingInCheck(
            position,
            BLACK
        )
    ) {
        score -= 35;
    }

    return score;
}

function positionalBonus(
    type,
    square,
    color
) {
    const row = Math.floor(
        square / 8
    );

    const col = square % 8;

    const ownRow =
        color === WHITE
            ? 7 - row
            : row;

    const centerDistance =
        Math.abs(3.5 - col) +
        Math.abs(3.5 - ownRow);

    const center =
        Math.round(
            (7 - centerDistance) * 2
        );

    switch (type) {
        case "P":
            return ownRow * 3 + center;

        case "N":
            return center * 5;

        case "B":
            return center * 3;

        case "R":
            return ownRow;

        case "Q":
            return center * 2;

        case "K":
            return ownRow < 3
                ? -center
                : center;

        default:
            return 0;
    }
}

/* =========================================================
   DRAW DETECTION
========================================================= */

function getPositionKey() {
    return [
        board.join(","),
        turn,
        castlingRights.wK ? "K" : "",
        castlingRights.wQ ? "Q" : "",
        castlingRights.bK ? "k" : "",
        castlingRights.bQ ? "q" : "",
        enPassantSquare ?? "-"
    ].join("|");
}

function isThreefoldRepetition() {
    const current =
        getPositionKey();

    let count = 0;

    for (const key of positionHistory) {
        if (key === current) {
            count++;
        }
    }

    return count >= 3;
}

function isInsufficientMaterial() {
    const pieces =
        board.filter(Boolean);

    /*
     * Pawns, rooks or queens mean
     * there is enough material.
     */

    if (
        pieces.some(
            piece =>
                ["P", "R", "Q"]
                    .includes(piece[1])
        )
    ) {
        return false;
    }

    /*
     * King vs king.
     */

    if (pieces.length === 2) {
        return true;
    }

    /*
     * King + bishop/knight vs king.
     */

    if (pieces.length === 3) {
        return pieces.some(
            piece =>
                piece[1] === "B" ||
                piece[1] === "N"
        );
    }

    /*
     * King + bishop vs king + bishop,
     * same-colored bishops.
     */

    if (pieces.length === 4) {
        const bishops =
            pieces.filter(
                piece =>
                    piece[1] === "B"
            );

        if (bishops.length === 2) {
            const colors = [];

            board.forEach(
                (piece, square) => {
                    if (
                        piece &&
                        piece[1] === "B"
                    ) {
                        colors.push(
                            (
                                Math.floor(
                                    square / 8
                                ) +
                                square % 8
                            ) % 2
                        );
                    }
                }
            );

            return (
                colors.length === 2 &&
                colors[0] === colors[1]
            );
        }
    }

    return false;
}

/* =========================================================
   BOARD LABELS
========================================================= */

function squareToName(square) {
    const row = Math.floor(
        square / 8
    );

    const col = square % 8;

    const file =
        String.fromCharCode(
            97 + col
        );

    const rank =
        8 - row;

    const piece =
        board[square];

    if (!piece) {
        return `${file}${rank}`;
    }

    return `${file}${rank}, ${pieceName(piece)}`;
}

function pieceName(piece) {
    const names = {
        K: "king",
        Q: "queen",
        R: "rook",
        B: "bishop",
        N: "knight",
        P: "pawn"
    };

    return (
        piece[0] === WHITE
            ? "white "
            : "black "
    ) + names[piece[1]];
}

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            !gameScreen.hidden
        ) {
            selectedSquare = null;
            legalMovesForSelected = [];

            renderBoard();
        }
    }
);

/* =========================================================
   INITIALISE
========================================================= */

setupScreen.hidden = false;
gameScreen.hidden = true;
resultScreen.hidden = true;

selectDifficulty("beginner");

/* =========================================================
   DEBUG API
========================================================= */

window.ThunderQuizChess = {
    getBoard: () => [...board],

    getTurn: () => turn,

    getLevel: () => currentLevel,

    getLegalMoves: () =>
        generateAllLegalMoves(
            board,
            turn
        )
};

