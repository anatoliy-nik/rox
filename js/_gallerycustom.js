document.addEventListener('DOMContentLoaded', () => {
  // === ПРОВЕРКА: есть ли галерея на странице ===
  const thumbsWrap = document.getElementById('thumbs');
  const mainImg = document.getElementById('mainImg');
  const lightbox = document.getElementById('lightbox');
  
  if (!thumbsWrap || !mainImg || !lightbox) return;

  // === СБОР ЭЛЕМЕНТОВ ===
  const lbImg = document.getElementById('lbImg');
  const lbThumbs = document.getElementById('lbThumbs');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lbClose');

  const rawImgs = Array.from(thumbsWrap.querySelectorAll('img'));
  const images = rawImgs.map(img => img.src);
  
  let current = 0;
  const maxVisible = 4;

  // === УНИВЕРСАЛЬНАЯ БЛОКИРОВКА СКРОЛЛА (совместима с формами) ===
  let modalScrollY = 0;
  let activeModals = 0;

  function lockScroll() {
    if (activeModals === 0) {
      modalScrollY = window.pageYOffset;
      document.body.classList.add('modal-open');
      document.body.style.top = `-${modalScrollY}px`;
    }
    activeModals++;
  }

  function unlockScroll() {
    activeModals--;
    if (activeModals === 0) {
      document.body.classList.remove('modal-open');
      document.body.style.top = '';
      window.scrollTo(0, modalScrollY);
    }
  }

  // === ОБРАБОТКА МИНИАТЮР В ГАЛЕРЕЕ ===
  rawImgs.forEach((img, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery__thumb';
    wrapper.dataset.index = i;
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    if (i >= maxVisible) {
      wrapper.classList.add('hidden');
    } else {
      if (i === 0) wrapper.classList.add('active');
      
      if (i === maxVisible - 1 && images.length > maxVisible) {
        wrapper.classList.add('more');
        wrapper.dataset.count = `+${images.length - maxVisible}`;
      }
      
      wrapper.addEventListener('click', () => setActive(i));
    }
  });

  function setActive(index) {
    current = index;
    mainImg.src = images[index];
    thumbsWrap.querySelectorAll('.gallery__thumb').forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
  }

  // === ОТКРЫТИЕ ЛАЙТБОКСА ===
  mainImg.addEventListener('click', () => {
    lightbox.classList.add('active'); // Используем .active вместо .open
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll(); // Блокируем скролл через общую систему
    lbImg.src = images[current];
    renderLbThumbs();
  });

  // === ЛОГИКА ЛАЙТБОКСА ===
  function renderLbThumbs() {
    lbThumbs.innerHTML = '';
    images.forEach((src, i) => {
      const t = document.createElement('img');
      t.src = src;
      t.className = 'lb-thumb' + (i === current ? ' active' : '');
      t.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
      lbThumbs.appendChild(t);
    });
  }

  function goToSlide(index) {
    current = index;
    lbImg.src = images[current];
    renderLbThumbs();
  }

  function navigate(dir) {
    let next = current + dir;
    if (next >= images.length) next = 0;
    if (next < 0) next = images.length - 1;
    goToSlide(next);
  }

  if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  // === ЗАКРЫТИЕ ЛАЙТБОКСА ===
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    unlockScroll(); // Разблокируем скролл
  };

  if (lbClose) lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lbImg.parentNode) {
      closeLightbox();
    }
  });

  // === УПРАВЛЕНИЕ КЛАВИАТУРОЙ ===
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') { 
      closeLightbox(); 
      return; 
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigate(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigate(1);
    }
  });

  setActive(0);
});