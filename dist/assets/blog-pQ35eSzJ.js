import{f as E}from"./sanity-DQ0LG-a8.js";document.addEventListener("DOMContentLoaded",async()=>{const s=document.getElementById("blog-posts-grid"),g=document.getElementById("blog-loading-grid"),i=document.getElementById("blog-empty-state"),o=document.getElementById("blog-search-input"),m=document.getElementById("reset-blog-filters"),u=document.getElementById("category-pills-container"),n=document.getElementById("mobile-toggle"),h=document.querySelector(".nav-menu");n&&h&&n.addEventListener("click",()=>{n.classList.toggle("active"),h.classList.toggle("active")});let v=[],r="All",l="";async function L(){g.classList.remove("hidden"),s.classList.add("hidden"),i.classList.add("hidden");try{v=await E(`*[_type == "post"] | order(publishedAt desc) {
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
      }`)}catch(t){console.error("Failed to load blog posts:",t)}setTimeout(()=>{g.classList.add("hidden"),s.classList.remove("hidden"),c()},600)}function c(){const t=v.filter(e=>{const a=r==="All"||e.category===r,d=e.title.toLowerCase().includes(l.toLowerCase())||e.excerpt.toLowerCase().includes(l.toLowerCase())||e.category.toLowerCase().includes(l.toLowerCase())||e.author&&e.author.name.toLowerCase().includes(l.toLowerCase());return a&&d});if(s.innerHTML="",t.length===0){i.classList.remove("hidden"),s.classList.add("hidden");return}i.classList.add("hidden"),s.classList.remove("hidden"),t.forEach(e=>{const a=document.createElement("article");a.className="glass-card blog-card reveal-card active";const d={year:"numeric",month:"long",day:"numeric"},b=new Date(e.publishedAt).toLocaleDateString("en-US",d),f=e.mainImage||"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800&h=450",p=e.author&&e.author.avatar||"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120",y=e.author&&e.author.name||"Katalyst Analyst";a.innerHTML=`
        <div class="blog-card-image-wrapper">
          <img src="${f}" alt="${e.title}" class="blog-card-image" loading="lazy">
          <span class="blog-card-tag">${e.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <span class="blog-date">${b}</span>
            <span class="blog-read">${e.readTime||"5 Min Read"}</span>
          </div>
          <h3 class="blog-title">${e.title}</h3>
          <p class="blog-excerpt">${e.excerpt}</p>
          <div class="blog-card-author-footer">
            <div class="blog-author-info">
              <img src="${p}" alt="${y}" class="author-avatar-img">
              <div>
                <strong class="author-name-text">${y}</strong>
                <span class="author-role-text">${e.author&&e.author.role||"Advisory Team"}</span>
              </div>
            </div>
            <a href="./blog-post.html?slug=${e.slug.current||e.slug}" class="btn-text">Read Article →</a>
          </div>
        </div>
      `,s.appendChild(a)})}o&&o.addEventListener("input",t=>{l=t.target.value,c()}),u&&u.addEventListener("click",t=>{const e=t.target.closest(".pill");e&&(document.querySelectorAll(".pill").forEach(a=>a.classList.remove("active")),e.classList.add("active"),r=e.getAttribute("data-category"),c())}),m&&m.addEventListener("click",()=>{o&&(o.value=""),l="",r="All",document.querySelectorAll(".pill").forEach(t=>{t.getAttribute("data-category")==="All"?t.classList.add("active"):t.classList.remove("active")}),c()}),await L()});
