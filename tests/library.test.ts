import { expect } from 'chai';
import { Library } from '../src/services/Library';

class DummyItem {
    constructor(private id: string, public name: string) {}
    getId(): string {
        return this.id;
    }
}

describe('Library<T> Generic Class Tests', () => {
    let library: Library<DummyItem>;

    beforeEach(() => {
        library = new Library<DummyItem>();
    });

    it('should add an item to the library', () => {
        library.add(new DummyItem('1', 'Test Book'));
        expect(library.getAll().length).to.equal(1);
        expect(library.getAll()[0].name).to.equal('Test Book');
    });

    it('should find an item by ID', () => {
        library.add(new DummyItem('1', 'Test Book 1'));
        library.add(new DummyItem('2', 'Test Book 2'));

        const found = library.findById('2');
        expect(found).to.not.be.undefined;
        expect(found?.name).to.equal('Test Book 2');
    });

    it('should return undefined if item is not found', () => {
        const found = library.findById('999');
        expect(found).to.be.undefined;
    });

    it('should remove an item by ID', () => {
        library.add(new DummyItem('1', 'Test Book 1'));
        library.add(new DummyItem('2', 'Test Book 2'));

        library.remove('1');
        expect(library.getAll().length).to.equal(1);
        expect(library.findById('1')).to.be.undefined;
    });

    it('should correctly search items using a predicate', () => {
        library.add(new DummyItem('1', 'Apple'));
        library.add(new DummyItem('2', 'Banana'));
        library.add(new DummyItem('3', 'Apricot'));

        const results = library.search((item) => item.name.startsWith('A'));
        expect(results.length).to.equal(2);
        expect(results[0].name).to.equal('Apple');
        expect(results[1].name).to.equal('Apricot');
    });
});