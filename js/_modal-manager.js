window.ModalManager = {
    openCount: 0,
    scrollPosition: 0,
    triggerElement: null,

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const active = document.querySelector('.modal-overlay.active, .lightbox.active');
                if (active) this.close(active);
            }
        });
    },

    open(modal, trigger) {
        if (this.openCount === 0) {
            this.scrollPosition = window.pageYOffset;
            document.body.style.overflow = 'hidden';
        }
        this.openCount++;
        this.triggerElement = trigger || document.activeElement;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Переносим фокус внутрь попапа через кадр, чтобы избежать варнинга
        requestAnimationFrame(() => {
            const focusable = modal.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');  
            if (focusable) focusable.focus();
        });
    },

    close(modal) {
        // 1. Сначала возвращаем фокус на кнопку, которая открыла попап
        if (this.triggerElement) this.triggerElement.focus();
        else document.body.focus();

        // 2. Скрываем визуально
        modal.classList.remove('active');
        
        // 3. Убираем aria-hidden ПОСЛЕ ухода фокуса (решает варнинг в консоли)
        requestAnimationFrame(() => {
            modal.setAttribute('aria-hidden', 'true');
        });

        this.openCount--;
        if (this.openCount === 0) {
            document.body.style.overflow = '';
            window.scrollTo(0, this.scrollPosition);
        }
    }
};

window.ModalManager.init(); 