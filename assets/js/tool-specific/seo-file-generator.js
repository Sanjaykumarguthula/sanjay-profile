document.addEventListener('DOMContentLoaded', () => {
    // --- Robots.txt Generator ---
    const robotsDefaultSelect = document.getElementById('robotsDefault');
    const sitemapUrlInput = document.getElementById('sitemapUrlInput');
    const disallowPathsTextarea = document.getElementById('disallowPaths');
    const robotsOutputTextarea = document.getElementById('robotsOutput');
    const copyRobotsBtn = document.getElementById('copyRobotsBtn');

    function generateRobotsTxt() {
        let content = "User-agent: *\n";
        content += (robotsDefaultSelect.value === 'allow') ? "Disallow:\n" : "Disallow: /\n";

        const disallowPaths = disallowPathsTextarea.value.trim().split('\n').filter(path => path.trim() !== '');
        disallowPaths.forEach(path => {
            content += `Disallow: ${path.trim()}\n`;
        });

        const sitemapUrl = sitemapUrlInput.value.trim();
        if (sitemapUrl) {
            content += `\nSitemap: ${sitemapUrl}\n`;
        }
        robotsOutputTextarea.value = content;
    }

    if (robotsDefaultSelect) robotsDefaultSelect.addEventListener('change', generateRobotsTxt);
    if (sitemapUrlInput) sitemapUrlInput.addEventListener('input', generateRobotsTxt);
    if (disallowPathsTextarea) disallowPathsTextarea.addEventListener('input', generateRobotsTxt);
    if (copyRobotsBtn) {
        copyRobotsBtn.addEventListener('click', () => {
            if (robotsOutputTextarea.value) {
                navigator.clipboard.writeText(robotsOutputTextarea.value).then(() => {
                    const originalText = copyRobotsBtn.innerHTML;
                    copyRobotsBtn.innerHTML = "<i class='bx bx-check'></i> Copied!";
                    setTimeout(() => { copyRobotsBtn.innerHTML = "<i class='bx bx-copy'></i> Copy"; }, 2000);
                }).catch(err => console.error('Failed to copy robots.txt:', err));
            }
        });
    }
    // Initial generation for robots.txt
    if(robotsOutputTextarea) generateRobotsTxt();


    // --- Sitemap.xml Generator ---
    const urlListInput = document.getElementById('urlListInputSitemap');
    const generateSitemapBtn = document.getElementById('generateSitemapBtn');
    const sitemapResultContainer = document.getElementById('sitemapResultContainer');
    const sitemapOutputTextarea = document.getElementById('sitemapOutput');
    const copySitemapBtn = document.getElementById('copySitemapBtn');
    const downloadSitemapBtn = document.getElementById('downloadSitemapBtn');
    const sitemapError = document.getElementById('sitemapError');

    function escapeXml(unsafe) {
        return unsafe.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','\'':'&apos;','"':'&quot;'})[c]);
    }

    function isValidUrl(string) {
        try { new URL(string); return true; } catch (_) { return false; }
    }

    if (generateSitemapBtn) {
        generateSitemapBtn.addEventListener('click', () => {
            sitemapError.style.display = 'none';
            const urls = urlListInput.value.trim().split('\n').map(url => url.trim()).filter(url => url !== '');

            if (urls.length === 0) {
                sitemapError.textContent = 'Please enter at least one URL.';
                sitemapError.style.display = 'block';
                return;
            }
            if (urls.some(url => !isValidUrl(url))) {
                sitemapError.textContent = 'One or more invalid URLs found. Please ensure all URLs are complete (e.g., https://example.com).';
                sitemapError.style.display = 'block';
                return;
            }

            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
            urls.forEach(url => {
                xml += '  <url>\n';
                xml += `    <loc>${escapeXml(url)}</loc>\n`;
                // Basic sitemap - not including lastmod, changefreq, priority for this simple generator
                xml += '  </url>\n';
            });
            xml += '</urlset>';

            sitemapOutputTextarea.value = xml;
            sitemapResultContainer.style.display = 'block';
        });
    }

    if (copySitemapBtn) {
        copySitemapBtn.addEventListener('click', () => {
            if (sitemapOutputTextarea.value) {
                navigator.clipboard.writeText(sitemapOutputTextarea.value).then(() => {
                    const originalText = copySitemapBtn.innerHTML;
                    copySitemapBtn.innerHTML = "<i class='bx bx-check'></i> Copied!";
                    setTimeout(() => { copySitemapBtn.innerHTML = "<i class='bx bx-copy'></i> Copy"; }, 2000);
                }).catch(err => console.error('Failed to copy sitemap:', err));
            }
        });
    }

    if (downloadSitemapBtn) {
        downloadSitemapBtn.addEventListener('click', () => {
            if (sitemapOutputTextarea.value) {
                const blob = new Blob([sitemapOutputTextarea.value], { type: 'application/xml;charset=utf-8' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'sitemap.xml';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
});
