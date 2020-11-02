testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Objects
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges nested objects", () => {

        const base = { a: true, b: { c: "x", d: 3 } };
        const overlay = { b: { d: 4 } };
        const expectedOutput = { a: true, b: { c: "x", d: 4 } };

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Undefined properties
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges properties that are set to undefined", () => {

        const base = { a: 1 };
        const overlay = { a: undefined };
        const expectedOutput = { a: undefined };

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Arrays
    //------------------------------------------------------------------------------------------------------------------

    testCase("Does not merge arrays", () => {

        const base = { a: [1, 2, 3, 4, 5] };
        const overlay = { a: [10, 11] };
        const expectedOutput = { a: [10, 11] };

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Instances of the same class
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges instances of the same class", () => {

        class MyClass {
            constructor(public a: number, public b?: string) { }
        }

        const base = new MyClass(1, "a");
        const overlay = new MyClass(3);
        const expectedOutput = new MyClass(3);

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
        assert.ok(actualOutput instanceof MyClass, "The merged result is not an instance of MyClass");

    });

    //------------------------------------------------------------------------------------------------------------------
    // Instances of different classes
    //------------------------------------------------------------------------------------------------------------------

    testCase("Does not merge instances of different classes", () => {

        class MyClass {
            constructor(public a?: number) { }
        }

        class MySubClass extends MyClass {
            constructor(a?: number) {
                super(a);
            }
        }

        const base = new MyClass(1);
        const overlay = new MySubClass();
        const expectedOutput = new MySubClass();

        const actualOutput = deepMerge(base, overlay);

        assert.ok(actualOutput instanceof MySubClass, "The merged result is not an instance of MySubClass");
        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Regular expressions
    //------------------------------------------------------------------------------------------------------------------

    testCase("Does not merge regular expressions", () => {

        const base = { a: /abc/ };
        const overlay = { a: /xyz/i };
        const expectedOutput = { a: /xyz/i };

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Circular references
    //------------------------------------------------------------------------------------------------------------------

    testCase("Handles circular references", () => {

        const base = { a: { b: new Array<any>() } };
        base.a.b.push(base);

        const overlay = { x: { y: new Array<any>() } };
        overlay.x.y.push(overlay);

        const expectedOutput = { a: { b: new Array<any>() }, x: { y: new Array<any>() } };
        expectedOutput.a.b.push(expectedOutput);
        expectedOutput.x.y.push({ x: expectedOutput.x });

        const actualOutput = deepMerge(base, overlay);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });
});
