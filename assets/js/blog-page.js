document.addEventListener('DOMContentLoaded', () => {
    const featuredPostContainer = document.getElementById('featuredPostContainer');
    const blogPostsContainer = document.getElementById('blogPostsContainer');
    const aboutMeWidgetContainer = document.getElementById('aboutMeWidgetContainer');
    const categoryList = document.getElementById('categoryList');
    const popularPostList = document.getElementById('popularPostList');

    const blogData = [
        {
            title: "The Ultimate Guide to UTM Tracking: How to Master Campaign URLs",
            slug: "blog-utm-guide-2025",
            category: "Digital Marketing Analytics",
            date: "October 26, 2025",
            excerpt: "Learn what UTM tracking is and how to use parameters like utm_source, utm_medium, and utm_campaign to perfectly track your marketing efforts in Google Analytics.",
            featured: true // Mark this as the featured post
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

        const featuredPost = blogData.find(p => p.featured) || blogData[0];
        const standardPosts = blogData.filter(p => p !== featuredPost);

        // Render Featured Post
        if (featuredPostContainer && featuredPost) {
            featuredPostContainer.innerHTML = `
                <div class="col-12">
                    <div class="card featured-blog-card shadow-lg">
                        <div class="card-body p-4">
                            <p class="card-text small text-muted">${featuredPost.date} &bull; ${featuredPost.category}</p>
                            <h2 class="card-title h3"><a href="${featuredPost.slug}" class="text-decoration-none">${featuredPost.title}</a></h2>
                            <p class="card-text d-none d-md-block">${featuredPost.excerpt}</p>
                            <a href="${featuredPost.slug}" class="btn btn-primary mt-2">Read More <i class='bx bx-right-arrow-alt'></i></a>
                        </div>
                    </div>
                </div>
            `;
        }

        // Render Standard Posts
        blogPostsContainer.innerHTML = ''; // Clear loader
        standardPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'col-md-6 mb-4 d-flex align-items-stretch';
            postElement.innerHTML = `
                <div class="card blog-card h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <p class="card-text small text-muted">${post.date} &bull; ${post.category}</p>
                        <h4 class="card-title h5"><a href="${post.slug}" class="stretched-link text-decoration-none">${post.title}</a></h4>
                        <p class="card-text small flex-grow-1">${post.excerpt}</p>
                        <div class="mt-auto"></div>
                    </div>
                </div>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    function populateSidebar() {
        if (aboutMeWidgetContainer) {
            aboutMeWidgetContainer.innerHTML = `
                <img src="assets/img/sanjay-guthula.jpg" alt="Sanjay Guthula" class="about-me-img">
                <h4 class="about-me-name"><a href="/">Sanjay Guthula</a></h4>
                <p class="about-me-bio">Digital Marketing Strategist & Automation Expert. Passionate about AI and leveraging technology for growth.</p>
                <div class="about-me-social">
                    <a href="https://linkedin.com/in/sanjayguthula" target="_blank"><i class='bx bxl-linkedin'></i></a>
                    <a href="https://x.com/Sanjay18991236" target="_blank"><i class='bx bxl-twitter'></i></a>
                    <a href="https://www.instagram.com/sanjay_guthula" target="_blank"><i class='bx bxl-instagram'></i></a>
                </div>
            `;
        }

        if (categoryList) {
            const categories = [...new Set(blogData.map(p => p.category))];
            categoryList.innerHTML = categories.map(cat => `<li><a href="#">${cat}</a></li>`).join('');
        }

        if (popularPostList) {
            // Simple "popular" = first 3 posts. Can be made more complex later.
            const popularPosts = blogData.slice(0, 3);
            popularPostList.innerHTML = popularPosts.map(post => `
                <li>
                    <a href="${post.slug}" class="popular-post-item">
                        <div class="popular-post-content">
                            <h4 class="popular-post-title">${post.title}</h4>
                            <span class="popular-post-date">${post.date}</span>
                        </div>
                    </a>
                </li>
            `).join('');
        }
    }

    displayBlogPosts();
    populateSidebar();
});
