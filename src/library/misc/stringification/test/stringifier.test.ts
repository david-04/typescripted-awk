testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Default options
    //------------------------------------------------------------------------------------------------------------------

    const defaultOptions: DefaultStringifierOptions = {
        breakLines: true,
        indent: "    ",
        quotePropertyNames: "auto",
        quotes: "auto"
    };

    function options(): DefaultStringifierOptions;
    function options<T>(options: Partial<DefaultStringifierOptions> & T): DefaultStringifierOptions & T;
    function options<T>(options?: Partial<DefaultStringifierOptions> & T) {
        return { ...defaultOptions, ...options };
    }

    //------------------------------------------------------------------------------------------------------------------
    // stringifier(value)
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier(value) returns the stringified representation", () => {

        const expectedResult = "stringified-number";
        const handler = { appliesTo: isNumber, stringify: () => expectedResult };
        const stringifierEngine = new StringifierEngine([handler], options());

        const stringify = createStringifier(stringifierEngine);

        assert.strictEqual(stringify(1), expectedResult);
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifier(value, options)
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier(value, options) applies the provided options", () => {

        const stringify = createStringifier(new StringifierEngine(
            [{ appliesTo: isNumber, stringify: (_value, context) => context.options.indent }], options()
        ));

        assert.strictEqual(stringify(1, { indent: "..." }), "...");
        assert.strictEqual(stringify(1, { indent: "\t" }), "\t");
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifier.createExtendedStringifier(options)
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier.createExtendedStringifier(options) registers the options", () => {

        const stringifier = createStringifier(new StringifierEngine(
            [{ appliesTo: isNumber, stringify: (_value, context) => context.options.indent }],
            options({ indent: "indent.base" })
        ));

        assert.strictEqual(stringifier.createExtendedStringifier({ indent: "..." })(1), "...");
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringify.createExtendedStringifier(callback)
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier.createExtendedStringifier(callback) registers the handlers", () => {

        const expectedNumberResult = "stringified-number";
        const baseHandler = { appliesTo: isNumber, stringify: () => expectedNumberResult };
        const baseStringifier = new StringifierEngine([baseHandler], options());

        const stringifyBase = createStringifier(baseStringifier);

        const expectedStringResult = "stringified-string";
        const extendedHandler = { appliesTo: isString, stringify: () => expectedStringResult };

        const stringifyExtended = stringifyBase.createExtendedStringifier(builder =>
            builder.stringifyIf(extendedHandler.appliesTo, extendedHandler.stringify)
        );

        assert.strictEqual(stringifyExtended(123), expectedNumberResult);
        assert.strictEqual(stringifyExtended("a"), expectedStringResult);
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifier.createExtendedStringifier(options, builder)
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier.createExtendedStringifier(options, builder) registers the options and handlers", () => {

        const expectedNumberResult = "stringified-number";
        const baseHandler = { appliesTo: isNumber, stringify: () => expectedNumberResult };
        const baseStringifier = new StringifierEngine([baseHandler], options({ a: 1, b: 2 }));

        const stringifyBase = createStringifier(baseStringifier);

        const expectedStringResult = "stringified-string";
        const extendedHandler = { appliesTo: isString, stringify: () => expectedStringResult };

        const stringifyExtended = stringifyBase.createExtendedStringifier({ b: 3, c: 4 }, builder =>
            builder.stringifyIf(extendedHandler.appliesTo, extendedHandler.stringify)
        );

        assert.strictEqual(stringifyExtended(123), expectedNumberResult);
        assert.strictEqual(stringifyExtended("a"), expectedStringResult);
        assert.deepStrictEqual(((stringifyExtended as any).engine).defaultOptions, options({ a: 1, b: 3, c: 4 }));
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifier.inline()
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifier.inline() uses breakLines = true", () => {

        const baseStringifier = new StringifierEngine(
            [{ appliesTo: isNumber, stringify: (_value, context) => `${context.options.breakLines}` }],
            options({ breakLines: "auto" })
        );
        const stringify = createStringifier(baseStringifier);

        assert.strictEqual(stringify(1), "auto");
        assert.strictEqual(stringify.inline(1), "false");
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifier.format()
    //------------------------------------------------------------------------------------------------------------------

    testCase(`stringify.format("isNumber($1)", { a: 1 }) === 'isNumber({"a":1})'`, () => {
        const stringify = createStringifier(new StringifierEngine([], options()));
        assert.strictEqual(stringify.format("isNumber($1)", { a: 1 }), 'isNumber({"a":1})');
    });

    testCase(`stringify.format("$$$1, $3, $*", true, 0, undefined, "test") === '$true, undefined, 0, "test"'`, () => {
        const stringify = createStringifier(new StringifierEngine([], options()));
        assert.strictEqual(stringify.format("$$$1, $3, $*", true, 0, null, "test"), '$true, null, 0, "test"');
    });

    //------------------------------------------------------------------------------------------------------------------
    // Option typings
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates an object that passes the correct option types when extending", () => {

        const stringifier = createStringifier(new StringifierEngine([], options({ a: 1 })));

        stringifier.createExtendedStringifier(builder => {
            builder.stringifyBoolean((_value, context) => {
                // @ts-expect-error
                context.options.doesNotExit;
                return `${context.options.a}`;
            })
        });

        stringifier.createExtendedStringifier({ b: 2 }, builder => {
            builder.stringifyBoolean((_value, context) => {
                // @ts-expect-error
                context.options.doesNotExit;
                return `${context.options.a} ${context.options.b}`;
            })
        });
    });
});
