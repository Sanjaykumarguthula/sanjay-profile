document.addEventListener('DOMContentLoaded', function () {
    const imageUploadInput = document.getElementById('imageUploadInput');
    const compressionLevelSlider = document.getElementById('compressionLevel');
    const compressionLevelOutput = document.getElementById('compressionLevelOutput');
    const compressImageBtn = document.getElementById('compressImageBtn');
    const imageProcessingStatus = document.getElementById('imageProcessingStatus');

    const originalPreviewBox = document.getElementById('originalPreviewBox');
    const originalImagePreview = document.getElementById('originalImagePreview');
    const originalImageInfo = document.getElementById('originalImageInfo');

    const compressedPreviewBox = document.getElementById('compressedPreviewBox');
    const compressedImagePreview = document.getElementById('compressedImagePreview');
    const compressedImageInfo = document.getElementById('compressedImageInfo');
    const downloadCompressedImageBtn = document.getElementById('downloadCompressedImageBtn');

    const compressionError = document.getElementById('compressionError');

    let originalFile = null;

    if (compressionLevelSlider && compressionLevelOutput) {
        compressionLevelSlider.addEventListener('input', function() {
            compressionLevelOutput.textContent = this.value;
        });
    }

    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', function(event) {
            originalFile = event.target.files[0];
            if (originalFile) {
                compressImageBtn.disabled = false;
                originalPreviewBox.style.display = 'block';
                compressedPreviewBox.style.display = 'none';
                downloadCompressedImageBtn.style.display = 'none';
                compressionError.style.display = 'none';

                const reader = new FileReader();
                reader.onload = function(e) {
                    originalImagePreview.src = e.target.result;
                }
                reader.readAsDataURL(originalFile);
                originalImageInfo.textContent = `Size: ${(originalFile.size / 1024).toFixed(2)} KB, Type: ${originalFile.type}`;
            } else {
                compressImageBtn.disabled = true;
                originalPreviewBox.style.display = 'none';
            }
        });
    }

    if (compressImageBtn) {
        compressImageBtn.addEventListener('click', async function() {
            if (!originalFile) {
                compressionError.textContent = 'Please select an image file first.';
                compressionError.style.display = 'block';
                return;
            }
            if (typeof browserImageCompression !== 'function') {
                compressionError.textContent = 'Image compression library not loaded. Please check your internet connection or try again later.';
                compressionError.style.display = 'block';
                console.error("browserImageCompression is not defined. Make sure the library is loaded.");
                return;
            }


            imageProcessingStatus.style.display = 'block';
            compressImageBtn.disabled = true;
            compressionError.style.display = 'none';
            compressedPreviewBox.style.display = 'none';
            downloadCompressedImageBtn.style.display = 'none';

            const options = {
                maxSizeMB: 2, // Max size in MB
                maxWidthOrHeight: 1920, // Max width or height
                useWebWorker: true,
                quality: parseFloat(compressionLevelSlider.value), // Use slider value for quality
                fileType: originalFile.type // Preserve original file type if possible
            };

            try {
                console.log('Original file:', originalFile.name, originalFile.size / 1024 + ' KB', originalFile.type);
                console.log('Compression options:', options);

                const compressedFile = await browserImageCompression(originalFile, options);

                console.log('Compressed file:', compressedFile.name, compressedFile.size / 1024 + ' KB', compressedFile.type);

                compressedPreviewBox.style.display = 'block';
                const compressedReader = new FileReader();
                compressedReader.onload = function(e) {
                    compressedImagePreview.src = e.target.result;
                }
                compressedReader.readAsDataURL(compressedFile);

                const sizeReduction = originalFile.size - compressedFile.size;
                const percentageReduction = ((sizeReduction / originalFile.size) * 100).toFixed(2);

                compressedImageInfo.textContent = `Size: ${(compressedFile.size / 1024).toFixed(2)} KB, Savings: ${percentageReduction}%`;

                downloadCompressedImageBtn.href = URL.createObjectURL(compressedFile);
                // Preserve original extension or use a sensible default
                const extension = originalFile.name.split('.').pop().toLowerCase();
                const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                const downloadFileName = `compressed_image.${validExtensions.includes(extension) ? extension : 'jpg'}`;
                downloadCompressedImageBtn.download = downloadFileName;
                downloadCompressedImageBtn.style.display = 'inline-block';

            } catch (error) {
                console.error('Compression error:', error);
                compressionError.textContent = `Error during compression: ${error.message || error}. Try adjusting quality or using a different image.`;
                compressionError.style.display = 'block';
            } finally {
                imageProcessingStatus.style.display = 'none';
                compressImageBtn.disabled = false; // Re-enable after processing
            }
        });
    }
});
