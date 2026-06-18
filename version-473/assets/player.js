(function () {
    function initMoviePlayer(options) {
        var video = document.getElementById(options.videoId);
        var button = document.getElementById(options.buttonId);
        var ready = false;
        var hlsInstance = null;

        if (!video || !button || !options.url) {
            return;
        }

        function prepare() {
            if (ready) {
                return;
            }
            ready = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(options.url);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.url;
            }
        }

        function start() {
            prepare();
            button.classList.add('is-hidden');
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    button.classList.remove('is-hidden');
                });
            }
        }

        button.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (!video.ended) {
                button.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
}());
