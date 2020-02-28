const { rules } = require('./index.js');

const tense = rules['imperative-tense'];

describe('Imperative-tense', () => {
    test('It rejects past tense', () => {
        expect(tense({subject: 'Added new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It rejects present tense', () => {
        expect(tense({subject: 'Adds new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It can handle different casing', () => {
      expect(tense({subject: 'ADDS new feature'})).toEqual(expect.arrayContaining([ false ]));
      expect(tense({subject: 'adds new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It accepts imperative tense', () => {
        expect(tense({subject: 'Add new feature'})).toEqual(expect.arrayContaining([ true ]));
        expect(tense({subject: 'Handle branch name in PRs'})).toEqual(expect.arrayContaining([ true ]));
    });

    test('It accepts past tense unless first word', () => {
        expect(tense({subject: 'Fix connection pool that ran out of sockets'})).toEqual(expect.arrayContaining([ true ]));
    });

    test('It accepts missing subject', () => {
       expect(tense({})).toEqual([true]);
    });
});
