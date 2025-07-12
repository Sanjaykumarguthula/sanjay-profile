document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInputForDensity');
    const keywordsInput = document.getElementById('keywordsInputForDensity');
    const analyzeBtn = document.getElementById('analyzeDensityBtn');
    const ignoreCaseToggle = document.getElementById('ignoreCaseToggle');
    const resultsOutput = document.getElementById('densityResultsOutput');
    const totalWordsCount = document.getElementById('totalWordsCount');

    analyzeBtn.addEventListener('click', analyzeDensity);

    function analyzeDensity() {
        const text = textInput.value;
        const keywords = keywordsInput.value.split('\n').map(k => k.trim()).filter(k => k.length > 0);

        if (!text.trim()) {
            resultsOutput.innerHTML = '<p class="text-danger">Please paste some text to analyze.</p>';
            totalWordsCount.textContent = '0';
            return;
        }
        if (keywords.length === 0) {
            resultsOutput.innerHTML = '<p class="text-danger">Please enter at least one keyword to analyze.</p>';
            return;
        }

        const words = text.trim().split(/\s+/);
        const totalWords = words.length;
        totalWordsCount.textContent = totalWords;

        const results = keywords.map(keyword => {
            const ignoreCase = ignoreCaseToggle.checked;
            const regex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, ignoreCase ? 'gi' : 'g');
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;
            const density = totalWords > 0 ? (count / totalWords) * 100 : 0;
            return { keyword, count, density };
        });

        displayResults(results);
    }

    function displayResults(results) {
        if (results.length === 0) {
            resultsOutput.innerHTML = '<p class="text-muted">No keywords found or an error occurred.</p>';
            return;
        }

        // Sort by count descending
        results.sort((a, b) => b.count - a.count);

        const table = document.createElement('table');
        table.className = 'table table-striped table-hover';

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Keyword/Keyphrase</th>
                    <th>Count</th>
                    <th>Density</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector('tbody');
        results.forEach(result => {
            const row = tbody.insertRow();
            const densityFormatted = result.density.toFixed(2);

            row.innerHTML = `
                <td>${escapeHTML(result.keyword)}</td>
                <td>${result.count}</td>
                <td>
                    <div class="progress" title="${densityFormatted}%">
                        <div class="progress-bar density-bar" role="progressbar" style="width: ${densityFormatted}%;" aria-valuenow="${densityFormatted}" aria-valuemin="0" aria-valuemax="100">${densityFormatted}%</div>
                    </div>
                </td>
            `;
        });

        resultsOutput.innerHTML = '';
        resultsOutput.appendChild(table);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
