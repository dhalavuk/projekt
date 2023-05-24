// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAR8qDCyJy-Z-XaFG1A3QlIvKg951V_5QQ",
  authDomain: "kuharica-666c8.firebaseapp.com",
  projectId: "kuharica-666c8",
  storageBucket: "kuharica-666c8.appspot.com",
  messagingSenderId: "183411598709",
  appId: "1:183411598709:web:82efb4628320608a50df3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ovo nam daje pristup bazi
const auth = getAuth(app);
const storage = getStorage(app);


//expotranje
export{
  db,
  auth
}

