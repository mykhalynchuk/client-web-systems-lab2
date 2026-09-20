export class Library<T extends { getId(): string }> {
    private items: T[] = [];

    constructor(initialItems: T[] = []) {
        this.items = initialItems;
    }

    add(item: T): void {
        this.items.push(item);
    }

    remove(id: string): void {
        this.items = this.items.filter((item) => item.getId() !== id);
    }

    findById(id: string): T | undefined {
        return this.items.find((item) => item.getId() === id);
    }

    search(predicate: (item: T) => boolean): T[] {
        return this.items.filter(predicate);
    }

    getAll(): T[] {
        return this.items;
    }
}