$(function(){

    /*---- бургер кнопка и меню ----*/
    $('.burger-btn').on('click', function() {
        $('.menu__list').toggleClass('menu__list--active');
        $('.burger-btn').toggleClass('burger-btn--active');
    });

    /*---- слайдер брендов ----*/
    new Splide('#brands', {
        type : 'loop',
        // perPage: 3, /* Будет сжимать слайды, если сколько надо не влезут. Не работает, если указан fixedWidth */
        perPage: 7,
        perMove: 1,
        // fixedWidth: 258, /* Фикс. ширина слайдов. Если слайдов мало, то продублирует их, до полного заполнения контейнера */
        // gap: 24,
        arrows: false,
        pagination: false,
        autoplay: true,
        speed: 300000, /* по дефолту 400 */
        interval: 100, /* по дефолту 5000 */
        pauseOnHover: true,
        pauseOnFocus: true,
        breakpoints: {
                1399: {
                    perPage: 6,
                },
                1199: {
                    perPage: 5,
                },
                991: {
                    perPage: 4,
                },
                767: {
                    perPage: 3,
                },
                539: {
                    perPage: 2,
                }
            }
    }).mount();

    /*---- 2-х уровневое меню (на мобиле) ----*/
    $(document).on('click keydown', '.toggle-submenu', function(e) {
        if (e.type === 'keydown' && e.which !== 13 && e.which !== 32) return;

        e.preventDefault();
        const $btn = $(this);
        const $submenu = $btn.closest('.menu-list__item--submenu').find('.submenu-list');

        // Закрываем другие подменю
        $('.submenu-list.open').not($submenu).removeClass('open').siblings('div').find('.toggle-submenu').removeClass('open');

        // Toggle текущего
        $submenu.toggleClass('open');
        $btn.toggleClass('open');
    });

});