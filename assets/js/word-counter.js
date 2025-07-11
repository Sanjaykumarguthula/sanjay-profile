document.addEventListener('DOMContentLoaded', function () {
    // --- Word Counter Logic ---
    const wordCounterInput = document.getElementById('wordCounterInput');
    const keywordInput = document.getElementById('keywordInput'); // New input for keyword
    const wordCountOutput = document.getElementById('wordCountOutput');
    const charCountOutput = document.getElementById('charCountOutput');
    const charCountIncludeSpacesToggle = document.getElementById('charCountIncludeSpacesToggle');
    const sentenceCountOutput = document.getElementById('sentenceCountOutput');
    const paragraphCountOutput = document.getElementById('paragraphCountOutput');
    const readingTimeOutput = document.getElementById('readingTimeOutput');
    const avgWordLengthOutput = document.getElementById('avgWordLengthOutput'); // New output for avg word length
    const keywordCountOutput = document.getElementById('keywordCountOutput'); // New output for keyword count
    const keywordDensityOutput = document.getElementById('keywordDensityOutput'); // New output for keyword density
    const clearTextBtn = document.getElementById('clearTextBtn');

    function updateCounts() {
        if (!wordCounterInput || !wordCountOutput || !charCountOutput || !charCountIncludeSpacesToggle || !sentenceCountOutput || !paragraphCountOutput || !readingTimeOutput || !avgWordLengthOutput || !keywordInput || !keywordCountOutput || !keywordDensityOutput) {
            // If any essential element is missing, don't proceed.
            // This can happen if the script is somehow loaded on a page without these elements.
            return;
        }

        const text = wordCounterInput.value;
        const keyword = keywordInput.value.trim().toLowerCase();

        // Character count
        if (charCountIncludeSpacesToggle.checked) {
            charCountOutput.textContent = text.length;
        } else {
            charCountOutput.textContent = text.replace(/\s/g, '').length;
        }

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const actualWordCount = (text.trim() === "") ? 0 : words.length;
        wordCountOutput.textContent = actualWordCount;

        // Sentence count
        if (text.trim() === "") {
            sentenceCountOutput.textContent = 0;
        } else {
            const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
            sentenceCountOutput.textContent = sentences ? sentences.length : 0;
        }

        // Paragraph count
        if (text.trim() === "") {
            paragraphCountOutput.textContent = 0;
        } else {
            const paragraphs = text.trim().split(/\n\s*\n*/).filter(p => p.trim() !== "");
            paragraphCountOutput.textContent = paragraphs.length;
        }

        // Reading time estimate
        const wpm = 200; // Average words per minute
        if (actualWordCount === 0) {
            readingTimeOutput.textContent = "~0 min";
        } else {
            const minutes = Math.ceil(actualWordCount / wpm);
            readingTimeOutput.textContent = `~${minutes} min`;
        }

        // Average word length
        if (actualWordCount === 0) {
            avgWordLengthOutput.textContent = "0.00";
        } else {
            const totalLengthOfWords = words.reduce((acc, word) => acc + word.length, 0);
            avgWordLengthOutput.textContent = (totalLengthOfWords / actualWordCount).toFixed(2);
        }

        // Keyword Count & Density
        if (keyword && actualWordCount > 0) {
            const keywordRegex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
            const matches = text.toLowerCase().match(keywordRegex);
            const count = matches ? matches.length : 0;
            keywordCountOutput.textContent = count;
            keywordDensityOutput.textContent = ((count / actualWordCount) * 100).toFixed(2) + "%";
        } else {
            keywordCountOutput.textContent = "0";
            keywordDensityOutput.textContent = "0.00%";
        }
    }

    if (wordCounterInput) {
        wordCounterInput.addEventListener('input', updateCounts);
    }
    if (keywordInput) {
        keywordInput.addEventListener('input', updateCounts);
    }
    if (charCountIncludeSpacesToggle) {
        charCountIncludeSpacesToggle.addEventListener('change', updateCounts);
    }

    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', function() {
            if (wordCounterInput) {
                wordCounterInput.value = '';
            }
            if (keywordInput) {
                keywordInput.value = '';
            }
            updateCounts(); // Trigger update to reset all counts to 0
        });
    }

    // Initial calculation in case there's pre-filled text (e.g. browser remembers)
    updateCounts();
    // --- End Word Counter Logic ---
});
