(()=>{const d=document,r=d.documentElement,S={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const th='dark';r.dataset.theme=th;
const setTheme=t=>{r.dataset.theme='dark';const b=d.getElementById('theme');if(b){b.textContent='☀';b.setAttribute('aria-label','Dark Theme Active')}};
const setLang=l=>{r.lang=l;d.querySelectorAll('[data-bn]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.innerHTML;e.innerHTML=l==='bn'?e.dataset.bn:e.dataset.en});const b=d.getElementById('lang');if(b)b.textContent=l==='bn'?'EN':'বাংলা';if(l==='bn'&&d.body.dataset.titleBn)d.title=d.body.dataset.titleBn;else if(d.body.dataset.titleEn)d.title=d.body.dataset.titleEn};

d.addEventListener('DOMContentLoaded',()=>{
d.body.dataset.titleEn=d.title;setTheme('dark');setLang(S.get('lang')||'en');

// What's New Video Modal Logic
const wnBtn = d.getElementById('whatsNewBtn');
const wnModal = d.getElementById('whatsNewModal');
const closeModalBtn = d.getElementById('closeModalBtn');
const modalOkBtn = d.getElementById('modalOkBtn');
const skipVideoBtn = d.getElementById('skipVideoBtn');
const videoContainer = d.getElementById('videoContainer');
const highlightsContainer = d.getElementById('highlightsContainer');
const videoElem = d.getElementById('whatsNewVideo');

const showHighlights = () => {
    if(videoContainer) videoContainer.classList.add('hidden-content');
    if(highlightsContainer) highlightsContainer.classList.remove('hidden-content');
    if(videoElem) videoElem.pause();
};

const openModal = () => { 
    if(wnModal) {
        wnModal.classList.add('active');
        if(videoContainer && highlightsContainer && videoElem) {
            videoContainer.classList.remove('hidden-content');
            highlightsContainer.classList.add('hidden-content');
            videoElem.currentTime = 0;
            videoElem.play().catch(err => {
                // Autoplay blocked handling: show highlights directly if video fails
                showHighlights();
            });
        }
    }
};

const closeModal = () => { 
    if(wnModal) wnModal.classList.remove('active'); 
    if(videoElem) videoElem.pause();
};

if(videoElem) {
    videoElem.addEventListener('ended', showHighlights);
}

if(wnBtn) wnBtn.addEventListener('click', openModal);
if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(modalOkBtn) modalOkBtn.addEventListener('click', closeModal);
if(skipVideoBtn) skipVideoBtn.addEventListener('click', showHighlights);
if(wnModal) wnModal.addEventListener('click', e => { if(e.target === wnModal) closeModal(); });
d.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

d.getElementById('theme')?.addEventListener('click',()=>{/* Theme locked to dark New Moon theme */});
d.getElementById('lang')?.addEventListener('click',()=>{const l=r.lang==='bn'?'en':'bn';S.set('lang',l);setLang(l)});
const m=d.getElementById('menu'),n=d.getElementById('nav'),closeNav=()=>{n.classList.remove('open');m.setAttribute('aria-expanded','false')};
if(m){m.addEventListener('click',()=>{m.setAttribute('aria-expanded',n.classList.toggle('open'))});n.addEventListener('click',e=>{if(e.target.closest('a'))closeNav()});}
const y=d.getElementById('year');if(y)y.textContent=new Date().getFullYear();
const els=d.querySelectorAll('.rv');if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion:reduce)')) {
    const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');o.unobserve(e.target)}}),{threshold:.1});
    els.forEach(e=>o.observe(e));
} else {
    els.forEach(e=>e.classList.add('on'));
}
})})();
