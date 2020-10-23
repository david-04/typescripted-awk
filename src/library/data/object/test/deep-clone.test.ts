testGroupForFile("__FILE__", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class MyNestedClass {
        public constructor(public value: { a: number }) { }
    }

    class MyClass {
        public constructor(public nested: MyNestedClass) { }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Objects
    //------------------------------------------------------------------------------------------------------------------

    testCase("Clones objects recursively", () => {

        const input = { a: 1, b: { c: 2, d: 3 } };
        const expectedOutput = JSON.parse(JSON.stringify(input));

        const actualOutput = deepClone(input);

        input.a *= 10;
        input.b.c *= 10;
        input.b.d *= 10;
        input.b = { c: 100, d: 300 };

        nodeModules.assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Arrays
    //------------------------------------------------------------------------------------------------------------------

    testCase("Clones arrays recursively", () => {

        const input = [[1, 2], [3, 4]];
        const expectedOutput = JSON.parse(JSON.stringify(input));

        const actualOutput = deepClone(input);

        input[0][0] *= 10;
        input[0][1] *= 10;
        input[0] = [100, 200];
        input[1][0] *= 10;
        input[1][1] *= 10;
        input[1] = [300, 400];

        nodeModules.assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Classes
    //------------------------------------------------------------------------------------------------------------------

    testCase("Clones classes recursively", () => {

        const input = new MyClass(new MyNestedClass({ a: 1 }));
        const expectedOutput = new MyClass(new MyNestedClass({ a: 1 }));

        const actualOutput = deepClone(input);

        input.nested.value.a *= 10;
        input.nested = new MyNestedClass({ a: 200 });

        nodeModules.assert.deepStrictEqual(actualOutput, expectedOutput);
        nodeModules.assert.ok(actualOutput instanceof MyClass, "The clone is not an instance of MyClass");
        nodeModules.assert.ok(
            actualOutput.nested instanceof MyNestedClass,
            "The clone does not contain an instance of MyNestedClass"
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // Circular nesting
    //------------------------------------------------------------------------------------------------------------------

    testCase("Handles circular nesting", () => {

        const createCircularObject = () => {
            const result: any = { a: 1, b: { c: null } };
            result.b.c = result;
            return result;
        };

        const input = createCircularObject();
        const expectedOutput = createCircularObject();

        const actualOutput = deepClone(input);

        input.a *= 2;

        nodeModules.assert.deepStrictEqual(actualOutput, expectedOutput);
        nodeModules.assert.deepStrictEqual(actualOutput.b.c.a, expectedOutput.b.c.a);
    });
});
