document.addEventListener('DOMContentLoaded', () => {

    // --- Google Ads ---
    const gadsUrlInput = document.getElementById('gadsUrl');
    const gadsH1Input = document.getElementById('gadsH1');
    const gadsH2Input = document.getElementById('gadsH2');
    const gadsH3Input = document.getElementById('gadsH3');
    const gadsD1Input = document.getElementById('gadsD1');
    const gadsD2Input = document.getElementById('gadsD2');

    const gadsUrlPreview = document.getElementById('gadsUrlPreview');
    const gadsHeadlinePreview = document.getElementById('gadsHeadlinePreview');
    const gadsDescriptionPreview = document.getElementById('gadsDescriptionPreview');

    const gadsInputs = [gadsUrlInput, gadsH1Input, gadsH2Input, gadsH3Input, gadsD1Input, gadsD2Input];

    function updateGoogleAdPreview() {
        // URL
        gadsUrlPreview.textContent = gadsUrlInput.value || 'example.com';

        // Headlines
        const headlines = [gadsH1Input.value, gadsH2Input.value, gadsH3Input.value].filter(h => h.trim() !== '').join(' | ');
        gadsHeadlinePreview.textContent = headlines || 'Headline 1 | Headline 2 | Headline 3';

        // Descriptions
        const descriptions = [gadsD1Input.value, gadsD2Input.value].filter(d => d.trim() !== '').join(' ');
        gadsDescriptionPreview.textContent = descriptions || 'Description 1. Description 2.';
    }

    // --- Facebook Ads ---
    const fbPageNameInput = document.getElementById('fbPageName');
    const fbPrimaryTextInput = document.getElementById('fbPrimaryText');
    const fbHeadlineInput = document.getElementById('fbHeadline');
    const fbDescriptionInput = document.getElementById('fbDescription');
    const fbUrlInput = document.getElementById('fbUrl');

    const fbPageNamePreview = document.getElementById('fbPageNamePreview');
    const fbPrimaryTextPreview = document.getElementById('fbPrimaryTextPreview');
    const fbHeadlinePreview = document.getElementById('fbHeadlinePreview');
    const fbDescriptionPreview = document.getElementById('fbDescriptionPreview');
    const fbUrlPreview = document.getElementById('fbUrlPreview');

    const fbInputs = [fbPageNameInput, fbPrimaryTextInput, fbHeadlineInput, fbDescriptionInput, fbUrlInput];

    function updateFacebookAdPreview() {
        fbPageNamePreview.textContent = fbPageNameInput.value || 'Your Page Name';
        fbPrimaryTextPreview.textContent = fbPrimaryTextInput.value || 'Your primary ad text will appear here. It\'s the main body of your ad.';
        fbHeadlinePreview.textContent = fbHeadlineInput.value || 'Your Compelling Headline';
        fbDescriptionPreview.textContent = fbDescriptionInput.value || 'A short, punchy description.';
        fbUrlPreview.textContent = fbUrlInput.value || 'example.com';
    }


    // --- Character Counter Logic ---
    function setupCharCounter(inputElement, maxLength) {
        const counterElement = inputElement.nextElementSibling;
        if (!counterElement || !counterElement.classList.contains('char-counter')) return;

        const update = () => {
            const currentLength = inputElement.value.length;
            counterElement.textContent = `${currentLength}/${maxLength}`;
            if (currentLength > maxLength) {
                counterElement.classList.add('danger');
            } else {
                counterElement.classList.remove('danger');
            }
        };
        inputElement.addEventListener('input', update);
        update(); // Initial call
    }

    // Setup counters for all relevant fields
    setupCharCounter(gadsH1Input, 30);
    setupCharCounter(gadsH2Input, 30);
    setupCharCounter(gadsH3Input, 30);
    setupCharCounter(gadsD1Input, 90);
    setupCharCounter(gadsD2Input, 90);

    setupCharCounter(fbPrimaryTextInput, 125);
    setupCharCounter(fbHeadlineInput, 40);
    setupCharCounter(fbDescriptionInput, 30);


    // --- General Event Listeners ---
    gadsInputs.forEach(input => {
        if (input) input.addEventListener('input', updateGoogleAdPreview);
    });

    fbInputs.forEach(input => {
        if(input) input.addEventListener('input', updateFacebookAdPreview);
    });

    // Initial call to populate previews
    updateGoogleAdPreview();
    updateFacebookAdPreview();
});
