(function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var mobileNav = document.querySelector(".mobile-nav");
    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            var open = mobileNav.hasAttribute("hidden");
            if (open) {
                mobileNav.removeAttribute("hidden");
            } else {
                mobileNav.setAttribute("hidden", "");
            }
            menuButton.setAttribute("aria-expanded", String(open));
        });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var prev = slider.querySelector("[data-hero-prev]");
        var next = slider.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;
        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === active);
            });
        }
        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }
        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                restart();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });
        restart();
    }

    var filters = document.querySelectorAll(".grid-filter-input");
    filters.forEach(function (input) {
        input.addEventListener("input", function () {
            var value = input.value.trim().toLowerCase();
            var grid = input.closest("main").querySelector(".filter-grid");
            if (!grid) {
                return;
            }
            var cards = grid.querySelectorAll("[data-search-text]");
            cards.forEach(function (card) {
                var text = card.getAttribute("data-search-text") || "";
                card.classList.toggle("is-hidden-card", value && text.indexOf(value) === -1);
            });
        });
    });

    var searchContainer = document.getElementById("search-results");
    var searchInput = document.getElementById("search-page-input");
    if (searchContainer && typeof SEARCH_INDEX !== "undefined") {
        var params = new URLSearchParams(window.location.search);
        var query = (params.get("q") || "").trim();
        if (searchInput) {
            searchInput.value = query;
        }
        function renderSearch(value) {
            var normalized = value.toLowerCase();
            var results = SEARCH_INDEX.filter(function (item) {
                var text = [item.title, item.year, item.region, item.type, item.category, item.genre, (item.tags || []).join(" ")].join(" ").toLowerCase();
                return !normalized || text.indexOf(normalized) !== -1;
            }).slice(0, 80);
            if (!results.length) {
                searchContainer.innerHTML = "<p class=\"empty-state\">没有找到匹配影片。</p>";
                return;
            }
            searchContainer.innerHTML = results.map(function (item) {
                return [
                    "<article class=\"search-result-card\">",
                    "<a href=\"" + item.url + "\"><img src=\"" + item.cover + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\"></a>",
                    "<div>",
                    "<h2><a href=\"" + item.url + "\">" + escapeHtml(item.title) + "</a></h2>",
                    "<p>" + escapeHtml(item.desc) + "</p>",
                    "<div class=\"movie-meta-line\"><span>" + escapeHtml(item.year) + "</span><span>" + escapeHtml(item.region) + "</span><span>" + escapeHtml(item.category) + "</span></div>",
                    "</div>",
                    "</article>"
                ].join("");
            }).join("");
        }
        function escapeHtml(value) {
            return String(value).replace(/[&<>\"]/g, function (char) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "\"": "&quot;"
                }[char];
            });
        }
        renderSearch(query);
    }
})();
