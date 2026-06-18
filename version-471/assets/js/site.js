(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    function initMobileMenu() {
        var toggle = document.querySelector('.mobile-toggle');
        var panel = document.querySelector('.mobile-panel');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = panel.hasAttribute('hidden');
            if (open) {
                panel.removeAttribute('hidden');
                toggle.textContent = '×';
            } else {
                panel.setAttribute('hidden', '');
                toggle.textContent = '☰';
            }
        });
    }

    function initHeroSlider() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var prev = slider.querySelector('.hero-prev');
        var next = slider.querySelector('.hero-next');
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function play() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide')) || 0);
                play();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                play();
            });
        }

        play();
    }

    function initFilters() {
        var input = document.querySelector('.js-filter-input');
        var year = document.querySelector('.js-year-filter');
        var list = document.querySelector('.js-movie-list');
        if (!list || (!input && !year)) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('.js-movie-card'));
        var empty = document.querySelector('.empty-state');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }

        function matchYear(card, value) {
            if (!value) {
                return true;
            }
            var cardYear = Number(card.getAttribute('data-year') || '0');
            if (value === '2020') {
                return cardYear <= 2020;
            }
            return cardYear === Number(value);
        }

        function run() {
            var text = input ? input.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                var ok = (!text || haystack.indexOf(text) !== -1) && matchYear(card, yearValue);
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', run);
        }
        if (year) {
            year.addEventListener('change', run);
        }
        run();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var overlay = shell.querySelector('.player-overlay');
            var message = shell.querySelector('.player-message');
            var source = shell.getAttribute('data-source');
            var hlsInstance = null;
            var prepared = false;

            function showMessage(text) {
                if (!message) {
                    return;
                }
                message.textContent = text;
                message.hidden = false;
            }

            function prepare() {
                if (prepared || !video || !source) {
                    return;
                }
                prepared = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                    hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            showMessage('视频加载失败，请稍后重试');
                            if (hlsInstance) {
                                hlsInstance.destroy();
                                hlsInstance = null;
                            }
                            prepared = false;
                        }
                    });
                    return;
                }
                showMessage('当前环境暂不支持播放');
            }

            function start() {
                prepare();
                if (!video) {
                    return;
                }
                video.controls = true;
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        if (overlay) {
                            overlay.classList.remove('is-hidden');
                        }
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener('click', start);
            }
            if (video) {
                video.addEventListener('click', function () {
                    if (video.paused) {
                        start();
                    } else {
                        video.pause();
                    }
                });
            }
        });
    }

    ready(function () {
        initMobileMenu();
        initHeroSlider();
        initFilters();
        initPlayers();
    });
})();
