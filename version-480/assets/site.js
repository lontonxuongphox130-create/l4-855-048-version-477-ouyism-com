(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var mobile = document.querySelector(".mobile-nav");
    if (!toggle || !mobile) {
      return;
    }
    toggle.addEventListener("click", function () {
      var opened = mobile.classList.toggle("open");
      toggle.classList.toggle("is-open", opened);
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });

    if (slides.length > 1) {
      restart();
    }
  }

  function initFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
    var input = document.querySelector("[data-movie-search]");
    var count = document.querySelector("[data-result-count]");
    var clear = document.querySelector("[data-clear-filter]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-key]"));
    if (!cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var activeYear = "all";

    if (input && query) {
      input.value = query;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-search") || ""
        ].join(" ").toLowerCase();
        var year = card.getAttribute("data-year") || "";
        var matched = (!term || haystack.indexOf(term) !== -1) && (activeYear === "all" || year === activeYear);
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = visible ? "找到 " + visible + " 部作品" : "未找到相关影片";
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }

    if (clear) {
      clear.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        activeYear = "all";
        chips.forEach(function (chip) {
          chip.classList.toggle("is-active", chip.getAttribute("data-filter-value") === "all");
        });
        apply();
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var key = chip.getAttribute("data-filter-key");
        var value = chip.getAttribute("data-filter-value") || "all";
        if (key === "year") {
          activeYear = value;
        } else {
          activeYear = "all";
        }
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        apply();
      });
    });

    apply();
  }

  window.setupMoviePlayer = function (sourceUrl) {
    var video = document.getElementById("movie-player");
    var cover = document.querySelector(".player-cover");
    var button = document.querySelector(".play-button");
    var loaded = false;
    var hls = null;

    if (!video || !sourceUrl) {
      return;
    }

    function startPlayback() {
      if (cover) {
        cover.classList.add("is-hidden");
      }
      if (!loaded) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = sourceUrl;
          loaded = true;
          var nativePlay = video.play();
          if (nativePlay && nativePlay.catch) {
            nativePlay.catch(function () {});
          }
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(sourceUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            var parsedPlay = video.play();
            if (parsedPlay && parsedPlay.catch) {
              parsedPlay.catch(function () {});
            }
          });
          loaded = true;
        } else {
          video.src = sourceUrl;
          loaded = true;
          var fallbackPlay = video.play();
          if (fallbackPlay && fallbackPlay.catch) {
            fallbackPlay.catch(function () {});
          }
        }
      } else {
        var replay = video.play();
        if (replay && replay.catch) {
          replay.catch(function () {});
        }
      }
    }

    if (button) {
      button.addEventListener("click", startPlayback);
    }
    if (cover) {
      cover.addEventListener("click", startPlayback);
    }
    video.addEventListener("click", function () {
      if (!loaded) {
        startPlayback();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
  });
})();
