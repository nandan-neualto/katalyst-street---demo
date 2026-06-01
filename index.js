import { fetchFromSanity } from './sanity.js';

/*
 * Katalyst Street Redesign JS
 * Core interactivity: Mobile Nav, Solutions Tabs, Case/Blog Modals, Contact Form Toast,
 * Scroll Reveals, and the premium DeltaMax Telemetry Simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 1. Mobile Menu Toggle & Header Scrolled State
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.getElementById('main-nav');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Header change color on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // =========================================================================
  // 2. Solutions Showcase Tabs Switching
  // =========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate other tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });


  // =========================================================================
  // 3. Scroll Entrance Reveal Animations (Intersection Observer)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-card, .fade-in-up');
  
  // Set up animation defaults
  revealElements.forEach(el => {
    el.classList.add('fade-in-up');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // =========================================================================
  // 4. Interactive DeltaMax Diagnostic Simulator
  // =========================================================================
  const runSimBtn = document.getElementById('run-simulator');
  const simulatorSvg = document.getElementById('simulator-svg');
  const telemetryPath = document.getElementById('telemetry-path');
  const anomalyDot = document.getElementById('anomaly-dot');
  
  const statusEl = document.getElementById('tele-status');
  const psiEl = document.getElementById('tele-psi');
  const alertEl = document.getElementById('tele-alert');
  const logsContainer = document.getElementById('diagnostic-logs');

  let simulatorRunning = false;

  const appendLog = (text, type = 'muted') => {
    const line = document.createElement('div');
    line.className = `log-line text-${type}`;
    const time = new Date().toLocaleTimeString().split(' ')[0];
    line.textContent = `[${time}] ${text}`;
    logsContainer.appendChild(line);
    logsContainer.scrollTop = logsContainer.scrollHeight;
  };

  const runTelemetryDiagnostic = () => {
    if (simulatorRunning) return;
    simulatorRunning = true;
    runSimBtn.disabled = true;
    runSimBtn.textContent = 'Analyzing...';
    
    // Reset state & values
    appendLog('Telemetry Diagnostics initiated.', 'info');
    statusEl.textContent = 'Initializing...';
    statusEl.className = 'tele-val text-running';
    psiEl.textContent = '0.00';
    alertEl.textContent = 'NONE';
    alertEl.className = 'tele-val badge-alert-status safe';
    
    // Hide anomaly indicator dot
    anomalyDot.setAttribute('cx', '-20');
    anomalyDot.setAttribute('cy', '-20');
    
    // Telemetry path coordinate generator points
    const points = [
      { x: 0, y: 60 },
      { x: 40, y: 62 },
      { x: 80, y: 58 },
      { x: 120, y: 64 },
      { x: 160, y: 61 },
      { x: 200, y: 15 },  // Outlier anomaly spike point
      { x: 240, y: 62 },
      { x: 280, y: 59 },
      { x: 300, y: 60 }
    ];

    let step = 0;
    let pathD = `M ${points[0].x},${points[0].y}`;
    telemetryPath.setAttribute('d', pathD);

    const interval = setInterval(() => {
      step++;
      if (step < points.length) {
        const p = points[step];
        pathD += ` L ${p.x},${p.y}`;
        telemetryPath.setAttribute('d', pathD);
        
        statusEl.textContent = `Scanning Batch ${step}/8`;
        
        // Dynamic logs based on position
        if (step === 2) {
          appendLog('Checking multi-period metadata schemas... OK.', 'muted');
          psiEl.textContent = '0.04';
        }
        if (step === 4) {
          appendLog('Analyzing population index variables... Stable.', 'muted');
          psiEl.textContent = '0.08';
        }
        if (step === 5) {
          appendLog('[WARNING]: Volumetric standard deviation breach detected in pipeline stream.', 'alert');
          statusEl.textContent = 'Outlier Detected!';
          statusEl.className = 'tele-val text-alert';
          psiEl.textContent = '0.42'; // Exceeded typical 0.2 threshold!
          
          // Flash anomaly alert
          alertEl.textContent = 'OUTLIER';
          alertEl.className = 'tele-val badge-alert-status danger';
          
          // Display red pulsing outlier dot on SVG
          anomalyDot.setAttribute('cx', p.x.toString());
          anomalyDot.setAttribute('cy', p.y.toString());
        }
        if (step === 7) {
          appendLog('[INFO]: DeltaMax auto-reconciling stream. Routing to recovery block... Success.', 'info');
          psiEl.textContent = '0.12';
        }
      } else {
        // Diagnostic finish
        clearInterval(interval);
        simulatorRunning = false;
        runSimBtn.disabled = false;
        runSimBtn.textContent = 'Run Pipeline Test';
        
        statusEl.textContent = 'Completed';
        statusEl.className = 'tele-val text-done';
        
        appendLog('Diagnostics complete. DeltaMax successfully intercepted 1 critical schema anomaly.', 'info');
      }
    }, 850);
  };

  if (runSimBtn) {
    runSimBtn.addEventListener('click', runTelemetryDiagnostic);
  }


  // =========================================================================
  // 5. Case Study & Blog Post Modal Content Storage & Handling
  // =========================================================================
  const modalContainer = document.getElementById('modal-container');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalContentTarget = document.getElementById('modal-content-target');

  // Rich formatted contents for each dialog modal
  const modalDatabase = {
    'oben-modal': `
      <div class="modal-article">
        <div class="mini-badge">Boutique Strategic Advisory</div>
        <h3>Oben Holding Group Case Study</h3>
        <div class="modal-meta">Sector: Industrial Manufacturing | Scale: 10+ Countries</div>
        <p><strong>The Challenge:</strong> Oben Holding Group, a premium multi-national packaging manufacturer headquartered in Lima, Peru, struggled to consolidate pipeline logistics data coming from independent systems across their Americas manufacturing facilities.</p>
        <p><strong>The Strategy:</strong> Katalyst Street acted as direct strategic advisors to the C-suite (CEO and CFO). We audited their legacy databases and ingestion boundaries to catalog the true architectural debt. By establishing an elegant strategy framework, we designed a unified staging blueprint on Google Cloud Platform.</p>
        <p><strong>The Solution:</strong> Leveraging Snowflake and Google BigQuery, we designed modern, light, automated ETL ingestion pipelines. Key parameters were consolidated into dynamic Vertex dashboards, providing executives with single-source visibility.</p>
        <p><strong>The Results:</strong>
          <ul>
            <li>consolidated pipeline reporting latency reduced from 6 days to real-time.</li>
            <li>Operational transport bottlenecks decreased by 22% within 90 days.</li>
            <li>Enabled C-suite to execute immediate, data-backed operational adjustments.</li>
          </ul>
        </p>
      </div>
    `,
    'onegame-modal': `
      <div class="modal-article">
        <div class="mini-badge">AI Foundational Engineering</div>
        <h3>OneGame Chatbot Blueprint</h3>
        <div class="modal-meta">Sector: Immersive Gaming & AI | Scale: Global Platform</div>
        <p><strong>The Challenge:</strong> OneGame wanted to leverage modern Generative AI to boost gamer engagement and automate player support. Traditional rule-based chatbots felt synthetic and led to high exit rates.</p>
        <p><strong>The Strategy:</strong> Katalyst Street drove the foundational AI research. We conducted custom LLM parameters workshops to define appropriate tone, moderation layers, and integration triggers matching gaming contexts.</p>
        <p><strong>The Solution:</strong> We designed a secure, low-latency chatbot architecture utilizing Google Cloud Vertex AI and highly responsive custom Gemini models, isolated within secure virtual boundary structures to prevent database toxicity.</p>
        <p><strong>The Results:</strong>
          <ul>
            <li>Achieved a 45% lift in gamer chat duration and community engagement.</li>
            <li>Reduced technical support ticket queues by 60% through instant automated troubleshooting.</li>
            <li>Delivered a robust, modular roadmap for future multi-agent gaming frameworks.</li>
          </ul>
        </p>
      </div>
    `
  };

  const openModal = (targetId) => {
    const htmlContent = modalDatabase[targetId];
    if (htmlContent && modalContainer && modalContentTarget) {
      modalContentTarget.innerHTML = htmlContent;
      modalContainer.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
  };

  const closeModal = () => {
    if (modalContainer) {
      modalContainer.classList.add('hidden');
      document.body.style.overflow = 'auto'; // Resume scrolling
    }
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('data-modal');
      openModal(targetId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }


  // =========================================================================
  // 6. Form Submission Intercept & Premium Toast Notifications
  // =========================================================================
  const consultationForm = document.getElementById('consultation-form');
  const toastNotification = document.getElementById('toast-notification');

  if (consultationForm && toastNotification) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Trigger standard visual input validation success
      toastNotification.classList.remove('hidden');

      // Clear the inputs
      consultationForm.reset();

      // Animate dismiss toast after 3.5 seconds
      setTimeout(() => {
        toastNotification.classList.add('hidden');
      }, 3500);
    });
  }


  // =========================================================================
  // 7. Navigation ScrollSpy active link synchronization
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link:not(.contact-btn)');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // Load latest 3 insights dynamically from Sanity CMS (or fallback)
  async function loadHomepageInsights() {
    const homeInsightsGrid = document.getElementById('home-insights-grid');
    if (!homeInsightsGrid) return;

    try {
      const query = `*[_type == "post"] | order(publishedAt desc)[0...3] {
        title,
        slug,
        publishedAt,
        readTime,
        category,
        excerpt
      }`;
      const latestPosts = await fetchFromSanity(query);
      
      homeInsightsGrid.innerHTML = '';
      latestPosts.slice(0, 3).forEach(post => {
        const card = document.createElement('article');
        card.className = 'glass-card blog-card reveal-card active';
        
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', dateOptions);

        card.innerHTML = `
          <div class="blog-meta">
            <span class="blog-date">${formattedDate}</span>
            <span class="blog-read">${post.readTime || '5 Min Read'}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="./blog-post.html?slug=${post.slug.current || post.slug}" class="btn-text">Read Article →</a>
        `;
        homeInsightsGrid.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading homepage insights:', error);
    }
  }
  loadHomepageInsights();

});
