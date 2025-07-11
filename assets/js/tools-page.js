const toolsData = [
    {
        id: "wordCounterToolSection", // Matches the ID of the HTML section
        name: "Word Counter",
        category: "Text Analysis",
        description: "Counts words and characters in text input. Useful for marketers and writers.",
        // url: "#word-counter-tool" // No longer primary navigation, handled by JS
    },
    {
        id: "jsonValidatorToolSection", // Matches the ID of the HTML section
        name: "JSON Validator",
        category: "Developer Tools",
        description: "Validates and formats JSON input. Great for developers.",
        // url: "#json-validator-tool" // JS handled
    },
    {
        name: "Image Compressor",
        category: "Web Optimization",
        description: "Compresses images client-side. Useful for web optimization.",
        url: "#image-compressor-tool" // Placeholder, will need an ID when implemented
    },
    {
        id: "seoMetaTagCheckerToolSection", // Matches the ID of the HTML section
        name: "SEO Meta Tag Checker",
        category: "SEO",
        description: "Analyzes a URL’s meta tags. Client-side or via API.",
        // url: "#seo-meta-tag-checker-tool" // JS handled
    },
    {
        name: "Color Palette Generator",
        category: "Design",
        description: "Creates color schemes from a base color. For designers.",
        url: "#color-palette-generator-tool"
    },
    {
        name: "QR Code Generator",
        category: "Utilities",
        description: "Generates QR codes from URLs or text. Marketing-friendly.",
        url: "#qr-code-generator-tool"
    },
    {
        name: "Text Case Converter",
        category: "Text Manipulation",
        description: "Converts text to upper, lower, or title case. Content editing.",
        url: "#text-case-converter-tool"
    },
    {
        name: "Password Generator",
        category: "Security",
        description: "Creates secure, random passwords. Security-focused.",
        url: "#password-generator-tool"
    },
    {
        name: "URL Encoder/Decoder",
        category: "Developer Tools",
        description: "Encodes or decodes URLs. Developer utility.",
        url: "#url-encoder-decoder-tool"
    },
    {
        name: "Markdown Previewer",
        category: "Developer Tools",
        description: "Converts Markdown to HTML in real-time. For writers/developers.",
        url: "#markdown-previewer-tool"
    },
    {
        name: "Base64 Encoder/Decoder",
        category: "Developer Tools",
        description: "Encodes or decodes Base64 strings. Developer tool.",
        url: "#base64-encoder-decoder-tool"
    },
    {
        name: "Sitemap Generator",
        category: "SEO",
        description: "Creates a basic XML sitemap from a list of URLs. SEO tool.",
        url: "#sitemap-generator-tool"
    }
];

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('toolSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const toolCardsContainer = document.getElementById('toolCardsContainer');

    // Function to filter tools
    function filterTools() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const toolCards = toolCardsContainer.querySelectorAll('.tool-card-wrapper'); // Select the wrapper div

        toolCards.forEach(cardWrapper => {
            const toolName = cardWrapper.getAttribute('data-tool-name').toLowerCase();
            const toolCategory = cardWrapper.getAttribute('data-tool-category').toLowerCase();
            // Later, we can add more data attributes like description if needed for search

            if (toolName.includes(searchTerm) || toolCategory.includes(searchTerm)) {
                cardWrapper.style.display = ''; // Show card
            } else {
                cardWrapper.style.display = 'none'; // Hide card
            }
        });
    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('keyup', filterTools);
    }

    // Event listener for clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function () {
            searchInput.value = '';
            filterTools(); // Re-apply filter (which will show all cards)
        });
    }

    // Function to generate and display tool cards
    function displayTools(tools) {
        toolCardsContainer.innerHTML = ''; // Clear existing cards

        if (!tools || tools.length === 0) {
            toolCardsContainer.innerHTML = '<p class="col-12 text-center">No tools found.</p>';
            return;
        }

        tools.forEach(tool => {
            // Create the outer wrapper for Bootstrap column and data attributes
            const cardWrapper = document.createElement('div');
            // Applying Bootstrap column classes for responsive grid
            // col-12 for mobile (1 column), col-md-6 for medium (2 columns), col-lg-4 for large (3 columns)
            cardWrapper.className = 'col-12 col-md-6 col-lg-4 mb-4 tool-card-wrapper';
            cardWrapper.setAttribute('data-tool-name', tool.name);
            cardWrapper.setAttribute('data-tool-category', tool.category);

            // Create the card element itself
            const cardElement = document.createElement('div');
            cardElement.className = 'tool-card'; // Use the CSS class we defined

            cardElement.innerHTML = `
                <h5>${tool.name}</h5>
                <p>${tool.description}</p>
                <button data-tool-id="${tool.id || tool.name.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-use-now">Use Now</button>
            `;
            // Removed direct href, will handle navigation via JS

            cardWrapper.appendChild(cardElement);
            toolCardsContainer.appendChild(cardWrapper);
        });
    }

    // Initial display of all tools
    if (toolCardsContainer && typeof toolsData !== 'undefined') {
        displayTools(toolsData);
    }

    // The filterTools function (defined above) will work by showing/hiding these generated cards.

    // --- Word Counter Logic ---
    const wordCounterInput = document.getElementById('wordCounterInput');
    const wordCountOutput = document.getElementById('wordCountOutput');
    const charCountOutput = document.getElementById('charCountOutput');
    const charCountIncludeSpacesToggle = document.getElementById('charCountIncludeSpacesToggle');
    const sentenceCountOutput = document.getElementById('sentenceCountOutput');
    const paragraphCountOutput = document.getElementById('paragraphCountOutput');
    const readingTimeOutput = document.getElementById('readingTimeOutput');

    function updateCounts() {
        if (!wordCounterInput || !wordCountOutput || !charCountOutput || !charCountIncludeSpacesToggle || !sentenceCountOutput || !paragraphCountOutput || !readingTimeOutput) return;

        const text = wordCounterInput.value;

        // Character count
        if (charCountIncludeSpacesToggle.checked) {
            charCountOutput.textContent = text.length;
        } else {
            charCountOutput.textContent = text.replace(/\s/g, '').length;
        }

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word !== "");
        wordCountOutput.textContent = words.length === 1 && words[0] === "" ? 0 : words.length;

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
            // Split by one or more newline characters, then filter out empty strings that might result from multiple blank lines.
            const paragraphs = text.trim().split(/\n\s*\n*/).filter(p => p.trim() !== "");
            paragraphCountOutput.textContent = paragraphs.length;
        }

        // Reading time estimate
        const wpm = 200; // Average words per minute
        const wordCount = words.length === 1 && words[0] === "" ? 0 : words.length;
        if (wordCount === 0) {
            readingTimeOutput.textContent = "~0 min";
        } else {
            const minutes = Math.ceil(wordCount / wpm);
            readingTimeOutput.textContent = `~${minutes} min`;
        }
    }

    if (wordCounterInput) {
        wordCounterInput.addEventListener('input', updateCounts);
    }
    if (charCountIncludeSpacesToggle) {
        charCountIncludeSpacesToggle.addEventListener('change', updateCounts);
    }

    const clearTextBtn = document.getElementById('clearTextBtn');
    if (clearTextBtn) {
        clearTextBtn.addEventListener('click', function() {
            if (wordCounterInput) {
                wordCounterInput.value = '';
            }
            updateCounts(); // Trigger update to reset all counts to 0
        });
    }
    // --- End Word Counter Logic ---

    // --- Tool Navigation Logic ---
    const allToolSections = document.querySelectorAll('.tool-content .row[id$="ToolSection"]'); // Selects all tool sections based on ID pattern
    const backToToolsBtns = document.querySelectorAll('.back-to-tools-btn'); // Select all back buttons by class

    function showToolSection(toolIdToShow) {
        // Hide tool cards container and search bar
        if (toolCardsContainer) toolCardsContainer.style.display = 'none';
        if (searchInput) searchInput.closest('.row').style.display = 'none';

        // Hide all tool sections
        allToolSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected tool section
        const sectionToShow = document.getElementById(toolIdToShow);
        if (sectionToShow) {
            sectionToShow.style.display = 'block'; // Or 'flex' if it's a flex container (Bootstrap row)
        } else {
            console.warn(`Tool section with ID "${toolIdToShow}" not found.`);
            showToolsList(); // Fallback to tools list if section not found
        }
    }

    function showToolsList() {
        // Hide all tool sections
        allToolSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show tool cards container and search bar
        if (toolCardsContainer) toolCardsContainer.style.display = 'flex'; // Bootstrap .row is display:flex
        if (searchInput) searchInput.closest('.row').style.display = 'flex';
    }

    // Event listener for "Use Now" buttons (delegated from the container)
    if (toolCardsContainer) {
        toolCardsContainer.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('btn-use-now')) {
                const toolId = target.getAttribute('data-tool-id');
                if (toolId) {
                    const toolDataEntry = toolsData.find(t => t.id === toolId || t.name.toLowerCase().replace(/\s+/g, '-') === toolId);
                    if (toolDataEntry && document.getElementById(toolId)) { // Check if an implemented section exists
                        showToolSection(toolId);
                    } else if (toolId) { // If toolId exists but no section, it's a placeholder for an unimplemented tool
                        window.location.href = 'coming-soon.html';
                    }
                }
            }
        });
    }

    // Event listener for all "Back to Tools" buttons
    if (backToToolsBtns) {
        backToToolsBtns.forEach(btn => {
            btn.addEventListener('click', showToolsList);
        });
    }
    // --- End Tool Navigation Logic ---

    // --- JSON Validator Logic ---
    const jsonInputArea = document.getElementById('jsonInputArea');
    const validateJsonBtn = document.getElementById('validateJsonBtn');
    const jsonResultArea = document.getElementById('jsonResultArea');
    const formattedJsonContainer = document.getElementById('formattedJsonContainer');
    const formattedJsonOutput = document.getElementById('formattedJsonOutput');

    function handleJsonValidation() {
        if (!jsonInputArea || !jsonResultArea || !formattedJsonOutput || !formattedJsonContainer) return;

        const jsonString = jsonInputArea.value.trim();
        jsonResultArea.innerHTML = ''; // Clear previous results
        formattedJsonOutput.textContent = '';
        formattedJsonContainer.style.display = 'none';
        jsonResultArea.className = 'mt-3 alert'; // Reset classes, keep margin

        if (!jsonString) {
            jsonResultArea.classList.add('alert-warning');
            jsonResultArea.textContent = 'Input is empty. Please paste some JSON.';
            return;
        }

        try {
            const parsedJson = JSON.parse(jsonString);
            jsonResultArea.classList.add('alert-success');
            jsonResultArea.textContent = 'Valid JSON!';

            formattedJsonOutput.textContent = JSON.stringify(parsedJson, null, 2); // Pretty print with 2 spaces
            formattedJsonContainer.style.display = 'block';
        } catch (error) {
            jsonResultArea.classList.add('alert-danger');
            jsonResultArea.textContent = `Invalid JSON: ${error.message}`;
        }
    }

    if (validateJsonBtn) {
        validateJsonBtn.addEventListener('click', handleJsonValidation);
    }
    // --- End JSON Validator Logic ---

    // --- SEO Meta Tag Checker Logic ---
    const htmlInputArea = document.getElementById('htmlInputArea');
    const analyzeMetaTagsBtn = document.getElementById('analyzeMetaTagsBtn');
    const metaTagsResultArea = document.getElementById('metaTagsResultArea');

    function displayMetaResult(label, value, isMissing = false) {
        const item = document.createElement('div');
        item.classList.add('meta-tag-item', 'mb-2');

        const labelEl = document.createElement('strong');
        labelEl.textContent = `${label}: `;
        item.appendChild(labelEl);

        if (isMissing) {
            const valueEl = document.createElement('span');
            valueEl.textContent = 'Not found';
            valueEl.classList.add('text-danger');
            item.appendChild(valueEl);
        } else if (value) {
            const valueEl = document.createElement('span');
            valueEl.textContent = value;
            valueEl.classList.add('text-success');
            item.appendChild(valueEl);
        } else { // Found but empty or null content
            const valueEl = document.createElement('span');
            valueEl.textContent = 'Found but empty';
            valueEl.classList.add('text-warning');
            item.appendChild(valueEl);
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
            displayMetaResult('Title', doc.title || null, !doc.title);

            // Meta Description
            const description = doc.querySelector('meta[name="description"]');
            displayMetaResult('Meta Description', description?.content || null, !description);

            // Meta Keywords
            const keywords = doc.querySelector('meta[name="keywords"]');
            displayMetaResult('Meta Keywords', keywords?.content || null, !keywords);

            // Viewport
            const viewport = doc.querySelector('meta[name="viewport"]');
            displayMetaResult('Viewport', viewport?.content || null, !viewport);

            // Open Graph Tags
            const ogTitle = doc.querySelector('meta[property="og:title"]');
            displayMetaResult('Open Graph Title (og:title)', ogTitle?.content || null, !ogTitle);

            const ogDescription = doc.querySelector('meta[property="og:description"]');
            displayMetaResult('Open Graph Description (og:description)', ogDescription?.content || null, !ogDescription);

            const ogImage = doc.querySelector('meta[property="og:image"]');
            displayMetaResult('Open Graph Image (og:image)', ogImage?.content || null, !ogImage);

            const ogUrl = doc.querySelector('meta[property="og:url"]');
            displayMetaResult('Open Graph URL (og:url)', ogUrl?.content || null, !ogUrl);

            const ogType = doc.querySelector('meta[property="og:type"]');
            displayMetaResult('Open Graph Type (og:type)', ogType?.content || null, !ogType);

            // Add more tags as needed (e.g., Twitter cards, canonical)

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
    // --- End SEO Meta Tag Checker Logic ---
});
