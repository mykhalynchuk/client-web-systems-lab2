import { IBook } from './interfaces/IBook';
import { generateId } from '../utils/idGenerator';

export class Book implements IBook {
    private id: string;
    private title: string;
    private author: string;
    private year: number;
    private borrowed: boolean;
    private borrowedBy?: string;

    constructor(title: string, author: string, year: number, id?: string) {
        this.id = id || generateId();
        this.title = title;
        this.author = author;
        this.year = year;
        this.borrowed = false;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getAuthor(): string {
        return this.author;
    }

    getYear(): number {
        return this.year;
    }

    isBorrowed(): boolean {
        return this.borrowed;
    }

    getBorrowedBy(): string | undefined {
        return this.borrowedBy;
    }

    borrow(userId: string): void {
        this.borrowed = true;
        this.borrowedBy = userId;
    }

    returnBook(): void {
        this.borrowed = false;
        this.borrowedBy = undefined;
    }
}