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
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, orderBy, limit, writeBatch, collection, addDoc, onSnapshot, arrayUnion, arrayRemove, setDoc, updateDoc, getDocs, doc, serverTimestamp, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js';
import { sysaccess } from '/js/reworkui.js'

const firebaseConfig = {
  apiKey: "AIzaSyDN8T7Pmw5e-LzmC3nAHEqI0Uk7FF7y6fc",
  authDomain: "quarkz.firebaseapp.com",
  projectId: "quarkz",
  storageBucket: "quarkz.appspot.com",
  messagingSenderId: "1050835442263",
  appId: "1:1050835442263:web:e7d05ca9373f2f6083a112",
  measurementId: "G-1Y3S45VWFH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
  });

const storage = getStorage();

// Helper Functions
// Convert Seconds to Hours-Mins-Seconds.
// StackOverFlow - https://stackoverflow.com/a/52387803
function sd(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay
}
// Generate a Random ID of certain length
// StakOverflow: https://stackoverflow.com/a/1349426/15107474
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
// Find the sha256 hash of a Text
// StakOverflow: https://stackoverflow.com/a/48161723
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
// Check if Two Array's are Equal
// GeeksForGeeks: https://www.geeksforgeeks.org/check-if-two-arrays-are-equal-or-not/
function areEqual(arr1, arr2) {
  let N = arr1.length;
  let M = arr2.length;
  if (N != M)
    return false;
  arr1.sort();
  arr2.sort();
  for (let i = 0; i < N; i++)
    if (arr1[i] != arr2[i])
      return false;
  return true;
}
// Check for Mobile Devices
// StackOverflow: https://stackoverflow.com/a/11381730
function mobileCheck() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
// Check if Two Objects are Equal
// StackOverflow: https://stackoverflow.com/a/32922084
function areObjectsEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
    ok(x).every(key => areObjectsEqual(x[key], y[key]))
  ) : (x === y);
}
// Get Time Of Server
function getServerTime(url) {
  fetch(url)
    .then((response) => {
      var date;
      for (var pair of response.headers.entries()) {
        if (pair[0] === 'date') {
          date = new Date(pair[1]).getTime()
        }
      }
      return date;
    });
}
// Make A Element Full Screen
function fullEle(ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    /* Firefox */
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    ele.webkitRequestFullscreen();
  } else if (ele.msRequestFullscreen) {
    /* IE/Edge */
    ele.msRequestFullscreen();
  }
}
// Get Elements With ID in Short Form
function dE(ele) {
  return document.getElementById(ele)
}
// Sort An Object based on a parameter.
function sortObj(objs, param, type) {
  var sorter2;
  if (type == 0) {
    sorter2 = (sortBy) => (a, b) => a[sortBy] > b[sortBy] ? 1 : -1;
  } if (type == 1) {
    sorter2 = (sortBy) => (a, b) => a[sortBy] > b[sortBy] ? -1 : 1;
  }
  return objs.sort(sorter2(param));
}
function sortObjv2(objs, param1, param2, type) {
  var sorter2;
  if (type == 0) {
    sorter2 = (sortBy1, sortBy2) => (a, b) => {
      if (a[sortBy1] === b[sortBy1]) {
        return a[sortBy2] > b[sortBy2] ? 1 : -1;
      }
      return a[sortBy1] > b[sortBy1] ? 1 : -1;
    };
  } else if (type == 1) {
    sorter2 = (sortBy1, sortBy2) => (a, b) => {
      if (a[sortBy1] === b[sortBy1]) {
        return a[sortBy2] > b[sortBy2] ? -1 : 1;
      }
      return a[sortBy1] > b[sortBy1] ? -1 : 1;
    };
  }
  return objs.sort(sorter2(param1, param2));
}
// Make Elements Latex Rendered
function renderMarkedMath(eleid, toid) {
  var v = marked.parse(dE(eleid).value)
  dE(toid).innerHTML = v
  renderMathInElement(dE(toid));
}
// Special Logging Function
function log(title, msg, action, actionname) {
  dE("msg_popup").style.visibility = "visible"
  dE("msg_popup").style.opacity = "1"
  dE("msg_action").style.display = "none"
  document.getElementById("msg_popup_txt").innerText = title
  document.getElementById("msg_popup_content").innerText = msg
  if (action == undefined) { action = function () { } } else { dE("msg_action").style.display = "block" }
  if (actionname == undefined) { actionname = "" }
  dE("msg_action").onclick = action
  dE("msg_action").innerText = actionname
}
// Special Logging Function For Tests
function t_log(title, msg, action, actionname) {
  dE("t1_msg_popup").style.visibility = "visible"
  dE("t1_msg_popup").style.opacity = "1"
  dE("t1_msg_action").style.display = "none"
  document.getElementById("t1_msg_popup_txt").innerText = title
  document.getElementById("t1_msg_popup_content").innerText = msg
  if (action == undefined) { action = function () { } } else { dE("t1_msg_action").style.display = "block" }
  if (actionname == undefined) { actionname = "" }
  dE("t1_msg_action").onclick = action
  dE("t1_msg_action").innerText = actionname
}
// Merge The Contents of Two Array's
const mergeById = (a1, a2) =>
  a1.map(itm => ({
    ...a2.find((item) => (item.qid === itm.qid) && item),
    ...itm
  }));
//Get Server Time
function gST() { return getServerTime("https:/quarkz.netlify.app/time") }
// Video Creator - https://www.educative.io/edpresso/how-to-create-a-screen-recorder-in-javascript
let mediaRecorder;
async function recordScreen() {
  return await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: { mediaSource: "screen" }
  });
}
function createRecorder(stream, mimeType) {
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
  mediaRecorder.start(200);
  return mediaRecorder;
}
function saveFile(recordedChunks) {
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
// Login Page
// Sign In A User
async function signIn() {
  var email = dE("lg_uname").value;
  var password = dE("lg_pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      userdetails.email = email
      locationHandler("dashboard", 1);
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
  var stgender = dE("rg_gender").value;
  if (email == "" || password == "" || name == "" || mblno == "" || stclass == "") {
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
              gen: stgender,
              sgndon: serverTimestamp(),
              roles: { user: true }
            }).then(function () {
              window.location.hash = "#/dashboard"
              window.location.reload()
            });
          }
          catch (error) {
            console.error('Error Adding New User', error);
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
// Location Handler 
// Important: Handles All Locations
function locationHandler(newlocation, n1) {
  var iorole = adminrole == true || editorrole == true
  if (iorole) {
    dE("adminonly").style.display = "flex";
    dE("tp_pnt").style.display = "block";
    dE("tp_edt").style.display = "block";
    dE("sms_edit").style.display = "block";
  }
  else {
    dE("adminonly").style.display = "none";
    dE("sms_edit").style.display = "none"
  }
  dE(handlebox).classList.remove("_open")
  if (n1 == 1) { window.location.hash = "#/" + newlocation }
  handlebox = newlocation
  location1 = window.location.hash.split("#/")[1]

  switch (location1) {
    case "profile": handlebox = "profile"; break;
    case "about": handlebox = "aboutus"; break;
    case "login": handlebox = "login"; break;
    case "dashboard": handlebox = "dashboard"; break;
    case "timetable": handlebox = "schedule"; break;
    case "logout": signOut(); break;
    case "mainsformulas": handlebox = "mainsformulas"; renderDownloadPage(1); break;
    case "downloads": handlebox = "downloads"; renderDownloadPage(2); break;
    case "livequiz": handlebox = "livequiz"; break;
    case "register": handlebox = "register"; break;
    case "testinfo": handlebox = "testinfo"; renderTestList("active"); break;
    case "legal": handlebox = "legal"; break;
    case "appinfo": handlebox = "appinfo"; renderAppInfo(); break;
    case "forum": handlebox = "forum"; break;
    case 'testing': handlebox = "testing"; break;
    case "bugreport": handlebox = "bugreport"; break;
    case "simlist": handlebox = "simlist"; getSimList(); break;
    case "testend": handlebox = "test_end"; break;
    case "add/question": handlebox = "fu_question"; break;
    case "add/lesson": handlebox = "fu_lesson"; newLesson(); break;
    case "add/tpc": handlebox = "fu_topic"; newTopic(); break;
    case "add/images": handlebox = "fu_images"; break;
    case "add/qubank": handlebox = "fu_topic"; newQBank(); break;
    case "add/simulation": handlebox = "fu_simulation"; newSimulation(); break;
    case "add/tests": handlebox = "fu_topic"; newTest(); break;
    case "chplist": handlebox = "chapterlist"; renderCList(); break;
    default: handlebox = "error_page"; break;
  }

  if (location1.includes("instructions")) { handlebox = "test_instructions"; }
  if (location1.includes("cyberhunt")) { handlebox = "cyberhunt"; getCyberhunt() }
  if (location1.includes("notes") && !location1.includes("usernotes")) { handlebox = "notes"; getPDF() }
  if (location1.includes("sims")) { handlebox = "simulations"; getSimulation() }
  if (location1.includes("chapter")) { handlebox = "chapter"; getChapterEList() }
  if (location1.includes("qbanks")) { handlebox = "topic"; getTopic(2); }
  if (location1.includes("usernotes")) { handlebox = "usernotes"; getUserNotes(); }
  if (location1.includes("qbnk_vid")) { handlebox = "qbnk_vid"; dE("qbnk_vid_btn").style.display = "block" }
  if (location1.includes("attempt")) { handlebox = "testv1"; getTestInfo() }
  if (location1.includes("finished")) { handlebox = "finishedtestinfo"; getSimpleTestReport() }
  if (location1.includes("testreport")) { handlebox = "testv1"; getTestReport() }
  if (location1.includes("printable/qbank") && iorole == true) { handlebox = "printable"; printQBank(1); }
  if (location1.includes("ARIEL") && iorole == true) { handlebox = "Ariel"; }
  if (location1.includes("printable/tests") && iorole == true) { handlebox = "printable"; printQBank(3); }
  if (location1 == "functions" && iorole == true) { handlebox = "functions"; changeItem() }
  if (location1.includes("users") && iorole == true) { handlebox = "users"; userUpdate() }
  if (location1.includes("topic")) { handlebox = "topic"; getTopic(1); }
  if (location1.includes("printable/topic") && iorole == true) { handlebox = "printable"; printQBank(2); }
  if (location1.includes("livequiz")) { handlebox = "livequiz"; lquizinit(); }
  if (location1.includes("edit_sim") && iorole == true) { handlebox = "fu_simulation"; prepareSimulation() }
  if (location1.includes("edit_lesson") && iorole == true) { handlebox = "fu_simulation"; prepareLesson() }
  if (location1.includes("edit_tpc") && iorole == true) { handlebox = "fu_topic"; prepareTopicQBank(1) }
  if (location1.includes("edit_test") && iorole == true) { handlebox = "fu_topic"; prepareTopicQBank(3) }
  if (location1.includes("edit_qubank") && iorole == true) { handlebox = "fu_topic"; prepareTopicQBank(2) }
  if (location1.includes("edit_exams") && iorole == true) { handlebox = "fu_topic"; prepareTopicQBank(4) }
  // if (location1.includes("redirect"))
  if (userrole == false || userrole == null || userrole == undefined) {
    if (location1 == "login" || location1 == "register" || location1.includes("notes") || location1 == "legal" || location1 == "about" || location1 == "bugreport" || location1 == "appinfo" || location1 == "mainsformulas" || location1 == "downloads") {

    } else {
      handlebox = "error_page"
    }
  }
  dE(handlebox).classList.add("_open")
  stpVid()
  editqllist = []
  if (location1 == "forum") { gtMsg(1); } else { gtMsg(2); forum_length = 1; forum_d = "afterbegin" }
  // console.log({ userinfo, topicJSON, topicJSONno, editorrole, adminrole, userrole, simlist, chapterlist, userdetails, curr_qlno, curr_qlid, editqllist, autosignin, testList, activeTestList, upcomingTestList, finishedTestList, testInfo, testQuestionList, testResponseList, activequestionid })
  testQuestionList = []; testResponseList = []; testInfo = []; activequestionid = ""

}
// ----------------------
// BATCHES
async function newBatch() {
  try {
    const docRef = await addDoc(collection(db, 'batch'), {
      name: "",
      timetable: "",
      crton: serverTimestamp(),
      class: 0,
    })
    locationHandler("edit_batch/" + docRef.id, 1)
  } catch {
  }
}
async function prepareBatch() {

}
async function updateBatch() {

}
async function getBatch() {

}
async function unotes1() {
  await updateDoc(doc(db, "usernotes", window.location.hash.split("usernotes/")[1]), {
    title: dE("un_title").value,
    notes: getHTM("un_editable"),
    lastupdated: serverTimestamp(),
    type: dE("un_viewership").value
  })
}
function unotes2() {

}
async function getUserNotes() {
  dE("un_rendermode").value = "edit"
  try { window.notesUIHandler() } catch { }
  if (window.location.hash.includes("usernotes/add")) {
    var docRef = await addDoc(collection(db, "usernotes"), {
      title: "Notes Title",
      notes: "",
      uuid: userinfo.uuid,
      crton: serverTimestamp(),
      type: "private",
      lastupdated: serverTimestamp()
    })
    await updateDoc(doc(db, "users", userinfo.uuid), {
      usernotes: arrayUnion({ color: "black", id: docRef.id, title: "Notes Title" })
    })
    locationHandler("#/usernotes/" + docRef.id, 1)
  } else if (window.location.hash.includes("usernotes/delete")) {
    await deleteDoc(doc(db, "usernotes", window.location.hash.split("usernotes/delete/")[1]));
  } else if (window.location.hash == "#/usernotes/") {
  } else {
    var docRef = doc(db, 'usernotes', window.location.hash.split("usernotes/")[1])
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docRef = docSnap.data()
      dE("un_title").value = docRef.title;
      setHTM("un_editable", docRef.notes);
      dE("un_viewership").value = docRef.type;
    }
  }
}
function uNotesClicker() {
  window.location.hash = "#/usernotes/" + this.id.split("uno")[1]
}
async function getUserNotesList() {
  for (var i = 0; i < userinfo.usernotes.length; i++) {
    dE("un_list").insertAdjacentHTML("beforeend", "<div class='t_notes' id='uno" + userinfo.usernotes[i].id + "' style='background-color: " + userinfo.usernotes[i].color + "'><span class='tntc2' id='" + userinfo.usernotes[i].id + "'>" + userinfo.usernotes[i].title + "</span></div>")
    dE("uno" + userinfo.usernotes[i].id).addEventListener("click", uNotesClicker)
  }
}
async function getPDF() {
  var id = window.location.hash.split("notes/")[1]
  getDownloadURL(ref(storage, 'public/' + id + '.pdf')).then((url) => { dE("nt_id").src = url + ""; }).catch((error) => {
    switch (error.code) {
      case 'storage/object-not-found':
        dE("nt_id").src = "https://firebasestorage.googleapis.com/v0/b/quarkz.appspot.com/o/public%2F404.pdf?alt=media&token=8cc8f23a-6e24-41d6-984b-6d2cc9b89d11"
        break;
      case 'storage/unauthorized':
        log("Unauthorised", "You dont have necessary permissions to The file you requested.")
        break;
    }
  })
}
// FORUM
// ----------------------
async function sndMsg() {
  var qtxt = dE("fm_message").value
  if (qtxt.includes("/pinned")) {
    qtxt = qtxt.split("/pinned")[1]
    try {
      await updateDoc(doc(db, "forum", "pinned"), { message: qtxt })
    } catch {
      alert("You Dont Have The Privilages For This Command")
    }
    async function upDoc(sTime) {
      await updateDoc(doc(db, "forum", "ppinned"), { ppinned: arrayUnion({ message: qtxt, user: userinfo.uuid, time: sTime }) })
    }
    var sTime = await getServerTime("http://localhost:5500/time.html").then(upDoc(sTime))

  } else {
    if (qtxt != "" && qtxt != null) {
      await addDoc(collection(db, "forum"), {
        name: userinfo.name,
        message: qtxt,
        userid: userinfo.uuid,
        sgndon: serverTimestamp()
      })
      dE("fm_message").value = ""
    } else {
      alert("Message Cannot Be Empty")
    }
  }
}
function displayMessage(id, time, name, text, userid) {
  if (userid == "shh5oUIhRpdBkEKQ3GCZwoKE9u42") {
    var d = "<div id = 'dM" + id + "'><span class = 'dmName'>" + name + "👑: </span><span class = 'dmText'>" + text + "</span><span class = 'dmtime'>" + time + "</span></div>"
    dE("forum_live").insertAdjacentHTML(forum_d, d)
  } else {
    var d = "<div id = 'dM" + id + "'><span class = 'dmName'>" + name + ": </span><span class = 'dmText'>" + text + "</span><span class = 'dmtime'>" + time + "</span></div>"
    dE("forum_live").insertAdjacentHTML(forum_d, d)
  }
}
function deleteMessage(id) { dE("dM" + id).remove() }
let recentMessagesQuery;
let reMSG = function () { };
async function gtMsg(type) {
  if (type == 1) {
    dE("forum_live").innerHTML = ""
    recentMessagesQuery = query(collection(getFirestore(), 'forum'), orderBy('sgndon', 'desc'), limit(10));
    reMSG = onSnapshot(recentMessagesQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === 'removed') {
          deleteMessage(change.doc.id);
        } else if (change.type == 'added') {
          if (forum_length >= 11) {
            forum_d = "beforeend"
          }
          var message = change.doc.data();
          displayMessage(change.doc.id, "", message.name,
            message.message, message.userid);
          forum_length = forum_length + 1
        }
      });
    });
  } else if (type == 2) {
    reMSG()
    reMSG = function () { }
  }
}
async function getPinned() {
  var docRef = doc(db, 'forum', 'pinned')
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var docRef = docSnap.data()
    dE("pinnedtxt").innerText = docRef.message;
  }
}
var fmsend = dE("fm_send").addEventListener("click", sndMsg)
var forum_length = 1;
var forum_d = "afterbegin"
gtMsg();
getPinned();
// ----------------------
// QBANK VIDEO
// Slide Controller For QBANK Video
function vidSlideController(docJSON) {
  function iu(ele) { ele.style.display = "none" }
  function io(ele) { ele.style.display = "block" }
  function qif(ele) { ele.style.display = "flex" }
  var tpmcqcon = dE("tb_q_mcq_con")
  var tpmatrix = dE("tb_q_matrix")
  var tpanswer = dE("tb_q_answer")
  tpmcqcon.innerHTML = ""
  dE("tb_q_qtext").innerHTML = docJSON.title + "<span class = 'sp_txt'>(" + docJSON.type + ")</span>"
  // dE("tb_q_img").src = docJSON.img
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
      document.getElementsByClassName("tp_i1")[i].innerHTML = qop1[i]
    }
    for (var i = 0; i < qopn1; i++) {
      document.getElementsByClassName("tp_i2")[i].innerHTML = qop2[i]
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
async function prepareVideo() {
  dE("qbnk_vid_btn").style.display = "none"
  dE("qbnk_vid_btn_e").style.display = "none"
  try {
    let docSnap = await getDoc(doc(db, "qbank", window.location.hash.split("qbnk_vid/")[1]))
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
      var iou = setInterval(function () {
        dE("qbnk_vid_q").style.display = "none"
        dE("qbnk_vid_ans").style.display = "none"
        dE("qbnk_vid_title").style.display = "none"
        dE("qbnk_vid_end").style.display = "none"
        if (ti == 0) {
          dE("qbnk_vid_title").style.display = "flex"
          ti++
        } else if (jno == qllist.length - 1) {
          dE("qbnk_vid_end").style.display = "flex"
          setTimeout(function () {
            mediaRecorder.stop()
            dE("qbnk_vid_btn").style.display = "block"
          }, 5000)
          clearInterval(iou);
        } else if (ji == 0 || ji == 1) {
          vidSlideController(qllist[jno])
          var f = jno + 1
          if (ji == 0) {
            dE("qbnk_timer").innerText = 10
            timer = setInterval(function () { dE("qbnk_timer").innerText = dE("qbnk_timer").innerText - 1 }, 1000)
          }
          dE("tb_q_qno").innerText = "Question " + f + ":"
          dE("qbnk_vid_q").style.display = "flex"
          ji++
        } else if (ji == 2) {
          dE("qbnk_vid_ans").style.display = "flex"
          clearInterval(timer);
          var asi = "";
          for (var i = 0; i < qllist[jno].answer.length; i++) {
            asi += '<div class="tb_q_mcq_p rpl" style = "background-color:green">' + qllist[jno].answer[i] + '</div>'
          }
          dE("tb_q_ans").innerHTML = asi
          dE("tb_q_hint").innerHTML = qllist[jno].hint
          dE("tb_q_expl").innerHTML = qllist[jno].expl
          ji = 0;
          jno++
        }
      }, 5000);
    }
  } catch { }
}
async function getCyberhunt() {
  if (window.location.hash.split("/cyberhunt/")[1] == "" || window.location.hash.split("/cyberhunt")[1] == "") {
    dE("cyb_code").style.display = "flex"
    dE("cyb_viewer").style.display = "none"
    dE("cyb_edit").style.display = "none"
  } else {
    dE("cyb_code").style.display = "none"
    dE("cyb_viewer").style.display = "flex"
    dE("cyb_edit").style.display = "none"

  }
}
// -----------------------
// SIMULATIONS
// Creates A Blank Simulation
async function newSimulation() {
  try {

    const docRef = await addDoc(collection(db, 'sims'), {
      name: "",
      license: "",
      provider: "",
      url: "",
    })
    locationHandler("edit_sim/" + docRef.id, 1)
  } catch {

  }
}
// Prepares The Simulation Editor
async function prepareSimulation() {
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
  } catch { }
}
// Updates Simulation Details
async function updateSimulationWeb() {
  try {
    await updateDoc(doc(db, 'sims', window.location.hash.split("edit_sim/")[1]), {
      name: dE("aq_simname").value,
      license: dE("aq_simlicense").value,
      provider: dE("aq_simprov").value,
      url: dE("aq_simurl").value,
      subject: dE("aq_simsubj").value
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
// Displays Simulation For End User
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
  if (simlist.length == 0) {
    var docRef = doc(db, 'sims', 'sims')
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) { var docJSON = docSnap.data(); simlist = docJSON; }
    else { locationHandler("error_page", 1); throw new Error }
  }
  if (type == "physics") {
    try {
      for (let ele of simlist.physics) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "chemistry") {
    try {
      for (let ele of simlist.chemistry) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:crimson" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "maths") {
    try {
      for (let ele of simlist.maths) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:turquoise" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "biology") {
    try {
      for (let ele of simlist.biology) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:lime" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "computer") {
    try {
      for (let ele of simlist.computer) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:violet" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "statistics") {
    try {
      for (let ele of simlist.statistics) {
        if (ele != "") {
          dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:orange" id="sim' + btoa(ele) + '">' + ele + '</span>')
          dE("sim" + btoa(ele)).addEventListener('click', simClicker)
        }
      }
    } catch { }
  }
  if (type == "unfiled") {
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
function addItemToQLLIst() {
  var qans = [dE("aq_answer").value]
  var qtype = dE("aq_type").value
  var qop = [];
  var qop1 = [];
  var qop2 = [];
  if (qtype == "mcq" || qtype == "mcq_multiple") {
    qans = []
    for (i = 0; i < document.getElementsByClassName("aq_mcq_ans").length; i++) {
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
  if (location1.includes("edit_test")) {
    var json = { qid: curr_qlid, mode: dE("aq_mode").value, title: getHTM("aq_qtext"), y_url: dE("aq_yurl").value, hint: dE("aq_hint").value, expl: getHTM("aq_expl"), type: qtype, answer: qans, op: qop, op1: qop1, op2: qop2, section: dE("aq_section").value,pm:dE("aq_posmrks").value,nm:dE("aq_negmrks").value }
  } else if (location1.includes("edit_exams")) {
    var json = { id: curr_qlid, name: dE("aq_examname").value, date: dE("aq_examdate").value, info: dE("aq_examinfo").value, syllabus: dE("aq_examsyllabus").value, mode: "exams" }
  } else {
    var json = { id: curr_qlid, mode: dE("aq_mode").value, title: getHTM("aq_qtext"), y_url: dE("aq_yurl").value, hint: dE("aq_hint").value, expl: getHTM("aq_expl"), type: qtype, answer: qans, op: qop, op1: qop1, op2: qop2, section: dE("aq_section").value,pm:dE("aq_posmrks").value,nm:dE("aq_negmrks").value }
  }
  return json
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
    iu(qyurl); io(qcont); io(qtype); io(qans); qif(qqall);
  } else if (mode == "lesson") {
    io(qyurl); iu(qcont); iu(qtype); iu(qans); qif(qqall);
  } else if (mode == "exams") {
    iu(qyurl); iu(qcont); iu(qtype); iu(qans); iu(qqall);
  }
  if (qtype.value == "mcq" || qtype.value == "mcq_multiple") {
    qif(qmcq); iu(qmat); iu(qans)
  } else if (qtype.value == "matrix") {
    io(qmat); iu(qmcq); iu(qans)
  } else {
    iu(qmat); iu(qmcq); io(qans)
  }
}
function rEQL(u) {
  renderEditQLList(this.innerText)
}
function renderEditQLList(qno) {
  if (qno == "+") {
    let po = editqllist.length
    if (window.location.hash.includes("edit_exams")) {
      editqllist[po] = { id: Date.now() + Math.random().toString(36).substr(2), name: "", date: "", info: "", syllabus: "", mode: "exams" }
    } else {
      editqllist[po] = { id: Date.now() + Math.random().toString(36).substr(2), mode: "", title: "", y_url: "", img: "", hint: "", expl: "", type: "mcq", answer: ["1"], op: ["1", "2", "3", "4"], op1: [], op2: [], section: "Unfiled",pm:4,nm:-1 }
    }
    if (window.location.hash.includes("edit_qubank") || window.location.hash.includes("edit_test")) { editqllist[po].mode = "question" }
    if (location1.includes("edit_test")) {
      editqllist[po].qid = editqllist[po].id
    }
    qno = po
  }
  dE("question_list").innerHTML = ""
  for (var i = 1; i < editqllist.length + 1; i++) {
    dE("question_list").insertAdjacentHTML('beforeend', '<span class = "t_no_qno" id = "t_no_qno_' + i + '">' + i + '</span>')
    dE("t_no_qno_" + i).addEventListener("click", rEQL)
  }
  dE("question_list").insertAdjacentHTML('beforeend', '<span class = "t_no_qno" id = "t_no_qno_add">+</span>')
  dE("t_no_qno_add").addEventListener("click", rEQL)
  // }
  if (qno != 0) {
    editqllist[curr_qlno - 1] = addItemToQLLIst()
    curr_qlno = qno;
  } else {
  }
  var op = editqllist[curr_qlno - 1]
  if (window.location.href.includes("edit_exams")) {
    dE("aq_examname").value = op.name
    dE("aq_examdate").value = op.date
    dE("aq_examinfo").value = op.info
    dE("aq_examsyllabus").value = op.syllabus
    changeItem()
    return;
  }
  if (location1.includes("edit_test")) {
    curr_qlid = op.qid
  } else {
    curr_qlid = op.id
  }
  dE("aq_mode").value = op.mode
  setHTM("aq_qtext", op.title)
  dE("aq_yurl").value = op.y_url
  dE("aq_type").value = op.type
  dE("aq_hint").value = op.hint
  dE("aq_section").value = op.section
  dE("aq_posmrks").value = op.pm
  dE("aq_negmrks").value = op.nm
  setHTM("aq_expl", op.expl)
  if (op.type == "mcq" || op.type == "mcq_multiple") {
    dE("aq_mcq_con").innerHTML = ""
    for (var g = 0; g < op.op.length; g++) {
      addMCQ()
      document.getElementsByClassName("aq_mcq")[g].value = op.op[g]
      for (var h = 0; h < op.answer.length; h++) {
        if (op.op[g] == op.answer[h]) {
          document.getElementsByClassName("aq_mcq")[g].classList.add("aq_mcq_ans")
          document.getElementsByClassName("aq_mcq_p")[g].style.borderColor = "lime"
        }
      }
    }
  } else if (op.type == "numerical" || op.type == "explain" || op.type == "fill" || op.type == "taf") {
    dE("aq_answer").value = op.answer[0]
  }
  changeItem()
}
async function newTopic() {
  try {

    const docRef = await addDoc(collection(db, 'topic'), {
      name: "",
      qllist: [],
      level: "jee",
      chid: "",
      chname: "",
      subject: ""
    })
    locationHandler("edit_tpc/" + docRef.id, 1)
  } catch {
  }
}
async function newQBank() {
  try {

    const docRef = await addDoc(collection(db, 'qbank'), {
      name: "",
      qllist: [],
      level: "jee",
      chid: "",
      chname: "",
      subject: ""
    })
    locationHandler("edit_qubank/" + docRef.id, 1)
  } catch {
  }
}
async function prepareTopicQBank(iun) {
  var col, id;
  if (iun == 1) {
    // Topic
    col = 'topic'
    id = window.location.hash.split("edit_tpc/")[1]
    dE("fu_topic_title").innerText = "Add/Edit Topic"
    dE("aq_mode").innerHTML = `<option value="question">Question</option><option value="lesson">Lesson</option>`
    dE("aq_tpc_save").style.display = "block"
    dE("aq_qbc_save").style.display = "none"
    dE("aq_tst_save").style.display = "none"
    dE("aq_test_extra").style.display = "none"
    dE("aq_exam_save").style.display = "none"
    dE("aq_exams").style.display = "none"
    dE("aq_all").style.display = "flex"
    dE("aq_ans_hold").style.display = "flex"
  } else if (iun == 2) {
    // QBank
    col = 'qbank'
    id = window.location.hash.split("edit_qubank/")[1]
    dE("fu_topic_title").innerText = "Add/Edit QBank"
    dE("aq_mode").innerHTML = `<option value="question">Question</option>`
    dE("aq_tpc_save").style.display = "none"
    dE("aq_tst_save").style.display = "none"
    dE("aq_test_extra").style.display = "none"
    dE("aq_qbc_save").style.display = "block"
    dE("aq_exam_save").style.display = "none"
    dE("aq_exams").style.display = "none"
    dE("aq_all").style.display = "flex"
    dE("aq_ans_hold").style.display = "flex"
  } else if (iun == 3) {
    // Tests
    col = 'tests'
    id = window.location.hash.split("edit_tests/")[1]
    dE("fu_topic_title").innerText = "Add/Edit Tests"
    dE("aq_mode").innerHTML = `<option value="question">Question</option>`
    dE("aq_tpc_save").style.display = "none"
    dE("aq_qbc_save").style.display = "none"
    dE("aq_test_extra").style.display = "flex"
    dE("aq_tst_save").style.display = "block"
    dE("aq_exam_save").style.display = "none"
    dE("aq_exams").style.display = "none"
    dE("aq_all").style.display = "flex"
    dE("aq_ans_hold").style.display = "flex"
  } else if (iun == 4) {
    col = 'quarkz'
    id = 'exams'
    dE("fu_topic_title").innerText = "Add/Edit Exams"
    dE("aq_mode").innerHTML = `<option value="exam">Exam</option>`
    dE("aq_tpc_save").style.display = "none"
    dE("aq_qbc_save").style.display = "none"
    dE("aq_test_extra").style.display = "none"
    dE("aq_exam_save").style.display = "block"
    dE("aq_tst_save").style.display = "none"
    dE("aq_exams").style.display = "flex"
    dE("aq_all").style.display = "none"
    dE("aq_ans_hold").style.display = "none"
  }
  try {
    let docSnap = await getDoc(doc(db, col, id))
    if (docSnap.exists()) {
      if (iun == 1 || iun == 2) {
        var docJSON = docSnap.data();
        dE("aq_tpcname").value = docJSON.name
        dE("aq_tpclevel").value = docJSON.level
        dE("aq_tpc_subj").value = docJSON.subject
        dE("aq_tpc_chapterid").value = docJSON.chid
        editqllist = docJSON.qllist
        renderEditQLList(0)
      } else if (iun == 3) {
        var docJSON = docSnap.data();
        dE("aq_tpcname").value = docJSON.title
        dE("aq_tpclevel").value = docJSON.level
        dE("aq_tpc_subj").value = docJSON.subject
        dE("aq_tst_batches").value = docJSON.batch.toString()
        function dateparser(var1) {
          var now = new Date(var1);
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          return now.toISOString().slice(0, 16);
        }
        dE("aq_tst_stron").value = dateparser(docJSON.strton.seconds * 1000)
        dE("aq_tst_endon").value = dateparser(docJSON.endon.seconds * 1000)
        dE("aq_tst_timealotted").value = docJSON.timeallotted
        dE("aq_tst_syllabi").value = docJSON.syllabus
        let docSnap2 = await getDoc(doc(db, "tests", id, "questions", "questions"))
        let docSnap3 = await getDoc(doc(db, "tests", id, "questions", "answers"))
        let q = []
        let a = []
        if (docSnap2.exists()) { var docJSON2 = docSnap2.data(); q = docJSON2.questions }
        if (docSnap3.exists()) { var docJSON3 = docSnap3.data(); a = docJSON3.questions }
        editqllist = mergeById(q, a)
        renderEditQLList(0)
      } else if (iun == 4) {
        var docJSON = docSnap.data();
        editqllist = docJSON.examinfo
        renderEditQLList(0)
      }

    }
  } catch { }
}
function removeEntry() {
  for (var i = 0; i < editqllist.length; i++) {
    if (editqllist[i].qid == curr_qlid || editqllist.id == curr_qlid) {
      editqllist.splice(i, 1)
      renderEditQLList(0)
      curr_qlid = editqllist[i - 1].qid || editqllist[i - 1].id
      if (curr_qlid == undefined) { curr_qlid = "" }
    }
  }
}
async function updateTopicQBank(iun) {
  for (var i = 0; i < editqllist.length; i++) {
    if (editqllist[i].qid == curr_qlid || editqllist.id == curr_qlid) {
      editqllist[i] = addItemToQLLIst()
    }
  }
  var col, id;
  if (iun == 1) {
    // Topic
    col = 'topic'
    id = window.location.hash.split("edit_tpc/")[1]

  } else if (iun == 2) {
    // QBank
    col = 'qbank'
    id = window.location.hash.split("edit_qubank/")[1]
  } else if (iun == 3) {
    col = 'tests'
    id = window.location.hash.split("edit_tests/")[1]
  } else if (iun == 4) {
    col = 'quarkz'; id = "exams"
  }
  if (iun == 1 || iun == 2) {
    try {
      const docRef = await updateDoc(doc(db, col, id), {
        name: dE("aq_tpcname").value,
        qllist: editqllist,
        level: dE("aq_tpclevel").value,
        chid: dE("aq_tpc_chapterid").value,
        subject: dE("aq_tpc_subj").value
      })
    } catch {
    }
  } else if (iun == 3) {
    try {
      var fgio = new Date(dE("aq_tst_stron").value)
      var fgio2 = new Date(dE("aq_tst_endon").value)
      var wer = dE("aq_tst_batches").value.split(",")
      const docRef = await updateDoc(doc(db, col, id), {
        title: dE("aq_tpcname").value,
        timeallotted: dE("aq_tst_timealotted").value,
        syllabus: dE("aq_tst_syllabi").value,
        strton: fgio,
        endon: fgio2,
        batch: wer,
      })
    } catch {
    }
    var q = [];
    var a = [];
    for (var i = 0; i < editqllist.length; i++) {
      var ele = editqllist[i]
      q.push({ qid: ele.qid, mode: ele.mode, title: ele.title, type: ele.type, op: ele.op, op1: ele.op1, op2: ele.op2, section: ele.section,pm:ele.pm,nm:ele.nm })
      a.push({ qid: ele.qid, hint: ele.hint, expl: ele.expl, answer: ele.answer, section: ele.section,pm:ele.pm,nm:ele.nm })
    }
    try {
      const docRef = await updateDoc(doc(db, col, id, "questions", "questions"), {
        questions: q
      })
    } catch (error) {
      log(error)
    }
    try {
      const docRef = await updateDoc(doc(db, col, id, "questions", "answers"), {
        questions: a
      })
    } catch {
    }
  } else if (iun == 4) {
    const docRef = await updateDoc(doc(db, col, id), {
      examinfo: editqllist
    })
  }
}
function qbkclicker() {
  window.location.hash = "#/qbanks/" + atob(this.id.split("chpqbk")[1])
}
function tpcclicker() {
  window.location.hash = "#/topic/" + atob(this.id.split("chptpc")[1])
}
// Get Topic Info
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
  topicJSON.title = docJSON.name
  topicJSON.qllist = docJSON.qllist
  topicHandler(3)
}
// /#/chapter
// Get Chapter List From Web
async function getChapterEList() {
  dE("chp_chaptername").innerHTML = ""
  dE("chp_qbk_list").innerHTML = ""
  dE("chp_tpc_list").innerHTML = ""
  var docRef = doc(db, 'chapter', window.location.hash.split("#/chapter/")[1])
  var docSnap = await getDoc(docRef);
  var iupa, docJSON;
  var poll = ""
  if (docSnap.exists()) {
    var docJSON = docSnap.data();
    dE("chp_chaptername").innerText = docJSON.name
    try {
      for (let ele of docJSON.qbanks) {
        dE("chp_qbk_list").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="chpqbk' + btoa(ele.id) + '">' + ele.title + '</span>')
        dE("chpqbk" + btoa(ele.id)).addEventListener('click', qbkclicker)
      }
    } catch { }
    try {
      for (let ele of docJSON.topics) {
        dE("chp_tpc_list").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="chptpc' + btoa(ele.id) + '">' + ele.title + '</span>')
        dE("chptpc" + btoa(ele.id)).addEventListener('click', tpcclicker)
      }
    } catch { }
  }
}
// Chapter Link Handler
function chclicker() {
  window.location.hash = "#/chapter/" + atob(this.id.split("qb")[1])
}
// Rendering Chapter List
function renderCList(type) {
  dE("qb_cont_2").innerHTML = ""
  // console.log(chapterlist)
  for (var i = 0; i < chapterlist.length; i++) {
    var ele = chapterlist[i]
    if (ele.subject == type) {
      dE("qb_cont_2").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="qb' + btoa(ele.id) + '">' + ele.name + '</span>')
      dE("qb" + btoa(ele.id)).addEventListener('click', chclicker)
    }
  }
}
// /#/printable
// Print Question Bank
async function printQBank(type) {
  var fireID = "";
  if (type == 1) { fireID = "qbank"; dE("pe_tst_info").style.display = "flex"; dE("eqb_instr").style.display = "none" }
  else if (type == 2) { fireID = "topic"; dE("pe_tst_info").style.display = "none"; dE("eqb_instr").style.display = "none" }
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
    if (ele.mode == "question") {
      var docJSON = ele
      qtitle = docJSON.title;
      qtype = docJSON.type;
      qimg = docJSON.img;
      if (qimg == undefined) { qimg = "" }
      var expl = '<div class = "q_ans_expl" style = "font-weight:bold;color:green;font-size:10px;flex-direction:row;display:none;">Explaination:' + docJSON.expl + '</div>'
      var ans = "<div style = 'font-weight:bold;color:green;font-size:10px;flex-direction:row;display:none' class = 'q_ans_1'>Answer:";
      var inhtml = '<div class = "qbtp_q"><div id = "' + ele.id + '">' + qtitle + '<div class = "qb_q_ty">(' + qtype + ')</div></div>'
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
        var qrt = '<div class = "qb_mcq_exp" type = "a">' + asi + '</div>'
        for (let ele1 of docJSON.answer) {
          ans += "<div class = 'qb_mcq_ans'>" + ele1 + '</div>'
        }
      }
      if (qtype == "taf") {
        qrt = '<ol class = "qb_mcq_exp" type = "a"><li>True</li><li>False</li></ol>'
      }
      if (qtype == "explain" || qtype == "numerical" || qtype == "fill") { qrt = "" }

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
      dE(ele.id).insertAdjacentHTML('beforeend', ans + "</div>")
      dE(ele.id).insertAdjacentHTML('beforeend', expl)
      renderMathInElement(dE('eqb_add'));
    } else if (ele.mode == "lesson") {
      var docJSON = ele
      qtitle = docJSON.title;
      qtype = docJSON.type;
      qimg = docJSON.img;
      var inhtml = '<div class = "les_q"><div id = "' + ele.id + '"><div style = "font-size:3vh;">' + qtitle + '</div><hr color="white" width="100%"></div>'
      dE("eqb_add").insertAdjacentHTML('beforeend', inhtml);
      var expl = '<div class = "les_expl" style = "">' + docJSON.expl + '</div><hr color="white" width="100%">'
      dE(ele.id).insertAdjacentHTML('beforeend', expl)
      renderMathInElement(dE('eqb_add'));
    }
  }
  dE("printable").insertAdjacentHTML('beforeend', '<br></br>')
}
function renderDownloadPage(type) {
  if (type == 1) {
    dE("mainsformulas").innerHTML = `
    <span style="font-size: 5vh;color:yellow" id="fm_title">Mains Formula Sheet</span>
    <hr color="white" width="100%">
    <div style="overflow-y: scroll;height:50vh;" class="flex_type">
    <span class="tlinks rpl" onclick = "window.location.hash = '/notes/PHYFORMULAS'">Physics Formula Sheet</span>
    <span class="tlinks rpl" onclick = "window.location.hash = '/notes/MATHFORMULAS'">Maths Formula Sheet</span>
    <span class="tlinks rpl" onclick = "window.location.hash = '/notes/PCHEMNOTES'">Physical Chemistry Formula Sheet</span>
    <span class="tlinks rpl" onclick = "window.location.hash = '/notes/OCHEMNOTES'">Organic Chemistry Formula Sheet</span>
    <span class="tlinks rpl" onclick = "window.location.hash = '/notes/ICHEMNOTES'">Inorganic Chemistry Formula Sheet</span>
    </div>
    <span style="font-size: 8px;">All PDF's Are Owned by their Respective Owners</span>
    `
  } else if (type == 2) {
    dE("downloads").innerHTML = `
    <span style="font-size: 5vh;color:yellow" id="fm_title">Downloads</span>
    <hr color="white" width="100%">
    <div style="overflow-y: scroll;height:50vh;" class="flex_type">
      
    </div>
    `
  }
}
async function lessonRenderer(docJSON) {
  dE("tp_question").style.display = "none"
  dE("tp_lesson").style.display = "block"
  if (docJSON.y_url == "") {
    dE("tp_full_vid").style.display = "none"
  } else {
    dE("tp_full_vid").style.display = "flex"
    loadVid(docJSON.y_url)
  }
  dE("tp_lsno").innerText = docJSON.title
  dE("tp_expl").innerHTML = docJSON.expl
  // dE("tp_lsimg").src = docJSON.img
}
async function questionRenderer(docJSON, type) {
  function iu(ele) { ele.style.display = "none" }
  function io(ele) { ele.style.display = "block" }
  function qif(ele) { ele.style.display = "flex" }
  iu(dE("tp_hint")); iu(dE("tp_a_expl")); iu(dE("tp_e_answer")); iu(dE("tp_status"))
  var tpmcqcon = dE("tp_mcq_con")
  var tpmatrix = dE("tp_matrix")
  var tpanswer = dE("tp_answer")
  dE("tp_lsno").innerText = "Question"
  dE("tp_question").style.display = "flex"
  dE("tp_lesson").style.display = "none"
  dE("tp_question").setAttribute("dataid", docJSON.id)
  dE("tp_question").setAttribute("qtype", docJSON.type)
  tpmcqcon.innerHTML = ""
  dE("tp_qtext").innerHTML = docJSON.title
  dE("tp_img").src = ""
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
  dE("tp_title").innerText = a
  var cddd = topicJSON.qllist[topicJSONno]
  if (cddd.mode == "lesson") { lessonRenderer(cddd) }
  else if (cddd.mode == "question") { questionRenderer(cddd) }
  stpVid();
}
function addMCQ() {
  var MCQ = `<div class="aq_mcq_p" onclick="changeColor(this)"><input class="aq_mcq"></div>`
  dE("aq_mcq_con").insertAdjacentHTML('beforeend', MCQ)
}
function clearAQ() {
  setHTM("aq_qtext", "")
  setHTM("aq_expl", "")
  dE("aq_answer").value = ""
  dE("aq_yurl").value = ""
  dE("aq_hint").value = ""
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
function requestPasschange() {
  sendPasswordResetEmail(auth, userinfo.email)
    .then(() => {
      log("Success", "Password Reset Email sent.")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      log("Failure", errorMessage)
      // ..
    });
}
async function authStateObserver(user) {
  // var uname = dE("prf_uname")
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
      // uname.textContent = docJSON.email
      dE("dshd_uname").innerText = docJSON.email
      dE("dshd_name").innerText = docJSON.name
      name.textContent = docJSON.name
      phone.textContent = docJSON.mblno
      email.textContent = docJSON.email
      stclass.textContent = docJSON.class
      crton.textContent = new Date(docJSON.sgndon.seconds * 1000).toDateString()
      gender.textContent = docJSON.gen
      batchno = docJSON.batch
      courseno = docJSON.course
      spoints.textContent = docJSON.spoints
      userrole = docJSON.roles['user']
      editorrole = docJSON.roles['editor']
      adminrole = docJSON.roles['admin']
      userinfo.usernotes = docJSON.usernotes
    }
    if (docJSON.deleted == true) {
      log("Warning", "User Account Has Been Deleted")
      signOutUser()
    }
    if (docJSON.gen == "Male") {
      dE("prf_tab_img").src = '/assets/q_male.svg'
      dE("prf_tab_t_t_img").src = "/assets/q_male.svg"
    } else if (docJSON.gen == "Female") {
      dE("prf_tab_img").src = '/assets/q_female.svg'
      dE("prf_tab_t_t_img").src = "/assets/q_female.svg"
    }
    try {
      var docRef = doc(db, "batch", batchno)
      var docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        var docJSON = docSnap.data();
        batch.textContent = docJSON.name;
        dE("dshd_batch").innerText = docJSON.name;
        calenid = docJSON.timetable
        getTestList(batchno, user.uid)
        var iframeurl = "https://calendar.google.com/calendar/embed??height=600&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FKolkata&showTitle=0&showCalendars=0&showTabs=0&showPrint=0&showDate=1&src=" + calenid + "%40group.calendar.google.com&amp;ctz=Asia%2FKolkata"
        tmtifr.src = iframeurl
        if (docJSON.delon.seconds <= parseInt(Date.now() / 1000)) {
          log("Warning", "This Batch Has Been Deleted")
          signOutUser()
          window.reload()
          throw new Error("DENIED")
        }
        for (var i = 0; i < docJSON.chlist.length; i++) {
          chapterlist.push({ name: docJSON.chlist[i].name, id: docJSON.chlist[i].id, subject: docJSON.chlist[i].subject })
        }
      }
    } catch { }
    dE("lg_uname").value = ""
    dE("lg_pass").value = ""
    spoints.style.display = "block"
    dE("dsh_btn").style.display = "block"
    if (window.location.hash == "" || window.location.hash == null || window.location.hash == undefined) {
      // locationHandler("dashboard", 1);
      window.location.hash = "#/dashboard"
      autosignin = 1;
    }
    var docRef = doc(db, "quarkz", "exams")
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      dE("db_exam_list").innerHTML = ""
      if (docJSON.warning != "") {
        log("Notice", docJSON.warning)
      }
      for (var i = 0; i < docJSON.examinfo.length; i++) {
        var f = docJSON.examinfo[i]
        dE("db_exam_list").insertAdjacentHTML("beforeend", `<div class = "tlinks_min rpl"><span style="font-size: 16px;" onclick = "examlog('` + f.name + `','` + f.date + `','` + f.info + `','` + f.syllabus + `')">` + f.name + `</span></div>`)
      }
    }
    locationHandler(window.location.hash.split("#/")[1], 1)
    getUserNotesList()
  } else {
    // uname.textContent = ""
    name.textContent = ""
    phone.textContent = ""
    email.textContent = ""
    stclass.textContent = ""
    spoints.textContent = ""
    spoints.style.display = "none"
    dE("dsh_btn").style.display = "none"
    dE("tp_pnt").style.display = "none"
    dE("tp_edt").style.display = "none";
    locationHandler("login", 1)
    if (autosignin == 1) {
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
  reader.onload = function () {
    var text = reader.result;
    filecontent = text.replace("", "")
    const storageRef = ref(storage, a);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
      // console.log('Uploaded a blob or file!');
    });
  };
  reader.readAsText(file.files[0]);
}
function signUpRestrict() {
  alert("The App Is Invite Only Registrations Are NOT Available Right Now")
}
function checkQuestion() {
  var qid = dE("tp_question").getAttribute("dataid");
  // console.log(qid)
  var type = dE("tp_question").getAttribute("qtype");
  var answer
  var crranswer, explanation, hint
  var status = 0
  for (var i = 0; i < topicJSON.qllist.length; i++) {
    // console.log(topicJSON.qllist[i])
    if (topicJSON.qllist[i].id == qid) {
      crranswer = topicJSON.qllist[i].answer
      explanation = topicJSON.qllist[i].expl
      hint = topicJSON.qllist[i].hint
      break;
    }
  }
  if (type == "numerical" || type == "fill") {
    answer = dE("tp_answer").value
    if (crranswer == answer) {
      dE("tp_status").innerText = "Correct Answer";
      status = 1
    } else {
      dE("tp_status").innerText = "Wrong Answer"
      status = 0
    }
  }
  if (type == "mcq" || type == "mcq_multiple" || type == "taf") {
    answer = []
    for (var k = 0; k < document.getElementsByClassName("tp_mcq_p").length; k++) {
      if (document.getElementsByClassName("tp_mcq_p")[k].classList.contains("aq_mcq_ans")) { answer.push(document.getElementsByClassName("tp_mcq_p")[k].innerText) }
    }
    // console.log(answer, crranswer)
    if (areEqual(answer, crranswer)) {
      dE("tp_status").innerText = "Correct Answer"
      status = 1
    } else {
      dE("tp_status").innerText = "Wrong Answer"
      status = 0
    }
  }
  dE("tp_status").style.display = "block"
  dE("tp_hint").style.display = "block"
  dE("tp_a_expl").style.display = "block"
  dE("tp_e_answer").style.display = "block"
  dE("tp_a_expl").innerHTML = explanation
  dE("tp_hint").innerHTML = hint
  dE("tp_e_answer").innerHTML = "Answer:" + crranswer
}
function printStuff() {
  if (window.location.hash.includes("topic")) {
    changeLocationHash("printable/topic/" + window.location.hash.split("topic/")[1], 1)
  } else if (window.location.hash.includes("qbanks")) {
    changeLocationHash("printable/qbank/" + window.location.hash.split("qbanks/")[1], 1)
  }
  if (window.location.hash.includes("edit_tpc/")) {
    changeLocationHash("printable/topic/" + window.location.hash.split("edit_tpc/")[1], 1)
  } else if (window.location.hash.includes("edit_qubank/")) {
    changeLocationHash("printable/qbank/" + window.location.hash.split("edit_qubank/")[1], 1)
  }
}
function editStuff() {
  if (window.location.hash.includes("topic")) {
    changeLocationHash("edit_tpc/" + window.location.hash.split("topic/")[1], 1)
  } else if (window.location.hash.includes("qbanks")) {
    changeLocationHash("edit_qubank/" + window.location.hash.split("qbanks/")[1], 1)
  }
}
function changeLocationHash(ele, v) {
  window.location.hash = "#/" + ele
  if (ele == "dashboard") { locationHandler("dashboard", 1) }
}
async function lquizinit() {
  lquizcode = location1.split("livequiz")[1]
  var docRef = doc(db, 'livequiz', lquizcode)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { throw new Error }
}
async function getTestList(batchid, userid) {
  if (testList != []) {
    var docRef = doc(db, "batch", batchid, "info", "tests");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      testList = docJSON.tests;
    }
  }
  if (finishedTestList != []) {

    const q = query(collection(db, "tests"), where("finished", "array-contains", userid), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      var min = doc.data()
      var docJSON = { title: min.title, testid: doc.id, finished: true, strton: min.strton, endon: min.endon }
      finishedTestList.push(docJSON)
      var a = 0
      for (let ele of testList) {
        if (ele.testid == docJSON.testid) {
          testList[a].finished = true
        } else { testList[a].finished = false }
        a += 1
      }
    });
  }
  var localtime = parseInt(Date.now() / 1000)
  for (var d = 0; d < testList.length; d++) {
    if (localtime > testList[d].strton.seconds && localtime < testList[d].endon.seconds) {
      activeTestList.push(testList[d])
    } else if (localtime < testList[d].strton.seconds) {
      upcomingTestList.push(testList[d])
    }
  }
}
function testClicker() {
  window.location.hash = "#/instructions/" + this.id
}
function finishedtestClicker() {
  window.location.hash = "#/finished/" + this.id
}
async function newTest() {
  try {
    const docRef = await addDoc(collection(db, 'tests'), {
      title: "",
      totalmarks: 0,
      timeallotted: 0,
      syllabus: "",
      strton: serverTimestamp(),
      endon: serverTimestamp(),
      questionnos: 0,
      finished: [],
      batch: []
    })
    var docRef1 = await setDoc(doc(db, 'tests', docRef.id, "questions", "questions"), {
      questions: []
    })
    var docRef2 = await setDoc(doc(db, 'tests', docRef.id, "questions", "answers"), {
      questions: []
    })
    var docRef4 = await setDoc(doc(db, 'tests', docRef.id, "responses", "finished"), {
      finished: [],
      leaderboard: []
    })

    locationHandler("edit_tests/" + docRef.id, 1)
  } catch {
  }
}
function renderTestList(type) {
  var renList;
  if (type == "active") {
    renList = activeTestList
  } else if (type == "upcoming") { renList = upcomingTestList }
  else if (type == "finished") { renList = finishedTestList }
  // else { console.log("ERROR") }
  dE("testlinks").innerHTML = ""
  for (var ele of renList) {
    var strson = new Date(ele.strton.seconds * 1000)
    var endson = new Date(ele.endon.seconds * 1000)
    var output = '<div class="tlinks" id = "' + ele.testid + '"><span class = "t_title">' + ele.title + '</span><span class = "t_stron">Starts At:' + strson + '</span><span class ="t_endon">Ends At:' + endson + '</div>'
    if (type != "finished" && ele.finished == false) {
      dE("testlinks").insertAdjacentHTML('beforeend', output)
      dE(ele.testid).addEventListener('click', testClicker)
    } else {
      if (type == "finished") {
        dE("testlinks").insertAdjacentHTML('beforeend', output)
        dE(ele.testid).addEventListener('click', finishedtestClicker)
      }

    }
  }
}
async function getSimpleTestReport() {
  var testid = window.location.hash.split("#/finished/")[1]
  var docRef = doc(db, "tests", testid);
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    testInfo = docSnap.data()
    var attempted = 0;
    dE("fti_title").innerText = testInfo.title
    docRef = doc(db, "tests", testid, "responses", "finished");
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      for (var ele of docSnap.data().finished) {
        if (auth.currentUser.uid == ele) {
          attempted = 1;
          break;
        }
      }
    }
    if (attempted == 0) {
      locationHandler("testend", 1)
      dE("te_title").innerText = "You Have NOT Attempted This Test"
    } else {
      if (0 && (Date.now() / 1000 <= testInfo.endon.seconds && testInfo.noresult == false)) {
        // locationHandler("testend", 1)
        // dE("te_title").innerText = "Test Reports will be available after deadline"
      } else {
        try {
          try { computeResult(1) } catch { }
          try {
            docRef = doc(db, "tests", testid, "responses", auth.currentUser.uid);
            docSnap = await getDoc(docRef);
            var tT = docSnap.data()
            if (docSnap.exists()) {
              dE("fto_total").innerText = tT.info.usermarks + "/" + tT.info.total
              dE("fto_correct").innerText = tT.info.correct
              dE("fto_incorrect").innerText = tT.info.incorrect
              dE("fto_unanswered").innerText = tT.info.unattempted
              testActionLogger = tT.actions
              reQW = tT.info.mList
              dE("fto_rank").innerText = "0"
              function r(t, c, ic, un, tm) {
                var z = tm - (c - ic * 4)
                var gf = c + ic
                return `<div><span>` + t + `(` + gf + ` Marks)</span><div style = "width:40vw;height:30px;display:flex;flex-direction:row;"><div style="width:` + c / tm * 40 + `vw;background-color:green;height:30px;text-align:center;color:white">` + c + `/` + tm + `</div><div style="width:` + Math.abs(4 * ic / tm * 40) + `vw;background-color:red;height:30px;text-align:center;color:white">` + ic + `/` + tm + `</div><div style="width:` + (1 - (c - ic * 4) / tm) * 40 + `vw;background-color:orange;height:30px;text-align:center;color:black">` + z + `/` + tm + `</div></div></div>`
              }
              var ion1 = ["Physics", "Chemistry", "Math", "Biology", "Statistics", "Computer", "Unfiled"]
              dE("fto_percents").innerHTML = ""
              for (var eleX of ion1) {
                var el2e2 = tT.info.subjectmarks[eleX]
                if (!areObjectsEqual(el2e2, { correct: 0, unattempted: 0, incorrect: 0, total: 0 })) {
                  dE("fto_percents").insertAdjacentHTML("beforeend", r(eleX, el2e2.correct, el2e2.incorrect, el2e2.unattempted, el2e2.total))
                }
              }
              analyseActions(1).then(function () {
                function qw(t, c, ic, un, tm) {
                  var z = tm - (c + ic)
                  return `<div><span>` + t + `(` + sd(tm) + `)</span><div style = "width:80vw;height:30px;display:flex;flex-direction:row;"><div style="width:` + c / tm * 80 + `vw;background-color:green;height:30px;text-align:center;color:white">` + sd(c) + `</div><div style="width:` + ic / tm * 80 + `vw;background-color:red;height:30px;text-align:center;color:white">` + sd(ic) + `</div><div style="width:` + (1 - (c + ic) / tm) * 80 + `vw;background-color:orange;height:30px;text-align:center;color:black">` + sd(z) + `</div></div></div>`
                }
                var ion1 = ["Physics", "Chemistry", "Math", "Biology", "Statistics", "Computer", "Unfiled"]
                dE("fto_time").innerHTML = ""
                for (var eleX of ion1) {
                  var eXZe2 = analysedActions.subject[eleX]
                  if (!areObjectsEqual(eXZe2, { correct: 0, unattempted: 0, incorrect: 0, total: 0 })) {
                    dE("fto_time").insertAdjacentHTML("beforeend", qw(eleX, eXZe2.correct, eXZe2.incorrect, eXZe2.unattempted, eXZe2.total))
                  }
                }
              })
            }
            try {
              var leaderboard;
              docRef = doc(db, "tests", testid, "responses", "finished");
              docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                leaderboard = docSnap.data().leaderboard
              }
              dE("fto_leaderboard").innerHTML = ""
              leaderboard = sortObj(leaderboard, "marks", 1)
              for (var i = 0; i < leaderboard.length; i++) {
                var e = i + 1
                if (userinfo.uuid == leaderboard[i].uid) { dE("fto_rank").innerText = e }
                dE("fto_leaderboard").insertAdjacentHTML("beforeend", '<div class = "tlinks" style = "flex-direction:row;width:25vw;justify-content:space-between;"><span class = "t_gre">&nbsp;' + e + '</span><span class = "t_name">' + leaderboard[i].name + '</span><span class = "t_gre">&nbsp;&nbsp;' + leaderboard[i].marks + '</span></div>')
              }
            } catch {
              
            }
            var data = []
            for (var i = 0;i<reQW.length;i++){
              if (analysedActions.questions[reQW[i].qid] == undefined){
                data.push({qid:reQW[i].qid,type:reQW[i].type,time:0,no:i+1})
              }else{
                data.push({qid:reQW[i].qid,type:reQW[i].type,time:analysedActions.questions[reQW[i].qid].time,no:i+1})
              }
              
            }
            console.log(data)
            window.questionGraph("fto_draw",data)

          }
          catch {
            dE("te_title").innerText = "ERROR"
            locationHandler("testend", 1)
            return 0;
          }
        } catch { }
      }
    }
  }
}
async function analyseActions(typi) {
  var tQList
  if (typi == 1) {
    var q = window.location.hash.split("/finished/")[1]
    var docRef = doc(db, "tests", q, "questions", "questions");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      tQList = docSnap.data().questions
    }
  } else if (typi == 2) {
    tQList = []
    tQList = testQuestionList
  }

  var qnos = {};
  for (var i = 0; i < testActionLogger.length; i++) {
    testActionLogger[i].time = testActionLogger[i].time.seconds
  }
  var tAL = sortObjv2(testActionLogger, "time", "type", 0)
  var curr_time;
  var next_time;
  var aqid = ""
  for (var i = 0; i < tAL.length; i++) {
    if (tAL[i].type == "b") {
      curr_time = tAL[i].time
      aqid = tAL[i].value
    } else if (tAL[i].type == "a" && aqid == tAL[i].value) {
      next_time = tAL[i].time
      if (qnos[tAL[i].value] == undefined) {
        qnos[tAL[i].value] = {}
        qnos[tAL[i].value].time = 0
      }
      qnos[tAL[i].value].time += next_time - curr_time
      curr_time = next_time
      next_time = 0
    }
  }
  var subJTimes = {
    "Physics": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Chemistry": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Math": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Biology": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Computer": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Statistics": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Unfiled": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }
  }
  var c = 0;
  var ic = 0;
  var un = 0;
  for (var i = 0; i < tQList.length; i++) {
    for (var j = 0; j < reQW.length; j++) {
      if (tQList[i].qid == reQW[j].qid) {
        var ele = qnos[tQList[i].qid]
        if (qnos[tQList[i].qid] == undefined) {
          qnos[tQList[i].section] = {}
          qnos[tQList[i].section].time = 0
        } else {
          subJTimes[tQList[i].section].total += ele.time
          if (reQW[i].marks == 0) {
            subJTimes[tQList[i].section].unattempted += ele.time
            un = un + ele.time
          } else {
            if (reQW[i].marks == tQList[i].pm) {
              subJTimes[tQList[i].section].correct += ele.time
              c = c + ele.time
            } else {
              subJTimes[tQList[i].section].incorrect += ele.time
              ic = ic + ele.time
            }
          }
        }
      }
    }
  }
  var tFinal = { questions: qnos, subject: subJTimes, correct: c, incorrect: ic, unattempted: un }
  analysedActions = tFinal
}
async function getTestReport() {
  dE("tt_footer").style.display = "none"
  dE("tt_sub").style.display = "none"
  dE("tt_timeleft").style.display = "none"
  dE("tt_marksaward").style.display = "block"
  var testid = window.location.hash.split("#/testreport/")[1]
  var docRef = doc(db, "tests", testid);
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    testInfo = docSnap.data()
    var attempted = 0;
    dE("tt_testname").innerText = testInfo.title
    docRef = doc(db, "tests", testid, "responses", "finished");
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      for (var ele of docSnap.data().finished) {
        if (auth.currentUser.uid == ele) {
          attempted = 1;
          break;
        }
      }
    }
    if (attempted == 0) {
      locationHandler("testend", 1)
      dE("te_title").innerText = "You Have NOT Attempted This Test"
    } else {
      if (Date.now() / 1000 <= testInfo.endon.seconds && testInfo.noresult == false) {
        locationHandler("testend", 1)
        dE("te_title").innerText = "Detailed Test Reports will be available after deadline"
      } else {
        try {
          docRef = doc(db, "tests", testid, "questions", "questions");
          docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            testQuestionList = docSnap.data()
          }
          docRef = doc(db, "tests", testid, "responses", auth.currentUser.uid);
          docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            var yuta = docSnap.data().answers
            testActionLogger = docSnap.data().actions
            for (var prop in yuta) {
              testResponseList.push({ qid: prop, ans: yuta[prop].ans, type: yuta[prop].type, time: yuta[prop].time });
            }
          }
          docRef = doc(db, "tests", testid, "questions", "answers");
          docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            testReportAnswers = docSnap.data()
          }
        }
        catch {
          dE("te_title").innerText = "ERROR"
          locationHandler("testend", 1)
          return 0;
        }
        inittestHandler()
      }
    }
  }
}
var testTimerfunction;
async function getTestInfo() {
  dE("tt_footer").style.display = "flex"
  dE("tt_sub").style.display = "block"
  dE("tt_timeleft").style.display = "block"
  dE("tt_marksaward").style.display = "none"
  var testid = window.location.hash.split("#/attempt/")[1]
  var docRef = doc(db, "tests", testid);
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    testInfo = docSnap.data()
    docRef = doc(db, "tests", testid, "responses", "finished")
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      for (var ele of docSnap.data().finished) {
        if (auth.currentUser.uid == ele) {
          locationHandler("testend", 1)
          dE("te_title").innerText = "You Have Already Attempted This Test"
          return 0;
        }
      }
    }
  }
  try {
    docRef = doc(db, "tests", testid, "questions", "questions");
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      testQuestionList = docSnap.data()
    }
  }
  catch {
    dE("te_title").innerText = "The Test Hasnt Started Yet"
    locationHandler("testend", 1)
    return 0;
  }
  // console.log(testInfo, testQuestionList)
  docRef = doc(db, "tests", testid, "responses", auth.currentUser.uid);
  docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var yuta = docSnap.data().answers
    testActionLogger = docSnap.data().actions
    for (var prop in yuta) {
      testResponseList.push({ qid: prop, ans: yuta[prop].ans, type: yuta[prop].type, time: yuta[prop].time });
      // timetaken:yuta[prop].timetaken
    }
  } else {
    var trL = {};
    for (var t = 0; t < testQuestionList.questions.length; t++) {
      trL[`${testQuestionList.questions[t].qid}`] = { type: "tts_notvisit", answer: [] }
      testResponseList.push({ qid: testQuestionList.questions[t].qid, type: "tts_notvisit", answer: [], timetaken: 0 })
    }
    var it = new Date()
    await setDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
      answers: trL,
      strton: serverTimestamp(),
      warning: [],
      actions: [{ type: "start", time: it, value: "1" }],
      testversion: "1"
    })
    testActionLogger.push({ type: "start", time: it, value: "1" })

  }
  if (window.location.hash.includes("/attempt/")) {
    testTimerfunction = setInterval(function () {
      var seconds = testInfo.timeallotted - 1;
      testInfo.timeallotted -= 1
      dE("tt_timeleft").innerText = Math.floor(seconds % (3600 * 24) / 3600) + ":" + Math.floor(seconds % 3600 / 60) + ":" + Math.floor(seconds % 60);
      testQTime +=1
      dE("tt_timespent").innerText = Math.floor(testQTime % (3600 * 24) / 3600) + ":" + Math.floor(testQTime % 3600 / 60) + ":" + Math.floor(testQTime % 60);
      if (seconds == 0) {
        submitTest()
      }
    }, 1000);
  }
  window.onbeforeunload = function (e) {
    e.preventDefault;
    submitTest()
  }
  window.onhashchange = function (e) {
    locationHandler()
    submitTest()
  }
  dE("tt_testname").innerText = testInfo.title
  dE("dsh_btn").style.display = "none"
  dE("tp_pnt").style.display = "none"
  dE("tp_pnt").style.display = "none";
  var tbox = dE("testv1")
  try { fullEle(tbox) } catch { }
  inittestHandler()
}
function tqH() {
  testqHandler(this.id, this.innerText)
}
async function computeResult(type) {
  var trA;
  var trL = [];
  var marksList = [];
  var fg = []
  var testid = ""
  if (window.location.hash.includes("/attempt/")) {
    testid = window.location.hash.split("#/attempt/")[1]
    log("Warning", "Submitting Tests Answers: Please Do Not Close The Tab.")
  } else if (window.location.hash.includes("/finished/")) {
    testid = window.location.hash.split("#/finished/")[1]
  } else if (window.location.hash.includes("/testreport/")) {
    testid = window.location.hash.split("#/testreport/")[1]
  }

  var docRef = doc(db, "tests", testid, "responses", auth.currentUser.uid);
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var yuta = docSnap.data().answers
    fg = docSnap.data().info
    for (var prop in yuta) {
      trL.push({ qid: prop, ans: yuta[prop].ans, type: yuta[prop].type, time: yuta[prop].time });
    }
  }
  docRef = doc(db, "tests", testid, "questions", "answers");
  docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    trA = docSnap.data().questions
  }
  var u = 0, c = 0, ic = 0;
  var subjectmarks = {
    "Physics": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Chemistry": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Math": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Biology": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Computer": { correct: 0, unattempted: 0, incorrect: 0, total: 0 },
    "Statistics": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }, "Unfiled": { correct: 0, unattempted: 0, incorrect: 0, total: 0 }
  }
  for (var i = 0; i < trA.length; i++) {
    for (var j = 0; j < trL.length; j++) {
      if (trA[i].qid == trL[j].qid) {
        var ele = trL[j]
        if (ele.ans == undefined) {
          ele.ans = []
        }
        if (ele.ans.length == 0) {
          marksList.push({ qid: trA[i].qid, marks: 0, type: "unattempted" })
          u = u + parseFloat(trA[i].pm)
          subjectmarks[trA[i].section].unattempted += parseFloat(trA[i].pm)
          subjectmarks[trA[i].section].total += parseFloat(trA[i].pm)
        } else {
          if (areEqual(trA[i].answer, ele.ans)) {
            marksList.push({ qid: trA[i].qid, marks: parseFloat(trA[i].pm), type: "correct" })
            c = c + parseFloat(trA[i].pm)
            subjectmarks[trA[i].section].correct += parseFloat(trA[i].pm)
            subjectmarks[trA[i].section].total += parseFloat(trA[i].pm)
          } else {
            marksList.push({ qid: trA[i].qid, marks: parseFloat(trA[i].nm), type: "incorrect" })
            ic = ic + parseFloat(trA[i].nm)
            subjectmarks[trA[i].section].incorrect += parseFloat(trA[i].nm)
            subjectmarks[trA[i].section].total += parseFloat(trA[i].pm)
          }
        }
      }
    }
  }
  var t = subjectmarks["Physics"].total+subjectmarks["Chemistry"].total+subjectmarks["Math"].total+subjectmarks["Biology"].total+subjectmarks["Computer"].total+subjectmarks["Statistics"].total+subjectmarks["Unfiled"].total
  var tFinal = { correct: c, incorrect: ic, unattempted: u, mList: marksList, total: t, usermarks: c + ic, subjectmarks: subjectmarks }
  if (type == 1) {
    if (!areObjectsEqual(tFinal, fg)) {
      log("NOTICE", "Please Wait, Marks Are Being Updated")
      await updateDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
        info: tFinal
      })
      await updateDoc(doc(db, "tests", testid, "responses", "finished"), {
        leaderboard: arrayUnion({ "uid": userinfo.uuid, "marks": tFinal.usermarks, "name": userinfo.name }),
      })
      locationHandler()
    }
  } else if (type == 0) {
    await updateDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
      info: tFinal
    })
    await updateDoc(doc(db, "tests", testid, "responses", "finished"), {
      leaderboard: arrayUnion({ "uid": userinfo.uuid, "marks": tFinal.usermarks, "name": userinfo.name }),
    })
    locationHandler("testend", 1)
  }
  document.getElementById('msg_popup').style.visibility = 'hidden';
  document.getElementById('msg_popup').style.opacity = '0'
}
function testqHandler(id, no) {
  var MCQ = ``
  var TF = `<div id = "tt_mcq"><span><input type="radio" value="a" class = "q_ans" name = "q_op">True</span><span><input type="radio" value="b" class = "q_ans" name = "q_op">False</span></div> `
  var MCQMULT = ``
  var NUM = `<div id = "tt_num"><input type = "number" class="q_ans"></div>`
  var FILL = `<div id="tt_fill"><input type = "text" class = "q_ans"></div>`
  var MATRIX = `<div id = "tt_matrix"><div>A<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>B<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>C<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div><div>D<span><input type="checkbox" value="a" id="q_ans_a" name = "q_op">1</span><span><input type="checkbox" value="b" id="q_ans_a" name = "q_op">2</span><span><input type="checkbox" value="c" id="q_ans_a" name = "q_op">3</span><span><input type="checkbox" value="d" id="q_ans_a" name = "q_op">4</span></div></div>`
  var u = new Date()
  testQTime = 0;
  if (window.location.hash.includes("/attempt/")) { if (activequestionid != id) { testActionLogger.push({ type: "a", time: u, value: activequestionid }) } }
  dE("tt_qno").innerText = no;
  try { dE(activequestionid).style.border = ""; } catch { }
  activequestionid = id;
  if (window.location.hash.includes("/attempt/")) { testActionLogger.push({ type: "b", time: u, value: activequestionid }) }
  dE(activequestionid).style.border = "purple 3px solid";
  for (let ele of testQuestionList.questions) {
    if (id == ele.qid) {
      dE("tt_qtitle").innerHTML = ""
      var inhtml = '<div class = "qb_q" id = "Q' + ele.qid + '"><div class = "qb_ttl">' + ele.title + '<div id = "qb_q_ty" class = "qb_q_ty qb_qt_ty" >(' + ele.type + ')</div></div></div>'
      dE("tt_qtitle").insertAdjacentHTML('beforeend', inhtml);
      var asi = "";
      if (ele.type == "mcq") {
        var qop = ele.op;
        for (let ele1 of qop) {
          asi += '<li><input type="radio" class = "q_ans" value = "' + ele1 + '" name = "q_op">' + ele1 + '</input></li>'
        }
        var qrt = '<ol class = "qb_mcq" type = "A">' + asi + '</ol>'
      }
      if (ele.type == "mcq_multiple") {
        var qop = ele.op;
        for (let ele1 of qop) {
          asi += '<li><input type="checkbox" class = "q_ans" value = "' + ele1 + '" name = "q_op">' + ele1 + '</input></li>'
        }
        var qrt = '<ol class = "qb_mcq" type = "A">' + asi + '</ol>'
      }
      if (ele.type == "taf") {
        qrt = '<ol class = "qb_mcq" type = "A"><li>True</li><li>False</li></ol>'
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
      var ANS;
      switch (ele.type) {
        case "mcq": ANS = MCQ; break;
        case "mcq_multiple": ANS = MCQMULT; break;
        case "taf": ANS = TF; break;
        // case "explain": ANS = EXPL
        case "numerical": ANS = NUM; break;
        case "matrix": ANS = MATRIX; break;
        case "fill": ANS = FILL; break;
      }
      dE("tt_qtitle").insertAdjacentHTML('beforeend', ANS)
      var tyio;
      if (!window.location.hash.includes("attempt")) {
        for (let ele of testReportAnswers.questions) {
          if (id == ele.qid) {
            tyio = ele.answer
            if (analysedActions != undefined) {
              if (analysedActions.questions[ele.qid] == undefined){
                dE("tt_timespent").innerText = "0 seconds"
              }else{
                dE("tt_timespent").innerText = sd(analysedActions.questions[ele.qid].time)
              }
            }
            var lio = '<div id="tg_answer">Answer: ' + ele.answer + '</div><div id="tg_expl">Explanation: ' + ele.expl + '</div>'
            dE("tt_qtitle").insertAdjacentHTML('beforeend', lio)
          }
        }
      }
      renderMathInElement(dE('tt_qtitle'));
      var fghu = 0;
      for (let ele23 of testResponseList) {
        if (ele23.qid == id) {
          for (var i = 0; i < document.getElementsByClassName("q_ans").length; i++) {
            var ele32 = document.getElementsByClassName("q_ans")[i]
            if (ele.type == "mcq" || ele.type == "mcq_multiple") {
              if (ele23.ans == undefined) { ele23.ans = [] }
              for (let el433 of ele23.ans) {
                if (ele32.value == el433) {
                  ele32.checked = true;
                  fghu = 1;
                  break;
                }
              }
            } else {
              ele32.value = ele23.ans;
              fghu = 1;
            }
          }
          if (!window.location.hash.includes("attempt")) {
            if (areEqual(ele23.ans, tyio)) {
              dE("tt_marksaward").innerHTML = '<div style="color:lime">Correct(+4)</div>'
            } else {
              if (ele23.ans.length == 0) {
                dE("tt_marksaward").innerHTML = '<div style="color:orange">Unanswered(0)</div>'
              } else {
                dE("tt_marksaward").innerHTML = '<div style="color:red">Incorrect(-1)</div>'
              }
            }
          }
        }
      }
      // var fghut = 0;
      for (var k = 0; k < testResponseList.length; k++) {
        if (testResponseList[k].qid == activequestionid) {
          if (testResponseList[k].type == "tts_notvisit" && window.location.hash.includes("attempt")) {
            testResponseList[k].type = "tts_notanswer"
            testOperator("tts_notanswer")
            testResponseList[k].ans = []
            // fghut = 1
            dE(activequestionid).classList.remove("tts_notanswer", "tts_notvisit", "tts_answered", "tts_review", "tts_ansreview")
            dE(activequestionid).classList.add("tts_notanswer")
          }
        }
      }
      // if (fghut == 0) {
      //   testResponseList.push({ qid: activequestionid, ans: [], type: "tts_notanswer" })
      // }
      break;
    }
  }
}
function inittestHandler() {
  var a = 1;
  var itsections = ["tw_Physics", "tw_Chemistry", "tw_Math", "tw_Computer", "tw_Statistics", "tw_Biology", "tw_Unfiled"];
  for (let e2le3 of itsections) {
    dE(e2le3 + "_c").innerHTML = "";
    dE(e2le3).style.display = 'none'
  }

  for (let ele of testQuestionList.questions) {
    var box = '<span class = "tts_notvisit" id = "' + ele.qid + '">' + a + '</span>'
    a = a + 1
    dE("tw_" + ele.section + "_c").insertAdjacentHTML("beforeend", box)
    dE("tw_" + ele.section).style.display = "flex"
    dE(ele.qid).addEventListener("click", tqH)
  }
  if (!window.location.hash.includes("attempt")) {
    for (let ele23 of testResponseList) {
      var id = ele23.qid
      for (let ele of testReportAnswers.questions) {
        if (id == ele.qid) {
          var tyio = ele.answer
          if (ele23.ans == undefined) {
            ele23.ans = []
          }
          if (areEqual(ele23.ans, tyio)) {
            dE(id).classList.add("t_crr")
          } else {
            if (ele23.ans.length == 0) {
              dE(id).classList.add("t_unat")
            } else {
              dE(id).classList.add("t_incrr")
            }
          }
        }
      }
    }
    analyseActions(2)
  }else{
    dE("tt_sub").style.display = "block"
  }
  for (let ele of testResponseList) {
    dE(ele.qid).classList.replace("tts_notvisit", ele.type)
  }
  testqHandler(testQuestionList.questions[0].qid, 1)
}
async function testOperator(type) {
  if (!window.location.hash.includes("attempt")) {
    log("Error", "Performing Test Operations in Test Reports Is Prohibited")
    return 1;
  }
  var aqid = "answers." + activequestionid
  var testid = window.location.hash.split("#/attempt/")[1]
  var triu = dE("qb_q_ty").innerText.split("(")[1]
  if (type == "tts_notanswer") {
    await updateDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
      [`${aqid}`]: { ans: "", type: "tts_notanswer", time: serverTimestamp() }
    })
    var a = 0;
    for (let ele23 of testResponseList) {
      if (ele23.qid == activequestionid) {
        for (var i = 0; i < document.getElementsByClassName("q_ans").length; i++) {
          var ele32 = document.getElementsByClassName("q_ans")[i]
          if (triu == "mcq" || triu == "mcq_multiple") {
            for (var j = 0; j < ele23.ans.length; j++) {
              var ele44 = ele23.ans[j]
              if (ele32.value == ele44) {
                ele32.checked = false
              }
            }
          } else {
            ele23.value = ""
          }
        }
        testResponseList.splice(a, 1)
      }
      a = a + 1
    }

  } else {
    var ans = [];

    for (var i = 0; i < document.getElementsByClassName("q_ans").length; i++) {
      var ele32 = document.getElementsByClassName("q_ans")[i]
      if (triu == "mcq)" || triu == "mcq_multiple)") {
        if (ele32.checked == true) {
          ans.push(ele32.value)
        }
      } else {
        ans.push(ele32.value)
      }
    }
    if (type == "tts_review") { ans = "" }
    await updateDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
      [`${aqid}`]: { ans: ans, type: type, time: serverTimestamp() }
    })
    var eleexists = 0;
    for (let ele of testResponseList) {
      if (ele.qid == activequestionid) {
        ele.ans = ans
        ele.type = type
        eleexists = 1;
      }
    }
    if (eleexists == 0) {
      testResponseList.push({ qid: activequestionid, ans: ans, type: type })
    }
  }
  dE(activequestionid).classList.remove("tts_notanswer", "tts_notvisit", "tts_answered", "tts_review", "tts_ansreview")
  dE(activequestionid).classList.add(type)

}
async function submitTest() {
  if (!window.location.hash.includes("attempt")) {
    log("Error", "Performing Test Operations in Test Reports Is Prohibited")
    return 1;
  }
  var it = new Date()
  testActionLogger.push({ type: "a", time: it, value: activequestionid })
  testActionLogger.push({ type: "end", time: it, value: "1" })
  var testid = window.location.hash.split("#/attempt/")[1]
  window.onbeforeunload = function () { }
  window.onhashchange = locationHandler
  await updateDoc(doc(db, "tests", testid, "responses", auth.currentUser.uid), {
    endon: serverTimestamp(),
    actions: testActionLogger,
    warning: []
  }).then(function(){testResponseList = [];})
  await updateDoc(doc(db, "tests", testid, "responses", "finished"), {
    finished: arrayUnion(auth.currentUser.uid),
  }).then(computeResult(0))
  var endat = new Date(testInfo.endon.seconds * 1000)
  dE("te_endtime").innerText = endat;
  testList = []
  activeTestList = []
  upcomingTestList = []
  finishedTestList = []
  testInfo = []
  testQuestionList = []
  activequestionid = ""
  dE("dsh_btn").style.display = "block"
  dE("tp_pnt").style.display = "none"
  clearInterval(testTimerfunction);
}
window.onbeforeunload = function (event) {
  updatePoints()
};
function internetStatus(type) {
  if (type == 1) { document.getElementById('msg_popup').style.visibility = 'hidden'; document.getElementById('msg_popup').style.opacity = '0' }
  else if (type == 0) { log("WARNING", "You Are Currently Offline.") }
}
window.addEventListener('online', () => internetStatus(1));
window.addEventListener('offline', () => internetStatus(0));
dE("te_title").innerText = "The Test Has Ended"
function defineEvents() {
  function chItem() { changeItem(1) }
  function simHand() { changeLocationHash("simlist", 1) }
  function cybHand() { changeLocationHash("cyberhunt", 1) }
  function abtHand() { changeLocationHash("about", 1) }
  function tmtHand() { changeLocationHash("timetable", 1) }
  function regHand() { changeLocationHash("register", 1) }
  function prfHand() { changeLocationHash("profile", 1) }
  function dshHand() { changeLocationHash("dashboard", 1) }
  function adiHand() { changeLocationHash("functions", 1) }
  function tstinfHand() { changeLocationHash("testinfo", 1) }
  function uscHand() { changeLocationHash("users", 1) }
  function tpcHand() { changeLocationHash("tpclist", 1) }
  function lvqHand() { changeLocationHash("livequiz", 1) }
  function frmHand() { changeLocationHash("forum", 1) }
  function lglHand() { changeLocationHash("legal", 1) }
  function qbaHand() { changeLocationHash("qblist", 1) }
  function chpHand() { changeLocationHash("chplist", 1) }
  function sTestHand() { t_log("Warning", "Are You Sure You Want To End The Test", submitTest, "Yes,Submit") }
  function prvHand() { topicHandler(1) }
  function nxtHand() { topicHandler(2) }
  function actHand() { renderTestList("active") }
  function upcHand() { renderTestList("upcoming") }
  function finHand() { renderTestList("finished") }
  function qbnkend() { dE("watermark").style.display = "flex"; fullEle(dE("qbnk_vid")) }
  function qbnkstr() { prepareVideo() }
  function tsave() { testOperator("tts_answered") }
  function tclear() { testOperator("tts_notanswer") }
  function treview() { testOperator("tts_review") }
  function tansrev() { testOperator("tts_ansreview") }
  function psims() { getSimList("physics") }
  function csims() { getSimList("chemistry") }
  function msims() { getSimList("maths") }
  function bsims() { getSimList("biology") }
  function cosims() { getSimList("computer") }
  function ssims() { getSimList("statistics") }
  function usims() { getSimList("unfiled") }
  function pchb() { renderCList("physics") }
  function cchb() { renderCList("chemistry") }
  function mchb() { renderCList("maths") }
  function bchb() { renderCList("biology") }
  function cochb() { renderCList("computer") }
  function schb() { renderCList("statistics") }
  function uchb() { renderCList("unfiled") }
  function uQL() { updateTopicQBank(1) }
  function uQL2() { updateTopicQBank(2) }
  function uQL3() { updateTopicQBank(3) }
  function uQL4() { updateTopicQBank(4) }
  function rgbtn() { log("Note", "By Clicking on 'Accept And Register' you agree that you accept all Terms And Conditions and Privacy Policy of Quarkz!", signUp, "Accept And Register") }
  var simbtn = dE("sim_btn").addEventListener("click", simHand)
  var sgnbtn = dE("sgn_in").addEventListener("click", signIn);
  // var sgngglbtn = dE("sgn_in_google").addEventListener("click", signInwithGoogle);
  var regbtn = dE("reg_in").addEventListener("click", regHand);;
  var rgbtn = dE("rg_in").addEventListener("click", rgbtn);
  var sgnout = dE("lgt_btn").addEventListener("click", signOutUser);
  var tmtbtn = dE("tmt_btn").addEventListener("click", tmtHand);
  var prfbtn = dE("prf_btn").addEventListener("click", prfHand);
  var abtbtn = dE("abt_btn").addEventListener("click", abtHand);
  var shfbtn = dE("shf_btn").addEventListener("click", shuffleQBank);
  var aqao = dE("aq_ao").addEventListener("click", addMCQ);
  var aqro = dE("aq_ro").addEventListener("click", removeMCQ);
  var aqre = dE("aq_re").addEventListener("click", removeEntry);
  var tmode = dE("aq_mode").addEventListener("change", changeItem)
  var ttype = dE("aq_type").addEventListener("change", changeItem)
  var dshbtn = dE("dsh_btn").addEventListener("click", dshHand);
  var adibtn = dE("adi_btn").addEventListener("click", adiHand)
  var aqsave = dE("aq_tpc_save").addEventListener("click", uQL)
  var aqsave = dE("aq_qbc_save").addEventListener("click", uQL2)
  var aqsave = dE("aq_tst_save").addEventListener("click", uQL3)
  var aqsave = dE("aq_exam_save").addEventListener("click", uQL4)
  var unsave = dE("un_save").addEventListener("click", unotes1)
  var unprint = dE("un_print").addEventListener("click", unotes2)
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
  var tppnt = dE("tp_pnt").addEventListener("click", printStuff)
  var tppnt = dE("aq_export").addEventListener("click", printStuff)
  var tpedt = dE("tp_edt").addEventListener("click", editStuff)
  var cybbtn = dE("cyb_btn").addEventListener("click", cybHand)
  var tiact = dE("ti_act").addEventListener("click", actHand)
  var tiupc = dE("ti_upc").addEventListener("click", upcHand)
  var tifin = dE("ti_fin").addEventListener("click", finHand)
  var tt_save = dE("tt_save").addEventListener("click", tsave)
  var tt_clear = dE("tt_clear").addEventListener("click", tclear)
  var tt_review = dE("tt_review").addEventListener("click", treview)
  var tt_ansreview = dE("tt_ansreview").addEventListener("click", tansrev)
  var p_sims = dE("psims").addEventListener("click", psims)
  var c_sims = dE("csims").addEventListener("click", csims)
  var m_sims = dE("msims").addEventListener("click", msims)
  var b_sims = dE("bsims").addEventListener("click", bsims)
  var co_sims = dE("cosims").addEventListener("click", cosims)
  var s_sims = dE("ssims").addEventListener("click", ssims)
  var u_sims = dE("usims").addEventListener("click", usims)
  var p_chb = dE("pchb").addEventListener("click", pchb)
  var c_chb = dE("cchb").addEventListener("click", cchb)
  var m_chb = dE("mchb").addEventListener("click", mchb)
  var b_chb = dE("bchb").addEventListener("click", bchb)
  var co_chb = dE("cochb").addEventListener("click", cochb)
  var s_chb = dE("schb").addEventListener("click", schb)
  var u_chb = dE("uchb").addEventListener("click", uchb)
  var ttsub = dE("tt_sub").addEventListener("click", sTestHand)
  var chp_btn = dE("chp_btn").addEventListener("click", chpHand)
  var pass_rst_btn = dE("pass_rst_btn").addEventListener("click", requestPasschange)
  var aq_sims_save = dE("aq_sims_save").addEventListener("click", updateSimulationWeb)
  dE("un_print").addEventListener("click", function () {
    dE("un_preview").style.display = "block";
    dE("un_preview").innerHTML = "<h1 style = 'text-align:center;margin:0px'>" + dE("un_title").value + "</h1><br>" + getHTML("un_editable");
    window.idElementPrint(dE("un_preview"), userinfo.name);
  })
  dE("qbnk_vid_btn_e").addEventListener("click", qbnkend)
  dE("qbnk_vid_btn").addEventListener("click", qbnkstr)
}
function plyVid() { window.player.playVideo() }
function stpVid() { try { window.player.stopVideo() } catch { } }
function pauVid() { window.player.pauseVideo() }
function loadVid(videoId) { window.player.loadVideoById(videoId); }
function getHTM(id) { return window.getHTML(id) }
function setHTM(id, html) { window.setHTML(id, html) }
function renderAppInfo() {
  dE("ren_appinf").textContent = JSON.stringify(Quarkz, undefined, 2);
}
function immersiveMode() {

}
var Quarkz = {
  "copyright": "Mr Techtroid 2021-23",
  "vno": "v0.4.0",
  "author": "Mr Techtroid",
  "last-updated": "10/02/2023(IST)",
  "serverstatus": "firebase-online",
}
var handlebox = "login";
var location1 = window.location.hash.split("#/")[1]
var userinfo;
var topicJSON = {};
var topicJSONno = 0;
var editorrole, adminrole, userrole;
var simlist = []
var chapterlist = []
var userdetails = []
var curr_qlno = 0
var curr_qlid = ""
var editqllist = []
var autosignin = 0
var testList = []
var activeTestList = []
var upcomingTestList = []
var finishedTestList = []
var testInfo = []
var testQTime = 0;
var testQuestionList = []
var testResponseList = [];
var activequestionid = ""
var testActionLogger = []
var testReportAnswers = []
var reQW;
var analysedActions;
window.onhashchange = locationHandler
initFirebaseAuth()
defineEvents()
sysaccess()