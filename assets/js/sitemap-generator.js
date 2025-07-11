document.addEventListener('DOMContentLoaded', function () {
    const urlListInput = document.getElementById('urlListInput');
    const lastmodDateInput = document.getElementById('lastmodDate');
    const changefreqSelect = document.getElementById('changefreqSelect');
    const priorityInput = document.getElementById('priorityInput');
    const generateSitemapBtn = document.getElementById('generateSitemapBtn');
    const sitemapResultContainer = document.getElementById('sitemapResultContainer');
    const sitemapOutputDiv = document.getElementById('sitemapOutput'); // Changed to Div
    const copySitemapBtn = document.getElementById('copySitemapBtn');
    const downloadSitemapBtn = document.getElementById('downloadSitemapBtn');
    const sitemapError = document.getElementById('sitemapError');

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
            return c;
        });
    }

    function displaySitemapError(message) {
        if (sitemapError) {
            sitemapError.textContent = message;
            sitemapError.style.display = 'block';
        }
        if (sitemapResultContainer) {
            sitemapResultContainer.style.display = 'none';
        }
    }

    function clearSitemapError() {
        if (sitemapError) {
            sitemapError.textContent = '';
            sitemapError.style.display = 'none';
        }
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }


    if (generateSitemapBtn) {
        generateSitemapBtn.addEventListener('click', function() {
            clearSitemapError();
            const urls = urlListInput.value.trim().split('\n').map(url => url.trim()).filter(url => url !== '');

            if (urls.length === 0) {
                displaySitemapError('Please enter at least one URL.');
                return;
            }

            let invalidUrls = [];
            urls.forEach(url => {
                if (!isValidUrl(url)) {
                    invalidUrls.push(url);
                }
            });

            if (invalidUrls.length > 0) {
                displaySitemapError(`Invalid URL(s) found: ${invalidUrls.join(', ')}. Please ensure all URLs are valid and include http/https.`);
                return;
            }

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

            const lastmod = lastmodDateInput.value;
            const changefreq = changefreqSelect.value;
            const priority = priorityInput.value;

            urls.forEach(url => {
                xml += '  <url>\n';
                xml += `    <loc>${escapeXml(url)}</loc>\n`;
                if (lastmod) {
                    xml += `    <lastmod>${lastmod}</lastmod>\n`;
                }
                if (changefreq) {
                    xml += `    <changefreq>${changefreq}</changefreq>\n`;
                }
                if (priority && !isNaN(parseFloat(priority)) && parseFloat(priority) >= 0.0 && parseFloat(priority) <= 1.0) {
                    xml += `    <priority>${parseFloat(priority).toFixed(1)}</priority>\n`;
                }
                xml += '  </url>\n';
            });

            xml += '</urlset>';

            sitemapOutputDiv.textContent = xml; // Use textContent for pre-like display in a div
            sitemapResultContainer.style.display = 'block';
        });
    }

    if (copySitemapBtn) {
        copySitemapBtn.addEventListener('click', function() {
            if (sitemapOutputDiv.textContent) {
                navigator.clipboard.writeText(sitemapOutputDiv.textContent).then(() => {
                    const originalText = copySitemapBtn.textContent;
                    copySitemapBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copySitemapBtn.textContent = originalText;
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy sitemap: ', err);
                    alert('Failed to copy sitemap. Please copy manually.');
                });
            }
        });
    }

    if (downloadSitemapBtn) {
        downloadSitemapBtn.addEventListener('click', function() {
            if (sitemapOutputDiv.textContent) {
                const blob = new Blob([sitemapOutputDiv.textContent], { type: 'application/xml;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'sitemap.xml';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }
        });
    }
});
