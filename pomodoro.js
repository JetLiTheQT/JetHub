

// Create variables pulled from their ID's
const timeElement = document.getElementById("time");
const pomodoroBtn = document.getElementById("pomodoro-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const resetBtn = document.getElementById("reset-btn");

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
    displayTime();
    setActiveBtn(pomodoroBtn);
});

shortBreakBtn.addEventListener("click", () => {
    minutes = 0;
    seconds = 2;
    displayTime();
    setActiveBtn(shortBreakBtn);
});

longBreakBtn.addEventListener("click", () => {
    minutes = 10;
    seconds = 0;
    displayTime();
    setActiveBtn(longBreakBtn);
});

playPauseBtn.addEventListener("click", startStopTimer);

resetBtn.addEventListener("click", () => {
    if (isRunning) {
        startStopTimer(); // Stop the timer
    }
    minutes = 25;
    seconds = 0;
    displayTime();
});

function setActiveBtn(btn) {
    [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach((button) => {
        button.classList.remove("active");
    });
    btn.classList.add("active");
}

displayTime();
