(function(){
function ready(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn)}
ready(function(){
  document.querySelectorAll('.site-search').forEach(function(form){
    form.addEventListener('submit',function(ev){ev.preventDefault();var input=form.querySelector('input');var q=input&&input.value.trim();if(q){location.href='./search.html?q='+encodeURIComponent(q)}})
  });
  var btn=document.querySelector('.mobile-btn');var panel=document.querySelector('.mobile-panel');
  if(btn&&panel){btn.addEventListener('click',function(){panel.classList.toggle('open')})}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));var dots=[].slice.call(document.querySelectorAll('.hero-dot'));var idx=0;
  function show(n){if(!slides.length)return;idx=(n+slides.length)%slides.length;slides.forEach(function(s,i){s.classList.toggle('active',i===idx)});dots.forEach(function(d,i){d.classList.toggle('active',i===idx)})}
  dots.forEach(function(d,i){d.addEventListener('click',function(){show(i)})});
  if(slides.length>1){show(0);setInterval(function(){show(idx+1)},5200)}
  var filter=document.getElementById('catalog-filter');
  if(filter){
    var params=new URLSearchParams(location.search);var initial=params.get('q')||'';if(initial)filter.value=initial;
    var cards=[].slice.call(document.querySelectorAll('.movie-card'));
    function run(){var q=filter.value.trim().toLowerCase();cards.forEach(function(card){var hay=(card.getAttribute('data-key')||'').toLowerCase();card.classList.toggle('hidden-by-filter',q && hay.indexOf(q)===-1)})}
    filter.addEventListener('input',run);run();
  }
  var video=document.getElementById('movie-player');var config=document.getElementById('play-info');
  if(video&&config){
    var src='';try{src=JSON.parse(config.textContent).src||''}catch(e){}
    var box=document.querySelector('.play-layer');var attached=false;var hls=null;
    function attach(){
      if(attached||!src)return;attached=true;
      if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src}
      else if(window.Hls&&window.Hls.isSupported()){hls=new window.Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(src);hls.attachMedia(video)}
      else{video.src=src}
    }
    function start(){attach();var p=video.play();if(p&&p.catch){p.catch(function(){})}if(box)box.classList.add('is-hidden')}
    attach();
    if(box)box.addEventListener('click',start);
    video.addEventListener('play',function(){if(box)box.classList.add('is-hidden')});
    video.addEventListener('pause',function(){if(video.currentTime===0&&box)box.classList.remove('is-hidden')});
    video.addEventListener('click',function(){if(video.paused)start()});
    window.addEventListener('pagehide',function(){if(hls&&hls.destroy)hls.destroy()})
  }
})
})();