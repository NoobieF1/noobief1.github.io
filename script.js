// 0. F12 & DEVTOOLS DETECTOR TRIGGER FULLSOURCE
const f12Overlay = document.getElementById('f12-overlay');
const sourceCodeDisplay = document.getElementById('source-code-display');

function triggerFullSource() {
    if (!f12Overlay.classList.contains('active')) {
        sourceCodeDisplay.textContent = document.documentElement.outerHTML;
        f12Overlay.classList.add('active');
        document.body.classList.add('f12-active');
    }
}

function closeF12Overlay() {
    f12Overlay.classList.remove('active');
    document.body.classList.remove('f12-active');
}

window.addEventListener('keydown', (e) => {
    if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
    ) {
        e.preventDefault();
        triggerFullSource();
    }
});

const threshold = 160;
window.addEventListener('resize', () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
        triggerFullSource();
    }
});

// LOGIC CHUYỂN CHẾ ĐỘ SÁNG / TỐI VỚI HIỆU ỨNG TRƯỢT XOAY
const themeToggleBtn = document.getElementById('theme-toggle');
const themeBtnText = document.getElementById('theme-btn-text');
const themeIcon = document.getElementById('theme-icon');

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    // Kích hoạt class animation
    themeIcon.classList.remove('slide-anim');
    void themeIcon.offsetWidth; // Trigger reflow để reset animation
    themeIcon.classList.add('slide-anim');

    if (document.body.classList.contains('light-mode')) {
        themeBtnText.textContent = 'DARK';
        themeIcon.className = 'fa-solid fa-moon slide-anim';
    } else {
        themeBtnText.textContent = 'LIGHT';
        themeIcon.className = 'fa-solid fa-sun slide-anim';
    }
});

// 1. MOBILE DROPBAR TOGGLE LOGIC
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navItems = navLinks.querySelectorAll('a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// 2. SCI-FI DOOR PRELOADER LOGIC
let count = 0;
let isLoaded = false;
let loaderShown = false;

const loaderText = document.getElementById('loader-text');
const loaderBar = document.getElementById('loader-bar');
const loader = document.getElementById('loader');

const slowNetworkTimeout = setTimeout(() => {
    if (!isLoaded) {
        loaderShown = true;
        loader.classList.add('show');
        startLoadingAnimation();
    }
}, 500);

let interval;
function startLoadingAnimation() {
    interval = setInterval(() => {
        if (count < 60) {
            count += Math.floor(Math.random() * 3) + 1;
            updateUI(count);
        }
    }, 40);
}

function updateUI(val) {
    loaderText.innerText = (val < 10 ? '0' : '') + val + '%';
    loaderBar.style.width = val + '%';
}

window.addEventListener('load', () => {
    isLoaded = true;
    clearTimeout(slowNetworkTimeout);

    if (loaderShown) {
        clearInterval(interval);
        updateUI(67);
        setTimeout(() => {
            loader.classList.add('loaded');
            setTimeout(() => loader.remove(), 800);
        }, 300);
    } else {
        loader.remove();
    }
});

// 3. COUNTER ANIMATION FROM DATA-TARGET
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-num');
    
    statNumbers.forEach(numEl => {
        const target = +numEl.getAttribute('data-target');
        if (!target && target !== 0) return;

        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 40));
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                numEl.innerText = formatNumber(target);
                clearInterval(timer);
            } else {
                numEl.innerText = formatNumber(current);
            }
        }, 30);
    });
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}

// 4. SCROLL REVEAL OBSERVER
const revealElements = document.querySelectorAll('.reveal');
let countersAnimated = false;

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            if (entry.target.closest('#stats') && !countersAnimated) {
                countersAnimated = true;
                initCounters();
            }
        }
    });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// 5. PARTICLES TRAIL SYSTEM
const canvas = document.getElementById('canvas-particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const mouse = { x: null, y: null, speed: 0 };
let lastMouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, vx, vy, size, color) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.size = size; this.color = color; this.alpha = 1;
        this.decay = 0.02 + Math.random() * 0.02;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.alpha -= this.decay;
        if (this.size > 0.1) this.size -= 0.02;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    const dx = mouse.x - lastMouse.x;
    const dy = mouse.y - lastMouse.y;
    mouse.speed = Math.sqrt(dx*dx + dy*dy);

    if (mouse.speed > 2) {
        for (let i = 0; i < Math.min(mouse.speed / 4, 8); i++) {
            const vx = (Math.random() - 0.5) * 2 - (dx * 0.1);
            const vy = (Math.random() - 0.5) * 2 - (dy * 0.1);
            const size = Math.random() * 3 + 1;
            
            const isLight = document.body.classList.contains('light-mode');
            const primaryColor = isLight ? '#000000' : '#ffffff';
            const color = Math.random() > 0.3 ? '#0000fe' : primaryColor;

            particlesArray.push(new Particle(e.clientX, e.clientY, vx, vy, size, color));
        }
    }
    lastMouse = { x: e.clientX, y: e.clientY };
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].alpha <= 0 || particlesArray[i].size <= 0) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 6. DOUBLE RING NEON CURSOR
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let dotX = 0, dotY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
    dotX = e.clientX; dotY = e.clientY;
});

function updateCursor() {
    if (dot && ring) {
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        ringX += (dotX - ringX) * 0.15;
        ringY += (dotY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursor);
}
updateCursor();

document.querySelectorAll('a, .card, button').forEach((target) => {
    target.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    target.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// 7. 3D CARD TILT EFFECT
const cards = document.querySelectorAll('.card');
cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((centerY - y) / centerY) * 12; 
        const rotateY = ((x - centerX) / centerX) * 12;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
});
