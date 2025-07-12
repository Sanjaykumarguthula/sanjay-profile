document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('blockFallCanvas');
    const ctx = canvas.getContext('2d');
    const nextPieceCanvas = document.getElementById('nextPieceCanvas');
    const nextCtx = nextPieceCanvas ? nextPieceCanvas.getContext('2d') : null;
    // const holdPieceCanvas = document.getElementById('holdPieceCanvas'); // Optional
    // const holdCtx = holdPieceCanvas ? holdPieceCanvas.getContext('2d') : null; // Optional

    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const linesDisplay = document.getElementById('linesDisplay');

    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalScoreDisplay = document.getElementById('finalScore');
    const startGameScreen = document.getElementById('startGameScreen');
    const startGameBtn = document.getElementById('startGameBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');
    const pauseGameBtn = document.getElementById('pauseGameBtn');

    // Mobile Controls
    const mRotateLeftBtn = document.getElementById('mRotateLeftBtn');
    const mRotateRightBtn = document.getElementById('mRotateRightBtn');
    const mLeftBtn = document.getElementById('mLeftBtn');
    const mRightBtn = document.getElementById('mRightBtn');
    const mSoftDropBtn = document.getElementById('mSoftDropBtn');
    const mHardDropBtn = document.getElementById('mHardDropBtn');
    const mobileControlsDiv = document.getElementById('mobileControls');


    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = canvas.width / COLS;
    const NEXT_PIECE_COLS = 4;
    const NEXT_PIECE_ROWS = 4;
    const NEXT_BLOCK_SIZE = nextPieceCanvas ? nextPieceCanvas.width / NEXT_PIECE_COLS : 20;


    const COLORS = [null, '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF']; // Colors for tetrominoes
    const TETROMINOES = [
        [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
        [[2,0,0], [2,2,2], [0,0,0]],                  // J
        [[0,0,3], [3,3,3], [0,0,0]],                  // L
        [[4,4], [4,4]],                               // O
        [[0,5,5], [5,5,0], [0,0,0]],                  // S
        [[0,6,0], [6,6,6], [0,0,0]],                  // T
        [[7,7,0], [0,7,7], [0,0,0]]                   // Z
    ];

    let board, currentPiece, nextPiece, score, level, lines, gameLoopTimeout, gameSpeed, isPaused, isGameOverState;
    // let holdPiece, canHold; // Optional for hold functionality

    function initGame() {
        board = createEmptyBoard();
        score = 0;
        level = 1;
        lines = 0;
        gameSpeed = 1000; // Milliseconds per drop, decreases with level
        isPaused = false;
        isGameOverState = false;
        // canHold = true; // Optional for hold functionality
        // holdPiece = null; // Optional

        spawnNewPiece(); // Spawns current and next piece
        updateGameInfo();

        gameOverMessage.style.display = 'none';
        startGameScreen.style.display = 'none';
        canvas.style.display = 'block';
        if (pauseGameBtn) pauseGameBtn.textContent = 'Pause';
        if (mobileControlsDiv) mobileControlsDiv.style.display = isTouchDevice() ? 'flex' : 'none';


        if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
        gameLoop();
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function createEmptyBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    function spawnNewPiece() {
        if (!nextPiece) { // First piece
            currentPiece = createRandomPiece();
        } else {
            currentPiece = nextPiece;
        }
        nextPiece = createRandomPiece();
        currentPiece.x = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
        currentPiece.y = 0;

        if (isCollision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
            isGameOverState = true; // Game over if new piece collides immediately
        }
        drawNextPiece();
    }

    function createRandomPiece() {
        const randIndex = Math.floor(Math.random() * TETROMINOES.length);
        return {
            shape: TETROMINOES[randIndex],
            colorIndex: randIndex + 1, // Use index + 1 for color from COLORS array
            x: 0,
            y: 0
        };
    }

    function gameLoop() {
        if (isPaused || isGameOverState) {
            if (isGameOverState) showGameOverScreen();
            return;
        }

        if (!movePiece(0, 1)) { // Try to move down
            solidifyPiece();
            clearLines();
            spawnNewPiece();
            if (isGameOverState) { // Check again after spawn if game over
                showGameOverScreen();
                return;
            }
        }

        draw();
        gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
    }

    function draw() {
        // Clear main canvas
        ctx.fillStyle = '#f0f0f0'; // Light grey background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw solidified pieces on board
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    drawBlock(ctx, x, y, COLORS[value], BLOCK_SIZE);
                }
            });
        });

        // Draw current falling piece
        drawPiece(ctx, currentPiece, BLOCK_SIZE);
    }

    function drawPiece(context, piece, blockSize) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    drawBlock(context, piece.x + x, piece.y + y, COLORS[piece.colorIndex], blockSize);
                }
            });
        });
    }

    function drawNextPiece() {
        if (!nextCtx || !nextPiece) return;
        nextCtx.fillStyle = '#e9ecef'; // Background for next piece area
        nextCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

        // Center the piece in the preview box
        const shape = nextPiece.shape;
        const shapeWidth = shape[0].length;
        const shapeHeight = shape.length;
        const offsetX = Math.floor((NEXT_PIECE_COLS - shapeWidth) / 2);
        const offsetY = Math.floor((NEXT_PIECE_ROWS - shapeHeight) / 2);

        const tempPieceForPreview = { ...nextPiece, x: offsetX, y: offsetY };
        drawPiece(nextCtx, tempPieceForPreview, NEXT_BLOCK_SIZE);
    }

    function drawBlock(context, x, y, color, blockSize) {
        context.fillStyle = color;
        context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        context.strokeStyle = '#333'; // Block border
        context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    function movePiece(dx, dy) {
        if (!isCollision(currentPiece.shape, currentPiece.x + dx, currentPiece.y + dy)) {
            currentPiece.x += dx;
            currentPiece.y += dy;
            if (!isPaused) draw(); // Redraw immediately on move for responsiveness
            return true;
        }
        return false;
    }

    function rotatePiece(piece, direction) { // direction: 1 for clockwise, -1 for counter-clockwise
        const shape = piece.shape;
        const N = shape.length;
        const newShape = Array.from({ length: N }, () => Array(N).fill(0));

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                if (direction === 1) { // Clockwise
                    newShape[x][N - 1 - y] = shape[y][x];
                } else { // Counter-clockwise
                    newShape[N - 1 - x][y] = shape[y][x];
                }
            }
        }
        // Trim empty rows/cols from newShape (important for non-square pieces after rotation)
        return trimShape(newShape);
    }

    function trimShape(shape) {
        // This is a simplified trim. Real Tetris rotation has complex wall kick rules.
        // For simplicity, we'll just try to fit it.
        // A more robust solution would involve checking Standard Rotation System (SRS) kicks.
        return shape.filter(row => row.some(val => val !== 0)) // Remove empty rows
                    .map(row => row.filter((val, i, arr) => arr.some(r => r[i] !==0))); // This part is tricky for cols, might not be perfect
        // For now, let's assume pieces are designed to rotate within their bounding box mostly
        // or the player has to ensure space.
        // A simpler approach for now, just return newShape and check collision.
         return shape;
    }


    function attemptRotate(direction) {
        const rotatedShape = rotatePiece(currentPiece, direction);
        if (!isCollision(rotatedShape, currentPiece.x, currentPiece.y)) {
            currentPiece.shape = rotatedShape;
            if (!isPaused) draw();
        } else {
            // Try basic wall kicks (simplified)
            // Try moving 1 left
            if (!isCollision(rotatedShape, currentPiece.x - 1, currentPiece.y)) {
                currentPiece.x -= 1;
                currentPiece.shape = rotatedShape;
                if (!isPaused) draw(); return;
            }
            // Try moving 1 right
            if (!isCollision(rotatedShape, currentPiece.x + 1, currentPiece.y)) {
                currentPiece.x += 1;
                currentPiece.shape = rotatedShape;
                if (!isPaused) draw(); return;
            }
             // Try moving 2 left / right for I piece (very simplified)
            if (currentPiece.colorIndex === 1 && !isCollision(rotatedShape, currentPiece.x - 2, currentPiece.y)) { // I piece
                currentPiece.x -= 2; currentPiece.shape = rotatedShape; if (!isPaused) draw(); return;
            }
            if (currentPiece.colorIndex === 1 && !isCollision(rotatedShape, currentPiece.x + 2, currentPiece.y)) { // I piece
                currentPiece.x += 2; currentPiece.shape = rotatedShape; if (!isPaused) draw(); return;
            }
        }
    }

    function hardDrop() {
        while (movePiece(0, 1)) {
            // continue dropping
        }
        solidifyPiece(); // Solidify after it can't move down further
        clearLines();
        spawnNewPiece();
        if (!isPaused) draw();
    }

    function isCollision(shape, pieceX, pieceY) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] > 0) { // If it's part of the piece
                    const boardX = pieceX + x;
                    const boardY = pieceY + y;
                    if (boardX < 0 || boardX >= COLS || boardY >= ROWS || (boardY >= 0 && board[boardY][boardX] > 0) ) {
                        return true; // Collision with wall or another piece
                    }
                }
            }
        }
        return false;
    }

    function solidifyPiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    const boardX = currentPiece.x + x;
                    const boardY = currentPiece.y + y;
                    if (boardY >= 0) { // Ensure it's within board vertically
                         board[boardY][boardX] = currentPiece.colorIndex;
                    }
                }
            });
        });
        // canHold = true; // Allow hold again after piece is placed
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(value => value > 0)) { // If line is full
                linesCleared++;
                board.splice(y, 1); // Remove the line
                board.unshift(Array(COLS).fill(0)); // Add an empty line at the top
                y++; // Re-check the current row index as lines above have shifted down
            }
        }
        if (linesCleared > 0) {
            lines += linesCleared;
            // Scoring: 1 line = 40, 2 lines = 100, 3 lines = 300, 4 lines (Tetris) = 1200 (example scores)
            const points = [0, 40, 100, 300, 1200];
            score += points[linesCleared] * level;

            // Level up every 10 lines (example)
            if (lines >= level * 10) {
                level++;
                gameSpeed = Math.max(100, 1000 - (level - 1) * 50); // Decrease gameSpeed, min 100ms
            }
            updateGameInfo();
        }
    }

    function updateGameInfo() {
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        linesDisplay.textContent = lines;
    }

    function togglePause() {
        isPaused = !isPaused;
        if (pauseGameBtn) pauseGameBtn.textContent = isPaused ? 'Resume' : 'Pause';
        if (!isPaused && !isGameOverState) {
            gameLoop(); // Resume game loop
        } else {
            clearTimeout(gameLoopTimeout); // Stop game loop if paused
            if(isPaused) { // Show "Paused" message
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = '30px Rubik, sans-serif';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
            }
        }
    }

    function showGameOverScreen() {
        isGameOverState = true; // Ensure this is set
        clearTimeout(gameLoopTimeout);
        finalScoreDisplay.textContent = score;
        gameOverMessage.style.display = 'block';
        // Optionally hide canvas or overlay it
    }

    // Event Listeners
    document.addEventListener('keydown', e => {
        if (isGameOverState || isPaused && e.key !== 'p' && e.key !== 'P') return;

        switch (e.key) {
            case 'ArrowLeft': movePiece(-1, 0); break;
            case 'ArrowRight': movePiece(1, 0); break;
            case 'ArrowDown':
                if (movePiece(0, 1)) score +=1; // Small bonus for soft drop
                updateGameInfo();
                break;
            case 'ArrowUp': // Or 'x' for rotate clockwise
            case 'x':
            case 'X':
                attemptRotate(1);
                break;
            case 'z': // Or 'Control' for rotate counter-clockwise
            case 'Z':
            case 'Control':
                attemptRotate(-1);
                break;
            case ' ': // Spacebar for Hard Drop
                e.preventDefault(); // Prevent page scroll
                hardDrop();
                break;
            // case 'c': // Hold piece - Optional
            // case 'C':
            //     if (canHold) handleHold();
            //     break;
            case 'p': // Pause
            case 'P':
                togglePause();
                break;
        }
    });

    if (startGameBtn) startGameBtn.addEventListener('click', initGame);
    if (restartGameBtn) restartGameBtn.addEventListener('click', initGame);
    if (pauseGameBtn) pauseGameBtn.addEventListener('click', togglePause);

    // Mobile control listeners
    if(mLeftBtn) mLeftBtn.addEventListener('click', () => movePiece(-1,0));
    if(mRightBtn) mRightBtn.addEventListener('click', () => movePiece(1,0));
    if(mRotateLeftBtn) mRotateLeftBtn.addEventListener('click', () => attemptRotate(-1));
    if(mRotateRightBtn) mRotateRightBtn.addEventListener('click', () => attemptRotate(1));
    if(mSoftDropBtn) mSoftDropBtn.addEventListener('click', () => {if (movePiece(0,1)) score+=1; updateGameInfo();});
    if(mHardDropBtn) mHardDropBtn.addEventListener('click', hardDrop);
    // if(mHoldBtn) mHoldBtn.addEventListener('click', () => {if (canHold) handleHold();});


    // Initial Screen
    function showStartScreen() {
        gameOverMessage.style.display = 'none';
        startGameScreen.style.display = 'block';
        canvas.style.display = 'block'; // Keep canvas visible for background/initial state
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        if(nextCtx) {
            nextCtx.fillStyle = '#e9ecef';
            nextCtx.fillRect(0,0,nextPieceCanvas.width, nextPieceCanvas.height);
        }

        if (mobileControlsDiv) mobileControlsDiv.style.display = 'none';
    }
    showStartScreen();
});
