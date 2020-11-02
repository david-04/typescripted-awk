testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class TestAssertions<R> extends internal.TestAssertions<any, R> {

        public constructor(private readonly action: internal.Supplier<R>) {
            super();
        }

        public with(..._parameters: any): this {
            return this;
        }

        protected validateResult(_description: string, validate: internal.Consumer<R>): this {
            validate(this.action());
            return this;
        }

        protected validateException(_description: string, validate: internal.Consumer<any>): this {
            let error;
            try {
                this.action();
            } catch (exception) {
                error = { exception };
            }
            if (error) {
                validate(error.exception);
            } else {
                assert.fail("No exception was thrown");
            }
            return this;
        }
    }

    function test<R>(
        description: string,
        action: internal.Supplier<R>,
        assertion: internal.Consumer<internal.TestAssertions<any, R>>,
        shouldSucceed: boolean
    ) {

        testCase(description, () => {
            let error;
            try {
                assertion(new TestAssertions(action));
            } catch (exception) {
                error = { exception };
            }
            if (shouldSucceed && error) {
                throw error.exception;
            } else if (!shouldSucceed && !error) {
                throw new Error("No exception was raised");
            }
        });
    }

    function testResult<R>(
        result: R,
        assert: internal.Consumer<internal.TestAssertions<any, R>>,
        shouldSucceed: boolean
    ) {
        const expectedResult = preStringify("").as(shouldSucceed ? "succeeds" : "fails");
        const description = stringify.inline.format("$1.[$2] $3", result, assert, expectedResult);
        test(description, () => result, assert, shouldSucceed)
    }

    function testException(
        exception: any,
        assert: internal.Consumer<internal.TestAssertionsVoid<any>>,
        shouldSucceed: boolean
    ) {
        const expectedResult = preStringify("").as(shouldSucceed ? "succeeds" : "fails");
        const description = stringify.inline.format(
            "$1 $2 for () => { throw new $3 }", assert, expectedResult, exception
        );
        test(description, () => { throw exception }, assert, shouldSucceed);
    }

    class MyError<T> extends Error {
        constructor(message?: string, public readonly code?: T) {
            super(message);
        }
    }

    class MyClass<T> {
        constructor(public readonly a?: T) { }
    }

    const fails = false;
    const succeeds = true;

    //------------------------------------------------------------------------------------------------------------------
    // exceptionIs()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("throws()", () => {

        testException(new Error("oops"), validator => validator.exceptionIs(new Error("oops")), succeeds);
        testException(new Error("404"), validator => validator.exceptionIs(new Error("500")), fails);
        testException(new MyError("oops"), validator => validator.exceptionIs(new Error("oops")), fails);
        testException(new MyError("x", { a: 1 }), validator => validator.exceptionIs(new MyError("x", { a: 2 })), fails);
        testException(new MyError("x", { a: 1 }), validator => validator.exceptionIs(new MyError("x", { a: 1 })), succeeds);

        testException(
            new Error("oops"),
            validator => validator.exceptionIs(preStringify(new Error("oops")).as('new Error("...")')),
            succeeds
        );

        testException(
            new Error("oops"),
            validator => validator.exceptionIs(preStringify(new Error("...")).as('new Error("oops")')),
            fails
        );
    });

    //------------------------------------------------------------------------------------------------------------------
    // resultIs()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("resultIs()", () => {

        testResult("abc", validator => validator.resultIs("abc"), succeeds);
        testResult("abc", validator => validator.resultIs("123"), fails);
        testResult({ a: 1, b: { c: [2] } }, validator => validator.resultIs({ a: 1, b: { c: [2] } }), succeeds);
        testResult({ a: 1, b: { c: [2] } }, validator => validator.resultIs({ a: 1, b: { c: [999] } }), fails);
        testResult(new MyClass("abc"), validator => validator.resultIs(new MyClass("abc")), succeeds);
        testResult(new MyClass("abc"), validator => validator.resultIs(new MyClass("123")), fails);

        testResult(
            new MyClass("abc"),
            validator => validator.resultIs(preStringify(new MyClass("abc")).as('new MyClass("..."')),
            succeeds
        );

        testResult(
            new MyClass("abc"),
            validator => validator.resultIs(preStringify(new MyClass("...")).as('new MyClass("abc"')),
            fails
        );
    });
});
