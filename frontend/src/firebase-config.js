// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHogYZ_1CdfWMC1fbJfRnabqiB_UxnTZI",
  authDomain: "libproject-90bd6.firebaseapp.com",
  projectId: "libproject-90bd6",
  storageBucket: "libproject-90bd6.firebasestorage.app",
  messagingSenderId: "840388294133",
  appId: "1:840388294133:web:36bd9bc783c33ac09e5cbc",
  measurementId: "G-YHQ2Q27CH9"
};

// Initialize Firebase

 
const app=getApps().length==0 ? initializeApp(firebaseConfig) :getApps();
const auth=getAuth(app);
const provider=new GoogleAuthProvider();


const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logOut };
