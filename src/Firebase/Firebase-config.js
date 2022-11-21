// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore  } from 'firebase/firestore';
import { getAuth, updatePassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpvhuo1JKkmEJZQlTR8utyDKh11R_e_ik",
  authDomain: "monkey-blogging-9afa7.firebaseapp.com",
  projectId: "monkey-blogging-9afa7",
  storageBucket: "monkey-blogging-9afa7.appspot.com",
  messagingSenderId: "477714021426",
  appId: "1:477714021426:web:2d198920e59bf0e870102b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

