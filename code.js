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

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = crypto.randomUUID();
    }

    info() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
    }

    toggleReadStatus() {
        this.read = !this.read;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.books.push(book);
    }

    removeBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    toggleBookReadStatus(id) {
        const book = this.books.find(book => book.id === id);
        if (book) {
            book.toggleReadStatus();
        }
    }

    getBooks() {
        return this.books;
    }
}

// Replace global myLibrary and related functions
const myLibrary = new Library();

function displayLibrary() {
    const libraryDiv = document.getElementById('library');
    libraryDiv.innerHTML = '';

    myLibrary.getBooks().forEach((book) => {
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
        card.querySelector('.remove-btn').addEventListener('click', () => {
            myLibrary.removeBook(book.id);
            displayLibrary();
        });
        card.querySelector('.toggle-read-btn').addEventListener('click', () => {
            myLibrary.toggleBookReadStatus(book.id);
            displayLibrary();
        });
        libraryDiv.appendChild(card);
    });
}

// Update form submission to use the Library class
bookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(bookForm);
    const title = formData.get('title');
    const author = formData.get('author');
    const pages = Number(formData.get('pages'));
    const read = formData.get('read') === 'on';
    myLibrary.addBook(title, author, pages, read);
    displayLibrary();
    bookDialog.close();
    bookForm.reset();
});

// Add demo books using the Library class
myLibrary.addBook('1984', 'George Orwell', 328, true);
myLibrary.addBook('To Kill a Mockingbird', 'Harper Lee', 281, false);

displayLibrary();