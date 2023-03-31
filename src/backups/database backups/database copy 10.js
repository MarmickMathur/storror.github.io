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
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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
const storage = getStorage(vendor);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.email);
    const reader = new FileReader();
    let files = [];
    let submod = document.getElementById("submodal");
    let modalcards = document.getElementsByClassName("modalcard");
    let Mod = document.getElementById("modal");
    let cards = document.getElementsByClassName("card");
    let getmenu = document.getElementsByClassName("getmenu");
    const doctobeupdated = doc(vendordb, "users", user.email);
    // -------------------------------------------
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
          <div class="m-3 relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(55 65 81)" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p id="" class="text-left text-2xl text-gray-700 font-headingside1 uppercase font-bold">
              add store</p>
          </div>
        </div>
        <p id = "error"></p>`;

      if (typeof visiblity["modalform"] == "undefined") {
        visiblity["modalform"] = "hidden";
      }

      submod.innerHTML = `
      <div id="modalform" class="modalcard ${visiblity["modalform"]}">
      <form id="addstore" class="bg-transparent shadow-lg">
        <div id = "imageuploader" class="items-center justify-center flex relative border-white m-9 border-2 overflow-hidden rounded-md aspect-square hover:bg-slate-600 cursor-pointer id = "imageform" name = "imageform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".2" stroke="rgb(255,255,255)" class="w-1/2 h-1/2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <img id = "preview" class = "absolute w-full h-full"></img>    
        <input type="file" id="fileElem" accept="image/*" class ="absolute w-full h-full bg-transparent"></input>
        </div>
        <div class=" justify-between  border-white m-9 border-2 overflow-hidden rounded-md">
            
            <div class = "border-white flex border-b-2 w-full">
                <label for = "storename" class="w-[30%] text-white text-xl text-center self-center">store name</label>
                <input type="text" id="storename" name="storename" class = " border-l-2 border-white text-white w-[70%] bg-transparent" required autocomplete="off">
            </div>
            <div class = "border-white flex border-b-2 w-full">
                <label for="adress" class = " text-white text-xl text-center self-center w-[30%]" >address</label>
                <input type="text" id="adress" name="adress" class = "border-l-2 border-white text-white w-[70%] bg-transparent"  required autocomplete="off">
            </div>
            <div class = "flex border-b-2 border-white">
                    <label for="status" class ="w-[30%] text-white text-xl text-center self-center"> status: </label> 
                    <div class = "w-[70%] flex border-l-2 border-white">
                          <label for="open" class = "text-white text-xl text-center w-[50%] self-center" >open</label>
                          <input type="radio" name="status" id="open" class = "" value=true>
                          <label for="closed" class = " text-white text-xl text-center w-[50%] self-center">closed</label>
                          <input type="radio" name="status"  id="closed" class = "" value=false>
                    </div>
            </div>
                <button type="submit" class="w-full text-xl h-10 uppercase font-headingside1  p-0 m-0 bg-white active:bg-transparent active:text-white ">submit</button>
            </form>  
        </div>
    </div>`;
    }
    function imageloader() {
      let file = document.getElementById("fileElem");
      let preview = document.getElementById("preview");

      file.onchange = () => {
        files = file.files;
        reader.readAsDataURL(files[0]); //use url of file
      };

      reader.onload = function name() {
        //when file loads then do this
        preview.src = reader.result;
      };
    }
    async function uploader() {
      let imgtoupload = files[0];
      let imgname = files[0].name;
      const storageref = sRef(storage, "Images/" + imgname);
      const uploader = await uploadBytesResumable(storageref, imgtoupload);
      let downloadurl = await getDownloadURL(storageref);
      return downloadurl;
      // "state_changed",
    }

    function updatingdata(element, visiblity) {
      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          const ele = element.data()[key];
          let cardid = ele.name + "card";

          document.getElementById("maincontent").innerHTML =
            `<div id="${cardid}" class="card">
          <img src="${
            ele.image
          }" alt="canteenimage" class="h-3/4 w-full overflow-hidden object-cover">
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
      <img src="${ele.image} alt="canteenimage" class="h-3/4 w-full object-cover ">
      <div class="m-3">
          <p id="" class=" text-left text-4xl text-gray-200 font-headingside1 uppercase font-bold">
              ${ele.name} </p>
          <p class="text-xl mt-1 uppercase pl-2 font-normal text-gray-400">
              ${ele.adress}
          </p>
              <div id="" class=" uppercase flex font-semibold text-gray-300 my-5">
              ${statusbtns}
              </div>
          <div class = "border-2 border-white  m-2 rounded-md">  
          <menu id = "${ele.name}menu">
          </menu> 
          <div class=""> 
          <form action="" id="${ele.name}getmenu"
                class="getmenu rounded-b-md border-t-2 border-white overflow-hidden cursor-default p-5 h-full autocomplete="off"">
                <div class="flex flex-row items-center w-full">
                <input id = "itemname" type="text" name="itemname" class="w-1/2 mr-5 bg-transparent rounded-md border-2 border-white h-12 text-white font-headingside2" required autocomplete="off">
                  <div class=" w-1/2 flex justify-between items-center">
                    <label for="available" class = " rounded-md border-2 border-white h-full w-1/2 m-2 text-white text-center bg-transparent  peer-checked:text-gray-800 peer-checked:bg-white">available</label>
                      <input type="radio" name="availablity" id="available" class= "peer" value="true">
                    <label for="unavailable" class = "bg-transparent  text-white w-1/2 rounded-md border-2 border-white h-full m-2 text-center "> unavailable</label>
                      <input type="radio" name="availablity" id="unavailable" class= "peer" value="false">
                  </div>
                </div>
                <button type="submit" class="mt-5 w-full h-8 rounded-md border-2 border-white uppercase text-white font-headingside2 font-semibold  bg-transparent text-center hover:bg-white hover:text-gray-800">add</button>
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

    function del(element, user) {
      const doctobeupdated = doc(vendordb, "users", user.email);
      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          document
            .getElementById(key)
            .addEventListener("click", function del(e) {
              e.stopPropagation();
              let store = element.data()[key];
              console.log(store.imgname);
              const desertRef = sRef(storage, "images/" + store.imagename);

              deleteObject(desertRef).then(console.log("file deleted"));

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
                image: ele.image,
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

    async function addingstore() {
      let imgname = files[0].name;
      let url = await uploader();
      console.log(url);
      updateDoc(doctobeupdated, {
        [addstore.storename.value]: {
          name: addstore.storename.value,
          adress: addstore.adress.value,
          status: check(addstore.status.value),
          createdat: serverTimestamp(),
          image: url,
          imagename: imgname,
        },
      });

      // setting things up for the comment section making a document of store name in the comment collection
      setDoc(doc(customerdb, "comments", addstore.storename.value), {});

      // setting things up for the votes section making a document of store name in the votes collection
      setDoc(doc(customerdb, "votes", addstore.storename.value), {});
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
          update(element, user);
          del(element, user);
        }
      });

      let menulist = bus.menus;
      menulist.docs.forEach((element) => {
        let menudivid = element.id + "menu";
        let menulist = populatingmenus(element);
        let menudiv = document.getElementById(menudivid);
        if (menudiv != null) {
          menudiv.innerHTML = menulist;
        }
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
      imageloader();

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
