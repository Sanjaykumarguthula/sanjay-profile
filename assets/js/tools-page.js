const toolsData = [
    {
        // id: "wordCounterToolSection", // No longer needed, page is separate
        name: "Word Counter",
        category: "Text Analysis",
        description: "Counts words and characters in text input. Useful for marketers and writers.",
        url: "tools/word-counter.html"
    },
    {
        // id: "jsonValidatorToolSection", // No longer needed
        name: "JSON Validator",
        category: "Developer Tools",
        description: "Validates and formats JSON input. Great for developers.",
        url: "tools/json-validator-formatter.html"
    },
    {
        name: "Image Compressor",
        category: "Web Optimization",
        description: "Compresses images client-side. Useful for web optimization.",
        url: "tools/image-compressor.html"
    },
    {
        // id: "seoMetaTagCheckerToolSection", // No longer needed
        name: "SEO Meta Tag Checker",
        category: "SEO",
        description: "Analyzes a page's HTML meta tags. Client-side analysis.",
        url: "tools/seo-meta-tag-checker.html"
    },
    {
        name: "Color Palette Generator",
        category: "Design",
        description: "Creates color schemes from a base color. For designers.",
        url: "tools/color-palette-generator.html"
    },
    {
        name: "QR Code Generator",
        category: "Utilities",
        description: "Generates QR codes from URLs or text. Marketing-friendly.",
        url: "tools/qr-code-generator.html"
    },
    {
        name: "Text Case Converter",
        category: "Text Manipulation",
        description: "Converts text to upper, lower, or title case. Content editing.",
        url: "tools/text-case-converter.html"
    },
    {
        name: "Password Generator",
        category: "Security",
        description: "Creates secure, random passwords. Security-focused.",
        url: "tools/password-generator.html"
    },
    {
        name: "URL Encoder/Decoder",
        category: "Developer Tools",
        description: "Encodes or decodes URLs. Developer utility.",
        url: "tools/url-encoder-decoder.html"
    },
    {
        name: "Markdown Previewer",
        category: "Developer Tools",
        description: "Converts Markdown to HTML in real-time. For writers/developers.",
        url: "tools/markdown-previewer.html"
    },
    {
        name: "Base64 Encoder/Decoder",
        category: "Developer Tools",
        description: "Encodes or decodes Base64 strings. Developer tool.",
        url: "tools/base64-encoder-decoder.html"
    },
    {
        name: "Sitemap Generator",
        category: "SEO",
        description: "Creates a basic XML sitemap from a list of URLs. SEO tool.",
        url: "tools/sitemap-generator.html"
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
                <a href="${tool.url}" class="btn btn-use-now">Use Now</a>
            `;
            // Button is now an anchor tag directly linking to the tool page

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
    // This logic will be moved to /assets/js/word-counter.js and removed from here.
    // const wordCounterInput = document.getElementById('wordCounterInput');
    // ... (rest of word counter logic) ...
    // --- End Word Counter Logic ---

    // --- Tool Navigation Logic ---
    // This section is no longer needed as navigation is handled by direct links.
    // const allToolSections = document.querySelectorAll('.tool-content .row[id$="ToolSection"]');
    // ... (rest of showToolSection, showToolsList, and event listeners for Use Now/Back buttons) ...
    // --- End Tool Navigation Logic ---

    // --- JSON Validator Logic ---
    // This logic will be moved to /assets/js/json-validator.js and removed from here.
    // const jsonInputArea = document.getElementById('jsonInputArea');
    // ... (rest of JSON validator logic) ...
    // --- End JSON Validator Logic ---

    // --- SEO Meta Tag Checker Logic ---
    // This logic will be moved to /assets/js/seo-meta-tag-checker.js and removed from here.
    // const htmlInputArea = document.getElementById('htmlInputArea');
    // ... (rest of SEO meta tag checker logic) ...
    // --- End SEO Meta Tag Checker Logic ---
});
