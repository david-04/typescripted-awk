testGroup('__FILE__', () => {

    //------------------------------------------------------------------------------------------------------------------
    // Test setup
    //------------------------------------------------------------------------------------------------------------------

    function myFunction() { }
    class MyClass { }

    const testData: Array<[any] | [any, string]> = [
        [undefined, 'undefined'],
        [null, 'null'],
        [true],
        [false],
        [-1],
        [0],
        [1.5],
        [NaN, 'NaN'],
        [-Infinity, '-Infinity'],
        [Infinity, 'Infinity'],
        ['', `''`],
        [' ', `' '`],
        ['x', `'x'`],
        [[], `[]`],
        [[1, 2], `[1, 2]`],
        [[undefined], `[undefined]`],
        [{}, `{}`],
        [{ a: 1 }, `{ a: 1 }`],
        [new MyClass(), `new MyClass`],
        [/[0-9]+/, `/[0-9]+/`],
        [myFunction, `myFunction`],
        [() => true, `() => true`],
    ];

    function test(
        functionName: string,
        testRunner: internal.Predicate1<any>,
        expectedResultSupplier: internal.Predicate1<any>
    ) {
        for (const array of testData) {
            const value = array[0];
            const valueString = array[1] ?? JSON.stringify(value[0]);
            const expectedResult = expectedResultSupplier(value);
            testCase(`${functionName}(${valueString}) returns ${expectedResult}`, () => {
                nodeModules.assert.strictEqual(testRunner(value), expectedResult);
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Tests
    //------------------------------------------------------------------------------------------------------------------

    test('isNotNull', isNotNull, value => null !== value && undefined !== value);
    test('isBoolean', isBoolean, value => true === value || false === value);
    test('isNumber', isNumber, value => null !== value && undefined !== value && 'number' === typeof value);
    test('isString', isString, value => null !== value && undefined !== value && 'string' === typeof value);
    test('isObject', isObject, value => null !== value && undefined !== value && 'object' === typeof value);
    test('isArray', isArray, value => null !== value && undefined !== value && Array.isArray(value));
});
