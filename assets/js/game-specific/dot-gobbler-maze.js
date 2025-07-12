document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('dotGobblerCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('scoreDisplay');
    const livesDisplay = document.getElementById('livesDisplay');

    const gameMessageScreen = document.getElementById('gameMessageScreen');
    const gameMessageText = document.getElementById('gameMessageText');
    const finalScoreMessage = document.getElementById('finalScoreMessage');
    const restartBtn = document.getElementById('restartDotGobblerBtn');
    const startScreen = document.getElementById('startDotGobblerScreen');
    const startBtn = document.getElementById('startDotGobblerBtn');

    // Mobile controls
    const mobileControls = document.getElementById('mobileControlsDotGobbler');
    const dgUpBtn = document.getElementById('dgUpBtn');
    const dgDownBtn = document.getElementById('dgDownBtn');
    const dgLeftBtn = document.getElementById('dgLeftBtn');
    const dgRightBtn = document.getElementById('dgRightBtn');

    const TILE_SIZE = 16; // Size of each grid cell
    const PACMAN_RADIUS = TILE_SIZE / 2 - 2; // Pacman size
    const GHOST_RADIUS = TILE_SIZE / 2 - 2;
    const DOT_RADIUS = TILE_SIZE / 8;
    const POWER_PELLET_RADIUS = TILE_SIZE / 4;

    // Simple maze layout (1 = wall, 0 = path, 2 = dot, 3 = power pellet, P = player start, G = ghost start)
    // This is a very small example maze. A real one would be larger.
    const MAZE_ROWS = 21; // Example dimensions
    const MAZE_COLS = 19; // Example dimensions

    // Adjust canvas to fit maze
    canvas.width = MAZE_COLS * TILE_SIZE;
    canvas.height = MAZE_ROWS * TILE_SIZE;

    const maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
        [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
        [1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
        [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
        [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
        [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0], // Tunnel
        [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
        [1,G,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,G,1], // Ghost starting area (simplified)
        [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
        [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0], // Tunnel
        [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
        [1,3,2,1,2,2,2,2,2,P,2,2,2,2,2,1,2,3,1], // Player start
        [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
        [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
        [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let pacman, ghosts, score, lives, totalDots, powerPelletTimer, gameLoopId, gameActive;
    let requestedDx, requestedDy;


    function initGame() {
        score = 0;
        lives = 3;
        totalDots = 0;
        powerPelletTimer = 0;
        gameActive = true;
        requestedDx = 0;
        requestedDy = 0;

        // Initialize Pacman and Ghosts based on P and G in maze
        pacman = { x: 0, y: 0, dx: 0, dy: 0, openMouth: true, angle: 0 };
        ghosts = [];
        maze.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 'P') {
                    pacman.x = c * TILE_SIZE + TILE_SIZE / 2;
                    pacman.y = r * TILE_SIZE + TILE_SIZE / 2;
                    maze[r][c] = 0; // Path after placing pacman
                } else if (cell === 'G') {
                    ghosts.push({
                        x: c * TILE_SIZE + TILE_SIZE / 2,
                        y: r * TILE_SIZE + TILE_SIZE / 2,
                        dx: 0, dy: 0,
                        color: ghosts.length % 2 === 0 ? 'pink' : 'cyan', // Simple colors
                        isFrightened: false,
                        id: ghosts.length
                    });
                    maze[r][c] = 0; // Path after placing ghost
                }
                if (cell === 2 || cell === 3) totalDots++; // Count initial dots and power pellets
            });
        });

        updateGameInfo();
        gameMessageScreen.style.display = 'none';
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        if (mobileControls) mobileControls.style.display = isTouchDevice() ? 'block' : 'none';

        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        gameLoop();
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function gameLoop() {
        if (!gameActive) return;

        update();
        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function update() {
        movePacman();
        moveGhosts();
        checkCollisions();

        if (powerPelletTimer > 0) {
            powerPelletTimer -= 1000/60; // roughly decrement per frame
            if (powerPelletTimer <= 0) {
                ghosts.forEach(g => g.isFrightened = false);
            }
        }
        if (totalDots === 0) {
            gameOver(true, "You Cleared the Maze!");
        }
    }

    function getTile(x, y) {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);
        if (row >= 0 && row < MAZE_ROWS && col >= 0 && col < MAZE_COLS) {
            return maze[row][col];
        }
        return 1; // Treat outside as wall
    }

    function canMove(x, y, dx, dy) {
        // Check target tile and corners for smoother movement around walls
        const targetCol = Math.floor((x + dx * (TILE_SIZE/2 +1)) / TILE_SIZE);
        const targetRow = Math.floor((y + dy * (TILE_SIZE/2 +1)) / TILE_SIZE);

        if (targetRow < 0 || targetRow >= MAZE_ROWS || targetCol < 0 || targetCol >= MAZE_COLS) { // Tunnel logic
            if (targetCol < 0 && targetRow === Math.floor(MAZE_ROWS/2)-2) { pacman.x = (MAZE_COLS -1) * TILE_SIZE + TILE_SIZE/2 ; return true;} // Left tunnel
            if (targetCol >= MAZE_COLS && targetRow === Math.floor(MAZE_ROWS/2)-2) { pacman.x = TILE_SIZE/2 ; return true;} // Right tunnel
             if (targetCol < 0 && targetRow === Math.floor(MAZE_ROWS/2)+2) { pacman.x = (MAZE_COLS -1) * TILE_SIZE + TILE_SIZE/2 ; return true;} // Left tunnel
            if (targetCol >= MAZE_COLS && targetRow === Math.floor(MAZE_ROWS/2)+2) { pacman.x = TILE_SIZE/2 ; return true;} // Right tunnel
            return false;
        }
        return maze[targetRow][targetCol] !== 1;
    }


    function movePacman() {
        // Try to apply requested direction
        if (requestedDx !== 0 || requestedDy !== 0) {
            if (canMove(pacman.x, pacman.y, requestedDx, requestedDy)) {
                pacman.dx = requestedDx;
                pacman.dy = requestedDy;
                if (pacman.dx === 1) pacman.angle = 0;
                else if (pacman.dx === -1) pacman.angle = Math.PI;
                else if (pacman.dy === 1) pacman.angle = Math.PI / 2;
                else if (pacman.dy === -1) pacman.angle = -Math.PI / 2;
            }
        }
        // Continue in current direction if possible
        if (canMove(pacman.x, pacman.y, pacman.dx, pacman.dy)) {
            pacman.x += pacman.dx * 2; // Speed
            pacman.y += pacman.dy * 2;
        } else { // Hit a wall, stop
            pacman.dx = 0;
            pacman.dy = 0;
        }

        // Eat dots/pellets
        const currentTileCol = Math.floor(pacman.x / TILE_SIZE);
        const currentTileRow = Math.floor(pacman.y / TILE_SIZE);

        if (maze[currentTileRow][currentTileCol] === 2) { // Dot
            maze[currentTileRow][currentTileCol] = 0; // Eat dot
            score += 10;
            totalDots--;
            updateGameInfo();
        } else if (maze[currentTileRow][currentTileCol] === 3) { // Power Pellet
            maze[currentTileRow][currentTileCol] = 0;
            score += 50;
            totalDots--;
            powerPelletTimer = 7000; // 7 seconds
            ghosts.forEach(g => g.isFrightened = true);
            updateGameInfo();
        }

        // Mouth animation
        pacman.openMouth = !pacman.openMouth;
    }

    // Simplified Ghost AI
    function moveGhosts() {
        ghosts.forEach(ghost => {
            // Basic random movement or simple chase if not frightened
            // For simplicity, ghosts can pass through each other but not walls.
            const possibleMoves = [];
            if (canMove(ghost.x, ghost.y, 0, -1)) possibleMoves.push({dx:0, dy:-1}); // Up
            if (canMove(ghost.x, ghost.y, 0, 1)) possibleMoves.push({dx:0, dy:1});   // Down
            if (canMove(ghost.x, ghost.y, -1, 0)) possibleMoves.push({dx:-1, dy:0}); // Left
            if (canMove(ghost.x, ghost.y, 1, 0)) possibleMoves.push({dx:1, dy:0});   // Right

            if (possibleMoves.length > 0) {
                // Prevent immediate reversal unless at dead end
                let validMoves = possibleMoves.filter(move => !(move.dx === -ghost.dx && move.dy === -ghost.dy));
                if (validMoves.length === 0) validMoves = possibleMoves; // Allow reversal if stuck

                const chosenMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                ghost.dx = chosenMove.dx;
                ghost.dy = chosenMove.dy;
            } else { // Should not happen if maze is designed well
                ghost.dx = 0; ghost.dy = 0;
            }
            ghost.x += ghost.dx * 1.5; // Ghost speed
            ghost.y += ghost.dy * 1.5;
        });
    }

    function checkCollisions() {
        ghosts.forEach(ghost => {
            const distX = pacman.x - ghost.x;
            const distY = pacman.y - ghost.y;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < PACMAN_RADIUS + GHOST_RADIUS) {
                if (ghost.isFrightened) {
                    score += 200; // Eat ghost
                    // Reset ghost position (e.g., to starting point or a "ghost house")
                    ghost.x = (MAZE_COLS/2) * TILE_SIZE;
                    ghost.y = (MAZE_ROWS/2 -2) * TILE_SIZE; // Simplified respawn
                    ghost.isFrightened = false;
                    updateGameInfo();
                } else {
                    lives--;
                    updateGameInfo();
                    if (lives <= 0) {
                        gameOver(false, "Game Over!");
                    } else {
                        // Reset Pacman position, maybe ghosts too briefly
                        resetPlayerAndGhostsAfterLifeLost();
                    }
                }
            }
        });
    }

    function resetPlayerAndGhostsAfterLifeLost() {
        // Find P and G again, or use stored initial positions
         maze.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (maze[r][c] === 'P_START_MARKER') { // Need to mark initial P pos if maze is modified
                    pacman.x = c * TILE_SIZE + TILE_SIZE / 2;
                    pacman.y = r * TILE_SIZE + TILE_SIZE / 2;
                }
            });
        });
        // For simplicity, just put pacman at a known safe start
        pacman.x = 9 * TILE_SIZE + TILE_SIZE / 2;
        pacman.y = 16 * TILE_SIZE + TILE_SIZE / 2;
        pacman.dx = 0; pacman.dy = 0; requestedDx =0; requestedDy = 0;

        ghosts.forEach((ghost, index) => { // Reset ghosts to some starting points
            ghost.x = (index % 2 === 0 ? 1 : MAZE_COLS - 2) * TILE_SIZE + TILE_SIZE / 2;
            ghost.y = 10 * TILE_SIZE + TILE_SIZE / 2;
            ghost.isFrightened = false;
        });
        powerPelletTimer = 0; // Reset power pellet effect
    }


    function updateGameInfo() {
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
    }

    function gameOver(isWin, message) {
        gameActive = false;
        cancelAnimationFrame(gameLoopId);
        gameMessageText.textContent = message;
        finalScoreMessage.textContent = score;
        gameMessageScreen.style.display = 'flex';
    }

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Maze
        for (let r = 0; r < MAZE_ROWS; r++) {
            for (let c = 0; c < MAZE_COLS; c++) {
                const tile = maze[r][c];
                if (tile === 1) { // Wall
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else if (tile === 2) { // Dot
                    ctx.fillStyle = 'yellow';
                    ctx.beginPath();
                    ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, DOT_RADIUS, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile === 3) { // Power Pellet
                    ctx.fillStyle = 'orange';
                    ctx.beginPath();
                    ctx.arc(c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2, POWER_PELLET_RADIUS, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Draw Pacman
        ctx.save();
        ctx.translate(pacman.x, pacman.y);
        ctx.rotate(pacman.angle);
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        if (pacman.openMouth) {
            ctx.arc(0, 0, PACMAN_RADIUS, 0.2 * Math.PI, 1.8 * Math.PI);
        } else {
            ctx.arc(0, 0, PACMAN_RADIUS, 0, 2 * Math.PI);
        }
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();

        // Draw Ghosts
        ghosts.forEach(ghost => {
            ctx.fillStyle = ghost.isFrightened ? 'lightblue' : ghost.color;
            ctx.beginPath();
            // Simple ghost shape: semi-circle top, rectangle bottom
            ctx.arc(ghost.x, ghost.y - GHOST_RADIUS / 3, GHOST_RADIUS, Math.PI, 0); // Head
            ctx.lineTo(ghost.x + GHOST_RADIUS, ghost.y + GHOST_RADIUS); // Bottom right
            // Jagged bottom
            for(let i=0; i<3; i++){
                ctx.lineTo(ghost.x + GHOST_RADIUS - (GHOST_RADIUS*2/3)*(i+0.5), ghost.y + GHOST_RADIUS - (i%2 === 0 ? GHOST_RADIUS/3 : 0) );
            }
            ctx.lineTo(ghost.x - GHOST_RADIUS, ghost.y + GHOST_RADIUS); // Bottom left
            ctx.closePath();
            ctx.fill();

            // Eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(ghost.x - GHOST_RADIUS/2.5, ghost.y - GHOST_RADIUS/2, GHOST_RADIUS/3, 0, Math.PI*2); // Left eye
            ctx.arc(ghost.x + GHOST_RADIUS/2.5, ghost.y - GHOST_RADIUS/2, GHOST_RADIUS/3, 0, Math.PI*2); // Right eye
            ctx.fill();
            ctx.fillStyle = 'black'; // Pupils
            ctx.beginPath();
            ctx.arc(ghost.x - GHOST_RADIUS/2.5 + (ghost.dx * GHOST_RADIUS/6), ghost.y - GHOST_RADIUS/2 + (ghost.dy*GHOST_RADIUS/6), GHOST_RADIUS/6, 0, Math.PI*2);
            ctx.arc(ghost.x + GHOST_RADIUS/2.5 + (ghost.dx * GHOST_RADIUS/6), ghost.y - GHOST_RADIUS/2 + (ghost.dy*GHOST_RADIUS/6), GHOST_RADIUS/6, 0, Math.PI*2);
            ctx.fill();
        });
    }

    // Event Listeners
    document.addEventListener('keydown', e => {
        if (!gameActive) return;
        switch (e.key) {
            case 'ArrowUp': requestedDx = 0; requestedDy = -1; break;
            case 'ArrowDown': requestedDx = 0; requestedDy = 1; break;
            case 'ArrowLeft': requestedDx = -1; requestedDy = 0; break;
            case 'ArrowRight': requestedDx = 1; requestedDy = 0; break;
        }
    });

    if(dgUpBtn) dgUpBtn.addEventListener('click', () => { requestedDx = 0; requestedDy = -1; });
    if(dgDownBtn) dgDownBtn.addEventListener('click', () => { requestedDx = 0; requestedDy = 1; });
    if(dgLeftBtn) dgLeftBtn.addEventListener('click', () => { requestedDx = -1; requestedDy = 0; });
    if(dgRightBtn) dgRightBtn.addEventListener('click', () => { requestedDx = 1; requestedDy = 0; });


    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    function showStartScreen() {
        gameMessageScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        canvas.style.display = 'block'; // Show canvas for initial drawing
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        // Draw initial maze state (optional, or just black screen)
         for (let r = 0; r < MAZE_ROWS; r++) {
            for (let c = 0; c < MAZE_COLS; c++) {
                if (maze[r][c] === 1) { ctx.fillStyle = 'blue'; ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE); }
            }
        }
        if (mobileControls) mobileControls.style.display = 'none';
    }
    showStartScreen(); // Initial call
});
