
async function loadVideos(){
  const res = await fetch('videos.json', {cache:'no-store'});
  const list = await res.json();

  const toPreview = (url) => {
    if(!url) return "";
    const m = url.match(/\/file\/d\/([^\/]+)\//);
    if(m && m[1]) return `https://drive.google.com/file/d/${m[1]}/preview`;
    const m2 = url.match(/[?&]id=([^&]+)/);
    if(m2 && m2[1]) return `https://drive.google.com/file/d/${m2[1]}/preview`;
    return url;
  };

  return list.map(v => ({...v, preview: toPreview(v.drive_view_link)}));
}

function getLang(){ return (localStorage.getItem('lang') || 'en') === 'ar' ? 'ar' : 'en'; }

function renderCards(videos){
  const wrap = document.getElementById('portfolioGrid');
  if(!wrap) return;
  const lang = getLang();

  wrap.innerHTML = videos.map((v, idx)=>{
    const title = (lang === 'ar') ? (v.title_ar || v.title_en) : (v.title_en || v.title_ar);
    const hasLink = !!v.preview;
    const badge = hasLink ? `#${String(idx+1).padStart(2,'0')}` : `ADD LINK`;

    const btn = hasLink
      ? `<button class="btn" data-play data-type="iframe" data-src="${v.preview}" data-title="${title}">Play</button>`
      : `<div class="small-note">Paste Drive link in videos.json</div>`;

    return `
      <article class="item" data-tags="all">
        <div class="thumb">
          <img src="${v.thumb || 'assets/img/hero-image.png'}" alt="${title}"/>
          <div class="play"><span>▶</span></div>
        </div>
        <div class="meta"><span>Project</span><span>${badge}</span></div>
        <h3 style="margin:0">${title}</h3>
        ${btn}
      </article>
    `;
  }).join('');
}

window.addEventListener('DOMContentLoaded', async ()=>{
  const vids = await loadVideos();
  renderCards(vids);

  document.addEventListener('click', (e)=>{
    if(e.target.closest('#langToggle')){
      setTimeout(async ()=>{
        const vids2 = await loadVideos();
        renderCards(vids2);
      }, 0);
    }
  });
});
