document.addEventListener("DOMContentLoaded",()=>{
 const b=document.getElementById("menuBtn");
 if(b)b.addEventListener("click",openSidebar);
 const d=document.getElementById("todayDate");
 if(d)d.textContent=new Intl.DateTimeFormat("sw-TZ",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}).format(new Date());
 if(typeof initTicker === "function") initTicker();
});
function openSidebar(){document.getElementById("sideBar")?.classList.add("open");document.getElementById("sideOverlay")?.classList.add("show");document.body.classList.add("menu-open");}
function closeSidebar(){document.getElementById("sideBar")?.classList.remove("open");document.getElementById("sideOverlay")?.classList.remove("show");document.body.classList.remove("menu-open");}
function esc(v){return String(v).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]))}
function card(a,first=false){return `<a class="news-card ${first?'featured-news':''}" href="./article.html?id=${a.id}"><img src="${a.image}" alt="${esc(a.title)}"><div class="news-card-body"><span class="tag">${esc(a.category)}</span><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p><div class="meta">${esc(a.date)} · ${esc(a.author)}</div></div></a>`}
function initTicker(){const t=document.getElementById("tickerTrack");if(!t)return;const h=articles.slice(0,5).map(a=>`<a href="./article.html?id=${a.id}">• ${esc(a.title)}</a>`).join("");t.innerHTML=h+h}
