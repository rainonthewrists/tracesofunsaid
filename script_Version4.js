$(document).ready(function() {
    // Форматирование текста: подчёркивание пунктуации
    const patternPunc = /(,|\.|;|\(|\)|:|-|\[|\]|\?|\„|\“)/g;
    const replaceWithPunc = '<u>$1</u>';
    $('b').each(function() {
        $(this).html($(this).html().replace(patternPunc, replaceWithPunc));
    });

    // Оборачивание слов в теги <i> для анимации
    const patternWords = /([A-Za-zÀ-ȕ0-9]+)(?![\u\>])/g;
    const replaceWithWords = '<i>$1</i>';
    $('b:not(.static):not(.static-gray)').each(function() {
        $(this).html($(this).html().replace(patternWords, replaceWithWords));
    });

    // Настройка начальной анимации текста
    const characters = $('b i');
    characters.each(function() {
        if (Math.random() > 0.1) {
            $(this).css('opacity', '0');
        }
    });

    let fadeOutInterval, fadeInInterval;

    // Запуск анимации затухания текста
    const startAnimation = () => {
        clearInterval(fadeOutInterval);
        clearInterval(fadeInInterval);
        fadeOutInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * characters.length);
            $(characters[randomIndex]).css('opacity', '0');
        }, 10);
        fadeInInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * characters.length);
            $(characters[randomIndex]).css('opacity', '1');
        }, 1000);
    };

    // Остановка анимации
    const stopAnimation = () => {
        clearInterval(fadeOutInterval);
        clearInterval(fadeInInterval);
    };

    // Запуск анимации при загрузке страницы
    startAnimation();

    // Эффект наведения на текст
    $('i').mouseenter(function() {
        $(this).css('opacity', '1');
        $(this).next().css('opacity', '1');
        $(this).prev().css('opacity', '1');
    });

    // Адаптация для мобильных устройств
    if (window.matchMedia('(max-width: 768px)').matches) {
        const phoneI = document.querySelectorAll('i');
        window.addEventListener('scroll', () => {
            phoneI.forEach(element => {
                const viewportOffset = element.getBoundingClientRect();
                const windowHeight = window.innerHeight / 2;
                if (viewportOffset.top < windowHeight) {
                    element.style.opacity = '1';
                }
            });
        });
    }

    // Эффекты наведения на ссылки
    $('.link').hover(
        function() {
            stopAnimation();
            const sectionClass = $(this).data('section');
            const ref = $(this).data('ref');
            const sectionElements = $(`.${sectionClass}`).find('b');
            sectionElements.css('color', 'var(--accent-green)');
            const sectionText = $(`.${sectionClass} i`);
            sectionText.css('opacity', '1');
            sectionText.css('transition', 'none');

            if (ref === 'pathways') {
                $('.image-placeholder').each(function() {
                    $(this).addClass('active');
                    $(this).find('.pathways-image').addClass('active');
                });
            } else {
                const $imagePlaceholder = $(this).next('.image-placeholder');
                $imagePlaceholder.addClass('active');
                $imagePlaceholder.find(`.${ref}-image`).addClass('active');
            }
        },
        function() {
            startAnimation();
            const sectionClass = $(this).data('section');
            const ref = $(this).data('ref');
            const sectionElements = $(`.${sectionClass}`).find('b');
            sectionElements.css('color', 'var(--text-gray)');
            const sectionText = $(`.${sectionClass} i`);
            sectionText.css('transition', 'opacity 0.5s ease');
            sectionText.each(function() {
                $(this).css('opacity', Math.random() > 0.5 ? '0' : '1');
            });

            if (ref === 'pathways') {
                $('.image-placeholder').each(function() {
                    $(this).find('.pathways-image').removeClass('active');
                    $(this).removeClass('active');
                });
            } else {
                const $imagePlaceholder = $(this).next('.image-placeholder');
                $imagePlaceholder.find(`.${ref}-image`).removeClass('active');
                $imagePlaceholder.removeClass('active');
            }
        }
    );

    // Показ оверлея инсталляции
    const showOverlay = (ref) => {
        $('body').addClass('vlink');
        const $vcontent = $(`#${ref}`);
        $vcontent.addClass('active').css('visibility', 'visible');
        $vcontent.find('.vcontent-main').show();
        $(`#${ref}-sketch-overlay`).removeClass('active').css('visibility', 'hidden');
    };

    // Скрытие оверлея и очистка iframe
    const hideOverlay = () => {
        $('body').removeClass('vlink');
        const $vcontent = $('.vcontent');
        $vcontent.removeClass('active');
        $('.sketch-overlay').removeClass('active');
        $('.vcontent-iframe').removeClass('active').attr('src', '');
        
        setTimeout(() => {
            $vcontent.css('visibility', 'hidden');
            $('.sketch-overlay').css('visibility', 'hidden');
            startAnimation();
        }, 1000);
    };

    // Навигация по ссылкам
    $('.interview .link').click(function(e) {
        e.preventDefault();
        const topPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const ref = $(this).attr('data-ref');
        window.location.hash = `#${ref}`;
        document.documentElement.scrollTop = topPos;
        showOverlay(ref);
    });

    // Кнопка "Back"
    $('.vback').click(function() {
        history.pushState(null, null, location.pathname + location.search);
        hideOverlay();
    });

    $('.vback-sketch').click(function() {
        history.pushState(null, null, location.pathname + location.search);
        hideOverlay();
    });

    // Инициализация iframe по кнопке "Start"
    $('.vcontent-start').click(function() {
        const sectionId = $(this).closest('.vcontent').attr('id');
        $(this).closest('.vcontent-main').hide();
        const $overlay = $(`#${sectionId}-sketch-overlay`);
        const $iframe = $(`#${sectionId}-iframe`);
        $overlay.addClass('active').css('visibility', 'visible');
        if (sectionId === 'focus') {
            $iframe.addClass('active').attr('src', 'https://rainonthewrists.github.io/focus/');
        } else if (sectionId === 'pathways') {
            $iframe.addClass('active').attr('src', 'https://player.vimeo.com/video/1090278493?h=f2d95d39c9');
        } else if (sectionId === 'echo') {
            $iframe.addClass('active').attr('src', 'https://rainonthewrists.github.io/echo/');
        } else if (sectionId === 'gravity') {
            $iframe.addClass('active').attr('src', 'https://rainonthewrists.github.io/gravity/');
        }
    });

    // Обработка начального хэша
    if (window.location.hash) {
        showOverlay(window.location.hash.replace('#', ''));
    }
});