// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmHD-j3W9EDDpr1a79T5e-0xct6uzTWB4",
  authDomain: "inventory-management-2afb0.firebaseapp.com",
  projectId: "inventory-management-2afb0",
  storageBucket: "inventory-management-2afb0.appspot.com",
  messagingSenderId: "1005766088277",
  appId: "1:1005766088277:web:13ce54a59d79e2d72ca6dc",
  measurementId: "G-CWP5HWM24H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)


export{firestore}