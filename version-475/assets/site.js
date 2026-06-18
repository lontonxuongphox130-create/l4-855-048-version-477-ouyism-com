(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  function setupSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input) {
          return;
        }
        var query = input.value.trim();
        if (!query) {
          event.preventDefault();
          window.location.href = './search.html';
          return;
        }
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(query);
      });
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };
    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };
    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
      }
    };
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        stop();
        show(dotIndex);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    start();
  }

  function setupFilters() {
    var bar = document.querySelector('[data-filter-bar]');
    var container = document.querySelector('[data-card-container]');
    if (!bar || !container) {
      return;
    }
    var input = bar.querySelector('[data-filter-input]');
    var reset = bar.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(container.querySelectorAll('.movie-card'));
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (input && query) {
      input.value = query;
    }
    var apply = function () {
      var keyword = normalize(input ? input.value : '');
      var genre = normalize((bar.querySelector('[data-filter-select="genre"]') || {}).value);
      var year = normalize((bar.querySelector('[data-filter-select="year"]') || {}).value);
      var region = normalize((bar.querySelector('[data-filter-select="region"]') || {}).value);
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (genre && normalize(card.getAttribute('data-genre')).indexOf(genre) === -1) {
          ok = false;
        }
        if (year && normalize(card.getAttribute('data-year')) !== year) {
          ok = false;
        }
        if (region && normalize(card.getAttribute('data-region')) !== region) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };
    if (input) {
      input.addEventListener('input', apply);
    }
    bar.querySelectorAll('select').forEach(function (select) {
      select.addEventListener('change', apply);
    });
    if (reset) {
      reset.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        bar.querySelectorAll('select').forEach(function (select) {
          select.value = '';
        });
        apply();
      });
    }
    apply();
  }

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupFilters();
  });
})();
