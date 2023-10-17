document.addEventListener("DOMContentLoaded", function() {
    const welcomeElement = document.getElementById('welcome');
    const text = "Welcome Jet";
    let index = 0;

    function type() {
        if (index < text.length) {
            welcomeElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);  // This sets the typing speed. Adjust the 100 to type faster/slower.
        } else {
            welcomeElement.style.borderRight = 'none';  // Remove cursor after typing
        }
    }

    type();  // Start the typewriter effect
});
