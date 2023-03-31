import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  addDoc,
  collection,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";

// firebaseConfig for customer app
const firebaseconfig1 = {
  apiKey: "AIzaSyCL4vpApFoiEd2NI_krVgWp85CcPWmD5Oc",
  authDomain: "customer-b1eaa.firebaseapp.com",
  projectId: "customer-b1eaa",
  storageBucket: "customer-b1eaa.appspot.com",
  messagingSenderId: "105439236709",
  appId: "1:105439236709:web:de6b1033bde5935d7a2c8c",
};

// firebaseconfig for vendor app
const firebaseconfig2 = {
  apiKey: "AIzaSyD7vJO8kRKqyXY9WKAxpR26WG63a0f-Vws",
  authDomain: "vendor-a8255.firebaseapp.com",
  projectId: "vendor-a8255",
  storageBucket: "vendor-a8255.appspot.com",
  messagingSenderId: "218244970044",
  appId: "1:218244970044:web:2326416fbe1495dc017539",
};

// ----------------------------------------------
// intializing all the services
const customer = initializeApp(firebaseconfig1, "customer");
const customerauth = getAuth(customer);

// intializing the vendor part of login
const vendor = initializeApp(firebaseconfig2, "vendor");
const vendorauth = getAuth(vendor);
const vendordb = getFirestore(vendor);
const colrefv = collection(vendordb, "users");
// -------------------------------------------------

// form for vendor
const resetv = document.getElementById("resetpass");
const signupv = document.getElementById("signupvendor");
const emailv = document.getElementById("emailvendor");
const passwordv = document.getElementById("passwordvendor");
const signupbtnv = document.getElementById("signupbtnvendor");
const signinbtnv = document.getElementById("signinbtnvendor");
const cnfrmpasswordv = document.getElementById("confirmpasswordvendor");
const printerror = document.getElementById("errormessagev");

resetv.addEventListener("click", (e) => {
  console.log("working");
  sendPasswordResetEmail(vendorauth, emailv.value)
    .then(() => {
      printerror.innerText = "check your inbox";
      printerror.style.display = "block";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      printerror.innerText = errorMessage;
      printerror.style.display = "block";
      // ..
    });
});

signupbtnv.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("working");
  console.log(cnfrmpasswordv, passwordv);
  if (cnfrmpasswordv.value == passwordv.value) {
    createUserWithEmailAndPassword(vendorauth, emailv.value, passwordv.value)
      .then(() => {
        onAuthStateChanged(vendorauth, (user) => {
          if (user) {
            // making a document in vendor database
            setDoc(doc(vendordb, "users", user.email), {}).then(
              function changepage() {
                window.location = "vendorhome.html";
              }
            );
          } else {
            console.log("user is signed out");
          }
        });
        signupv.reset();
      })
      .catch((err) => {
        // printing error messages
        console.log(typeof err.message);
        printerror.innerText = err.message;
        printerror.style.display = "block";
      });
  } else {
    printerror.innerText = "passwords are not same";
    printerror.style.display = "block";
  }
});

signinbtnv.addEventListener("click", (e) => {
  console.log("working");
  e.preventDefault();

  signInWithEmailAndPassword(vendorauth, emailv.value, passwordv.value)
    .then((cred) => {
      onAuthStateChanged(vendorauth, (user) => {
        if (user) {
          // changing page
          window.location = "vendorhome.html";
        } else {
          console.log("user is signed out");
        }
      });
      console.log(cred.user.email);
      window.location = "vendorhome.html";
      signupv.reset();
    })
    .catch((err) => {
      console.log(err.message);
      document.getElementById("resetpass").style.display = "block";
      printerror.innerText = err.message;
      printerror.style.display = "block";
    });
});

// form for customer
const resetc = document.getElementById("resetpassc");
const signupc = document.getElementById("signupcustomer");
const emailc = document.getElementById("emailcustomer");
const passwordc = document.getElementById("passwordcustomer");
const cnfrmpasswordc = document.getElementById("confirmpasswordcustomer");
const signinbtnc = document.getElementById("signinbtncustomer");
const signupbtnc = document.getElementById("signupbtncustomer");
const printerrorc = document.getElementById("errormessagec");

resetc.addEventListener("click", (e) => {
  console.log("working");
  sendPasswordResetEmail(customerauth, emailc.value)
    .then(() => {
      printerrorc.innerText = "check your inbox";
      printerrorc.style.display = "block";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      printerrorc.innerText = errorMessage;
      printerrorc.style.display = "block";
      // ..
    });
});

signupbtnc.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("working");
  if (cnfrmpasswordc.value == passwordc.value) {
    createUserWithEmailAndPassword(customerauth, emailc.value, passwordc.value)
      .then((cred) => {
        onAuthStateChanged(customerauth, (user) => {
          if (user) {
            window.location = "customerhome.html";
          } else {
            console.log("user is signed out");
          }
        });
        signupc.reset();
      })
      .catch((err) => {
        console.log(typeof err.message);
        printerrorc.innerText = err.message;
        printerrorc.style.display = "block";
      });
  } else {
    printerrorc.innerText = "passwords are not same";
    printerrorc.style.display = "block";
  }
});

signinbtnc.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("working");
  signInWithEmailAndPassword(customerauth, emailc.value, passwordc.value)
    .then((cred) => {
      console.log(cred.user.email);
      onAuthStateChanged(customerauth, (user) => {
        if (user) {
          window.location = "customerhome.html";
        } else {
          console.log("user is signed out");
        }
      });
      signupv.reset();
    })
    .catch((err) => {
      console.log(err.message);
      printerrorc.innerText = err.message;
      printerrorc.style.display = "block";
      resetc.style.display = "block";
    });
});
// --------------------------------------------------------------------------------------
// =========================================================================================

// dom here

let activesignup = document.getElementById("signupactive");
let cnfrmpswrd = document.getElementById("cnfrmpassword");
let cnfrmpswrdv = document.getElementById("confirmpasswordvendor");
let mainboxv = document.getElementById("mainvendor");
let clickvendor = document.getElementById("clicklistenerv");
let desc1v = document.getElementById("desc1v");
let desc2v = document.getElementById("desc2v");

clickvendor.addEventListener("click", () => {
  signupv.scrollIntoView();
});

mainboxv.addEventListener("mouseover", () => {
  console.log("working left hovering");
  mainboxc.scrollTop = 0;
});

clickvendor.addEventListener("mouseover", () => {
  desc1v.style.top = "0rem";
  desc2v.style.top = "0rem";
});

clickvendor.addEventListener("mouseout", () => {
  desc1v.style.top = "-1.5rem";
  desc2v.style.top = "-3rem";
});

function activatesignup() {
  if (cnfrmpswrd.style.display == "none") {
    console.log("working");
    cnfrmpswrd.style.display = "block";
    cnfrmpswrdv.style.display = "block";
    signupbtnv.style.display = "block";
    signinbtnv.style.display = "none";
    activesignup.innerText = "already have an account?";
  } else {
    console.log("working");
    cnfrmpswrd.style.display = "none";
    cnfrmpswrdv.style.display = "none";
    signupbtnv.style.display = "none";
    signinbtnv.style.display = "block";
    activesignup.innerText = "newuser?";
  }
}

activesignup.addEventListener("click", () => {
  activatesignup();
});

let activesignupc = document.getElementById("signupactivec");
let cnfrmpswrdc = document.getElementById("cnfrmpasswordc");
let cnfrmpswrdcc = document.getElementById("confirmpasswordcustomer");
let mainboxc = document.getElementById("maincustomer");
let clickcustomer = document.getElementById("clicklistenerc");
let desc1c = document.getElementById("desc1c");
let desc2c = document.getElementById("desc2c");

clickcustomer.addEventListener("click", () => {
  signupc.scrollIntoView();
});

mainboxc.addEventListener("mouseover", () => {
  console.log("working right hovering");
  mainboxv.scrollTop = 0;
});

clickcustomer.addEventListener("mouseover", () => {
  desc1c.style.top = "0rem";
  desc2c.style.top = "0rem";
});
clickcustomer.addEventListener("mouseout", () => {
  desc1c.style.top = "-1.5rem";
  desc2c.style.top = "-3rem";
});

activesignupc.addEventListener("click", () => {
  if (cnfrmpswrdcc.style.display == "none") {
    cnfrmpswrdcc.style.display = "block";
    cnfrmpswrdc.style.display = "block";
    signupbtnc.style.display = "block";
    signinbtnc.style.display = "none";
    activesignupc.innerText = "already have an account?";
  } else {
    cnfrmpswrdcc.style.display = "none";
    cnfrmpswrdc.style.display = "none";
    signupbtnc.style.display = "none";
    signinbtnc.style.display = "block";
    activesignupc.innerText = "new user?";
  }
});
