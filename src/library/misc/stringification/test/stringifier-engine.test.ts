//----------------------------------------------------------------------------------------------------------------------
// stringifyWithOptions()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile("__FILE__", "stringifyWithOptions()", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Passes data to and from the handler.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Passes the value to the handler and returns its stringified result", () => {

        const stringifier = new StringifierEngine([{ appliesTo: () => true, stringify }], {});
        const expectedInput = "input";
        const expectedOutput = "output";
        let stringifyWasCalled = false;
        function stringify(actualInput: any) {
            stringifyWasCalled = true;
            assert.deepStrictEqual(actualInput, expectedInput);
            return expectedOutput;
        }

        const actualOutput = stringifier.stringifyWithOptions(expectedInput, {});

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Creates a context.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates a context and passes it to the handler", () => {

        const expectedOptions = { a: 1, b: { c: 2 } };
        const stringifier = new StringifierEngine([{ appliesTo: () => true, stringify }], expectedOptions);
        let stringifyWasCalled = false;
        function stringify(_actualInput: any, context: StringifierContext<any>) {
            stringifyWasCalled = true;
            assert.deepStrictEqual(context.options, expectedOptions);
            assert.deepStrictEqual(context.currentStringifier, stringifier);
            assert.deepStrictEqual(context.currentHandlerIndex, 0);
            return "";
        }

        stringifier.stringifyWithOptions("", {});

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
    });

    //------------------------------------------------------------------------------------------------------------------
    // Merges options.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges the current and default options", () => {

        const defaultOptions = { a: 1, b: 2 };
        const overrideOptions = { b: 3 };
        const mergedOptions = { a: 1, b: 3 };
        const stringifier = new StringifierEngine([{ appliesTo: () => true, stringify }], deepClone(defaultOptions));
        let stringifyWasCalled = false;
        function stringify(_actualInput: any, context: StringifierContext<any>) {
            stringifyWasCalled = true;
            assert.deepStrictEqual(context.options, mergedOptions);
            return "";
        }

        stringifier.stringifyWithOptions("", deepClone(overrideOptions));

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
        assert.deepStrictEqual(stringifier.defaultOptions, defaultOptions);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Handles StringifiedValue.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Returns an already StringifiedValue without re-rendering", () => {

        const stringifier = new StringifierEngine([], {});
        const expectedOutput = "output";

        const actualOutput = stringifier.stringifyWithOptions(preStringify(undefined).as(expectedOutput), {});

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });


    //------------------------------------------------------------------------------------------------------------------
    // Uses the first matching handler.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses the first handler that matches", () => {

        const input = "input";
        const expectedOutput = "output";
        const stringifier = new StringifierEngine(
            [
                { appliesTo: value => typeof value !== typeof input, stringify: () => "" },
                { appliesTo: value => typeof value === typeof input, stringify: () => expectedOutput },
            ],
            {}
        );

        const actualOutput = stringifier.stringifyWithOptions(input, {});

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Invokes the base stringifier.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses the first handler that matches", () => {

        const expectedOutput = "output";
        const baseStringifier = new StringifierEngine(
            [{ appliesTo: () => true, stringify: () => expectedOutput }], {}
        );
        const stringifier = new StringifierEngine(
            [{ appliesTo: () => false, stringify: () => "" }], {}, baseStringifier as StringifierEngine<any, any>
        );

        const actualOutput = stringifier.stringifyWithOptions("", {});

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Uses JSON.stringify() if there are no handlers.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if there are no handlers", () => {

        const stringifier = new StringifierEngine([], {});
        const input = { a: 1, b: ["string"] };
        const expectedOutput = JSON.stringify(input);

        const actualOutput = stringifier.stringifyWithOptions(input, {});

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Uses JSON.stringify() if no handler matches.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if no handler matches", () => {

        const stringifier = new StringifierEngine(
            [
                { appliesTo: () => false, stringify: () => "" },
                { appliesTo: () => false, stringify: () => "" }
            ],
            {}
        );
        const input = { a: 1, b: ["string"] };
        const expectedOutput = JSON.stringify(input);

        const actualOutput = stringifier.stringifyWithOptions(input, {});

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Detects infinite recursions.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Detects infinite recursions", () => {

        const baseStringifier = new StringifierEngine(
            [{ appliesTo: () => true, stringify: (value, context) => context.stringifyWithTopLevelStringifier(value) }],
            {}
        );

        const stringifier = new StringifierEngine(
            [{ appliesTo: () => true, stringify: (value, context) => context.stringifyWithNextHandler(value) }],
            {},
            baseStringifier
        );

        try {
            stringifier.stringifyWithOptions("", {});
            throw new Error("stringify() did not throw an exception");
        } catch (ignored) { }
    });
});

//----------------------------------------------------------------------------------------------------------------------
// stringifyWithContext()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile("__FILE__", "stringifyWithContext()", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Starts with the handler specified by the context.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if no handler matches", () => {

        const firstHandlerOutput = "output 1";
        const secondHandlerOutput = "output 2";
        const stringifier = new StringifierEngine(
            [
                { appliesTo: () => true, stringify: () => firstHandlerOutput },
                { appliesTo: () => true, stringify: () => secondHandlerOutput }
            ],
            {}
        );
        const context = new StringifierContext<any>({}, stringifier);

        let actualOutput = stringifier.stringifyWithContext("", context);
        assert.deepStrictEqual(actualOutput, firstHandlerOutput);

        context.currentHandlerIndex = 1;
        actualOutput = stringifier.stringifyWithContext("", context);
        assert.deepStrictEqual(actualOutput, secondHandlerOutput);
    });
});
