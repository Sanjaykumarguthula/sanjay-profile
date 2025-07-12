document.addEventListener('DOMContentLoaded', () => {
    const categoryDisplay = document.getElementById('categoryDisplay');
    const incorrectGuessesDisplay = document.getElementById('incorrectGuessesDisplay');
    const maxIncorrectGuessesDisplay = document.getElementById('maxIncorrectGuesses');
    const hangmanCanvas = document.getElementById('hangmanCanvas');
    const ctx = hangmanCanvas.getContext('2d');
    const wordDisplayContainer = document.getElementById('wordDisplayContainer');
    const alphabetButtonsContainer = document.getElementById('alphabetButtonsContainer');
    const messageScreen = document.getElementById('hangmanMessageScreen');
    const messageTextElement = document.getElementById('hangmanMessageText');
    const correctWordDisplay = document.getElementById('correctWordDisplay');
    const playAgainBtn = document.getElementById('playHangmanAgainBtn');
    const newWordBtn = document.getElementById('newWordBtn');
    // const categorySelector = document.getElementById('categorySelector'); // Optional

    const wordList = {
        general: ["JAVASCRIPT", "HTML", "DEVELOPER", "COMPUTER", "CHALLENGE", "WEBSITE", "PROGRAM", "GUTHULA", "SANJAY"],
        animals: ["ELEPHANT", "TIGER", "GIRAFFE", "MONKEY", "ZEBRA", "PENGUIN", "CROCODILE"],
        countries: ["INDIA", "CANADA", "BRAZIL", "JAPAN", "AUSTRALIA", "GERMANY", "FRANCE"]
    };
    let currentCategory = 'general';
    let selectedWord = '';
    let guessedLetters = [];
    let incorrectGuesses = 0;
    const MAX_INCORRECT_GUESSES = 6;

    function initGame() {
        // Select word
        const wordsInCategory = wordList[currentCategory];
        selectedWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];

        guessedLetters = [];
        incorrectGuesses = 0;

        messageScreen.style.display = 'none';
        updateDisplays();
        createAlphabetButtons();
        drawHangman(); // Initial empty gallows
    }

    function updateDisplays() {
        // Word display
        wordDisplayContainer.innerHTML = selectedWord
            .split('')
            .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
            .join(' ');

        // Incorrect guesses
        if (incorrectGuessesDisplay) incorrectGuessesDisplay.textContent = incorrectGuesses;
        if (maxIncorrectGuessesDisplay) maxIncorrectGuessesDisplay.textContent = MAX_INCORRECT_GUESSES;
        if (categoryDisplay) categoryDisplay.textContent = `Category: ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`;
    }

    function createAlphabetButtons() {
        alphabetButtonsContainer.innerHTML = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'm-1', 'alphabet-btn');
            button.textContent = letter;
            button.addEventListener('click', () => handleGuess(letter));
            alphabetButtonsContainer.appendChild(button);
        });
    }

    function handleGuess(letter) {
        if (guessedLetters.includes(letter) || incorrectGuesses >= MAX_INCORRECT_GUESSES) {
            return; // Already guessed or game over
        }

        guessedLetters.push(letter);
        const button = Array.from(alphabetButtonsContainer.children).find(btn => btn.textContent === letter);
        if (button) button.disabled = true;

        if (selectedWord.includes(letter)) {
            button?.classList.add('btn-success'); // Correct guess
            button?.classList.remove('btn-outline-primary');
        } else {
            incorrectGuesses++;
            button?.classList.add('btn-danger'); // Incorrect guess
            button?.classList.remove('btn-outline-primary');
            drawHangman();
        }
        updateDisplays();
        checkGameStatus();
    }

    function checkGameStatus() {
        const wordGuessed = selectedWord.split('').every(letter => guessedLetters.includes(letter));
        if (wordGuessed) {
            endGame(true);
        } else if (incorrectGuesses >= MAX_INCORRECT_GUESSES) {
            endGame(false);
        }
    }

    function endGame(isWin) {
        messageTextElement.textContent = isWin ? "Congratulations, You Win!" : "Game Over! The Stickman is Hanged.";
        correctWordDisplay.textContent = selectedWord;
        messageScreen.style.display = 'block';
        // Disable all alphabet buttons
        Array.from(alphabetButtonsContainer.children).forEach(btn => btn.disabled = true);
    }

    function drawHangman() {
        ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        // Gallows
        ctx.beginPath();
        ctx.moveTo(20, 230); ctx.lineTo(100, 230); // Base
        ctx.moveTo(60, 230); ctx.lineTo(60, 20);  // Pole
        ctx.lineTo(150, 20); // Top bar
        ctx.lineTo(150, 50); // Rope
        ctx.stroke();

        if (incorrectGuesses > 0) { // Head
            ctx.beginPath();
            ctx.arc(150, 70, 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (incorrectGuesses > 1) { // Body
            ctx.beginPath();
            ctx.moveTo(150, 90); ctx.lineTo(150, 150);
            ctx.stroke();
        }
        if (incorrectGuesses > 2) { // Left Arm
            ctx.beginPath();
            ctx.moveTo(150, 110); ctx.lineTo(120, 130);
            ctx.stroke();
        }
        if (incorrectGuesses > 3) { // Right Arm
            ctx.beginPath();
            ctx.moveTo(150, 110); ctx.lineTo(180, 130);
            ctx.stroke();
        }
        if (incorrectGuesses > 4) { // Left Leg
            ctx.beginPath();
            ctx.moveTo(150, 150); ctx.lineTo(120, 190);
            ctx.stroke();
        }
        if (incorrectGuesses > 5) { // Right Leg
            ctx.beginPath();
            ctx.moveTo(150, 150); ctx.lineTo(180, 190);
            ctx.stroke();
            // Optional: sad face on game over
            ctx.beginPath(); ctx.arc(145, 65, 3, 0, Math.PI*2); ctx.fill(); // Left eye
            ctx.beginPath(); ctx.arc(155, 65, 3, 0, Math.PI*2); ctx.fill(); // Right eye
            ctx.beginPath(); ctx.arc(150, 80, 10, Math.PI*0.2, Math.PI*0.8); ctx.stroke(); // Sad mouth
        }
    }

    // Event Listeners
    newWordBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', initGame);

    // Optional Category Selector Logic
    // if (categorySelector) {
    //     categorySelector.addEventListener('change', (e) => {
    //         currentCategory = e.target.value;
    //         initGame();
    //     });
    // }

    // Initial game setup
    initGame();
});
