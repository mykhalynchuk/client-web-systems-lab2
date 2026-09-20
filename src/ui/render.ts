import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { NotificationService } from '../services/NotificationService';
import { renderBookFormBuilder } from './components/BookForm';
import { renderUserForm } from './components/UserForm';
import { renderBookList } from './components/BookList';
import { renderUserList } from './components/UserList';
import { showModal } from './components/Modal';

export class AppRenderer {
    private bookLibrary: Library<Book>;
    private userLibrary: Library<User>;
    private appContainer: HTMLElement;
    private searchQuery: string = '';

    constructor() {
        const savedBooks = Storage.load<any>('books') || [];
        const savedUsers = Storage.load<any>('users') || [];

        this.bookLibrary = new Library<Book>(
            savedBooks.map((b: any) => {
                const book = new Book(b.title, b.author, b.year, b.id);
                if (b.borrowed) book.borrow(b.borrowedBy);
                return book;
            })
        );

        this.userLibrary = new Library<User>(
            savedUsers.map((u: any) => {
                const user = new User(u.name, u.email, u.id);
                u.borrowedBooks.forEach((id: string) => user.borrowBook(id));
                return user;
            })
        );

        this.appContainer = document.getElementById('app') as HTMLElement;
    }

    init(): void {
        this.appContainer.className = 'container py-4';
        this.appContainer.style.maxWidth = '900px';
        this.renderLayout();
    }

    private renderLayout(): void {
        this.appContainer.innerHTML = '';

        const title = document.createElement('h2');
        title.className = 'text-center mb-5 fw-bold';
        title.textContent = 'Система Управління Бібліотекою';
        this.appContainer.appendChild(title);

        const formTitle = document.createElement('h4');
        formTitle.className = 'mb-3 fw-bold';
        formTitle.textContent = 'Додати Книгу';

        const bookFormContainer = document.createElement('div');
        bookFormContainer.appendChild(formTitle);
        this.appContainer.appendChild(bookFormContainer);

        renderBookFormBuilder(bookFormContainer, (book) => {
            this.bookLibrary.add(book);
            this.saveData();
            NotificationService.notifySuccess(`Книгу "${book.getTitle()}" додано.`);
            this.renderLayout();
        });

        const userFormContainer = document.createElement('div');
        this.appContainer.appendChild(userFormContainer);

        renderUserForm(userFormContainer, (user) => {
            this.userLibrary.add(user);
            this.saveData();
            NotificationService.notifySuccess(`Користувача "${user.getName()}" додано.`);
            this.renderLayout();
        });

        // Пошук
        this.renderSearchBlock();

        const listContainer = document.createElement('div');
        this.appContainer.appendChild(listContainer);

        let displayBooks = this.bookLibrary.getAll();
        if (this.searchQuery) {
            const lowerQuery = this.searchQuery.toLowerCase();
            displayBooks = this.bookLibrary.search(
                book => book.getTitle().toLowerCase().includes(lowerQuery) ||
                    book.getAuthor().toLowerCase().includes(lowerQuery)
            );
        }

        renderBookList(
            listContainer,
            displayBooks,
            (bookId) => this.handleBorrow(bookId),
            (bookId) => this.handleReturn(bookId),
            (bookId) => this.handleDeleteBook(bookId)
        );

        const userListContainer = document.createElement('div');
        this.appContainer.appendChild(userListContainer);
        renderUserList(
            userListContainer,
            this.userLibrary.getAll(),
            (userId) => this.handleDeleteUser(userId)
        );
    }

    private renderSearchBlock(): void {
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'mb-4';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control';
        searchInput.placeholder = 'Пошук книг за назвою або автором...';
        searchInput.value = this.searchQuery;

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = (e.target as HTMLInputElement).value;
            // Перемальовуємо тільки потрібні частини, але для простоти перемалюємо все
            this.renderLayout();
            // Повертаємо фокус на поле після перемалювання
            const newSearchInput = this.appContainer.querySelector('input[placeholder="Пошук книг за назвою або автором..."]') as HTMLInputElement;
            if (newSearchInput) {
                newSearchInput.focus();
                // Ставимо курсор в кінець тексту
                const val = newSearchInput.value;
                newSearchInput.value = '';
                newSearchInput.value = val;
            }
        });

        searchWrapper.appendChild(searchInput);
        this.appContainer.appendChild(searchWrapper);
    }

    private handleDeleteBook(bookId: string): void {
        const book = this.bookLibrary.findById(bookId);
        if (!book) return;

        if (book.isBorrowed()) {
            NotificationService.notifyError('Неможливо видалити позичену книгу. Спочатку поверніть її.');
            return;
        }

        this.bookLibrary.remove(bookId);
        this.saveData();
        NotificationService.notifySuccess(`Книгу видалено.`);
        this.renderLayout();
    }

    private handleDeleteUser(userId: string): void {
        const user = this.userLibrary.findById(userId);
        if (!user) return;

        if (user.getBorrowedBooks().length > 0) {
            NotificationService.notifyError('Неможливо видалити користувача, який має позичені книги.');
            return;
        }

        this.userLibrary.remove(userId);
        this.saveData();
        NotificationService.notifySuccess(`Користувача видалено.`);
        this.renderLayout();
    }

    // ... (код методів handleBorrow, handleReturn, saveData залишається без змін, такий як був у попередньому файлі)
    private handleBorrow(bookId: string): void {
        showModal({
            title: 'Введіть ID користувача для позичення книги:',
            message: '',
            type: 'info',
            withInput: true,
            onConfirm: (userId) => {
                if (!userId) return;

                const user = this.userLibrary.findById(userId);
                if (!user) {
                    NotificationService.notifyError('Користувача не знайдено');
                    return;
                }

                if (!user.canBorrow()) {
                    NotificationService.notifyError('Користувач вже позичив 3 книги. Ліміт перевищено.');
                    return;
                }

                const book = this.bookLibrary.findById(bookId);
                if (book) {
                    book.borrow(userId);
                    user.borrowBook(bookId);
                    this.saveData();
                    this.renderLayout();

                    NotificationService.notifySuccess(
                        `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been borrowed by ${user.getId()} ${user.getName()} (${user.getEmail()}).`
                    );
                }
            }
        });
    }

    private handleReturn(bookId: string): void {
        const book = this.bookLibrary.findById(bookId);
        if (book) {
            const userId = book.getBorrowedBy();
            if (userId) {
                const user = this.userLibrary.findById(userId);
                if (user) user.returnBook(bookId);
            }
            book.returnBook();
            this.saveData();
            this.renderLayout();

            NotificationService.notifySuccess(
                `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been returned.`
            );
        }
    }

    private saveData(): void {
        Storage.save('books', this.bookLibrary.getAll());
        Storage.save('users', this.userLibrary.getAll());
    }
}