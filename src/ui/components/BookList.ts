import { Book } from '../../models/Book';
import { createButton } from './Button';

export function renderBookList(
    container: HTMLElement,
    books: Book[],
    currentPage: number,
    itemsPerPage: number,
    onPageChange: (page: number) => void,
    onBorrow: (bookId: string) => void,
    onReturn: (bookId: string) => void,
    onDelete: (bookId: string) => void
): void {
    const listContainer = document.createElement('div');
    listContainer.className = 'mb-5';

    const header = document.createElement('h4');
    header.className = 'mb-3 fw-bold';
    header.textContent = 'Список Книг';
    listContainer.appendChild(header);

    const card = document.createElement('div');
    card.className = 'card p-3';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    // Логіка пагінації
    const totalPages = Math.ceil(books.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedBooks = books.slice(startIndex, startIndex + itemsPerPage);

    paginatedBooks.forEach((book) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3 px-0';
        li.textContent = `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})`;

        const actionsDiv = document.createElement('div');

        const isBorrowed = book.isBorrowed();
        const borrowBtn = createButton(
            isBorrowed ? 'Повернути' : 'Позичити',
            isBorrowed ? 'secondary' : 'primary',
            'button',
            () => (isBorrowed ? onReturn(book.getId()) : onBorrow(book.getId()))
        );
        borrowBtn.classList.add('me-2');

        const deleteBtn = createButton('Видалити', 'danger', 'button', () => onDelete(book.getId()));

        actionsDiv.append(borrowBtn, deleteBtn);
        li.appendChild(actionsDiv);
        ul.appendChild(li);
    });

    if (books.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'list-group-item text-muted text-center py-3';
        emptyState.textContent = 'Книг поки немає';
        ul.appendChild(emptyState);
    }

    card.appendChild(ul);

    // Блок кнопок пагінації
    if (totalPages > 1) {
        const pagination = document.createElement('div');
        pagination.className = 'd-flex justify-content-center mt-4 align-items-center';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-outline-secondary btn-sm me-3';
        prevBtn.textContent = 'Попередня';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => onPageChange(currentPage - 1);

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Сторінка ${currentPage} з ${totalPages}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-outline-secondary btn-sm ms-3';
        nextBtn.textContent = 'Наступна';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => onPageChange(currentPage + 1);

        pagination.append(prevBtn, pageInfo, nextBtn);
        card.appendChild(pagination);
    }

    listContainer.appendChild(card);
    container.appendChild(listContainer);
}