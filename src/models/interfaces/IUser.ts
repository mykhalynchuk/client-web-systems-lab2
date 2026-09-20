export interface IUser {
    getId(): string;
    getName(): string;
    getEmail(): string;
    getBorrowedBooks(): string[];
    canBorrow(): boolean;
    borrowBook(bookId: string): void;
    returnBook(bookId: string): void;
}