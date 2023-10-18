// HTML Elements
const addBookButton = document.querySelector('.add-new');
const modal = document.getElementById('addBookModal');
const closeModalButton = modal.querySelector('.close');
const bookSearchInput = modal.querySelector('#bookSearch');
const searchResults = modal.querySelector('.searchResults');
const readingListContainer = document.querySelector('.reading-list-container');
const db = firebase.firestore();


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
            <button onclick="addBookToList('${book.title}', '${book.author_name ? book.author_name[0] : 'Unknown Author'}')">Add to List</button>
        `;

        searchResults.appendChild(bookElement);
    });
}

function addBookToList(title, author) {
    const bookData = { title, author };
    
    // Add the book to the Firestore database
    db.collection('books').add(bookData).then((docRef) => {
        console.log(`Book added with ID: ${docRef.id}`);

        // Add the book to the UI
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h4>${title}</h4>
            <p>${author}</p>
        `;

        readingListContainer.insertBefore(bookCard, addBookButton);
    }).catch((error) => {
        console.error("Error adding book: ", error);
    });
    
    closeModal(); // Close the modal after adding a book
}


// Fetch and display books from Firestore on page load
function fetchBooksFromDb() {
    db.collection('books').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const bookData = doc.data();
            addBookToUI(bookData.title, bookData.author);
        });
    });
}

// Add book to the UI (splitting this logic out so we can use it for both fetched books and newly added books)
function addBookToUI(title, author) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.innerHTML = `
        <h4>${title}</h4>
        <p>${author}</p>
    `;
    
    readingListContainer.insertBefore(bookCard, addBookButton);
}

// Call the fetchBooksFromDb function when the script runs
fetchBooksFromDb();


// Close modal if clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});