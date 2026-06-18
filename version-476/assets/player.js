(function () {
function setupPlayer(frame) {
  var video = frame.querySelector('video');
  var button = frame.querySelector('.play-button');
  var source = frame.getAttribute('data-src');
  var hls = null;
  var Hls = window.Hls;

  if (!video || !source) return;

  function attach() {
    if (video.dataset.ready === '1') return;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }
    video.dataset.ready = '1';
  }

  function play() {
    frame.classList.add('is-active');
    attach();
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  frame.addEventListener('click', function (event) {
    if (event.target === video) return;
    play();
  });

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      play();
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
      hls = null;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-player]').forEach(setupPlayer);
});
})();
