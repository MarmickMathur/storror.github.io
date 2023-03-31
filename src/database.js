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
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getStorage,
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  connectStorageEmulator,
} from "firebase/storage";
import { Input } from "postcss";

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
    const votes = collection(customerdb, "votes");
    let qvotes = query(votes);
    // ------------------------------------------
    let visiblity = {};
    // ---------------------------------------------
    document.getElementById("userid").innerHTML += user.email.split("@")[0];

    function uniqueid() {
      const dateString = Date.now().toString(36);
      const randomness = Math.random().toString(36).substr(2);
      return dateString + randomness;
    }

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
          <div class="m-3 relative flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(55 65 81)" class="w-20 h-20">
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
      <div id="modalform" class=" bg-slate-900 modalcard ${visiblity["modalform"]}">
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
                    <div class = "w-[70%] flex border-l-2 border-white border-b-2 border-b-black ">
                          <div class = "w-[50%]">
                          <input type="radio" name="status" id="open" class = "peer hidden" value=true>
                          <label for="open" class = "text-white text-xl text-center py-2 hover:bg-white hover:text-black cursor-pointer  block peer-checked:bg-white peer-checked:text-black" >open</label>
                          </div>
                          <div class = "w-[50%]">
                          <input type="radio" name="status"  id="closed" class = "peer hidden" value=false>
                          <label for="closed" class = " text-white text-xl text-center py-2 hover:bg-white hover:text-black cursor-pointer  block peer-checked:bg-white peer-checked:text-black ">closed</label>
                          </div>
                    </div>
            </div>
                <button type="submit" class="w-full text-xl h-10 uppercase font-headingside1  p-0 m-0 bg-white active:bg-transparent active:text-white ">submit</button>
            </form>  
        </div>
    </div>`;
    }

    function spacestoЊ(a) {
      return a.replaceAll(" ", "Њ");
    }

    function Њtospaces(a) {
      return a.replaceAll("Њ", " ");
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
      document.getElementsByClassName("loader")[0].style.display = "flex";
      let imgtoupload = files[0];
      let imgname = files[0].name;
      const storageref = sRef(storage, "Images/" + imgname);
      const uploader = await uploadBytesResumable(storageref, imgtoupload);
      let downloadurl = await getDownloadURL(storageref);
      document.getElementsByClassName("loader")[0].style.display = "none";
      return downloadurl;
      // "state_changed",
      files = [];
    }

    async function updatingdata(element, visiblity) {
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
            ${ele.storename}</p>
            <div id="status"
            class=" uppercase case font-semibold text-gray-500 flex justify-between items-center">
            ${providestatus(ele.status)} 
            <button id="${key}"
            class = "transition-all bg-red-600 font-mono font-medium rounded-md p-2 text-white hover:shadow-md hover:scale-105 active:bg-white active:text-red-600">delete</button>
            </div>
            </div>
            </div>` + document.getElementById("maincontent").innerHTML;

          //  UPDATING MODAL
          let somerandomid = uniqueid();
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

          let metadata = {
            storename: ele.name,
          };
          let attr = spacestoЊ(JSON.stringify(metadata));

          submod.innerHTML =
            `<div id="${modalid}" class="modalcard ${visiblity[modalid]}">
      <img src="${ele.image} alt="canteenimage" class="h-3/4 w-full object-cover ">
          <div class="p-3 relative bg-gray-900 rounded-b-md shadow-lg z-50 shadow-black">
          <div class = "w-full flex justify-between">
         
          <div class = "flex flex-col w-[80%]">
              <div id="" class=" text-left text-4xl flex justify-between text-gray-200 font-headingside1 uppercase font-bold">
                   
                 <div contenteditable = "false" class = " w-[90%] inline-block"><input id = ${somerandomid} class = " w-full  bg-transparent border-0 focus:border-0" disabled value = "${ele.storename}"></div>
                 
                <label metadata = ${attr} class = "editstorename" for = ${somerandomid}> 
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="rgb(156 163 175)" class="w-4 flex justify-center items-center  ml-5 hover:fill-white h-4">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  
                </svg>   
                </label>           
              </div>
              

              <div class="text-xl mt-1 flex justify-between uppercase pl-2 font-normal text-gray-400">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 mt-5 inline-block h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>

                <div class = " w-[95%] inline-block text-center break-words m-5 ml-0">
                  <label>
                    <input value ="${ele.adress}" placeholder ='dont put "'  class = " w-[95%] addresschanger bg-transparent  uppercase font-headingside2 text-lg border-0 text-gray-400" disabled >
                    <buttons class = "editaddress inline-block" metadata = ${attr}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 inline-block hover:fill-white cursor-pointer h-4">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                      </svg>
                    </buttons>
                  </label>
                </div>

              </div>
          </div>
          <div>
          <div metadata = ${attr} class = "votes text-center text-xl shadow-lg shadow-black font-normal bg-gray-700 rounded-full px-5 mx-5 py-2 text-gray-200">
          <span class="material-symbols-outlined hidden  my-auto">
          sentiment_satisfied
          </span>
          <span class="material-symbols-outlined hidden my-auto">
          sentiment_dissatisfied
          </span>
          <span class="material-symbols-outlined hidden my-auto">
          sentiment_neutral
          </span>
          <span>
          </span>
          </div>
          </div>

          </div>
              <div id="" class=" uppercase flex font-semibold text-gray-300 my-5">
              ${statusbtns}
              </div>
          <div class = "border-2 border-white  m-2 rounded-md">  
          <menu id = "${ele.name}menu">

          </menu> 
          <div class=""> 
          <form action="" id="${ele.name}getmenu"
                class="getmenu rounded-b-md border-t-2 border-white overflow-hidden cursor-default h-full autocomplete="off"">
                <div class="flex flex-row items-center w-full">
                  <input id = "itemname" type="text" name="itemname" class="w-1/2 h-12 bg-transparent border-0 text-white" placeholder="ADD ITEMS HERE"  required autocomplete="off">
                    <div class=" w-1/2 flex">
                      <div class = "w-1/2 h-12  border-l-2 border-white">
                        <input type="radio" name="availablity" id="${ele.name}available" class= "peer hidden" value="true">
                        <label for="${ele.name}available" class = "  border-white w-full flex justify-center items-center hover:bg-white hover:text-black  text-white text-center bg-transparent h-full peer-checked:text-gray-800 align-middle peer-checked:bg-white">available</label>
                      </div>
                      <div class = "w-1/2 h-12 border-white ">
                        <input type="radio" name="availablity" id="${ele.name}unavailable" class= "peer hidden" value="false">
                        <label for="${ele.name}unavailable" class = " bg-transparent flex justify-center items-center text-white w-full hover:bg-white hover:text-black  h-full  text-center peer-checked:text-gray-800 align-middle peer-checked:bg-white "> unavailable</label>
                      </div>
                    </div>
                </div>
                <button type="submit" class=" p-2 w-full border-t-2 border-white uppercase text-xl text-white font-headingside2 font-semibold  bg-transparent text-center hover:bg-white hover:text-gray-800">add</button>
          </form>
          </div> 
          </div>  
      </div>
      <div  class = " pt-8 bg-white relative z-10 transition-all -translate-y-5 rounded-b-md hover:-translate-y-1 " >
      <div class = "border-2 border-b-0  overflow-hidden transition-all border-gray-800 bg-white text-lg mx-5 hidden rounded-md flex-col "></div>
      <div metadata = ${attr} class = "flex  commentloader justify-center m-2 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 transition-all inline-block h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
      </svg>
      <p class = " text-center font-headingside2 hover:border-2 hover:border-black mb-2 font-semibold text-xl text-black inline-block  uppercase "> comments </p>
      </div>
      </div>
      </div>
      ` + submod.innerHTML;
        }
      }

      // calling the elements here so that the dom can get updated

      const addstore = document.getElementById("addstore");
      addstore.addEventListener("submit", (e) => {
        e.preventDefault();
        addingstore();
      });
    }

    function commentloaderbtn() {
      let btns = document.getElementsByClassName("commentloader");
      for (const key in btns) {
        if (Object.hasOwnProperty.call(btns, key)) {
          const element = btns[key];
          console.log(element);
          let storename = JSON.parse(
            Њtospaces(element.getAttribute("metadata"))
          ).storename;
          element.addEventListener("click", function showcomment() {
            let fetchcomment = doc(customerdb, "comments", storename);
            let commentlist = element.previousElementSibling;
            console.log(commentlist);
            let removesnapshot = onSnapshot(fetchcomment, (doc) => {
              let comment = "";
              for (const key in doc.data()) {
                if (Object.hasOwnProperty.call(doc.data(), key)) {
                  const comments = doc.data()[key];
                  comment += `
                  <div class = "flex flex-col">
                    <div class = " p-2  pb-0 flex justify-between">
                      <div><div class = " text-base font-semibold inline-block"> ${
                        comments.user
                      }</div> 
                      <div class=" inline-block text-sm">${new Date(
                        comments.time.seconds * 1000
                      ).toLocaleString()}</div> </div>
                    </div>
                    <div class = "  border-b-2 border-black pl-5 p-2 bg-gray-200">${
                      comments.comment
                    } </div>
                  </div>`;
                }
              }
              // console.log(comment);
              commentlist.style.display = "flex";
              commentlist.style.height = "fit-content";
              element.children[0].style.transform = "rotate(180deg)";
              if (comment == "") {
                commentlist.innerHTML = `<div class = " border-b-2 border-black text-center">no comments<div>`;
              } else {
                commentlist.innerHTML = comment;
              }
            });
            element.removeEventListener("click", showcomment);
            element.addEventListener("click", async function hidecomment() {
              commentlist.style.height = "0px";
              commentlist.style.display = "none";
              element.children[0].style.transform = "rotate(0deg)";
              removesnapshot();

              element.removeEventListener("click", hidecomment);
              element.addEventListener("click", showcomment);
            });
          });
        }
      }
    }

    function editstorename() {
      let editbtn = document.getElementsByClassName("editstorename");
      for (const key in editbtn) {
        if (Object.hasOwnProperty.call(editbtn, key)) {
          const element = editbtn[key];
          let metadata = JSON.parse(
            Њtospaces(element.getAttribute("metadata"))
          );
          let doctochangethestorenameon = doc(vendordb, "users", user.email);
          element.addEventListener("click", (e) => {
            console.log("working");
            let storenamediv = element.previousElementSibling.children[0];
            storenamediv.toggleAttribute("disabled");
            let keytoupdatevalue = metadata.storename + ".storename";
            document.addEventListener("keypress", function enter(e) {
              if (e.key == "Enter") {
                console.log(storenamediv.value);
                updateDoc(doctochangethestorenameon, {
                  [keytoupdatevalue]: storenamediv.value,
                });
                document.removeEventListener("keypress", enter);
                storenamediv.toggleAttribute("disabled");
              }
            });
          });
        }
      }
    }

    function editaddress() {
      let editbtn = document.getElementsByClassName("editaddress");
      for (const key in editbtn) {
        if (Object.hasOwnProperty.call(editbtn, key)) {
          const element = editbtn[key];
          let metadata = JSON.parse(
            Њtospaces(element.getAttribute("metadata"))
          );
          let doctochangetheaddresson = doc(vendordb, "users", user.email);
          element.addEventListener("click", () => {
            let address = element.previousElementSibling;
            address.toggleAttribute("disabled");
            let keytoupdatevalue = metadata.storename + ".adress";
            document.addEventListener("keypress", function enter(e) {
              if (e.key == "Enter") {
                console.log(address.value);
                updateDoc(doctochangetheaddresson, {
                  [keytoupdatevalue]: address.value,
                });
                document.removeEventListener("keypress", enter);
                address.toggleAttribute("disabled");
              }
            });
          });
        }
      }
    }

    function populatingmenus(element) {
      let menu = "";
      let storename = element.id;

      for (const key in element.data()) {
        if (Object.hasOwnProperty.call(element.data(), key)) {
          let availablity;
          const ele = element.data()[key];
          let metadata = {
            name: storename,
            item: key,
          };

          let attr = spacestoЊ(JSON.stringify(metadata));

          if (ele.availablity) {
            availablity = "available";
          } else {
            availablity = "unavailable";
          }
          let uniqedit = uniqueid();

          menu += `<tr >
                        <td class = "w-[45%] text-lg overflow-hidden"><input  disabled value = "${ele.name}" class =" bg-transparent"></td>
                        <td class = "w-[45%] text-lg overflow-hidden"><span class = "statechanger text-center text-slate-100 hover:text-red-500 cursor-pointer" metadata = ${attr}>${availablity}</td>
                        <td class = "w-[5%]">    
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" metadata=${attr} class="w-6 menudelete cursor-pointer hover:fill-red-600 h-6">
                          <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
                        </svg>
                        </td>
                        <td class = "w-[5%]">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" metadata=${attr} class="w-6 menuedit cursor-pointer hover:fill-white h-6">
                          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                        </svg>
                        
                        </td>

                    </tr>`;
        }
      }
      let menutab;

      if (menu == "") {
        menutab = ` <div class=""> 
        <p class=" uppercase text-2xl text-center drop-shadow-xl drop relative z-20 font-semibold text-gray-800 bg-white border-b-2 border-white p-3"> menu </p>
  </div>`;
      } else {
        menutab = ` <div class=" relative z-10"> 
      <p class="uppercase text-2xl text-center bg-white font-semibold text-black border-b-2 border-white p-5"> menu </p>
      <div class =" p-5 overflow-auto scrollbar-hide">
      <table class="uppercase  font-normal text-gray-400 w-full text-left">
              <tr class = " bg-slate-800">
                <th class = "w-[45%] text-xl overflow-hidden">item</th>
                <th class = "w-[45%] text-xl overflow-hidden">availablity</th>
                <th class = "w-[5%]"></th>
                <th class = " w-[5%]"></th>
              </tr>
              ${menu}
      </table>
      </div>
      </div>
      `;
      }
      return menutab;
    }

    function menulisteners(show) {
      let btns = document.getElementsByClassName("menudelete");
      for (const key in btns) {
        if (Object.hasOwnProperty.call(btns, key)) {
          const ele = btns[key];
          ele.addEventListener("click", (e) => {
            document.getElementsByClassName("loader")[0].style.display = "flex";
            let jsonobejct = JSON.parse(
              Њtospaces(ele.getAttribute("metadata"))
            );
            let menutobeupdated = doc(vendordb, "menus", jsonobejct.name);
            updateDoc(menutobeupdated, {
              [jsonobejct.item]: deleteField(),
            }).then(() => {
              getDocs(users).then(show);
            });
          });
        }
      }
    }

    function menulnameedit(show) {
      let btns = document.getElementsByClassName("menuedit");
      for (const key in btns) {
        if (Object.hasOwnProperty.call(btns, key)) {
          const ele = btns[key];
          ele.addEventListener("click", (e) => {
            let input = ele.parentElement.parentElement.children[0].children[0];
            input.toggleAttribute("disabled");

            let jsonobejct = JSON.parse(
              Њtospaces(ele.getAttribute("metadata"))
            );

            let menutobeupdated = doc(vendordb, "menus", jsonobejct.name);

            document.addEventListener("keypress", function enter(e) {
              if (e.key == "Enter") {
                document.getElementsByClassName("loader")[0].style.display =
                  "flex";
                console.log(input.value);
                // updateDoc(menutobeupdated, {
                //   [jsonobejct.item]:
                // }).then(() => {
                //   getDocs(users).then(show);
                // });
                let id = jsonobejct.item + ".name";
                console.log(id);
                getDoc(menutobeupdated).then(async (snapshot) => {
                  let menu = snapshot.data()[jsonobejct.item];
                  await updateDoc(menutobeupdated, {
                    [id]: "something new",
                  }).then(() => {
                    console.log("this is working");
                    getDocs(users).then(show);
                  });
                  document.getElementsByClassName("loader")[0].style.display =
                    "none";
                  input.toggleAttribute("disabled");
                });
              }
            });
          });
        }
      }
    }

    function menuchanger(show) {
      let btns = document.getElementsByClassName("statechanger");
      for (const key in btns) {
        if (Object.hasOwnProperty.call(btns, key)) {
          const ele = btns[key];
          ele.addEventListener("click", (e) => {
            document.getElementsByClassName("loader")[0].style.display = "flex";
            let jsonobejct = JSON.parse(
              Њtospaces(ele.getAttribute("metadata"))
            );
            let menutobeupdated = doc(vendordb, "menus", jsonobejct.name);
            getDoc(menutobeupdated).then(async (snapshot) => {
              let menu = snapshot.data()[jsonobejct.item];
              await updateDoc(menutobeupdated, {
                [jsonobejct.item]: {
                  availablity: !menu.availablity,
                  createdat: menu.createdat,
                  name: menu.name,
                },
              }).then(() => {
                console.log("this is working");
                getDocs(users).then(show);
              });
              document.getElementsByClassName("loader")[0].style.display =
                "none";
            });
          });
        }
      }
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
                storename: ele.storename,
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
        [uniqueid()]: {
          availablity: check(menu.availablity.value),
          createdat: serverTimestamp(),
          name: menu.itemname.value,
        },
      });
    }

    function showvotes() {
      let votes = document.getElementsByClassName("votes");
      for (const key in votes) {
        if (Object.hasOwnProperty.call(votes, key)) {
          const element = votes[key];
          let storename = JSON.parse(
            Њtospaces(element.getAttribute("metadata"))
          ).storename;
          let vote = doc(customerdb, "votes", storename);
          onSnapshot(vote, (doc) => {
            let counter = 0;
            let votesection = doc.data();
            for (const key in votesection) {
              if (Object.hasOwnProperty.call(votesection, key)) {
                const element = votesection[key];
                if (element) {
                  counter++;
                } else {
                  counter--;
                }
              }
            }
            if (counter > 0) {
              element.children[0].style.display = "inline-block";
              element.children[1].style.display = "none";
              element.children[2].style.display = "none";
            } else if (counter == 0) {
              element.children[0].style.display = "none";
              element.children[1].style.display = "none";
              element.children[2].style.display = "inline-block";
            } else {
              element.children[0].style.display = "none";
              element.children[1].style.display = "inline-block";
              element.children[2].style.display = "none";
            }
            element.children[3].innerHTML = counter;
          });
        }
      }
    }

    async function addingstore() {
      let imgname;
      if (files[0]) {
        imgname = files[0].name;
      } else {
        imgname = "image_2023-03-31_114019857.png";
      }
      let url;

      if (files[0]) {
        url = await uploader();
      } else {
        url =
          "https://firebasestorage.googleapis.com/v0/b/vendor-a8255.appspot.com/o/Images%2Fimage_2023-03-31_114019857.png?alt=media&token=08b64a9e-85be-42a4-a012-4149ce3f9e82";
      }
      let uniqid = uniqueid();
      updateDoc(doctobeupdated, {
        [uniqid]: {
          name: uniqid,
          adress: addstore.adress.value,
          status: check(addstore.status.value),
          createdat: serverTimestamp(),
          image: url,
          imagename: imgname,
          storename: addstore.storename.value,
        },
      });

      // setting things up for the comment section making a document of store name in the comment collection
      setDoc(doc(customerdb, "comments", uniqid), {});

      // setting things up for the votes section making a document of store name in the votes collection
      setDoc(doc(customerdb, "votes", uniqid), {});
      // setting things up for the menus to be set
      setDoc(doc(vendordb, "menus", uniqid), {});
    }

    // -----------------------------------------------------------------------------
    // this object is to take data out of snapshots to another snapshot
    let bus = {};
    onSnapshot(qmenus, function showmenu(menusnapshot) {
      // for menus
      bus.menus = menusnapshot; //to take snapshot out
    });

    onSnapshot(qvotes, (snapshot) => {
      bus.votes = snapshot;
    });

    document.getElementsByClassName("loader")[0].style.display = "flex";

    onSnapshot(qusers, async function show(snapshot) {
      cleardata();
      snapshot.docs.forEach(async (element) => {
        if (element.id == user.email) {
          await updatingdata(element, visiblity);
          update(element, user);
          del(element, user);
        }
      });
      showvotes(votes);
      document.getElementsByClassName("loader")[0].style.display = "none";

      let menulist = bus.menus;
      menulist.docs.forEach((element) => {
        let menudivid = element.id + "menu";
        let menulist = populatingmenus(element);
        let menudiv = document.getElementById(menudivid);
        if (menudiv != null) {
          menudiv.innerHTML = menulist;
        }
      });
      menulnameedit(show);
      menulisteners(show);
      menuchanger(show);
      commentloaderbtn();
      editstorename();
      editaddress();

      let mapforcardsandmodals = MapingModcardadnCards(cards, modalcards);

      //  adding menus to the database
      for (const key in getmenu) {
        if (Object.hasOwnProperty.call(getmenu, key)) {
          const element = getmenu[key];
          let menu = document.getElementById(element.id);
          menu.addEventListener("submit", (e) => {
            e.preventDefault();
            addingmenu(element, menu);
            getDocs(users).then(show);
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
    // functionality to logout button
    const logout = document.getElementById("logout");
    logout.addEventListener("click", function signout() {
      signOut(auth);
    });

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
    window.location = "login.html";
  }
});
// ----------------------------------------------------------------
