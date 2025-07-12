document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('minesweeperGrid');
    const minesRemainingDisplay = document.getElementById('minesRemainingDisplay');
    const timerDisplay = document.getElementById('timerDisplay');
    const resetGameBtn = document.getElementById('resetGameBtn'); // Smiley face
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const messageOverlay = document.getElementById('minesweeperMessage');
    const messageTextElement = document.getElementById('messageText');
    const playAgainBtn = document.getElementById('playAgainBtn');

    let board = [];
    let rows, cols, numMines;
    let revealedCount, flagsPlaced, timerInterval, seconds, gameActive, firstClick;

    const difficulties = {
        beginner: { rows: 10, cols: 10, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 } // Swapped cols/rows for typical expert
    };
    let currentDifficulty = 'beginner';

    function initGame(difficulty) {
        currentDifficulty = difficulty;
        rows = difficulties[difficulty].rows;
        cols = difficulties[difficulty].cols;
        numMines = difficulties[difficulty].mines;

        revealedCount = 0;
        flagsPlaced = 0;
        seconds = 0;
        gameActive = true;
        firstClick = true;

        if (timerInterval) clearInterval(timerInterval);
        timerDisplay.textContent = seconds;
        minesRemainingDisplay.textContent = numMines;
        messageOverlay.style.display = 'none';
        resetGameBtn.innerHTML = "<i class='bx bx-happy'></i>"; // Default smiley

        createBoard();
        renderBoard();
    }

    function createBoard() {
        board = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            }))
        );
    }

    function placeMines(firstClickRow, firstClickCol) {
        let minesToPlace = numMines;
        while (minesToPlace > 0) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * cols);
            // Ensure mine is not placed on the first clicked cell or its direct neighbors
            const isSafeZone = Math.abs(r - firstClickRow) <=1 && Math.abs(c - firstClickCol) <=1;

            if (!board[r][c].isMine && !isSafeZone) {
                board[r][c].isMine = true;
                minesToPlace--;
            }
        }

        // Calculate adjacent mines for all cells
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!board[r][c].isMine) {
                    board[r][c].adjacentMines = countAdjacentMines(r, c);
                }
            }
        }
    }


    function countAdjacentMines(row, col) {
        let count = 0;
        for (let rOffset = -1; rOffset <= 1; rOffset++) {
            for (let cOffset = -1; cOffset <= 1; cOffset++) {
                if (rOffset === 0 && cOffset === 0) continue;
                const newRow = row + rOffset;
                const newCol = col + cOffset;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    function renderBoard() {
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        gridElement.style.setProperty('--ms-rows', rows);
        gridElement.style.setProperty('--ms-cols', cols);


        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('ms-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (board[r][c].isRevealed) {
                    cell.classList.add('revealed');
                    if (board[r][c].isMine) {
                        cell.innerHTML = "<i class='bx bxs-bomb'></i>";
                        cell.classList.add('mine-hit');
                    } else if (board[r][c].adjacentMines > 0) {
                        cell.textContent = board[r][c].adjacentMines;
                        cell.classList.add(`ms-n${board[r][c].adjacentMines}`);
                    }
                } else if (board[r][c].isFlagged) {
                    cell.innerHTML = "<i class='bx bxs-flag-alt'></i>";
                    cell.classList.add('flagged');
                }

                cell.addEventListener('click', () => handleCellClick(r, c));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    handleCellRightClick(r, c);
                });
                gridElement.appendChild(cell);
            }
        }
    }

    function handleCellClick(row, col) {
        if (!gameActive || board[row][col].isRevealed || board[row][col].isFlagged) {
            return;
        }

        if (firstClick) {
            placeMines(row, col); // Place mines after first click, ensuring first click is safe
            firstClick = false;
            startTimer();
        }

        revealCell(row, col);
        checkWinCondition();
    }

    function handleCellRightClick(row, col) {
        if (!gameActive || board[row][col].isRevealed) {
            return;
        }
        toggleFlag(row, col);
        renderBoard(); // Re-render to show/hide flag
        updateMinesRemaining();
    }

    function startTimer() {
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = seconds;
        }, 1000);
    }

    function revealCell(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols || board[row][col].isRevealed || board[row][col].isFlagged) {
            return;
        }

        board[row][col].isRevealed = true;
        revealedCount++;

        if (board[row][col].isMine) {
            gameOver(false);
            return;
        }

        if (board[row][col].adjacentMines === 0) {
            // Reveal neighbors if it's a blank cell
            for (let rOffset = -1; rOffset <= 1; rOffset++) {
                for (let cOffset = -1; cOffset <= 1; cOffset++) {
                    if (rOffset === 0 && cOffset === 0) continue;
                    revealCell(row + rOffset, col + cOffset);
                }
            }
        }
        renderBoard(); // Could optimize to only re-render changed cells
    }

    function toggleFlag(row, col) {
        if (board[row][col].isFlagged) {
            board[row][col].isFlagged = false;
            flagsPlaced--;
        } else {
            // Only allow flagging up to the number of mines, or if flags < mines
            if (flagsPlaced < numMines) {
                board[row][col].isFlagged = true;
                flagsPlaced++;
            }
        }
    }

    function updateMinesRemaining() {
        minesRemainingDisplay.textContent = numMines - flagsPlaced;
    }

    function checkWinCondition() {
        if (revealedCount === (rows * cols) - numMines) {
            gameOver(true);
        }
    }

    function gameOver(isWin) {
        gameActive = false;
        clearInterval(timerInterval);
        revealAllMines(isWin);
        renderBoard(); // Show all mines

        if (isWin) {
            messageTextElement.textContent = "You Win!";
            resetGameBtn.innerHTML = "<i class='bx bxs-cool'></i>"; // Cool smiley
        } else {
            messageTextElement.textContent = "Game Over!";
            resetGameBtn.innerHTML = "<i class='bx bxs-sad'></i>"; // Sad smiley
        }
        messageOverlay.style.display = 'flex';
    }

    function revealAllMines(isWin) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].isMine) {
                    board[r][c].isRevealed = true; // Reveal all mines
                    if (isWin && !board[r][c].isFlagged) { // If won, auto-flag remaining mines
                        board[r][c].isFlagged = true;
                    }
                }
                 // If lost, show incorrectly flagged cells
                if (!isWin && board[r][c].isFlagged && !board[r][c].isMine) {
                    const cell = gridElement.querySelector(`[data-row='${r}'][data-col='${c}']`);
                    if (cell) {
                        cell.classList.add('misflagged');
                        cell.innerHTML = "<i class='bx bx-x'></i>"; // Show 'X' for misflagged
                    }
                }
            }
        }
    }


    // Event Listeners
    resetGameBtn.addEventListener('click', () => initGame(currentDifficulty));
    playAgainBtn.addEventListener('click', () => initGame(currentDifficulty));

    difficultyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const newDifficulty = e.target.dataset.difficulty;
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            initGame(newDifficulty);
        });
    });

    // Add active class to default difficulty button
    document.querySelector(`.difficulty-btn[data-difficulty="${currentDifficulty}"]`).classList.add('active');


    // Initial game setup
    initGame(currentDifficulty);
});
