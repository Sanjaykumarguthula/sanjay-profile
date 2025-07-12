document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeGameCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('scoreDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const highScoreDisplayArea = document.getElementById('highScoreDisplayArea');
    const finalScoreDisplay = document.getElementById('finalScore');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const startGameScreen = document.getElementById('startGameScreen');
    const startGameBtn = document.getElementById('startGameBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');

    // Mobile controls
    const mobileControls = document.getElementById('mobileControls');
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    const gridSize = 20; // Size of each grid cell
    const tileCountX = canvas.width / gridSize;
    const tileCountY = canvas.height / gridSize;

    let snake, food, dx, dy, score, gameLoopTimeout, gameSpeed, highScore;

    function initGame() {
        snake = [{ x: Math.floor(tileCountX / 2), y: Math.floor(tileCountY / 2) }]; // Start in middle
        dx = 1; // Initial direction: right
        dy = 0;
        score = 0;
        gameSpeed = 150; // milliseconds per frame, lower is faster
        loadHighScore();
        spawnFood();
        updateScoreDisplay();
        gameOverMessage.style.display = 'none';
        startGameScreen.style.display = 'none';
        canvas.style.display = 'block'; // Ensure canvas is visible
        if (mobileControls) mobileControls.style.display = isTouchDevice() ? 'block' : 'none';

        if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
        gameLoop();
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function gameLoop() {
        if (isGameOver()) {
            showGameOver();
            return;
        }

        // Clear canvas
        ctx.fillStyle = '#f8f9fa'; // Light background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        moveSnake();
        drawFood();
        drawSnake();

        gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head); // Add new head

        // Check for food collision
        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScoreDisplay();
            spawnFood();
            // Increase speed slightly (optional)
            if (gameSpeed > 60 && score % 5 === 0) gameSpeed -= 5;
        } else {
            snake.pop(); // Remove tail if no food eaten
        }
    }

    function drawSnake() {
        ctx.fillStyle = '#28a745'; // Green snake
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1); // -1 for grid lines
        });
    }

    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };
        // Ensure food doesn't spawn on snake
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
        }
    }

    function drawFood() {
        ctx.fillStyle = '#dc3545'; // Red food
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize -1, gridSize -1);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    function isGameOver() {
        const head = snake[0];
        // Wall collision
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            return true;
        }
        // Self collision (check from 2nd segment onwards)
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    }

    function showGameOver() {
        clearTimeout(gameLoopTimeout);
        finalScoreDisplay.textContent = score;
        gameOverMessage.style.display = 'block';
        canvas.style.display = 'none'; // Hide canvas
        if (mobileControls) mobileControls.style.display = 'none';
        updateHighScore();
    }

    function loadHighScore() {
        highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        if (highScoreDisplayArea) {
            highScoreDisplay.textContent = highScore;
            highScoreDisplayArea.style.display = 'inline';
        }
    }

    function updateHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            if (highScoreDisplay) highScoreDisplay.textContent = highScore;
        }
    }

    // Event Listeners
    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
        }
    });

    if (startGameBtn) {
        startGameBtn.addEventListener('click', initGame);
    }
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', initGame);
    }

    // Mobile controls listeners
    if(upBtn) upBtn.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = -1; } });
    if(downBtn) downBtn.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = 1; } });
    if(leftBtn) leftBtn.addEventListener('click', () => { if (dx === 0) { dx = -1; dy = 0; } });
    if(rightBtn) rightBtn.addEventListener('click', () => { if (dx === 0) { dx = 1; dy = 0; } });

    // Initial setup
    function showStartScreen() {
        gameOverMessage.style.display = 'none';
        startGameScreen.style.display = 'block';
        canvas.style.display = 'none';
        if (mobileControls) mobileControls.style.display = 'none';
        loadHighScore(); // Show high score on start screen too
    }

    showStartScreen(); // Show start screen initially

});
