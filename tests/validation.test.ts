import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Unit Tests', () => {
    it('isRequired should return true for non-empty strings', () => {
        expect(Validation.isRequired('Hello')).to.be.true;
        expect(Validation.isRequired('   Test   ')).to.be.true;
    });

    it('isRequired should return false for empty strings', () => {
        expect(Validation.isRequired('')).to.be.false;
        expect(Validation.isRequired('   ')).to.be.false;
    });

    it('isYear should validate 4-digit years correctly', () => {
        expect(Validation.isYear('2024')).to.be.true;
        expect(Validation.isYear('1999')).to.be.true;
        expect(Validation.isYear('24')).to.be.false;
        expect(Validation.isYear('20245')).to.be.false;
        expect(Validation.isYear('abcd')).to.be.false;
    });

    it('isUserId should validate only digits', () => {
        expect(Validation.isUserId('123456')).to.be.true;
        expect(Validation.isUserId('0')).to.be.true;
        expect(Validation.isUserId('123a45')).to.be.false;
        expect(Validation.isUserId('user123')).to.be.false;
    });
});