// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrHw4QkFNEnNw2QVsMkVPOg4TtxbeQVwM",
    authDomain: "jethub-7e600.firebaseapp.com",
    projectId: "jethub-7e600",
    storageBucket: "jethub-7e600.appspot.com",
    messagingSenderId: "723758012207",
    appId: "1:723758012207:web:40ea1ea84e9a2f460fb3da"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML Elements
const addBookButton = document.querySelector('.add-new');
const modal = document.getElementById('addBookModal');
const closeModalButton = modal.querySelector('.close');
const bookSearchInput = modal.querySelector('#bookSearch');
const searchResults = modal.querySelector('.searchResults');
const readingListContainer = document.querySelector('.reading-list-container');


// Show the Modal
addBookButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close the Modal
closeModalButton.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';
}

// Fetch Books when typing
bookSearchInput.addEventListener('input', (e) => {
    if (e.target.value.length >= 3) {
        fetchBooks(e.target.value);
    }
});

// Fetch books from Open Library API
function fetchBooks(query) {
    fetch(`https://openlibrary.org/search.json?q=${query}`)
        .then(response => response.json())
        .then(data => displayResults(data.docs));
}

// Display book search results in the modal
function displayResults(books) {
    searchResults.innerHTML = ''; // Clear previous results

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
        });

        searchResults.appendChild(bookElement);
    });
}


async function addBookToList(title, author) {
    const bookData = { title, author };

    // Reference to 'books' collection
    const booksCollection = collection(db, 'books');

    try {
        // Add the book to the Firestore database
        const docRef = await addDoc(booksCollection, bookData);
        console.log(`Book added with ID: ${docRef.id}`);

        // Add the book to the UI
        addBookToUI(title, author);

        readingListContainer.insertBefore(bookCard, addBookButton);
        
        closeModal(); // Close the modal after adding a book
    } catch (error) {
        console.error("Error adding book: ", error);
    }
}

async function fetchBooksFromDb() {
    const booksCollection = collection(db, 'books');
    const querySnapshot = await getDocs(booksCollection);
    querySnapshot.forEach((doc) => {
        const bookData = doc.data();
        addBookToUI(bookData.title, bookData.author);
    });
}


// Add book to the UI (splitting this logic out so we can use it for both fetched books and newly added books)
function addBookToUI(title, author) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.setAttribute('data-title', title); // Unique identifier
    bookCard.innerHTML = `
        <h4>${title}</h4>
        <p>${author}</p>
    `;
    
    bookCard.addEventListener('click', function() {
        openDetailModal(title, author);
    });

    readingListContainer.insertBefore(bookCard, addBookButton);
}
function openDetailModal(title, author) {
    // Here, fetch more details from Firestore if necessary
    // For simplicity, I'll just display the title and author
    const bookDetailsDiv = document.getElementById('bookDetails');
    bookDetailsDiv.innerHTML = `
        <h2>${title}</h2>
        <p>Author: ${author}</p>
        // Add more details or fetched content here
    `;

    // Display the modal
    document.getElementById('bookDetailModal').style.display = 'block';
}

function closeDetailModal() {
    document.getElementById('bookDetailModal').style.display = 'none';
}
// Call the fetchBooksFromDb function when the script runs
fetchBooksFromDb();


// Close modal if clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
