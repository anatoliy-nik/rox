document.addEventListener('DOMContentLoaded', () => {
    // Инициализация только если есть элементы галереи
    const thumbsWrap = document.getElementById('thumbs');
    const mainImg = document.getElementById('mainImg');
    const lightbox = document.getElementById('lightbox');
    
    if (!thumbsWrap || !mainImg || !lightbox) return;

    const lbImg = document.getElementById('lbImg');
    const lbThumbs = document.getElementById('lbThumbs');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const lbClose = document.getElementById('lbClose');

    const images = Array.from(thumbsWrap.querySelectorAll('img')).map(img => img.src);
    let current = 0;
    const maxVisible = 4;

    // Обработка миниатюр
    Array.from(thumbsWrap.querySelectorAll('img')).forEach((img, i) => {
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

    function setActive(i) {
        current = i;
        mainImg.src = images[i];
        thumbsWrap.querySelectorAll('.gallery__thumb').forEach((t, idx) => 
            t.classList.toggle('active', idx === i)
        );
    }

    // --- ОТКРЫТИЕ ГАЛЕРЕИ ---
    mainImg.addEventListener('click', () => {
        // 1. Блокируем скролл (напрямую)
        document.body.style.overflow = 'hidden';
        
        // 2. Показываем лайтбокс
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        
        lbImg.src = images[current];
        renderLbThumbs();
    });

    function renderLbThumbs() {
        lbThumbs.innerHTML = '';
        images.forEach((src, i) => {
            const t = document.createElement('img');
            t.src = src;
            t.className = `lb-thumb${i === current ? ' active' : ''}`;
            t.addEventListener('click', (e) => { e.stopPropagation(); goToSlide(i); });
            lbThumbs.appendChild(t);
        });
    }

    function goToSlide(i) {
        current = i;
        lbImg.src = images[current];
        renderLbThumbs();
    }

    function navigate(dir) {
        let next = current + dir;
        if (next >= images.length) next = 0;
        if (next < 0) next = images.length - 1;
        goToSlide(next);
    }

    lbPrev?.addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
    lbNext?.addEventListener('click', e => { e.stopPropagation(); navigate(1); });

    // --- ЗАКРЫТИЕ ГАЛЕРЕИ ---
    const closeLightbox = () => {
        document.activeElement.blur(); // Убираем фокус
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        
        // 1. Разблокируем скролл
        document.body.style.overflow = '';
    };

    lbClose?.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
    
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox || e.target === lbImg.parentNode) closeLightbox();
    });

    // Клавиатура (ESC и стрелки)
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
            return;
        }
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
        }
    });

    setActive(0);
});