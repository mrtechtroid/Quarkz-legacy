function changeColor(ele){
    c = ele.firstChild
    if(ele.target !== this) {
        console.log(ele,c)
    for (var i = 0; i < document.getElementsByClassName("aq_mcq").length; i++) {
        document.getElementsByClassName("aq_mcq")[i].classList.remove("aq_mcq_ans")
        document.getElementsByClassName("aq_mcq_p")[i].style.borderColor = "yellow"
    }
    c.classList.add("aq_mcq_ans")
    ele.style.borderColor = "lime"
    };
    
}
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var video_id = "4nOn9YLp7AE"
var refer = window.location.search;

function watchonYT(vidID) {
  window.location = "https://youtube.com/watch?v=" + vidID
}
var vid_width = 0.8 * window.innerWidth || 0.8 * document.documentElement.clientWidth || 0.8 * document.body.clientWidth;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '500',
    width: vid_width,
    videoId: video_id,
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'modestbranding': 1,
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
//   event.target.playVideo();
  if (video_id == "4YKpBYo61Cs") {
    player.setVolume(25)
  }
}
var yt_done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !yt_done) {
    setTimeout(stopVideo, 6000);
    yt_done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

function volumechange() {
  if (player.isMuted() = True) {
    dE("volumebar").value = 0
  } else {
    volumebar = dE("volumebar").value
    player.setVolume(volumebar)
  }
  if (player.getVolume() < 100 && player.getVolume() > 50) {
    document.getElementById("mute").classList.replace = "fa fa-volume-up"
  }
  if (player.getVolume() < 50 && player.getVolume() > 0) {
    document.getElementById("mute").classList.replace = "fa fa-volume-down"
  }
  if (player.getVolume() == 0) {
    document.getElementById("mute").classList.replace = "fa fa-microphone-slash"
  }
}

function volumetype() {
  if (player.isMuted() == true) {
    player.unMute()
  } else {
    player.mute()
  }

}