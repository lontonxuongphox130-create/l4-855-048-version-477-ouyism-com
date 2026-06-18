(function () {
  function setupPlayer(container) {
    var video = container.querySelector('video');
    var button = container.querySelector('.play-overlay');
    if (!video || !button) {
      return;
    }

    var stream = video.getAttribute('data-stream');
    var attached = false;
    var hlsInstance = null;

    function attachStream() {
      if (attached || !stream) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function playVideo() {
      attachStream();
      video.controls = true;
      button.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (!attached) {
        playVideo();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      button.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
