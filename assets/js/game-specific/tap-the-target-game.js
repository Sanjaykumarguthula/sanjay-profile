document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('tapTargetGrid');
    const scoreDisplay = document.getElementById('scoreDisplayTapTarget');
    const timeDisplay = document.getElementById('timeDisplayTapTarget');
    const highScoreDisplay = document.getElementById('highScoreDisplayTapTarget');
    const highScoreArea = document.getElementById('highScoreAreaTapTarget');

    const messageScreen = document.getElementById('tapTargetMessageScreen');
    const gameMessageText = document.getElementById('tapTargetGameMessageText'); // Ensure this ID exists in HTML if used
    const finalScoreDisplay = document.getElementById('finalScoreTapTarget');
    const restartBtn = document.getElementById('restartTapTargetBtn');

    const startScreen = document.getElementById('startTapTargetScreen');
    const startBtn = document.getElementById('startTapTargetBtn');

    const GRID_SIZE = 3; // 3x3 grid
    const GAME_DURATION = 30; // seconds
    const TARGET_APPEAR_MIN_INTERVAL = 700; // ms
    const TARGET_APPEAR_MAX_INTERVAL = 1500; // ms
    const TARGET_LIFESPAN = 1200; // ms how long target stays visible

    let score, timeLeft, highScore, gameActive, timerInterval, targetInterval, currentTargetCell;

    function initGame() {
        score = 0;
        timeLeft = GAME_DURATION;
        gameActive = true;
        currentTargetCell = null;
        loadTapTargetHighScore();
        updateScoreDisplay();
        updateTimeDisplay();

        messageScreen.style.display = 'none';
        startScreen.style.display = 'none';
        gridElement.style.display = 'grid'; // Ensure grid is visible

        createGrid();

        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(gameTimerTick, 1000);

        if(targetInterval) clearTimeout(targetInterval);
        scheduleNextTarget();
    }

    function loadTapTargetHighScore() {
        highScore = parseInt(localStorage.getItem('tapTargetHighScore')) || 0;
        if (highScoreArea) {
            highScoreDisplay.textContent = highScore;
            highScoreArea.style.display = highScore > 0 ? 'inline-block' : 'none';
        }
    }

    function saveTapTargetHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('tapTargetHighScore', highScore);
            if (highScoreDisplay) highScoreDisplay.textContent = highScore;
            if (highScoreArea) highScoreArea.style.display = 'inline-block';
        }
    }

    function createGrid() {
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            const cell = document.createElement('div');
            cell.classList.add('tap-target-cell');
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(cell));
            gridElement.appendChild(cell);
        }
    }

    function scheduleNextTarget() {
        if (!gameActive) return;
        const delay = Math.random() * (TARGET_APPEAR_MAX_INTERVAL - TARGET_APPEAR_MIN_INTERVAL) + TARGET_APPEAR_MIN_INTERVAL;
        targetInterval = setTimeout(showTarget, delay);
    }

    function showTarget() {
        if (!gameActive) return;

        // Clear previous target if any (missed)
        if (currentTargetCell) {
            currentTargetCell.classList.remove('active-target');
            currentTargetCell.innerHTML = '';
        }

        const cells = gridElement.children;
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * cells.length);
        } while (cells[randomIndex] === currentTargetCell); // Ensure new target is different

        currentTargetCell = cells[randomIndex];
        currentTargetCell.classList.add('active-target');
        currentTargetCell.innerHTML = "<i class='bx bxs-bullseye bx-burst bx-lg'></i>"; // Example target icon

        // Target disappears after lifespan
        setTimeout(() => {
            if (gameActive && currentTargetCell && currentTargetCell.classList.contains('active-target')) {
                currentTargetCell.classList.remove('active-target');
                currentTargetCell.innerHTML = '';
                currentTargetCell = null; // Reset so it can be chosen again
            }
        }, TARGET_LIFESPAN);

        scheduleNextTarget(); // Schedule the next one
    }

    function handleCellClick(cell) {
        if (!gameActive || !cell.classList.contains('active-target')) {
            return; // Clicked empty cell or inactive target
        }

        score += 10;
        updateScoreDisplay();

        cell.classList.remove('active-target');
        cell.innerHTML = "<i class='bx bx-check-circle bx-tada bx-lg' style='color:green;'></i>"; // Hit feedback

        // Clear hit feedback after a short delay
        setTimeout(() => {
            if(cell.querySelector('.bx-check-circle')) { // check if it's still the hit feedback
                 cell.innerHTML = '';
            }
        }, 300);

        currentTargetCell = null; // Target hit, clear current

        // Optional: immediately schedule next target after a hit for faster pace
        // clearTimeout(targetInterval);
        // scheduleNextTarget();
    }

    function gameTimerTick() {
        timeLeft--;
        updateTimeDisplay();
        if (timeLeft <= 0) {
            gameOver();
        }
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }
    function updateTimeDisplay() {
        timeDisplay.textContent = timeLeft + 's';
    }

    function gameOver() {
        gameActive = false;
        clearInterval(timerInterval);
        if(targetInterval) clearTimeout(targetInterval);

        if (currentTargetCell) { // Clear any active target
            currentTargetCell.classList.remove('active-target');
            currentTargetCell.innerHTML = '';
        }

        saveTapTargetHighScore();
        finalScoreDisplay.textContent = score;
        if(gameMessageText) gameMessageText.textContent = "Time's Up!"; // If this element exists
        messageScreen.style.display = 'flex';
    }

    // Event Listeners
    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    function showStartScreen() {
        messageScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        gridElement.style.display = 'grid'; // Keep grid visible
        createGrid(); // Draw empty grid
        updateTimeDisplay(); // Show initial time
        updateScoreDisplay(); // Show initial score
        loadTapTargetHighScore();
    }
    showStartScreen();
});
