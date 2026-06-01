import{f as q}from"./sanity-DQ0LG-a8.js";document.addEventListener("DOMContentLoaded",()=>{const d=document.getElementById("mobile-toggle"),g=document.querySelector(".nav-menu"),f=document.getElementById("main-nav");d&&g&&(d.addEventListener("click",()=>{d.classList.toggle("active"),g.classList.toggle("active")}),document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",()=>{d.classList.remove("active"),g.classList.remove("active")})})),window.addEventListener("scroll",()=>{window.scrollY>50?f.classList.add("scrolled"):f.classList.remove("scrolled")});const b=document.querySelectorAll(".tab-btn"),A=document.querySelectorAll(".tab-content");b.forEach(e=>{e.addEventListener("click",()=>{b.forEach(a=>a.classList.remove("active")),A.forEach(a=>a.classList.remove("active")),e.classList.add("active");const n=e.getAttribute("data-target"),t=document.getElementById(n);t&&t.classList.add("active")})});const E=document.querySelectorAll(".reveal-card, .fade-in-up");E.forEach(e=>{e.classList.add("fade-in-up")});const S=new IntersectionObserver((e,n)=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("active"),n.unobserve(t.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});E.forEach(e=>S.observe(e));const l=document.getElementById("run-simulator");document.getElementById("simulator-svg");const x=document.getElementById("telemetry-path"),m=document.getElementById("anomaly-dot"),i=document.getElementById("tele-status"),c=document.getElementById("tele-psi"),u=document.getElementById("tele-alert"),h=document.getElementById("diagnostic-logs");let p=!1;const r=(e,n="muted")=>{const t=document.createElement("div");t.className=`log-line text-${n}`;const a=new Date().toLocaleTimeString().split(" ")[0];t.textContent=`[${a}] ${e}`,h.appendChild(t),h.scrollTop=h.scrollHeight},w=()=>{if(p)return;p=!0,l.disabled=!0,l.textContent="Analyzing...",r("Telemetry Diagnostics initiated.","info"),i.textContent="Initializing...",i.className="tele-val text-running",c.textContent="0.00",u.textContent="NONE",u.className="tele-val badge-alert-status safe",m.setAttribute("cx","-20"),m.setAttribute("cy","-20");const e=[{x:0,y:60},{x:40,y:62},{x:80,y:58},{x:120,y:64},{x:160,y:61},{x:200,y:15},{x:240,y:62},{x:280,y:59},{x:300,y:60}];let n=0,t=`M ${e[0].x},${e[0].y}`;x.setAttribute("d",t);const a=setInterval(()=>{if(n++,n<e.length){const o=e[n];t+=` L ${o.x},${o.y}`,x.setAttribute("d",t),i.textContent=`Scanning Batch ${n}/8`,n===2&&(r("Checking multi-period metadata schemas... OK.","muted"),c.textContent="0.04"),n===4&&(r("Analyzing population index variables... Stable.","muted"),c.textContent="0.08"),n===5&&(r("[WARNING]: Volumetric standard deviation breach detected in pipeline stream.","alert"),i.textContent="Outlier Detected!",i.className="tele-val text-alert",c.textContent="0.42",u.textContent="OUTLIER",u.className="tele-val badge-alert-status danger",m.setAttribute("cx",o.x.toString()),m.setAttribute("cy",o.y.toString())),n===7&&(r("[INFO]: DeltaMax auto-reconciling stream. Routing to recovery block... Success.","info"),c.textContent="0.12")}else clearInterval(a),p=!1,l.disabled=!1,l.textContent="Run Pipeline Test",i.textContent="Completed",i.className="tele-val text-done",r("Diagnostics complete. DeltaMax successfully intercepted 1 critical schema anomaly.","info")},850)};l&&l.addEventListener("click",w);const s=document.getElementById("modal-container"),L=document.getElementById("modal-close-btn"),C=document.getElementById("modal-content-target"),B={"oben-modal":`
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
    `,"onegame-modal":`
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
    `},T=e=>{const n=B[e];n&&s&&C&&(C.innerHTML=n,s.classList.remove("hidden"),document.body.style.overflow="hidden")},I=()=>{s&&(s.classList.add("hidden"),document.body.style.overflow="auto")};document.querySelectorAll(".open-modal-btn").forEach(e=>{e.addEventListener("click",n=>{const t=e.getAttribute("data-modal");T(t)})}),L&&L.addEventListener("click",I),s&&s.addEventListener("click",e=>{e.target===s&&I()});const v=document.getElementById("consultation-form"),y=document.getElementById("toast-notification");v&&y&&v.addEventListener("submit",e=>{e.preventDefault(),y.classList.remove("hidden"),v.reset(),setTimeout(()=>{y.classList.add("hidden")},3500)});const k=document.querySelectorAll(".nav-link:not(.contact-btn)"),D=document.querySelectorAll("section[id]");window.addEventListener("scroll",()=>{let e="";const n=window.scrollY+100;D.forEach(t=>{const a=t.offsetTop,o=t.offsetHeight;n>=a&&n<a+o&&(e=t.getAttribute("id"))}),e&&k.forEach(t=>{t.classList.remove("active"),t.getAttribute("href")===`#${e}`&&t.classList.add("active")})});async function O(){const e=document.getElementById("home-insights-grid");if(e)try{const t=await q(`*[_type == "post"] | order(publishedAt desc)[0...3] {
        title,
        slug,
        publishedAt,
        readTime,
        category,
        excerpt
      }`);e.innerHTML="",t.slice(0,3).forEach(a=>{const o=document.createElement("article");o.className="glass-card blog-card reveal-card active";const M={year:"numeric",month:"long",day:"numeric"},$=new Date(a.publishedAt).toLocaleDateString("en-US",M);o.innerHTML=`
          <div class="blog-meta">
            <span class="blog-date">${$}</span>
            <span class="blog-read">${a.readTime||"5 Min Read"}</span>
          </div>
          <h3 class="blog-title">${a.title}</h3>
          <p class="blog-excerpt">${a.excerpt}</p>
          <a href="./blog-post.html?slug=${a.slug.current||a.slug}" class="btn-text">Read Article →</a>
        `,e.appendChild(o)})}catch(n){console.error("Error loading homepage insights:",n)}}O()});
