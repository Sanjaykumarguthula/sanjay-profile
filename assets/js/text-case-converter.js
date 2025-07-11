document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('textInput');
    const textOutput = document.getElementById('textOutput');
    const btnUpperCase = document.getElementById('btnUpperCase');
    const btnLowerCase = document.getElementById('btnLowerCase');
    const btnTitleCase = document.getElementById('btnTitleCase');
    const btnSentenceCase = document.getElementById('btnSentenceCase');
    const btnToggleCase = document.getElementById('btnToggleCase');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const clearTextBtn = document.getElementById('clearTextBtn');

    function toTitleCase(str) {
        // Basic title case: handle small words.
        // More sophisticated library might be needed for perfect AP/Chicago style.
        const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
        return str.toLowerCase().split(' ').map(function(word, index, arr) {
            if (index === 0 || index === arr.length - 1 || !smallWords.test(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        }).join(' ');
    }

    function toSentenceCase(str) {
        // Basic sentence case. Capitalizes the first letter of each sentence.
        // Does not handle proper nouns specifically beyond the first letter of a sentence.
        return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
            return c.toUpperCase();
        });
    }

    function toToggleCase(str) {
        return str.split('').map(function(char) {
            if (char === char.toUpperCase()) {
                return char.toLowerCase();
            } else {
                return char.toUpperCase();
            }
        }).join('');
    }


    if (btnUpperCase) {
        btnUpperCase.addEventListener('click', function() {
            textOutput.value = textInput.value.toUpperCase();
        });
    }

    if (btnLowerCase) {
        btnLowerCase.addEventListener('click', function() {
            textOutput.value = textInput.value.toLowerCase();
        });
    }

    if (btnTitleCase) {
        btnTitleCase.addEventListener('click', function() {
            textOutput.value = toTitleCase(textInput.value);
        });
    }

    if (btnSentenceCase) {
        btnSentenceCase.addEventListener('click', function() {
            textOutput.value = toSentenceCase(textInput.value);
        });
    }

    if (btnToggleCase) {
        btnToggleCase.addEventListener('click', function() {
            textOutput.value = toToggleCase(textInput.value);
        });
    }

    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', function() {
            if (textOutput.value) {
                navigator.clipboard.writeText(textOutput.value).then(() => {
                    const originalText = copyOutputBtn.textContent;
                    copyOutputBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyOutputBtn.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy text. Please copy manually.');
                });
            }
        });
    }

    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', function() {
            textInput.value = '';
            textOutput.value = '';
        });
    }
});
