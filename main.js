// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, orderBy, limit, collection, addDoc, onSnapshot, arrayUnion, arrayRemove, setDoc, updateDoc, getDocs, doc, serverTimestamp, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
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
async function signInWithGoogle() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
  await locationHandler("dashboard", 1);
}
async function signIn() {
  var email = dE("lg_uname").value;
  var password = dE("lg_pass").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // console.log(user.uid)
      locationHandler("dashboard", 1);
      dE("lg_uname").value = ""
      dE("lg_pass").value = ""
      spoints.style.display = "block"
      dE("dsh_btn").style.display = "block"
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
  // locationHandler("login",1);
}
function signUp() {
  var email = dE("rg_uname").value;
  var password = dE("rg_pass").value;
  var name = dE("rg_name").value;
  var mblno = dE("rg_mbleno").value;
  var stclass = dE("rg_class").value;
  if (password != dE("rg_pass1").value) {
    // console.log("ERROR") 
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
function getUserName() {
  return getAuth().currentUser.displayName;
}
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    // console.log(url)
    return url + '?sz=150';
  }
  return url;
}
function locationHandler(newloc, n1) {
  var iorole = adminrole == true || editorrole == true
  if (iorole) { dE("adminonly").style.display = "flex" } else { dE("adminonly").style.display = "none";dE("tp_pnt").style.display = "block" }
  if (location1 == undefined) { newloc = "login" }
  dE(handlebox).classList.remove("_open")
  if (n1 == 1) { window.location.hash = "#/" + newloc }
  handlebox = newloc
  location1 = window.location.hash.split("#/")[1]
  switch (location1) {
    case "profile": handlebox = "profile"; break;
    case "about": handlebox = "aboutus"; break;
    case "login": handlebox = "login"; break;
    case "dashboard": handlebox = "dashboard"; break;
    case "timetable": handlebox = "schedule"; break;
    case "logout": signOut(); break;
    case "taketest": handlebox = "taketest"; break;
    case "livequiz": handlebox = "livequiz"; break;
    case "register": handlebox = "register"; break;
    case "strreport": handlebox = "strreport"; break;
    case "testinfo": handlebox = "tests_1"; break;
    case "legal": handlebox = "legal"; break;
    case "forum": handlebox = "forum"; break;
    case "qblist": handlebox = "qbanklist"; tpcList(2); break;
    case "tpclist": handlebox = "topiclist"; tpcList(1); break;
    case "simlist": handlebox = "simlist"; getsims(); break;
    default: handlebox = "error_page"; break;
  }

  // console.log(iorole)
  if (location1.includes("sims")) { handlebox = "simulations"; getsiminfo() }
  if (location1.includes("qbanks")) { handlebox = "topic"; gettopicinfo(2); }
  if (location1.includes("printable/qbank") && iorole == true) { handlebox = "printable"; prtqbank(1); }
  if (location1.includes("printable/topic") && iorole == true) { handlebox = "printable"; prtqbank(2); }
  if (location1.includes("printable/tests") && iorole == true) { handlebox = "printable"; prtqbank(3); }
  if (location1 == "add" && iorole == true) { handlebox = "additem"; changeItem() }
  if (location1.includes("update") && iorole == true) { handlebox = "additem"; changeItem() }
  if (location1.includes("users") && iorole == true) { handlebox = "users"; userUpdate() }
  if (location1.includes("topic")) { handlebox = "topic"; gettopicinfo(1); }
  if (location1.includes("livequiz")) { handlebox = "livequiz"; lquizinit(); }
  if (userrole == false || userrole == null || userrole == undefined) { handlebox = "error_page" }
  if (location1 == "login") { handlebox = "login" }
  if (location1 == "register") { handlebox = "register" }
  dE(handlebox).classList.add("_open")
  chgby = 1;
  stpVid()
}
async function getsiminfo() {
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
async function userUpdate() { }
function tpcList(type) {
  var m, n, b;
  if (type == 1) {
    m = "tli_cont"; n = "topic/"
    dE(m).innerHTML = ""
    for (let ele of topiclist) {
      var a = "<span class = 'tlinks rpl' id = 'tl" + ele[1] + "'>" + ele[0] + "</span>"
      dE(m).insertAdjacentHTML('beforeend', a);
      dE("tl" + ele[1]).addEventListener("click", function () {
        locationHandler(n + this.id.split("tl")[1], 1);
      })
    }
  }
  else if (type == 2) {
    m = "qb_cont"; n = "qbanks/"
    dE(m).innerHTML = ""
    for (let ele of qlist) {
      var a = "<span class = 'tlinks rpl' id = 'qbq" + ele[1] + "'>" + ele[0] + "</span>"
      dE(m).insertAdjacentHTML('beforeend', a);
      dE("qbq" + ele[1]).addEventListener("click", function () {
        locationHandler(n + this.id.split("qbq")[1], 1);
      })
    }
  }


}
async function getsimid(simname) {
  var fiou;
  const q = query(collection(db, "sims"), where("name", "==", simname));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    fiou = doc.id
  });
  locationHandler("sims/" + fiou, 1)
}
function simclicker() {
  console.log(this.innerText)
  getsimid(this.innerText)
}
async function getsims() {
  dE("sim_cont").innerHTML = ""
  if (simlist = []){
    var docRef = doc(db, 'sims', 'sims')
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) { var docJSON = docSnap.data(); simlist = docJSON}
    else { locationHandler("error_page", 1); throw new Error }
  }
  
  var asa, sio;
  try {
    for (let ele of simlist.physics) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:pink" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.chemistry) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:red" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.maths) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:blue" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.biology) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:green" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.computer) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:violet" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.statistics) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:orange" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele)).addEventListener('click', simclicker)
      }
    }
  } catch { }
  try {
    for (let ele of simlist.unfiled) {
      if (ele != "") {
        dE("sim_cont").insertAdjacentHTML('beforeend', '<span class="tlinks rpl" style = "color:white" id="sim' + btoa(ele) + '">' + ele + '</span>')
        dE("sim" + btoa(ele[0])).addEventListener('click', simclicker)
      }
    }
  } catch { }
}
async function gettopicinfo(type) {
  var ioun = ""; var ioup = "";
  if (type == 1) { ioun = "topic"; ioup = "topic" }
  else if (type == 2) { ioup = "qbanks"; ioun = "qbank" }
  else { ioun = "topic" }
  var itt8 = ioup + "/"
  var topicno = window.location.hash.split(itt8)[1]
  // console.log(topicno)
  var docRef = doc(db, ioun, topicno)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { locationHandler("error_page", 1); throw new Error }
  topicjson = []
  topicjson.push(["title", docJSON.title])
  for (let ele in docJSON.lesson) {
    // console.log(ele, docJSON.lesson[ele])
    topicjson.push(["lessons", docJSON.lesson[ele]])
  }
  for (let ele in docJSON.questions) {
    topicjson.push(["questions", docJSON.questions[ele]])
  }
  // console.log(topicjson)
  topicHandler(3)
}
async function returnDoc(col, docname) {
  var docJSON;
  var docRef = doc(db, col, docname)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { throw new Error }
  return docJSON;
}
async function lquizinit() {
  lquizcode = location1.split("livequiz")[1]
  var docRef = doc(db, 'livequiz', lquizcode)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { throw new Error }


}
async function prtqbank(type) {
  var ioun = "";
  if (type == 1) { ioun = "qbank" }
  else if (type == 2) { ioun = "topic" }
  else if (type == 3) { ioun = "tests" }
  else { ioun = "qbank" }
  // console.log(ioun)
  var itt8 = "printable/" + ioun + "/"
  var qbankno = window.location.hash.split(itt8)[1]
  var qbanktitle = dE("qb_title")
  var docRef = doc(db, ioun, qbankno)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var docJSON = docSnap.data(); qnos = docJSON.questions;
    qbanktitle.innerText = docJSON.title;
  }
  else { locationHandler("error_page", 1); throw new Error }
  var qnos, qtitle, qtype, qimg;

  dE("eqb_add").innerHTML = ""
  for (let ele of qnos) {
    var docRef = doc(db, "question", ele)
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      qtitle = docJSON.title;
      qtype = docJSON.type;
      qimg = docJSON.img;
      var inhtml = '<li class = "qb_q" id = "' + ele + '"><div class = "qb_ttl">' + qtitle + '<div class = "qb_q_ty">(' + qtype + ')</div></div></li>'
      dE("eqb_add").insertAdjacentHTML('beforeend', inhtml);
      if (qimg != "") {
        var iwo = '<div class = "qb_img"><img src = "' + qimg + '"></div>'
        dE(ele).insertAdjacentHTML('beforeend', iwo)
      }
      var asi = "";
      if (qtype == "mcq" || qtype == "mcq_multiple") {
        var qop = docJSON.op;
        for (let ele1 of qop) {
          asi += "<li>" + ele1 + '</li>'
        }
        var qrt = '<ol class = "qb_mcq" type = "a">' + asi + '</ol>'

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
      dE(ele).insertAdjacentHTML('beforeend', qrt)
      renderMathInElement(dE('eqb_add'));
    }
  }
  dE("printable").insertAdjacentHTML('beforeend', '<br></br>')
}
async function addqtoweb() {
  var qtxt = dE("aq_qtext").value
  var qans = dE("aq_answer").value
  var qimg = dE("aq_imgurl").value
  var qexp = dE("aq_expl").value
  var qhint = dE("aq_hint").value
  var qtype = dE("aq_type").value
  var qmode = dE("aq_mode").value
  var qyurl = dE("aq_yurl").value
  var qsubj = dE("aq_subject").value
  var qtopic = dE("aq_topic").value
  var qop = [];
  var qop1 = [];
  var qop2 = [];
  var qno, lsno;
  for (var i = 0; i < document.getElementsByClassName("aq_mcq").length; i++) {
    qop.push(document.getElementsByClassName("aq_mcq")[i].value)
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i1").length; i++) {
    qop1.push(document.getElementsByClassName("aq_i1")[i].value)
  }
  for (var i = 0; i < document.getElementsByClassName("aq_i2").length; i++) {
    qop2.push(document.getElementsByClassName("aq_i2")[i].value)
  }
  // console.log(1)
  if (qmode == "question") {
    var docRef = doc(db, "question", "qno");
    var docSnap = await getDoc(docRef);
    var i = 0;
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      qno = docJSON.avqu;
      // console.log(qno)
      async function eio() {
        try { await setDoc(doc(db, 'question', 'qno'), { avqu: qno }) }
        catch (error) {
          console.error('Error writing new message to Firebase Database', error);
        }
      }
      try {
        await setDoc(doc(db, 'question', qno), {
          title: qtxt,
          answer: qans,
          img: qimg,
          type: qtype,
          hint: qhint,
          expl: qexp,
          op: qop,
          op1: qop1,
          op2: qop2,
          subject: qsubj,
          sgndon: serverTimestamp()
        });
        i = 1;
        // console.log(2)
        var fiou;
        if (qsubj !== "unfiled") {
          const q = query(collection(db, "topic"), where("title", "==", qtopic));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            fiou = doc.id
          });
          await updateDoc(doc(db, 'topic', fiou), {
            questions: arrayUnion(qno)
          })
        }
        qno = parseInt(qno)
        qno = qno + 1;
        qno = qno.toString();
        var qww = qno.length
        if (qno.length != 6) {
          for (i = 0; i <= (5 - qww); i++) { qno = "0" + qno }
        }
        eio();
        clearAQ();

      } catch (error) {
        console.error('Error writing new message to Firebase Database', error);
      }
    };
  } else if (qmode == "lesson") {
    var docRef = doc(db, "lesson", "lsno");
    var docSnap = await getDoc(docRef);
    var i = 0;
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      lsno = docJSON.avqu;
      // console.log(lsno)
      async function eio() {
        try { await setDoc(doc(db, 'lesson', 'lsno'), { avqu: lsno }) }
        catch (error) {
          console.error('Error writing new message to Firebase Database', error);
        }
      }
      try {
        await setDoc(doc(db, 'lesson', lsno), {
          title: qtxt,
          img: qimg,
          y_url: qyurl,
          hint: qhint,
          expl: qexp,
          subject: qsubj,
          sgndon: serverTimestamp()
        });
        i = 1;
        // console.log(2)
        var fiou;
        const q = query(collection(db, "topic"), where("title", "==", qtopic));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          fiou = doc.id
        });
        await updateDoc(doc(db, 'topic', fiou), {
          lesson: arrayUnion(lsno)
        })
        lsno = lsno.split("L")[1]
        lsno = parseInt(lsno)
        lsno = lsno + 1;
        lsno = lsno.toString();
        var qww = lsno.length
        if (lsno.length != 6) {
          for (i = 0; i <= (5 - qww); i++) { lsno = "0" + lsno; }
        }
        lsno = "L" + lsno
        eio();
        clearAQ();
      } catch (error) {
        console.error('Error writing new message to Firebase Database', error);
      }
    };
  } else if (qmode == "sims") {
    var docRef = doc(db, "sims", "simno");
    var docSnap = await getDoc(docRef);
    var i = 0;
    var simno;
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
      simno = docJSON.no;
      // console.log(lsno)
      async function eio() {
        try { await setDoc(doc(db, 'sims', 'simno'), { no: simno }) }
        catch (error) {
          console.error('Error writing new message to Firebase Database', error);
        }
      }
      try {
        await setDoc(doc(db, 'sims', simno), {
          name: dE("aq_simname").value,
          license: dE("aq_simlicense").value,
          provider: dE("aq_simprov").value,
          url: dE("aq_simurl").value
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
        i = 1;
        simno = simno.split("S")[1]
        simno = parseInt(simno)
        simno = simno + 1;
        simno = simno.toString();
        var qww = simno.length
        simno = "S" + simno
        eio();
        clearAQ();
      } catch (error) {
        console.error('Error writing new message to Firebase Database', error);
      }
    };
  }
}
function rendererMK(eleid, toid) {
  var v = marked.parse(dE(eleid).value)
  dE(toid).innerHTML = v
  renderMathInElement(dE(toid));
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
  var qsubj = dE("aq_subject").value
  if (mode == "question") {
    iu(qyurl); io(qcont); io(qtype); io(qans); iu(qimgupl); qif(qqall); iu(qsims);
  } else if (mode == "lesson") {
    io(qyurl); iu(qcont); iu(qtype); iu(qans); iu(qimgupl); qif(qqall); iu(qsims);
  } else if (mode == "uplimg") {
    qif(qimgupl); iu(qqall); iu(qcont); iu(qsims);
  } else if (mode == "topic") {
    iu(qimgupl); iu(qqall); iu(qcont); qif(qtpc); iu(qsims);
  }
  else if (mode == "quebnk") {
    iu(qimgupl); iu(qqall); iu(qcont); qif(qqbk); iu(qsims);
  } else if (mode == "sims") {
    iu(qimgupl); iu(qqall); iu(qcont); iu(qqbk); qif(qsims)
  }
  if (qtype.value == "mcq" || qtype.value == "mcq_multiple") {
    qif(qmcq); iu(qmat); iu(qans)
  } else if (qtype.value == "matrix") {
    io(qmat); iu(qmcq); iu(qans)
  } else {
    iu(qmat); iu(qmcq); io(qans)
  }
  if (t == 1) {
    dE("aq_topic").innerHTML = ""
    var docRef = doc(db, 'topic', qsubj)
    var docSnap = await getDoc(docRef);
    var iupa, docJSON;
    var poll = ""
    if (docSnap.exists()) { var docJSON = docSnap.data(); iupa = docJSON.topics }
    for (let ele of iupa) {
      poll = poll + "<option value = '" + ele + "'>" + ele + "</option>"
    }
    dE("aq_topic").insertAdjacentHTML('beforeend', poll)
  }
}
async function lessonRenderer(lessonid) {
  dE("tp_question").style.display = "none"
  dE("tp_lesson").style.display = "block"
  var docRef = doc(db, "lesson", lessonid)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) { var docJSON = docSnap.data(); }
  else { locationHandler("error_page", 1); throw new Error }
  // console.log(docJSON)
  loadVid(docJSON.y_url)
  dE("tp_lsno").innerText = docJSON.title
  dE("tp_expl").innerText = docJSON.expl
  dE("tp_lsimg").src = docJSON.img
}
async function questionRenderer(qid, type) {
  function iu(ele) { ele.style.display = "none" }
  function io(ele) { ele.style.display = "block" }
  function qif(ele) { ele.style.display = "flex" }
  var tpmcqcon = dE("tp_mcq_con")
  var tpmatrix = dE("tp_matrix")
  var tpanswer = dE("tp_answer")
  dE("tp_lsno").innerText = "Question"
  dE("tp_question").style.display = "flex"
  dE("tp_lesson").style.display = "none"
  var docRef = doc(db, "question", qid)
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    var docJSON = docSnap.data();
    // console.log(docJSON) 
  }
  else { locationHandler("error_page", 1); throw new Error }
  tpmcqcon.innerHTML = ""
  dE("tp_qtext").innerText = docJSON.title
  dE("tp_img").src = docJSON.img
  if (docJSON.type == "mcq" || docJSON.type == "mcq_multiple") {
    qif(tpmcqcon); iu(tpmatrix); iu(tpanswer)
    var qop = docJSON.op; var asi = "";
    for (let ele1 of qop) {
      asi += '<div class="tp_mcq_p rpl">' + ele1 + '</div>'
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
  if ((topicjsonno < (topicjson.length - 1)) && type == 2) {
    topicjsonno = topicjsonno + pol
  } else if (type == 1 && (topicjsonno > 1)) {
    topicjsonno = topicjsonno + pol
  }
  if (type == 3) { topicjsonno = 1 }
  var a = topicjson[0]
  // console.log(a)
  if (a[0] == "title") {
    dE("tp_title").innerText = a[1]
    // console.log(a[1])
  }
  var cddd = topicjson[topicjsonno]
  // console.log(cddd)
  if (cddd[0] == "lessons") { lessonRenderer(cddd[1]) }
  else if (cddd[0] == "questions") { questionRenderer(cddd[1]) }
  stpVid();
}
function addMCQ() {
  var MCQ = `<input class = "aq_mcq">`
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
  document.getElementsByClassName("aq_mcq")[document.getElementsByClassName("aq_mcq").length - 1].remove()
}
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
  locationHandler("dashboard", 1)
}
function shufflebank() {
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
  var course = dE("prf_course")
  var stclass = dE("prf_class")
  var batch = dE("prf_batch")
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
      // console.log(userinfo)
      uname.textContent = docJSON.email
      name.textContent = docJSON.name
      phone.textContent = docJSON.mblno
      email.textContent = docJSON.email
      stclass.textContent = docJSON.class
      batchno = docJSON.batch
      courseno = docJSON.course
      spoints.textContent = docJSON.spoints
      userrole = docJSON.roles['user']
      editorrole = docJSON.roles['editor']
      adminrole = docJSON.roles['admin']
      // console.log(adminrole)
    } else {
      // console.log("No such document!");
    }
    docRef = doc(db, "batch", batchno)
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      batch.textContent = docJSON.name;
      calenid = docJSON.timetable
      // console.log(docJSON)
      for (var i = 0; i < docJSON.topics.topicname.length; i++) {
        topiclist.push([docJSON.topics.topicname[i], docJSON.topics.topicno[i]])
      }
      for (var i = 0; i < docJSON.qbank.qbanktitle.length; i++) {
        qlist.push([docJSON.qbank.qbanktitle[i], docJSON.qbank.qbankid[i]])
      }
      // console.log(topiclist)
    }
    docRef = doc(db, "course", courseno)
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data();
      course.textContent = docJSON.title;
    }

    var iframeurl = "https://calendar.google.com/calendar/embed?src=" + calenid + "%40group.calendar.google.com&amp;ctz=Asia%2FKolkata"
    tmtifr.src = iframeurl
    spoints.style.display = "block"
    dE("dsh_btn").style.display = "block"
    
  } else {
    uname.textContent = ""
    name.textContent = ""
    phone.textContent = ""
    email.textContent = ""
    stclass.textContent = ""
    spoints.textContent = ""
    locationHandler("login", 1)
    spoints.style.display = "none"
    dE("dsh_btn").style.display = "none"
    dE("tp_pnt").style.display = "none"
  }
}
function upl1() { uploadImages("aq_upl", "aq_uplurl") }
function uploadImages(ele) {
  var a = serverTimestamp()
  var file = dE(ele)
  const storageRef = ref(storage, a);
  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    // console.log('Uploaded a blob or file!');
  });
}
function rndAQ() {
  rendererMK("aq_qtext", "aq_renderer")
}

function signUpRestrict() {
  alert("The App Is Invite Only Registrations Are NOT Available Right Now")
}
function dE(ele) {
  return document.getElementById(ele)
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
function chItem() { changeItem(1) }
function simHand() { changeLocationHash("simlist", 1) }
function abtHand() { changeLocationHash("about", 1) }
function tmtHand() { changeLocationHash("timetable", 1) }
function regHand() { changeLocationHash("register", 1) }
function prfHand() { changeLocationHash("profile", 1) }
function dshHand() { changeLocationHash("dashboard", 1) }
function adiHand() { changeLocationHash("add", 1) }
function pqbHand() { changeLocationHash("printable/qbank", 1) }
function tstinfHand() { changeLocationHash("testinfo", 1) }
function uscHand() { changeLocationHash("users", 1) }
function tpcHand() { changeLocationHash("tpclist", 1) }
function lvqHand() { changeLocationHash("livequiz", 1) }
function frmHand() { changeLocationHash("forum", 1) }
function lglHand() { changeLocationHash("legal", 1) }
function qbaHand() { changeLocationHash("qblist", 1) }
function prvHand() { topicHandler(1) }
function nxtHand() { topicHandler(2) }
function plyVid() { window.player.playVideo() }
function stpVid() { window.player.stopVideo() }
function pauVid() { window.player.pauseVideo() }
function loadVid(videoId) { player.loadVideoById(videoId); }
var Quarkz = {
  "copyright": "Mr Techtroid 2021",
  "vno": "v0.1.0"
}
var handlebox = "login";
var location1 = window.location.hash.split("#/")[1]
var sgngoogle = dE("sgn_in_ggl");
var tabbar = dE("tabbar");
var userinfo;
var topicjson = [];
var topicjsonno = 0;
var loginpage = dE("login");
var aboutuspage = dE("aboutus");
var plphoto = dE("pl_photo");
var editorrole, adminrole, userrole;
var topiclist = []
var qlist = []
var simlist = []
var simbtn = dE("sim_btn").addEventListener("click", simHand)
var sgnbtn = dE("sgn_in").addEventListener("click", signIn);
var regbtn = dE("reg_in").addEventListener("click", regHand);;
var rgbtn = dE("rg_in").addEventListener("click", signUp);
var sgnout = dE("lgt_btn").addEventListener("click", signOutUser);

var tmtbtn = dE("tmt_btn").addEventListener("click", tmtHand);
var prfbtn = dE("prf_btn").addEventListener("click", prfHand);
var abtbtn = dE("abt_btn").addEventListener("click", abtHand);
var shfbtn = dE("shf_btn").addEventListener("click", shufflebank);
var aqao = dE("aq_ao").addEventListener("click", addMCQ);
var aqro = dE("aq_ro").addEventListener("click", removeMCQ);
var tmode = dE("aq_mode").addEventListener("change", changeItem)
var tsub = dE("aq_subject").addEventListener("change", chItem)
var ttype = dE("aq_type").addEventListener("change", changeItem)
var aqsavebtn = dE("aq_save").addEventListener("click", addqtoweb);
var aqqtxt = dE("aq_qtext").addEventListener("keyup", rndAQ);
var dshbtn = dE("dsh_btn").addEventListener("click", dshHand);
var adibtn = dE("adi_btn").addEventListener("click", adiHand)
var pqbbtn = dE("pqb_btn").addEventListener("click", pqbHand)
var uplfile = dE("upl_files").addEventListener("click", uploadImages)
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
// sgngoogle.addEventListener("click",signInWithGoogle);
var chgby = 1;
window.onhashchange = locationHandler
initFirebaseAuth()