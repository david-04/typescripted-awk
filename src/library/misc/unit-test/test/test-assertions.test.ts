testGroupForFile(getCurrentFilename("__FILE__"), () => {

    //------------------------------------------------------------------------------------------------------------------
    // Setup
    //------------------------------------------------------------------------------------------------------------------

    class TestAssertionsWrapper<R> extends TestAssertions<any, R> {

        public constructor(private readonly action: internal.Supplier<R>) {
            super();
        }

        public when(..._parameters: any): this {
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

        protected getException() {
            try {
                this.action();
            } catch (exception) {
                return exception;
            }
            return undefined;
        }
    }

    function test<R>(
        description: string,
        action: internal.Supplier<R>,
        assertion: internal.Consumer<TestAssertions<any, R>>,
        shouldSucceed: boolean
    ) {

        testCase(description, () => {
            let error;
            try {
                assertion(new TestAssertionsWrapper(action));
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

    function testResult<R>(result: R, assert: internal.Consumer<TestAssertions<any, R>>, shouldSucceed: boolean) {
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
        test(description, () => { if (undefined !== exception) throw exception }, assert, shouldSucceed);
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
    // throws()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("throws()", () => {

        testException(new Error("oops"), validator => validator.throws(new Error("oops")), succeeds);
        testException(new Error("404"), validator => validator.throws(new Error("500")), fails);
        testException(new MyError("oops"), validator => validator.throws(new Error("oops")), fails);
        testException(new MyError("x", { a: 1 }), validator => validator.throws(new MyError("x", { a: 2 })), fails);
        testException(new MyError("x", { a: 1 }), validator => validator.throws(new MyError("x", { a: 1 })), succeeds);

        testException(
            new Error("oops"),
            validator => validator.throws(preStringify(new Error("oops")).as('new Error("...")')),
            succeeds
        );

        testException(
            new Error("oops"),
            validator => validator.throws(preStringify(new Error("...")).as('new Error("oops")')),
            fails
        );

        testException(new Error("oops"), validator => validator.throws(), succeeds);

        testException(new Error("oops"), validator => validator.throws("oops"), succeeds);
        testException(new Error("oops"), validator => validator.throws("Oops"), fails);
        testException(new Error("oops"), validator => validator.throws("op"), fails);
        testException("oops", validator => validator.throws("oops"), succeeds);
        testException("oops", validator => validator.throws("Oops"), fails);
        testException("oops", validator => validator.throws("op"), fails);

        testException(new Error("oops"), validator => validator.throws(/op/), succeeds);
        testException(new Error("oops"), validator => validator.throws(/^oop/), succeeds);
        testException(new Error("oops"), validator => validator.throws(/^oop$/), fails);
        testException(new Error("oops"), validator => validator.throws(/Op/), fails);
        testException(new Error("oops"), validator => validator.throws(/Op/i), succeeds);

        testException(undefined, validator => validator.throws(), fails);
        testException(undefined, validator => validator.throws(new Error()), fails);
        testException(undefined, validator => validator.throws(""), fails);
        testException(undefined, validator => validator.throws(/.*/), fails);
    });

    //------------------------------------------------------------------------------------------------------------------
    // returns()
    //------------------------------------------------------------------------------------------------------------------

    testGroup("returns()", () => {

        testResult("abc", validator => validator.returns("abc"), succeeds);
        testResult("abc", validator => validator.returns("123"), fails);
        testResult({ a: 1, b: { c: [2] } }, validator => validator.returns({ a: 1, b: { c: [2] } }), succeeds);
        testResult({ a: 1, b: { c: [2] } }, validator => validator.returns({ a: 1, b: { c: [999] } }), fails);
        testResult(new MyClass("abc"), validator => validator.returns(new MyClass("abc")), succeeds);
        testResult(new MyClass("abc"), validator => validator.returns(new MyClass("123")), fails);

        testResult(
            new MyClass("abc"),
            validator => validator.returns(preStringify(new MyClass("abc")).as('new MyClass("..."')),
            succeeds
        );

        testResult(
            new MyClass("abc"),
            validator => validator.returns(preStringify(new MyClass("...")).as('new MyClass("abc"')),
            fails
        );
    });
});
