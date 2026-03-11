$(function(){

    // бургер кнопка и меню
    $('.burger-btn').on('click', function() {
        $('.menu__list').toggleClass('menu__list--active');
        $('.burger-btn').toggleClass('burger-btn--active');
    });

});