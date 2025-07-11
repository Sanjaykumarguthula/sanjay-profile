document.addEventListener('DOMContentLoaded', function () {
    const baseColorPicker = document.getElementById('baseColorPicker');
    const baseColorHexInput = document.getElementById('baseColorHexInput');
    const generatePalettesBtn = document.getElementById('generatePalettesBtn');
    const palettesContainer = document.getElementById('palettesContainer');
    const toastCopied = document.getElementById('toastCopied');

    function isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex);
    }

    if (baseColorPicker && baseColorHexInput) {
        baseColorPicker.addEventListener('input', function() {
            baseColorHexInput.value = this.value;
            // generateAndDisplayPalettes(); // Optionally generate on picker change
        });
        baseColorHexInput.addEventListener('input', function() {
            if (isValidHex(this.value)) {
                baseColorPicker.value = this.value;
                // generateAndDisplayPalettes(); // Optionally generate on valid hex input
            }
        });
    }

    if (generatePalettesBtn) {
        generatePalettesBtn.addEventListener('click', generateAndDisplayPalettes);
    }

    function generateAndDisplayPalettes() {
        if (!tinycolor) {
            console.error("TinyColor library is not loaded.");
            palettesContainer.innerHTML = '<p class="text-danger">Error: Color library not loaded.</p>';
            return;
        }

        const baseColorHex = baseColorHexInput.value;
        if (!isValidHex(baseColorHex)) {
            palettesContainer.innerHTML = '<p class="text-danger">Invalid HEX color code. Please use format like #RRGGBB or #RGB.</p>';
            return;
        }

        const baseColor = tinycolor(baseColorHex);
        palettesContainer.innerHTML = ''; // Clear previous palettes

        const paletteTypes = [
            { name: 'Base Color', colors: [baseColor.toHexString()] },
            { name: 'Monochromatic', colors: baseColor.monochromatic(6).map(c => c.toHexString()) },
            { name: 'Analogous', colors: baseColor.analogous(6).map(c => c.toHexString()) },
            { name: 'Complementary', colors: [baseColor.toHexString(), baseColor.complement().toHexString()] },
            { name: 'Split Complementary', colors: baseColor.splitcomplement().map(c => c.toHexString()) },
            { name: 'Triadic', colors: baseColor.triad().map(c => c.toHexString()) },
            { name: 'Tetradic (Rectangle)', colors: baseColor.tetrad().map(c => c.toHexString()) }
        ];

        paletteTypes.forEach(paletteType => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'palette-group';

            const title = document.createElement('h3');
            title.className = 'h5';
            title.textContent = paletteType.name;
            groupDiv.appendChild(title);

            paletteType.colors.forEach(colorHex => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.style.backgroundColor = colorHex;

                const hexSpan = document.createElement('span');
                hexSpan.textContent = colorHex.toUpperCase();
                swatch.appendChild(hexSpan);

                swatch.addEventListener('click', function() {
                    copyToClipboard(colorHex);
                });
                groupDiv.appendChild(swatch);
            });
            palettesContainer.appendChild(groupDiv);
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            if (toastCopied) {
                toastCopied.textContent = `${text.toUpperCase()} copied!`;
                toastCopied.style.display = 'block';
                setTimeout(() => {
                    toastCopied.style.display = 'none';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                 if (toastCopied) {
                    toastCopied.textContent = `${text.toUpperCase()} copied! (fallback)`;
                    toastCopied.style.display = 'block';
                    setTimeout(() => {
                        toastCopied.style.display = 'none';
                    }, 2000);
                }
            } catch (execErr) {
                alert('Failed to copy color code. Please copy it manually.');
            }
        });
    }

    // Initial generation
    if (baseColorHexInput.value && isValidHex(baseColorHexInput.value)) {
       generateAndDisplayPalettes();
    } else {
        // Set a default valid color if input is initially invalid
        baseColorHexInput.value = "#3498db";
        baseColorPicker.value = "#3498db";
        generateAndDisplayPalettes();
    }
});
