// login.js
import { auth, db } from './firebaseConfig.js';
import { signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            window.location.href = '/index.html';
        })
        .catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
});
