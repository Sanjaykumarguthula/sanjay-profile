document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('connect4Canvas');
    const ctx = canvas.getContext('2d');
    const playerTurnDisplay = document.getElementById('playerTurnDisplay');
    const gameModeSelect = document.getElementById('gameModeConnect4');
    const restartBtn = document.getElementById('restartConnect4Btn');
    const messageScreen = document.getElementById('connect4MessageScreen');
    const messageTextElement = document.getElementById('connect4MessageText');
    const playAgainBtn = document.getElementById('playAgainConnect4Btn');

    const ROWS = 6;
    const COLS = 7;
    const CELL_SIZE = canvas.width / COLS; // Assuming canvas width is set for 7 columns
    const DISC_RADIUS = CELL_SIZE / 2 - 5; // Radius of the disc

    const PLAYER1_COLOR = 'red';
    const PLAYER2_COLOR = 'yellow';
    const EMPTY_COLOR = '#f8f9fa'; // Light background for empty slots

    let board = [];
    let currentPlayer = 1; // Player 1 starts
    let gameActive = true;
    let gameMode = '2P'; // '2P' or 'AI'

    function initGame() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        currentPlayer = 1;
        gameActive = true;
        gameMode = gameModeSelect.value;

        playerTurnDisplay.textContent = `Player 1's Turn (Red)`;
        playerTurnDisplay.style.color = PLAYER1_COLOR;
        messageScreen.style.display = 'none';
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw grid structure (optional, can be CSS)
        ctx.fillStyle = '#007bff'; // Blue board color
        ctx.fillRect(0,0, canvas.width, canvas.height);

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                ctx.beginPath();
                ctx.arc(c * CELL_SIZE + CELL_SIZE / 2,
                        r * CELL_SIZE + CELL_SIZE / 2,
                        DISC_RADIUS, 0, Math.PI * 2);
                if (board[r][c] === 1) {
                    ctx.fillStyle = PLAYER1_COLOR;
                } else if (board[r][c] === 2) {
                    ctx.fillStyle = PLAYER2_COLOR;
                } else {
                    ctx.fillStyle = EMPTY_COLOR;
                }
                ctx.fill();
                ctx.strokeStyle = '#0056b3'; // Darker blue for hole outline
                ctx.stroke();
            }
        }
    }

    function dropDisc(col) {
        if (!gameActive) return false;

        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                board[r][col] = currentPlayer;
                // Simple animation: draw disc falling (optional, for now instant)
                drawBoard(); // Redraw immediately after drop

                if (checkWin(r, col)) {
                    gameOver(`Player ${currentPlayer} (${currentPlayer === 1 ? 'Red' : 'Yellow'}) Wins!`);
                } else if (checkDraw()) {
                    gameOver("It's a Draw!");
                } else {
                    switchPlayer();
                    if (gameMode === 'AI' && currentPlayer === 2 && gameActive) {
                        // Disable click during AI's turn
                        canvas.style.pointerEvents = 'none';
                        setTimeout(aiMove, 500); // AI makes a move after a short delay
                    }
                }
                return true; // Disc dropped
            }
        }
        return false; // Column is full
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        playerTurnDisplay.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
        playerTurnDisplay.style.color = currentPlayer === 1 ? PLAYER1_COLOR : PLAYER2_COLOR;
    }

    function checkWin(row, col) {
        const player = board[row][col];
        if (!player) return false;

        // Horizontal
        let count = 0;
        for (let c = 0; c < COLS; c++) {
            count = (board[row][c] === player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        // Vertical
        count = 0;
        for (let r = 0; r < ROWS; r++) {
            count = (board[r][col] === player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        // Diagonal (top-left to bottom-right)
        count = 0;
        for (let i = -3; i <= 3; i++) {
            const r = row + i;
            const c = col + i;
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                count = (board[r][c] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            } else if (count < 4) { // Reset if out of bounds before 4 achieved
                count = 0;
            }
        }
        // Diagonal (bottom-left to top-right)
        count = 0;
        for (let i = -3; i <= 3; i++) {
            const r = row - i; // or row + i
            const c = col + i; // or col - i
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                count = (board[r][c] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            } else if (count < 4) {
                count = 0;
            }
        }
        return false;
    }

    function checkDraw() {
        for (let c = 0; c < COLS; c++) {
            if (board[0][c] === 0) return false; // If top row has empty cell, not a draw
        }
        return true; // All cells filled
    }

    function gameOver(message) {
        gameActive = false;
        messageTextElement.textContent = message;
        messageScreen.style.display = 'flex';
        canvas.style.pointerEvents = 'auto'; // Re-enable clicks if AI was playing
    }

    function aiMove() {
        if (!gameActive) return;
        let availableCols = [];
        for (let c = 0; c < COLS; c++) {
            if (board[0][c] === 0) { // If column is not full
                availableCols.push(c);
            }
        }
        if (availableCols.length > 0) {
            // Simple AI: Random valid move
            // TODO: Implement better AI (check for win/block moves)
            // For now, just random
            const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
            dropDisc(randomCol);
        }
        canvas.style.pointerEvents = 'auto'; // Re-enable clicks after AI move
    }


    // Event Listeners
    canvas.addEventListener('click', (e) => {
        if (!gameActive || (gameMode === 'AI' && currentPlayer === 2)) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const col = Math.floor(x / CELL_SIZE);

        if (col >= 0 && col < COLS) {
            dropDisc(col);
        }
    });

    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);
    gameModeSelect.addEventListener('change', initGame);

    // Initial game setup
    initGame();
});
