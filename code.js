const myLibrary = [];

const newBookBtn = document.getElementById('newBookBtn');
const bookDialog = document.getElementById('bookDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const bookForm = document.getElementById('bookForm');

newBookBtn.addEventListener('click', () => {
    bookDialog.showModal();
});

closeDialogBtn.addEventListener('click', () => {
    bookDialog.close();
});

bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(bookForm);
    const title = formData.get('title');
    const author = formData.get('author');
    const pages = Number(formData.get('pages'));
    const read = formData.get('read') === 'on';
    addBookToLibrary(title, author, pages, read);
    displayLibrary();
    bookDialog.close();
    bookForm.reset();
});

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.title = title;
    this.author = author
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID()
    this.info = function () {
        return (this.title + ' by ' + this.author + ', ' + this.pages + ' pages, ' + (this.read ? 'read' : 'not read yet'));
    };
}

Book.prototype.toggleReadStatus = function () {
    this.read = !this.read;
};


function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}

function displayLibrary() {
    const libraryDiv = document.getElementById('library');
    libraryDiv.innerHTML = ''; // Clear previous content

    myLibrary.forEach((book) => {
        const card = document.createElement('div');
        card.classList.add('book-card');
        card.setAttribute('data-id', book.id);
        card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Pages:</strong> ${book.pages}</p>
      <p><strong>Status:</strong> ${book.read ? 'Read' : 'Not read yet'}</p>
      <button class="toggle-read-btn">${book.read ? 'Mark as Unread' : 'Mark as Read'}</button>
      <button class="remove-btn">Remove</button>
    `;
        // Add event listener for remove button
        card.querySelector('.remove-btn').addEventListener('click', () => {
            removeBookFromLibrary(book.id);
        });
        // Add event listener for toggle read status button
        card.querySelector('.toggle-read-btn').addEventListener('click', () => {
            book.toggleReadStatus();
            displayLibrary();
        });
        libraryDiv.appendChild(card);
    });
}

function removeBookFromLibrary(id) {
    const index = myLibrary.findIndex(book => book.id === id);
    if (index !== -1) {
        myLibrary.splice(index, 1);
        displayLibrary();
    }
}

// Add a few books for demonstration
addBookToLibrary('1984', 'George Orwell', 328, true);
addBookToLibrary('To Kill a Mockingbird', 'Harper Lee', 281, false);

// Display the library
displayLibrary();