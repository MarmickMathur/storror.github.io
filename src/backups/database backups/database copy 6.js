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
    let getmenu = document.getElementsByClassName("getmenu");
    const doctobeupdated = doc(vendordb, "users", user.email);
    // --------------------------------------
    const users = collection(vendordb, "users");
    let qusers = query(users);
    const menus = collection(vendordb, "menus");
    let qmenus = query(menus);
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
      ).innerHTML = `<div id="formcard" class="card flex items-center justify-center hover:bg-gray-200">
          <div class="m-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(55 65 81)" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <p id="" class="text-left text-2xl text-gray-700 font-headingside1 uppercase font-bold">
              add store</p>
          </div>
        </div>`;

      if (typeof visiblity["modalform"] == "undefined") {
        visiblity["modalform"] = "hidden";
      }

      submod.innerHTML = `<div id="modalform" class="modalcard ${visiblity["modalform"]}">
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
            ${providestatus(ele.status)} 
            <button id="${key}"
            class = "transition-all bg-red-600 font-mono font-medium rounded-md p-2 text-white hover:shadow-md hover:scale-105 active:bg-white active:text-red-600">delete</button>
            </div>
            </div>
            </div>` + document.getElementById("maincontent").innerHTML;

          //  UPDATING MODAL
          let btnid = key + "status";
          // providing status buttons
          let statusbtns;
          if (ele.status) {
            statusbtns = `<button class=" mx-2 uppercase font-semibold text-gray-900 rounded-md bg-white p-2 w-1/2">open</button>
            <button id= "${btnid}" class=" mx-2 uppercase font-semibold text-gray-600 rounded-md border-2 border-white p-2 w-1/2">closed</button>`;
          } else {
            statusbtns = `<button id= "${btnid}" class=" mx-2 uppercase font-semibold rounded-md border-2 border-white text-gray-600 p-2 w-1/2">open</button>
            <button  class=" mx-2 uppercase font-semibold text-gray-900 rounded-md bg-white p-2 w-1/2">closed</button>`;
          }

          //giving id to each of the modals
          let modalid = ele.name + "modal";
          // resolving for when the visiblity of the element is not definend
          if (typeof visiblity[modalid] == "undefined") {
            visiblity[modalid] = "hidden";
          }
          submod.innerHTML =
            `<div id="${modalid}" class="modalcard ${visiblity[modalid]}">
      <img src="/images/store image.jpg" alt="canteenimage" class="h-3/4 w-full object-cover ">
      <div class="m-3">
          <p id="" class=" text-left text-4xl text-gray-200 font-headingside1 uppercase font-bold">
              ${ele.name} </p>
          <p class="text-xl mt-1 uppercase pl-2 font-normal text-gray-400">
              ${ele.adress}
          </p>
              <div id="" class=" uppercase flex font-semibold text-gray-300 my-5">
              ${statusbtns}
              </div>
          <div class = "border-2 border-white mt-5 mr-2 ml-2 mb-2 rounded-md">  
          <menu id = "${ele.name}menu" class = "m-2">
          </menu> 
          <div class="my-5"> 
          <form action="" id="getmenuform"
                class=" rounded-md mt-5 overflow-hidden cursor-default p-5 h-full">
                <div class="flex flex-row w-full">
                <input id = "itemname" type="text" name="itemname" class="w-1/2 mr-5 bg-transparent rounded-md border-2 border-white" required>
                <div class="my-5">
                    <label for="availablity">availablity:</label>
                    <label for="available">available</label>
                    <input type="radio" name="availablity" id="available" value="true">
                    <label for="unavailable"> unavailable</label>
                    <input type="radio" name="availablity" id="unavailable" value="false">
                </div>
                </div>
                <button type="submit" class="bg-gray-600">add</button>
          </form>
          </div>
          </div>  
      </div>
    </div>` + submod.innerHTML;
        }
      }

      // calling the elements here so that the dom can get updated

      const addstore = document.getElementById("addstore");
      addstore.addEventListener("submit", (e) => {
        e.preventDefault();
        addingstore();
      });
    }

    function populatingmenus(element) {
      let menu;

      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          const ele = element.data()[key];
          console.log(key, ele.availablity);
          menu += `
                  <tr >
                        <td class = "w-1/2 overflow-hidden">${key}</td>
                        <td class = "w-1/2 overflow-hidden">${ele.availablity}</td>
                  </tr>
              `;
        }
      }
      let menutab = `<div class="my-5"> 
      <p class=" uppercase  font-semibold text-gray-300"> menu </p>
      <table class="uppercase  font-normal text-gray-400 w-full text-left ml-5">
              <tr>
                <th class = "w-1/2 overflow-hidden">item</th>
                <th class = "w-1/2 overflow-hidden">availablity</th>
              </tr>
              ${menu}
      </table>
      </div>`;
      return menutab;
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
              // deleteingfrom visiblity Object
              delete visiblity[key + "modal"];
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

    function addingmenu(element, menu) {
      let docid = element.id.replace("getmenu", "");
      const docwaitingformenu = doc(vendordb, "menus", docid);
      updateDoc(docwaitingformenu, {
        [menu.itemname.value]: {
          availablity: check(menu.availablity.value),
          createdat: serverTimestamp(),
        },
      });
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
    // this object is to take data out of snapshots to another snapshot
    let bus = {};
    onSnapshot(qmenus, function printmenu(menusnapshot) {
      // for menus
      bus.menus = menusnapshot; //to take snapshot out
    });

    onSnapshot(qusers, function print(snapshot) {
      cleardata();

      snapshot.docs.forEach((element) => {
        if (element.id == user.email) {
          updatingdata(element, visiblity);
          del(element, user);
          update(element, user);
        }
      });
      let menulist = bus.menus;
      menulist.docs.forEach((element) => {
        let menudivid = element.id + "menu";
        let menulist = populatingmenus(element);
        console.log(menulist);
        let menudiv = document.getElementById(menudivid);
        menudiv.innerHTML = menulist;
      });

      let mapforcardsandmodals = MapingModcardadnCards(cards, modalcards);

      //  adding menus to the database
      for (const key in getmenu) {
        if (Object.hasOwnProperty.call(getmenu, key)) {
          const element = getmenu[key];
          let menu = document.getElementById(element.id);
          menu.addEventListener("submit", (e) => {
            e.preventDefault();
            addingmenu(element, menu);
            getDocs(users).then(print);
          });
        }
      }

      // clicklistener on each card
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

      // this is so that all the modals become hidden
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
