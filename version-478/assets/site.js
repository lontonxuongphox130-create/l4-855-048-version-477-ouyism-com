(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    bindMenu();
    bindHero();
    bindFilters();
    bindGlobalSearch();
    bindPlayers();
  });

  function bindMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function bindHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function bindFilters() {
    var input = document.querySelector("[data-filter-input]");
    var region = document.querySelector("[data-filter-region]");
    var type = document.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filtered-grid .movie-card, .content-section .movie-card"));
    var noResults = document.querySelector("[data-no-results]");
    if (!input && !region && !type) {
      return;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var regionValue = region ? region.value : "";
      var typeValue = type ? type.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year")
        ].join(" ").toLowerCase();
        var ok = true;
        if (term && text.indexOf(term) === -1) {
          ok = false;
        }
        if (regionValue && (card.getAttribute("data-region") || "").indexOf(regionValue) === -1) {
          ok = false;
        }
        if (typeValue && (card.getAttribute("data-type") || "").indexOf(typeValue) === -1) {
          ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });
      if (noResults) {
        noResults.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, region, type].forEach(function (el) {
      if (el) {
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      }
    });
  }

  function bindGlobalSearch() {
    var input = document.querySelector("[data-global-search]");
    var region = document.querySelector("[data-global-region]");
    var results = document.querySelector("[data-search-results]");
    var empty = document.querySelector("[data-search-empty]");
    if (!input || !results || !window.SEARCH_INDEX) {
      return;
    }

    function card(item) {
      return [
        '<a class="movie-card" href="' + escapeHtml(item.url) + '">',
        '<div class="card-poster"><img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy"></div>',
        '<div class="card-body">',
        '<div class="card-meta"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(String(item.year)) + '</span></div>',
        '<h3>' + escapeHtml(item.title) + '</h3>',
        '<p>' + escapeHtml(item.oneLine) + '</p>',
        '</div>',
        '</a>'
      ].join('');
    }

    function render() {
      var term = input.value.trim().toLowerCase();
      var regionValue = region ? region.value : "";
      var matches = window.SEARCH_INDEX.filter(function (item) {
        var text = [item.title, item.region, item.type, item.genre, item.tags, item.year, item.oneLine].join(" ").toLowerCase();
        if (term && text.indexOf(term) === -1) {
          return false;
        }
        if (regionValue && item.region.indexOf(regionValue) === -1) {
          return false;
        }
        return true;
      }).slice(0, 120);
      results.innerHTML = matches.map(card).join("");
      if (empty) {
        empty.classList.toggle("is-visible", matches.length === 0);
      }
    }

    input.addEventListener("input", render);
    if (region) {
      region.addEventListener("change", render);
    }
    render();
  }

  function bindPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector(".play-cover");
      if (!video || !button) {
        return;
      }
      var hlsUrl = video.getAttribute("data-hls");
      var attached = false;

      function attach() {
        if (attached || !hlsUrl) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = hlsUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
        } else {
          video.src = hlsUrl;
        }
      }

      function play() {
        attach();
        button.classList.add("is-hidden");
        video.setAttribute("controls", "controls");
        var request = video.play();
        if (request && typeof request.catch === "function") {
          request.catch(function () {
            button.classList.remove("is-hidden");
          });
        }
      }

      button.addEventListener("click", play);
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[char];
    });
  }
})();
