import { showModal } from '../ui/components/Modal';

export class NotificationService {
    static notifySuccess(message: string, title: string = 'Успіх'): void {
        showModal({ title, message, type: 'success' });
    }

    static notifyError(message: string, title: string = 'Помилка'): void {
        showModal({ title, message, type: 'error' });
    }

    static notifyInfo(message: string, title: string = 'Інформація'): void {
        showModal({ title, message, type: 'info' });
    }
}