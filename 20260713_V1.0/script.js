document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => { preloader.classList.add('hidden'); }, 800);
    });

    // 2. Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            touchMultiplier: 2,
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    // 3. Fade-in Animation
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 4. Hero Background Slideshow
    const heroSlideContainer = document.querySelector('.hero-slideshow');
    const images = [
        'background-image/cape of good hope.png',
        'background-image/dadu road.png',
        'background-image/special zone.png',
        'background-image/new banqiao.png'
    ];
    if (heroSlideContainer && images.length > 0) {
        let currentIndex = 0;
        images.forEach((imgSrc, index) => {
            const imgDiv = document.createElement('div');
            imgDiv.style.backgroundImage = `url('${imgSrc}')`;
            imgDiv.style.position = 'absolute';
            imgDiv.style.top = '0'; imgDiv.style.left = '0';
            imgDiv.style.width = '100%'; imgDiv.style.height = '100%';
            imgDiv.style.backgroundSize = 'cover'; imgDiv.style.backgroundPosition = 'center';
            imgDiv.style.opacity = index === 0 ? '1' : '0';
            imgDiv.style.transition = 'opacity 2s ease-in-out';
            imgDiv.style.zIndex = '-2';
            heroSlideContainer.appendChild(imgDiv);
        });
        const slides = heroSlideContainer.children;
        setInterval(() => {
            slides[currentIndex].style.opacity = '0';
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].style.opacity = '1';
        }, 5000);
    }

    // 5. Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // 6. Back to Top
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    });
    
    // 7. PDF Modal
    const viewPdfBtn = document.getElementById('view-profile-btn');
    const viewEsgBtn = document.getElementById('view-esg-btn'); // 新增 ESG 按鈕監聽
    const pdfModal = document.getElementById('pdf-modal');
    const closePdfBtn = document.getElementById('pdf-close-btn');
    const pdfIframe = document.getElementById('pdf-iframe');
    
    const profileUrl = 'Company Profile 20251106.pdf';
    const esgUrl = '1.5℃ Climate Ambition_Net Zero Emission plan-Gau Shyang/1.5C_Climate_Ambition.pdf';

    if (pdfModal) {
        const openModal = (url) => {
            pdfIframe.src = url;
            pdfModal.style.display = 'flex';
            setTimeout(() => pdfModal.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        };

        if (viewPdfBtn) {
            viewPdfBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(profileUrl);
            });
        }

        if (viewEsgBtn) {
            viewEsgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(esgUrl);
            });
        }
        
        closePdfBtn.addEventListener('click', () => {
            pdfModal.style.opacity = '0';
            setTimeout(() => {
                pdfModal.style.display = 'none';
                pdfIframe.src = ''; // 關閉時清空，避免下次打開時閃爍舊內容
                document.body.style.overflow = ''; 
            }, 300);
        });
        
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closePdfBtn.click();
            }
        });
    }
});