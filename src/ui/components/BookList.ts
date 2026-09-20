import { Book } from '../../models/Book';
import { createButton } from './Button';

export function renderBookList(
    container: HTMLElement,
    books: Book[],
    onBorrow: (bookId: string) => void,
    onReturn: (bookId: string) => void
): void {
    const listContainer = document.createElement('div');
    listContainer.className = 'mb-5';

    const header = document.createElement('h4');
    header.className = 'mb-3 fw-bold';
    header.textContent = 'Список Книг';
    listContainer.appendChild(header);

    const card = document.createElement('div');
    card.className = 'card';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    books.forEach((book) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
        li.textContent = `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})`;

        const isBorrowed = book.isBorrowed();
        const btn = createButton(
            isBorrowed ? 'Повернути' : 'Позичити',
            isBorrowed ? 'secondary' : 'primary',
            'button',
            () => (isBorrowed ? onReturn(book.getId()) : onBorrow(book.getId()))
        );

        li.appendChild(btn);
        ul.appendChild(li);
    });

    if (books.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'list-group-item text-muted text-center py-3';
        emptyState.textContent = 'Книг поки немає';
        ul.appendChild(emptyState);
    }

    card.appendChild(ul);
    listContainer.appendChild(card);
    container.appendChild(listContainer);
}