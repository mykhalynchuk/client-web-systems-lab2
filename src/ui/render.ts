import { Book } from '../models/Book';
import { User } from '../models/User';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { renderBookFormBuilder } from './components/BookForm';
import { renderUserForm } from './components/UserForm';
import { renderBookList } from './components/BookList';
import { showModal } from './components/Modal';

export class AppRenderer {
    private bookLibrary: Library<Book>;
    private userLibrary: Library<User>;
    private appContainer: HTMLElement;

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
            this.renderLayout();
        });

        const userFormContainer = document.createElement('div');
        this.appContainer.appendChild(userFormContainer);

        renderUserForm(userFormContainer, (user) => {
            this.userLibrary.add(user);
            this.saveData();
            this.renderLayout();
        });

        const listContainer = document.createElement('div');
        this.appContainer.appendChild(listContainer);

        renderBookList(
            listContainer,
            this.bookLibrary.getAll(),
            (bookId) => this.handleBorrow(bookId),
            (bookId) => this.handleReturn(bookId)
        );
    }

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
                    showModal({ title: 'Помилка', message: 'Користувача не знайдено', type: 'error' });
                    return;
                }

                if (!user.canBorrow()) {
                    showModal({
                        title: 'Ліміт перевищено',
                        message: 'Користувач вже позичив 3 книги.',
                        type: 'error'
                    });
                    return;
                }

                const book = this.bookLibrary.findById(bookId);
                if (book) {
                    book.borrow(userId);
                    user.borrowBook(bookId);
                    this.saveData();
                    this.renderLayout();

                    showModal({
                        title: 'Успіх',
                        message: `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been borrowed by ${user.getId()} ${user.getName()} (${user.getEmail()}).`,
                        type: 'success'
                    });
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

            showModal({
                title: 'Повернено',
                message: `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()}) has been returned.`,
                type: 'success'
            });
        }
    }

    private saveData(): void {
        Storage.save('books', this.bookLibrary.getAll());
        Storage.save('users', this.userLibrary.getAll());
    }
}