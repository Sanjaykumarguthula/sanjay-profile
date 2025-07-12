document.addEventListener('DOMContentLoaded', () => {
    const coinCountDisplay = document.getElementById('coinCountDisplay');
    const cpsDisplay = document.getElementById('cpsDisplay'); // Coins Per Second
    const cpcDisplay = document.getElementById('cpcDisplay'); // Coins Per Click
    const mainClickButton = document.getElementById('mainClickButton');
    const upgradesContainer = document.getElementById('upgradesContainer');
    const clickEffectContainer = document.getElementById('clickEffectContainer');

    const saveGameBtn = document.getElementById('saveGameBtn');
    const loadGameBtn = document.getElementById('loadGameBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const saveStatus = document.getElementById('saveStatus');

    let gameState = {
        coins: 0,
        coinsPerClick: 1,
        coinsPerSecond: 0,
        upgrades: {} // Stores level of each upgrade
    };

    const upgradeDefinitions = [
        { id: 'strongFinger', name: 'Stronger Finger', baseCost: 10, costMultiplier: 1.15, baseCpcBonus: 1, type: 'cpc' },
        { id: 'powerGlove', name: 'Power Glove', baseCost: 100, costMultiplier: 1.2, baseCpcBonus: 5, type: 'cpc' },
        { id: 'autoClicker', name: 'Auto-Clicker Bot', baseCost: 25, costMultiplier: 1.12, baseCpsBonus: 1, type: 'cps' },
        { id: 'coinPrinter', name: 'Coin Printer', baseCost: 250, costMultiplier: 1.18, baseCpsBonus: 8, type: 'cps' },
        { id: 'goldMine', name: 'Gold Mine', baseCost: 1500, costMultiplier: 1.22, baseCpsBonus: 50, type: 'cps' },
        { id: 'superCursor', name: 'Super Cursor', baseCost: 5000, costMultiplier: 1.25, baseCpcBonus: 100, type: 'cpc' },
        { id: 'cryptoFarm', name: 'Crypto Farm', baseCost: 10000, costMultiplier: 1.28, baseCpsBonus: 250, type: 'cps' }
    ];

    function calculateUpgradeCost(upgradeDef, level) {
        return Math.floor(upgradeDef.baseCost * Math.pow(upgradeDef.costMultiplier, level));
    }

    function renderUpgrades() {
        upgradesContainer.innerHTML = '';
        upgradeDefinitions.forEach(def => {
            const currentLevel = gameState.upgrades[def.id] || 0;
            const cost = calculateUpgradeCost(def, currentLevel);

            const card = document.createElement('div');
            card.className = 'col'; // Bootstrap column for responsive grid

            const upgradeDiv = document.createElement('div');
            upgradeDiv.className = 'card h-100 upgrade-item';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column';

            const nameEl = document.createElement('h5');
            nameEl.className = 'card-title';
            nameEl.textContent = def.name;
            cardBody.appendChild(nameEl);

            const levelEl = document.createElement('p');
            levelEl.className = 'card-text small text-muted';
            levelEl.textContent = `Level: ${currentLevel}`;
            cardBody.appendChild(levelEl);

            const effectEl = document.createElement('p');
            effectEl.className = 'card-text small';
            if (def.type === 'cpc') {
                effectEl.textContent = `+${def.baseCpcBonus * (currentLevel + 1) - (def.baseCpcBonus * currentLevel)} CPC`; // Show bonus for next level
            } else {
                effectEl.textContent = `+${def.baseCpsBonus} CPS`;
            }
            cardBody.appendChild(effectEl);

            const costEl = document.createElement('p');
            costEl.className = 'card-text mt-auto'; // Push to bottom
            costEl.innerHTML = `Cost: <strong class="upgrade-cost">${formatNumber(cost)}</strong> <i class='bx bxs-coin'></i>`;
            cardBody.appendChild(costEl);

            const buyBtn = document.createElement('button');
            buyBtn.className = 'btn btn-sm btn-success mt-2';
            buyBtn.textContent = 'Buy Upgrade';
            buyBtn.disabled = gameState.coins < cost;
            buyBtn.onclick = () => buyUpgrade(def.id);
            cardBody.appendChild(buyBtn);

            upgradeDiv.appendChild(cardBody);
            card.appendChild(upgradeDiv);
            upgradesContainer.appendChild(card);
        });
    }

    function formatNumber(num) {
        if (num < 1e3) return num.toString();
        if (num < 1e6) return (num / 1e3).toFixed(1) + "K";
        if (num < 1e9) return (num / 1e6).toFixed(1) + "M";
        if (num < 1e12) return (num / 1e9).toFixed(1) + "B";
        return (num / 1e12).toFixed(1) + "T";
    }


    function buyUpgrade(upgradeId) {
        const def = upgradeDefinitions.find(u => u.id === upgradeId);
        if (!def) return;

        const currentLevel = gameState.upgrades[upgradeId] || 0;
        const cost = calculateUpgradeCost(def, currentLevel);

        if (gameState.coins >= cost) {
            gameState.coins -= cost;
            gameState.upgrades[upgradeId] = currentLevel + 1;

            if (def.type === 'cpc') {
                gameState.coinsPerClick += def.baseCpcBonus;
            } else if (def.type === 'cps') {
                gameState.coinsPerSecond += def.baseCpsBonus;
            }
            updateAllDisplays();
        }
    }

    function updateAllDisplays() {
        coinCountDisplay.textContent = formatNumber(Math.floor(gameState.coins));
        cpsDisplay.textContent = formatNumber(gameState.coinsPerSecond);
        cpcDisplay.textContent = formatNumber(gameState.coinsPerClick);
        renderUpgrades(); // Re-render to update costs and disable status
    }

    function handleManualClick() {
        gameState.coins += gameState.coinsPerClick;
        updateAllDisplays();
        showClickEffect();
    }

    function showClickEffect() {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.textContent = `+${formatNumber(gameState.coinsPerClick)}`;

        // Position near button or mouse
        const rect = mainClickButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2 + (Math.random() * 40 - 20) ;
        const y = rect.top + (Math.random() * 20 - 10);

        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;

        clickEffectContainer.appendChild(effect);
        setTimeout(() => {
            effect.remove();
        }, 1000); // Remove after animation
    }


    function gameLoop() {
        gameState.coins += gameState.coinsPerSecond / 20; // CPS divided by ticks per second (e.g., 20 ticks = 50ms interval)
        updateAllDisplays();
    }

    // Save, Load, Reset
    function saveGame() {
        try {
            localStorage.setItem('coinClickerTycoonSave', JSON.stringify(gameState));
            if(saveStatus) {
                saveStatus.textContent = "Game Saved! (" + new Date().toLocaleTimeString() + ")";
                setTimeout(() => saveStatus.textContent = "", 3000);
            }
        } catch (e) {
            console.error("Error saving game:", e);
            if(saveStatus) saveStatus.textContent = "Error saving game.";
        }
    }

    function loadGame() {
        try {
            const savedGame = localStorage.getItem('coinClickerTycoonSave');
            if (savedGame) {
                const loadedState = JSON.parse(savedGame);
                // Basic validation or migration if structure changed
                gameState.coins = loadedState.coins || 0;
                gameState.coinsPerClick = loadedState.coinsPerClick || 1;
                gameState.coinsPerSecond = loadedState.coinsPerSecond || 0;
                gameState.upgrades = loadedState.upgrades || {};
                updateAllDisplays();
                 if(saveStatus) {
                    saveStatus.textContent = "Game Loaded!";
                    setTimeout(() => saveStatus.textContent = "", 3000);
                }
            } else {
                 if(saveStatus) saveStatus.textContent = "No saved game found.";
            }
        } catch (e) {
            console.error("Error loading game:", e);
            if(saveStatus) saveStatus.textContent = "Error loading game.";
        }
    }

    function resetGame() {
        if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
            gameState = {
                coins: 0,
                coinsPerClick: 1,
                coinsPerSecond: 0,
                upgrades: {}
            };
            localStorage.removeItem('coinClickerTycoonSave'); // Clear saved data
            updateAllDisplays();
            if(saveStatus) {
                saveStatus.textContent = "Game Reset!";
                setTimeout(() => saveStatus.textContent = "", 3000);
            }
        }
    }

    // Event Listeners
    mainClickButton.addEventListener('click', handleManualClick);
    if(saveGameBtn) saveGameBtn.addEventListener('click', saveGame);
    if(loadGameBtn) loadGameBtn.addEventListener('click', loadGame);
    if(resetGameBtn) resetGameBtn.addEventListener('click', resetGame);

    // Auto-save every 30 seconds (optional)
    // setInterval(saveGame, 30000);

    // Initialize
    loadGame(); // Try to load saved game on start
    updateAllDisplays();
    setInterval(gameLoop, 50); // Game loop runs every 50ms (20 times per second)
});
