document.addEventListener('DOMContentLoaded', function () {
    // --- JSON Validator Logic ---
    const jsonInputArea = document.getElementById('jsonInputArea');
    const validateJsonBtn = document.getElementById('validateJsonBtn');
    const minifyJsonBtn = document.getElementById('minifyJsonBtn'); // New button
    const clearJsonBtn = document.getElementById('clearJsonBtn'); // New button
    const copyJsonOutputBtn = document.getElementById('copyJsonOutputBtn'); // New button
    const jsonResultArea = document.getElementById('jsonResultArea');
    const formattedJsonContainer = document.getElementById('formattedJsonContainer');
    const formattedJsonOutput = document.getElementById('formattedJsonOutput');

    function processJson(minify = false) {
        if (!jsonInputArea || !jsonResultArea || !formattedJsonOutput || !formattedJsonContainer) return;

        const jsonString = jsonInputArea.value.trim();
        jsonResultArea.innerHTML = '';
        jsonResultArea.className = 'mt-3 alert'; // Reset classes
        jsonResultArea.style.display = 'block'; // Ensure it's visible

        formattedJsonOutput.textContent = '';
        formattedJsonContainer.style.display = 'none';
        if(copyJsonOutputBtn) copyJsonOutputBtn.disabled = true;


        if (!jsonString) {
            jsonResultArea.classList.add('alert-warning');
            jsonResultArea.textContent = 'Input is empty. Please paste some JSON.';
            return;
        }

        try {
            const parsedJson = JSON.parse(jsonString);
            jsonResultArea.classList.remove('alert-warning', 'alert-danger');
            jsonResultArea.classList.add('alert-success');
            jsonResultArea.textContent = 'Valid JSON!';

            if (minify) {
                formattedJsonOutput.textContent = JSON.stringify(parsedJson); // Minified
            } else {
                formattedJsonOutput.textContent = JSON.stringify(parsedJson, null, 2); // Pretty print with 2 spaces
            }
            formattedJsonContainer.style.display = 'block';
            if(copyJsonOutputBtn) copyJsonOutputBtn.disabled = false;

        } catch (error) {
            jsonResultArea.classList.remove('alert-success', 'alert-warning');
            jsonResultArea.classList.add('alert-danger');
            jsonResultArea.textContent = `Invalid JSON: ${error.message}`;
        }
    }

    if (validateJsonBtn) {
        validateJsonBtn.addEventListener('click', function() {
            processJson(false); // Validate and Format
        });
    }

    if (minifyJsonBtn) {
        minifyJsonBtn.addEventListener('click', function() {
            processJson(true); // Validate and Minify
        });
    }

    if (clearJsonBtn) {
        clearJsonBtn.addEventListener('click', function() {
            if (jsonInputArea) jsonInputArea.value = '';
            if (formattedJsonOutput) formattedJsonOutput.textContent = '';
            if (formattedJsonContainer) formattedJsonContainer.style.display = 'none';
            if (jsonResultArea) {
                jsonResultArea.style.display = 'none';
                jsonResultArea.className = 'mt-3 alert'; // Reset classes
                jsonResultArea.textContent = '';
            }
            if(copyJsonOutputBtn) copyJsonOutputBtn.disabled = true;
        });
    }

    if (copyJsonOutputBtn) {
        copyJsonOutputBtn.addEventListener('click', function() {
            if (formattedJsonOutput.textContent) {
                navigator.clipboard.writeText(formattedJsonOutput.textContent)
                    .then(() => {
                        // Optional: Show a temporary "Copied!" message
                        const originalText = copyJsonOutputBtn.textContent;
                        copyJsonOutputBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyJsonOutputBtn.textContent = originalText;
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        // Fallback for older browsers or if permissions fail
                        try {
                            const textArea = document.createElement("textarea");
                            textArea.value = formattedJsonOutput.textContent;
                            document.body.appendChild(textArea);
                            textArea.focus();
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            // Optional: Show a temporary "Copied!" message
                            const originalText = copyJsonOutputBtn.textContent;
                            copyJsonOutputBtn.textContent = 'Copied!';
                            setTimeout(() => {
                                copyJsonOutputBtn.textContent = originalText;
                            }, 1500);
                        } catch (execErr) {
                            console.error('Fallback copy failed: ', execErr);
                            alert('Failed to copy text. Please copy manually.');
                        }
                    });
            }
        });
    }
    // --- End JSON Validator Logic ---
});
