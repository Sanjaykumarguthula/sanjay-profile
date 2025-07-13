document.addEventListener('DOMContentLoaded', () => {
    const blogPostsContainer = document.getElementById('blogPostsContainer');

    const blogData = [
        {
            title: "The Ultimate Guide to UTM Tracking: How to Master Campaign URLs",
            slug: "blog-utm-guide-2025",
            category: "Digital Marketing Analytics",
            date: "October 26, 2025",
            excerpt: "Learn what UTM tracking is and how to use parameters like utm_source, utm_medium, and utm_campaign to perfectly track your marketing efforts in Google Analytics."
        },
        {
            title: "10x Your SEO: A Checklist for Analyzing Your Page's Heading Structure",
            slug: "blog-heading-structure-seo",
            category: "On-Page SEO",
            date: "October 25, 2025",
            excerpt: "Unlock easy SEO wins by mastering one of the most overlooked elements of your content: your heading tags (H1-H6)."
        },
        {
            title: "What is Keyword Density? A Simple Guide for SEO in 2025",
            slug: "blog-keyword-density-guide",
            category: "On-Page SEO",
            date: "October 24, 2025",
            excerpt: "Let's debunk the myths and understand how to use keyword frequency correctly in modern SEO without falling into the keyword stuffing trap."
        },
        {
            title: "How to Create the Perfect Google SERP Snippet",
            slug: "blog-serp-snippet-guide",
            category: "SEO & Content Marketing",
            date: "October 23, 2025",
            excerpt: "Your first impression with a potential visitor happens on Google's results page. Learn how to optimize your title and meta description to make it count."
        },
        {
            title: "Top 5 Free AI Image Generators for Marketers in 2025",
            slug: "blog-ai-image-generators-2025",
            category: "AI in Marketing",
            date: "October 22, 2025",
            excerpt: "Stop using boring stock photos. Create unique, high-quality visuals for your campaigns with these powerful and free AI tools."
        },
        {
            title: "The Rise of AI Voice: Best Free AI Voice Generators for 2025",
            slug: "blog-ai-voice-generators-2025",
            category: "AI in Marketing",
            date: "October 21, 2025",
            excerpt: "From podcasts to video ads, realistic text-to-speech is changing the game. Here are the top free tools to get you started."
        },
        {
            title: "How to Make a sitemap.xml and robots.txt File (The Simple Way)",
            slug: "blog-sitemap-robots-guide",
            category: "Technical SEO",
            date: "October 20, 2025",
            excerpt: "Take control of how Google sees your website with two simple files that make a huge difference for your site's discoverability."
        }
    ];

    function displayBlogPosts() {
        if (!blogPostsContainer) return;
        blogPostsContainer.innerHTML = ''; // Clear loader

        blogData.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-lg-6 mb-4'; // Two columns on large screens

            postElement.innerHTML = `
                <div class="card blog-card h-100 shadow-sm">
                    <div class="card-body">
                        <p class="card-text small text-muted">${post.date} &bull; ${post.category}</p>
                        <h4 class="card-title h5"><a href="${post.slug}" class="stretched-link text-decoration-none">${post.title}</a></h4>
                        <p class="card-text small">${post.excerpt}</p>
                    </div>
                </div>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    displayBlogPosts();
});
