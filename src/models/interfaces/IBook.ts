export interface IBook {
    getId(): string;
    getTitle(): string;
    getAuthor(): string;
    getYear(): number;
    isBorrowed(): boolean;
    getBorrowedBy(): string | undefined;
    borrow(userId: string): void;
    returnBook(): void;
}