export namespace Validation {
    export function isRequired(value: string): boolean {
        return value.trim().length > 0;
    }

    export function isYear(value: string): boolean {
        return /^\d{4}$/.test(value.trim());
    }

    export function isUserId(value: string): boolean {
        return /^\d+$/.test(value.trim());
    }

    export function validateBookForm(data: Record<string, string>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!isRequired(data.title)) errors.push('Назва книги є обов\'язковою.');
        if (!isRequired(data.author)) errors.push('Автор є обов\'язковим.');

        if (!isRequired(data.year)) {
            errors.push('Рік видання є обов\'язковим.');
        } else if (!isYear(data.year)) {
            errors.push('Рік видання має містити 4 цифри.');
        }

        return { isValid: errors.length === 0, errors };
    }

    export function validateUserForm(data: Record<string, string>): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!isRequired(data.name)) errors.push('Ім\'я є обов\'язковим.');
        if (!isRequired(data.email)) errors.push('Email є обов\'язковим.');

        return { isValid: errors.length === 0, errors };
    }
}