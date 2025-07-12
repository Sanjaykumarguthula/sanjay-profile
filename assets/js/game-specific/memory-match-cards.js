document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('memoryGameGrid');
    const turnsDisplay = document.getElementById('turnsDisplay');
    const difficultySelect = document.getElementById('difficultyMemory');
    const restartBtn = document.getElementById('restartMemoryGameBtn');
    const winMessageScreen = document.getElementById('winMessageMemory');
    const finalTurnsDisplay = document.getElementById('finalTurnsMemory');
    const playAgainWinBtn = document.getElementById('playAgainMemoryBtn');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let turns = 0;
    let canFlip = true; // To prevent flipping more than 2 cards at once

    const cardSymbols = [ // Using BoxIcons names
        'bxl-html5', 'bxl-css3', 'bxl-javascript', 'bxl-react',
        'bxl-angular', 'bxl-vuejs', 'bxl-nodejs', 'bxl-python',
        'bxl-java', 'bxl-php', 'bxl-docker', 'bxl-git',
        'bxl-android', 'bxl-apple', 'bxl-windows'
    ]; // 15 symbols, enough for 6x5 grid (30 cards / 15 pairs)

    const difficulties = {
        easy: { rows: 3, cols: 4, pairs: 6 },    // 12 cards
        medium: { rows: 4, cols: 4, pairs: 8 },  // 16 cards
        hard: { rows: 4, cols: 5, pairs: 10 },   // 20 cards
        expert: { rows: 5, cols: 6, pairs: 15 }  // 30 cards
    };
    let currentDifficulty = 'easy';

    function initGame(difficulty) {
        currentDifficulty = difficulty;
        const settings = difficulties[difficulty];
        totalPairs = settings.pairs;

        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        turns = 0;
        canFlip = true;

        updateTurnsDisplay();
        winMessageScreen.style.display = 'none';

        // Create card pairs
        const symbolsForGame = cardSymbols.slice(0, totalPairs);
        let gameCardSet = [...symbolsForGame, ...symbolsForGame]; // Duplicate for pairs

        // Shuffle cards
        gameCardSet.sort(() => 0.5 - Math.random());

        gameGrid.innerHTML = '';
        gameGrid.style.gridTemplateColumns = `repeat(${settings.cols}, 1fr)`;
        // gameGrid.style.gridTemplateRows = `repeat(${settings.rows}, 1fr)`; // CSS can handle this with aspect ratio

        gameCardSet.forEach((symbol, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.id = index;
            cardElement.dataset.symbol = symbol;

            const cardInner = document.createElement('div');
            cardInner.classList.add('memory-card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('memory-card-front');
            // cardFront.innerHTML = "?"; // Or a logo

            const cardBack = document.createElement('div');
            cardBack.classList.add('memory-card-back');
            cardBack.innerHTML = `<i class='bx ${symbol} bx-lg'></i>`;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener('click', () => handleCardClick(cardElement));
            gameGrid.appendChild(cardElement);
        });
    }

    function handleCardClick(cardElement) {
        if (!canFlip || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
            return;
        }

        cardElement.classList.add('flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            canFlip = false; // Prevent more flips until these are processed
            turns++;
            updateTurnsDisplay();
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === totalPairs) {
                winGame();
            }
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000); // Time to see the cards before they flip back
        }
    }

    function updateTurnsDisplay() {
        turnsDisplay.textContent = turns;
    }

    function winGame() {
        finalTurnsDisplay.textContent = turns;
        winMessageScreen.style.display = 'flex';
    }

    // Event Listeners
    difficultySelect.addEventListener('change', (e) => {
        initGame(e.target.value);
    });
    restartBtn.addEventListener('click', () => initGame(currentDifficulty));
    playAgainWinBtn.addEventListener('click', () => initGame(currentDifficulty));

    // Initial game setup
    initGame(currentDifficulty);
});
