
import { db, auth } from './firebaseConfig.js';
import { collection, getDocs, addDoc, doc, setDoc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// HTML Elements
const addBookButton = document.querySelector('.add-new');
const modal = document.getElementById('addBookModal');
const modal2 = document.getElementById('bookDetailModal');

const closeModalButton = modal.querySelector('.close');
const bookSearchInput = modal.querySelector('#bookSearch');
const searchResults = modal.querySelector('.searchResults');
const readingListContainer = document.querySelector('.reading-list-container');


// Show the Modal
addBookButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close the Modal
// For the addBookModal
closeModalButton.addEventListener('click', closeModal);

const closeDetailModalButton = modal2.querySelector('.close');
closeDetailModalButton.addEventListener('click', closeDetailModal);


function closeModal() {
    modal.style.display = 'none';
}

function closeDetailModal() {
    modal2.style.display = 'none';
}
// Fetch Books when typing
bookSearchInput.addEventListener('input', (e) => {
    if (e.target.value.length >= 3) {
        fetchBooks(e.target.value);
    }
});

let currentPage = 1;
const resultsPerPage = 5; // Adjust as needed

function fetchBooks(query, page = 1) {
    const startIndex = (page - 1) * resultsPerPage;

    fetch(`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`)
        .then(response => response.json())
        .then(data => displayResults(data.docs));
}

// Event listeners for pagination buttons
document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    fetchBooks(bookSearchInput.value, currentPage);
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(bookSearchInput.value, currentPage);
    }
});

bookSearchInput.addEventListener('input', (e) => {
    if (e.target.value.length >= 3) {
        currentPage = 1; // Reset to the first page for a new search
        fetchBooks(e.target.value);
    }
});


// Display book search results in the modal
function displayResults(books) {
    searchResults.innerHTML = ''; // Clear previous results
    document.getElementById('currentPage').innerText = currentPage;

    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-result');
        bookElement.innerHTML = `
            <h4>${book.title}</h4>
            <p>${book.author_name ? book.author_name[0] : 'Unknown Author'}</p>
            <button class="add-to-list-button">Add to List</button>
        `;

        bookElement.querySelector(".add-to-list-button").addEventListener('click', () => {
            addBookToList(book.title, book.author_name ? book.author_name[0] : 'Unknown Author');
            closeModal();
        });

        searchResults.appendChild(bookElement);
    });
}
// async function addBookToList(title, author) {
//     const bookData = { title, author };

//     try {
//         const docRef = await addDoc(collection(db, 'books'), bookData);
//         console.log(`Book added with ID: ${docRef.id}`);

//         addBookToUI(title, author, docRef.id);
//     } catch (error) {
//         console.error("Error adding book: ", error);
//     }
// }
async function addBookToList(title, author) {
    const user = auth.currentUser;
    if (user) {
        const bookData = { title, author, userId: user.uid }; // Include the user's UID

        try {
            const docRef = await addDoc(collection(db, 'books'), bookData);
            console.log(`Book added with ID: ${docRef.id}`);

            addBookToUI(title, author, docRef.id);
        } catch (error) {
            console.error("Error adding book: ", error);
        }
    } else {
        // Handle the case where the user is not authenticated
        console.log('User is not authenticated.');
    }
}



async function fetchBooksFromDb() {
    const user = auth.currentUser;
    if (user) {
        const booksCollection = collection(db, 'books');
        const querySnapshot = await getDocs(booksCollection);
        querySnapshot.forEach((doc) => {
            const bookData = doc.data();
            if (bookData.userId === user.uid) { // Check if the book belongs to the current user
                const bookId = doc.id; // Capture the Firestore document ID
                addBookToUI(bookData.title, bookData.author, bookId);
            }
        });
    } else {
        console.log('User is not authenticated.');
        // Optionally, handle the scenario where there is no authenticated user
    }
}




// Add book to the UI (splitting this logic out so we can use it for both fetched books and newly added books)
function addBookToUI(title, author, bookId) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.dataset.bookId = bookId; // Store the unique identifier
    
    bookCard.innerHTML = `
        <div class="book-text-container">
            <h4>${title}</h4>
            <p>${author}</p>
        </div>
    `;
    bookCard.addEventListener('click', function() {
        const id = this.dataset.bookId;
        openDetailModal(title, author, id);
    });
    
    
    readingListContainer.insertBefore(bookCard, addBookButton);
}



let currentBook = {}; 

async function saveBookDetails(bookId) {
    const { title, author } = currentBook; // Make sure these are defined
    const notes = document.getElementById('bookNotes').value;
    const rating = getRatingValue();
    const finished = document.getElementById('finishedCheckbox').checked;

    const bookData = { title, author, notes, rating, finished };

    try {
        await setDoc(doc(db, 'books', bookId), bookData, { merge: true });
        console.log("Book details saved");
        closeDetailModal();
    } catch (error) {
        console.error("Error saving book details: ", error);
    }
}
function getRatingValue() {
    const checkedStars = document.querySelectorAll('#starRating .fa-star.checked').length;
    return checkedStars;
}

async function loadBookDetails(bookId) {
    console.log("Loading book details for bookId:", bookId);

    try {
        const docRef = doc(db, 'books', bookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const bookData = docSnap.data();
            document.getElementById('bookNotes').value = bookData.notes || "";
            setRating(bookData.rating || 0); // Visually update the stars based on rating
            document.getElementById('finishedCheckbox').checked = bookData.finished || false;
        } else {
            console.log("No such book!");
            document.getElementById('bookNotes').value = "";
            setRating(0);
            document.getElementById('finishedCheckbox').checked = false;
        }
    } catch (error) {
        console.error("Error loading book details: ", error);
    }
}

async function deleteBook(bookId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (confirmDelete) {
        try {
            await deleteDoc(doc(db, 'books', bookId));
            console.log("Book deleted");

            // Remove the book card from the UI
            const bookCard = document.querySelector(`[data-book-id="${bookId}"]`);
            if (bookCard) {
                bookCard.remove();
            }

            // Close the modal
            closeDetailModal();
        } catch (error) {
            console.error("Error deleting book: ", error);
        }
    }
}



function openDetailModal(title, author, bookId) {
    const bookDetailsDiv = document.getElementById('bookDetails');
    bookDetailsDiv.innerHTML = `
        <h2>${title}</h2>
        <p>${author}</p>
        <label><input type="checkbox" id="finishedCheckbox"> Finished</label>
        <h4>Rating:</h4>
        <div id="starRating">
            <i class="far fa-star" data-value="1"></i>
            <i class="far fa-star" data-value="2"></i>
            <i class="far fa-star" data-value="3"></i>
            <i class="far fa-star" data-value="4"></i>
            <i class="far fa-star" data-value="5"></i>
        </div>
    
        <h4>Notes:</h4>
        <textarea id="bookNotes" rows="4" cols="50"></textarea>
        <div id="saveDel">
            <i class="fa-solid fa-trash-can" id="deleteButtonID"></i>
            <i class="fas fa-save" id="saveButtonID"></i>
        </div>
    `;
    currentBook = { title, author }; // Update currentBook

    // Reattach star click event listeners
    document.querySelectorAll('#starRating .fa-star').forEach(star => {
        star.addEventListener('click', onStarClick);
    });

    loadBookDetails(bookId);

    // Attach event listeners
    const saveButton = document.getElementById('saveButtonID');
    const deleteButton = document.getElementById('deleteButtonID');
    if (saveButton && deleteButton) {
        saveButton.addEventListener('click', () => saveBookDetails(bookId));
        deleteButton.addEventListener('click', () => deleteBook(bookId));
    } else {
        console.error("Buttons not found in the modal.");
    }
    
    document.getElementById('bookDetailModal').style.display = 'block';
}


document.querySelectorAll('#starRating .fa-star').forEach(star => {
    star.addEventListener('click', onStarClick);
});

function onStarClick(e) {
    const ratingValue = parseInt(e.target.dataset.value);
    setRating(ratingValue);
}

function setRating(value) {
    document.querySelectorAll('#starRating .fa-star').forEach(star => {
        const starValue = parseInt(star.dataset.value);
        if (starValue <= value) {
            star.classList.remove('far');
            star.classList.add('fas', 'checked');
        } else {
            star.classList.remove('fas', 'checked');
            star.classList.add('far');
        }
    });
}

// Place this script at the end of your JavaScript file or within a <script> tag in your HTML
document.getElementById('settingsButton').addEventListener('click', () => {
    document.getElementById('settingsModal').style.display = 'block';
});

window.closeSettingsModal = function() {
    document.getElementById('settingsModal').style.display = 'none';
}

window.changeBackground = function(newBackground) {
    // Fade out the current background
    document.body.style.opacity = 0;

    // After a short delay, change the background and fade it in
    setTimeout(() => {
        document.body.style.backgroundImage = `url('${newBackground}')`;
        localStorage.setItem('backgroundImage', newBackground);
        document.body.style.backgroundSize = 'cover';
        document.body.style.opacity = 1;
        closeSettingsModal();
    }, 250); // The delay should be half of your transition duration
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
        // Check if the image is already cached
        if (!localStorage.getItem(image)) {
            const img = new Image();
            img.onload = function() {
                // Store a flag in local storage when the image is loaded
                localStorage.setItem(image, true);
            };
            img.src = image;
        }
    });
}

// Call this function when the DOM content has loaded
document.addEventListener('DOMContentLoaded', preloadBackgroundImages);


// Call the fetchBooksFromDb function when the script runs
auth.onAuthStateChanged((user) => {
    if (user) {
        fetchBooksFromDb(); // Fetch books only when user is authenticated
    } else {
        console.log('User is not authenticated.');
        // Handle unauthenticated scenario
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

// Close modal if clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
    if (e.target === modal2) {
        closeDetailModal();
    }
    if (e.target === settingsModal){
        closeSettingsModal();
    }
});
