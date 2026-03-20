$(function(){

    /*---- бургер кнопка и меню ----*/
    $('.burger-btn').on('click', function() {
        $('.menu__list').toggleClass('menu__list--active');
        $('.burger-btn').toggleClass('burger-btn--active');
    });

    new Splide('#brands', {
        type : 'loop',
        // perPage: 3, /* Будет сжимать слайды, если сколько надо не влезут/ Не работает, если указан fixedWidth */
        perMove: 1,
        fixedWidth: 258, /* Фикс. ширина слайдов. Если слайдов мало, то продублирует их, до полного заполнения контейнера */
        // gap: 24,
        speed: 1500, /* по дефолту 400 */
        arrows: false,
        pagination: false,
        // autoplay: true,
        interval: 3000,
        pauseOnHover: true,
        pauseOnFocus: true
    }).mount();

});