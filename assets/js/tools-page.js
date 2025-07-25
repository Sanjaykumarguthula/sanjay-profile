const toolsData = [
    // New Digital Marketing & SEO Tools
    { name: "UTM Campaign URL Builder", category: "Digital Marketing", description: "Create URLs with UTM parameters for campaign tracking.", url: "utm-campaign-url-builder.html", cardStyle: { backgroundColor: "#17a2b8", textColor: "#FFFFFF" } },
    { name: "Ad Copy Previewer", category: "Digital Marketing", description: "Preview Google & Facebook ad copy in real-time.", url: "ad-copy-previewer.html", cardStyle: { backgroundColor: "#4285F4", textColor: "#FFFFFF" } },
    { name: "Email Subject Line Tester", category: "Digital Marketing", description: "Analyze subject lines for open rates and spam triggers.", url: "email-subject-line-tester.html", cardStyle: { backgroundColor: "#d63384", textColor: "#FFFFFF" } },
    { name: "SERP Snippet Preview", category: "SEO", description: "Preview your page's title and description on Google.", url: "serp-snippet-preview.html", cardStyle: { backgroundColor: "#34A853", textColor: "#FFFFFF" } },
    { name: "HTML Heading Checker", category: "SEO", description: "Analyze H1-H6 heading structure of your page.", url: "html-heading-checker.html", cardStyle: { backgroundColor: "#6f42c1", textColor: "#FFFFFF" } },
    { name: "Keyword Density Checker", category: "SEO", description: "Analyze keyword frequency and density in your text.", url: "keyword-density-checker.html", cardStyle: { backgroundColor: "#EA4335", textColor: "#FFFFFF" } },
    { name: "SEO Meta Tag Checker", category: "SEO", description: "Analyzes a page's HTML meta tags for SEO.", url: "seo-meta-tag-checker.html", cardStyle: { backgroundColor: "#198754", textColor: "#FFFFFF" } },
    { name: "SEO File Generator", category: "SEO", description: "Generate robots.txt and sitemap.xml files.", url: "seo-file-generator.html", cardStyle: { backgroundColor: "#7856d7", textColor: "#FFFFFF" } },

    // Existing Tools
    { name: "Word Counter", category: "Text Analysis", description: "Counts words and characters in text input.", url: "word-counter.html", cardStyle: { backgroundColor: "#0d6efd", textColor: "#FFFFFF" } },
    { name: "JSON Validator", category: "Developer Tools", description: "Validates and formats JSON input for developers.", url: "json-validator-formatter.html", cardStyle: { backgroundColor: "#343a40", textColor: "#FFFFFF" } },
    { name: "Image Compressor", category: "Web Optimization", description: "Compresses images client-side for web optimization.", url: "image-compressor.html", cardStyle: { backgroundColor: "#fd7e14", textColor: "#FFFFFF" } },
    { name: "Color Palette Generator", category: "Design", description: "Creates color schemes from a base color.", url: "color-palette-generator.html", cardStyle: { backgroundColor: "#e83e8c", textColor: "#FFFFFF" } },
    { name: "QR Code Generator", category: "Utilities", description: "Generates QR codes from URLs or text.", url: "qr-code-generator.html", cardStyle: { backgroundColor: "#20c997", textColor: "#FFFFFF" } },
    { name: "Text Case Converter", category: "Text Manipulation", description: "Converts text to upper, lower, or title case.", url: "text-case-converter.html", cardStyle: { backgroundColor: "#6c757d", textColor: "#FFFFFF" } },
    { name: "Password Generator", category: "Security", description: "Creates secure, random passwords for security.", url: "password-generator.html", cardStyle: { backgroundColor: "#dc3545", textColor: "#FFFFFF" } },
    { name: "URL Encoder/Decoder", category: "Developer Tools", description: "Encodes or decodes URLs and strings.", url: "url-encoder-decoder.html", cardStyle: { backgroundColor: "#495057", textColor: "#FFFFFF" } },
    { name: "Markdown Previewer", category: "Developer Tools", description: "Converts Markdown to HTML in real-time.", url: "markdown-previewer.html", cardStyle: { backgroundColor: "#212529", textColor: "#FFFFFF" } },
    { name: "Base64 Encoder/Decoder", category: "Developer Tools", description: "Encodes or decodes Base64 strings.", url: "base64-encoder-decoder.html", cardStyle: { backgroundColor: "#0dcaf0", textColor: "#212529" } },
    { name: "Sitemap Generator", category: "SEO", description: "Creates a basic XML sitemap from a list of URLs.", url: "sitemap-generator.html", cardStyle: { backgroundColor: "#ffc107", textColor: "#212529" } }
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
        if (!toolCardsContainer) return;
        toolCardsContainer.innerHTML = ''; // Clear existing cards

        if (!tools || tools.length === 0) {
            toolCardsContainer.innerHTML = '<p class="col-12 text-center">No tools found.</p>';
            return;
        }

        tools.forEach(tool => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch';
            cardWrapper.setAttribute('data-tool-name', tool.name);
            cardWrapper.setAttribute('data-tool-category', tool.category);

            const card = document.createElement('div');
            card.className = 'card tool-card minimalist-card h-100 text-center shadow-sm';

            if (tool.cardStyle) {
                card.style.backgroundColor = tool.cardStyle.backgroundColor || '#f8f9fa';
                card.style.color = tool.cardStyle.textColor || '#212529';
                if (tool.cardStyle.textColor === '#FFFFFF') {
                    card.classList.add('text-white');
                }
            }

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body d-flex flex-column p-4';

            const title = document.createElement('h3');
            title.className = 'card-title tool-title mb-3';
            title.textContent = tool.name;
            cardBody.appendChild(title);

            const description = document.createElement('p');
            description.className = 'card-text tool-short-description flex-grow-1 small mb-3';
            description.textContent = tool.description;
            cardBody.appendChild(description);

            const playButton = document.createElement('a');
            playButton.href = tool.url;
            playButton.className = 'btn mt-auto align-self-center stretched-link';

            if (tool.cardStyle && isDarkColor(tool.cardStyle.backgroundColor)) {
                playButton.classList.add('btn-light');
            } else {
                playButton.classList.add('btn-dark');
            }
            playButton.textContent = 'Use Tool';
            cardBody.appendChild(playButton);

            card.appendChild(cardBody);
            cardWrapper.appendChild(card);
            toolCardsContainer.appendChild(cardWrapper);
        });
    }

    function isDarkColor(hexcolor){
        if (!hexcolor || hexcolor.length < 4) return false;
        hexcolor = hexcolor.replace("#", "");
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return yiq < 128;
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
