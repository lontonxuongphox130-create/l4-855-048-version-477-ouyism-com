(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('is-open');
        });
    }

    var searchForms = document.querySelectorAll('[data-search-form]');
    searchForms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                return;
            }
            event.preventDefault();
            window.location.href = 'search.html?q=' + encodeURIComponent(input.value.trim());
        });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        currentSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === currentSlide);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    var filterInputs = document.querySelectorAll('[data-filter-input]');

    function filterCards(value) {
        var term = (value || '').trim().toLowerCase();
        var cards = document.querySelectorAll('[data-title][data-keywords]');
        cards.forEach(function (card) {
            var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-keywords')).toLowerCase();
            card.classList.toggle('is-filtered-out', term !== '' && text.indexOf(term) === -1);
        });
    }

    filterInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            filterCards(input.value);
        });
    });

    var searchInput = document.querySelector('[data-search-input]');
    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        searchInput.value = query;
        filterCards(query);
        searchInput.addEventListener('input', function () {
            filterCards(searchInput.value);
        });
    }

    var quickTerms = document.querySelectorAll('[data-search-term]');
    quickTerms.forEach(function (button) {
        button.addEventListener('click', function () {
            var value = button.getAttribute('data-search-term') || '';
            if (searchInput) {
                searchInput.value = value;
            }
            filterCards(value);
        });
    });
}());
