import { createButton } from './Button';

export interface ModalOptions {
    title: string;
    message: string;
    type: 'error' | 'success' | 'info';
    withInput?: boolean;
    onConfirm?: (inputValue?: string) => void;
}

export function showModal(options: ModalOptions): void {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);

    const modal = document.createElement('div');
    modal.className = 'modal fade show d-block';
    modal.tabIndex = -1;

    let inputHtml = '';
    if (options.withInput) {
        inputHtml = `<input type="text" id="modal-input" class="form-control mt-3" placeholder="ID">`;
    }

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fs-5">${options.title}</h5>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="modal-body border-0 pt-2 pb-2">
                    <p class="mb-0">${options.message}</p>
                    ${inputHtml}
                </div>
                <div class="modal-footer border-0 pt-0">
                    ${options.withInput ? '<button type="button" class="btn btn-secondary" id="modal-cancel">Скасувати</button>' : ''}
                </div>
            </div>
        </div>
    `;

    const footer = modal.querySelector('.modal-footer') as HTMLElement;
    const confirmText = options.withInput ? 'Зберегти' : 'Зрозуміло!';
    const confirmBtn = createButton(confirmText, 'primary', 'button', () => {
        const inputVal = options.withInput
            ? (modal.querySelector('#modal-input') as HTMLInputElement).value
            : undefined;
        if (options.onConfirm) options.onConfirm(inputVal);
        closeModal();
    });
    footer.appendChild(confirmBtn);

    document.body.appendChild(modal);

    const closeModal = () => {
        modal.remove();
        backdrop.remove();
    };

    modal.querySelector('.btn-close')?.addEventListener('click', closeModal);
    modal.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
}