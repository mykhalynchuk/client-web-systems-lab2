import { User } from '../../models/User';
import { createButton } from './Button';

export function renderUserList(
    container: HTMLElement,
    users: User[],
    currentPage: number,
    itemsPerPage: number,
    onPageChange: (page: number) => void,
    onDelete: (userId: string) => void
): void {
    const listContainer = document.createElement('div');
    listContainer.className = 'mb-5';

    const header = document.createElement('h4');
    header.className = 'mb-3 fw-bold';
    header.textContent = 'Список Користувачів';
    listContainer.appendChild(header);

    const card = document.createElement('div');
    card.className = 'card p-3';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    const totalPages = Math.ceil(users.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

    paginatedUsers.forEach((user) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3 px-0';
        li.textContent = `${user.getId()} ${user.getName()} (${user.getEmail()})`;

        const deleteBtn = createButton('Видалити', 'danger', 'button', () => onDelete(user.getId()));

        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });

    if (users.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'list-group-item text-muted text-center py-3';
        emptyState.textContent = 'Користувачів поки немає';
        ul.appendChild(emptyState);
    }

    card.appendChild(ul);

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