// Copyright 2021-22 Quarkz!
// Copyright 2021-22 Mr Techtroid
// NO Code From This File Is Allowed To Be
// Used Without the Permission Of The Author
// Author: Mr Techtroid

// QBANK VIDEO
// Slide Controller For QBANK Video
export function vidSlideController(docJSON){
    function iu(ele) { ele.style.display = "none" }
    function io(ele) { ele.style.display = "block" }
    function qif(ele) { ele.style.display = "flex" }
    var tpmcqcon = dE("tb_q_mcq_con")
    var tpmatrix = dE("tb_q_matrix")
    var tpanswer = dE("tb_q_answer")
    tpmcqcon.innerHTML = ""
    dE("tb_q_qtext").innerText = docJSON.title
    dE("tb_q_img").src = docJSON.img
    if (docJSON.type == "mcq" || docJSON.type == "mcq_multiple") {
      qif(tpmcqcon); iu(tpmatrix); iu(tpanswer)
      var qop = docJSON.op; var asi = "";
      for (let ele1 of qop) {
        asi += '<div class="tb_q_mcq_p rpl">' + ele1 + '</div>'
      }
      dE("tb_q_mcq_con").insertAdjacentHTML('beforeend', asi)
    } else if (docJSON.type == "matrix") {
      iu(tpmcqcon); io(tpmatrix); iu(tpanswer);
      var qop1 = docJSON.op1;
      var qop2 = docJSON.op2;
      var qopn1 = qop1.length
      for (var i = 0; i < qopn1; i++) {
        document.getElementsByClassName("tp_i1")[i].innerText = qop1[i]
      }
      for (var i = 0; i < qopn1; i++) {
        document.getElementsByClassName("tp_i2")[i].innerText = qop2[i]
      }
    } else if (docJSON.type == "numerical" || docJSON.type == "fill") {
      iu(tpmcqcon); iu(tpmatrix); io(tpanswer)
    } else if (docJSON.type == "taf") {
      qif(tpmcqcon); iu(tpmatrix); iu(tpanswer)
      var asi = '<div class="tp_mcq_p rpl">True</div><div class="tp_mcq_p rpl">False</div>'
      dE("tp_mcq_con").insertAdjacentHTML('beforeend', asi)
    } else {
      iu(tpmcqcon); iu(tpmatrix); iu(tpanswer);
    }
    renderMathInElement(dE('tp_ans_hold'));
    renderMathInElement(dE('tp_qtext'));
  }
  // Prepares Slides Controller
export async function prepareVideo(){
    dE("qbnk_vid_btn").style.display = "none"
    dE("qbnk_vid_btn_e").style.display = "none"
    try {
      let docSnap = await getDoc(doc(db, "qbank",window.location.hash.split("qbnk_vid/")[1] ))
      if (docSnap.exists()) {
        var docJSON = docSnap.data();
        dE("tb_q_title").innerText = docJSON.name
        dE("qb_vid_ti").innerText = docJSON.name
        dE("qbnk_vid_q").style.display = "none"
          dE("qbnk_vid_ans").style.display = "none"
          dE("qbnk_vid_title").style.display = "flex"
          dE("qbnk_vid_end").style.display = "none"
          dE("watermark").style.display = "none"
        let qllist = docJSON.qllist
        let stream = await recordScreen();
        let mimeType = 'video/mp4';
        fullEle(dE("qbnk_vid"))
        mediaRecorder = createRecorder(stream, mimeType); 
        var ji = 0;
        var ti = 0
        var jno = 0;
        var timer;
        var iou = setInterval(function(){
          dE("qbnk_vid_q").style.display = "none"
          dE("qbnk_vid_ans").style.display = "none"
          dE("qbnk_vid_title").style.display = "none"
          dE("qbnk_vid_end").style.display = "none"
          if (ti == 0){
            dE("qbnk_vid_title").style.display = "flex"
            ti++
          } else if (jno == qllist.length-1) {
            dE("qbnk_vid_end").style.display = "flex"
            mediaRecorder.stop()
            dE("qbnk_vid_btn").style.display = "block"
            clearInterval(iou);
          } else if (ji == 0 || ji == 1){
            vidSlideController(qllist[jno])
            var f = jno +1
            if (ji == 0){
              dE("qbnk_timer").innerText = 10
              timer = setInterval(function(){dE("qbnk_timer").innerText = dE("qbnk_timer").innerText - 1},1000)
            }
            dE("tb_q_qno").innerText = "Question " + f +":"
            dE("qbnk_vid_q").style.display = "flex"
            ji++
          } else if (ji == 2){
            dE("qbnk_vid_ans").style.display = "flex"
            clearInterval(timer);
            var asi = "";
            for (var i = 0;i<qllist[jno].answer.length;i++) {
              asi += '<div class="tb_q_mcq_p rpl" style = "background-color:green">' + qllist[jno].answer[i] + '</div>'
            }
            dE("tb_q_ans").innerHTML = asi
            dE("tb_q_hint").innerText = qllist[jno].hint
            dE("tb_q_expl").innerText = qllist[jno].expl
            ji = 0;
            jno++
          } 
        }, 5000);
      }
    } catch {}
}

function dE(ele) {
    return document.getElementById(ele)
}