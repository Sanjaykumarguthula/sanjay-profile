document.addEventListener('DOMContentLoaded', function () {
    const base64Input = document.getElementById('base64Input');
    const base64Output = document.getElementById('base64Output');
    const encodeBtn = document.getElementById('encodeBase64Btn');
    const decodeBtn = document.getElementById('decodeBase64Btn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const clearBtn = document.getElementById('clearBtn');
    const errorDisplay = document.getElementById('errorDisplay');

    function displayError(message) {
        if (errorDisplay) {
            errorDisplay.textContent = message;
            errorDisplay.style.display = 'block';
        }
        if (base64Output) {
            base64Output.value = ''; // Clear output on error
        }
    }

    function clearError() {
        if (errorDisplay) {
            errorDisplay.textContent = '';
            errorDisplay.style.display = 'none';
        }
    }

    // UTF-8 friendly Base64 encoding
    function utf8ToBase64(str) {
        try {
            // First, use encodeURIComponent to get percent-encoded UTF-8,
            // then convert percent-encodings into raw bytes which can be fed to btoa.
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
        } catch (e) {
            console.error("UTF-8 to Base64 encoding error:", e);
            throw new Error("Failed to encode string to Base64. Input may contain invalid characters.");
        }
    }

    // UTF-8 friendly Base64 decoding
    function base64ToUtf8(str) {
        try {
            // Convert Base64 encoded ASCII to original bytes, then interpret those bytes as UTF-8.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error("Base64 to UTF-8 decoding error:", e);
            // Common error: "Invalid character" if the string is not valid Base64 or contains non-Base64 characters.
            throw new Error("Failed to decode Base64 string. Ensure input is valid Base64 and does not contain invalid characters (e.g. non-ASCII characters before encoding, or characters not part of Base64 alphabet).");
        }
    }


    if (encodeBtn) {
        encodeBtn.addEventListener('click', function() {
            clearError();
            if (!base64Input.value) {
                displayError("Input is empty. Please enter text to encode.");
                return;
            }
            try {
                base64Output.value = utf8ToBase64(base64Input.value);
            } catch (e) {
                displayError(e.message);
            }
        });
    }

    if (decodeBtn) {
        decodeBtn.addEventListener('click', function() {
            clearError();
            if (!base64Input.value) {
                displayError("Input is empty. Please enter a Base64 string to decode.");
                return;
            }
            try {
                base64Output.value = base64ToUtf8(base64Input.value.trim());
            } catch (e) {
                displayError(e.message);
            }
        });
    }

    if (copyOutputBtn) {
        copyOutputBtn.addEventListener('click', function() {
            if (base64Output.value) {
                navigator.clipboard.writeText(base64Output.value).then(() => {
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
            base64Input.value = '';
            base64Output.value = '';
            clearError();
        });
    }
});
