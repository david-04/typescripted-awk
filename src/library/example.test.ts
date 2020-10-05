describe('Example module', () => {

    describe('sum()', () => {

        test('Adds zero numbers', () => {
            expect(sum().sum).toBe(0);
        });

        test('Adds 1 number', () => {
            expect(sum(5).sum).toBe(5);
        });

        test('Adds 2 numbers', () => {
            expect(sum(5, 3)).toEqual({ components: [5, 3], sum: 8 });
        });
    });
});
