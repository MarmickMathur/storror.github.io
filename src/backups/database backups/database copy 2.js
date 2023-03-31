import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  getDoc,
  query,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteField,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// -------------------------------------------------------

const firebaseconfig2 = {
  apiKey: "AIzaSyD7vJO8kRKqyXY9WKAxpR26WG63a0f-Vws",
  authDomain: "vendor-a8255.firebaseapp.com",
  projectId: "vendor-a8255",
  storageBucket: "vendor-a8255.appspot.com",
  messagingSenderId: "218244970044",
  appId: "1:218244970044:web:2326416fbe1495dc017539",
};

const firebaseconfig1 = {
  apiKey: "AIzaSyCL4vpApFoiEd2NI_krVgWp85CcPWmD5Oc",
  authDomain: "customer-b1eaa.firebaseapp.com",
  projectId: "customer-b1eaa",
  storageBucket: "customer-b1eaa.appspot.com",
  messagingSenderId: "105439236709",
  appId: "1:105439236709:web:de6b1033bde5935d7a2c8c",
};

const customer = initializeApp(firebaseconfig1, "customer");
const customerdb = getFirestore(customer);

const vendor = initializeApp(firebaseconfig2, "vendor");
const auth = getAuth(vendor);
const vendordb = getFirestore(vendor);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.email);
    let submod = document.getElementById("submodal");
    let modalcards = document.getElementsByClassName("modalcard");
    let Mod = document.getElementById("modal");
    let cards = document.getElementsByClassName("card");
    const doctobeupdated = doc(vendordb, "users", user.email);
    // --------------------------------------
    const users = collection(vendordb, "users");
    let qusers = query(users);
    // ------------------------------------------
    let visiblity = {};
    // ---------------------------------------------

    function check(value) {
      if (value == "true") {
        return true;
      } else if (value == "false") {
        return false;
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

    function cleardata() {
      document.getElementById(
        "maincontent"
      ).innerHTML = `<div id="formcard" class="card">
          <img src="" alt="canteenimage" class="h-3/4 w-full object-cover">
          <div class="m-3">
          <p id="" class="text-left text-2xl text-gray-700 font-headingside1 uppercase font-bold">
              add store</p>
          </div>
        </div>`;

      submod.innerHTML = `<div id="modalform" class="modalcard hidden">
        <div class="m-3 justify-between flex flex-col">
            <form id="addstore" class="bg-white flex flex-col p-6 rounded-md shadow-lg h-fit">
                <label for="storename"> storename: </label>
                <input type="text" id="storename" name="storename" required autocomplete="off">
                <label for="adress"> adress: </label>
                <input type="text" id="adress" name="adress" required autocomplete="off">
                <div>
                    <label for="status"> status: </label> 
                    <label for="open">open</label>
                    <input type="radio" name="status" id="open" value=true>
                    <label for="closed">closed</label>
                    <input type="radio" name="status" id="closed" value=false>
                </div>
                <button type="submit" class="">submit</button>
            </form>
            <form action="" id="getmenu"
                class="bg-white rounded-md mt-5 flex flex-col overflow-hidden cursor-default p-5 h-full">
                <h3 class="mb-2">add menus to the store that is submited</h3>
                <input type="text" name="getiteam" class="" required>
                <div class="my-5">
                    <label for="availability">availability:</label>
                    <label for="available">available</label>
                    <input type="radio" name="availability" id="available" value="true">
                    <label for="unavailable"> unavailable</label>
                    <input type="radio" name="availability" id="unavailable" value="false">
                </div>
                <button type="submit" class="bg-gray-600">add</button>
            </form>
        </div>
    </div>`;
    }

    function updatingdata(element, visiblity) {
      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          const ele = element.data()[key];
          let cardid = ele.name + "card";

          document.getElementById("maincontent").innerHTML =
            `<div id="${cardid}" class="card">
          <img src="/images/store image.jpg" alt="canteenimage" class="h-3/4 w-full object-cover">
            <div class="m-3">
            <p id="" class="text-left text-2xl text-gray-700 font-headingside1 uppercase font-bold">
            ${ele.name}</p>
            <div id="status"
            class=" uppercase case font-semibold text-gray-500 flex justify-between items-center">
            ${providestatus(ele.status)} <button id="${key}"
            class="transition-all bg-red-600 font-mono font-medium rounded-md p-2 text-white hover:shadow-md hover:scale-105 active:bg-white active:text-red-600">delete</button>
            </div>
            </div>
            </div>` + document.getElementById("maincontent").innerHTML;

          //  UPDATING MODAL
          let btnid = key + "status";
          // providing status buttons
          let statusbtns;
          if (ele.status) {
            statusbtns = `<button class="ml-5 uppercase font-semibold text-gray-900 rounded-md bg-white p-2">open</button>
            <button id= "${btnid}" class="ml-5 uppercase font-semibold text-gray-600 p-2">closed</button>`;
          } else {
            statusbtns = `<button id= "${btnid}" class="ml-5 uppercase font-semibold text-gray-600 p-2">open</button>
            <button  class="ml-5 uppercase font-semibold text-gray-900 rounded-md bg-white p-2">closed</button>`;
          }

          //giving id to each of the modals
          let modalid = ele.name + "modal";
          // resolving for when the visiblity of the element is not definend
          if (typeof visiblity[modalid] == "undefined") {
            visiblity[modalid] = "hidden";
            console.log("firing if else");
          }
          console.log(visiblity);

          submod.innerHTML =
            `<div id="${modalid}" class="modalcard ${visiblity[modalid]}">
      <img src="/images/store image.jpg" alt="canteenimage" class="h-3/4 w-full object-cover ">
      <div class="m-3">
          <p id="" class=" text-left text-2xl text-gray-200 font-headingside1 uppercase font-bold">
              ${ele.name} </p>
          <div id="" class=" uppercase font-semibold text-gray-300 my-5">
              status:
              ${statusbtns}
          </div>
          <p class=" uppercase text-gray-300 font-semibold">
              address
          </p>
          <p class=" uppercase  font-normal text-gray-400">
              ${ele.adress}
          </p>
          <div class="my-5">
              <p class=" uppercase  font-semibold text-gray-300">menu</p>
              <table class="uppercase  font-normal text-gray-400 w-full text-left ml-5">
                  <tr>
                      <th>iteamname</th>
                      <th>price</th>
                  </tr>
              </table>
          </div>
      </div>
    </div>` + submod.innerHTML;
        }
      }

      // calling the elements here so that the dom can get updated

      const addstore = document.getElementById("addstore");
      const getmenu = document.getElementById("getmenu");
      addstore.addEventListener("submit", (e) => {
        e.preventDefault();
        addingstore();
      });
      getmenu.addEventListener("submit", (e) => {
        e.preventDefault();
        addingiteamstothemenu();
      });
    }

    function del(element, user) {
      const doctobeupdated = doc(vendordb, "users", user.email);
      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          document
            .getElementById(key)
            .addEventListener("click", function del(e) {
              e.stopPropagation();
              updateDoc(doctobeupdated, {
                [key]: deleteField(),
              });
              // removing the store from comments collection
              let storetoberemoved = doc(customerdb, "comments", key);
              deleteDoc(storetoberemoved);
              // removing the store from votes collection
              let storewithvotestoberemoved = doc(customerdb, "votes", key);
              deleteDoc(storewithvotestoberemoved);
              // removing the store from menus collection
              let storetoberemovedfrommenus = doc(vendordb, "menus", key);
              deleteDoc(storetoberemovedfrommenus);
            });
        }
      }
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

    function update(element, user) {
      const doctobeupdated = doc(vendordb, "users", user.email);
      for (const key in element.data()) {
        let btnid = key + "status";
        let ele = element.data()[key];

        if (Object.hasOwnProperty.call(element.data(), key)) {
          document.getElementById(btnid).addEventListener("click", () => {
            updateDoc(doctobeupdated, {
              [key]: {
                name: ele.name,
                adress: ele.adress,
                createdat: ele.createdat,
                status: !ele.status,
              },
            });
          });
        }
      }
    }

    function addingstore() {
      updateDoc(doctobeupdated, {
        [addstore.storename.value]: {
          name: addstore.storename.value,
          adress: addstore.adress.value,
          status: check(addstore.status.value),
          createdat: serverTimestamp(),
        },
      });
      // setting things up for the comment section making a document of store name in the comment collection
      setDoc(doc(customerdb, "comments", addstore.storename.value), {});

      // setting things up for the votes section making a document of store name in the votes collection
      setDoc(doc(customerdb, "votes", addstore.storename.value), {
        counter: 0,
      });
      // setting things up for the menus to be set
      setDoc(doc(vendordb, "menus", addstore.storename.value), {});
    }

    // -----------------------------------------------------------------------------

    onSnapshot(qusers, function print(snapshot) {
      cleardata();

      snapshot.docs.forEach((element) => {
        if (element.id == user.email) {
          updatingdata(element, visiblity);
          del(element, user);
          update(element, user);
        }
      });

      let mapforcardsandmodals = MapingModcardadnCards(cards, modalcards);

      // clicklistener on each card
      for (const key in cards) {
        if (Object.hasOwnProperty.call(cards, key)) {
          const element = cards[key];
          let modalid = mapforcardsandmodals[element.id];
          // this is so that the only a certain modcard is visisble
          element.addEventListener("click", () => {
            visiblity[modalid] = "";
            document.getElementById(
              mapforcardsandmodals[element.id]
            ).style.display = "block";
            Mod.style.display = "flex";
          });
        }
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
    });

    // ------------------------------------------------

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
      for (const key in visiblity) {
        if (Object.hasOwnProperty.call(visiblity, key)) {
          visiblity[key] = "hidden";
        }
      }
    });

    // ------------------------------------
  } else {
    console.log("user is signed out");
    document.getElementById("gotohomepage").className = "visible";
    document.getElementById("gotohomepage").addEventListener("click", () => {
      document.location = "index.html";
    });
  }
});
// ----------------------------------------------------------------
