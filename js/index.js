/* ===== Swiper Setup ===== */
const heroSwiper = new Swiper('.hero-swiper', {
    effect: 'fade',
    speed: 1000,
    autoplay: { delay: 3800, disableOnInteraction: false },
    loop: true
});

const servicesSwiper = new Swiper('.services-swiper', {
    slidesPerView: 1.1,
    spaceBetween: 16,
    loop: true,
    autoplay: { delay: 4800 },
    breakpoints: {
        720: { slidesPerView: 2 },
        1080: { slidesPerView: 3 }
    },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
        nextEl: '.srv-next',
        prevEl: '.srv-prev'
    }
});

/* ===== Fade Transition on Language Switch ===== */
document.querySelectorAll('.lang-switch a').forEach(link => {
    link.addEventListener('click', e => {
        if (link.classList.contains('active')) return; // already active
        e.preventDefault();
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = link.getAttribute('href');
        }, 1000);
    });
});



// IMAGES

// ===== Config: put your image paths here =====
const IMAGES = [
    "images/IMG-20251105-WA0287.jpg",
    // "images/IMG-20251105-WA0288.jpg",
    "images/IMG-20251105-WA0289.jpg",
    // "images/IMG-20251105-WA0290.jpg",
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
    // "images/IMG-20251105-WA0323.jpg",
    "images/IMG-20251105-WA0324.jpg",
    "images/IMG-20251105-WA0326.jpg",
    "images/IMG-20251105-WA0327.jpg",
    // "images/IMG-20251105-WA0328.jpg",
    "images/IMG-20251105-WA0329.jpg",
    // "images/IMG-20251105-WA0330.jpg",
    "images/IMG-20251105-WA0331.jpg",
    "images/IMG-20251105-WA0332.jpg",
    "images/IMG-20251105-WA0333.jpg",
    "images/IMG-20251105-WA0338.jpg",
    "images/IMG-20251105-WA0339.jpg",
    "images/IMG-20251105-WA0341.jpg",
    "images/IMG-20251105-WA0342.jpg"

    // add more as needed
];

const PAGE_SIZE = 6;                   // 6 per page
let page = 0;                          // 0-based index
const totalPages = Math.max(1, Math.ceil(IMAGES.length / PAGE_SIZE));

const grid = document.getElementById('galleryGrid');
const statusEl = document.getElementById('galleryStatus');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function render(){
    // loop through images so you can keep paging
    const start = (page * PAGE_SIZE) % IMAGES.length;
    const items = [];
    for (let i = 0; i < PAGE_SIZE; i++){
        const idx = (start + i) % IMAGES.length;
        items.push(IMAGES[idx]);
    }

    grid.innerHTML = items.map(src => `
    <figure class="tile">
      <img src="${src}" alt="" loading="lazy">
    </figure>
  `).join('');

    statusEl.textContent = `${(page % totalPages) + 1} / ${totalPages}`;
}

nextBtn.addEventListener('click', () => {
    page = (page + 1) % totalPages;
    render();
});
prevBtn.addEventListener('click', () => {
    page = (page - 1 + totalPages) % totalPages;
    render();
});

// Keyboard arrows
window.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft')  prevBtn.click();
});

// Basic mobile swipe
let startX = null;
grid.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
grid.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? nextBtn : prevBtn).click();
    startX = null;
});

// Initial render
render();


