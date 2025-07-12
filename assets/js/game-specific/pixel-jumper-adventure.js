document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pixelJumperCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('pjScoreDisplay');
    const livesDisplay = document.getElementById('pjLivesDisplay');
    const levelDisplay = document.getElementById('pjLevelDisplay');

    const messageScreen = document.getElementById('pixelJumperMessageScreen');
    const gameMessageText = document.getElementById('pixelJumperGameMessageText');
    const finalScoreDisplay = document.getElementById('pixelJumperFinalScore');
    const restartBtn = document.getElementById('restartPixelJumperBtn');
    const startScreen = document.getElementById('startPixelJumperScreen');
    const startBtn = document.getElementById('startPixelJumperBtn');

    // Mobile Controls
    const mobileControlsDiv = document.getElementById('mobileControlsPixelJumper');
    const pjLeftBtn = document.getElementById('pjLeftBtn');
    const pjRightBtn = document.getElementById('pjRightBtn');
    const pjJumpBtn = document.getElementById('pjJumpBtn');

    // Game Constants
    const GRAVITY = 0.5;
    const PLAYER_SPEED = 3;
    const JUMP_FORCE = -10; // Negative for upward
    const TILE_SIZE = 32; // Example, adjust based on art

    // Game State
    let player, platforms, collectibles, enemies, score, lives, currentLevelIndex, gameActive, animationFrameId;
    let keys = { left: false, right: false, up: false };

    // Player Object
    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE * 0.8;
        this.height = TILE_SIZE * 0.9;
        this.dx = 0;
        this.dy = 0;
        this.onGround = false;
        this.color = '#007bff'; // Blue player

        this.draw = () => {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };

        this.update = () => {
            // Horizontal movement
            if (keys.left) this.dx = -PLAYER_SPEED;
            else if (keys.right) this.dx = PLAYER_SPEED;
            else this.dx = 0;

            this.x += this.dx;

            // Vertical movement (gravity)
            this.dy += GRAVITY;
            this.y += this.dy;
            this.onGround = false; // Assume not on ground until collision check

            // Prevent falling through bottom of canvas (temporary, platforms should handle)
            if (this.y + this.height > canvas.height) {
                this.y = canvas.height - this.height;
                this.dy = 0;
                this.onGround = true;
            }
        };

        this.jump = () => {
            if (this.onGround) {
                this.dy = JUMP_FORCE;
                this.onGround = false;
            }
        };
    }

    // Platform Object
    function Platform(x, y, width, height, type = 'normal') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // 'normal', 'hazard', 'goal'
        this.color = type === 'hazard' ? '#dc3545' : (type === 'goal' ? '#198754' : '#6c757d');

        this.draw = () => {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };
    }

    // Level Data (simple example)
    const levels = [
        { // Level 1
            playerStart: { x: 50, y: canvas.height - TILE_SIZE * 2 },
            platforms: [
                new Platform(0, canvas.height - TILE_SIZE, canvas.width, TILE_SIZE), // Ground
                new Platform(150, canvas.height - TILE_SIZE * 3, 100, TILE_SIZE),
                new Platform(300, canvas.height - TILE_SIZE * 5, 120, TILE_SIZE),
                new Platform(500, canvas.height - TILE_SIZE * 2, 80, TILE_SIZE, 'goal')
            ],
            collectibles: [], // Add later
            enemies: [] // Add later
        }
        // Add more levels here
    ];

    function loadLevel(levelIndex) {
        const levelData = levels[levelIndex];
        player = new Player(levelData.playerStart.x, levelData.playerStart.y);
        platforms = levelData.platforms.map(p => new Platform(p.x, p.y, p.width, p.height, p.type)); // Re-instance
        // collectibles = levelData.collectibles.map(...);
        // enemies = levelData.enemies.map(...);
        score = 0; // Reset score per level or carry over? For now, reset.
        updateGameInfo();
    }

    function initGame() {
        lives = 3;
        currentLevelIndex = 0;
        loadLevel(currentLevelIndex);
        gameActive = true;

        messageScreen.style.display = 'none';
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        if (mobileControlsDiv) mobileControlsDiv.style.display = isTouchDevice() ? 'flex' : 'none';

        if(animationFrameId) cancelAnimationFrame(animationFrameId);
        gameLoop();
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function updateGameInfo() {
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        levelDisplay.textContent = currentLevelIndex + 1;
    }

    function checkCollisions() {
        // Player vs Platforms
        platforms.forEach(platform => {
            // Check for collision between player and platform
            if (player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y) {

                // Collision occurred
                if (platform.type === 'hazard') {
                    playerHit();
                    return;
                }
                if (platform.type === 'goal') {
                    levelComplete();
                    return;
                }

                // Resolve collision (simple top collision for now)
                // If player was falling and lands on top of platform
                if (player.dy > 0 && (player.y + player.height - player.dy) <= platform.y) {
                     player.y = platform.y - player.height;
                     player.dy = 0;
                     player.onGround = true;
                }
                // TODO: Add side collision resolution if needed
            }
        });
        // Player vs Canvas boundaries (left/right)
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    }

    function playerHit() {
        lives--;
        updateGameInfo();
        if (lives <= 0) {
            gameOver("Game Over!");
        } else {
            // Reset player position for current level
            loadLevel(currentLevelIndex); // Reloads player to start of level
        }
    }

    function levelComplete() {
        // For now, just show win message if it's the last level
        if (currentLevelIndex >= levels.length - 1) {
            gameOver("You Beat All Levels!");
        } else {
            // currentLevelIndex++;
            // loadLevel(currentLevelIndex);
            // For simplicity in this example, one level.
            gameOver("Level Complete!");
        }
    }

    function gameOver(message) {
        gameActive = false;
        cancelAnimationFrame(animationFrameId);
        gameMessageText.textContent = message;
        finalScoreDisplay.textContent = score; // Score might not be primary for this game type
        messageScreen.style.display = 'flex';
    }

    function gameLoop() {
        if (!gameActive) return;

        ctx.fillStyle = '#e0f7fa'; // Light blue sky
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        player.update();
        checkCollisions(); // Check and resolve collisions AFTER updating position

        platforms.forEach(p => p.draw());
        player.draw();
        // collectibles.forEach(c => c.draw());
        // enemies.forEach(e => { e.update(); e.draw(); });

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Event Listeners
    document.addEventListener('keydown', (e) => {
        if (!gameActive && e.key !== 'Enter') return;
        switch (e.key) {
            case 'ArrowLeft': keys.left = true; break;
            case 'ArrowRight': keys.right = true; break;
            case 'ArrowUp':
            case ' ': // Spacebar for jump
                e.preventDefault(); // Prevent page scroll for space
                if (!keys.up) { // Prevent continuous jump if key held, trigger on press
                    player.jump();
                    keys.up = true; // Mark as pressed
                }
                break;
             case 'Enter': if (!gameActive) initGame(); break;
        }
    });
    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft': keys.left = false; break;
            case 'ArrowRight': keys.right = false; break;
            case 'ArrowUp':
            case ' ':
                keys.up = false; // Reset jump key state
                break;
        }
    });

    // Mobile controls
    if(pjLeftBtn) {
        pjLeftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
        pjLeftBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
        pjLeftBtn.addEventListener('mousedown', (e) => { e.preventDefault(); keys.left = true; }); // For desktop testing
        pjLeftBtn.addEventListener('mouseup', (e) => { e.preventDefault(); keys.left = false; });
    }
    if(pjRightBtn) {
        pjRightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
        pjRightBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
        pjRightBtn.addEventListener('mousedown', (e) => { e.preventDefault(); keys.right = true; });
        pjRightBtn.addEventListener('mouseup', (e) => { e.preventDefault(); keys.right = false; });
    }
    if(pjJumpBtn) {
        pjJumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if (!keys.up) { player.jump(); keys.up = true;} });
        pjJumpBtn.addEventListener('touchend', (e) => { e.preventDefault(); keys.up = false; });
        pjJumpBtn.addEventListener('mousedown', (e) => { e.preventDefault(); if (!keys.up) { player.jump(); keys.up = true;} });
        pjJumpBtn.addEventListener('mouseup', (e) => { e.preventDefault(); keys.up = false; });
    }


    startBtn.addEventListener('click', initGame);
    restartBtn.addEventListener('click', initGame);

    function showStartScreen() {
        messageScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        canvas.style.display = 'block';
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // Draw initial level elements (optional, or just show player at start)
        if (levels[0]) {
            const p = new Player(levels[0].playerStart.x, levels[0].playerStart.y);
            p.draw();
            levels[0].platforms.forEach(plat => {
                const platformObj = new Platform(plat.x, plat.y, plat.width, plat.height, plat.type);
                platformObj.draw();
            });
        }
        if (mobileControlsDiv) mobileControlsDiv.style.display = 'none';
    }
    showStartScreen();
});
