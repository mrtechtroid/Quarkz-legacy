// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, orderBy, limit,writeBatch, collection, addDoc, onSnapshot, arrayUnion, arrayRemove, setDoc, updateDoc, getDocs, doc, serverTimestamp, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN8T7Pmw5e-LzmC3nAHEqI0Uk7FF7y6fc",
  authDomain: "quarkz.firebaseapp.com",
  projectId: "quarkz",
  storageBucket: "quarkz.appspot.com",
  messagingSenderId: "1050835442263",
  appId: "1:1050835442263:web:e7d05ca9373f2f6083a112",
  measurementId: "G-1Y3S45VWFH"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// Helper Functions
// StackOverFlow - https://stackoverflow.com/a/52387803
function sd(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay
}
// StakOverflow: https://stackoverflow.com/a/1349426/15107474
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}
// StakOverflow: https://stackoverflow.com/a/48161723
async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);                    

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
// Get Time Of Server
function getServerTime(url){
  fetch(url)
  .then((response) => {
      var date;
    for (var pair of response.headers.entries()) { // accessing the entries
      if (pair[0] === 'date') {
          date = new Date(pair[1]).getTime()
          console.log(date)
      }
    }
    return date;
  });
}
// Make A Element Full Screen
function fullEle(ele){
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) { /* Firefox */
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) { /* IE/Edge */
    ele.msRequestFullscreen();
  }
}
// Get Elements With ID in Short Form
function dE(ele) {
  return document.getElementById(ele)
}
// Make Elements Latex Rendered
function renderMarkedMath(eleid, toid) {
  var v = marked.parse(dE(eleid).value)
  dE(toid).innerHTML = v
  renderMathInElement(dE(toid));
}
function log(msg){
  window.location = "#msg_popup"
  dE("msg_popup").style.visibility = "visible"
  dE("msg_popup").style.opacity = "1"
  document.getElementById("msg_popup_txt").innerText = "Log"
  document.getElementById("msg_popup_content").innerText = msg
}
// https://www.educative.io/edpresso/how-to-create-a-screen-recorder-in-javascript
let mediaRecorder;
async function recordScreen() {
  return await navigator.mediaDevices.getDisplayMedia({
      audio: true, 
      video: { mediaSource: "screen"}
  });
}
function createRecorder (stream, mimeType) {
  // the stream data is stored in this array
  let recordedChunks = []; 

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }  
  };
  mediaRecorder.onstop = function () {
     saveFile(recordedChunks);
     recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
}

function saveFile(recordedChunks){

   const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });
    let filename = window.prompt('Enter file name'),
        downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}
function gST(){return getServerTime("https:/quarkz.netlify.app/time")}
// -----------------------------------------------------------------------------------------------
// Sign In A User
async function signIn() {
  var email = dE("lg_uname").value;
  var password = dE("lg_pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      userdetails.email = email
      locationHandler("dashboard", 1);
      dE("lg_uname").value = ""
      dE("lg_pass").value = ""
      spoints.style.display = "block"
      dE("dsh_btn").style.display = "block"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      dE("lgn_err").style.display = "block"
      dE("lg_pass").value = ""
    });
}
// Sign Out A User
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
  userdetails = []
  // locationHandler("login",1);
}
// Register A User
function signUp() {
  var email = dE("rg_uname").value;
  var password = dE("rg_pass").value;
  var name = dE("rg_name").value;
  var mblno = dE("rg_mbleno").value;
  var stclass = dE("rg_class").value;
  if (email == "" || password == "" || name == "" || mblno == "" || stclass == ""){
    alert("Details Cannot Be Empty")
  }
  if (password != dE("rg_pass1").value) {
  }
  else {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        async function a() {
          // Add a new message entry to the Firebase database.
          try {
            await setDoc(doc(db, 'users', user.uid), {
              name: name,
              class: stclass,
              mblno: mblno,
              email: email,
              spoints: 0,
              sgndon: serverTimestamp(),
              roles: { user: true }
            });
          }

          catch (error) {
            console.error('Error writing new message to Firebase Database', error);
          }
        }
        a();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

  }

}
// Important: Handles All Locations
function locationHandler(newlocation, n1) {
  var iorole = adminrole == true || editorrole == true
  if (iorole) { dE("adminonly").style.display = "flex";dE("tp_pnt").style.display = "block";dE("sms_edit").style.display = "block" } else { dE("adminonly").style.display = "none"; dE("sms_edit").style.display = "none"}
  dE(handlebox).classList.remove("_open")
  if (n1 == 1) { window.location.hash = "#/" + newlocation }
  handlebox = newlocation
  location1 = window.location.hash.split("#/")[1]

  switch (location1) {
    case "profile": handlebox = "profile"; break;
    case "editprofle": handlebox = "editprofile"; break;
    case "about": handlebox = "aboutus"; break;
    case "login": handlebox = "login"; break;
    case "dashboard": handlebox = "dashboard"; break;
    case "timetable": handlebox = "schedule"; break;
    case "logout": signOut(); break;
    case "livequiz": handlebox = "livequiz"; break;
    case "register": handlebox = "register"; break;
    case "testinfo": handlebox = "testinfo";renderTestList("active"); break;
    case "legal": handlebox = "legal"; break;
    case "forum": handlebox = "forum"; break;
    case "qblist": handlebox = "qbanklist"; displayTopicList(2); break;
    case "tpclist": handlebox = "topiclist"; displayTopicList(1); break;
    case "simlist": handlebox = "simlist"; getSimList(); break;
    case "testend": handlebox = "test_end";break;
    case "add/question": handlebox = "fu_question";break;
    case "add/lesson": handlebox = "fu_lesson";newLesson();break;
    case "add/tpc": handlebox = "fu_topic";newTopic();break;
    case "add/images": handlebox = "fu_images";break;
    case "add/qubank": handlebox = "fu_topic";newQBank();break;
    case "add/simulation": handlebox = "fu_simulation";newSimulation();break;
    case "add/tests": handlebox = "fu_tests";break;
    case "chplist": handlebox = "chapterlist";break;
    default: handlebox = "error_page"; break;
  }

  if (location1.includes("instructions")){handlebox = "test_instructions";}
  if (location1.includes("cyberhunt")){handlebox = "cyberhunt";getCyberhunt()}
  if (location1.includes("sims")) { handlebox = "simulations"; getSimulation() }
  if (location1.includes("qbanks")) { handlebox = "topic"; getTopic(2); }
  if (location1.includes("qbnk_vid")) { handlebox = "qbnk_vid";dE("qbnk_vid_btn").style.display = "block" }
  if (location1.includes("attempt")) { handlebox = "testv1"; getTestInfo()}
  if (location1.includes("printable/qbank") && iorole == true) { handlebox = "printable"; printQBank(1); }
  if (location1.includes("printable/topic") && iorole == true) { handlebox = "printable"; printQBank(2); }
  if (location1.includes("printable/tests") && iorole == true) { handlebox = "printable"; printQBank(3); }
  if (location1 == "functions" && iorole == true) { handlebox = "functions"; changeItem() }
  // if (location1.includes("update") && iorole == true) { handlebox = "functions"; changeItem() }
  if (location1.includes("users") && iorole == true) { handlebox = "users"; userUpdate() }
  if (location1.includes("topic")) { handlebox = "topic"; getTopic(1); }
  if (location1.includes("livequiz")) { handlebox = "livequiz"; lquizinit(); }
  if (location1.includes("edit_sim")) { handlebox = "fu_simulation"; prepareSimulation() }
  if (location1.includes("edit_lesson")) { handlebox = "fu_simulation"; prepareLesson() }
  if (location1.includes("edit_tpc")) { handlebox = "fu_topic"; prepareTopicQBank(1) }
  if (location1.includes("edit_qubank")) { handlebox = "fu_topic"; prepareTopicQBank(2) }
  if (userrole == false || userrole == null || userrole == undefined) { handlebox = "error_page" }
  if (location1 == "login") { handlebox = "login" }
  if (location1 == "register") { handlebox = "register" }
  dE(handlebox).classList.add("_open")
  chgby = 1;
  stpVid()
}
function vidSlideController(docJSON){
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
async function prepareVideo(){
  dE("qbnk_vid_btn").style.display = "none"
  dE("qbnk_vid_btn_e").style.display = "none"
  fullEle(dE("qbnk_vid"))
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
      let mimeType = 'video/webm';
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
// -----------------------
// SIMULATIONS
// Get Simulation Details
async function newSimulation(){
  try {
    
    const docRef = await addDoc(collection(db, 'sims'), {
      name: "",
      license: "",
      provider: "",
      url: "",
    })
    locationHandler("edit_sim/"+docRef.id,1)
  } catch {

  }
}
async function prepareSimulation(){
  try {
    let docSnap = await getDoc(doc(db, 'sims', window.location.hash.split("edit_sim/")[1]))
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      dE("aq_simname").value = docJSON.name
      dE("aq_simprov").value = docJSON.provider
      dE("aq_simurl").value = docJSON.url
      dE("aq_simlicense").value = docJSON.license
      dE("aq_simsubj").value = docJSON.subject
    }
  } catch {}
}
async function updateSimulationWeb(){
  try {
    await updateDoc(doc(db, 'sims',window.location.hash.split("edit_sim/")[1]), {
      name: dE("aq_simname").value,
      license: dE("aq_simlicense").value,
      provider: dE("aq_simprov").value,
      url: dE("aq_simurl").value,
      subject:dE("aq_simsubj").value
    });
    var subj = dE("aq_simsubj").value
    if (subj == "physics") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        physics: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "chemistry") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        chemistry: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "maths") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        maths: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "computer") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        computer: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "biology") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        biology: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "statistics") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        statistics: arrayUnion(dE("aq_simname").value)
      })
    }
    if (subj == "unfiled") {
      await updateDoc(doc(db, 'sims', 'sims'), {
        unfiled: arrayUnion(dE("aq_simname").value)
      })
    }
    clearAQ();
  } catch (error) {
    console.error('Error writing new message to Firebase Database', error);
  }
}
async function getSimulation() {
  var simid = window.location.hash.split("sims/")[1]
  var docRef = doc(db, 'sims', simid)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var docJSON = docSnap.data();
    dE("sms_name").innerText = docJSON.name
    dE("sms_prov").innerText = docJSON.provider
    dE("sim_frame").src = docJSON.url
  }
  else { locationHandler("error_page", 1); throw new Error }
}
// Get SimID From SimName
async function getSimID(sim_name) {
  var docID;
  const q = query(collection(db, "sims"), where("name", "==", sim_name));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docID = doc.id
  });
  locationHandler("sims/" + docID, 1)
}
// Helper Function To Get Simulation Name
function simClicker() {
  getSimID(this.innerText)
}
// Get Simulation List
async function getSimList(type) {
  dE("sim_cont").innerHTML = ""
  if (simlist.length == 0){
    var docRef = doc(db, 'sims', 'sims')
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) { var docJSON = docSnap.data(); simlist = docJSON;}
    else { locationHandler("error_page", 1); throw new Error }
  }
  if (type == "physics"){
    try {
      for (let ele of simlist.physics) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "chemistry"){
    try {
      for (let ele of simlist.chemistry) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:red" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "maths"){
    try {
      for (let ele of simlist.maths) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:blue" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "biology"){
    try {
      for (let ele of simlist.biology) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:green" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "computer"){
    try {
      for (let ele of simlist.computer) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:violet" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "statistics"){
    try {
      for (let ele of simlist.statistics) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:orange" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "unfiled"){
    try {
      for (let ele of simlist.unfiled) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:white" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
}
// -----------------------
// TOPIC/QBANK
function addItemToQLLIst(){
  var qans = dE("aq_answer").value
  var qtype = dE("aq_type").value
  var qop = [];
  var qop1 = [];
  var qop2 = [];
  if (qtype == "mcq" || qtype == "mcq_multiple"){
    qans = []
    for (i = 0; i < document.getElementsByClassName("aq_mcq_ans").length;i++){
      var a = document.getElementsByClassName("aq_mcq_ans")[i].value;
      qans[i] = a 
    }
  }
  for (var i = 0; i < document.getElementsByClassName("aq_mcq").length; i++) {
    qop.push(document.getElementsByClassName("aq_mcq")[i].value)
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i1").length; i++) {
    qop1.push(document.getElementsByClassName("aq_i1")[i].value)
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i2").length; i++) {
    qop2.push(document.getElementsByClassName("aq_i2")[i].value)
  }
  var json = {id:curr_qlid,mode: dE("aq_mode").value,title: dE("aq_qtext").value,y_url: dE("aq_yurl").value,img: dE("aq_imgurl").value,hint: dE("aq_hint").value,expl: dE("aq_expl").value,type: qtype,answer: qans,op: qop,op1: qop1,op2: qop2}
  console.log(json)
  return json
}
function rEQL(u){
  renderEditQLList(this.innerText)
}
function unique(){
  return sha256();
}
// log(unique())
function renderEditQLList(qno) {
  // if (editqllist.length != 0){
    if (qno == "+"){
      let po = editqllist.length
      // dE("question_list").insertAdjacentHTML('beforeend','<span class = "t_no_qno" id = "t_no_qno_'+po+'">'+po+'</span>')
      // dE("t_no_qno_"+po).addEventListener("click",rEQL)
      editqllist[po] = {id:Date.now()+Math.random().toString(36).substr(2),mode: "",title: "",y_url: "",img: "",hint: "",expl:"",type: "mcq",answer: ["1"],op: ["1","2","3","4"],op1: [],op2: []}
      qno = po
    }
    dE("question_list").innerHTML = ""
    for (var i = 1;i<editqllist.length+1;i++){
      dE("question_list").insertAdjacentHTML('beforeend','<span class = "t_no_qno" id = "t_no_qno_'+i+'">'+i+'</span>')
      dE("t_no_qno_"+i).addEventListener("click",rEQL)
    }
    dE("question_list").insertAdjacentHTML('beforeend','<span class = "t_no_qno" id = "t_no_qno_add">+</span>')
    dE("t_no_qno_add").addEventListener("click",rEQL)
  // }
  if (qno != 0){
    editqllist[curr_qlno-1] = addItemToQLLIst()
    curr_qlno = qno;
  }else {
    // curr_qlno = 1
    // editqllist[0] = addItemToQLLIst()
    // dE("question_list").innerHTML = ""
    // dE("question_list").insertAdjacentHTML('beforeend','<span class = "t_no_qno" id = "t_no_qno_'+1+'">'+1+'</span>')
    // dE("t_no_qno_"+1).addEventListener("click",rEQL)

  }
  
  var op = editqllist[curr_qlno-1]
  curr_qlid = op.id
  dE("aq_mode").value = op.mode
  dE("aq_qtext").value = op.title
  dE("aq_yurl").value = op.y_url
  dE("aq_imgurl").value = op.img
  dE("aq_type").value = op.type
  dE("aq_hint").value = op.hint
  dE("aq_expl").value = op.expl
  if (op.type == "mcq" || op.type == "mcq_multiple"){
      dE("aq_mcq_con").innerHTML = ""
      for (var g = 0;g<op.op.length;g++){
        addMCQ()
        document.getElementsByClassName("aq_mcq")[g].value = op.op[g]
        for (var h = 0; h<op.answer.length;h++){
          if (op.op[g] == op.answer[h]){
            // window.changeColor(document.getElementsByClassName("aq_mcq")[g])
            document.getElementsByClassName("aq_mcq")[g].classList.add("aq_mcq_ans")
            document.getElementsByClassName("aq_mcq_p")[g].style.borderColor = "lime"
          }
      }
    }
  } else if (qtype == "num"){}
  changeItem()
}
async function newTopic(){
  try {
    
    const docRef = await addDoc(collection(db, 'topic'), {
      name: "",
      qllist: [],
      level: "jee",
      chid: "",
      chname:"",
      subject:""
    })
    locationHandler("edit_tpc/"+docRef.id,1)
  } catch {
  }
}
async function newQBank(){
  try {
    
    const docRef = await addDoc(collection(db, 'qbank'), {
      name: "",
      qllist: [],
      level: "jee",
      chid: "",
      chname:"",
      subject:""
    })
    locationHandler("edit_qubank/"+docRef.id,1)
  } catch {
  }
}
async function prepareTopicQBank(iun) {
  var col,id;
  if (iun == 1){
    // Topic
    col = 'topic'
    id = window.location.hash.split("edit_tpc/")[1]
    dE("fu_topic_title").innerText = "Add/Edit Topic"
    dE("aq_mode").innerHTML = `<option value="question">Question</option><option value="lesson">Lesson</option>`
    dE("aq_tpc_save").style.display = "block"
    dE("aq_qbc_save").style.display = "none"

  } else if (iun == 2){
    // QBank
    col = 'qbank'
    id = window.location.hash.split("edit_qubank/")[1]
    dE("fu_topic_title").innerText = "Add/Edit QBank"
    dE("aq_mode").innerHTML = `<option value="question">Question</option>`
    dE("aq_tpc_save").style.display = "none"
    dE("aq_qbc_save").style.display = "block"

  }
  try {
    let docSnap = await getDoc(doc(db, col,id ))
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      dE("aq_tpcname").value = docJSON.name
      dE("aq_tpclevel").value = docJSON.level
      dE("aq_tpc_chaptername").value = docJSON.chname
      dE("aq_tpc_subj").value = docJSON.subject
      dE("aq_tpc_chapterid").value = docJSON.chid
      editqllist = docJSON.qllist
      // log(JSON.stringify(docJSON))
      renderEditQLList(0)
      
    }
  } catch {} 
}
async function updateTopicQBank(iun){
  addItemToQLLIst()
  var col,id;
  if (iun == 1){
    // Topic
    col = 'topic'
    id = window.location.hash.split("edit_tpc/")[1]

  } else if (iun == 2){
    // QBank
    col = 'qbank'
    id = window.location.hash.split("edit_qubank/")[1]
  }
  try {
    
    const docRef = await updateDoc(doc(db, col ,id), {
      name: dE("aq_tpcname").value,
      qllist: editqllist,
      level: dE("aq_tpclevel").value,
      chid: dE("aq_tpc_chapterid").value,
      chname:dE("aq_tpc_chaptername").value,
      subject:dE("aq_tpc_subj").value
    })
  } catch {
  }
}
async function getChapterEList(){
  dE("aq_tpc_chaptername").innerHTML = ""
  var docRef = doc(db, 'chapter', dE("aq_subj").value)
  var docSnap = await getDoc(docRef);
  var iupa, docJSON;
  var poll = ""
  if (docSnap.exists()) { var docJSON = docSnap.data(); iupa = docJSON.topics }
    for (let ele of iupa) {
      poll = poll + "<option value = '" + ele + "'>" + ele + "</option>"
    }
  dE("aq_tpc_chaptername").insertAdjacentHTML('beforeend', poll)
}
async function changeItem(t) {
  function iu(ele) { ele.style.display = "none" }
  function io(ele) { ele.style.display = "block" }
  function qif(ele) { ele.style.display = "flex" }
  var mode = dE("aq_mode").value
  var qcont = dE("aq_ans_hold")
  var qtype = dE("aq_type")
  var qans = dE("aq_answer")
  var qyurl = dE("aq_yurl")
  var qmcq = dE("aq_mcq_con")
  var qmat = dE("aq_matrix")
  var qimgupl = dE("aq_upl")
  var qqall = dE("aq_all")
  var qtpc = dE("aq_tpc")
  var qqbk = dE("aq_qbk")
  var qsims = dE("aq_sims")
  // var qsubj = dE("aq_subject").value
  if (mode == "question") {
    iu(qyurl); io(qcont); io(qtype); io(qans);  qif(qqall);
  } else if (mode == "lesson") {
    io(qyurl); iu(qcont); iu(qtype); iu(qans);  qif(qqall);
  }
  if (qtype.value == "mcq" || qtype.value == "mcq_multiple") {
    qif(qmcq); iu(qmat); iu(qans)
  } else if (qtype.value == "matrix") {
    io(qmat); iu(qmcq); iu(qans)
  } else {
    iu(qmat); iu(qmcq); io(qans)
  }
}
// Show The Topic Details -- Depreciated
function displayTopicList(type) {
  var divID,urlID,childID,eleList;
  if (type == 1){
    divID = "tli_cont"; urlID = "topic/"; eleList = topiclist;childID = "tl";
  } else if (type == 2){
    divID = "qb_cont"; urlID = "qbanks/"; eleList = qlist;childID = "qbq";
  }
  console.log(topiclist)
  dE(divID).innerHTML = ""
  for (var i = 0;i<eleList.length;i++) {
    var a = "<span class = 'tlinks rpl' id = '"+childID + eleList[i].no + "'>" + eleList[i].name + "</span>"
    dE(divID).insertAdjacentHTML('beforeend', a);
    dE(childID + eleList[i].no).addEventListener("click", function () {
      locationHandler(urlID + this.id.split(childID)[1], 1);
    })
  }
}
// Get Topic Info3
async function getTopic(type) {
  var fireID = ""; var urlID = "";
  if (type == 1) { fireID = "topic"; urlID = "topic" }
  else if (type == 2) { urlID = "qbanks"; fireID = "qbank" }
  else { fireID = "topic" }

  var urlC = urlID + "/"
  var topicno = window.location.hash.split(urlC)[1]

  var docRef = doc(db, fireID, topicno)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { locationHandler("error_page", 1); throw new Error }

  topicJSON = {}
  topicJSON.title =  docJSON.name
  topicJSON.qllist=docJSON.qllist
  // for (let ele in docJSON.lesson) {
  //   topicJSON.push(["lessons", docJSON.lesson[ele]])
  // }
  // for (let ele in docJSON.questions) {
  //   topicJSON.push(["questions", docJSON.questions[ele]])
  // }
  topicHandler(3)
}
// Print Question Bank
async function printQBank(type) {
  var fireID = "";
  if (type == 1) { fireID = "qbank" }
  else if (type == 2) { fireID = "topic" }
  else if (type == 3) { fireID = "tests" }
  else { fireID = "qbank" }
  var qbankno = window.location.hash.split("printable/" + fireID + "/")[1]
  var qbanktitle = dE("qb_title")
  var docRef = doc(db, fireID, qbankno)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var docJSON = docSnap.data(); qnos = docJSON.qllist;
    qbanktitle.innerText = docJSON.name;
  }
  else { locationHandler("error_page", 1); throw new Error }


  var qnos, qtitle, qtype, qimg;
  dE("eqb_add").innerHTML = ""

  for (let ele of qnos) {
      var docJSON = ele
      qtitle = docJSON.title;
      qtype = docJSON.type;
      qimg = docJSON.img;

      
      var inhtml = '<div class = "qb_q"><span id = "' + ele.id + '">' + qtitle + '<div class = "qb_q_ty">(' + qtype + ')</span></div>'
      dE("eqb_add").insertAdjacentHTML('beforeend', inhtml);
      if (qimg != "") {
        var iwo = '<div class = "qb_img"><img src = "' + qimg + '"></div>'
        dE(ele.id).insertAdjacentHTML('beforeend', iwo)
      }
      var asi = "";
      if (qtype == "mcq" || qtype == "mcq_multiple") {
        var qop = docJSON.op;
        for (let ele1 of qop) {
          asi += "<div class = 'qb_mcq_opt'>" + ele1 + '</div>'
        }
        var qrt = '<div class = "qb_mcq" type = "a">' + asi + '</div>'

      }
      if (qtype == "taf") {
        qrt = '<ol class = "qb_mcq" type = "a"><li>True</li><li>False</li></ol>'
      }
      if (qtype == "explain" || qtype == "numerical") { qrt = "" }

      if (qtype == "matrix") {
        var qop1 = docJSON.op1;
        var qop2 = docJSON.op2;
        var qopn1 = qop1.length
        for (var i = 0; i < qopn1; i++) {
          asi += "<tr><td>" + qop1[i] + '</td><td>' + qop2[i] + '</td>'
        }
        qrt = '<table>' + asi + '</table>'
      }
      
      dE(ele.id).insertAdjacentHTML('beforeend', qrt)
      renderMathInElement(dE('eqb_add'));
  }
  dE("printable").insertAdjacentHTML('beforeend', '<br></br>')
}
function getChapterList(subj){
  
}
async function addItemWeb(){
  var qmode = dE("aq_mode").value
  switch (qmode){
    case "question": addQuestionWeb();break;
    case "lesson": updateLessonWeb();break;
    case "simulation": updateSimulationWeb();break;
    case "topic": addTopicWeb();break;
    case "tests": addTestsWeb();break;
  }
}
async function lessonRenderer(docJSON) {
  dE("tp_question").style.display = "none"
  dE("tp_lesson").style.display = "block"
  // function findlesson(lessonid){
  //   var a = lessonlist.length
  //   for (var i=0;i<a;i++){
  //       if (lessonlist[i].lessonid == lessonid){
  //         return i
  //       }
  //   }
  // }
  // var lessID = findlesson(lessonid)
  // if ( lessID == undefined || lessID == null ){
  //   var docJSON
  //   var docRef = doc(db, "lesson", lessonid)
  //   var docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) { docJSON = docSnap.data(); }
  //   else { locationHandler("error_page", 1); throw new Error }
  //   var lessonElement = {lessonid:lessonid,title:docJSON.title,expl:docJSON.expl,img:docJSON.img,y_url:docJSON.y_url}
  //   lessonlist.push(lessonElement)
  //   lessID = findlesson(lessonid)
  //   console.log(docJSON)
  // }
  loadVid(docJSON.y_url)
  dE("tp_lsno").innerText = docJSON.title
  dE("tp_expl").innerText = docJSON.expl
  dE("tp_lsimg").src = docJSON.img
}
async function questionRenderer(docJSON, type) {
  function iu(ele) { ele.style.display = "none" }
  function io(ele) { ele.style.display = "block" }
  function qif(ele) { ele.style.display = "flex" }
  var tpmcqcon = dE("tp_mcq_con")
  var tpmatrix = dE("tp_matrix")
  var tpanswer = dE("tp_answer")
  dE("tp_lsno").innerText = "Question"
  dE("tp_question").style.display = "flex"
  dE("tp_lesson").style.display = "none"
  tpmcqcon.innerHTML = ""
  dE("tp_qtext").innerText = docJSON.title
  dE("tp_img").src = docJSON.img
  if (docJSON.type == "mcq" || docJSON.type == "mcq_multiple") {
    qif(tpmcqcon); iu(tpmatrix); iu(tpanswer)
    var qop = docJSON.op; var asi = "";
    for (let ele1 of qop) {
      asi += '<div class="tp_mcq_p rpl" onclick = "mcqchose(this)">' + ele1 + '</div>'
    }
    dE("tp_mcq_con").insertAdjacentHTML('beforeend', asi)
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
async function topicHandler(type) {
  var pol;
  if (type == 1) { pol = -1 } else { pol = 1 }
  if ((topicJSONno < topicJSON.qllist.length) && type == 2) {
    topicJSONno = topicJSONno + pol
  } else if (type == 1 && (topicJSONno > 0)) {
    topicJSONno = topicJSONno + pol
  }
  if (type == 3) { topicJSONno = 0 }
  var a = topicJSON.title
  // console.log(a)
  dE("tp_title").innerText = a
    // console.log(a[1])
  var cddd = topicJSON.qllist[topicJSONno]
  // console.log(cddd)
  if (cddd.mode == "lesson") { lessonRenderer(cddd) }
  else if (cddd.mode == "question") { questionRenderer(cddd) }
  stpVid();
}
function addMCQ() {
  var MCQ = `<div class="aq_mcq_p" onclick="changeColor(this)"><input class="aq_mcq"></div>`
  dE("aq_mcq_con").insertAdjacentHTML('beforeend', MCQ)
}
function clearAQ() {
  dE("aq_qtext").value = ""
  dE("aq_answer").value = ""
  dE("aq_yurl").value = ""
  dE("aq_imgurl").value = ""
  dE("aq_expl").value = ""
  dE("aq_hint").value = ""
  // dE("aq_type").value = "mcq"
  for (var i = 0; i < document.getElementsByClassName("aq_mcq").length; i++) {
    document.getElementsByClassName("aq_mcq")[i].value = ""
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i1").length; i++) {
    document.getElementsByClassName("aq_i1")[i].value = ""
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i2").length; i++) {
    document.getElementsByClassName("aq_i2")[i].value = ""
  }
}
function removeMCQ() {
  document.getElementsByClassName("aq_mcq_p")[document.getElementsByClassName("aq_mcq").length - 1].remove()
}
function initFirebaseAuth() {
  // Listen to auth states.
  onAuthStateChanged(getAuth(), authStateObserver);
  // locationHandler("dashboard", 1)
}
function shuffleQBank() {
  var ol = dE("eqb_add")
  for (var i = ol.children.length; i >= 0; i--) {
    ol.appendChild(ol.children[Math.random() * i | 0]);
  }
}
async function authStateObserver(user) {
  var uname = dE("prf_uname")
  var upic = dE("prf_pphoto")
  var name = dE("prf_name")
  var phone = dE("prf_phone")
  var email = dE("prf_email")
  // var course = dE("prf_course")
  var stclass = dE("prf_class")
  var batch = dE("prf_batch")
  var gender = dE("prf_gender")
  var crton = dE("prf_crton")
  var tmtifr = dE("tmt_frame")
  var spoints = dE("spoints")
  var courseno, batchno, calenid;
  if (user) {
    var docRef = doc(db, "users", user.uid);
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      userinfo = docJSON
      userinfo.uuid = user.uid
      uname.textContent = docJSON.email
      name.textContent = docJSON.name
      phone.textContent = docJSON.mblno
      email.textContent = docJSON.email
      stclass.textContent = docJSON.class
      crton.textContent = new Date(docJSON.sgndon.seconds*1000)
      gender.textContent = docJSON.gen
      batchno = docJSON.batch
      courseno = docJSON.course
      spoints.textContent = docJSON.spoints
      userrole = docJSON.roles['user']
      editorrole = docJSON.roles['editor']
      adminrole = docJSON.roles['admin']
    }
    if (docJSON.deleted == true){
      dE("overlay").style.display = "block"
      signOutUser()
      alert("This User Account Has Been Deleted")
    }
    try {
    var docRef = doc(db, "batch", batchno)
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      batch.textContent = docJSON.name;
      calenid = docJSON.timetable
      console.log(docJSON.tpcs.length)
      getTestList(batchno,user.uid)
      var iframeurl = "https://calendar.google.com/calendar/embed??height=600&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FKolkata&showTitle=0&showCalendars=0&showTabs=0&showPrint=0&showDate=1&src=" + calenid + "%40group.calendar.google.com&amp;ctz=Asia%2FKolkata"
      tmtifr.src = iframeurl
      for (var i = 0; i < docJSON.tpcs.length; i++) {
        console.log(docJSON.tpcs[i].topicname,docJSON.tpcs[i].topicno)
        topiclist.push({name:docJSON.tpcs[i].topicname, no:docJSON.tpcs[i].topicno})
      }
      console.log(topiclist)
      for (var i = 0; i < docJSON.qbank.qbanktitle.length; i++) {
        qlist.push({name:docJSON.qbank.qbanktitle[i], no:docJSON.qbank.qbankid[i]})
      }
    }} catch {}
    spoints.style.display = "block"
    dE("dsh_btn").style.display = "block"
    if (window.location.hash == "" || window.location.hash == null || window.location.hash == undefined ){
      // locationHandler("dashboard", 1);
      window.location.hash = "#/dashboard"
      autosignin = 1;
    }
    locationHandler( window.location.hash.split("#/")[1], 1)
  } else {
    uname.textContent = ""
    name.textContent = ""
    phone.textContent = ""
    email.textContent = ""
    stclass.textContent = ""
    spoints.textContent = ""
    spoints.style.display = "none"
    dE("dsh_btn").style.display = "none"
    dE("tp_pnt").style.display = "none"
    locationHandler("login", 1)
    if (autosignin == 1){
      document.location.reload()
    }
    // 
  }
}
function uploadImages() {
  var a = serverTimestamp()
  var file = dE("aq_file")
  var filecontent;
  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    filecontent = text.replace("","")
    const storageRef = ref(storage, a);
  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    // console.log('Uploaded a blob or file!');
  });
  };
  reader.readAsText(file.files[0]);
}
function rndAQ() {
  renderMarkedMath("aq_qtext", "aq_renderer")
}
function signUpRestrict() {
  alert("The App Is Invite Only Registrations Are NOT Available Right Now")
}
async function sndMsg() {
  var qtxt = dE("fm_message").value
  await addDoc(collection(db, "forum"), {
    name: userinfo.name,
    message: qtxt,
    userid: userinfo.uuid,
    sgndon: serverTimestamp()
  })
  dE("fm_message").value = ""
}
function displayMessage(id, time, name, text) {
  var d = "<span id = 'dM" + id + "'><span class = 'dmName'>" + name + ": </span><span class = 'dmText'>" + text + "</span><span class = 'dmtime'>" + time + "</span></span><br>"
  dE("forum_live").insertAdjacentHTML("beforeend", d)
}
function deleteMessage(id) { dE("dM" + id).remove() }
async function gtMsg() {
  dE("forum_live").innerHTML = ""
  const recentMessagesQuery = query(collection(getFirestore(), 'forum'), orderBy('sgndon', 'desc'), limit(12));
  const querySnapshot = await getDocs(recentMessagesQuery);
  querySnapshot.forEach((doc) => {
    var c = doc.data()
    displayMessage(doc.id, "", c.name, c.message)
    // // console.log(doc)
  });

}
function checkQuestion() {

}
function printStuff(){
  if (window.location.hash.includes("topic")){
    changeLocationHash("printable/topic/"+ window.location.hash.split("topic/")[1],1)
  } else if (window.location.hash.includes("qbanks")){
    changeLocationHash("printable/qbank/"+ window.location.hash.split("qbanks/")[1],1)
  }
}
function changeLocationHash(ele,v){
  window.location.hash = "#/"+ele
  if (ele == "dashboard"){locationHandler("dashboard",1)}
}
async function lquizinit() {
  lquizcode = location1.split("livequiz")[1]
  var docRef = doc(db, 'livequiz', lquizcode)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { throw new Error }
}
async function getTestList(batchid,userid){
  if (testList != []){
    var docRef = doc(db, "batch", batchid,"info","tests");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      console.log(docJSON)
      testList = docJSON.tests;
    }
  }
  if (finishedTestList != [])
  {
    
    const q = query(collection(db,"tests"),where("finished", "array-contains", userid),limit(5));
    console.log(userid)
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      var min = doc.data()
      var docJSON = {title:min.title,testid:doc.id,finished:true,strton:min.strton,endon:min.endon}
      finishedTestList.push(docJSON)
      console.log(docJSON)
      var a =0
      for (let ele of testList){
        if (ele.testid == docJSON.testid){
          testList[a].finished= true
        }else {testList[a].finished= false}
        a +=1 
      }
    });
  }
  console.log(testList)
  var localtime = parseInt(Date.now()/1000)
  for (var d = 0;d<testList.length;d++){
    if (localtime > testList[d].strton.seconds && localtime < testList[d].endon.seconds){
      activeTestList.push(testList[d])
    } else if (localtime < testList[d].strton.seconds){
      upcomingTestList.push(testList[d])
    }
  }
  // console.log(testList,activeTestList,upcomingTestList,finishedTestList)
}
function testClicker(){
  window.location.hash = "#/instructions/" + this.id.split("T")[1]
}
function finishedtestClicker(){
  window.location.hash = "#/finished/" + this.id.split("T")[1]
}
function renderTestList(type){
  var renList;
  if (type == "active"){
    renList = activeTestList
  }else if (type == "upcoming"){renList = upcomingTestList}
  else if (type == "finished"){renList = finishedTestList}
  else {console.log("ERROR")}
  dE("testlinks").innerHTML = ""
  for (var ele of renList){
    var strson = new Date(ele.strton.seconds*1000)
    var endson = new Date(ele.endon.seconds*1000)
    var output = '<div class="tlinks" id = "'+ele.testid+'"><span class = "t_title">'+ele.title+'</span><span class = "t_stron">Starts At:'+strson+'</span><span class ="t_endon">Ends At:'+endson+'</div>'
    if (type != "finished" && ele.finished == false){
      dE("testlinks").insertAdjacentHTML('beforeend',output)
      dE(ele.testid).addEventListener('click',testClicker)
    } else {
      if (type == "finished"){
        dE("testlinks").insertAdjacentHTML('beforeend',output)
        dE(ele.testid).addEventListener('click',finishedtestClicker)
      }
      
    }
  }
}
async function getTestInfo(){ 
  var testid = "T" + window.location.hash.split("#/attempt/")[1]
  var docRef = doc(db, "tests", testid);
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    testInfo = docSnap.data()
    for (var ele of testInfo.finished){
      if (auth.currentUser.uid == ele){
        locationHandler("testend",1)
        dE("te_title").innerText = "You Have Already Attempted This Test"
        return 0;
      } 
    }
  }
  // document.addEventListener("visibilitychange", async function(event){
  //   await updateDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid),{
  //     warning:arrayUnion({type:"tab_change",time:Date.now()})
  // })})
  // window.addEventListener("resize", async function(event) {
  //   await updateDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid),{
  //     warning:arrayUnion({type:"tab_resize",time:Date.now()})
  //   })
  // })
  try {
    docRef = doc(db, "tests", testid,"questions","questions");
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      testQuestionList = docSnap.data()
    }
  }
  catch {
    dE("te_title").innerText = "The Test Hasnt Started Yet"
    locationHandler("testend",1)
    return 0;
  }

  console.log(testInfo,testQuestionList)
  docRef = doc(db, "tests", testid,"responses",auth.currentUser.uid);
  docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var yuta = docSnap.data().answers
    console.log(yuta)
    for (var prop in yuta){
      testResponseList.push({ qid: prop, ans:yuta[prop].ans, type:yuta[prop].type,time:yuta[prop].time });
    }
  }else {
    await setDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid), {
      answers:[],
      strton:serverTimestamp(),
      warning:[]})
  }
  console.log(testInfo,testQuestionList,testResponseList)

   testTimerfunction = setInterval(function(){
    var seconds = testInfo.timeallotted - 1;
    testInfo.timeallotted -=1
    dE("tt_timeleft").innerText = Math.floor(seconds % (3600*24) / 3600) + ":" +Math.floor(seconds % 3600 / 60) + ":" + Math.floor(seconds % 60);
    if (seconds == 0){
      submitTest()
    }
  }, 1000);
  window.onbeforeunload = function(e){
    e.preventDefault;
    submitTest()
  }
  window.onhashchange = function(e){
    locationHandler()
    submitTest()
  }
  dE("dsh_btn").style.display = "none"
  dE("tp_pnt").style.display = "none"
  var tbox = dE("testv1")
  fullEle(tbox)
  inittestHandler()
}
function tqH(){
  console.log(this.id,this.innerText)
  testqHandler(this.id,this.innerText)
}
function testqHandler(id,no){
  var MCQ = `<div id = "tt_mcq"><span><input type="radio" value="a" class = "q_ans" name = "q_op">A</span><span><input type="radio" value="b" class = "q_ans" name = "q_op">B</span><span><input type="radio" value="c" class = "q_ans" name = "q_op">C</span><span><input type="radio" value="d" class = "q_ans" name = "q_op">D</span></div>`
  var TF = `<div id = "tt_mcq"><span><input type="radio" value="a" class = "q_ans" name = "q_op">True</span><span><input type="radio" value="b" class = "q_ans" name = "q_op">False</span></div> `
  var MCQMULT = `<div id = "tt_mcq_multiple"><span><input type="checkbox" value="a" class = "q_ans" name = "q_op">A</span><span><input type="checkbox" value="b" class = "q_ans" name = "q_op">B</span><span><input type="checkbox" value="c" class = "q_ans" name = "q_op">C</span><span><input type="checkbox" value="d" class = "q_ans" name = "q_op">D</span></div>`
  var NUM = `<div id = "tt_num"><input type = "number" class="q_ans"></div>`
  var FILL = `<div id="tt_fill"><input type = "text" class = "q_ans"></div>`
  var MATRIX = `<div id = "tt_matrix"><div>A<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>B<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>C<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>D<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div></div>`

  dE("tt_qno").innerText = no;
  activequestionid = id
  for (let ele of testQuestionList.questions){
    if (id == ele.qid){
      dE("tt_qtitle").innerHTML = ""
      var inhtml = '<li class = "qb_q" id = "Q' + ele.qid + '"><div class = "qb_ttl">' + ele.title + '<div id = "qb_q_ty" class = "qb_q_ty" >(' + ele.type + ')</div></div></li>'
      dE("tt_qtitle").insertAdjacentHTML('beforeend', inhtml);
      if (ele.img != "") {
        var iwo = '<div class = "qb_img"><img src = "' + ele.img + '"></div>'
        dE("tt_qtitle").insertAdjacentHTML('beforeend', iwo)
      }
      var asi = "";
      if (ele.type == "mcq" || ele.type == "mcq_multiple") {
        var qop = ele.op;
        for (let ele1 of qop) {
          asi += "<li>" + ele1 + '</li>'
        }
        var qrt = '<ol class = "qb_mcq" type = "a">' + asi + '</ol>'
      }
      if (ele.type == "taf") {
        qrt = '<ol class = "qb_mcq" type = "a"><li>True</li><li>False</li></ol>'
      }
      if (ele.type == "explain" || ele.type == "numerical") { qrt = "" }
      if (ele.type == "matrix") {
        var qop1 = ele.op1;
        var qop2 = ele.op2;
        var qopn1 = qop1.length
        for (var i = 0; i < qopn1; i++) {
          asi += "<tr><td>" + qop1[i] + '</td><td>' + qop2[i] + '</td>'
        }
        qrt = '<table>' + asi + '</table>'
      }
      dE("tt_qtitle").insertAdjacentHTML('beforeend', qrt)
      renderMathInElement(dE('tt_qtitle'));
      var ANS;
    switch(ele.type){
      case "mcq": ANS = MCQ;break;
      case "mcq_multiple": ANS = MCQMULT;break;
      case "taf": ANS = TF;break;
      // case "explain": ANS = EXPL
      case "numerical": ANS = NUM;break;
      case "matrix": ANS = MATRIX;break;
      case "fill": ANS = FILL;break;
    }
    dE("tt_qtitle").insertAdjacentHTML('beforeend', ANS)
    
    
    for (let ele23 of testResponseList){
      if (ele23.qid == id){
        for (var i =0; i< document.getElementsByClassName("q_ans").length;i++){
          var ele32 = document.getElementsByClassName("q_ans")[i]
          if (ele.type == "mcq" || ele.type == "mcq_multiple"){
            for (let el433 of ele23.ans){
              if (ele32.value == el433){
                ele32.checked = true
                break;
              }
            }
          }else {
            ele32.value = ele23.ans
          }
      } 
    }}
      break;

    }
  }
}
function inittestHandler(){
  var a = 1;
  for (let ele of testQuestionList.questions){
    var box = '<span class = "tts_notvisit" id = "'+ele.qid+'">'+a+'</span>'
    a = a+1
    dE("tt_qnobx").insertAdjacentHTML("beforeend",box)
    dE(ele.qid).addEventListener("click",tqH)
  }
  for (let ele of testResponseList){
    dE(ele.qid).classList.replace("tts_notvisit",ele.type)
  }
  testqHandler(testQuestionList.questions[0].qid,1)
}
async function testOperator(type){
  var aqid = "answers."+activequestionid
  var testid = "T" + window.location.hash.split("#/attempt/")[1]
  var triu = dE("qb_q_ty").innerText.split("(")[1]
  if (type == "tts_notanswer"){
    await updateDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid), {
      [`${aqid}`]: {ans:"",type:"tts_notanswer",time:serverTimestamp()}
    })
    var a = 0;
    for (let ele23 of testResponseList){ 
      if (ele23.qid == activequestionid){
        for (var i =0; i< document.getElementsByClassName("q_ans").length;i++){
          var ele32 = document.getElementsByClassName("q_ans")[i]
          if (triu == "mcq" || triu == "mcq_multiple"){
            for (var j = 0; j<ele23.ans.length;j++){
              var ele44 = ele23.ans[j]
              if (ele32.value == ele44){
                ele32.checked = false
              }
            }
          }else {
            ele23.value = ""}}
        testResponseList.splice(a,1)
      }
      a = a+1
    }
    
  }else {
    var ans = [];
    
    for (var i =0; i< document.getElementsByClassName("q_ans").length;i++){
      var ele32 = document.getElementsByClassName("q_ans")[i]
      if (triu == "mcq)" || triu == "mcq_multiple)"){
        if (ele32.checked == true){
          ans.push(ele32.value)
        }
      }else {
        ans.push(ele32.value)
      }}
    if (type == "tts_review"){ans = ""}
    await updateDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid), {
      [`${aqid}`]: {ans:ans,type:type,time:serverTimestamp()}
    })
    var eleexists = 0;
    for (let ele of testResponseList){
      if (ele.qid == activequestionid){
        ele.ans = ans
        ele.type = type
        eleexists = 1;
      }
    }
    if (eleexists == 0){
      testResponseList.push({qid:activequestionid,ans:ans,type:type})
    }
    renderTestList()
  }
  dE(activequestionid).classList.remove("tts_notanswer","tts_notvisit","tts_answered","tts_review","tts_ansreview")
  dE(activequestionid).classList.add(type)
}
async function submitTest(){
  var testid = "T" + window.location.hash.split("#/attempt/")[1]
  window.onbeforeunload = function(){}
  window.onhashchange = locationHandler
  await updateDoc(doc(db, "tests", testid,"responses",auth.currentUser.uid), {
    endon:serverTimestamp()
  })
  await updateDoc(doc(db, "tests", testid), {
     finished:arrayUnion(auth.currentUser.uid),
  })
  locationHandler("testend",1)
  var endat = new Date(testInfo.endon.seconds)
  dE("te_end").innerText = endat;
  testList = []
  activeTestList = []
  upcomingTestList = []
  finishedTestList = []
  testInfo = []
  testQuestionList = []
  testResponseList = [];
  activequestionid = ""
}
async function getCyberhunt(){
}
async function userUpdate() { 
}
function defineEvents(){
function chItem() { changeItem(1) }
function simHand() { changeLocationHash("simlist", 1) }
function cybHand() {changeLocationHash("cyberhunt",1)}
function abtHand() { changeLocationHash("about", 1) }
function tmtHand() { changeLocationHash("timetable", 1) }
function regHand() { changeLocationHash("register", 1) }
function prfHand() { changeLocationHash("profile", 1) }
function dshHand() { changeLocationHash("dashboard", 1) }
function adiHand() { changeLocationHash("functions", 1) }
function pqbHand() { changeLocationHash("printable/qbank", 1) }
function tstinfHand() { changeLocationHash("testinfo", 1) }
function uscHand() { changeLocationHash("users", 1) }
function tpcHand() { changeLocationHash("tpclist", 1) }
function lvqHand() { changeLocationHash("livequiz", 1) }
function frmHand() { changeLocationHash("forum", 1) }
function lglHand() { changeLocationHash("legal", 1) }
function qbaHand() { changeLocationHash("qblist", 1) }
function chpHand() { changeLocationHash("chplist", 1) }
function prvHand() { topicHandler(1) }
function nxtHand() { topicHandler(2) }
function actHand() { renderTestList("active")}
function upcHand() { renderTestList("upcoming")}
function finHand() { renderTestList("finished")}
function qbnkend(){dE("watermark").style.display = "flex";fullEle(dE("qbnk_vid"))}
function qbnkstr(){prepareVideo()}
function tsave(){testOperator("tts_answered")}
function tclear(){testOperator("tts_notanswer")}
function treview(){testOperator("tts_review")}
function tansrev(){testOperator("tts_ansreview")}
function psims(){getSimList("physics")}
function csims(){getSimList("chemistry")}
function msims(){getSimList("maths")}
function bsims(){getSimList("biology")}
function cosims(){getSimList("computer")}
function ssims(){getSimList("statistics")}
function usims(){getSimList("unfiled")}
function pchb(){getChapterList("physics")}
function cchb(){getChapterList("chemistry")}
function mchb(){getChapterList("maths")}
function bchb(){getChapterList("biology")}
function cochb(){getChapterList("computer")}
function schb(){getChapterList("statistics")}
function uchb(){getChapterList("unfiled")}
function uQL(){updateTopicQBank(1)}
function uQL2(){updateTopicQBank(2)}
var simbtn = dE("sim_btn").addEventListener("click", simHand)
var sgnbtn = dE("sgn_in").addEventListener("click", signIn);
var regbtn = dE("reg_in").addEventListener("click", regHand);;
var rgbtn = dE("rg_in").addEventListener("click", signUp);
var sgnout = dE("lgt_btn").addEventListener("click", signOutUser);
var tmtbtn = dE("tmt_btn").addEventListener("click", tmtHand);
var prfbtn = dE("prf_btn").addEventListener("click", prfHand);
var abtbtn = dE("abt_btn").addEventListener("click", abtHand);
var shfbtn = dE("shf_btn").addEventListener("click", shuffleQBank);
var aqao = dE("aq_ao").addEventListener("click", addMCQ);
var aqro = dE("aq_ro").addEventListener("click", removeMCQ);
var tmode = dE("aq_mode").addEventListener("change", changeItem)
// var tsub = dE("aq_subject").addEventListener("change", chItem)
var ttype = dE("aq_type").addEventListener("change", changeItem)
// var aqsavebtn = dE("aq_save").addEventListener("click", addItemWeb);
var aqqtxt = dE("aq_qtext").addEventListener("keyup", rndAQ);
var dshbtn = dE("dsh_btn").addEventListener("click", dshHand);
var adibtn = dE("adi_btn").addEventListener("click", adiHand)
var pqbbtn = dE("pqb_btn").addEventListener("click", pqbHand)
var aqsave = dE("aq_tpc_save").addEventListener("click",uQL )
var aqsave = dE("aq_qbc_save").addEventListener("click",uQL2 )
var tstinfbtn = dE("tstinf_btn").addEventListener("click", tstinfHand)
var tpcbtn = dE("tpc_btn").addEventListener("click", tpcHand)
var uscbtn = dE("usc_btn").addEventListener("click", uscHand)
var lvqbtn = dE("lvq_btn").addEventListener("click", lvqHand)
var frmbtn = dE("frm_btn").addEventListener("click", frmHand)
var tpnxt = dE("tp_nxt").addEventListener("click", nxtHand)
var tpprv = dE("tp_prv").addEventListener("click", prvHand)
var tpsbm = dE("tp_sbm").addEventListener("click", checkQuestion)
var lglbtn = dE("lgl_btn").addEventListener("click", lglHand)
var qbabtn = dE("qba_btn").addEventListener("click", qbaHand)
var tppnt = dE("tp_pnt").addEventListener("click",printStuff)
var cybbtn = dE("cyb_btn").addEventListener("click",cybHand)
var tiact = dE("ti_act").addEventListener("click",actHand)
var tiupc = dE("ti_upc").addEventListener("click",upcHand)
var tifin = dE("ti_fin").addEventListener("click",finHand)
var tt_save = dE("tt_save").addEventListener("click",tsave)
var tt_clear = dE("tt_clear").addEventListener("click",tclear)
var tt_review = dE("tt_review").addEventListener("click",treview)
var tt_ansreview = dE("tt_ansreview").addEventListener("click",tansrev)
var p_sims = dE("psims").addEventListener("click",psims)
var c_sims = dE("csims").addEventListener("click",csims)
var m_sims = dE("msims").addEventListener("click",msims)
var b_sims = dE("bsims").addEventListener("click",bsims)
var co_sims = dE("cosims").addEventListener("click",cosims)
var s_sims = dE("ssims").addEventListener("click",ssims)
var u_sims = dE("usims").addEventListener("click",usims)
var p_chb = dE("pchb").addEventListener("click",pchb)
var c_chb = dE("cchb").addEventListener("click",cchb)
var m_chb = dE("mchb").addEventListener("click",mchb)
var b_chb = dE("bchb").addEventListener("click",bchb)
var co_chb = dE("cochb").addEventListener("click",cochb)
var s_chb = dE("schb").addEventListener("click",schb)
var u_chb = dE("uchb").addEventListener("click",uchb)
var ttsub = dE("tt_sub").addEventListener("click",submitTest)
var chp_btn = dE("chp_btn").addEventListener("click",chpHand)
var aq_sims_save = dE("aq_sims_save").addEventListener("click",updateSimulationWeb)
dE("qbnk_vid_btn_e").addEventListener("click",qbnkend)
dE("qbnk_vid_btn").addEventListener("click",qbnkstr)

}
function plyVid() { window.player.playVideo() }
function stpVid() { try {window.player.stopVideo()} catch{} }
function pauVid() { window.player.pauseVideo() }
function loadVid(videoId) { player.loadVideoById(videoId); }
var Quarkz = {
  "copyright": "Mr Techtroid 2021-22",
  "vno": "v0.1.2",
  "author": "Mr Techtroid",
  "last-updated": "24/05/2022(IST)",
}


var handlebox = "login";
var location1 = window.location.hash.split("#/")[1]
var userinfo;

var topicJSON = {};
var topicJSONno = 0;


var editorrole, adminrole, userrole;
var topiclist = []
var lessonlist = []
var questionlist = []
var qlist = []
var simlist = []


var userdetails = []

var curr_qlno = 0
var curr_qlid = ""
var editqllist = []

var autosignin = 0
var answerlist = []
var testList = []
var activeTestList = []
var upcomingTestList = []
var finishedTestList = []
var testInfo = []
var testQuestionList = []
var testResponseList = [];
var activequestionid = ""
var testTimerfunction,testTimer;


// sgngoogle.addEventListener("click",signInWithGoogle);
var chgby = 1;
window.onhashchange = locationHandler
initFirebaseAuth()
defineEvents()
