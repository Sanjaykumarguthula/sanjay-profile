document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('brickBusterCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('scoreDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    const livesDisplay = document.getElementById('livesDisplay');

    const messageScreen = document.getElementById('brickBusterMessageScreen');
    const messageText = document.getElementById('brickBusterMessageText');
    const finalScoreDisplay = document.getElementById('finalBrickScore');
    const restartBtn = document.getElementById('restartBrickBusterBtn');
    const startScreen = document.getElementById('startBrickBusterScreen');
    const startBtn = document.getElementById('startBrickBusterBtn');

    // Game Variables
    let paddle, ball, bricks, score, lives, level, gameRunning, animationFrameId;

    const PADDLE_WIDTH = 100;
    const PADDLE_HEIGHT = 15;
    const PADDLE_Y_OFFSET = 30; // Distance from bottom
    const BALL_RADIUS = 8;

    const BRICK_ROW_COUNT = 5; // Example
    const BRICK_COLUMN_COUNT = 8; // Example
    const BRICK_WIDTH = 50; // Example
    const BRICK_HEIGHT = 20; // Example
    const BRICK_PADDING = 5;
    const BRICK_OFFSET_TOP = 30;
    const BRICK_OFFSET_LEFT = 30;

    const BRICK_COLORS = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#0dcaf0"]; // Red, Orange, Yellow, Teal, Cyan


    function initPaddle() {
        paddle = {
            x: canvas.width / 2 - PADDLE_WIDTH / 2,
            y: canvas.height - PADDLE_HEIGHT - PADDLE_Y_OFFSET,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            dx: 7 // Speed of paddle movement
        };
    }

    function initBall() {
        ball = {
            x: canvas.width / 2,
            y: paddle.y - BALL_RADIUS - 2, // Start on paddle
            radius: BALL_RADIUS,
            speed: 4,
            dx: 3 * (Math.random() > 0.5 ? 1 : -1), // Random initial X direction
            dy: -3, // Initial upward Y direction
            onPaddle: true
        };
    }

    function initBricks() {
        bricks = [];
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            bricks[c] = [];
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                bricks[c][r] = {
                    x: brickX,
                    y: brickY,
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    status: 1, // 1 for visible, 0 for broken
                    color: BRICK_COLORS[r % BRICK_COLORS.length]
                };
            }
        }
    }

    function initGame() {
        score = 0;
        lives = 3;
        level = 1; // For future expansion
        initPaddle();
        initBall();
        initBricks();
        updateGameInfo();

        messageScreen.style.display = 'none';
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        gameRunning = true;

        if(animationFrameId) cancelAnimationFrame(animationFrameId);
        gameLoop();
    }

    function updateGameInfo() {
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        livesDisplay.textContent = lives;
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#007bff'; // Blue paddle
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6c757d'; // Grey ball
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                if (bricks[c][r].status === 1) {
                    const brick = bricks[c][r];
                    ctx.beginPath();
                    ctx.rect(brick.x, brick.y, brick.width, brick.height);
                    ctx.fillStyle = brick.color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function movePaddle() {
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.dx;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.dx;
        }
        if (ball.onPaddle) {
            ball.x = paddle.x + paddle.width / 2;
        }
    }

    function moveBall() {
        if (ball.onPaddle) return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision (left/right)
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        // Wall collision (top)
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        }
        // Paddle collision
        else if (ball.y + ball.dy > paddle.y - ball.radius &&
                 ball.y + ball.dy < paddle.y + paddle.height - ball.radius && // ensure it's not past the paddle bottom
                 ball.x > paddle.x - ball.radius &&
                 ball.x < paddle.x + paddle.width + ball.radius) {

            // Check if it's actually hitting the top surface of the paddle
            if (ball.y < paddle.y) {
                ball.dy = -ball.dy;
                // Change angle based on where it hits the paddle
                let deltaX = ball.x - (paddle.x + paddle.width / 2);
                ball.dx = deltaX * 0.20; // Adjust multiplier for sensitivity
            }
        }
        // Ball missed paddle (bottom wall)
        else if (ball.y + ball.dy > canvas.height - ball.radius) {
            lives--;
            updateGameInfo();
            if (lives === 0) {
                gameOver("Game Over!");
            } else {
                ball.onPaddle = true; // Reset ball on paddle
                initBall(); // Re-center ball on paddle
                initPaddle(); // Re-center paddle
            }
        }
    }

    function brickCollisionDetection() {
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x - ball.radius &&
                        ball.x < b.x + b.width + ball.radius &&
                        ball.y > b.y - ball.radius &&
                        ball.y < b.y + b.height + ball.radius) {

                        b.status = 0;
                        score += 10;
                        updateGameInfo();

                        // Determine if horizontal or vertical collision to reverse correct direction
                        // This is a simplified check. More accurate would be to check previous position.
                        const overlapX = (ball.x - b.x - b.width/2);
                        const overlapY = (ball.y - b.y - b.height/2);
                        const combinedHalfWidths = ball.radius + b.width/2;
                        const combinedHalfHeights = ball.radius + b.height/2;

                        // Check if collision is more horizontal or vertical
                        if (Math.abs(overlapX / b.width) > Math.abs(overlapY / b.height) ) { // More horizontal
                           if((ball.dx > 0 && ball.x < b.x) || (ball.dx < 0 && ball.x > b.x + b.width)) { // hitting side
                                ball.dx = -ball.dx;
                           } else { // hitting top/bottom
                                ball.dy = -ball.dy;
                           }
                        } else { // More vertical
                            if((ball.dy > 0 && ball.y < b.y) || (ball.dy < 0 && ball.y > b.y + b.height)) { // hitting top/bottom
                                ball.dy = -ball.dy;
                            } else { // hitting side
                                ball.dx = -ball.dx;
                            }
                        }


                        if (checkWinCondition()) {
                            gameOver("You Win! Next Level?"); // Or just "You Win!" if one level
                            // For now, just win. Level progression later.
                        }
                        return; // Important to avoid multiple collision checks in one frame
                    }
                }
            }
        }
    }

    function checkWinCondition() {
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                if (bricks[c][r].status === 1) {
                    return false; // Still bricks left
                }
            }
        }
        return true; // All bricks broken
    }

    function gameOver(message) {
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        messageText.textContent = message;
        finalScoreDisplay.textContent = score;
        messageScreen.style.display = 'flex';
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        drawBricks();
        drawBall();
    }

    function gameLoop() {
        if (!gameRunning) return;

        movePaddle();
        moveBall();
        brickCollisionDetection();
        draw();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Keyboard controls
    let rightPressed = false;
    let leftPressed = false;

    document.addEventListener("keydown", (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
        else if ((e.key === " " || e.key === "Spacebar") && ball.onPaddle && gameRunning) {
            ball.onPaddle = false;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    });

    // Mouse controls
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        let mouseX = e.clientX - rect.left - root.scrollLeft;

        paddle.x = mouseX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

        if (ball.onPaddle) {
            ball.x = paddle.x + paddle.width / 2;
        }
    });
    canvas.addEventListener("click", () => {
        if (ball.onPaddle && gameRunning) {
            ball.onPaddle = false;
        }
    });


    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    // Initial Screen
    function showStartScreen() {
        messageScreen.style.display = 'none';
        startScreen.style.display = 'flex'; // Or 'block' depending on CSS
        canvas.style.display = 'block'; // Keep canvas visible for potential initial drawing
        ctx.clearRect(0,0,canvas.width, canvas.height);
        // Draw initial state if needed (e.g. paddle and ball)
        initPaddle(); // To show paddle
        initBall(); // To show ball on paddle
        initBricks(); // To show bricks
        draw(); // Draw everything once
    }
    showStartScreen();
});
