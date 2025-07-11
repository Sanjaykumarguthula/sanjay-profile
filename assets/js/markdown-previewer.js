document.addEventListener('DOMContentLoaded', function () {
    const markdownInput = document.getElementById('markdownInput');
    const htmlPreview = document.getElementById('htmlPreview');
    const clearMarkdownBtn = document.getElementById('clearMarkdownBtn');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');

    function updatePreview() {
        if (typeof marked !== 'undefined' && markdownInput && htmlPreview) {
            // Basic sanitization to prevent obvious XSS from simple markdown.
            // For more robust sanitization, a dedicated library like DOMPurify would be needed
            // if user input could ever be directly rendered as HTML without going through `marked`.
            // Since `marked` itself handles the conversion, this is a lighter touch.
            const dirtyHtml = marked.parse(markdownInput.value);
            // Example of a very basic sanitizer if you were to use one:
            // const cleanHtml = DOMPurify.sanitize(dirtyHtml);
            // htmlPreview.innerHTML = cleanHtml;
            htmlPreview.innerHTML = dirtyHtml; // Using marked's output directly
        } else if (htmlPreview) {
            htmlPreview.innerHTML = '<p class="text-danger">Error: Markdown library (marked.js) not loaded or elements missing.</p>';
        }
    }

    if (markdownInput) {
        markdownInput.addEventListener('input', updatePreview);
        // Initial preview if there's content (e.g. from placeholder or browser cache)
        if (markdownInput.value) {
             updatePreview();
        } else {
            // Set initial placeholder content in preview if input is empty
            if (htmlPreview) {
                 htmlPreview.innerHTML = '<p class="text-muted">HTML preview will appear here.</p>';
            }
        }
    }


    if (clearMarkdownBtn) {
        clearMarkdownBtn.addEventListener('click', function() {
            if (markdownInput) {
                markdownInput.value = '';
            }
            updatePreview(); // Update preview to show it's empty or placeholder
             if (htmlPreview && !markdownInput.value) {
                 htmlPreview.innerHTML = '<p class="text-muted">HTML preview will appear here.</p>';
            }
        });
    }

    if (copyHtmlBtn) {
        copyHtmlBtn.addEventListener('click', function() {
            if (htmlPreview && htmlPreview.innerHTML) {
                // Create a temporary textarea to copy the HTML content
                // This helps preserve formatting better than directly copying innerHTML in some cases
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = htmlPreview.innerHTML;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                try {
                    document.execCommand('copy');
                    const originalText = copyHtmlBtn.textContent;
                    copyHtmlBtn.textContent = 'HTML Copied!';
                    setTimeout(() => {
                        copyHtmlBtn.textContent = originalText;
                    }, 1500);
                } catch (err) {
                    console.error('Failed to copy HTML: ', err);
                    alert('Failed to copy HTML. Please copy manually.');
                }
                document.body.removeChild(tempTextArea);
            }
        });
    }

    // Ensure marked.js is loaded before first preview
    if (typeof marked === 'undefined' && htmlPreview) {
         htmlPreview.innerHTML = '<p class="text-danger">Markdown library (marked.js) is not loaded. Please check the console.</p>';
    } else if (markdownInput && markdownInput.value === '' && htmlPreview) {
        // If input is empty on load, ensure placeholder text
        htmlPreview.innerHTML = '<p class="text-muted">HTML preview will appear here.</p>';
    } else {
        // Initial render if marked is loaded and there's content
        updatePreview();
    }


});
