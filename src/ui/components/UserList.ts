import { User } from '../../models/User';
import { createButton } from './Button';

export function renderUserList(
    container: HTMLElement,
    users: User[],
    onDelete: (userId: string) => void
): void {
    const listContainer = document.createElement('div');
    listContainer.className = 'mb-5';

    const header = document.createElement('h4');
    header.className = 'mb-3 fw-bold';
    header.textContent = 'Список Користувачів';
    listContainer.appendChild(header);

    const card = document.createElement('div');
    card.className = 'card';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    users.forEach((user) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
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
    listContainer.appendChild(card);
    container.appendChild(listContainer);
}