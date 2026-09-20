import { IUser } from './interfaces/IUser';

export class User implements IUser {
    private id: string;
    private name: string;
    private email: string;
    private borrowedBooks: string[];

    constructor(name: string, email: string, id?: string) {
        this.id = id || Date.now().toString();
        this.name = name;
        this.email = email;
        this.borrowedBooks = [];
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getBorrowedBooks(): string[] {
        return this.borrowedBooks;
    }

    canBorrow(): boolean {
        return this.borrowedBooks.length < 3;
    }

    borrowBook(bookId: string): void {
        if (this.canBorrow()) {
            this.borrowedBooks.push(bookId);
        }
    }

    returnBook(bookId: string): void {
        this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId);
    }
}