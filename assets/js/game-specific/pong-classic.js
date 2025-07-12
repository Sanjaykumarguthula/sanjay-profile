document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pongGameCanvas');
    const ctx = canvas.getContext('2d');

    const player1ScoreDisplay = document.getElementById('player1Score');
    const player2ScoreDisplay = document.getElementById('player2Score');

    const messageScreen = document.getElementById('pongMessageScreen');
    const messageText = document.getElementById('pongMessageText');
    const onePlayerBtn = document.getElementById('onePlayerBtn');
    const twoPlayerBtn = document.getElementById('twoPlayerBtn');
    const restartPongBtn = document.getElementById('restartPongBtn');

    const PADDLE_HEIGHT = 100;
    const PADDLE_WIDTH = 10;
    const BALL_RADIUS = 7;
    const WINNING_SCORE = 5; // Example winning score

    let ballX, ballY, ballSpeedX, ballSpeedY;
    let player1Y, player2Y;
    let player1Score, player2Score;
    let gameMode; // '1P' or '2P'
    let gameInterval;
    let gameRunning = false;

    const player1Controls = { up: false, down: false };
    const player2Controls = { up: false, down: false };

    function resetBall(direction) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5 * direction; // Start towards player who didn't score (or random)
        ballSpeedY = Math.random() > 0.5 ? 5 : -5; // Randomize Y direction
    }

    function initGame(mode) {
        gameMode = mode;
        player1Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
        player2Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
        player1Score = 0;
        player2Score = 0;
        updateScoreDisplays();
        resetBall(Math.random() > 0.5 ? 1 : -1); // Random initial direction

        messageScreen.style.display = 'none';
        restartPongBtn.style.display = 'none';
        gameRunning = true;

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 1000 / 60); // ~60 FPS
    }

    function gameLoop() {
        if (!gameRunning) return;
        movePaddles();
        moveBall();
        draw();
    }

    function movePaddles() {
        // Player 1
        if (player1Controls.up && player1Y > 0) {
            player1Y -= 7;
        }
        if (player1Controls.down && player1Y < canvas.height - PADDLE_HEIGHT) {
            player1Y += 7;
        }

        // Player 2 (or AI)
        if (gameMode === '2P') {
            if (player2Controls.up && player2Y > 0) {
                player2Y -= 7;
            }
            if (player2Controls.down && player2Y < canvas.height - PADDLE_HEIGHT) {
                player2Y += 7;
            }
        } else { // AI for Player 2
            const paddleCenter = player2Y + PADDLE_HEIGHT / 2;
            const aiSpeed = 4.5; // AI difficulty/speed
            if (paddleCenter < ballY - 20 && player2Y < canvas.height - PADDLE_HEIGHT) { // -35 to make it less perfect
                player2Y += aiSpeed;
            } else if (paddleCenter > ballY + 20 && player2Y > 0) { // +35
                player2Y -= aiSpeed;
            }
        }
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Wall collision (top/bottom)
        if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        // Paddle collision
        // Player 1 (left)
        if (ballX - BALL_RADIUS < PADDLE_WIDTH &&
            ballY > player1Y && ballY < player1Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            adjustBallAngle(player1Y);
        }
        // Player 2 (right)
        else if (ballX + BALL_RADIUS > canvas.width - PADDLE_WIDTH &&
                 ballY > player2Y && ballY < player2Y + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            adjustBallAngle(player2Y);
        }

        // Score
        if (ballX - BALL_RADIUS < 0) { // Player 2 scores
            player2Score++;
            resetBall(1); // Ball goes towards player 1
        } else if (ballX + BALL_RADIUS > canvas.width) { // Player 1 scores
            player1Score++;
            resetBall(-1); // Ball goes towards player 2
        }
        updateScoreDisplays();
        checkWin();
    }

    function adjustBallAngle(paddleY) {
        let deltaY = ballY - (paddleY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.25; // Max of 0.35 * PADDLE_HEIGHT/2 * 0.25 = ~12
    }


    function updateScoreDisplays() {
        player1ScoreDisplay.textContent = player1Score;
        player2ScoreDisplay.textContent = player2Score;
    }

    function checkWin() {
        if (player1Score >= WINNING_SCORE) {
            endGame("Player 1 Wins!");
        } else if (player2Score >= WINNING_SCORE) {
            endGame(gameMode === '1P' ? "Computer Wins!" : "Player 2 Wins!");
        }
    }

    function endGame(winnerMessage) {
        gameRunning = false;
        clearInterval(gameInterval);
        messageText.textContent = winnerMessage;
        onePlayerBtn.style.display = 'none';
        twoPlayerBtn.style.display = 'none';
        restartPongBtn.style.display = 'inline-block';
        messageScreen.style.display = 'block';
    }

    function draw() {
        // Background
        ctx.fillStyle = '#212529'; // Dark background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Center line (dashed)
        ctx.strokeStyle = '#6c757d'; // Grey
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Paddles
        ctx.fillStyle = '#ced4da'; // Light grey paddles
        ctx.fillRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT); // Player 1
        ctx.fillRect(canvas.width - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT); // Player 2

        // Ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#f8f9fa'; // White ball
        ctx.fill();
        ctx.closePath();
    }

    // Event Listeners for controls
    document.addEventListener('keydown', (e) => {
        // Player 1
        if (e.key === 'w' || e.key === 'W') player1Controls.up = true;
        if (e.key === 's' || e.key === 'S') player1Controls.down = true;
        // Player 2
        if (gameMode === '2P') {
            if (e.key === 'ArrowUp') player2Controls.up = true;
            if (e.key === 'ArrowDown') player2Controls.down = true;
        }
    });
    document.addEventListener('keyup', (e) => {
        // Player 1
        if (e.key === 'w' || e.key === 'W') player1Controls.up = false;
        if (e.key === 's' || e.key === 'S') player1Controls.down = false;
        // Player 2
        if (gameMode === '2P') {
            if (e.key === 'ArrowUp') player2Controls.up = false;
            if (e.key === 'ArrowDown') player2Controls.down = false;
        }
    });

    // Touch controls (simplified - tap top/bottom half of each side)
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', () => {
        // player1Controls.up = false; player1Controls.down = false;
        // player2Controls.up = false; player2Controls.down = false;
        // For pong, continuous press is better, so keydown/up simulation is better than touchmove
    });

    function handleTouch(e) {
        e.preventDefault();
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i];
            const rect = canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            if (touchX < canvas.width / 2) { // Left side (Player 1)
                if (touchY < canvas.height / 2) {
                    player1Controls.up = true; player1Controls.down = false;
                } else {
                    player1Controls.down = true; player1Controls.up = false;
                }
            } else { // Right side (Player 2, if 2P mode)
                if (gameMode === '2P') {
                     if (touchY < canvas.height / 2) {
                        player2Controls.up = true; player2Controls.down = false;
                    } else {
                        player2Controls.down = true; player2Controls.up = false;
                    }
                }
            }
        }
        // Reset on touchend (more complex for multi-touch, for now simple)
        setTimeout(() => {
             player1Controls.up = false; player1Controls.down = false;
             player2Controls.up = false; player2Controls.down = false;
        }, 100); // Allow short hold
    }


    // UI Buttons
    onePlayerBtn.addEventListener('click', () => initGame('1P'));
    twoPlayerBtn.addEventListener('click', () => initGame('2P'));
    restartPongBtn.addEventListener('click', () => {
        onePlayerBtn.style.display = 'inline-block';
        twoPlayerBtn.style.display = 'inline-block';
        restartPongBtn.style.display = 'none';
        messageText.textContent = 'Select Mode';
        // No need to call initGame here, user will select mode.
        drawInitialScreen(); // Redraw initial prompt
    });

    function drawInitialScreen() {
        ctx.fillStyle = '#212529';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Optionally draw paddles and ball in starting position
        ctx.fillStyle = '#ced4da';
        ctx.fillRect(0, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillRect(canvas.width - PADDLE_WIDTH, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#f8f9fa';
        ctx.fill();
        ctx.closePath();
    }

    // Initial call to draw the board elements before game starts
    drawInitialScreen();
});
