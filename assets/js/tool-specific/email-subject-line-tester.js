document.addEventListener('DOMContentLoaded', () => {
    const subjectInput = document.getElementById('subjectLineInput');
    const analysisOutput = document.getElementById('analysisOutput');
    const previewDesktop = document.getElementById('previewDesktop');
    const previewMobile = document.getElementById('previewMobile');
    const previewMobileAndroid = document.getElementById('previewMobileAndroid');

    // List of common spam trigger words (simplified list)
    const spamWords = [
        'free', 'win', 'winner', '$$$', 'buy now', 'order now', 'click here',
        'act now', 'urgent', 'limited time', 'offer', 'deal', 'amazing',
        'guaranteed', 'risk-free', 'no cost', 'congratulations', 'prize'
    ];

    function analyzeSubjectLine() {
        const subject = subjectInput.value;
        analysisOutput.innerHTML = ''; // Clear previous results

        if (!subject.trim()) {
            analysisOutput.innerHTML = '<p class="text-muted">Start typing a subject line to see the analysis.</p>';
            updatePreviews("");
            return;
        }

        const analysisList = document.createElement('ul');

        // 1. Character Count
        const charCount = subject.length;
        let charFeedback = { text: `Length: ${charCount} characters. This is a good length.`, type: 'good' };
        if (charCount > 60) charFeedback = { text: `Length: ${charCount} characters. This is quite long and may get cut off.`, type: 'warning' };
        if (charCount < 20) charFeedback = { text: `Length: ${charCount} characters. Very short, consider being more descriptive.`, type: 'warning' };
        if (charCount === 0) charFeedback.text = 'Length: 0 characters. Please enter a subject.';
        analysisList.appendChild(createAnalysisItem(charFeedback.text, charFeedback.type));

        // 2. Word Count
        const wordCount = subject.trim().split(/\s+/).length;
        let wordFeedback = { text: `Words: ${wordCount}. Looks reasonable.`, type: 'good' };
        if (wordCount > 9) wordFeedback = { text: `Words: ${wordCount}. This is quite wordy, aim for conciseness.`, type: 'warning'};
        if (wordCount < 3) wordFeedback = { text: `Words: ${wordCount}. Very few words, may lack context.`, type: 'warning'};
        analysisList.appendChild(createAnalysisItem(wordFeedback.text, wordFeedback.type));

        // 3. Spam Word Check
        const foundSpamWords = spamWords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(subject));
        if (foundSpamWords.length > 0) {
            analysisList.appendChild(createAnalysisItem(`Contains potential spam words: ${foundSpamWords.join(', ')}. This may increase the risk of landing in spam folders.`, 'bad'));
        } else {
            analysisList.appendChild(createAnalysisItem('No common spam trigger words found.', 'good'));
        }

        // 4. All Caps Check
        const allCapsWords = subject.split(/\s+/).filter(word => word.length > 3 && word === word.toUpperCase());
        if (allCapsWords.length > 0) {
             analysisList.appendChild(createAnalysisItem(`Using all caps can look like shouting: ${allCapsWords.join(', ')}.`, 'bad'));
        }

        // 5. Personalization Check (e.g., using merge tags)
        if (/\[name\]|{name}|FNAME/i.test(subject)) {
             analysisList.appendChild(createAnalysisItem('Includes a personalization tag. Great for engagement!', 'good'));
        }

        analysisOutput.appendChild(analysisList);
        updatePreviews(subject);
    }

    function createAnalysisItem(text, type = 'good') {
        const li = document.createElement('li');
        let iconClass = 'bx-check-circle'; // good
        if (type === 'warning') iconClass = 'bx-error-circle';
        if (type === 'bad') iconClass = 'bx-block';

        li.className = type;
        li.innerHTML = `<i class='bx ${iconClass}'></i> <div>${text}</div>`;
        return li;
    }

    function updatePreviews(subject) {
        // These character limits are approximations for preview purposes
        previewDesktop.textContent = subject.substring(0, 70);
        previewMobile.textContent = subject.substring(0, 41);
        previewMobileAndroid.textContent = subject.substring(0, 30);
    }


    subjectInput.addEventListener('input', analyzeSubjectLine);

    // Initial analysis
    analyzeSubjectLine();
});
