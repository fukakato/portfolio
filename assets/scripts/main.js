document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll('.back-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      let sameSite = false;
      try {
        sameSite = document.referrer &&
          new URL(document.referrer).origin === location.origin;
      } catch (_) { sameSite = false; }
      if (sameSite && window.history.length > 1) {
        e.preventDefault();
        history.back();
      }

    });
  });

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.wd-slider-track');
    const slides = track ? track.querySelectorAll('.wd-slide') : [];
    const first = slider.querySelector('.wd-slider-first');
    const prev = slider.querySelector('.wd-slider-prev');
    const next = slider.querySelector('.wd-slider-next');
    const last = slider.querySelector('.wd-slider-last');
    const cur = slider.querySelector('.wd-cur');
    const total = slides.length;
    let idx = 0;
    if (!track || total === 0) return;

    const update = () => {
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (cur) cur.textContent = idx + 1;
      const atStart = (idx === 0), atEnd = (idx === total - 1);
      if (first) first.disabled = atStart;
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
      if (last) last.disabled = atEnd;
    };
    const go = (i) => { idx = Math.max(0, Math.min(total - 1, i)); update(); };

    if (first) first.addEventListener('click', () => go(0));
    if (prev) prev.addEventListener('click', () => go(idx - 1));
    if (next) next.addEventListener('click', () => go(idx + 1));
    if (last) last.addEventListener('click', () => go(total - 1));

    let sx = 0, sy = 0;
    slider.addEventListener('touchstart', (e) => {
      sx = e.changedTouches[0].clientX; sy = e.changedTouches[0].clientY;
    }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });

    update();
  });

  const openBtn01 = document.getElementById('openBtn01');
  const gNav = document.getElementById('g-nav');

  if (openBtn01 && gNav) {
    const closeNav = () => {
      openBtn01.classList.remove('active');
      gNav.classList.remove('active');
      openBtn01.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    openBtn01.addEventListener('click', () => {
      const isActive = openBtn01.classList.toggle('active');
      gNav.classList.toggle('active', isActive);
      openBtn01.setAttribute('aria-expanded', String(isActive));
      document.body.classList.toggle('nav-open', isActive);
    });

    gNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && gNav.classList.contains('active')) closeNav();
    });
  }

  const worksModal = document.getElementById('worksModal');

  if (worksModal) {
    const openTriggers = document.querySelectorAll('[data-open-works-modal]');
    const closeTriggers = worksModal.querySelectorAll('[data-modal-close]');

    const openWorksModal = () => {
      worksModal.classList.add('active');
      worksModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
    };

    const closeWorksModal = () => {
      worksModal.classList.remove('active');
      worksModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    };

    openTriggers.forEach(trigger => trigger.addEventListener('click', openWorksModal));
    closeTriggers.forEach(trigger => trigger.addEventListener('click', closeWorksModal));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && worksModal.classList.contains('active')) {
        closeWorksModal();
      }
    });

    const modalTabs = worksModal.querySelectorAll('[data-works-tab]');
    const modalPanels = worksModal.querySelectorAll('[data-works-panel]');
    modalTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.worksTab;
        modalTabs.forEach(t => t.classList.toggle('active', t === tab));
        modalPanels.forEach(p => p.classList.toggle('is-hidden', p.dataset.worksPanel !== target));
      });
    });
  }

  const fadeElements = document.querySelectorAll('.fade-in-up');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  const sheets = [
    document.getElementById('sheet-1'),
    document.getElementById('sheet-2'),
    document.getElementById('sheet-3')
  ].filter(Boolean);

  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const firstBtn = document.getElementById('firstBtn');
  const lastBtn  = document.getElementById('lastBtn');
  const bookArea = document.getElementById('aboutBook');

  let currentSheetIdx = 0;
  const totalSheets = sheets.length;

  function updateBookButtons() {
    const atStart = (currentSheetIdx === 0);
    const atEnd   = (currentSheetIdx === totalSheets - 1);
    if (prevBtn)  prevBtn.disabled  = atStart;
    if (firstBtn) firstBtn.disabled = atStart;
    if (nextBtn)  nextBtn.disabled  = atEnd;
    if (lastBtn)  lastBtn.disabled  = atEnd;
  }

  function flipNext() {
    if (currentSheetIdx >= totalSheets - 1) return;
    sheets[currentSheetIdx].classList.add('flipped');
    sheets[currentSheetIdx].style.zIndex = 1 + currentSheetIdx;
    currentSheetIdx++;
    updateBookButtons();
  }

  function flipPrev() {
    if (currentSheetIdx <= 0) return;
    currentSheetIdx--;
    sheets[currentSheetIdx].classList.remove('flipped');
    sheets[currentSheetIdx].style.zIndex = 5 - currentSheetIdx;
    updateBookButtons();
  }

  if (totalSheets > 0) {
    updateBookButtons();

    if (nextBtn)  nextBtn.addEventListener('click', flipNext);
    if (prevBtn)  prevBtn.addEventListener('click', flipPrev);
    if (firstBtn) firstBtn.addEventListener('click', () => { while (currentSheetIdx > 0) flipPrev(); });
    if (lastBtn)  lastBtn.addEventListener('click', () => { while (currentSheetIdx < totalSheets - 1) flipNext(); });

    if (bookArea) {
      let touchStartX = 0;
      let touchStartY = 0;

      bookArea.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
      }, { passive: true });

      bookArea.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) flipNext();
          else flipPrev();
        }
      }, { passive: true });
    }
  }

  const aboutSlider = document.getElementById('aboutSlider');
  if (aboutSlider) {
    const track = document.getElementById('aboutSliderTrack');
    const slides = track ? Array.from(track.querySelectorAll('.about-slide')) : [];
    const dots = Array.from(aboutSlider.querySelectorAll('.about-slider-dot'));
    const prevArrow = aboutSlider.querySelector('.about-slider-prev');
    const nextArrow = aboutSlider.querySelector('.about-slider-next');
    const total = slides.length;
    let idx = 0;

    function updateSlider() {
      if (track) track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      if (prevArrow) prevArrow.disabled = (idx === 0);
      if (nextArrow) nextArrow.disabled = (idx === total - 1);
    }

    function goTo(i) {
      idx = Math.max(0, Math.min(total - 1, i));
      updateSlider();
    }

    if (total > 0) {
      if (prevArrow) prevArrow.addEventListener('click', () => goTo(idx - 1));
      if (nextArrow) nextArrow.addEventListener('click', () => goTo(idx + 1));
      dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

      let sx = 0, sy = 0;
      aboutSlider.addEventListener('touchstart', (e) => {
        sx = e.changedTouches[0].clientX;
        sy = e.changedTouches[0].clientY;
      }, { passive: true });
      aboutSlider.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          goTo(idx + (dx < 0 ? 1 : -1));
        }
      }, { passive: true });

      updateSlider();
    }
  }

  const skillTabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillListContainer = document.getElementById('skillList');

  const skillData = {
    graphic: [
      { name: "Photoshop",     icon: "assets/images/skill_icon_ps.svg" },
      { name: "Illustrator",   icon: "assets/images/skill_icon_ai.svg" },
      { name: "After Effects", icon: "assets/images/skill_icon_ae.png" },
      { name: "Lightroom",     icon: "assets/images/skill_icon_lr.png" },
      { name: "Adobe XD",      icon: "assets/images/skill_icon_xd.svg" },
      { name: "Figma",         icon: "assets/images/skill_icon_figma.svg" }
    ],
    coding: [
      { name: "HTML5",      icon: "assets/images/skill_icon_html.svg" },
      { name: "CSS3",       icon: "assets/images/skill_icon_css.svg" },
      { name: "JavaScript", icon: "assets/images/skill_icon_js.svg" }
    ],
    ai: [
      { name: "ChatGPT",       icon: "assets/images/skill_icon_gpt.svg" },
      { name: "Google Gemini", icon: "assets/images/skill_gemini.svg" }
    ]
  };

  skillTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSkills(btn.getAttribute('data-tab'));
    });
  });

  function renderSkills(category) {
    if (!skillListContainer) return;
    skillListContainer.innerHTML = '';
    const skills = skillData[category] || [];

    skills.forEach((skill, idx) => {
      const isWide = (skill.name === "Google Gemini");
      const skillItem = document.createElement('div');
      skillItem.className = isWide ? 'skill-item skill-item-wide' : 'skill-item';
      skillItem.style.opacity = '0';
      skillItem.style.transform = 'translateY(10px)';

      skillItem.innerHTML = `
        <div class="skill-icon-svg">
          <img src="${skill.icon}" alt="${skill.name} Icon" class="skill-icon-img">
        </div>
        <div class="skill-name">${skill.name}</div>
      `;

      skillListContainer.appendChild(skillItem);

      setTimeout(() => {
        skillItem.style.transition = 'opacity 0.4s, transform 0.4s';
        skillItem.style.opacity = '1';
        skillItem.style.transform = 'translateY(0)';
      }, idx * 80);
    });
  }

  renderSkills('graphic');

  const worksTrack = document.getElementById('worksTrack');
  const worksCatTabs = document.querySelectorAll('[data-works-cat]');

  if (worksTrack) {
    const allCards = Array.from(worksTrack.querySelectorAll('.work-card'));

    const filterWorks = (cat) => {
      allCards.forEach(card => {
        card.style.display = (!cat || card.dataset.cat === cat) ? '' : 'none';
      });
    };

    worksCatTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        worksCatTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterWorks(tab.dataset.worksCat);
      });
    });

    const initialTab = document.querySelector('[data-works-cat].active');
    filterWorks(initialTab ? initialTab.dataset.worksCat : 'web');
  }

  const worksPageGrid = document.querySelector('.works-page-grid');
  if (worksPageGrid) {
    const pageTabs = document.querySelectorAll('.works-page-container .works-cat-tab[data-works-cat]');
    const pageCards = Array.from(worksPageGrid.querySelectorAll('.work-item-link'));

    const filterPage = (cat) => {
      pageCards.forEach(card => {
        card.style.display = (!cat || card.dataset.cat === cat) ? '' : 'none';
      });
    };

    pageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        pageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterPage(tab.dataset.worksCat);
      });
    });

    const initPageTab = document.querySelector('.works-page-container .works-cat-tab.active');
    filterPage(initPageTab ? initPageTab.dataset.worksCat : 'web');
  }

  const starsContainer = document.querySelector('.fv-stars');

  const buildStars = () => {
    if (!starsContainer) return;
    starsContainer.innerHTML = '';

    const w = window.innerWidth;
    const starCount = w < 600 ? 45 : (w < 1024 ? 60 : 80);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const rand = Math.random();

      if (rand < 0.3) star.className = 'fv-generated-star star-white';
      else if (rand < 0.7) star.className = 'fv-generated-star star-yellow';
      else star.className = 'fv-generated-star star-sparkle';

      const size = Math.random() * 5 + 2;
      star.style.setProperty('--size', `${size}px`);
      star.style.setProperty('--top', `${Math.random() * 75}%`);
      star.style.setProperty('--left', `${Math.random() * 100}%`);
      star.style.setProperty('--delay', `${Math.random() * 5}s`);
      star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);

      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  };

  buildStars();

  let lastWidth = window.innerWidth;
  let starTimer;
  window.addEventListener('resize', () => {
    clearTimeout(starTimer);
    starTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastWidth) > 200) {
        lastWidth = window.innerWidth;
        buildStars();
      }
    }, 300);
  });

  const storyCarousel = document.getElementById('storyCarousel');

  if (storyCarousel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    storyCarousel.addEventListener('mousedown', (e) => {
      isDown = true;
      storyCarousel.style.scrollSnapType = 'none';
      startX = e.pageX - storyCarousel.offsetLeft;
      scrollLeft = storyCarousel.scrollLeft;
    });

    storyCarousel.addEventListener('mouseleave', () => {
      isDown = false;
      storyCarousel.style.scrollSnapType = 'x mandatory';
    });

    storyCarousel.addEventListener('mouseup', () => {
      isDown = false;
      storyCarousel.style.scrollSnapType = 'x mandatory';
    });

    storyCarousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - storyCarousel.offsetLeft;
      const walk = (x - startX) * 2;
      storyCarousel.scrollLeft = scrollLeft - walk;
    });
  }

});