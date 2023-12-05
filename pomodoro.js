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


// Create variables pulled from their ID's
const timeElement = document.getElementById("time");
const pomodoroBtn = document.getElementById("pomodoro-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const resetBtn = document.getElementById("reset-btn");
let currentMode = 'pomodoro'; 
let isRunning = false;
let interval;
let minutes = 25; //Set default time
let seconds = 0;

function displayTime() {
    const mins = String(minutes).padStart(2, "0");
    const secs = String(seconds).padStart(2, "0");
    timeElement.textContent = `${mins}:${secs}`;
}

function startStopTimer() {
    if (isRunning) {
        clearInterval(interval);
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        interval = setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
            }
            if (minutes < 0) {
                clearInterval(interval);
                alert("Time's up!");
                minutes = 25;
                seconds = 0;
            }
            displayTime();
        }, 1000);
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isRunning = !isRunning;
}

pomodoroBtn.addEventListener("click", () => {
    minutes = 25;
    seconds = 0;
    currentMode = 'pomodoro';
    displayTime();
    setActiveBtn(pomodoroBtn);
});

shortBreakBtn.addEventListener("click", () => {
    minutes = 5;
    seconds = 0;
    currentMode = 'shortBreak';
    displayTime();
    setActiveBtn(shortBreakBtn);
});

longBreakBtn.addEventListener("click", () => {
    minutes = 10;
    seconds = 0;
    currentMode = 'longBreak';
    displayTime();
    setActiveBtn(longBreakBtn);
});

playPauseBtn.addEventListener("click", startStopTimer);

resetBtn.addEventListener("click", () => {
    if (isRunning) {
        startStopTimer(); // Stop the timer
    }
    switch (currentMode) {
        case 'pomodoro':
            minutes = 25;
            break;
        case 'shortBreak':
            minutes = 5;
            break;
        case 'longBreak':
            minutes = 10;
            break;
        default:
            minutes = 25; 
    }
    seconds = 0;
    displayTime();
});


function setActiveBtn(btn) {
    [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach((button) => {
        button.classList.remove("active");
    });
    btn.classList.add("active");
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
function preloadBackgroundImages() {
    const images = [
        'background.jpg', 
        'background2.jpg', 
        'background3.jpg',
        'background4.jpg', 
        'background5.jpg', 
        'background6.jpg'
    ];
    
    images.forEach(image => {
        const img = new Image();
        img.src = image;
    });
}

// Call this function when the DOM content has loaded
document.addEventListener('DOMContentLoaded', preloadBackgroundImages);

// Close modal if clicking outside of it
window.addEventListener('click', (e) => {

    if (e.target === settingsModal){
        closeSettingsModal();
    }
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
document.addEventListener('DOMContentLoaded', () => {
    // Create the responsive menu
    const responsiveMenu = document.createElement('div');
    responsiveMenu.classList.add('responsive-menu');
    responsiveMenu.style.display = 'none'; // Initially hidden

    // Clone navigation links into the responsive menu
    document.querySelectorAll('.navigation a').forEach(link => {
        const clonedLink = link.cloneNode(true);
        clonedLink.style.display = 'block'; // Ensure cloned links are displayed as block elements
        responsiveMenu.appendChild(clonedLink);
    });

    // Append the responsive menu to the body
    document.body.appendChild(responsiveMenu);

    // Event listener for the hamburger icon
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener('click', () => {
        // Toggle the display of the responsive menu
        responsiveMenu.style.display = responsiveMenu.style.display === 'block' ? 'none' : 'block';
    });
});
displayTime();
