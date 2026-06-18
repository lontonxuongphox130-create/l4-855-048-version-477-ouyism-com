import { H as Hls } from './hls-vendor.js';

function setupPlayer(root) {
  var video = root.querySelector('video');
  var button = root.querySelector('[data-play-button]');
  var overlay = root.querySelector('[data-player-overlay]');
  var message = root.querySelector('[data-player-message]');
  var url = root.getAttribute('data-video-url');
  var loaded = false;
  var hls = null;

  function showMessage(text) {
    if (!message) {
      return;
    }
    message.textContent = text;
    message.classList.add('is-visible');
  }

  function load() {
    if (loaded || !video || !url) {
      return;
    }
    loaded = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal) {
          showMessage('播放暂时无法加载，请稍后重试。');
        }
      });
    } else {
      showMessage('播放暂时无法加载，请稍后重试。');
    }
  }

  async function start() {
    load();
    if (!video) {
      return;
    }
    video.controls = true;
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    try {
      await video.play();
    } catch (error) {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    }
  }

  function toggle() {
    if (!video) {
      return;
    }
    if (video.paused) {
      start();
    } else {
      video.pause();
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      start();
    });
  }

  if (video) {
    video.addEventListener('click', toggle);
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 && overlay) {
        overlay.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
