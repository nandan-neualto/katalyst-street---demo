import { fetchFromSanity } from './sanity.js';

document.addEventListener('DOMContentLoaded', async () => {
  const blogPostsGrid = document.getElementById('blog-posts-grid');
  const blogLoadingGrid = document.getElementById('blog-loading-grid');
  const blogEmptyState = document.getElementById('blog-empty-state');
  const searchInput = document.getElementById('blog-search-input');
  const resetFiltersBtn = document.getElementById('reset-blog-filters');
  const pillsContainer = document.getElementById('category-pills-container');

  // Mobile navigation toggler
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  let blogPosts = [];
  let activeCategory = 'All';
  let activeSearchQuery = '';

  // 1. Fetch data from Sanity CMS (or fallback local database inside sanity.js)
  async function loadBlogData() {
    // Show loaders
    blogLoadingGrid.classList.remove('hidden');
    blogPostsGrid.classList.add('hidden');
    blogEmptyState.classList.add('hidden');

    try {
      // Query post data in GROQ syntax
      const query = `*[_type == "post"] | order(publishedAt desc) {
        title,
        slug,
        publishedAt,
        readTime,
        category,
        author->{
          name,
          role,
          avatar
        },
        excerpt,
        mainImage
      }`;
      
      blogPosts = await fetchFromSanity(query);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    }

    // Add a slight delay for skeletal loading animation to show high-end micro-interaction
    setTimeout(() => {
      blogLoadingGrid.classList.add('hidden');
      blogPostsGrid.classList.remove('hidden');
      renderPosts();
    }, 600);
  }

  // 2. Render filtered posts to DOM
  function renderPosts() {
    // Filter logic
    const filtered = blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch = 
        post.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        (post.author && post.author.name.toLowerCase().includes(activeSearchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

    // Clean container
    blogPostsGrid.innerHTML = '';

    if (filtered.length === 0) {
      blogEmptyState.classList.remove('hidden');
      blogPostsGrid.classList.add('hidden');
      return;
    }

    blogEmptyState.classList.add('hidden');
    blogPostsGrid.classList.remove('hidden');

    filtered.forEach(post => {
      const card = document.createElement('article');
      card.className = 'glass-card blog-card reveal-card active';
      
      // Formatting date
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', dateOptions);

      // Render image if present or use standard technology visual placeholder
      const imageUrl = post.mainImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=450';
      const authorAvatar = (post.author && post.author.avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';
      const authorName = (post.author && post.author.name) || 'Katalyst Analyst';

      card.innerHTML = `
        <div class="blog-card-image-wrapper">
          <img src="${imageUrl}" alt="${post.title}" class="blog-card-image" loading="lazy">
          <span class="blog-card-tag">${post.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <span class="blog-date">${formattedDate}</span>
            <span class="blog-read">${post.readTime || '5 Min Read'}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <div class="blog-card-author-footer">
            <div class="blog-author-info">
              <img src="${authorAvatar}" alt="${authorName}" class="author-avatar-img">
              <div>
                <strong class="author-name-text">${authorName}</strong>
                <span class="author-role-text">${(post.author && post.author.role) || 'Advisory Team'}</span>
              </div>
            </div>
            <a href="./blog-post.html?slug=${post.slug.current || post.slug}" class="btn-text">Read Article →</a>
          </div>
        </div>
      `;
      blogPostsGrid.appendChild(card);
    });
  }

  // 3. Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value;
      renderPosts();
    });
  }

  // 4. Category Pills handler
  if (pillsContainer) {
    pillsContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;

      // Switch active class
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeCategory = pill.getAttribute('data-category');
      renderPosts();
    });
  }

  // 5. Reset button handler
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activeSearchQuery = '';
      activeCategory = 'All';
      
      // Update pills UI
      document.querySelectorAll('.pill').forEach(p => {
        if (p.getAttribute('data-category') === 'All') {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      renderPosts();
    });
  }

  // Load initial data
  await loadBlogData();
});
