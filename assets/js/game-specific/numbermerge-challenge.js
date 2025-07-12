document.addEventListener('DOMContentLoaded', () => {
    const gameBoardElement = document.getElementById('gameBoard2048');
    const scoreDisplay = document.getElementById('scoreDisplay2048');
    const highScoreDisplay = document.getElementById('highScoreDisplay2048');
    const highScoreArea = document.getElementById('highScoreDisplayArea2048');
    const gameOverScreen = document.getElementById('gameOverScreen2048');
    const gameOverText = document.getElementById('gameOverText2048');
    const finalScoreElement = document.getElementById('finalScore2048');
    const restartBtn = document.getElementById('restartGameBtn2048');
    const playAgainBtn = document.getElementById('playAgainBtn2048');

    const GRID_SIZE = 4;
    let board = [];
    let score = 0;
    let highScore = 0;
    let gameActive = true;

    const tileColors = {
        2: "#eee4da", 4: "#ede0c8", 8: "#f2b179",
        16: "#f59563", 32: "#f67c5f", 64: "#f65e3b",
        128: "#edcf72", 256: "#edcc61", 512: "#edc850",
        1024: "#edc53f", 2048: "#edc22e", 4096: "#3c3a32"
    };
    const tileTextColors = {
        2: "#776e65", 4: "#776e65", 8: "#f9f6f2",
        16: "#f9f6f2", 32: "#f9f6f2", 64: "#f9f6f2",
        128: "#f9f6f2", 256: "#f9f6f2", 512: "#f9f6f2",
        1024: "#f9f6f2", 2048: "#f9f6f2", 4096: "#f9f6f2"
    };


    function initGame() {
        board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        score = 0;
        gameActive = true;
        loadHighScore();
        addRandomTile();
        addRandomTile();
        updateBoardDOM();
        updateScoreDisplay();
        gameOverScreen.style.display = 'none';
    }

    function loadHighScore() {
        highScore = parseInt(localStorage.getItem('2048HighScore')) || 0;
        if (highScoreArea) {
            highScoreDisplay.textContent = highScore;
            highScoreArea.style.display = 'inline';
        }
    }

    function saveHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('2048HighScore', highScore);
            if (highScoreDisplay) highScoreDisplay.textContent = highScore;
        }
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    function updateBoardDOM() {
        gameBoardElement.innerHTML = ''; // Clear previous tiles
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const tileValue = board[r][c];
                const tile = document.createElement('div');
                tile.classList.add('tile2048');
                if (tileValue > 0) {
                    tile.textContent = tileValue;
                    tile.style.backgroundColor = tileColors[tileValue] || "#3c3a32";
                    tile.style.color = tileTextColors[tileValue] || "#f9f6f2";
                    tile.classList.add(`tile-${tileValue}`); // For advanced styling if needed
                }
                gameBoardElement.appendChild(tile);
            }
        }
    }

    function addRandomTile() {
        let emptyTiles = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) {
                    emptyTiles.push({ r, c });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[randomTile.r][randomTile.c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
        }
    }

    function move(direction) {
        if (!gameActive) return;
        let moved = false;
        let currentBoardState = JSON.stringify(board); // To check if any tile actually moved

        // Transpose for up/down, reverse for right/down
        let tempBoard = board.map(row => [...row]); // Create a mutable copy

        if (direction === 'up' || direction === 'down') {
            tempBoard = transpose(tempBoard);
        }
        if (direction === 'right' || direction === 'down') {
            tempBoard = tempBoard.map(row => row.reverse());
        }

        for (let r = 0; r < GRID_SIZE; r++) {
            tempBoard[r] = slideAndMergeRow(tempBoard[r]);
        }

        if (direction === 'right' || direction === 'down') {
            tempBoard = tempBoard.map(row => row.reverse());
        }
        if (direction === 'up' || direction === 'down') {
            tempBoard = transpose(tempBoard);
        }

        board = tempBoard;

        if (JSON.stringify(board) !== currentBoardState) { // If board changed
            moved = true;
        }

        if (moved) {
            addRandomTile();
            updateBoardDOM();
            updateScoreDisplay();
            if (checkGameOver()) {
                gameOver();
            }
        }
    }

    function slideAndMergeRow(row) {
        // 1. Slide: Remove zeros
        let newRow = row.filter(val => val !== 0);
        // 2. Merge
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i]; // Add merged value to score
                newRow[i + 1] = 0; // Mark for removal
            }
        }
        // 3. Slide again after merge
        newRow = newRow.filter(val => val !== 0);
        // 4. Pad with zeros to the right
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }
        return newRow;
    }

    function transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    function checkGameOver() {
        // Check for empty cells
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 0) return false; // Game not over
            }
        }
        // Check for possible merges
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (c < GRID_SIZE - 1 && board[r][c] === board[r][c + 1]) return false; // Horizontal merge
                if (r < GRID_SIZE - 1 && board[r][c] === board[r + 1][c]) return false; // Vertical merge
            }
        }
        return true; // Game over
    }

    function gameOver() {
        gameActive = false;
        saveHighScore();
        finalScoreElement.textContent = score;

        let hasWon2048 = false;
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (board[r][c] === 2048) {
                    hasWon2048 = true;
                    break;
                }
            }
            if (hasWon2048) break;
        }
        gameOverText.textContent = hasWon2048 ? "You Reached 2048! Keep Going?" : "Game Over!";
        gameOverScreen.style.display = 'flex';
    }

    // Event Listeners
    document.addEventListener('keydown', (e) => {
        if (!gameActive && e.key !== 'Enter') return; // Allow Enter to restart from game over
        switch (e.key) {
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
            case 'Enter':
                if (!gameActive) initGame();
                break;
        }
    });

    // Swipe controls for touch devices
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    gameBoardElement.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    gameBoardElement.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const deltaX = touchendX - touchstartX;
        const deltaY = touchendY - touchstartY;
        const threshold = 50; // Min swipe distance

        if (Math.abs(deltaX) > Math.abs(deltaY)) { // Horizontal swipe
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) move('right');
                else move('left');
            }
        } else { // Vertical swipe
            if (Math.abs(deltaY) > threshold) {
                if (deltaY > 0) move('down');
                else move('up');
            }
        }
    }

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        if (gameOverScreen.style.display === 'flex' && gameOverText.textContent.includes("2048")) {
            // If they won and want to continue
            gameOverScreen.style.display = 'none';
            gameActive = true; // Allow further moves
        } else {
            initGame();
        }
    });

    // Initial game setup
    initGame();
});
