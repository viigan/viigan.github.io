/* =========================
   Safe, mobile-ready JS
   ========================= */

/* ===== SWIPER: init only if present ===== */
(function initSwipers(){
    // guard if Swiper lib is missing
    if (typeof window.Swiper === "undefined") return;

    // HERO (needs markup: <div class="swiper hero-swiper">…</div>)
    const heroEl = document.querySelector(".hero-swiper");
    if (heroEl) {
        try {
            new Swiper(heroEl, {
                effect: "fade",
                speed: 1000,
                autoplay: { delay: 3800, disableOnInteraction: false },
                loop: true
            });
        } catch(e){ console.warn("Hero Swiper failed:", e); }
    }

    // SERVICES (needs markup: .services-swiper and .srv-prev/.srv-next)
    const servicesEl = document.querySelector(".services-swiper");
    if (servicesEl) {
        try {
            new Swiper(servicesEl, {
                slidesPerView: 1.1,
                spaceBetween: 16,
                loop: true,
                autoplay: { delay: 4800 },
                breakpoints: {
                    720: { slidesPerView: 2 },
                    1080:{ slidesPerView: 3 }
                },
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: {
                    nextEl: ".srv-next",
                    prevEl: ".srv-prev"
                }
            });
        } catch(e){ console.warn("Services Swiper failed:", e); }
    }
})();

/* ===== Fade transition on (optional) language switch ===== */
(function initLangFade(){
    const links = document.querySelectorAll(".lang-switch a");
    if (!links.length) return;
    links.forEach(link=>{
        link.addEventListener("click", e=>{
            if (link.classList.contains("active")) return;
            e.preventDefault();
            document.body.style.transition = "opacity 0.8s ease";
            document.body.style.opacity = "0";
            setTimeout(()=>{ window.location.href = link.getAttribute("href"); }, 800);
        });
    });
})();

/* ===== GALLERY (paged, keys + touch) ===== */
(function initGallery(){
    const IMAGES = [
        "images/IMG-20251105-WA0287.jpg",
        "images/IMG-20251105-WA0289.jpg",
        "images/IMG-20251105-WA0291.jpg",
        "images/IMG-20251105-WA0293.jpg",
        "images/IMG-20251105-WA0294.jpg",
        "images/IMG-20251105-WA0296.jpg",
        "images/IMG-20251105-WA0298.jpg",
        "images/IMG-20251105-WA0301.jpg",
        "images/IMG-20251105-WA0303.jpg",
        "images/IMG-20251105-WA0304.jpg",
        "images/IMG-20251105-WA0305.jpg",
        "images/IMG-20251105-WA0306.jpg",
        "images/IMG-20251105-WA0308.jpg",
        "images/IMG-20251105-WA0312.jpg",
        "images/IMG-20251105-WA0313.jpg",
        "images/IMG-20251105-WA0314.jpg",
        "images/IMG-20251105-WA0315.jpg",
        "images/IMG-20251105-WA0316.jpg",
        "images/IMG-20251105-WA0317.jpg",
        "images/IMG-20251105-WA0319.jpg",
        "images/IMG-20251105-WA0321.jpg",
        "images/IMG-20251105-WA0322.jpg",
        "images/IMG-20251105-WA0324.jpg",
        "images/IMG-20251105-WA0326.jpg",
        "images/IMG-20251105-WA0327.jpg",
        "images/IMG-20251105-WA0329.jpg",
        "images/IMG-20251105-WA0331.jpg",
        "images/IMG-20251105-WA0332.jpg",
        "images/IMG-20251105-WA0333.jpg",
        "images/IMG-20251105-WA0338.jpg",
        "images/IMG-20251105-WA0339.jpg",
        "images/IMG-20251105-WA0341.jpg",
        "images/IMG-20251105-WA0342.jpg"
    ];

    const PAGE_SIZE = 6;
    const grid     = document.getElementById("galleryGrid");
    const statusEl = document.getElementById("galleryStatus");
    const prevBtn  = document.getElementById("prevBtn");
    const nextBtn  = document.getElementById("nextBtn");

    if (!grid || !statusEl || !prevBtn || !nextBtn) return;

    if (!IMAGES.length){
        grid.innerHTML = "";
        statusEl.textContent = "No images yet";
        prevBtn.disabled = true; nextBtn.disabled = true;
        return;
    }

    let page = 0;
    const totalPages = Math.max(1, Math.ceil(IMAGES.length / PAGE_SIZE));

    function render(){
        const start = (page * PAGE_SIZE) % IMAGES.length;
        const items = [];
        for (let i = 0; i < PAGE_SIZE; i++){
            const idx = (start + i) % IMAGES.length;
            items.push(IMAGES[idx]);
        }
        grid.innerHTML = items.map(src => `
      <figure class="tile">
        <img src="${src}" alt="" loading="lazy" decoding="async">
      </figure>
    `).join("");

        statusEl.textContent = `${(page % totalPages) + 1} / ${totalPages}`;
        prevBtn.disabled = totalPages <= 1;
        nextBtn.disabled = totalPages <= 1;
    }

    nextBtn.addEventListener("click", () => { page = (page + 1) % totalPages; render(); });
    prevBtn.addEventListener("click", () => { page = (page - 1 + totalPages) % totalPages; render(); });

    // Keyboard arrows (only when gallery is in view)
    window.addEventListener("keydown", (e)=>{
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "ArrowLeft")  prevBtn.click();
    });

    // Basic mobile swipe
    let startX = null;
    grid.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, {passive:true});
    grid.addEventListener("touchend", e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) (dx < 0 ? nextBtn : prevBtn).click();
        startX = null;
    }, {passive:true});

    render();
})();
// ===== MOBILE NAV: burger + slide menu + language =====
(function () {
    const burger  = document.querySelector('.m-burger');
    const menu    = document.getElementById('mNav');
    const back    = document.querySelector('.m-backdrop');
    const lang    = document.querySelector('.m-lang');
    const langBtn = document.querySelector('.m-lang-btn');

    if (!burger || !menu) return; // safety

    function setMenu(open) {
        // toggle X on burger
        burger.classList.toggle('is-open', open);
        // open/close panel
        menu.classList.toggle('open', open);

        // backdrop + body lock
        if (back) back.hidden = !open;
        document.body.classList.toggle('m-locked', open);

        // aria
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function toggleMenu() {
        const open = !menu.classList.contains('open');
        setMenu(open);
    }

    // click burger
    burger.addEventListener('click', toggleMenu);

    // close when clicking any link in the mobile menu
    menu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') setMenu(false);
    });

    // close on backdrop click
    if (back) {
        back.addEventListener('click', () => setMenu(false));
    }

    // close on ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });

    // language dropdown for mobile
    if (langBtn && lang) {
        langBtn.addEventListener('click', () => {
            const open = !lang.classList.contains('open');
            lang.classList.toggle('open', open);
            langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        document.addEventListener('click', (e) => {
            if (!lang.contains(e.target)) {
                lang.classList.remove('open');
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
})();

    document.addEventListener('DOMContentLoaded', function () {
    const mSwitcher = document.querySelector('.lang-switcher-mobile');
    const mToggle = document.querySelector('.lang-toggle-mobile');
    const itMobile = document.getElementById('m-lang-it');
    const enMobile = document.getElementById('m-lang-en');

    if (!mSwitcher || !mToggle || !itMobile || !enMobile) return;

    // Toggle dropdown on globe click (mobile)
    mToggle.addEventListener('click', function () {
    const isOpen = mSwitcher.classList.toggle('open');
    mToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

    // Close when clicking outside
    document.addEventListener('click', function (e) {
    if (!mSwitcher.contains(e.target)) {
    mSwitcher.classList.remove('open');
    mToggle.setAttribute('aria-expanded', 'false');
}
});

    // Detect current page and set active + target
    const path = window.location.pathname;

    if (path.includes('index-en')) {
    // currently EN page
    enMobile.classList.add('active');
    enMobile.href = '#';             // stay on this page
    itMobile.href = 'index.html';    // switch to IT
} else {
    // default IT page
    itMobile.classList.add('active');
    itMobile.href = '#';             // stay here
    enMobile.href = 'index-en.html'; // switch to EN
}
});



