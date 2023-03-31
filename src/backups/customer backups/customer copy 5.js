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
  orderBy,
  deleteField,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
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
  let filter1btns = document.getElementsByClassName("filter1");
  let search = document.querySelector('input[type = "search"]');
  let searchbtn = search.nextElementSibling;
  let submod = document.getElementById("submodal");
  let modalcards = document.getElementsByClassName("modalcard");
  let Mod = document.getElementById("modal");
  let cards = document.getElementsByClassName("card");
  let getmenu = document.getElementsByClassName("getmenu");
  // ------------------------------------------------------
  let visiblity = {};
  let controllarray = [];
  let invisiblecards = [];
  let filter = false;

  function union(x, y) {
    let a = x;
    let b = y;
    for (let index = 0; index < a.length; index++) {
      const elea = a[index];
      let ifbroken = false;
      for (let i = 0; i < b.length; i++) {
        const eleb = b[i];
        if (elea.name != eleb.name) {
          continue;
        } else {
          ifbroken = true;
          break;
        }
      }
      if (!ifbroken) {
        b.push(elea);
      }
    }
    return b;
  }

  function renderingopenstores() {
    invisiblecards.forEach((element) => {
      let cardid = element.name + "card";
      document.getElementById(cardid).style.display = "none";
    });
  }

  function checkclosedfilter(store) {
    if (!store.status) {
      // console.log(store.name);
      return store.name;
    }
  }

  function fillinginvisiblearray() {
    invisiblecards = [];
    invisiblecards = controllarray.filter(checkclosedfilter);
  }

  function fillingcontrollarray(snapshot) {
    controllarray = [];
    for (const key in snapshot.docs) {
      if (Object.hasOwnProperty.call(snapshot.docs, key)) {
        const doc = snapshot.docs[key];
        for (const key in doc.data()) {
          if (Object.hasOwnProperty.call(doc.data(), key)) {
            const store = doc.data()[key];
            controllarray.push(store);
          }
        }
      }
    }
    fillinginvisiblearray();
  }

  function spacestoЊ(a) {
    return a.replaceAll(" ", "Њ");
  }

  function Њtospaces(a) {
    return a.replaceAll("Њ", " ");
  }

  function uniqueid() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  function check(params) {
    if (params == "true") {
      return true;
    } else {
      return false;
    }
  }

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
        let comment_form = `<div class = "mt-2 mx-2">
        <div class=" text-gray-800 font-semibold p-2 text-xl border-2 border-b-0 inline-block bg-white border-white rounded-t-md ">comments</div>
         <form id ="${ele.name}" class = "flex flex-row w-full" >
         <input type='text' name = "comment" class = "w-[80%] text-white bg-transparent border-b-2 border-white" required></input> 
        <button type='submit' class = "w-[20%] rounded-tr-md bg-white text-gray-700 active:bg-transparent active:text-white">
            <svg fill="currentColor" viewBox="0 0 20 20" class = " aspect-square w-6 mx-auto hover:fill-black h-6 " xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"></path>
            </svg>
          </button> 
          </form>
          </div>`;
        // ------------------------------------------
        document.getElementById(
          "maincontent"
        ).innerHTML += `<div id="${cardid}" class="card">
          <img src="${
            ele.image
          }" alt="canteenimage" class="h-3/4 w-full object-cover">
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
      <img src="${
        ele.image
      }}" alt="canteenimage" class="h-3/4 w-full object-cover ">
      <div class="p-3 bg-slate-900">
          <p id="" class=" text-left text-4xl text-gray-200 font-headingside1 uppercase font-bold">
              ${ele.name} </p>
          <p class="text-xl mt-1 uppercase pl-2 font-normal text-gray-400">
          <svg fill="currentColor" class = " aspect-square inline-block w-6 mx-auto h-6 " viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path clip-rule="evenodd" fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"></path>
          </svg>
              ${ele.adress}
          </p>
          <div>

          </div>

          

          <div class = "border-2 border-white text-center bg-transparent  m-2 rounded-md flex flex-row">

            <div class = " text-2xl bg-white text-gray-800 w-[40%]">${providestatus(
              ele.status
            )}</div>

            <div class = "w-[50%] flex flex-row">
              <div class="w-full" >
              <form id = "${voteformid}" class = " flex h-full  justify-center"> 
              <label class = " cursor-pointer">
                <input type = "radio" class = "hidden peer" name = "voting" id = "${upvoteid}" value = "true">
                <div class = " bg-transparent text-white hover:text-black px-5 hover:bg-white h-full text-center peer-checked:text-black peer-checked:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
                </div>
              </label>
              <label class = " cursor-pointer">
                <input type = "radio" class = "hidden peer" name = "voting" id = "${downvoteid}" value = "false">
                <div class = " bg-transparent text-white hover:text-black px-5 hover:bg-white h-full text-center peer-checked:text-black peer-checked:bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.773c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                </svg>
                </div>
              </label>
              </form>
              </div>
              <div id = "${votescounterid}" class = "text-xl uppercase font-normal text-gray-200"></div>
            </div>

          </div>
          <div id = "${ele.name}menu">  
          </div >
          ${comment_form}
          <div id = "${commentlistid}" class = "border-2 border-b-0 border-white bg-gray-800 text-lg  mb-2 mx-2 rounded-b-md flex flex-col ">
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

        menu += `<tr class = "w-full" >
                      <td class = "w-[50%] overflow-hidden">${key}</td>
                      <td class = "w-[50%] text-right overflow-hidden">${availablity}</td>
                  </tr>`;
      }
    }
    let menutab = `
    <div class = "border-2 border-white  my-5 mx-2 rounded-md"> 
    <p class=" uppercase text-2xl font-semibold bg-white text-gray-800 border-b-2 text-center border-white p-2"> menu </p>
    <div class =" p-5">
    <table class="uppercase  font-normal text-gray-400 w-full text-left">
            <tr>
              <th class = "w-[50%] overflow-hidden">item</th>
              <th class = "w-[50%] text-right overflow-hidden">availablity</th>
            </tr>
            ${menu}
    </table>
    </div>
    </div>
    `;
    if (menu == "") {
      return "";
    } else {
      return menutab;
    }
  }

  function voting(element, user) {
    let uvoterid = user.email.replace("@gmail.com", "");

    let voteformid = element.id + "form";
    let form = document.getElementById(voteformid);

    let upvoteid = element.id + "upvote";
    let upvote = document.getElementById(upvoteid);
    let downvoteid = element.id + "downvote";
    let downvote = document.getElementById(downvoteid);
    let votecounter = doc(customerdb, "votes", element.id);

    if (typeof element.data()[uvoterid] == "undefined") {
      {
        upvote.addEventListener("click", () => {
          updateDoc(votecounter, {
            [uvoterid]: check(form.voting.value),
          });
        });

        downvote.addEventListener("click", () => {
          updateDoc(votecounter, {
            [uvoterid]: check(form.voting.value),
          });
        });
      }
    } else if (element.data()[uvoterid]) {
      upvote.setAttribute("checked", "checked");
      downvote.addEventListener("click", () => {
        updateDoc(votecounter, {
          [uvoterid]: check(form.voting.value),
        });
        upvote.addEventListener("click", () => {
          updateDoc(votecounter, {
            [uvoterid]: check(form.voting.value),
          });
        });
      });
    } else {
      downvote.setAttribute("checked", "checked");
      upvote.addEventListener("click", () => {
        downvote.addEventListener("click", () => {
          updateDoc(votecounter, {
            [uvoterid]: check(form.voting.value),
          });
        });

        updateDoc(votecounter, {
          [uvoterid]: check(form.voting.value),
        });
      });
    }
  }

  function updatingcounter(element) {
    let uvoterid = user.email.replace("@gmail.com", "");
    let counterid = element.id + "counter";
    let counter = document.getElementById(counterid);
    let votes = 0;
    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        const ele = element.data()[key];
        if (ele) {
          votes++;
        } else {
          votes--;
        }
      }
    }
    counter.innerHTML = votes;
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
    let commentlist = document.getElementById(callname);
    commentlist.innerHTML = "";
    for (const key in element.data()) {
      if (Object.hasOwnProperty.call(element.data(), key)) {
        let uniqlabelcommentboxid = uniqueid();
        const ele = element.data()[key];
        let commentuniqueid = ele.user.replace("@gmail.com", "");
        let metadata = {
          id: key,
          store: element.id,
          user: ele.user,
        };
        let attr = spacestoЊ(JSON.stringify(metadata));
        commentlist.innerHTML =
          commentlist.innerHTML +
          `<div class =" text-white flex flex-col border-b-2 border-white p-2">
          <div class = "flex justify-between">
          <div>
          <span class = " text-sm">${commentuniqueid}</span>
          <span class=" pl-5 text-xs">${new Date(
            ele.time.seconds * 1000
          ).toLocaleString()}</span>
          </div>
          <div>
          <svg xmlns="http://www.w3.org/2000/svg" metadata = ${attr}  viewBox="0 0 24 24" fill="currentColor" class="w-6 hidden  deletecomment h-6 hover:fill-red-500">
                        <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
          </svg>
          <label for = ${uniqlabelcommentboxid}>
          <svg xmlns="http://www.w3.org/2000/svg" metadata = ${attr} viewBox="0 0 24 24" fill="currentColor" class="w-6  hidden editcomment h-6 hover:fill-red-500">
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
          </svg>
          <label>
          </div>
          </div>
          <div class = "  text-white pl-2"><textarea id= ${uniqlabelcommentboxid} class = "text-lg block resize-none overflow-visible text-white bg-transparent border-0 h-fit w-fit" disabled >${
            ele.comment
          }</textarea></div>
          </div>`;
      }
    }
  }

  function deletecomment() {
    let btns = document.getElementsByClassName("deletecomment");
    for (const key in btns) {
      if (Object.hasOwnProperty.call(btns, key)) {
        const btn = btns[key];
        let comment = JSON.parse(Њtospaces(btn.getAttribute("metadata")));
        if (comment.user == user.email) {
          btn.style.display = "inline-block";
        }
        btn.addEventListener("click", () => {
          let commentdoc = doc(customerdb, "comments", comment.store);
          updateDoc(commentdoc, {
            [comment.id]: deleteField(),
          });
        });
      }
    }
  }
  function editcomment() {
    let btns = document.getElementsByClassName("editcomment");
    for (const key in btns) {
      if (Object.hasOwnProperty.call(btns, key)) {
        const btn = btns[key];
        let comment = JSON.parse(Њtospaces(btn.getAttribute("metadata")));
        if (comment.user == user.email) {
          btn.style.display = "inline-block";
        }
        btn.addEventListener("click", () => {
          let commentbox =
            btn.parentElement.parentElement.parentElement.nextElementSibling
              .children[0];
          commentbox.toggleAttribute("disabled");
          let commentdoc = doc(customerdb, "comments", comment.store);
          document.addEventListener("keypress", function enter(e) {
            if (e.key == "Enter") {
              let commentuniqid = comment.id + ".comment";
              updateDoc(commentdoc, {
                [commentuniqid]: commentbox.value,
              });
              document.removeEventListener("keypress", enter);
              commentbox.toggleAttribute("disabled");
            }
          });
        });
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
              [uniqueid()]: {
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
    let customeridblock = document.getElementById("customerid");
    customeridblock.innerText = user.email.split("@")[0];
    let main;
    onSnapshot(
      q,
      (main = (snapshot) => {
        fillingcontrollarray(snapshot);
        cleardata();
        print(snapshot);
        addingbuttons(snapshot);
        console.log(controllarray);

        if (filter) {
          renderingopenstores();
        }

        searchbtn.addEventListener("click", () => {
          let invisiblecards2 = controllarray.filter((store) => {
            if (store.name != search.value) {
              return store.name;
            }
          });

          invisiblecards = union(invisiblecards, invisiblecards2);
          renderingopenstores();
        });

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
          deletecomment();
          editcomment();
        });

        onSnapshot(qvotes, (snapshot) => {
          snapshot.docs.forEach((element) => {
            updatingcounter(element);
          });
        });

        getDocs(votes).then((snapshot) => {
          snapshot.docs.forEach((element) => {
            voting(element, user);
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
      })
    );

    filter1btns[0].addEventListener("click", () => {
      filter = true;
      getDocs(q).then(main);
    });

    filter1btns[1].addEventListener("click", () => {
      filter = false;
      getDocs(q).then(main);
    });

    const logout = document.getElementById("logout");
    logout.addEventListener("click", function signout() {
      signOut(customerauth);
    });

    // ------------------------------------------------------------
  } else {
    window.location = "index.html";
  }
});
