function changeColor(ele){
    c = ele.firstChild
    if(ele.target !== this) {
        console.log(ele,c)
    if (document.getElementById("aq_type").value == "mcq"){
      for (var i = 0; i < document.getElementsByClassName("aq_mcq").length; i++) {
        document.getElementsByClassName("aq_mcq")[i].classList.remove("aq_mcq_ans")
        document.getElementsByClassName("aq_mcq_p")[i].style.borderColor = "yellow"
      }
      c.classList.add("aq_mcq_ans")
      ele.style.borderColor = "lime"
    }else {
      if (c.classList.contains("aq_mcq_ans")){
        c.classList.remove("aq_mcq_ans")
        ele.style.borderColor = "yellow"
      }else {
        c.classList.add("aq_mcq_ans")
        ele.style.borderColor = "lime"
      }
    }
    };
    
}
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var video_id = "4nOn9YLp7AE"
var refer = window.location.search;


document.getElementById("tans_btn").addEventListener("click",function(){
  for (var i =0;i<document.getElementsByClassName("q_ans_1").length;i++){
    document.getElementsByClassName("q_ans_1")[i].style.display = "flex"
  }
})
document.getElementById("tansexpl_btn").addEventListener("click",function(){
  for (var i =0;i<document.getElementsByClassName("q_ans_expl").length;i++){
    document.getElementsByClassName("q_ans_expl")[i].style.display = "flex"
  }
})
document.getElementById("tremove_btn").addEventListener("click",function(){
  for (var i =0;i<document.getElementsByClassName("q_ans_1").length;i++){
    document.getElementsByClassName("q_ans_1")[i].style.display = "none"
  }
  for (var i =0;i<document.getElementsByClassName("q_ans_expl").length;i++){
    document.getElementsByClassName("q_ans_expl")[i].style.display = "none"
  }
})

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
  if (player.isMuted() == true) {
    document.getElementById("tb_vl_br").value = 0
  } else {
    volumebar = document.getElementById("tb_vl_br").value
    player.setVolume(volumebar)
  }
  if (player.getVolume() < 100 && player.getVolume() > 50) {
    document.getElementById("mute").innerText = "volume_up"
  }
  if (player.getVolume() < 50 && player.getVolume() > 0) {
    document.getElementById("mute").innerText = "volume_down"
  }
  if (player.getVolume() == 0) {
    document.getElementById("mute").innerText= "volume_off"
  }
}

function volumetype() {
  if (player.isMuted() == true) {
    player.unMute()
    document.getElementById("mute").innerText = "volume_up"
  } else {
    player.mute()
    document.getElementById("mute").innerText= "volume_off"
  }

}
function fullscreen(){
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    document.getElementById("player").style.height = "300px"
  } else {
    element = document.getElementById("tp_full_vid")
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    document.getElementById("player").style.height = "90vh"
  }
}
function mcqchose(ele){
    if(ele.target !== this) {
        console.log(ele)
    for (var i = 0; i < document.getElementsByClassName("tp_mcq_p").length; i++) {
        document.getElementsByClassName("tp_mcq_p")[i].classList.remove("aq_mcq_ans")
        document.getElementsByClassName("tp_mcq_p")[i].style.borderColor = "yellow"
    }
    ele.classList.add("aq_mcq_ans")
    ele.style.borderColor = "lime"
    ele.style.backgroundColor = "grey"
    };
}
if (screen.width < "300px"){
  document.getElementById("overlay").style.display = "block"
}