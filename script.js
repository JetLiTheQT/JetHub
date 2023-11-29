document.addEventListener("DOMContentLoaded", function() {
    const welcomeElement = document.getElementById('welcome');
    const text = "Welcome Jet";
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
});
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
    closeSettingsModal(); // Close the modal after changing the background
}


// Close modal if clicking outside of it
window.addEventListener('click', (e) => {

    if (e.target === settingsModal){
        closeSettingsModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.backgroundImage = `url('${savedBackground}')`;
    }
});




// Call the function when the page loads
fetchAndDisplayQuote();
