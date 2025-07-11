document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const jsonInput = document.getElementById('jsonInput');
    const validationError = document.getElementById('validationError');
    const jsonOutput = document.getElementById('jsonOutput');

    const validateBtn = document.getElementById('validateBtn');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const exportBtn = document.getElementById('exportBtn');
    const themeToggleBtn = document.getElementById('themeToggle');
    const fileNameInput = document.getElementById('fileNameInput');
    const jsonTreeView = document.getElementById('jsonTreeView');

    // --- Core Functionality ---

    // 1. JSON Validation
    function validateJSON(showError = true) {
        const jsonString = jsonInput.value.trim();
        if (!jsonString) {
            if (showError) {
                validationError.textContent = 'Input is empty.';
                validationError.classList.add('visible');
            } else {
                validationError.classList.remove('visible');
            }
            return { valid: false, parsedJSON: null, error: 'Input is empty.' };
        }
        try {
            const parsedJSON = JSON.parse(jsonString);
            if (showError) {
                validationError.textContent = 'JSON is valid!';
                validationError.classList.add('visible'); // Show validation status
                // Consider a different class for success, e.g., 'success-message'
                validationError.classList.remove('error-styling'); // Example if you add specific error styling
            } else {
                validationError.classList.remove('visible');
            }
            return { valid: true, parsedJSON: parsedJSON, error: null };
        } catch (e) {
            if (showError) {
                validationError.textContent = `Invalid JSON: ${e.message}`;
                highlightErrorLine(e); // This function appends to textContent
                validationError.classList.add('visible');
                validationError.classList.add('error-styling'); // Example if you want to ensure error color
            } else {
                validationError.classList.remove('visible');
            }
            return { valid: false, parsedJSON: null, error: e.message };
        }
    }

    function highlightErrorLine(error) {
        // Appends line number info to the existing error message in validationError.textContent
        const match = error.message.match(/position\s+(\d+)/);
        if (match && match[1]) {
            const position = parseInt(match[1], 10);
            const textBeforeError = jsonInput.value.substring(0, position);
            const lineNumber = textBeforeError.split('\n').length;
            // The main message is already set in validateJSON, just append line info
            validationError.textContent += ` (Error near line ${lineNumber})`;
        }
    }

    // 2. JSON Formatting (Pretty Print)
    function formatJSON() {
        const validationResult = validateJSON(true); // Validate and show error
        if (validationResult.valid) {
            try {
                const formattedJson = JSON.stringify(validationResult.parsedJSON, null, 2);
                renderWithSyntaxHighlighting(formattedJson); // Use syntax highlighter
                localStorage.setItem('formattedJSON', formattedJson);
            } catch (e) {
                // This catch is unlikely if JSON.parse succeeded, but good for safety
                validationError.textContent = `Error formatting: ${e.message}`;
                jsonOutput.textContent = '';
            }
        } else {
            jsonOutput.textContent = ''; // Clear output if JSON is invalid
        }
    }

    // 3. Minify JSON
    function minifyJSON() {
        const validationResult = validateJSON(true); // Validate and show error
        if (validationResult.valid) {
            try {
                const minifiedJson = JSON.stringify(validationResult.parsedJSON);
                // Option 1: Update the input area
                // jsonInput.value = minifiedJson;
                // Option 2: Update the output area (like format)
                renderWithSyntaxHighlighting(minifiedJson); // Display minified with highlighting
                localStorage.setItem('minifiedJSON', minifiedJson);
            } catch (e) {
                validationError.textContent = `Error minifying: ${e.message}`;
                jsonOutput.textContent = '';
            }
        } else {
            jsonOutput.textContent = ''; // Clear output if JSON is invalid
        }
    }

    // --- Event Listeners for Core Functions ---
    if (validateBtn) {
        validateBtn.addEventListener('click', () => validateJSON(true));
    }
    if (formatBtn) {
        formatBtn.addEventListener('click', formatJSON);
    }
    if (minifyBtn) {
        minifyBtn.addEventListener('click', minifyJSON);
    }

    // Auto-validate on input (optional, can be performance intensive for large JSON)
    if (jsonInput) {
        jsonInput.addEventListener('input', () => {
            localStorage.setItem('lastInputJSON', jsonInput.value);
            validateJSON(true); // Validate silently or show errors dynamically
            // Optionally auto-format or update tree view here if desired
        });
    }

    // --- Syntax Highlighting (Basic Implementation) ---
    function renderWithSyntaxHighlighting(jsonString) {
        if (!jsonString) {
            jsonOutput.innerHTML = '';
            return;
        }
        // A more robust regex might be needed for edge cases (e.g. strings containing quotes)
        const highlighted = jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function (match) {
                let cls = 'json-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'json-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'json-boolean';
                } else if (/null/.test(match)) {
                    cls = 'json-null';
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
        jsonOutput.innerHTML = highlighted;
        // Also update tree view if JSON is valid
        const validation = validateJSON(false); // Don't show error message from here
        if(validation.valid) {
            renderTreeView(validation.parsedJSON);
        } else {
            jsonTreeView.innerHTML = ''; // Clear tree if not valid
        }
    }


    // --- JSON Tree View ---
    function renderTreeView(obj, parentElement = jsonTreeView) {
        parentElement.innerHTML = ''; // Clear previous tree
        const rootUl = document.createElement('ul');
        buildTree(obj, rootUl);
        parentElement.appendChild(rootUl);
        localStorage.setItem('lastTreeViewJSON', JSON.stringify(obj)); // Store for persistence
    }

    function buildTree(obj, parentUl) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const li = document.createElement('li');
                const keySpan = document.createElement('span');
                keySpan.className = 'json-key';
                keySpan.textContent = `"${key}": `;
                li.appendChild(keySpan);

                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    const toggler = document.createElement('span');
                    toggler.className = 'toggler';
                    toggler.onclick = function() {
                        this.classList.toggle('open');
                        const nextUl = this.nextElementSibling;
                        if (nextUl && nextUl.tagName === 'UL') {
                            nextUl.classList.toggle('hidden');
                        }
                    };
                    li.insertBefore(toggler, keySpan); // Add toggler before key

                    const nestedUl = document.createElement('ul');
                    nestedUl.className = 'hidden'; // Initially hidden
                    buildTree(value, nestedUl);
                    li.appendChild(nestedUl);
                } else {
                    const valueSpan = document.createElement('span');
                    if (typeof value === 'string') {
                        valueSpan.className = 'json-string';
                        valueSpan.textContent = `"${value}"`;
                    } else if (typeof value === 'number') {
                        valueSpan.className = 'json-number';
                        valueSpan.textContent = value;
                    } else if (typeof value === 'boolean') {
                        valueSpan.className = 'json-boolean';
                        valueSpan.textContent = value;
                    } else if (value === null) {
                        valueSpan.className = 'json-null';
                        valueSpan.textContent = 'null';
                    }
                    li.appendChild(valueSpan);
                }
                parentUl.appendChild(li);
            }
        }
    }

    // --- Load from LocalStorage ---
    if (localStorage.getItem('lastInputJSON')) {
        jsonInput.value = localStorage.getItem('lastInputJSON');
        validateJSON(true); // Validate loaded JSON
        // Attempt to re-render last formatted/highlighted view if input was valid
        const validationResult = validateJSON(false);
        if (validationResult.valid) {
            // Prefer to re-format/highlight from input to ensure consistency
            renderWithSyntaxHighlighting(JSON.stringify(validationResult.parsedJSON, null, 2));
        }
    }
    // Persist tree view (simplified: re-parses input on load, could store expanded states too)
    if (jsonInput.value) {
        const validationResult = validateJSON(false);
        if (validationResult.valid) {
            renderTreeView(validationResult.parsedJSON);
        }
    }


    // --- Additional JavaScript Features ---

    // 4. Copy to Clipboard
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = jsonOutput.textContent; // Assumes jsonOutput holds the text (could be raw from textarea or formatted)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showTemporaryMessage(copyBtn, "Copied!");
                    })
                    .catch(err => {
                        console.error('Failed to copy with Clipboard API:', err);
                        fallbackCopyTextToClipboard(textToCopy);
                    });
            } else {
                // Fallback for older browsers
                fallbackCopyTextToClipboard(textToCopy);
            }
        });
    }

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showTemporaryMessage(copyBtn, "Copied (fallback)!");
            } else {
                showTemporaryMessage(copyBtn, "Copy failed.", true);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showTemporaryMessage(copyBtn, "Copy failed.", true);
        }
        document.body.removeChild(textArea);
    }

    function showTemporaryMessage(buttonElement, message, isError = false) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = message;
        if (isError) {
            buttonElement.style.backgroundColor = '#d9534f'; // Error color
        } else {
            buttonElement.style.backgroundColor = '#5cb85c'; // Success color
        }

        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.backgroundColor = ''; // Reset to original/CSS defined
        }, 2000);
    }

    // 5. Clear Input Button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            jsonInput.value = '';
            jsonOutput.innerHTML = ''; // Clear formatted output
            validationError.textContent = '';
            jsonTreeView.innerHTML = ''; // Clear tree view
            localStorage.removeItem('lastInputJSON');
            localStorage.removeItem('formattedJSON');
            localStorage.removeItem('minifiedJSON');
            localStorage.removeItem('lastTreeViewJSON');
            // Potentially clear other localStorage items if added
            console.log("Input and outputs cleared.");
        });
    }

    // 8. Dark/Light Theme Toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            // Save theme preference
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Load theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } // Light is default, no action needed if 'light' or null

    // 10. Export as JSON File
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const validationResult = validateJSON(false); // Validate silently
            let contentToExport = jsonInput.value; // Default to raw input

            if (validationResult.valid) {
                // Prefer exporting the pretty-printed version if available and valid
                // Or, could offer choice, but for now, let's use the formatted output if possible
                // For simplicity, let's assume the jsonOutput <pre> has the latest good version for export
                // This means if user clicked "Format", it's formatted, if "Minify", it's minified.
                // If they just typed valid JSON, jsonOutput might be empty or from previous op.
                // A safer bet is to re-format/minify based on current input for export.
                // Let's re-format for export to ensure it's pretty.
                try {
                    contentToExport = JSON.stringify(validationResult.parsedJSON, null, 2);
                } catch (e) {
                    // Fallback to raw input if stringify fails (should not happen if parsedJSON is valid)
                    console.error("Error stringifying for export, using raw input:", e);
                    contentToExport = jsonInput.value;
                }
            } else if (!jsonInput.value.trim()) {
                validationError.textContent = "Input is empty. Nothing to export.";
                return;
            }
            // If not valid, we still allow exporting the current text in the input area.
            // User might want to save their work-in-progress invalid JSON.

            const fileName = fileNameInput.value.trim() || 'data.json';
            const blob = new Blob([contentToExport], { type: 'application/json;charset=utf-8;' });
            const link = document.createElement("a");

            if (link.download !== undefined) { // Feature detection
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // Fallback for older browsers (less common for Blob download)
                alert("File download not supported in this browser. Please copy the content manually.");
            }
        });
    }

    // --- Load from LocalStorage (Consolidated) ---
    function loadPersistentData() {
        // Theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme'); // Explicitly set light if not dark
        }

        // JSON Input
        const lastInput = localStorage.getItem('lastInputJSON');
        if (lastInput) {
            jsonInput.value = lastInput;
            const validationResult = validateJSON(true); // Validate and display status
            if (validationResult.valid) {
                // Re-render formatted output and tree view from the loaded valid input
                renderWithSyntaxHighlighting(JSON.stringify(validationResult.parsedJSON, null, 2));
                // renderTreeView(validationResult.parsedJSON); // renderWithSyntaxHighlighting calls this
            }
        }
    }

    loadPersistentData(); // Call on initial load

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (event) => {
        // Ctrl + R or Cmd + R (for macOS) to clear input
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault(); // Prevent browser refresh
            if (clearBtn) clearBtn.click(); // Simulate click on clear button
        }

        // Ctrl + E or Cmd + E to focus error display (or input if no error)
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            if (validationError.textContent && validationError.textContent.trim() !== '' && validationError.textContent !== 'JSON is valid!') {
                // If there's an error message, focus an element that can receive focus,
                // or scroll to it. Since validationError is a div, it can't be focused directly
                // without tabindex=-1. For simplicity, scroll it into view.
                validationError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Optionally, focus the input area as well, as that's where user needs to fix it
                // jsonInput.focus();
            } else {
                jsonInput.focus(); // If no error or valid, focus input area
            }
        }
    });

    console.log("All JS features (including shortcuts) loaded.");
});
