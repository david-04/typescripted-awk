testGroupForFile("__FILE__", "createStringifier()", () => {

    //------------------------------------------------------------------------------------------------------------------
    // stringify()
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates an object that can be called as a function", () => {

        const expectedResult = "stringified-number";
        const stringifierEngine = new StringifierEngine([{ appliesTo: isNumber, stringify: () => expectedResult }], {});

        const stringify = createStringifier(stringifierEngine);

        nodeModules.assert.strictEqual(stringify(1), expectedResult);
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringify.createExtendedStringifier(callback)
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates an object that can be extended with handlers", () => {

        const expectedNumberResult = "stringified-number";
        const baseHandler = { appliesTo: isNumber, stringify: () => expectedNumberResult };
        const baseStringifier = new StringifierEngine([baseHandler], {});

        const stringifyBase = createStringifier(baseStringifier);

        const expectedStringResult = "stringified-string";
        const extendedHandler = { appliesTo: isString, stringify: () => expectedStringResult };

        const stringifyExtended = stringifyBase.createExtendedStringifier(builder =>
            builder.stringifyIf(extendedHandler.appliesTo, extendedHandler.stringify)
        );

        nodeModules.assert.strictEqual(stringifyExtended(123), expectedNumberResult);
        nodeModules.assert.strictEqual(stringifyExtended("a"), expectedStringResult);
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringify.createExtendedStringifier(options, callback)
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates an object that can be extended with options and and handlers", () => {

        const expectedNumberResult = "stringified-number";
        const baseHandler = { appliesTo: isNumber, stringify: () => expectedNumberResult };
        const baseStringifier = new StringifierEngine([baseHandler], { a: 1, b: 2 });

        const stringifyBase = createStringifier(baseStringifier);

        const expectedStringResult = "stringified-string";
        const extendedHandler = { appliesTo: isString, stringify: () => expectedStringResult };

        const stringifyExtended = stringifyBase.createExtendedStringifier({ b: 3, c: 4 }, builder =>
            builder.stringifyIf(extendedHandler.appliesTo, extendedHandler.stringify)
        );

        nodeModules.assert.strictEqual(stringifyExtended(123), expectedNumberResult);
        nodeModules.assert.strictEqual(stringifyExtended("a"), expectedStringResult);
        nodeModules.assert.deepStrictEqual(
            ((stringifyExtended as any).engine as StringifierEngine<any, any>).defaultOptions,
            { a: 1, b: 3, c: 4 }
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // Option typings
    //------------------------------------------------------------------------------------------------------------------

    testCase("Creates an object that passes the correct option types when extending", () => {

        const stringifier = createStringifier(new StringifierEngine([], { a: 1 }));

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
