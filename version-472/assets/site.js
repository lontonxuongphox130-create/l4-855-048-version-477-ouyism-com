(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");

    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            var isOpen = panel.hasAttribute("hidden") === false;
            if (isOpen) {
                panel.setAttribute("hidden", "");
                toggle.setAttribute("aria-expanded", "false");
                toggle.textContent = "☰";
            } else {
                panel.removeAttribute("hidden");
                toggle.setAttribute("aria-expanded", "true");
                toggle.textContent = "×";
            }
        });
    }

    function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
    }

    function filterCards(input) {
        var query = normalize(input.value);
        var cards = document.querySelectorAll(".filter-list .movie-card");
        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-tags"),
                card.getAttribute("data-summary"),
                card.getAttribute("data-region"),
                card.getAttribute("data-year")
            ].join(" "));
            card.classList.toggle("is-filter-hidden", query && haystack.indexOf(query) === -1);
        });
    }

    var filterInput = document.querySelector(".filter-input");
    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (initial) {
            filterInput.value = initial;
            filterCards(filterInput);
        }
        filterInput.addEventListener("input", function () {
            filterCards(filterInput);
        });
    }
}());
