document.addEventListener('DOMContentLoaded', () => {
    // Input elements
    const titleInput = document.getElementById('serpTitleInput');
    const urlInput = document.getElementById('serpUrlInput');
    const descriptionInput = document.getElementById('serpDescriptionInput');

    // Preview elements
    const previewTitle = document.getElementById('previewTitle');
    const previewUrlHost = document.getElementById('previewUrlHost');
    const previewUrlPath = document.getElementById('previewUrlPath');
    const previewDescription = document.getElementById('previewDescription');

    // Counter elements
    const titleCounter = document.getElementById('titleCounter');
    const descriptionCounter = document.getElementById('descriptionCounter');

    // Constants for limits
    const TITLE_MAX_CHARS = 60;
    const TITLE_MAX_PIXELS = 580; // Approximate, can be adjusted
    const DESC_MAX_CHARS = 160;
    const DESC_MAX_PIXELS = 920; // Approximate

    // Function to measure pixel width of text
    const measureTextWidth = (text, font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        return context.measureText(text).width;
    };

    function updatePreview() {
        // Update Title
        const titleText = titleInput.value || "Your Page Title";
        previewTitle.textContent = titleText;
        const titleFont = "20px Arial";
        const titlePixelWidth = measureTextWidth(titleText, titleFont);
        titleCounter.textContent = `Characters: ${titleText.length} / ${TITLE_MAX_CHARS} | Pixels: ${Math.round(titlePixelWidth)} / ${TITLE_MAX_PIXELS}`;
        updateCounterClass(titleCounter, titleText.length, TITLE_MAX_CHARS, titlePixelWidth, TITLE_MAX_PIXELS);

        // Update URL
        const urlText = urlInput.value || "https://example.com/your-page-url";
        try {
            const url = new URL(urlText);
            previewUrlHost.textContent = url.hostname;
            previewUrlPath.textContent = url.pathname + url.search + url.hash;
        } catch (e) {
            // Handle invalid URL input gracefully
            previewUrlHost.textContent = "example.com";
            previewUrlPath.textContent = "/your-page-url";
        }

        // Update Description
        const descriptionText = descriptionInput.value || "Your meta description goes here.";
        previewDescription.textContent = descriptionText;
        const descriptionFont = "14px Arial";
        const descriptionPixelWidth = measureTextWidth(descriptionText, descriptionFont);
        descriptionCounter.textContent = `Characters: ${descriptionText.length} / ${DESC_MAX_CHARS} | Pixels: ${Math.round(descriptionPixelWidth)} / ${DESC_MAX_PIXELS}`;
        updateCounterClass(descriptionCounter, descriptionText.length, DESC_MAX_CHARS, descriptionPixelWidth, DESC_MAX_PIXELS);
    }

    function updateCounterClass(element, charLength, charMax, pixelWidth, pixelMax) {
        element.classList.remove('warning', 'danger');
        if (pixelWidth > pixelMax || charLength > charMax) {
            element.classList.add('danger');
        } else if (pixelWidth > pixelMax * 0.95 || charLength > charMax * 0.95) { // Warning if close to limit
            element.classList.add('warning');
        }
    }

    // Event Listeners
    titleInput.addEventListener('input', updatePreview);
    urlInput.addEventListener('input', updatePreview);
    descriptionInput.addEventListener('input', updatePreview);

    // Initial call to set default preview
    updatePreview();
});
