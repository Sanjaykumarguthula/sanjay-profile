const toolsData = [
    {
        name: "Word Counter",
        category: "Text Analysis",
        description: "Counts words and characters in text input. Useful for marketers and writers.",
        url: "#word-counter-tool" // Placeholder URL
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
                <a href="${tool.url}" class="btn btn-use-now">Use Now</a>
            `;

            cardWrapper.appendChild(cardElement);
            toolCardsContainer.appendChild(cardWrapper);
        });
    }

    // Initial display of all tools
    if (toolCardsContainer && typeof toolsData !== 'undefined') {
        displayTools(toolsData);
    }

    // The filterTools function (defined above) will work by showing/hiding these generated cards.
});
