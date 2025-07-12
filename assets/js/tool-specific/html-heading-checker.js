document.addEventListener('DOMContentLoaded', () => {
    const htmlInput = document.getElementById('htmlInputForHeadings');
    const analyzeBtn = document.getElementById('analyzeHeadingsBtn');
    const clearBtn = document.getElementById('clearHtmlBtn');
    const treeOutput = document.getElementById('headingTreeOutput');
    const summaryOutput = document.getElementById('analysisSummary');

    analyzeBtn.addEventListener('click', analyzeHeadings);
    clearBtn.addEventListener('click', clearAll);

    function analyzeHeadings() {
        const htmlString = htmlInput.value;
        if (!htmlString.trim()) {
            treeOutput.innerHTML = '<p class="text-muted">Please paste some HTML to analyze.</p>';
            summaryOutput.innerHTML = '<p class="text-muted">Summary will appear here.</p>';
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        treeOutput.innerHTML = '';
        summaryOutput.innerHTML = '';

        if (headings.length === 0) {
            treeOutput.innerHTML = '<p class="text-muted">No heading tags (H1-H6) were found in the HTML.</p>';
            summaryOutput.innerHTML = '<p>No headings found.</p>';
            return;
        }

        const tree = buildHeadingTree(headings);
        const treeElement = createTreeElement(tree);
        treeOutput.appendChild(treeElement);

        generateAnalysisSummary(headings);
    }

    function buildHeadingTree(headings) {
        const root = { level: 0, children: [] };
        const path = [root];

        headings.forEach(h => {
            const level = parseInt(h.tagName.substring(1), 10);
            const node = {
                tagName: h.tagName,
                text: h.textContent.trim(),
                level: level,
                children: []
            };

            while (level <= path[path.length - 1].level) {
                path.pop();
            }
            path[path.length - 1].children.push(node);
            path.push(node);
        });
        return root;
    }

    function createTreeElement(node) {
        const ul = document.createElement('ul');
        node.children.forEach(child => {
            const li = document.createElement('li');

            const tagSpan = document.createElement('span');
            tagSpan.className = `heading-tag ${child.tagName.toLowerCase()}`;
            tagSpan.textContent = child.tagName;
            li.appendChild(tagSpan);

            const textSpan = document.createElement('span');
            textSpan.className = 'heading-text';
            textSpan.textContent = child.text || '(Empty)';
            li.appendChild(textSpan);

            if (child.error) {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'heading-error';
                errorSpan.textContent = `[${child.error}]`;
                li.appendChild(errorSpan);
            }

            if (child.children.length > 0) {
                li.appendChild(createTreeElement(child));
            }
            ul.appendChild(li);
        });
        return ul;
    }

    function generateAnalysisSummary(headings) {
        const summaryList = document.createElement('ul');
        let h1Count = 0;
        let lastLevel = 0;
        let errors = [];

        headings.forEach(h => {
            const level = parseInt(h.tagName.substring(1), 10);
            if (level === 1) h1Count++;
            if (lastLevel > 0 && level > lastLevel + 1) {
                errors.push(`Skipped heading level: H${lastLevel} to H${level}.`);
            }
            if (!h.textContent.trim()) {
                errors.push(`Empty ${h.tagName} tag found.`);
            }
            lastLevel = level;
        });

        // H1 Summary
        if (h1Count === 1) {
            summaryList.innerHTML += `<li class="summary-good"><i class='bx bx-check-circle'></i> Exactly one H1 tag found.</li>`;
        } else {
            summaryList.innerHTML += `<li class="summary-bad"><i class='bx bx-error-circle'></i> Found ${h1Count} H1 tags. A page should ideally have only one.</li>`;
        }

        // Skipped levels summary
        const skippedLevelErrors = errors.filter(e => e.startsWith('Skipped'));
        if (skippedLevelErrors.length === 0) {
            summaryList.innerHTML += `<li class="summary-good"><i class='bx bx-check-circle'></i> No skipped heading levels.</li>`;
        } else {
            skippedLevelErrors.forEach(err => {
                summaryList.innerHTML += `<li class="summary-bad"><i class='bx bx-error-circle'></i> ${err}</li>`;
            });
        }

        // Empty headings summary
        const emptyHeadingErrors = errors.filter(e => e.startsWith('Empty'));
        if (emptyHeadingErrors.length > 0) {
             summaryList.innerHTML += `<li class="summary-bad"><i class='bx bx-error-circle'></i> Found ${emptyHeadingErrors.length} empty heading tag(s).</li>`;
        }


        summaryOutput.appendChild(summaryList);
    }


    function clearAll() {
        htmlInput.value = '';
        treeOutput.innerHTML = '<p class="text-muted">Analysis results will appear here.</p>';
        summaryOutput.innerHTML = '<p class="text-muted">Summary will appear here.</p>';
    }
});
