// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyC3pAldqXEE2wy5eR3J-eRfkIGiwWYRqi8",
    authDomain: "algebra-quest-skripsi.firebaseapp.com",
    projectId: "algebra-quest-skripsi",
    storageBucket: "algebra-quest-skripsi.firebasestorage.app",
    messagingSenderId: "266916334608",
    appId: "1:266916334608:web:721c4762b65fb89b7f0e95",
    measurementId: "G-9N2Q4LB2FP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };