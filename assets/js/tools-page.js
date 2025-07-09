const toolsData = [
    {
        id: "wordCounterToolSection", // Matches the ID of the HTML section
        name: "Word Counter",
        category: "Text Analysis",
        description: "Counts words and characters in text input. Useful for marketers and writers.",
        // url: "#word-counter-tool" // No longer primary navigation, handled by JS
    },
    {
        name: "JSON Validator",
        category: "Developer Tools",
        description: "Validates and formats JSON input. Great for developers.",
        url: "#json-validator-tool"
    },
    {
        name: "Image Compressor",
        category: "Web Optimization",
        description: "Compresses images client-side. Useful for web optimization.",
        url: "#image-compressor-tool"
    },
    {
        name: "SEO Meta Tag Checker",
        category: "SEO",
        description: "Analyzes a URL’s meta tags. Client-side or via API.",
        url: "#seo-meta-tag-checker-tool"
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

    function updateCounts() {
        if (!wordCounterInput || !wordCountOutput || !charCountOutput) return;

        const text = wordCounterInput.value;

        // Character count
        charCountOutput.textContent = text.length;

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word !== "");
        wordCountOutput.textContent = words.length === 1 && words[0] === "" ? 0 : words.length;
    }

    if (wordCounterInput) {
        wordCounterInput.addEventListener('input', updateCounts);
    }
    // --- End Word Counter Logic ---

    // --- Tool Navigation Logic ---
    const wordCounterToolSection = document.getElementById('wordCounterToolSection');
    const backToToolsBtn = document.getElementById('backToToolsBtn');

    function showToolSection(toolId) {
        // Hide all tool sections first (if more are added later)
        if (wordCounterToolSection) wordCounterToolSection.style.display = 'none';
        // Potentially loop through a list of all tool section IDs if many tools

        // Hide tool cards container
        if (toolCardsContainer) toolCardsContainer.style.display = 'none';

        // Show the selected tool section
        const sectionToShow = document.getElementById(toolId);
        if (sectionToShow) {
            sectionToShow.style.display = 'block'; // Or 'flex' if it's a flex container
        } else {
            console.warn(`Tool section with ID "${toolId}" not found.`);
            showToolsList(); // Fallback to tools list if section not found
        }
    }

    function showToolsList() {
        if (wordCounterToolSection) wordCounterToolSection.style.display = 'none';
        // Potentially loop through and hide all other specific tool sections

        if (toolCardsContainer) toolCardsContainer.style.display = 'flex'; // Bootstrap .row is display:flex
         if (searchInput) searchInput.closest('.row').style.display = 'flex'; // Show search bar
    }

    // Event listener for "Use Now" buttons (delegated from the container)
    if (toolCardsContainer) {
        toolCardsContainer.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('btn-use-now')) {
                const toolId = target.getAttribute('data-tool-id');
                if (toolId === 'wordCounterToolSection') { // Explicitly check for word counter
                    if (searchInput) searchInput.closest('.row').style.display = 'none'; // Hide search bar
                    showToolSection(toolId);
                } else if (toolId) {
                    // Placeholder for other tools:
                    // Potentially show a "Tool not yet implemented" message or navigate differently
                    alert(`Tool "${toolId}" selected. Implementation pending.`);
                    // showToolSection(toolId); // Uncomment if you have other sections ready
                }
            }
        });
    }

    // Event listener for "Back to Tools" button
    if (backToToolsBtn) {
        backToToolsBtn.addEventListener('click', showToolsList);
    }
    // --- End Tool Navigation Logic ---
});
