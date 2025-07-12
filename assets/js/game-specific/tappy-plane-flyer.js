document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tappyPlaneCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('tappyScoreDisplay');
    const highScoreDisplay = document.getElementById('tappyHighScoreDisplay');
    const highScoreArea = document.getElementById('tappyHighScoreArea');

    const messageScreen = document.getElementById('tappyMessageScreen');
    const gameMessageText = document.getElementById('tappyGameMessageText');
    const finalScoreDisplay = document.getElementById('tappyFinalScore');
    const restartBtn = document.getElementById('restartTappyPlaneBtn');

    const startScreen = document.getElementById('startTappyPlaneScreen');
    const startBtn = document.getElementById('startTappyPlaneBtn');

    // Game constants
    const PLANE_WIDTH = 40;
    const PLANE_HEIGHT = 30;
    const PIPE_WIDTH = 60;
    const PIPE_GAP = 120; // Gap between top and bottom pipe
    const GRAVITY = 0.25;
    const LIFT = -5; // Negative for upward movement
    const PIPE_SPEED = 2;
    const PIPE_SPAWN_INTERVAL = 180; // Frames between pipe spawns

    // Game state
    let plane, pipes, score, highScore, frameCount, gameLoopId, gameActive;

    // Plane object
    function Plane() {
        this.x = 50;
        this.y = canvas.height / 2 - PLANE_HEIGHT / 2;
        this.width = PLANE_WIDTH;
        this.height = PLANE_HEIGHT;
        this.velocityY = 0;
        // Simple plane sprite (could be an image)
        this.draw = function() {
            ctx.fillStyle = "#ffc107"; // Yellow plane
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Simple propeller
            ctx.fillStyle = "#6c757d";
            ctx.fillRect(this.x + this.width, this.y + this.height/2 - 2, 10, 4);
        };
        this.update = function() {
            this.velocityY += GRAVITY;
            this.y += this.velocityY;
            // Prevent going off top/bottom of screen (optional - game over is better)
            // if (this.y < 0) this.y = 0;
            // if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
        };
        this.flap = function() {
            this.velocityY = LIFT;
        };
    }

    // Pipe object
    function Pipe(isTopPipe, height) {
        this.x = canvas.width;
        this.y = isTopPipe ? 0 : canvas.height - height;
        this.width = PIPE_WIDTH;
        this.height = height;
        this.passed = false;

        this.draw = function() {
            ctx.fillStyle = "#28a745"; // Green pipes
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Pipe cap for aesthetics
            const capHeight = 20;
            if (isTopPipe) {
                ctx.fillRect(this.x - 5, this.y + this.height - capHeight, this.width + 10, capHeight);
            } else {
                 ctx.fillRect(this.x - 5, this.y, this.width + 10, capHeight);
            }
        };
        this.update = function() {
            this.x -= PIPE_SPEED;
        };
    }

    function initGame() {
        plane = new Plane();
        pipes = [];
        score = 0;
        frameCount = 0;
        gameActive = true;
        loadTappyHighScore();
        updateScoreDisplay();

        messageScreen.style.display = 'none';
        startScreen.style.display = 'none';
        canvas.style.display = 'block';

        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        gameLoop();
    }

    function loadTappyHighScore() {
        highScore = parseInt(localStorage.getItem('tappyPlaneHighScore')) || 0;
        if (highScoreArea) {
            highScoreDisplay.textContent = highScore;
            highScoreArea.style.display = highScore > 0 ? 'inline' : 'none';
        }
    }

    function saveTappyHighScore() {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('tappyPlaneHighScore', highScore);
            if (highScoreDisplay) highScoreDisplay.textContent = highScore;
            if (highScoreArea) highScoreArea.style.display = 'inline';
        }
    }

    function gameLoop() {
        if (!gameActive) return;

        // Clear canvas
        ctx.fillStyle = "#87CEEB"; // Sky blue background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Spawn pipes
        if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
            const topPipeHeight = Math.random() * (canvas.height / 2 - PIPE_GAP / 2) + (PIPE_GAP / 4); // Min height for top pipe
            pipes.push(new Pipe(true, topPipeHeight));
            pipes.push(new Pipe(false, canvas.height - topPipeHeight - PIPE_GAP));
        }

        // Update and draw pipes
        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].update();
            pipes[i].draw();

            // Score
            if (!pipes[i].passed && pipes[i].x + pipes[i].width < plane.x) {
                // Only score once per pair of pipes (check one of the pair, e.g. top pipe)
                if (pipes[i].y === 0) { // Assuming this is the top pipe of a pair
                    score++;
                    updateScoreDisplay();
                }
                pipes[i].passed = true;
            }

            // Remove off-screen pipes
            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
            }
        }

        // Update and draw plane
        plane.update();
        plane.draw();

        // Collision detection
        if (checkCollision()) {
            gameOver();
            return; // Stop the loop
        }

        frameCount++;
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    function checkCollision() {
        // Ground or ceiling collision
        if (plane.y + plane.height > canvas.height || plane.y < 0) {
            return true;
        }
        // Pipe collision
        for (let pipe of pipes) {
            if (plane.x < pipe.x + pipe.width &&
                plane.x + plane.width > pipe.x &&
                plane.y < pipe.y + pipe.height &&
                plane.y + plane.height > pipe.y) {
                return true;
            }
        }
        return false;
    }

    function gameOver() {
        gameActive = false;
        cancelAnimationFrame(gameLoopId);
        saveTappyHighScore();
        finalScoreDisplay.textContent = score;
        gameMessageText.textContent = "Game Over!";
        messageScreen.style.display = 'flex';
    }

    // Event Listeners
    function handleFlap() {
        if (!gameActive && messageScreen.style.display === 'none' && startScreen.style.display !== 'none') {
            // If game hasn't started from start screen, a flap action can start it
            initGame();
        } else if (gameActive) {
            plane.flap();
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === "Spacebar") { // Spacebar for older browsers
            e.preventDefault(); // Prevent page scroll
            handleFlap();
        }
    });
    canvas.addEventListener('click', handleFlap);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent zoom/scroll
        handleFlap();
    });


    startBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent canvas click from also firing
        initGame();
    });
    restartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        initGame();
    });

    function showStartScreen() {
        messageScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        canvas.style.display = 'block';
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // Draw initial plane state or placeholder
        const tempPlane = new Plane();
        tempPlane.draw();
        loadTappyHighScore();
        updateScoreDisplay(); // To show initial score 0
    }
    showStartScreen();
});
