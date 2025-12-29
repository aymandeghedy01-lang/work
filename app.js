
const state = { lang: localStorage.getItem('lang') || 'en' };

function setActiveNav(){
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = (a.getAttribute('href') || '').toLowerCase();
    a.classList.toggle('active', href === path);
  });
}

function setLang(lang){
  state.lang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = (lang === 'ar') ? 'ar' : 'en';
  document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const value = (window.I18N?.[lang]?.[key]) || '';
    if(value !== '') el.innerHTML = value;
  });
}

function openModal(title, src, type){
  const modal = document.getElementById('modal');
  if(!modal) return;
  const body = modal.querySelector('.modal-body');
  modal.querySelector('#modalTitle').textContent = title || 'Video';
  body.innerHTML = '';

  if(type === 'video'){
    const v = document.createElement('video');
    v.controls = true;
    v.playsInline = true;
    v.src = src;
    body.appendChild(v);
    v.play().catch(()=>{});
  } else {
    const f = document.createElement('iframe');
    f.src = src;
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.frameBorder = '0';
    body.appendChild(f);
  }
  modal.classList.add('open');
}

function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.classList.remove('open');
  modal.querySelector('.modal-body').innerHTML = '';
}

document.addEventListener('click', (e)=>{
  const langToggle = e.target.closest('#langToggle');
  if(langToggle){ setLang(state.lang === 'en' ? 'ar' : 'en'); return; }

  const play = e.target.closest('[data-play]');
  if(play){ openModal(play.dataset.title, play.dataset.src, play.dataset.type || 'video'); return; }

  if(e.target.matches('#modal, #closeModal') || e.target.closest('#closeModal')) closeModal();
});

window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });
window.addEventListener('DOMContentLoaded', ()=>{
  setActiveNav();
  setLang(state.lang);
});
