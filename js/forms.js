document.addEventListener('DOMContentLoaded', () => {
    
    // Функция закрытия конкретной модалки
    const closeModal = (modal) => {
        if (!modal) return;
        
        document.activeElement.blur(); // Убираем фокус
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Разблокируем скролл (напрямую)
        document.body.style.overflow = '';
    };

    // Глобальный слушатель кликов
    document.addEventListener('click', e => {
        
        // 1. Открытие формы
        const openBtn = e.target.closest('.js-open-modal');
        if (openBtn) {
            const modalId = openBtn.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            if (modal) {
                // Блокируем скролл
                document.body.style.overflow = 'hidden';
                
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                
                setTimeout(() => {
                    const focusEl = modal.querySelector('input, textarea, button');
                    if (focusEl) focusEl.focus();
                }, 50);
            }
        }

        // 2. Закрытие крестиком
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
            closeModal(closeBtn.closest('.modal-overlay'));
        }

        // 3. Закрытие по фону
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) closeModal(activeModal);
        }
    });

    // Демо-отправка (чтобы страница не перезагружалась)
    document.querySelectorAll('.modal-content form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const modal = form.closest('.modal-overlay');
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Отправлено!';
            btn.disabled = true;

            setTimeout(() => {
                closeModal(modal); // Закрываем
                setTimeout(() => {
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 300);
            }, 800);
        });
    });
});