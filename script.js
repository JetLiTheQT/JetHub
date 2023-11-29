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
// Place this script at the end of your JavaScript file or within a <script> tag in your HTML
document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'block';
});

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function changeBackground() {
    const selectedBackground = document.getElementById('backgroundSelector').value;
    document.body.style.backgroundImage = `url('${selectedBackground}')`;
    localStorage.setItem('backgroundImage', selectedBackground);
}
function handleClickOutsideModal(event) {
    const modalContent = document.getElementById('modalContent');
    // Check if the click is outside the modal content
    if (!modalContent.contains(event.target)) {
        closeModal();
    }
}

// Add event listener to the window/document
window.addEventListener('click', handleClickOutsideModal);
document.addEventListener('DOMContentLoaded', () => {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.backgroundImage = `url('${savedBackground}')`;
    }
});




// Call the function when the page loads
fetchAndDisplayQuote();
