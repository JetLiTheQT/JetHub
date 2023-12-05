// script.js
import { auth } from './firebaseConfig.js';
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const loginButton = document.getElementById('loginButton');
const welcomeDiv = document.getElementById('welcome');


// Function to set the "Welcome" message
function setWelcomeMessage(displayName) {
    const welcomeElement = document.getElementById('welcome');
    const text = `Welcome, ${displayName}`;
    let index = 0;

    function type() {
        if (index < text.length) {
            welcomeElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            welcomeElement.style.borderRight = 'none';
        }
    }

    type();
}

// script.js
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, hide the login button and show a welcome message
        const displayName = user.displayName;
        setWelcomeMessage(displayName);
        if (loginButton) {
            loginButton.style.display = 'none'; // Hide login button
        }
    } else {
        // User is not signed in, show the login button
        if (loginButton) {
            loginButton.style.display = 'block'; // Show login button
        }
    }
});


// Listen for clicks on the login button
loginButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const displayName = user.displayName;
            setWelcomeMessage(displayName);
            // Optional: Redirect or perform other actions after successful login
        })
        .catch((error) => {
            console.error('Google Sign-In Error:', error);
        });
});
document.getElementById('logoutButton').addEventListener('click', () => {
    const userWantsToLogout = confirm("Are you sure you want to log out?");
    if (userWantsToLogout) {
        auth.signOut()
            .then(() => {
                window.location.href = '/login.html'; // Redirect to login page after logout
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    }
});

// // Check if a user is already signed in
// auth.onAuthStateChanged((user) => {
//     if (user) {
//         // User is signed in, show a welcome message
//         const displayName = user.displayName;
//         welcomeDiv.innerText = `Welcome, ${displayName}`;
//     } else {
//         // User is not signed in, redirect to the login page
//         window.location.href = '/login'; // Change the URL to your login page
//     }
// });

// // Listen for clicks on the login button
// loginButton.addEventListener('click', () => {
//     const provider = new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider)
//         .then((result) => {
//             const user = result.user;
//             const displayName = user.displayName;
//             welcomeDiv.innerText = `Welcome, ${displayName}`;
//         })
//         .catch((error) => {
//             console.error('Google Sign-In Error:', error);
//         });
// });

// document.addEventListener("DOMContentLoaded", function() {
//     const welcomeElement = document.getElementById('welcome');
//     const text = "Welcome Jet";
//     let index = 0;

//     function type() {
//         if (index < text.length) {
//             welcomeElement.textContent += text.charAt(index);
//             index++;
//             setTimeout(type, 100);  
//         } else {
//             welcomeElement.style.borderRight = 'none';  
//         }
//     }

//     type(); 
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const savedBackground = localStorage.getItem('backgroundImage');
//     if (savedBackground) {
//         const img = new Image();
//         img.onload = function() {
//             document.body.style.backgroundImage = `url('${savedBackground}')`;
//         };
//         img.src = savedBackground;
//     }
// });



function fetchAndDisplayQuote() {
    // Adding a unique timestamp to the URL to prevent caching
    const url = 'https://api.allorigins.win/raw?url=https://zenquotes.io/api/random&' + new Date().getTime();

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const quote = data[0].q;
        const author = data[0].a;
        document.getElementById('quote-text').textContent = `"${quote}"`;
        document.getElementById('quote-author').textContent = `- ${author}`;
    })
    .catch(error => {
        console.error('Error fetching the quote:', error);
    });
}
document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'block';
});

window.closeSettingsModal = function() {
    document.getElementById('settingsModal').style.display = 'none';
}

window.changeBackground = function(newBackground) {
    document.body.style.backgroundImage = `url('${newBackground}')`;
    localStorage.setItem('backgroundImage', newBackground);
    document.body.style.backgroundSize = 'cover'; // Set background size to cover
    closeSettingsModal(); // Close the modal after changing the background
}


// Close modal if clicking outside of it
window.addEventListener('click', (e) => {

    if (e.target === settingsModal){
        closeSettingsModal();
    }
});



// Call the function when the page loads
fetchAndDisplayQuote();
