(function () {
    function create(source) {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector(".player-cover");
        var button = document.querySelector(".play-cover-button");
        var hls = null;
        var attached = false;

        function attach() {
            if (attached || !video) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.setAttribute("controls", "controls");
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        if (cover) {
            cover.addEventListener("click", play);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation();
                play();
            });
        }
        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });
            video.addEventListener("play", function () {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
            });
        }
    }

    window.MoviePlayer = {
        create: create
    };
}());
