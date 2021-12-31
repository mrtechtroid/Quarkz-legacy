import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, orderBy, limit, collection, addDoc, onSnapshot, arrayUnion, arrayRemove, setDoc, updateDoc, getDocs, doc, serverTimestamp, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js';

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

function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
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
    var d = "<div id = 'dM" + id + "'><span class = 'dmName'>" + name + ": </span><span class = 'dmText'>" + text + "</span><span class = 'dmtime'>" + time + "</span></div>"
    dE("forum_live").insertAdjacentHTML(e, d)
  }
  function deleteMessage(id) { dE("dM" + id).remove() }
  async function gtMsg() {
    dE("forum_live").innerHTML = ""
    const recentMessagesQuery = query(collection(getFirestore(), 'forum'), orderBy('sgndon', 'desc'), limit(10));
    onSnapshot(recentMessagesQuery, function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === 'removed') {
          deleteMessage(change.doc.id);
        } else if (change.type == 'added') {
            if (a=12){
                e = "beforeend"
            }
          var message = change.doc.data();
          displayMessage(change.doc.id, "", message.name,
                        message.message,);
          a = a+1
        }
      });
    });
  }

function dE(ele) {
    return document.getElementById(ele)
  }
async function authStateObserver(user) {
    if (user) {
        var docRef = doc(db, "users", user.uid);
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var docJSON = docSnap.data()
        console.log(user)
        dE("forum").classList.add("_open")
        userinfo = docJSON
        userinfo.uuid = user.uid}
    } else {
        // console.log("No such document!");
    }
}
var userinfo = []
var fmsend = dE("fm_send").addEventListener("click", sndMsg)
var a = 1;
var e = "afterbegin"
initFirebaseAuth()
gtMsg();