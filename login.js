// Import Firebase modules using ES6 import statements
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrHw4QkFNEnNw2QVsMkVPOg4TtxbeQVwM",
    authDomain: "jethub-7e600.firebaseapp.com",
    projectId: "jethub-7e600",
    storageBucket: "jethub-7e600.appspot.com",
    messagingSenderId: "723758012207",
    appId: "1:723758012207:web:40ea1ea84e9a2f460fb3da"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginButton = document.getElementById('loginButton');

// Listen for clicks on the login button
loginButton.addEventListener('click', () => {
    const provider = new app.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            // User is signed in, you can handle the success here
        })
        .catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
});