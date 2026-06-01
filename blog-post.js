import { fetchFromSanity } from './sanity.js';

document.addEventListener('DOMContentLoaded', async () => {
  const postSkeleton = document.getElementById('post-reader-skeleton');
  const postContent = document.getElementById('post-reader-content');
  const errorState = document.getElementById('post-error-state');

  // DOM Elements for content injection
  const postCategory = document.getElementById('post-category');
  const postTitle = document.getElementById('post-title');
  const authorAvatar = document.getElementById('post-author-avatar');
  const authorName = document.getElementById('post-author-name');
  const authorRole = document.getElementById('post-author-role');
  const postDate = document.getElementById('post-date');
  const postReadtime = document.getElementById('post-readtime');
  const heroImage = document.getElementById('post-hero-image');
  const bodyContent = document.getElementById('post-body-content');

  // Share features
  const copyBtn = document.getElementById('share-copy-url');
  const linkedinBtn = document.getElementById('share-linkedin');
  const toast = document.getElementById('toast-notification');
  const progressIndicator = document.getElementById('reading-progress');

  // Mobile navigation toggler
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // 1. Get slug parameter from URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    showError();
    return;
  }

  // 2. Fetch the individual post from Sanity CMS
  async function loadPostData() {
    try {
      const query = `*[_type == "post" && slug.current == "${slug}"][0] {
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
        mainImage,
        body
      }`;

      const post = await fetchFromSanity(query);
      
      // If result is empty array or null, try matching on our mock data directly
      const activePost = (Array.isArray(post) ? post[0] : post);

      if (!activePost) {
        showError();
        return;
      }

      renderPost(activePost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      showError();
    }
  }

  function showError() {
    postSkeleton.classList.add('hidden');
    postContent.classList.add('hidden');
    errorState.classList.remove('hidden');
  }

  // 3. Render post elements to the screen
  function renderPost(post) {
    // Populate header metadata
    postCategory.textContent = post.category || 'Advisory';
    postTitle.textContent = post.title;

    // Formatting date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', dateOptions);
    postDate.textContent = formattedDate;
    postReadtime.textContent = post.readTime || '5 Min Read';

    // Author binding
    const writerName = (post.author && post.author.name) || 'Katalyst Analyst';
    authorName.textContent = writerName;
    authorRole.textContent = (post.author && post.author.role) || 'Advisory Team';
    authorAvatar.src = (post.author && post.author.avatar) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';
    authorAvatar.alt = writerName;

    // Hero Image
    heroImage.src = post.mainImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=600';
    heroImage.alt = post.title;

    // Build the dynamic rich text body from Sanity portable text block structure
    bodyContent.innerHTML = '';
    
    if (Array.isArray(post.body)) {
      post.body.forEach(block => {
        if (block._type === 'block') {
          // Standard paragraphs
          const p = document.createElement('p');
          p.textContent = block.children.map(child => child.text).join(' ');
          bodyContent.appendChild(p);
        } else if (block._type === 'heading') {
          // Subheadings (h2 / h3)
          const h = document.createElement(`h${block.level || 2}`);
          h.textContent = block.children.map(child => child.text).join(' ');
          bodyContent.appendChild(h);
        } else if (block._type === 'list') {
          // Unordered Lists
          const ul = document.createElement('ul');
          block.items.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            ul.appendChild(li);
          });
          bodyContent.appendChild(ul);
        }
      });
    } else {
      // Direct string fallback
      const p = document.createElement('p');
      p.textContent = post.body || post.excerpt;
      bodyContent.appendChild(p);
    }

    // Configure social share links dynamically
    const currentUrl = window.location.href;
    if (linkedinBtn) {
      linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    }

    // Toggle view from loading skeletons
    setTimeout(() => {
      postSkeleton.classList.add('hidden');
      postContent.classList.remove('hidden');
      setupReadingProgress();
    }, 600);
  }

  // 4. Scroll reading progress bar calculations
  function setupReadingProgress() {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      const progressPercent = Math.min((scrollPos / docHeight) * 100, 100);
      
      if (progressIndicator) {
        progressIndicator.style.width = `${progressPercent}%`;
      }
    });
  }

  // 5. Copy URL action
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        // Trigger visual toast confirmation
        if (toast) {
          toast.classList.remove('hidden');
          setTimeout(() => {
            toast.classList.add('hidden');
          }, 3000);
        }
      }).catch(err => {
        console.error('Failed to copy link:', err);
      });
    });
  }

  await loadPostData();
});
