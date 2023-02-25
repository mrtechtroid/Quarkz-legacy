/*
Copyright 2021-23 Quarkz By Mr Techtroid

All rights reserved by [Mr Techtroid]. This work is not open-source.

No part of these HTML, CSS, and JavaScript files may be reproduced, distributed, 
or transmitted in any form or by any means, including photocopying, recording, 
or other electronic or mechanical methods, without the prior written permission 
of the author, except in the case of brief quotations embodied in critical reviews 
and certain other noncommercial uses permitted by copyright law.

For permission requests, please contact [Mr Techtroid] at mrtechtroid@outlook.com .
*/
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
  for (var i =0;i<document.getElementsByClassName("q_ans_1").length;i++){
    document.getElementsByClassName("q_ans_1")[i].style.display = "flex"
  }
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
var mytimer;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !yt_done) {
    yt_done = true;
  }
  if (event.data == YT.PlayerState.PLAYING){
    $('#yt_progressBar').show();
      var playerTotalTime = player.getDuration();

      mytimer = setInterval(function() {
        var playerCurrentTime = player.getCurrentTime();
        var playerTimeDifference = (playerCurrentTime / playerTotalTime) * 100;
        var progressBarWidth = playerTimeDifference + "%"
        dE('yt_progressBar_in').style.width =  progressBarWidth
      }, 1000);        
    } else {
      clearTimeout(mytimer);
      $('#yt_progressBar').hide();
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
    if (document.getElementById("tp_question").getAttribute("qtype") == "mcq"){
      for (var i = 0; i < document.getElementsByClassName("tp_mcq_p").length; i++) {
        document.getElementsByClassName("tp_mcq_p")[i].classList.remove("aq_mcq_ans")
        document.getElementsByClassName("tp_mcq_p")[i].style.borderColor = "yellow"
      }
      ele.classList.add("aq_mcq_ans")
      ele.style.borderColor = "lime"
    }else {
      if (ele.classList.contains("aq_mcq_ans")){
        ele.classList.remove("aq_mcq_ans")
        ele.style.borderColor = "yellow"
      }else {
        ele.classList.add("aq_mcq_ans")
        ele.style.borderColor = "lime"
      }
    }
};

if (screen.width < "300px"){
  document.getElementById("overlay").style.display = "block"
}
function updateUI(){
  if (document.getElementById("pe_tst_type_2").checked){
    document.getElementById("equ_gi").innerText = document.getElementById("pe_gi_ins").value
  }
  if (document.getElementById("pe_tst_type_1").checked){
    console.log("hello")
    document.querySelectorAll(".qb_q_ty").forEach(function(e){
      switch (e.innerText){
        case "(mcq)": {e.innerText = e.innerText + "("+document.getElementById("pe_mcq_pno").value+","+document.getElementById("pe_mcq_nno").value+")";break;}
        case "(mcq_multiple)": {e.innerText = e.innerText + "("+document.getElementById("pe_mcmul_pno").value+","+document.getElementById("pe_mcmul_nno").value+")";break;}
        case "(numerical)": {e.innerText = e.innerText + "("+document.getElementById("pe_num_pno").value+","+document.getElementById("pe_num_nno").value+")";break;}
        case "(taf)": {e.innerText = e.innerText + "("+document.getElementById("pe_taf_pno").value+","+document.getElementById("pe_taf_nno").value+")";break;}
        case "(explain)": {e.innerText = e.innerText + "("+document.getElementById("pe_exp_pno").value+","+document.getElementById("pe_exp_nno").value+")";break;}
        case "(matrix)": {e.innerText = e.innerText + "("+document.getElementById("pe_mat_pno").value+","+document.getElementById("pe_mat_nno").value+")";break;}
      }
    })
  }else{
    // location.reload()
  }
}
document.getElementById("pe_tst_type_1").addEventListener('change',updateUI)
document.getElementById("pe_tst_type_2").addEventListener('change',updateUI)
document.getElementById("tsinf_btn").addEventListener('change',updateUI)

$(document).ready(function() {
  $('.summernote').summernote({   
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'underline', 'clear']],
      ['fontname', ['fontname']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'hr']],
      ['view', ['fullscreen', 'codeview']],
      ['help', ['help']]
    ],
  });
});
function dE(id){return document.getElementById(id)}
function getHTML(id){
  return $("#"+id).summernote('code')
}
function setHTML(id,html){
  $("#"+id).summernote('code', html);
}
function notesUIHandler(){
  dE("un_preview").style.display = "none"
  dE("un_edit").style.display = "none"
 if (dE("un_rendermode").value == "preview"){
  dE("un_preview").style.display = "block"
  dE("un_preview").innerHTML = "<h1 style = 'text-align:center'>"+dE("un_title").value+"</h1><br>"+getHTML("un_editable")
 }else if (dE("un_rendermode").value == "edit"){
  dE("un_edit").style.display = "flex"
 }
 dE("uno"+window.location.hash.split("usernotes/")[1]).style.backgroundColor = dE("un_colorpicker").value
}
function sleep(ms) {
  return new Promise(val => setTimeout(val, ms));
}
async function idElementPrint(ref,uname){
  iframe = dE("un_print_iframe")
  const pri = iframe.contentWindow;
  pri.document.open();
  pri.document.write('<head><link rel="stylesheet" href="css/print.css" onload = "print()"></head>')
  pri.document.write(ref.innerHTML);
  pri.document.write('<div class="divFooter" style = "text-align:center;">By ' + uname + ' @ Quarkz!</div>')
  pri.document.close();
  pri.focus();
  // pri.print();
  // pri.onafterprint = () => { document.body.removeChild(iframe); }
}
function examlog(examname, dates, examinfo, syllabus) {
  dE("exam_msg_popup").style.visibility = "visible"
  dE("exam_msg_popup").style.opacity = "1"
  document.getElementById("exam_title").innerText = examname
  document.getElementById("exam_dates").innerText = dates
  dE("exam_einfo").href = examinfo
  dE("exam_syl").href = syllabus
}
function questionGraph(ipd,data){
  try{// Constants for graph dimensions
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  dE(ipd).innerHTML = ""
  // Create SVG element
  const svg = d3
    .select("#"+ipd)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Define color scale for circle fill
  const colorScale = d3
    .scaleOrdinal()
    .domain(["correct", "incorrect", "unattempted"])
    .range(["#2ecc71", "#e74c3c", "#f39c12"]);
  
  // Define circle radius scale based on attempt time
  const radiusScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.time)])
    .range([5, 30]);
  
  // Define x scale for question index
  const xScale = d3
    .scaleLinear()
    .domain([1, data.length])
    .range([0, width]);
  
  // Define y scale for attempt time
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.time)])
    .range([height, 0]);
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", width-120)
    .attr("y", height+40)
    .attr("color","white")
    .text("Question Number");
  
  svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2 + 40)
    .attr("y", -margin.left + 25)
    .text("Time Taken(in s)")
    .attr("color","white");
  // Draw x axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));
  
  // Draw y axis
  svg.append("g").call(d3.axisLeft(yScale));
  
  // Draw circles for each data point
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(i + 1))
    .attr("cy", (d) => yScale(d.time))
    .attr("r", (d) => radiusScale(d.time))
    .attr("fill", (d) => {
        return colorScale(d.type);
    }).append("text")
      .text(function(d) { return d.no; })
      var circleGroups = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
          return "translate(" + xScale(d.time) + "," + yScale(d.questionNumber) + ")";
      });
  // add circles to each group
  circleGroups.append("circle")
      .attr("r", function(d) { return sizeScale(d.time); })
      .attr("fill", function(d) {
          if (d.result == "correct") {
              return "green";
          } else if (d.result == "incorrect") {
              return "red";
          } else {
              return "gray";
          }
      });
  
  // add labels to each group
  circleGroups.append("text")
      .text(function(d) { return "Q" + d.no; })
      .attr("x", function(d) { return sizeScale(d.time) + 5; })
      .attr("y", 5);
}catch{}}
