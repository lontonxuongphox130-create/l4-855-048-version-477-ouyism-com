(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  document.querySelectorAll('.global-search').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        if (input) {
          input.focus();
        }
      }
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  var filterGrid = document.querySelector('[data-filter-grid]');
  if (filterGrid) {
    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('.filter-card'));
    var input = document.querySelector('[data-filter-input]');
    var regionSelect = document.querySelector('[data-filter-region]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var emptyState = document.querySelector('[data-empty-state]');

    var regions = Array.from(new Set(cards.map(function (card) { return card.dataset.region; }).filter(Boolean))).sort();
    var types = Array.from(new Set(cards.map(function (card) { return card.dataset.type; }).filter(Boolean))).sort();
    var years = Array.from(new Set(cards.map(function (card) { return card.dataset.year; }).filter(Boolean))).sort().reverse();

    fillSelect(regionSelect, regions);
    fillSelect(typeSelect, types);
    fillSelect(yearSelect, years);

    function filterCards() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = (card.textContent + ' ' + (card.dataset.tags || '')).toLowerCase();
        var ok = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }
        if (region && card.dataset.region !== region) {
          ok = false;
        }
        if (type && card.dataset.type !== type) {
          ok = false;
        }
        if (year && card.dataset.year !== year) {
          ok = false;
        }
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [input, regionSelect, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterCards);
        control.addEventListener('change', filterCards);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && input) {
      input.value = query;
    }
    filterCards();
  }
})();
