const { rules } = require('./index.js');

const tense = rules['imperative-tense'];

describe('Imperative-tense', () => {
    test('It rejects past tense', () => {
        expect(tense({subject: 'feat: Added new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It rejects present tense', () => {
        expect(tense({subject: 'feat: Adds new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It can handle different casing', () => {
      expect(tense({subject: 'feat: ADDS new feature'})).toEqual(expect.arrayContaining([ false ]));
      expect(tense({subject: 'feat: adds new feature'})).toEqual(expect.arrayContaining([ false ]));
    });

    test('It accepts imperative tense', () => {
        expect(tense({subject: 'feat: Add new feature'})).toEqual(expect.arrayContaining([ true ]));
    });

    test('It accepts missing subject', () => {
       expect(tense({})).toEqual([true]);
    });
});
