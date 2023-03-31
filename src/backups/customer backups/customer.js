import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// firebaseConfig for customer app
const firebaseconfig1 = {
  apiKey: "AIzaSyCL4vpApFoiEd2NI_krVgWp85CcPWmD5Oc",
  authDomain: "customer-b1eaa.firebaseapp.com",
  projectId: "customer-b1eaa",
  storageBucket: "customer-b1eaa.appspot.com",
  messagingSenderId: "105439236709",
  appId: "1:105439236709:web:de6b1033bde5935d7a2c8c",
};

const firebaseconfig2 = {
  apiKey: "AIzaSyD7vJO8kRKqyXY9WKAxpR26WG63a0f-Vws",
  authDomain: "vendor-a8255.firebaseapp.com",
  projectId: "vendor-a8255",
  storageBucket: "vendor-a8255.appspot.com",
  messagingSenderId: "218244970044",
  appId: "1:218244970044:web:2326416fbe1495dc017539",
};

const customer = initializeApp(firebaseconfig1, "customer");
const customerauth = getAuth(customer);
const customerdb = getFirestore(customer);

const vendor = initializeApp(firebaseconfig2, "vendor");
const vendordb = getFirestore(vendor);

onAuthStateChanged(customerauth, (user) => {// so that page only loads when user is signed inn 
  // ----------------------------------------------
  function displaydata(element) {
    let commentsection = [];
    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        // ------------------------------------------
        const ele = element.data()[key];
        let commentlistid = ele.name + "comment";
        let votescounterid = ele.name + "counter";
        let upvoteid = ele.name + "upvote";
        let downvoteid = ele.name + "downvote";
        let comment_form = `<td> <form id ="${ele.name}" ><input type='text' name = "comment"></input> <button type='submit'> comment </button> </form> </td>`;
        // ------------------------------------------
        document.getElementById("storetable").innerHTML =
          document.getElementById("storetable").innerHTML +
          `<tr> 
          <td>${ele.name}</td> 
          <td>${ele.adress}</td> 
          <td>${ele.status}</td> 
          ${comment_form}
          <td><ul id ="${commentlistid}"><ul> </td> 
          <td> 
            <button id="${upvoteid}"> upvote</button> 
            <button id="${downvoteid}">downvote </button>
          </td> 
          <td id = "${votescounterid}"></td> 
          </tr>`;
        // -----------------------------------------------
        commentsection.push(ele.name);
      }
    }
    return commentsection;
  }

  function cleardata() {
    document.getElementById("storetable").innerHTML = `<tr> 
      <td>name</td> 
      <td>adress</td> 
      <td>status</td> 
      <td>comment</td> 
      <td>comments </td> 
      <td> id the status correct</td>
      <td> counter </td>
    </tr>`;
  }

  function comment_submit(element, user) {
    let comment_form = document.getElementById(element);

    comment_form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("working");
      let store_that_is_commented_on = doc(customerdb, "comments", element);
      let commentuniqueid =
        user.email.replace("@gmail.com", "") + comment_form.comment.value;
      // ----------------------------------------------
      updateDoc(store_that_is_commented_on, {
        [commentuniqueid]: {
          comment: comment_form.comment.value,
          user: user.email,
          time: serverTimestamp(),
        },
      });
    });
  }

  function print(snapshot) {
    cleardata();
    snapshot.docs.forEach((doc) => {
      let commentsection = displaydata(doc);
      commentsection.forEach((element) => {
        comment_submit(element, user);
      });
    });
  }

  function displaycomments(doc) {
    let callname = doc.id + "comment";
    console.log(callname);
    let commentlist = document.getElementById(callname);
    commentlist.innerHTML = "";

    for (const store in doc.data()) {
      if (Object.hasOwnProperty.call(doc.data(), store)) {
        const ele = doc.data()[store];
        commentlist.innerHTML =
          commentlist.innerHTML + `<li>${ele.comment}</li>`;
      }
    }
  }

  function counter(snapshot) {
    snapshot.docs.forEach((element) => {
      console.log(element.id);
      let callnameupvote = element.id + "upvote";
      let callnamedownvote = element.id + "downvote";
      let doctobeupdate = doc(customerdb, "votes", element.id);
      // console.log(doc.id);
      document.getElementById(callnameupvote).addEventListener("click", () => {
        getDoc(doctobeupdate).then((doc) => {
          console.log("upvote");
          let counter = doc.data().counter + 1;
          updateDoc(doctobeupdate, {
            counter: counter,
          });
        });
      });
      document
        .getElementById(callnamedownvote)
        .addEventListener("click", () => {
          getDoc(doctobeupdate).then((doc) => {
            console.log("upvote");
            let counter = doc.data().counter - 1;
            updateDoc(doctobeupdate, {
              counter: counter,
            });
          });
        });
    });
  }
  // ----------------------------------------------------------------

  if (user) {
    const comments = collection(customerdb, "comments");
    let qcomments = query(comments);
    // --------------------------------------------
    const users = collection(vendordb, "users");
    let q = query(users);
    // -------------------------------------------
    const votes = collection(customerdb, "votes");
    let qvotes = query(votes);
    // ----------------------------------------------

    console.log(user.email);

    // -------------------------------------------
    onSnapshot(q, (snapshot) => {
      print(snapshot);
      onSnapshot(qcomments, function updatecomments(snapshot) {
        snapshot.docs.forEach(displaycomments);
      });
      onSnapshot(qvotes, (snapshotofvotes) => {
        snapshotofvotes.docs.forEach((element) => {
          let callsign = element.id + "counter";
          document.getElementById(callsign).innerText = element.data().counter;
        });
      });
      getDocs(votes).then(counter);
    });
    // ------------------------------------------------------------
  } else {
    document.getElementById("gotohomepage").style.visibility = "visible";
    document.getElementById("gotohomepage").addEventListener("click", () => {
      document.location = "index.html";
    });
    console.log("user is signed out");
  }
});
