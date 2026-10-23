(()=>{const d=document,r=d.documentElement,S={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const th='dark';r.dataset.theme=th;
const setTheme=t=>{r.dataset.theme='dark';const b=d.getElementById('theme');if(b){b.textContent='☀';b.setAttribute('aria-label','Dark Theme Active')}};
const setLang=l=>{r.lang=l;d.querySelectorAll('[data-bn]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.innerHTML;e.innerHTML=l==='bn'?e.dataset.bn:e.dataset.en});const b=d.getElementById('lang');if(b)b.textContent=l==='bn'?'EN':'বাংলা';if(l==='bn'&&d.body.dataset.titleBn)d.title=d.body.dataset.titleBn;else if(d.body.dataset.titleEn)d.title=d.body.dataset.titleEn};

d.addEventListener('DOMContentLoaded',()=>{
d.body.dataset.titleEn=d.title;setTheme('dark');setLang(S.get('lang')||'en');

// Page Load Intro Moon Night Animation with Moon flying into What's New Button
const introOverlay = d.getElementById('introAnimOverlay');
const skipIntroBtn = d.getElementById('skipIntroBtn');
const introCanvas = d.getElementById('introCanvas');
const wnBtn = d.getElementById('whatsNewBtn');

let introAnimId = null;

const runIntroAnim = () => {
    if(!introCanvas) return;
    const ctx = introCanvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    introCanvas.width = width * window.devicePixelRatio;
    introCanvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let time = 0;
    const bats = [
        {x: -60, y: height * 0.3, speed: 2, size: 14, flap: 0},
        {x: -160, y: height * 0.25, speed: 1.6, size: 10, flap: 1.5},
        {x: -250, y: height * 0.35, speed: 2.3, size: 18, flap: 0.8}
    ];

    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        // Background night sky
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, '#040b12');
        bg.addColorStop(1, '#0b1a24');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        time += 0.016; // animation step

        // Moon trajectory phases:
        // Phase 1 (0 to 2s): Rise from bottom to center sky
        // Phase 2 (2s to 3.5s): Fly towards What's New button position
        
        const riseProgress = Math.min(time / 2.0, 1);
        const easeRise = 1 - Math.pow(1 - riseProgress, 3); // cubic ease out

        const startMoonY = height + 100;
        const centerMoonY = height * 0.35;
        const currentCenterY = startMoonY - (startMoonY - centerMoonY) * easeRise;
        const centerMoonX = width / 2;

        let finalMoonX = centerMoonX;
        let finalMoonY = currentCenterY;
        let currentRadius = Math.min(width, height) * 0.12;

        if (time > 2.2) {
            // Phase 2: fly into What's New button
            const flightProgress = Math.min((time - 2.2) / 1.0, 1);
            const easeFlight = flightProgress * flightProgress * (3 - 2 * flightProgress); // smoothstep

            // Get button bounding rect
            const btnRect = wnBtn ? wnBtn.getBoundingClientRect() : {left: 50, top: 150, width: 180, height: 45};
            const targetX = btnRect.left + btnRect.width / 2;
            const targetY = btnRect.top + btnRect.height / 2;

            finalMoonX = centerMoonX + (targetX - centerMoonX) * easeFlight;
            finalMoonY = currentCenterY + (targetY - currentCenterY) * easeFlight;
            currentRadius = currentRadius * (1 - easeFlight * 0.75); // shrink into button

            if (flightProgress >= 1) {
                // Animation complete, dismiss overlay
                if(introOverlay) introOverlay.classList.add('fade-out');
                if(wnBtn) {
                    wnBtn.classList.add('moon-merged-pop');
                    setTimeout(() => wnBtn.classList.remove('moon-merged-pop'), 800);
                }
                cancelAnimationFrame(introAnimId);
                return;
            }
        }

        // Moon Glow
        const glow = ctx.createRadialGradient(finalMoonX, finalMoonY, 10, finalMoonX, finalMoonY, currentRadius * 3);
        glow.addColorStop(0, 'rgba(253, 224, 71, 0.35)');
        glow.addColorStop(0.5, 'rgba(45, 212, 191, 0.15)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(finalMoonX, finalMoonY, currentRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Moon Body
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(finalMoonX, finalMoonY, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Moon Craters
        ctx.fillStyle = 'rgba(217, 180, 40, 0.35)';
        ctx.beginPath();
        ctx.arc(finalMoonX - currentRadius * 0.3, finalMoonY - currentRadius * 0.25, currentRadius * 0.2, 0, Math.PI * 2);
        ctx.arc(finalMoonX + currentRadius * 0.35, finalMoonY + currentRadius * 0.3, currentRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Winking / Blinking Animated Eyes on Moon
        const eyeTick = Date.now() * 0.003;
        const isBlinking = Math.sin(eyeTick * 2) > 0.85; 
        ctx.fillStyle = '#071018';
        if(!isBlinking) {
            ctx.beginPath();
            ctx.arc(finalMoonX - currentRadius * 0.32, finalMoonY - currentRadius * 0.1, currentRadius * 0.08, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = '#071018';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(finalMoonX - currentRadius * 0.32, finalMoonY - currentRadius * 0.1, currentRadius * 0.08, 0, Math.PI);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(finalMoonX + currentRadius * 0.32, finalMoonY - currentRadius * 0.1, currentRadius * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Smiling mouth
        ctx.strokeStyle = '#071018';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(finalMoonX, finalMoonY + currentRadius * 0.05, currentRadius * 0.25, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // 2. Dark Mountains rising from both sides
        const mountainRise = (1 - Math.min(riseProgress * 1.4, 1)) * 200;

        // Left Dark Mountain
        ctx.fillStyle = '#081622';
        ctx.beginPath();
        ctx.moveTo(-50 + mountainRise, height + 20);
        ctx.lineTo(width * 0.4, height * 0.45);
        ctx.lineTo(width * 0.65 + mountainRise, height + 20);
        ctx.closePath();
        ctx.fill();

        // Right Dark Mountain
        ctx.fillStyle = '#05101a';
        ctx.beginPath();
        ctx.moveTo(width + 50 - mountainRise, height + 20);
        ctx.lineTo(width * 0.65, height * 0.4);
        ctx.lineTo(width * 0.3 - mountainRise, height + 20);
        ctx.closePath();
        ctx.fill();

        // 3. Flocks of Birds / Bats flying across
        bats.forEach(bat => {
            bat.x += bat.speed;
            bat.flap += 0.2;
            if(bat.x > width + 100) bat.x = -120;

            const wy = bat.y + Math.sin(bat.flap) * 6;
            ctx.fillStyle = '#02070a';
            ctx.beginPath();
            ctx.moveTo(bat.x, bat.y);
            ctx.quadraticCurveTo(bat.x - bat.size, wy - bat.size, bat.x - bat.size * 2, wy);
            ctx.quadraticCurveTo(bat.x - bat.size, bat.y + 3, bat.x, bat.y + 6);
            ctx.quadraticCurveTo(bat.x + bat.size, bat.y + 3, bat.x + bat.size * 2, wy);
            ctx.quadraticCurveTo(bat.x + bat.size, wy - bat.size, bat.x, bat.y);
            ctx.closePath();
            ctx.fill();
        });

        introAnimId = requestAnimationFrame(animate);
    };

    animate();
};

const closeIntroOverlay = () => {
    if(introOverlay) {
        introOverlay.classList.add('fade-out');
        if(introAnimId) cancelAnimationFrame(introAnimId);
    }
};

if(skipIntroBtn) {
    skipIntroBtn.addEventListener('click', closeIntroOverlay);
}

// Run intro anim on load
window.addEventListener('load', () => {
    setTimeout(runIntroAnim, 200);
});

// What's New Video Modal Logic
const modalWnBtn = d.getElementById('whatsNewBtn');
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

if(modalWnBtn) modalWnBtn.addEventListener('click', openModal);
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
