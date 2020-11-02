//----------------------------------------------------------------------------------------------------------------------
// Constructor
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "constructor", () => {

    //------------------------------------------------------------------------------------------------------------------
    // Merges additional options
    //------------------------------------------------------------------------------------------------------------------

    testCase("Merges additional options and preserve's the base stringifier's default options", () => {

        const baseStringifierOptions = { a: 1, b: { c: 2, d: 3 } };
        const baseStringifier = new StringifierEngine([], deepClone(baseStringifierOptions));

        const stringifierOptions = { b: { d: 4, e: 5 } };
        const stringifierBuilder = new StringifierBuilder(baseStringifier, deepClone(stringifierOptions));

        assert.deepStrictEqual(stringifierBuilder.options, { a: 1, b: { c: 2, d: 4, e: 5 } });
        assert.deepStrictEqual(baseStringifier.defaultOptions, baseStringifierOptions);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// stringify...()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    // @ts-ignore
    class MyClass { }
    // @ts-ignore
    function myFunction() { }

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
        "isNotNull     ",
        "() => true    ",
    ];

    function testStringifyType(
        methodName: string,
        getSetter: internal.Supplier<StringifierBuilder<any, any>, internal.Consumer<internal.Supplier<any, any>>>,
        matchFilter: internal.Predicate<any>
    ) {

        testGroup(`${methodName}()`, () => {

            const expectedOutput = "output";
            const createBuilderAndGetHandler = () => {
                const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
                getSetter(builder).bind(builder)(() => expectedOutput);
                return builder.handlers[0];
            }

            testCase("Adds exactly one handler", () => {

                const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
                getSetter(builder).bind(builder)(() => expectedOutput);
                assert.strictEqual(builder.handlers.length, 1);
            });

            for (const valueAsString of testData.map(value => value.trim())) {

                const value = eval(valueAsString);
                const shouldApply = matchFilter(value);
                const description = shouldApply ? "accepts" : "does not accept";

                testCase(`Adds a handler that ${description} ${valueAsString}`, () => {
                    assert.strictEqual(createBuilderAndGetHandler().appliesTo(value), shouldApply);
                });
            }

            testCase("Adds the specified stringification function", () => {
                const context = new StringifierContext({}, { stringifyWithContext: () => "" });
                assert.strictEqual(createBuilderAndGetHandler().stringify("input", context), expectedOutput);
            });
        });
    }

    //------------------------------------------------------------------------------------------------------------------
    // Tests
    //------------------------------------------------------------------------------------------------------------------

    testStringifyType("stringifyBoolean", builder => builder.stringifyBoolean, value => "boolean" === typeof value);
    testStringifyType("stringifyNumber", builder => builder.stringifyNumber, value => "number" === typeof value);
    testStringifyType("stringifyString", builder => builder.stringifyString, value => "string" === typeof value);
    testStringifyType("stringifyRegExp", builder => builder.stringifyRegExp, value => value instanceof RegExp);
    testStringifyType("stringifyObject", builder => builder.stringifyObject, value => isObject(value));
    testStringifyType("stringifyFunction", builder => builder.stringifyFunction, value => "function" === typeof value);
    testStringifyType("stringifyArray", builder => builder.stringifyArray, value => Array.isArray(value));
});

//----------------------------------------------------------------------------------------------------------------------
// stringifyIf()
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "stringifyIf()", () => {

    testCase("Adds exactly one handler", () => {

        const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
        builder.stringifyIf(() => true, () => "");
        assert.strictEqual(builder.handlers.length, 1);
    });

    testCase("Adds the specified 'appliesTo' function", () => {

        const expectedAppliesTo = (value: any) => "number" === typeof value || "string" === typeof value;
        const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
        builder.stringifyIf(expectedAppliesTo, () => "");
        assert.strictEqual(builder.handlers.length, 1);
        assert.strictEqual(builder.handlers[0].appliesTo, expectedAppliesTo);
    });

    testCase("Adds the specified stringification function", () => {

        const expectedStringify = (value: any) => `<${value}>`;
        const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
        builder.stringifyIf(() => true, expectedStringify);
        assert.strictEqual(builder.handlers.length, 1);
        assert.strictEqual(builder.handlers[0].stringify, expectedStringify);
    });

    testCase("Adds multiple handlers", () => {

        const expectedHandlers = [
            { appliesTo: (value: any) => "number" === typeof value, stringify: (value: any) => `<${value}>` },
            { appliesTo: (value: any) => "function" === typeof value, stringify: (value: any) => `${value}()` }
        ];

        const builder = new StringifierBuilder(new StringifierEngine([], {}), {});
        expectedHandlers.forEach(handler => builder.stringifyIf(handler.appliesTo, handler.stringify));
        assert.deepStrictEqual(builder.handlers, expectedHandlers);
    });
});

//----------------------------------------------------------------------------------------------------------------------
// Option types
//----------------------------------------------------------------------------------------------------------------------

testGroupForFile(getCurrentFilename("__FILE__"), "misc", () => {

    testCase("Exposes combined (base and current) options in the context", () => {

        new StringifierBuilder(new StringifierEngine([], { a: 1, b: 2 }), { b: 3, c: 4 })
            .stringifyIf(() => true, (_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyBoolean((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyNumber((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyString((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyRegExp((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyObject((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            })
            .stringifyFunction((_value, context) => {
                // @ts-expect-error
                context.options.d;
                return `${context.options.a} ${context.options.b} ${context.options.c}`;
            });
    });
});
