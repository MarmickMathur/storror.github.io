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

onAuthStateChanged(customerauth, (user) => {
  // so that page only loads when user is signed inn
  // ----------------------------------------------
  let submod = document.getElementById("submodal");
  let modalcards = document.getElementsByClassName("modalcard");
  let Mod = document.getElementById("modal");
  let cards = document.getElementsByClassName("card");
  let getmenu = document.getElementsByClassName("getmenu");
  // ------------------------------------------------------

  let visiblity = {};

  function providestatus(status) {
    if (status) {
      return "open";
    } else {
      return "closed";
    }
  }

  function displaydata(element) {
    let commentsection = [];
    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        // ------------------------------------------
        const ele = element.data()[key];
        let cardid = ele.name + "card";
        let commentlistid = ele.name + "comment";
        let votescounterid = ele.name + "counter";
        let upvoteid = ele.name + "upvote";
        let downvoteid = ele.name + "downvote";
        let voteformid = ele.name + "form";
        let comment_form = `<div class = "m-2"> <form id ="${ele.name}" class = "flex flex-row w-full" ><input type='text' name = "comment" class = "w-[80%] text-white rounded-l-md bg-transparent border-b-2 border-white" required></input> <button type='submit' class = "w-[20%] rounded-r-md bg-white text-gray-700 active:bg-transparent active:text-white"> comment </button> </form> </div>`;
        // ------------------------------------------
        document.getElementById(
          "maincontent"
        ).innerHTML += `<div id="${cardid}" class="card">
          <img src="/images/store image.jpg" alt="canteenimage" class="h-3/4 w-full object-cover">
            <div class="m-3">
            <p id="" class="text-left text-2xl text-gray-700 font-headingside1 uppercase font-bold">
            ${ele.name}</p>
            <div id="status"
            class=" uppercase case font-semibold text-gray-500 flex justify-between items-center">
            ${providestatus(ele.status)} 
            </div>
            </div>
            </div>`;
        //  UPDATING MODAL

        //giving id to each of the modals
        let modalid = ele.name + "modal";
        // resolving for when the visiblity of the element is not definend
        if (typeof visiblity[modalid] == "undefined") {
          visiblity[modalid] = "hidden";
        }
        submod.innerHTML += `<div id="${modalid}" class="modalcard ${
          visiblity[modalid]
        }">
      <img src="/images/store image.jpg" alt="canteenimage" class="h-3/4 w-full object-cover ">
      <div class="m-3">
          <p id="" class=" text-left text-4xl text-gray-200 font-headingside1 uppercase font-bold">
              ${ele.name} </p>
          <p class="text-xl mt-1 uppercase pl-2 font-normal text-gray-400">
              ${ele.adress}
          </p>
          <div>

          </div>

          <div class = "border-2 border-white  m-2 rounded-md">  
          <menu id = "${ele.name}menu">
          </menu> 
          </div >

          <div class = "border-2 border-white text-center bg-transparent  m-2 rounded-md flex flex-row">

            <div class = " text-2xl bg-white text-gray-800 w-[40%]">${providestatus(
              ele.status
            )}</div>

            <div class = "w-[60%] flex flex-row">
              <div class="w-full" >
              <form id = "${voteformid}" class = "w-full"> 
                <input type = "radio" name = "voting" id = "${upvoteid}" value = "true">
                <input type = "radio" name = "voting" id = "${downvoteid}" value = "false">
                <button type = "submit" class = "hidden"></button>
              </form>
              </div>
              <div id = "${votescounterid}" class = "text-xl uppercase pl-2 font-normal text-gray-200">5</div>
            </div>

          </div>
          ${comment_form}
          <div id = "${commentlistid}" class = "border-2 border-white bg-gray-800 text-lg  m-2 rounded-md flex flex-col ">
          </div>

      </div>
    </div>`;
        // -----------------------------------------------

        commentsection.push(ele.name);
      }
    }
    return commentsection;
  }

  function cleardata() {
    document.getElementById("maincontent").innerHTML = "";

    submod.innerHTML = "";
  }

  function populatingmenus(element) {
    let menu = "";

    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        let availablity;
        const ele = element.data()[key];

        if (ele.availablity) {
          availablity = "available";
        } else {
          availablity = "unavailable";
        }

        menu += `<tr >
                      <td class = "w-40% overflow-hidden">${key}</td>
                      <td class = "w-40% overflow-hidden">${availablity}</td>
                      <td class = "w-20%">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                      </svg>
                      </td>
                  </tr>`;
      }
    }
    let menutab = `
    <div class=""> 
    <p class=" uppercase text-2xl font-semibold text-gray-300 border-b-2 border-white p-5"> menu </p>
    <div class =" p-5">
    <table class="uppercase  font-normal text-gray-400 w-full text-left">
            <tr>
              <th class = "w-40% overflow-hidden">item</th>
              <th class = "w-40% overflow-hidden">availablity</th>
              <th class = "w-20%"></th>
            </tr>
            ${menu}
    </table>
    </div>
    </div>
    `;
    return menutab;
  }

  function MapingModcardadnCards(card, modcard) {
    let mapofcardtomodal = {};
    for (const key in card) {
      if (Object.hasOwnProperty.call(card, key)) {
        const element = card[key];
        mapofcardtomodal[element.id] = modcard[key].id;
      }
    }
    return mapofcardtomodal;
  }

  function print(snapshot) {
    snapshot.docs.forEach((doc) => {
      displaydata(doc);
    });
  }

  function displaycomment(element) {
    let callname = element.id + "comment";
    let commentuniqueid = user.email.replace("@gmail.com", "");
    let commentlist = document.getElementById(callname);
    commentlist.innerHTML = "";
    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        const ele = element.data()[key];
        console.log(ele.time.seconds);
        commentlist.innerHTML =
          commentlist.innerHTML +
          `<div class =" text-white flex flex-col border-b-2 border-white p-2"><div><span>${commentuniqueid}</span><span class=" pl-5 text-xs">${new Date(
            ele.time.seconds
          ).toLocaleString()}</span></div><div class = " pl-2">${
            ele.comment
          }</div></div>`;
      }
    }
  }

  function addingbuttons(snapshot) {
    snapshot.docs.forEach((element) => {
      let callname = element.data();
      for (const key in callname) {
        if (Object.hasOwnProperty.call(callname, key)) {
          const element = callname[key];

          let form = document.getElementById(element.name);

          form.addEventListener("submit", (e) => {
            e.preventDefault();
            let store_that_is_commented_on = doc(
              customerdb,
              "comments",
              element.name
            );
            let commentuniqueid =
              user.email.replace("@gmail.com", "") + form.comment.value;
            updateDoc(store_that_is_commented_on, {
              [commentuniqueid]: {
                comment: form.comment.value,
                user: user.email,
                time: serverTimestamp(),
              },
            });
          });
        }
      }
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
    const menus = collection(vendordb, "menus");
    let qmenus = query(menus);
    // -------------------------------------------
    console.log(user.email);
    // -------------------------------------------

    onSnapshot(q, (snapshot) => {
      cleardata();
      print(snapshot);
      addingbuttons(snapshot);

      onSnapshot(qmenus, function printmenu(menusnapshot) {
        // for menus
        menusnapshot.docs.forEach((element) => {
          let menudivid = element.id + "menu";
          let menulist = populatingmenus(element);
          let menudiv = document.getElementById(menudivid);
          if (menudiv != null) {
            menudiv.innerHTML = menulist;
          }
        });
      });

      onSnapshot(qcomments, (snapshot) => {
        snapshot.docs.forEach((element) => {
          displaycomment(element);
        });
      });

      let mapforcardsandmodals = MapingModcardadnCards(cards, modalcards);
      // adding click listener to cards
      for (const key in cards) {
        if (Object.hasOwnProperty.call(cards, key)) {
          const element = cards[key];
          let modalid = mapforcardsandmodals[element.id];
          // this is so that the only a certain modcard is visisble
          element.addEventListener("click", () => {
            Mod.style.display = "flex";
            visiblity[modalid] = "";
            document.getElementById(
              mapforcardsandmodals[element.id]
            ).style.display = "block";
          });
        }
        // this is to stop the bubbling of the event
        for (const key in modalcards) {
          if (Object.hasOwnProperty.call(modalcards, key)) {
            const element = modalcards[key];
            element.addEventListener("click", (e) => {
              e.stopPropagation();
            });
          }
        }

        // this is to return back to home screen
        Mod.addEventListener("click", () => {
          Mod.style.display = "none";
          // removing the display form the modcards
          for (const key in modalcards) {
            if (Object.hasOwnProperty.call(modalcards, key)) {
              const element = modalcards[key];
              element.style.display = "none";
            }
          }

          // this is so that all the modals become hidden
          for (const key in visiblity) {
            if (Object.hasOwnProperty.call(visiblity, key)) {
              visiblity[key] = "hidden";
            }
          }
        });
      }
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
