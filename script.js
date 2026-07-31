document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
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
    // 同時觀察 fade-in 與 timeline-item
    document.querySelectorAll('.fade-in, .timeline-item').forEach(el => observer.observe(el));

    // 4. Hero Background Slideshow (自動化讀取)
    const heroSlideContainer = document.querySelector('.hero-slideshow');
    
    if (heroSlideContainer) {
        fetch('background-image/_manifest.txt')
            .then(response => response.text())
            .then(text => {
                const images = text.split('\n').map(line => line.trim()).filter(line => line !== '');
                
                if (images.length > 0) {
                    let currentIndex = 0;
                    images.forEach((imgName, index) => {
                        const imgDiv = document.createElement('div');
                        imgDiv.style.backgroundImage = `url('background-image/${imgName}')`;
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
            })
            .catch(error => console.error('Error loading background images:', error));
    }

    // 5. Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(navLinks.classList.contains('active')));
        });
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 6. Back to Top
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        });
    }
    
    // 7. PDF Modal
    const viewPdfBtn = document.getElementById('view-profile-btn');
    const viewEsgBtn = document.getElementById('view-esg-btn'); 
    const pdfModal = document.getElementById('pdf-modal');
    const closePdfBtn = document.getElementById('pdf-close-btn');
    const pdfIframe = document.getElementById('pdf-iframe');
    
    const profileUrl = 'Company Profile 20251106.pdf';
    const esgUrl = 'net-zero-plan/1.5C_Climate_Ambition.pdf';

    if (pdfModal && closePdfBtn && pdfIframe) {
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
                pdfIframe.src = ''; 
                document.body.style.overflow = ''; 
            }, 300);
        });
        
        pdfModal.addEventListener('click', (e) => {
            if (e.target === pdfModal) {
                closePdfBtn.click();
            }
        });
    }

    // 8. Multi-language Switching Logic
    const langSwitchBtn = document.getElementById('lang-switch-btn');
    const setLanguage = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('gaushyang_lang', lang);
        if (langSwitchBtn) {
            langSwitchBtn.textContent = lang === 'zh' ? 'EN' : '繁中';
        }
    };

    // 初始化語言：優先讀取暫存，其次偵測瀏覽器語言，預設為英文
    const savedLang = localStorage.getItem('gaushyang_lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        setLanguage(browserLang.startsWith('zh') ? 'zh' : 'en');
    }

    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const currentLang = document.documentElement.getAttribute('lang') || 'en';
            const nextLang = currentLang === 'zh' ? 'en' : 'zh';
            setLanguage(nextLang);
        });
    }

    // 9. Animated Statistics Counter Logic (加分項目一)
    const stats = document.querySelectorAll('.stat-num');
    const animateDuration = 2000; // 動畫總時長 2000 毫秒

    const startCounting = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isFloat = target % 1 !== 0; // 是否為浮點數 (如 99.9)
        
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / animateDuration, 1);
            
            // 使用 Ease-out 緩動函數，讓數字滾動到後面時減速，看起來更自然
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = easeProgress * target;

            if (isFloat) {
                el.textContent = currentValue.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(currentValue).toLocaleString() + suffix;
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // 確保最後數值完全精準
                if (isFloat) {
                    el.textContent = target.toFixed(1) + suffix;
                } else {
                    el.textContent = Math.floor(target).toLocaleString() + suffix;
                }
            }
        };

        window.requestAnimationFrame(step);
    };

    const statsObserverOptions = { threshold: 0.3 };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (!el.classList.contains('animated')) {
                    el.classList.add('animated');
                    startCounting(el);
                }
            }
        });
    }, statsObserverOptions);

    stats.forEach(el => statsObserver.observe(el));

    // 10. 頁尾年份
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

        // 11. Hero Slogan Rotator Logic (標語自動切換翻轉)
        const slogans = document.querySelectorAll('.slogan-item');
        if (slogans.length > 0) {
        let currentSloganIndex = 0;
        const rotateSlogan = () => {
            const currentSlogan = slogans[currentSloganIndex];

            // 1. 將當前標語設為離開狀態 (向下隱藏)
            currentSlogan.classList.remove('active');
            currentSlogan.classList.add('exit');

            // 2. 計算下一個標語索引
            currentSloganIndex = (currentSloganIndex + 1) % slogans.length;
            const nextSlogan = slogans[currentSloganIndex];

            // 3. 將下一個標語設為進入狀態 (從上方滑入)
            nextSlogan.classList.remove('exit');
            nextSlogan.classList.add('active');

            // 4. 等待動畫完成後，移除舊標語的 exit 類別，為下次循環做準備
            setTimeout(() => {
                currentSlogan.classList.remove('exit');
            }, 800); // 此時間需與 CSS 中的 transition 0.8s 保持一致
        };

        // 設定自動切換間隔 (例如 4 秒)
        setInterval(rotateSlogan, 4000);
        }

    // 12. Scroll Spy (導覽列追蹤標記) - 優化版
    const navLinksList = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    const scrollSpyOptions = {
        threshold: 0, // 只要有一點點進入範圍就觸發
        rootMargin: "-45% 0px -45% 0px" // 以螢幕水平中心線為基準感應
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // 清除所有 active 並根據當前 ID 亮起對應項目
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => scrollSpyObserver.observe(section));

    // 當捲動回到最頂端時，手動清除所有亮起狀態（回到 Hero 區）
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navLinksList.forEach(link => link.classList.remove('active'));
        }
    });
        });
