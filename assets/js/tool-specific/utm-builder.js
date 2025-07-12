document.addEventListener('DOMContentLoaded', () => {
    const baseUrlInput = document.getElementById('baseUrlInput');
    const sourceInput = document.getElementById('sourceInput');
    const mediumInput = document.getElementById('mediumInput');
    const campaignInput = document.getElementById('campaignInput');
    const termInput = document.getElementById('termInput');
    const contentInput = document.getElementById('contentInput');
    const generatedUrlOutput = document.getElementById('generatedUrlOutput');
    const copyUrlBtn = document.getElementById('copyUrlBtn');

    const allInputs = [baseUrlInput, sourceInput, mediumInput, campaignInput, termInput, contentInput];

    function generateUtmUrl() {
        const baseUrl = baseUrlInput.value.trim();
        if (!baseUrl) {
            generatedUrlOutput.value = '';
            copyUrlBtn.disabled = true;
            return;
        }

        const params = new URLSearchParams();

        if (sourceInput.value.trim()) params.set('utm_source', sourceInput.value.trim());
        if (mediumInput.value.trim()) params.set('utm_medium', mediumInput.value.trim());
        if (campaignInput.value.trim()) params.set('utm_campaign', campaignInput.value.trim());
        if (termInput.value.trim()) params.set('utm_term', termInput.value.trim());
        if (contentInput.value.trim()) params.set('utm_content', contentInput.value.trim());

        const queryString = params.toString();

        if (queryString) {
            // Check if base URL already has a query string
            const separator = baseUrl.includes('?') ? '&' : '?';
            generatedUrlOutput.value = baseUrl + separator + queryString;
        } else {
            generatedUrlOutput.value = baseUrl;
        }

        copyUrlBtn.disabled = false;
    }

    allInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', generateUtmUrl);
        }
    });

    if (copyUrlBtn) {
        copyUrlBtn.addEventListener('click', () => {
            if (generatedUrlOutput.value) {
                navigator.clipboard.writeText(generatedUrlOutput.value).then(() => {
                    const originalText = copyUrlBtn.innerHTML;
                    copyUrlBtn.innerHTML = "<i class='bx bx-check'></i> Copied!";
                    setTimeout(() => { copyUrlBtn.innerHTML = "<i class='bx bx-copy'></i> Copy URL"; }, 2000);
                }).catch(err => {
                    console.error('Failed to copy URL:', err);
                    alert("Could not copy URL to clipboard.");
                });
            }
        });
    }

    // Initial generation in case of pre-filled form fields
    generateUtmUrl();
});
