(function () {
  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var toggle = qs('.nav-toggle');
    var nav = qs('.site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = qsa('[data-hero-slide]');
    var dots = qsa('[data-hero-dot]');
    if (slides.length < 2) return;
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        play();
      });
    });

    show(0);
    play();
  }

  function setupHeaderSearch() {
    qsa('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = qs('input[name="q"]', form);
        var term = input ? input.value.trim() : '';
        if (!term) {
          event.preventDefault();
          if (input) input.focus();
        }
      });
    });
  }

  function setupFiltering() {
    var form = qs('[data-filter-form]');
    var cards = qsa('[data-movie-card]');
    if (!form || !cards.length) return;
    var keyword = qs('[data-filter-keyword]', form);
    var year = qs('[data-filter-year]', form);
    var region = qs('[data-filter-region]', form);
    var empty = qs('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && keyword) keyword.value = q;

    function apply() {
      var k = normalize(keyword && keyword.value);
      var y = normalize(year && year.value);
      var r = normalize(region && region.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-searchable'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var ok = true;
        if (k && text.indexOf(k) === -1) ok = false;
        if (y && cardYear !== y) ok = false;
        if (r && cardRegion !== r) ok = false;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });

      if (empty) empty.classList.toggle('is-visible', visible === 0);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });

    [keyword, year, region].forEach(function (item) {
      if (!item) return;
      item.addEventListener('input', apply);
      item.addEventListener('change', apply);
    });

    apply();
  }

  function setupImageFallback() {
    document.addEventListener('error', function (event) {
      var target = event.target;
      if (target && target.tagName === 'IMG') {
        target.classList.add('image-empty');
      }
    }, true);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupHeaderSearch();
    setupFiltering();
    setupImageFallback();
  });
})();
