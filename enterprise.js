document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open');
  }));
  const hero = document.querySelector('.hero-media');
  const heroImages = ['background-image/dadu road.png', 'background-image/mrt tucheng.png', 'background-image/weiwuying.png'];
  let heroIndex = 0;
  if (hero) {
    hero.style.setProperty('--hero-image', `url("${heroImages[0]}")`);
    if (!reduceMotion) setInterval(() => {
      heroIndex = (heroIndex + 1) % heroImages.length;
      hero.style.setProperty('--hero-image', `url("${heroImages[heroIndex]}")`);
      hero.animate([{ opacity: .5 }, { opacity: 1 }], { duration: 900, easing: 'ease' });
    }, 6000);
  }

  const brandReveal = document.querySelector('.brand-reveal');
  let brandFrame = 0;
  const updateBrandReveal = () => {
    if (!brandReveal || reduceMotion) return;
    const rect = brandReveal.getBoundingClientRect();
    const distance = Math.max(1, brandReveal.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / distance));
    const eased = 1 - Math.pow(1 - progress, 3);
    const maskOpacity = Math.min(1, progress / .22);
    const wordScale = 1 + 27 * (1 - eased);
    const copyOpacity = Math.min(1, Math.max(0, (progress - .72) / .2));
    brandReveal.style.setProperty('--brand-mask-opacity', maskOpacity.toFixed(3));
    brandReveal.style.setProperty('--brand-word-scale', wordScale.toFixed(3));
    brandReveal.style.setProperty('--brand-copy-opacity', copyOpacity.toFixed(3));
    brandFrame = 0;
  };
  const requestBrandReveal = () => { if (!brandFrame) brandFrame = requestAnimationFrame(updateBrandReveal); };
  updateBrandReveal();
  window.addEventListener('scroll', requestBrandReveal, { passive: true });
  window.addEventListener('resize', requestBrandReveal, { passive: true });
  const brandVideo = brandReveal?.querySelector('.brand-reveal-video');
  if (brandVideo) {
    let brandVideoVisible = false;
    const syncBrandVideo = () => {
      if (!reduceMotion && brandVideoVisible && !document.hidden) {
        brandVideo.play().catch(() => {});
      } else {
        brandVideo.pause();
      }
    };
    brandVideo.pause();
    const brandVideoObserver = new IntersectionObserver(entries => {
      brandVideoVisible = entries[0].isIntersecting;
      syncBrandVideo();
    }, { rootMargin: '160px 0px', threshold: 0 });
    brandVideoObserver.observe(brandReveal);
    document.addEventListener('visibilitychange', syncBrandVideo);
  }
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion) reveals.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => observer.observe(el));
  }

  const waveCanvas = document.getElementById('contact-wave-canvas');
  const contactSection = document.getElementById('contact');
  if (waveCanvas && contactSection && !reduceMotion) {
    const context = waveCanvas.getContext('2d');
    let waveWidth = 0;
    let waveHeight = 0;
    let waveFrame = 0;
    let waveStart = 0;
    let lastWaveRender = 0;
    let wavesVisible = false;
    const waveFrameInterval = 1000 / 30;

    const resizeWaves = () => {
      const rect = contactSection.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1);
      waveWidth = Math.max(1, rect.width);
      waveHeight = Math.max(1, rect.height);
      waveCanvas.width = Math.round(waveWidth * ratio);
      waveCanvas.height = Math.round(waveHeight * ratio);
      waveCanvas.style.width = `${waveWidth}px`;
      waveCanvas.style.height = `${waveHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawWave = (time, config) => {
      const centerY = waveHeight * config.y;
      const gradient = context.createLinearGradient(0, 0, waveWidth, 0);
      gradient.addColorStop(0, 'rgba(0,163,224,0)');
      gradient.addColorStop(.24, config.color);
      gradient.addColorStop(.72, config.color);
      gradient.addColorStop(1, 'rgba(100,255,218,0)');
      context.beginPath();
      for (let x = -20; x <= waveWidth + 20; x += 7) {
        const progress = Math.min(1, Math.max(0, x / waveWidth));
        const envelope = Math.sin(Math.PI * progress);
        const primary = Math.sin(x * config.frequency + time * config.speed);
        const secondary = Math.sin(x * config.frequency * .42 - time * config.speed * .63);
        const y = centerY + (primary * .72 + secondary * .28) * config.amplitude * envelope;
        if (x === -20) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.strokeStyle = gradient;
      context.lineWidth = config.lineWidth;
      context.shadowColor = config.glow;
      context.shadowBlur = config.blur;
      context.stroke();
    };

    const drawWaveNodes = time => {
      const count = waveWidth < 768 ? 7 : 13;
      for (let index = 0; index < count; index += 1) {
        const progress = ((index / count) + ((time * .000025) % 1)) % 1;
        const x = progress * waveWidth;
        const y = waveHeight * .52 + Math.sin(progress * Math.PI * 4 + time * .00055) * waveHeight * .13;
        const radius = 2.2 + Math.sin(time * .002 + index) * .75;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(100,255,218,.95)';
        context.shadowColor = '#64ffda';
        context.shadowBlur = 8;
        context.fill();
      }
      context.shadowBlur = 0;
    };

    const drawParticleField = time => {
      const count = waveWidth < 768 ? 64 : 128;
      const bandDepth = waveHeight * .27;
      for (let index = 0; index < count; index += 1) {
        const seed = (index * .61803398875) % 1;
        const drift = (seed + time * (.000004 + (index % 5) * .0000004)) % 1;
        const x = drift * waveWidth;
        const spread = ((index * 37) % 101) / 100;
        const crest = Math.sin(drift * Math.PI * 5.2 + time * .00042 + index * .17);
        const secondary = Math.sin(drift * Math.PI * 13 - time * .00026 + index);
        const y = waveHeight * .72 + spread * bandDepth + crest * waveHeight * .055 + secondary * waveHeight * .018;
        const pulse = .45 + .55 * Math.sin(time * .0014 + index * .83);
        const radius = .7 + (index % 7) * .18 + pulse * .7;
        const alpha = .12 + (1 - spread) * .5 + pulse * .12;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = index % 4 === 0
          ? `rgba(155,107,255,${alpha * .72})`
          : `rgba(57,222,238,${alpha})`;
        context.fill();
      }
    };

    const renderWaves = timestamp => {
      if (!wavesVisible || document.hidden) {
        waveFrame = 0;
        return;
      }
      if (lastWaveRender && timestamp - lastWaveRender < waveFrameInterval) {
        waveFrame = requestAnimationFrame(renderWaves);
        return;
      }
      lastWaveRender = timestamp;
      if (!waveStart) waveStart = timestamp;
      const time = timestamp - waveStart;
      context.clearRect(0, 0, waveWidth, waveHeight);
      context.globalCompositeOperation = 'lighter';
      drawParticleField(time);
      drawWave(time, { y: .36, amplitude: waveHeight * .13, frequency: .010, speed: .0012, lineWidth: 1.8, color: 'rgba(0,183,255,.76)', glow: '#00b7ff', blur: 10 });
      drawWave(time, { y: .52, amplitude: waveHeight * .20, frequency: .014, speed: -.0010, lineWidth: 2.6, color: 'rgba(100,255,218,.84)', glow: '#64ffda', blur: 14 });
      drawWave(time, { y: .68, amplitude: waveHeight * .11, frequency: .019, speed: .00075, lineWidth: 1.5, color: 'rgba(91,137,255,.68)', glow: '#5b89ff', blur: 10 });
      drawWaveNodes(time);
      context.globalCompositeOperation = 'source-over';
      waveFrame = wavesVisible ? requestAnimationFrame(renderWaves) : 0;
    };

    const waveObserver = new IntersectionObserver(entries => {
      wavesVisible = entries[0].isIntersecting;
      if (wavesVisible && !document.hidden && !waveFrame) {
        lastWaveRender = 0;
        waveFrame = requestAnimationFrame(renderWaves);
      }
      if (!wavesVisible && waveFrame) { cancelAnimationFrame(waveFrame); waveFrame = 0; }
    }, { threshold: .05 });
    const syncWaveVisibility = () => {
      if (document.hidden && waveFrame) {
        cancelAnimationFrame(waveFrame);
        waveFrame = 0;
      } else if (!document.hidden && wavesVisible && !waveFrame) {
        lastWaveRender = 0;
        waveFrame = requestAnimationFrame(renderWaves);
      }
    };
    resizeWaves();
    waveObserver.observe(contactSection);
    window.addEventListener('resize', resizeWaves, { passive: true });
    document.addEventListener('visibilitychange', syncWaveVisibility);
  }

  const contactDialog = document.getElementById('contact-dialog');
  const contactDialogOpen = document.getElementById('contact-modal-open');
  const contactForm = document.getElementById('contact-request-form');
  const contactFormView = document.getElementById('contact-form-view');
  const contactReviewView = document.getElementById('contact-review-view');
  const contactReviewList = document.getElementById('contact-review-list');
  const contactReviewEdit = document.getElementById('contact-review-edit');
  const contactNetlifySubmit = document.getElementById('contact-netlify-submit');
  const contactSubmitStatus = document.getElementById('contact-submit-status');
  const contactSuccessView = document.getElementById('contact-success-view');
  const contactServiceError = document.getElementById('contact-service-error');

  if (contactDialog && contactDialogOpen && contactForm) {
    const serviceInputs = [...contactForm.querySelectorAll('input[name="services"]')];
    const resetContactDialog = () => {
      contactForm.reset();
      contactFormView.hidden = false;
      contactReviewView.hidden = true;
      contactSuccessView.hidden = true;
      contactServiceError.hidden = true;
      contactReviewList.replaceChildren();
      contactSubmitStatus.textContent = '';
      contactNetlifySubmit.disabled = false;
      contactNetlifySubmit.innerHTML = '確認並送出 <span>→</span>';
      document.body.classList.remove('contact-dialog-open');
    };
    const closeContactDialog = () => contactDialog.close();

    contactDialogOpen.addEventListener('click', () => {
      contactDialog.showModal();
      document.body.classList.add('contact-dialog-open');
      requestAnimationFrame(() => serviceInputs[0]?.focus());
    });
    contactDialog.querySelectorAll('[data-dialog-close]').forEach(button => {
      button.addEventListener('click', closeContactDialog);
    });
    contactDialog.addEventListener('click', event => {
      if (event.target === contactDialog) closeContactDialog();
    });
    contactDialog.addEventListener('close', resetContactDialog);
    serviceInputs.forEach(input => input.addEventListener('change', () => {
      if (serviceInputs.some(service => service.checked)) contactServiceError.hidden = true;
    }));

    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const selectedServices = serviceInputs.filter(input => input.checked).map(input => input.value);
      if (!selectedServices.length) {
        contactServiceError.hidden = false;
        serviceInputs[0]?.focus();
        return;
      }
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const details = [
        ['需求項目', selectedServices.join('、')],
        ['姓名／稱謂', formData.get('name')],
        ['公司名稱', formData.get('company') || '未提供'],
        ['電子信箱', formData.get('email')],
        ['聯絡電話', formData.get('phone')],
        ['方便聯絡時段', formData.get('contactTime')],
        ['需求說明', formData.get('message')]
      ];
      contactReviewList.replaceChildren();
      details.forEach(([label, value]) => {
        const term = document.createElement('dt');
        const description = document.createElement('dd');
        term.textContent = label;
        description.textContent = String(value);
        contactReviewList.append(term, description);
      });

      contactFormView.hidden = true;
      contactReviewView.hidden = false;
      contactDialog.scrollTop = 0;
      contactNetlifySubmit.focus();
    });

    contactNetlifySubmit.addEventListener('click', async () => {
      if (window.location.protocol === 'file:') {
        contactSubmitStatus.textContent = '本機預覽不會送出資料；部署到 Netlify 後即可測試正式送出。';
        return;
      }
      contactSubmitStatus.textContent = '資料送出中，請稍候…';
      contactNetlifySubmit.disabled = true;
      contactNetlifySubmit.textContent = '送出中…';
      try {
        const submissionData = new FormData(contactForm);
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(submissionData).toString()
        });
        if (!response.ok) throw new Error(`Netlify form submission failed: ${response.status}`);
        contactReviewView.hidden = true;
        contactSuccessView.hidden = false;
        contactDialog.scrollTop = 0;
        contactSuccessView.querySelector('button')?.focus();
      } catch (error) {
        console.error(error);
        contactSubmitStatus.textContent = '目前無法送出，請稍後再試或直接聯絡 service@gaushyang.com。';
      } finally {
        contactNetlifySubmit.disabled = false;
        contactNetlifySubmit.innerHTML = '確認並送出 <span>→</span>';
      }
    });

    contactReviewEdit.addEventListener('click', () => {
      contactReviewView.hidden = true;
      contactFormView.hidden = false;
      contactDialog.scrollTop = 0;
      serviceInputs[0]?.focus();
    });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
});
