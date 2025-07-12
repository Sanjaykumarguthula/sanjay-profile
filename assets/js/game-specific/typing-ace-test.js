document.addEventListener('DOMContentLoaded', () => {
    const textToTypeContainer = document.getElementById('textToTypeContainer');
    const typingInputArea = document.getElementById('typingInputArea');
    const timerDisplay = document.getElementById('timerDisplayTyping');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const cpmDisplay = document.getElementById('cpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const testDurationSelect = document.getElementById('testDurationSelect');
    const startTestBtn = document.getElementById('startTypingTestBtn');
    const resultScreen = document.getElementById('typingTestResultScreen');
    const resultWPM = document.getElementById('resultWPM');
    const resultAccuracy = document.getElementById('resultAccuracy');
    const resultCorrectChars = document.getElementById('resultCorrectChars');
    const resultIncorrectChars = document.getElementById('resultIncorrectChars');
    const restartTestBtn = document.getElementById('restartTypingTestBtn');

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How quickly daft jumping zebras vex.",
        "Programming is the process of creating a set of instructions that tell a computer how to perform a task. It can be done using a variety of computer programming languages.",
        "Practice makes perfect. The more you type, the faster and more accurate you will become. Consistent effort is key to improvement.",
        "Web development involves building and maintaining websites. It includes aspects such as web design, web publishing, web programming, and database management.",
        "Artificial intelligence is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals. AI research has been defined as the field of study of intelligent agents."
    ];
    let currentText = "";
    let timeLeft = 60;
    let timerInterval;
    let testActive = false;
    let typedChars = 0;
    let correctChars = 0;
    let incorrectChars = 0;
    let startTime;

    function loadNewText() {
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        textToTypeContainer.innerHTML = ''; // Clear previous
        currentText.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToTypeContainer.appendChild(span);
        });
        typingInputArea.value = '';
        typingInputArea.disabled = true;
        resultScreen.style.display = 'none';
        startTestBtn.disabled = false;
        startTestBtn.textContent = "Start Test";
        resetStats();
    }

    function resetStats() {
        timeLeft = parseInt(testDurationSelect.value);
        if (isNaN(timeLeft) || timeLeft <=0) timeLeft = 60; // Default if "custom" or invalid

        timerDisplay.textContent = timeLeft + 's';
        wpmDisplay.textContent = "0";
        cpmDisplay.textContent = "0";
        accuracyDisplay.textContent = "100%";
        typedChars = 0;
        correctChars = 0;
        incorrectChars = 0;
        if(timerInterval) clearInterval(timerInterval);
    }

    function startTest() {
        if (testActive) return;
        loadNewText(); // Load new text each time test starts
        resetStats();
        testActive = true;
        typingInputArea.disabled = false;
        typingInputArea.focus();
        startTestBtn.disabled = true;
        startTestBtn.textContent = "Test in Progress...";
        startTime = new Date().getTime(); // Record start time for WPM/CPM

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft + 's';
            if (timeLeft <= 0) {
                endTest();
            }
            // Update WPM/CPM dynamically during test
            if (testActive) calculateCurrentMetrics();
        }, 1000);
    }

    function endTest() {
        clearInterval(timerInterval);
        testActive = false;
        typingInputArea.disabled = true;
        startTestBtn.disabled = false;
        startTestBtn.textContent = "Start Test";

        calculateFinalMetrics();

        resultWPM.textContent = wpmDisplay.textContent;
        resultAccuracy.textContent = accuracyDisplay.textContent;
        resultCorrectChars.textContent = correctChars;
        resultIncorrectChars.textContent = incorrectChars;
        resultScreen.style.display = 'block';
    }

    function calculateCurrentMetrics() {
        const timeElapsedSeconds = (new Date().getTime() - startTime) / 1000;
        if (timeElapsedSeconds === 0) return;

        const wordsTyped = (correctChars / 5); // Standard word length
        const wpm = Math.round((wordsTyped / timeElapsedSeconds) * 60) || 0;
        const cpm = Math.round((correctChars / timeElapsedSeconds) * 60) || 0;

        wpmDisplay.textContent = wpm;
        cpmDisplay.textContent = cpm;

        const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
        accuracyDisplay.textContent = accuracy + "%";
    }

    function calculateFinalMetrics() {
        // Use the selected test duration for final calculation unless custom passage was shorter
        const durationMinutes = (parseInt(testDurationSelect.value) / 60) || 1; // Default to 1 minute if something is wrong

        const grossWPM = Math.round((typedChars / 5) / durationMinutes) || 0;
        // Net WPM = ( (All Typed Entries / 5) - Uncorrected Errors ) / Time in Minutes
        // For simplicity, we'll use a common definition: Correct Chars / 5 / Time
        const netWPM = Math.round((correctChars / 5) / durationMinutes) || 0;
        wpmDisplay.textContent = netWPM; // Final WPM

        const finalAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
        accuracyDisplay.textContent = finalAccuracy + "%";
        cpmDisplay.textContent = Math.round(correctChars / durationMinutes) || 0; // Based on correct chars
    }


    typingInputArea.addEventListener('input', () => {
        if (!testActive) {
             // This could start the test if not already started by button
            // if(typingInputArea.value.length > 0 && startTestBtn.disabled === false) startTest();
            return;
        }

        const sourceChars = textToTypeContainer.querySelectorAll('span');
        const typedValue = typingInputArea.value;
        typedChars = typedValue.length;
        correctChars = 0;
        incorrectChars = 0;

        sourceChars.forEach((charSpan, index) => {
            const char = charSpan.textContent;
            if (index < typedValue.length) {
                if (typedValue[index] === char) {
                    charSpan.className = 'correct-char';
                    correctChars++;
                } else {
                    charSpan.className = 'incorrect-char';
                    incorrectChars++;
                }
            } else {
                charSpan.className = ''; // Not yet typed
            }
        });

        // Update accuracy live
        const currentAccuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
        accuracyDisplay.textContent = currentAccuracy + "%";

        // If using custom passage mode and all text is typed correctly
        if (testDurationSelect.value === "custom" && correctChars === currentText.length && typedValue.length === currentText.length) {
            endTest();
        }
    });

    startTestBtn.addEventListener('click', startTest);
    restartTestBtn.addEventListener('click', startTest); // Restart button on result screen
    testDurationSelect.addEventListener('change', () => {
        if (!testActive) { // Only allow change if test is not running
            loadNewText(); // Reload text for new duration setting
            resetStats();
        }
    });

    // Initial setup
    loadNewText();
    resetStats();
});
