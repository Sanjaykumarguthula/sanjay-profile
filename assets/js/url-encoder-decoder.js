document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlOutput = document.getElementById('urlOutput');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (encodeBtn) {
        encodeBtn.addEventListener('click', function() {
            try {
                urlOutput.value = encodeURIComponent(urlInput.value);
            } catch (e) {
                urlOutput.value = 'Error encoding: Invalid input or URI malformed.';
                console.error("Encoding error:", e);
            }
        });
    }

    if (decodeBtn) {
        decodeBtn.addEventListener('click', function() {
            try {
                urlOutput.value = decodeURIComponent(urlInput.value);
            } catch (e) {
                // Common error is URIError for malformed URI
                urlOutput.value = 'Error decoding: Invalid input or URI malformed. Ensure input is correctly percent-encoded.';
                console.error("Decoding error:", e);
            }
        });
    }

    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', function() {
            if (urlOutput.value) {
                navigator.clipboard.writeText(urlOutput.value).then(() => {
                    const originalText = copyOutputBtn.textContent;
                    copyOutputBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyOutputBtn.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy text. Please copy manually.');
                });
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            urlInput.value = '';
            urlOutput.value = '';
        });
    }
});
