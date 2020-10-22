testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Test setup
    //------------------------------------------------------------------------------------------------------------------

    // @ts-ignore
    function myFunction() { }
    // @ts-ignore
    class MyClass { }

    const testData = [
        "undefined     ",
        "null          ",
        "true          ",
        "false         ",
        "-1            ",
        "0             ",
        "1.5           ",
        "NaN           ",
        "-Infinity     ",
        "Infinity      ",
        "''            ",
        "' '           ",
        "'x'           ",
        "[]            ",
        "[1, 2]        ",
        "[undefined]   ",
        "{}            ",
        "{ a: 1 }      ",
        "new MyClass() ",
        "/[0-9]+/      ",
        "myFunction    ",
        "() => true    ",
    ];

    function test(
        functionName: string,
        testRunner: internal.Predicate1<any>,
        expectedResultSupplier: internal.Predicate1<any>
    ) {
        for (const valueAsString of testData.map(value => value.trim())) {
            const value = eval(valueAsString);
            const expectedResult = expectedResultSupplier(value);
            testCase(`${functionName}(${valueAsString}) returns ${expectedResult}`, () => {
                nodeModules.assert.strictEqual(testRunner(value), expectedResult);
            });
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Tests
    //------------------------------------------------------------------------------------------------------------------

    test("isNotNull", isNotNull, value => null !== value && undefined !== value);
    test("isBoolean", isBoolean, value => true === value || false === value);
    test("isNumber", isNumber, value => null !== value && undefined !== value && "number" === typeof value);
    test("isString", isString, value => null !== value && undefined !== value && "string" === typeof value);
    test("isObject", isObject, value => null !== value && undefined !== value && "object" === typeof value);
    test("isArray", isArray, value => null !== value && undefined !== value && Array.isArray(value));
});
