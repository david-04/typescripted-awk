testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class TestStringifier implements ContextualStringifier<any> {

        private validator?: internal.Function2<any, TestStringifierContext, string>;
        public wasInvoked = false;

        constructor(public readonly name: string, public readonly baseStringifier?: ContextualStringifier<any>) { }

        public onStringifyWithContext(validator: internal.Function2<any, TestStringifierContext, string>) {
            this.validator = validator;
        }

        public stringifyWithContext(value: any, context: StringifierContext<any>) {
            this.wasInvoked = true;
            if (this.validator) {
                return this.validator(value, context as TestStringifierContext);
            } else {
                throw new Error(`${this.name}.stringifyWithContext() was invoked unexpectedly`);
            }
        }

        public assertWasInvoked() {
            if (!this.wasInvoked) {
                throw new Error(`${this.name}.stringifyWithContext() was not invoked`);
            }
        }
    }

    class TestStringifierContext extends StringifierContext<any> {

        public constructor(topLevelStringifier: TestStringifier, currentStringifier: TestStringifier) {
            super({}, currentStringifier);
            this.topLevelStringifier = topLevelStringifier;
            this.indent = "______";
            this.currentHandlerIndex = 3;
        }

        public getTopLevelStringifier() {
            return this.topLevelStringifier;
        }
    }

    interface ContextState {
        readonly topLevelStringifier: ContextualStringifier<any>;
        readonly currentStringifier: ContextualStringifier<any>;
        currentHandlerIndex: number;
        readonly indent: string
    }

    function getState(context: TestStringifierContext): ContextState {
        return {
            topLevelStringifier: context.getTopLevelStringifier(),
            currentStringifier: context.currentStringifier,
            currentHandlerIndex: context.currentHandlerIndex,
            indent: context.indent
        };
    }

    function testStringificationCallback(
        stringificationAction: internal.Function2<TestStringifierContext, any, string>,
        targetStringifierSelector: internal.Function1<ContextState, ContextualStringifier<any>>,
        getExpectedCallbackState: internal.Function1<ContextState, ContextState>
    ) {

        const baseStringifier = new TestStringifier("baseStringifier");
        const currentStringifier = new TestStringifier("currentStringifier", baseStringifier);
        const topLevelStringifier = new TestStringifier("topLevelStringifier", currentStringifier);
        const context = new TestStringifierContext(topLevelStringifier, currentStringifier);
        const initialState = getState(context);
        const expectedStringifiedValue = "stringified";
        const value = "value";


        const targetStringifier = targetStringifierSelector(initialState) as TestStringifier;

        targetStringifier.onStringifyWithContext((currentValue, currentContext) => {
            assert.strictEqual(currentValue, value);
            assert.deepStrictEqual(getState(currentContext), getExpectedCallbackState(initialState));
            return expectedStringifiedValue;
        });

        const actualStringifiedValue = stringificationAction(context, value);

        assert.strictEqual(actualStringifiedValue, expectedStringifiedValue);
        assert.deepStrictEqual(getState(context), initialState);
        targetStringifier.assertWasInvoked();

    }

    const additionalIndent = "     ";

    //------------------------------------------------------------------------------------------------------------------
    // stringifyWithTopLevelStringifier()
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifyWithTopLevelStringifier() invokes the top-level stringifier", () => {

        testStringificationCallback(
            (context, value) => context.stringifyWithTopLevelStringifier(value, additionalIndent),
            initialState => initialState.topLevelStringifier,
            initialState => ({
                topLevelStringifier: initialState.topLevelStringifier,
                currentStringifier: initialState.topLevelStringifier,
                currentHandlerIndex: 0,
                indent: initialState.indent + additionalIndent
            })
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifyWithNextHandler()
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifyWithNextHandler() invokes the current stringifier next handler", () => {

        testStringificationCallback(
            (context, value) => context.stringifyWithNextHandler(value, additionalIndent),
            initialState => initialState.currentStringifier,
            initialState => ({
                topLevelStringifier: initialState.topLevelStringifier,
                currentStringifier: initialState.currentStringifier,
                currentHandlerIndex: initialState.currentHandlerIndex + 1,
                indent: initialState.indent + additionalIndent
            })
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifyWithCurrentStringifier()
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifyWithCurrentStringifier() invokes the current stringifier first handler", () => {

        testStringificationCallback(
            (context, value) => context.stringifyWithCurrentStringifier(value, additionalIndent),
            initialState => initialState.currentStringifier,
            initialState => ({
                topLevelStringifier: initialState.topLevelStringifier,
                currentStringifier: initialState.currentStringifier,
                currentHandlerIndex: 0,
                indent: initialState.indent + additionalIndent
            })
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // stringifyWithCurrentStringifier()
    //------------------------------------------------------------------------------------------------------------------

    testCase("stringifyWithCurrentStringifier() invokes the base stringifier", () => {

        testStringificationCallback(
            (context, value) => context.stringifyWithBaseStringifier(value, additionalIndent),
            initialState => initialState.currentStringifier.baseStringifier!,
            initialState => ({
                topLevelStringifier: initialState.topLevelStringifier,
                currentStringifier: initialState.currentStringifier.baseStringifier!,
                currentHandlerIndex: 0,
                indent: initialState.indent + additionalIndent
            })
        );
    });
});
