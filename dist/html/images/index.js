// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyD7vJO8kRKqyXY9WKAxpR26WG63a0f-Vws",
//   authDomain: "vendor-a8255.firebaseapp.com",
//   projectId: "vendor-a8255",
//   storageBucket: "vendor-a8255.appspot.com",
//   messagingSenderId: "218244970044",
//   appId: "1:218244970044:web:2326416fbe1495dc017539",
// };
// let a = {
//   hello: "hello's dffb dfg dfg df g",
//   bello: "chello",
// };

// let b = JSON.stringify(a);

// let c = b.replaceAll(" ", "Њ");

// console.log(b);
// console.log(c);

document.getElementById("btn").addEventListener("click", () => {
  document.getElementById("inp").toggleAttribute("contenteditable");
  console.log(document.getElementById("inp").innerText);
});

// let d = JSON.parse(c);
