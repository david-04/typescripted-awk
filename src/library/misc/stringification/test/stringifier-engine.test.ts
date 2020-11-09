//----------------------------------------------------------------------------------------------------------------------
// stringifyWithOptions()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "stringifyWithOptions()", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Passes data to and from the handler.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Passes the value to the handler and returns its stringified result", () => {

        const stringifier = new StringifierEngine([stringify], {});
        const expectedInput = "input";
        const expectedOutput = "output";
        let stringifyWasCalled = false;
        function stringify(actualInput: any) {
            stringifyWasCalled = true;
            assert.deepStrictEqual(actualInput, expectedInput);
            return expectedOutput;
        }

        const actualOutput = stringifier.stringifyWithOptions(expectedInput);

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Creates a context.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates a context and passes it to the handler", () => {

        const expectedOptions = { a: 1, b: { c: 2 } };
        let stringifyWasCalled = false;
        function stringify(_actualInput: any, context: internal.StringifierContext<any>) {
            assert.ok(context instanceof StringifierContext, "context is not an instance of StringifierContext");
            stringifyWasCalled = true;
            assert.deepStrictEqual(context.options, expectedOptions);
            assert.deepStrictEqual(context.currentStringifier, stringifier);
            assert.deepStrictEqual(context.currentHandlerIndex, 0);
            return "";

        }
        const stringifier = new StringifierEngine([stringify], expectedOptions);

        stringifier.stringifyWithOptions("");

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
    });

    //------------------------------------------------------------------------------------------------------------------
    // Merges options.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges the current and default options", () => {

        const defaultOptions = { a: 1, b: 2 };
        const overrideOptions = { b: 3 };
        const mergedOptions = { a: 1, b: 3 };
        const stringifier = new StringifierEngine([stringify], deepClone(defaultOptions));
        let stringifyWasCalled = false;
        function stringify(_actualInput: any, context: internal.StringifierContext<any>) {
            stringifyWasCalled = true;
            assert.deepStrictEqual(context.options, mergedOptions);
            return "";
        }

        stringifier.stringifyWithOptions("", deepClone(overrideOptions));

        assert.ok(stringifyWasCalled, "The stringify handler was not called");
        assert.deepStrictEqual(stringifier.defaultOptions, defaultOptions);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Handles PreStringifiedValue.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Returns an already PreStringifiedValue without re-rendering", () => {

        const stringifier = new StringifierEngine([], {});
        const expectedOutput = "output";

        const actualOutput = stringifier.stringifyWithOptions(preStringify(undefined).as(expectedOutput));

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Uses the first matching handler.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses the first handler that returns a string", () => {

        const input = "input";
        const expectedOutput = "output";
        const stringifier = new StringifierEngine([() => undefined, () => expectedOutput], {});

        const actualOutput = stringifier.stringifyWithOptions(input);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Requires all handlers to return a string or undefined.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Throws an exception if a handler returns neither undefined nor a string", () => {

        let threwException = false;
        try {
            new StringifierEngine([() => 1 as any], {}).stringifyWithOptions("");
        } catch (ignored) {
            threwException = true;
        };
        assert.ok(threwException, "stringifyWithOptions() did not throw an exception");
    });

    //------------------------------------------------------------------------------------------------------------------
    // Invokes the base stringifier.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Invokes the base stringifier if no handler returns a string", () => {

        const expectedOutput = "output";
        const baseStringifier = new StringifierEngine([() => expectedOutput], {});
        const stringifier = new StringifierEngine([() => undefined], {}, baseStringifier);

        const actualOutput = stringifier.stringifyWithOptions("");

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Uses JSON.stringify() if there are no handlers.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if there are no handlers", () => {

        const stringifier = new StringifierEngine([], {});
        const input = { a: 1, b: ["string"] };
        const expectedOutput = JSON.stringify(input);

        const actualOutput = stringifier.stringifyWithOptions(input);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Uses JSON.stringify() if no handler matches.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if no handler returns a string", () => {

        const stringifier = new StringifierEngine([() => undefined, () => undefined], {});
        const input = { a: 1, b: ["string"] };
        const expectedOutput = JSON.stringify(input);

        const actualOutput = stringifier.stringifyWithOptions(input);

        assert.deepStrictEqual(actualOutput, expectedOutput);
    });

    //------------------------------------------------------------------------------------------------------------------
    // Detects infinite recursions.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Detects infinite recursions amongst the handlers", () => {

        const baseStringifier = new StringifierEngine(
            [(value, context) => context.stringifyWithTopLevelStringifier(value)], {}
        );
        const stringifier = new StringifierEngine(
            [(value, context) => context.stringifyWithNextHandler(value)], {}, baseStringifier
        );

        let threwException = false;
        try {
            stringifier.stringifyWithOptions("");
        } catch (ignored) {
            threwException = true;
        }
        assert.ok(threwException, "stringifyWithOptions() did not throw an exception");
    });
});

//----------------------------------------------------------------------------------------------------------------------
// stringifyWithContext()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "stringifyWithContext()", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Starts with the handler specified by the context.
    //------------------------------------------------------------------------------------------------------------------

    testCase("Uses JSON.stringify() if no handler matches", () => {

        const firstHandlerOutput = "output 1";
        const secondHandlerOutput = "output 2";
        const stringifier = new StringifierEngine([() => firstHandlerOutput, () => secondHandlerOutput], {});
        const context = new StringifierContext<any>({}, stringifier);

        let actualOutput = stringifier.stringifyWithContext("", context);
        assert.deepStrictEqual(actualOutput, firstHandlerOutput);

        context.currentHandlerIndex = 1;
        actualOutput = stringifier.stringifyWithContext("", context);
        assert.deepStrictEqual(actualOutput, secondHandlerOutput);
    });
});
