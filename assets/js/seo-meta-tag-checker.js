document.addEventListener('DOMContentLoaded', function () {
    // --- SEO Meta Tag Checker Logic ---
    const htmlInputArea = document.getElementById('htmlInputArea');
    const analyzeMetaTagsBtn = document.getElementById('analyzeMetaTagsBtn');
    const metaTagsResultArea = document.getElementById('metaTagsResultArea');
    const clearHtmlInputBtn = document.getElementById('clearHtmlInputBtn');

    function displayMetaResult(label, value, recommendations = []) {
        const item = document.createElement('div');
        item.classList.add('meta-tag-item', 'mb-3', 'p-2', 'border', 'rounded');

        const labelEl = document.createElement('strong');
        labelEl.textContent = `${label}: `;
        item.appendChild(labelEl);

        let statusClass = 'text-success'; // Default to success
        let displayValue = value;

        if (value === null || value === undefined || value.trim() === "") {
            statusClass = 'text-danger';
            displayValue = 'Not found or empty';
            if (label.includes('Title') || label.includes('Description')) { // Critical tags
                 recommendations.push(`${label} is missing or empty. This is crucial for SEO.`);
            }
        } else {
            if (label === 'Title Tag' && value.length > 60) {
                statusClass = 'text-warning';
                recommendations.push(`Title is ${value.length} characters long. Consider shortening to around 60 characters.`);
            }
            if (label === 'Meta Description' && (value.length > 160 || value.length < 50)) {
                statusClass = 'text-warning';
                recommendations.push(`Meta Description is ${value.length} characters. Aim for 50-160 characters.`);
            }
        }

        const valueEl = document.createElement('span');
        valueEl.textContent = displayValue;
        valueEl.classList.add(statusClass);
        item.appendChild(valueEl);

        if (value && label === 'Title Tag') {
            const lengthEl = document.createElement('small');
            lengthEl.textContent = ` (Length: ${value.length})`;
            lengthEl.className = 'ms-2 text-muted';
            item.appendChild(lengthEl);
        }
        if (value && label === 'Meta Description') {
            const lengthEl = document.createElement('small');
            lengthEl.textContent = ` (Length: ${value.length})`;
            lengthEl.className = 'ms-2 text-muted';
            item.appendChild(lengthEl);
        }


        if (recommendations.length > 0) {
            const recList = document.createElement('ul');
            recList.classList.add('mt-1', 'mb-0', 'small', 'text-muted');
            recommendations.forEach(recText => {
                const recItem = document.createElement('li');
                recItem.textContent = recText;
                if (recText.includes('crucial') || recText.includes('missing')) {
                    recItem.classList.add('text-danger');
                } else {
                    recItem.classList.add('text-warning');
                }
                recList.appendChild(recItem);
            });
            item.appendChild(recList);
        }

        metaTagsResultArea.appendChild(item);
    }

    function handleMetaTagAnalysis() {
        if (!htmlInputArea || !metaTagsResultArea) return;

        const htmlString = htmlInputArea.value.trim();
        metaTagsResultArea.innerHTML = ''; // Clear previous results

        if (!htmlString) {
            const warning = document.createElement('p');
            warning.textContent = 'HTML input is empty. Please paste some HTML source code.';
            warning.className = 'alert alert-warning';
            metaTagsResultArea.appendChild(warning);
            return;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");

            // Title
            displayMetaResult('Title Tag', doc.title || null);

            // Meta Description
            const description = doc.querySelector('meta[name="description"]');
            displayMetaResult('Meta Description', description?.content || null);

            // Meta Keywords
            const keywords = doc.querySelector('meta[name="keywords"]');
            displayMetaResult('Meta Keywords', keywords?.content || null,
                keywords ? [] : ["Meta keywords tag is missing. While less important now, some search engines might still consider it."]);

            // Viewport
            const viewport = doc.querySelector('meta[name="viewport"]');
            displayMetaResult('Viewport Tag', viewport?.content || null,
                viewport ? [] : ["Viewport tag is missing. This is important for mobile responsiveness."]);

            // Canonical Tag
            const canonical = doc.querySelector('link[rel="canonical"]');
            displayMetaResult('Canonical URL', canonical?.href || null,
                canonical ? [] : ["Canonical tag is missing. Consider adding it to prevent duplicate content issues."]);

            // H1 Tag (check first H1)
            const h1 = doc.querySelector('h1');
            displayMetaResult('H1 Tag (First Found)', h1?.textContent.trim() || null,
                h1 ? [] : ["No H1 tag found. H1 tags are important for defining the main topic of the page."]);


            // Open Graph Tags
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            displayMetaResult('Open Graph Title (og:title)', ogTitle?.content || null);

            const ogDescription = doc.querySelector('meta[property="og:description"]');
            displayMetaResult('Open Graph Description (og:description)', ogDescription?.content || null);

            const ogImage = doc.querySelector('meta[property="og:image"]');
            displayMetaResult('Open Graph Image (og:image)', ogImage?.content || null,
                ogImage ? [] : ["Open Graph Image (og:image) is missing. This is important for social sharing previews."]);

            const ogUrl = doc.querySelector('meta[property="og:url"]');
            displayMetaResult('Open Graph URL (og:url)', ogUrl?.content || null);

            const ogType = doc.querySelector('meta[property="og:type"]');
            displayMetaResult('Open Graph Type (og:type)', ogType?.content || null);

            // Twitter Card Tags
            const twitterCard = doc.querySelector('meta[name="twitter:card"]');
            displayMetaResult('Twitter Card Type (twitter:card)', twitterCard?.content || null,
                twitterCard ? [] : ["Twitter Card type (twitter:card) is missing. Useful for Twitter sharing."]);

            const twitterTitle = doc.querySelector('meta[name="twitter:title"], meta[property="twitter:title"]');
            displayMetaResult('Twitter Title', twitterTitle?.content || null);

            const twitterDescription = doc.querySelector('meta[name="twitter:description"], meta[property="twitter:description"]');
            displayMetaResult('Twitter Description', twitterDescription?.content || null);

            const twitterImage = doc.querySelector('meta[name="twitter:image"], meta[property="twitter:image"]');
            displayMetaResult('Twitter Image', twitterImage?.content || null);


        } catch (error) {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = `Error parsing HTML: ${error.message}`;
            errorMsg.className = 'alert alert-danger';
            metaTagsResultArea.appendChild(errorMsg);
        }
    }

    if (analyzeMetaTagsBtn) {
        analyzeMetaTagsBtn.addEventListener('click', handleMetaTagAnalysis);
    }

    if (clearHtmlInputBtn) {
        clearHtmlInputBtn.addEventListener('click', function() {
            if (htmlInputArea) {
                htmlInputArea.value = '';
            }
            if (metaTagsResultArea) {
                metaTagsResultArea.innerHTML = '<p class="text-muted">Results will appear here after analysis.</p>';
            }
        });
    }
    // --- End SEO Meta Tag Checker Logic ---
});
