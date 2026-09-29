(()=>{const d=document,r=d.documentElement,S={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const th=S.get('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');r.dataset.theme=th;
const setTheme=t=>{r.dataset.theme=t;const b=d.getElementById('theme');if(b){b.textContent=t==='dark'?'☀':'☾';b.setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme')}};
const setLang=l=>{r.lang=l;d.querySelectorAll('[data-bn]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.innerHTML;e.innerHTML=l==='bn'?e.dataset.bn:e.dataset.en});const b=d.getElementById('lang');if(b)b.textContent=l==='bn'?'EN':'বাংলা';if(l==='bn'&&d.body.dataset.titleBn)d.title=d.body.dataset.titleBn;else if(d.body.dataset.titleEn)d.title=d.body.dataset.titleEn};
d.addEventListener('DOMContentLoaded',()=>{d.body.dataset.titleEn=d.title;setTheme(th);setLang(S.get('lang')||'en');
d.getElementById('theme')?.addEventListener('click',()=>{const t=r.dataset.theme==='dark'?'light':'dark';S.set('theme',t);setTheme(t)});
d.getElementById('lang')?.addEventListener('click',()=>{const l=r.lang==='bn'?'en':'bn';S.set('lang',l);setLang(l)});
const m=d.getElementById('menu'),n=d.getElementById('nav'),close=()=>{n.classList.remove('open');m.setAttribute('aria-expanded','false')};
if(m){m.addEventListener('click',()=>{m.setAttribute('aria-expanded',n.classList.toggle('open'))});n.addEventListener('click',e=>{if(e.target.closest('a'))close()});d.addEventListener('keydown',e=>{if(e.key==='Escape')close()})}
const y=d.getElementById('year');if(y)y.textContent=new Date().getFullYear();
const els=d.querySelectorAll('.rv');if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');o.unobserve(e.target)}}),{threshold:.1});els.forEach(e=>o.observe(e))}else els.forEach(e=>e.classList.add('on'))})})();
