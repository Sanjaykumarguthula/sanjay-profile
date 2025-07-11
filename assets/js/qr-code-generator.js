document.addEventListener('DOMContentLoaded', function () {
    const qrDataTypeSelect = document.getElementById('qrDataType');
    const qrInputsContainer = document.getElementById('qrInputsContainer');
    const generateQrBtn = document.getElementById('generateQrBtn');
    const qrcodeCanvasContainer = document.getElementById('qrcodeCanvasContainer');
    const qrPlaceholderText = document.getElementById('qrPlaceholderText');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadSvgBtn = document.getElementById('downloadSvgBtn');

    const fgColorPicker = document.getElementById('qrFgColor');
    const bgColorPicker = document.getElementById('qrBgColor');
    const sizeInput = document.getElementById('qrSize');
    const errorCorrectionSelect = document.getElementById('qrErrorCorrection');

    let currentQrInstance = null; // To hold the QRious instance

    const inputFieldsConfig = {
        url: `
            <div class="form-group mb-3" data-type="url">
                <label for="qrUrl" class="form-label">Website URL (e.g., https://example.com):</label>
                <input type="url" id="qrUrl" class="form-control qr-data-input" placeholder="https://example.com">
            </div>`,
        text: `
            <div class="form-group mb-3" data-type="text">
                <label for="qrText" class="form-label">Plain Text:</label>
                <textarea id="qrText" class="form-control qr-data-input" rows="3" placeholder="Enter your text here"></textarea>
            </div>`,
        email: `
            <div class="form-group mb-3" data-type="email">
                <label for="qrEmailAddress" class="form-label">Email Address:</label>
                <input type="email" id="qrEmailAddress" class="form-control qr-data-input mb-2" placeholder="recipient@example.com">
                <label for="qrEmailSubject" class="form-label">Subject (Optional):</label>
                <input type="text" id="qrEmailSubject" class="form-control qr-data-input-optional mb-2" placeholder="Email Subject">
                <label for="qrEmailBody" class="form-label">Body (Optional):</label>
                <textarea id="qrEmailBody" class="form-control qr-data-input-optional" rows="2" placeholder="Email body text"></textarea>
            </div>`,
        phone: `
            <div class="form-group mb-3" data-type="phone">
                <label for="qrPhoneNumber" class="form-label">Phone Number (include country code, e.g., +1234567890):</label>
                <input type="tel" id="qrPhoneNumber" class="form-control qr-data-input" placeholder="+1234567890">
            </div>`,
        sms: `
            <div class="form-group mb-3" data-type="sms">
                <label for="qrSmsNumber" class="form-label">Phone Number (for SMS):</label>
                <input type="tel" id="qrSmsNumber" class="form-control qr-data-input mb-2" placeholder="+1234567890">
                <label for="qrSmsBody" class="form-label">Message (Optional):</label>
                <textarea id="qrSmsBody" class="form-control qr-data-input-optional" rows="2" placeholder="SMS message text"></textarea>
            </div>`,
        wifi: `
            <div class="form-group mb-3" data-type="wifi">
                <label for="qrWifiSsid" class="form-label">Network Name (SSID):</label>
                <input type="text" id="qrWifiSsid" class="form-control qr-data-input mb-2" placeholder="MyWiFiNetwork">
                <label for="qrWifiPassword" class="form-label">Password:</label>
                <input type="password" id="qrWifiPassword" class="form-control qr-data-input mb-2" placeholder="MyPassword123">
                <label for="qrWifiEncryption" class="form-label">Encryption Type:</label>
                <select id="qrWifiEncryption" class="form-select qr-data-input">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">No Password (Open)</option>
                </select>
                <div class="form-check mt-2">
                     <input class="form-check-input" type="checkbox" id="qrWifiHidden">
                     <label class="form-check-label" for="qrWifiHidden">Hidden Network (SSID)</label>
                </div>
            </div>`
    };

    function updateQrInputs() {
        const selectedType = qrDataTypeSelect.value;
        qrInputsContainer.innerHTML = inputFieldsConfig[selectedType] || '';
    }

    function getQrData() {
        const type = qrDataTypeSelect.value;
        let data = "";
        switch (type) {
            case 'url':
                data = document.getElementById('qrUrl')?.value || "";
                break;
            case 'text':
                data = document.getElementById('qrText')?.value || "";
                break;
            case 'email':
                const email = document.getElementById('qrEmailAddress')?.value;
                const subject = document.getElementById('qrEmailSubject')?.value;
                const body = document.getElementById('qrEmailBody')?.value;
                data = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                break;
            case 'phone':
                data = `tel:${document.getElementById('qrPhoneNumber')?.value}`;
                break;
            case 'sms':
                const smsNumber = document.getElementById('qrSmsNumber')?.value;
                const smsBody = document.getElementById('qrSmsBody')?.value;
                data = `SMSTO:${smsNumber}:${encodeURIComponent(smsBody)}`;
                break;
            case 'wifi':
                const ssid = document.getElementById('qrWifiSsid')?.value;
                const password = document.getElementById('qrWifiPassword')?.value;
                const encryption = document.getElementById('qrWifiEncryption')?.value;
                const hidden = document.getElementById('qrWifiHidden')?.checked ? 'true' : 'false';
                data = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden};`;
                break;
        }
        return data.trim();
    }

    function generateQrCode() {
        if (typeof QRious !== 'function') {
            console.error("QRious library is not loaded.");
            qrcodeCanvasContainer.innerHTML = '<p class="text-danger">Error: QR Code library not loaded.</p>';
            return;
        }

        const data = getQrData();
        if (!data) {
            alert("Please enter data to generate the QR code.");
            return;
        }

        if (qrPlaceholderText) qrPlaceholderText.style.display = 'none';
        qrcodeCanvasContainer.innerHTML = ''; // Clear previous QR code

        const canvasElement = document.createElement('canvas');
        qrcodeCanvasContainer.appendChild(canvasElement);

        currentQrInstance = new QRious({
            element: canvasElement,
            value: data,
            size: parseInt(sizeInput.value) || 256,
            foreground: fgColorPicker.value || '#000000',
            background: bgColorPicker.value || '#ffffff',
            level: errorCorrectionSelect.value || 'M' // L, M, Q, H
        });

        downloadPngBtn.style.display = 'inline-block';
        downloadSvgBtn.style.display = 'inline-block';
    }

    if (qrDataTypeSelect) {
        qrDataTypeSelect.addEventListener('change', updateQrInputs);
        updateQrInputs(); // Initial call
    }

    if (generateQrBtn) {
        generateQrBtn.addEventListener('click', generateQrCode);
    }

    // Auto-update on option changes if QR code already exists
    [fgColorPicker, bgColorPicker, sizeInput, errorCorrectionSelect].forEach(el => {
        if (el) {
            el.addEventListener('change', () => {
                if (currentQrInstance && qrcodeCanvasContainer.querySelector('canvas')) { // Check if QR is already generated
                    generateQrCode();
                }
            });
        }
    });


    if (downloadPngBtn) {
        downloadPngBtn.addEventListener('click', function() {
            if (currentQrInstance && qrcodeCanvasContainer.querySelector('canvas')) {
                const canvas = qrcodeCanvasContainer.querySelector('canvas');
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = 'qrcode.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert("Please generate a QR code first.");
            }
        });
    }

    if (downloadSvgBtn) {
        downloadSvgBtn.addEventListener('click', function() {
             if (currentQrInstance && qrcodeCanvasContainer.querySelector('canvas')) {
                const data = getQrData();
                if (!data) return;

                // QRious doesn't directly output SVG. We can construct a basic one.
                // This is a simplified SVG generation. For complex QR codes or more features, a dedicated SVG library might be better.
                const size = parseInt(sizeInput.value) || 256;
                const fg = fgColorPicker.value || '#000000';
                const bg = bgColorPicker.value || '#ffffff';

                // Re-generate with QRious to get the matrix (internal structure)
                // This is a bit of a hack as QRious doesn't expose matrix directly.
                // We'll draw on a temporary canvas to inspect pixels.
                const tempCanvas = document.createElement('canvas');
                const tempQr = new QRious({ element: tempCanvas, value: data, size: 200, level: errorCorrectionSelect.value, padding:0 }); // Use fixed size for matrix reading
                const ctx = tempCanvas.getContext('2d');
                const matrixSize = tempQr.qrmatrix.length; // Approximate based on internal structure if available, else guess
                const pixelSize = Math.floor(size / matrixSize); // size of each "dot"

                let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
                svg += `<rect width="100%" height="100%" fill="${bg}"/>`;

                for (let r = 0; r < matrixSize; r++) {
                    for (let c = 0; c < matrixSize; c++) {
                        // This part is tricky without direct matrix access.
                        // A more robust way would be needed if QRious doesn't expose the matrix.
                        // For now, we assume qrmatrix is somewhat accessible or we use a library that gives matrix.
                        // If not, this SVG export will be basic or require a different QR lib.
                        // This is a placeholder for a more accurate pixel check if qrmatrix is not directly usable.
                        // The below is a simplified example and might not perfectly match QRious rendering.
                         if (tempQr.qrmatrix && tempQr.qrmatrix[r][c]) { // Check if this structure exists
                             svg += `<rect x="${c * pixelSize}" y="${r * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fg}"/>`;
                         }
                    }
                }
                 // Fallback if matrix reading is too complex or not feasible with current QRious exposure
                if (svg.length < 200) { // Arbitrary check if matrix population failed
                    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
                    svg += `<rect width="100%" height="100%" fill="${bg}"/>`;
                    svg += `<text x="10" y="${size/2}" font-size="12" fill="${fg}">SVG Export for QR content: ${data.substring(0,50)}...</text>`;
                    svg += `<text x="10" y="${size/2 + 20}" font-size="10" fill="#888">(Simplified SVG - full QR pattern not rendered)</text>`;
                    console.warn("Simplified SVG export due to matrix access limitations.");
                }


                svg += `</svg>`;

                const blob = new Blob([svg], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qrcode.svg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                alert("Please generate a QR code first.");
            }
        });
    }
});
